package com.studentpg.security.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthRateLimitingFilterTest {

    private AuthRateLimitingFilter filter;

    @BeforeEach
    void setUp() {
        // max 3 requests per 60 second window for testing
        filter = new AuthRateLimitingFilter(3, 60, "127.0.0.1,::1,10.0.0.1");
    }

    @Test
    @DisplayName("Untrusted remote address ignores X-Forwarded-For spoofing")
    void testUntrustedProxyIgnoresForwardedHeader() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRemoteAddr("198.51.100.25");
        request.addHeader("X-Forwarded-For", "203.0.113.195");

        String resolvedIp = filter.resolveClientIp(request);
        assertEquals("198.51.100.25", resolvedIp);
    }

    @Test
    @DisplayName("Trusted proxy remote address extracts first client IP from X-Forwarded-For")
    void testTrustedProxyExtractsClientIp() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRemoteAddr("127.0.0.1");
        request.addHeader("X-Forwarded-For", "203.0.113.195, 10.0.0.2");

        String resolvedIp = filter.resolveClientIp(request);
        assertEquals("203.0.113.195", resolvedIp);
    }

    @Test
    @DisplayName("Requests within limit pass through to next filter")
    void testRequestsWithinLimitPass() throws ServletException, IOException {
        FilterChain chain = mock(FilterChain.class);

        for (int i = 0; i < 3; i++) {
            MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/auth/login");
            request.setRemoteAddr("198.51.100.10");
            MockHttpServletResponse response = new MockHttpServletResponse();

            filter.doFilterInternal(request, response, chain);
            assertEquals(200, response.getStatus());
        }

        verify(chain, times(3)).doFilter(any(HttpServletRequest.class), any(HttpServletResponse.class));
    }

    @Test
    @DisplayName("Request exceeding rate limit returns 429 with Retry-After header")
    void testRequestExceedingLimitReturns429() throws ServletException, IOException {
        FilterChain chain = mock(FilterChain.class);

        for (int i = 0; i < 3; i++) {
            MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/auth/login");
            request.setRemoteAddr("198.51.100.11");
            MockHttpServletResponse response = new MockHttpServletResponse();
            filter.doFilterInternal(request, response, chain);
        }

        // 4th request must be blocked
        MockHttpServletRequest blockedRequest = new MockHttpServletRequest("POST", "/api/auth/login");
        blockedRequest.setRemoteAddr("198.51.100.11");
        MockHttpServletResponse blockedResponse = new MockHttpServletResponse();

        filter.doFilterInternal(blockedRequest, blockedResponse, chain);

        assertEquals(429, blockedResponse.getStatus());
        assertNotNull(blockedResponse.getHeader("Retry-After"));
        assertTrue(blockedResponse.getContentAsString().contains("Too many requests"));
        // filterChain was only called for the first 3 permitted requests
        verify(chain, times(3)).doFilter(any(HttpServletRequest.class), any(HttpServletResponse.class));
    }

    @Test
    @DisplayName("Non-POST requests or non-protected endpoints bypass rate limit")
    void testNonProtectedRequestsBypassRateLimit() throws ServletException, IOException {
        FilterChain chain = mock(FilterChain.class);

        for (int i = 0; i < 5; i++) {
            MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/public/pgs");
            request.setRemoteAddr("198.51.100.12");
            MockHttpServletResponse response = new MockHttpServletResponse();

            filter.doFilterInternal(request, response, chain);
            assertEquals(200, response.getStatus());
        }

        verify(chain, times(5)).doFilter(any(HttpServletRequest.class), any(HttpServletResponse.class));
    }

    @Test
    @DisplayName("Owner registration and OTP endpoints are rate limited")
    void testRegistrationEndpointsRateLimited() throws ServletException, IOException {
        FilterChain chain = mock(FilterChain.class);

        String[] endpoints = {
                "/api/owners/register",
                "/api/owners/verify-registration",
                "/api/owners/resend-registration-otp",
                "/api/owners/forgot-password",
                "/api/owners/reset-password"
        };

        for (String endpoint : endpoints) {
            filter.clearCache();
            for (int i = 0; i < 3; i++) {
                MockHttpServletRequest request = new MockHttpServletRequest("POST", endpoint);
                request.setRemoteAddr("198.51.100.50");
                MockHttpServletResponse response = new MockHttpServletResponse();
                filter.doFilterInternal(request, response, chain);
                assertEquals(200, response.getStatus());
            }

            // 4th request on this endpoint
            MockHttpServletRequest blocked = new MockHttpServletRequest("POST", endpoint);
            blocked.setRemoteAddr("198.51.100.50");
            MockHttpServletResponse blockedRes = new MockHttpServletResponse();
            filter.doFilterInternal(blocked, blockedRes, chain);
            assertEquals(429, blockedRes.getStatus(), "Expected 429 for " + endpoint);
        }
    }
}
