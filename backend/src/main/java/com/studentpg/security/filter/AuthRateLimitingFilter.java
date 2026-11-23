package com.studentpg.security.filter;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * In-memory rate limiting filter for authentication and account security endpoints
 * utilizing the existing project Caffeine cache dependency.
 */
@Component
public class AuthRateLimitingFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(AuthRateLimitingFilter.class);

    private static final Set<String> RATE_LIMITED_PATHS = Set.of(
            "/api/auth/login",
            "/api/owners/register",
            "/api/owners/verify-registration",
            "/api/owners/resend-registration-otp",
            "/api/owners/forgot-password",
            "/api/owners/send-otp",
            "/api/owners/request-otp",
            "/api/owners/reset-password"
    );

    private final int maxRequests;
    private final long windowMillis;
    private final List<String> trustedProxies;
    private final Cache<String, RequestBucket> cache;

    public AuthRateLimitingFilter(
            @Value("${app.rate-limit.auth.max-requests:10}") int maxRequests,
            @Value("${app.rate-limit.auth.window-seconds:60}") long windowSeconds,
            @Value("${app.rate-limit.trusted-proxies:127.0.0.1,::1,0:0:0:0:0:0:0:1}") String trustedProxiesConfig
    ) {
        this.maxRequests = maxRequests;
        this.windowMillis = windowSeconds * 1000L;
        this.trustedProxies = Arrays.stream(trustedProxiesConfig.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .toList();
        this.cache = Caffeine.newBuilder()
                .expireAfterWrite(Duration.ofSeconds(Math.max(120, windowSeconds * 2)))
                .maximumSize(50_000)
                .build();
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();

        if ("POST".equalsIgnoreCase(method) && RATE_LIMITED_PATHS.contains(path)) {
            String clientIp = resolveClientIp(request);
            String bucketKey = path + ":" + clientIp;

            long now = System.currentTimeMillis();
            RequestBucket bucket = cache.asMap().compute(bucketKey, (k, existing) -> {
                if (existing == null || now > existing.windowExpiresAt) {
                    return new RequestBucket(1, now + windowMillis);
                }
                existing.count.incrementAndGet();
                return existing;
            });

            if (bucket != null && bucket.count.get() > maxRequests) {
                long retryAfterSeconds = Math.max(1, (bucket.windowExpiresAt - now + 999) / 1000);
                logger.warn("Rate limit exceeded on {} from IP {} (count: {}). Retrying after {}s",
                        path, clientIp, bucket.count.get(), retryAfterSeconds);

                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setHeader("Retry-After", String.valueOf(retryAfterSeconds));
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                response.setCharacterEncoding("UTF-8");
                response.getWriter().write("{\"success\":false,\"status\":429,\"message\":\"Too many requests. Please try again later.\"}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Resolves client IP address safely:
     * Reads X-Forwarded-For ONLY when the direct peer address is an identified trusted proxy.
     */
    public String resolveClientIp(HttpServletRequest request) {
        String remoteAddr = request.getRemoteAddr();
        if (remoteAddr == null || remoteAddr.isBlank()) {
            return "unknown";
        }

        if (isTrustedProxy(remoteAddr)) {
            String xForwardedFor = request.getHeader("X-Forwarded-For");
            if (xForwardedFor != null && !xForwardedFor.isBlank()) {
                String firstIp = xForwardedFor.split(",")[0].trim();
                if (!firstIp.isBlank()) {
                    return firstIp;
                }
            }
        }

        return remoteAddr;
    }

    public boolean isTrustedProxy(String remoteAddr) {
        if (remoteAddr == null || remoteAddr.isBlank()) {
            return false;
        }
        String clean = remoteAddr.trim();
        if (clean.equals("127.0.0.1") || clean.equals("::1") || clean.equals("0:0:0:0:0:0:0:1") || clean.equalsIgnoreCase("localhost")) {
            return true;
        }
        for (String trusted : trustedProxies) {
            if (clean.equalsIgnoreCase(trusted)) {
                return true;
            }
        }
        return false;
    }

    public void clearCache() {
        cache.invalidateAll();
    }

    private static class RequestBucket {
        final AtomicInteger count;
        final long windowExpiresAt;

        RequestBucket(int initialCount, long windowExpiresAt) {
            this.count = new AtomicInteger(initialCount);
            this.windowExpiresAt = windowExpiresAt;
        }
    }
}
