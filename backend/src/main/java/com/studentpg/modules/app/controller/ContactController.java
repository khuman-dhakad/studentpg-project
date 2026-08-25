package com.studentpg.modules.app.controller;

import com.studentpg.common.response.MessageResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.HtmlUtils;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;

import org.springframework.data.mongodb.core.MongoTemplate;
import com.studentpg.infrastructure.cloudinary.CloudinaryService;
import com.studentpg.modules.pg.entity.PGImage;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ContactController {

    private static final int MAX_PER_DAY = 5;
    private static final long CAPTCHA_TTL_SECONDS = 5 * 60; // 5 minutes

    // Caffeine-backed per-IP counters with expiry to avoid memory leaks and support single-instance safety
    private final Cache<String, AtomicInteger> rateCache = Caffeine.newBuilder()
            .expireAfterWrite(25, TimeUnit.HOURS)
            .maximumSize(200_000)
            .build();

    private final MongoTemplate mongoTemplate;
    private final CloudinaryService cloudinaryService;

    @Value("${app.captcha.secret:}")
    private String captchaSecret;

    public ContactController(
            @org.springframework.beans.factory.annotation.Autowired(required = false) MongoTemplate mongoTemplate,
            @org.springframework.beans.factory.annotation.Autowired(required = false) CloudinaryService cloudinaryService
    ) {
        this.mongoTemplate = mongoTemplate;
        this.cloudinaryService = cloudinaryService;
    }

    @GetMapping("/public/captcha")
    public ResponseEntity<Object> getCaptcha() {
        if (captchaSecret == null || captchaSecret.isBlank()) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(new MessageResponse(false, "Captcha service unavailable (server not configured)."));
        }

        int a = (int) (Math.random() * 9) + 1;
        int b = (int) (Math.random() * 9) + 1;
        String question = a + " + " + b + " = ?";
        long expiresAt = Instant.now().getEpochSecond() + CAPTCHA_TTL_SECONDS;
        String payload = question + "|" + expiresAt;
        String signature = hmacSha256Hex(payload, captchaSecret);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString((payload + "|" + signature).getBytes(StandardCharsets.UTF_8));

        return ResponseEntity.ok(new Object() {
            public final String question_ = question;
            public final String token_ = token;
            public final long expiresAt_ = expiresAt;
        });
    }

    @PostMapping("/contact")
    public ResponseEntity<MessageResponse> contact(@RequestBody ContactRequest req, HttpServletRequest request) {
        String ip = clientIp(request);

        if (!verifyCaptchaToken(req.getCaptchaToken(), req.getCaptchaAnswer())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(false, "Captcha validation failed."));
        }

        if (!allowRequest(ip)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(new MessageResponse(false, "Rate limit exceeded. Please try again later."));
        }

        // sanitize inputs
        String name = HtmlUtils.htmlEscape(req.getName().trim());
        String email = HtmlUtils.htmlEscape(req.getEmail().trim());
        String subject = HtmlUtils.htmlEscape(req.getSubject().trim());
        String message = HtmlUtils.htmlEscape(req.getMessage().trim());

        if (mongoTemplate != null) {
            org.bson.Document doc = new org.bson.Document()
                    .append("name", name)
                    .append("email", email)
                    .append("subject", subject)
                    .append("message", message)
                    .append("clientIp", ip)
                    .append("createdAt", Instant.now().toString());
            mongoTemplate.save(doc, "contact_messages");
        }

        return ResponseEntity.ok(new MessageResponse(true, "Your message has been received."));
    }

    @PostMapping("/report-issue")
    public ResponseEntity<MessageResponse> reportIssue(@ModelAttribute ReportIssueRequest req, HttpServletRequest request) {
        String ip = clientIp(request);

        if (!verifyCaptchaToken(req.getCaptchaToken(), req.getCaptchaAnswer())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(false, "Captcha validation failed."));
        }

        if (!allowRequest(ip)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(new MessageResponse(false, "Rate limit exceeded. Please try again later."));
        }

        List<String> uploadedImageUrls = new ArrayList<>();
        // Validate files
        if (req.getImages() != null) {
            for (MultipartFile img : req.getImages()) {
                if (img == null || img.isEmpty()) continue;
                String ct = img.getContentType();
                if (ct == null || !ct.toLowerCase().startsWith("image/")) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(false, "Only image uploads are allowed."));
                }
                if (img.getSize() > 5L * 1024 * 1024) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(false, "Each image must be smaller than 5MB."));
                }
                try {
                    if (cloudinaryService != null) {
                        PGImage uploaded = cloudinaryService.uploadImage(img);
                        if (uploaded != null && uploaded.getUrl() != null) {
                            uploadedImageUrls.add(uploaded.getUrl());
                        }
                    }
                } catch (Exception ignored) {
                }
            }
        }

        // sanitize
        String title = HtmlUtils.htmlEscape(req.getTitle().trim());
        String detail = HtmlUtils.htmlEscape(req.getDetail().trim());

        if (mongoTemplate != null) {
            org.bson.Document doc = new org.bson.Document()
                    .append("title", title)
                    .append("detail", detail)
                    .append("images", uploadedImageUrls)
                    .append("clientIp", ip)
                    .append("createdAt", Instant.now().toString());
            mongoTemplate.save(doc, "issue_reports");
        }

        return ResponseEntity.ok(new MessageResponse(true, "Report received. Thank you."));
    }

    private boolean allowRequest(String ip) {
        try {
            AtomicInteger counter = rateCache.get(ip, k -> new AtomicInteger(0));
            int count = counter.incrementAndGet();
            return count <= MAX_PER_DAY;
        } catch (Exception ex) {
            return false;
        }
    }

    private boolean verifyCaptchaToken(String token, String answer) {
        if (token == null || token.isBlank() || answer == null || answer.isBlank()) return false;
        try {
            byte[] decoded = Base64.getUrlDecoder().decode(token);
            String combined = new String(decoded, StandardCharsets.UTF_8);
            String[] parts = combined.split("\\|");
            if (parts.length != 3) return false;
            String question = parts[0];
            long expiresAt = Long.parseLong(parts[1]);
            String sig = parts[2];

            long now = Instant.now().getEpochSecond();
            if (now > expiresAt) return false;

            String payload = question + "|" + expiresAt;
            String expectedSig = hmacSha256Hex(payload, captchaSecret);
            if (!expectedSig.equalsIgnoreCase(sig)) return false;

            // compute expected answer (only simple a + b supported since question created by us)
            // question format: "a + b = ?"
            String[] tokens = question.split("\\+");
            if (tokens.length < 2) return false;
            String left = tokens[0].trim();
            String rightPart = tokens[1].replaceAll("=\\s*\\?", "").trim();
            int a = Integer.parseInt(left);
            int b = Integer.parseInt(rightPart);
            int expected = a + b;

            int got = Integer.parseInt(answer.trim());
            return expected == got;
        } catch (Exception ex) {
            return false;
        }
    }

    private String clientIp(HttpServletRequest req) {
        // Prefer servlet remote addr. Forwarded headers are handled by server configuration (server.forward-headers-strategy=framework)
        String remote = req.getRemoteAddr();
        if (remote == null || remote.isBlank()) {
            String forwarded = req.getHeader("X-Forwarded-For");
            if (forwarded != null && !forwarded.isBlank()) {
                return forwarded.split(",")[0].trim();
            }
        }
        return remote;
    }

    @Data
    public static class ContactRequest {
        @NotBlank
        private String name;

        @NotBlank
        @Email
        private String email;

        @NotBlank
        @Size(min = 2, max = 140)
        private String subject;

        @NotBlank
        @Size(min = 5, max = 2000)
        private String message;

        @NotBlank
        private String captchaToken;

        @NotBlank
        private String captchaAnswer;
    }

    @Data
    public static class ReportIssueRequest {
        @NotBlank
        private String title;

        @NotBlank
        private String detail;

        private MultipartFile[] images;

        @NotBlank
        private String captchaToken;

        @NotBlank
        private String captchaAnswer;
    }

    private static String hmacSha256Hex(String data, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec keySpec = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(keySpec);
            byte[] raw = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : raw) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception ex) {
            return "";
        }
    }

}
