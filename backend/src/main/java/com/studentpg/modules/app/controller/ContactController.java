package com.studentpg.modules.app.controller;

import com.studentpg.common.response.MessageResponse;
import com.studentpg.infrastructure.cloudinary.CloudinaryService;
import com.studentpg.modules.pg.entity.PGImage;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataAccessException;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.HtmlUtils;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import jakarta.annotation.PostConstruct;

@RestController
@RequestMapping("/api")
public class ContactController {

    private static final Logger logger = LoggerFactory.getLogger(ContactController.class);
    private static final long CAPTCHA_TTL_SECONDS = 5 * 60L;
    private static final long MONGO_TTL_SECONDS = CAPTCHA_TTL_SECONDS;
    private static final int RATE_LIMIT_WINDOW_SECONDS = 10 * 60;
    private static final int MAX_REQUESTS_PER_WINDOW = 20;
    private static final String CAPTCHA_COLLECTION = "captcha_tokens";
    private static final String RATE_LIMIT_COLLECTION = "request_rate_limits";

    private final MongoTemplate mongoTemplate;
    private final CloudinaryService cloudinaryService;
    private final com.studentpg.infrastructure.email.EmailService emailService;

    @Value("${app.captcha.secret:}")
    private String captchaSecret;

    @Value("${mail.from:studentpg.support@gmail.com}")
    private String supportEmail;

    public ContactController(
            @org.springframework.beans.factory.annotation.Autowired(required = false) MongoTemplate mongoTemplate,
            @org.springframework.beans.factory.annotation.Autowired(required = false) CloudinaryService cloudinaryService,
            @org.springframework.beans.factory.annotation.Autowired(required = false) com.studentpg.infrastructure.email.EmailService emailService
    ) {
        this.mongoTemplate = mongoTemplate;
        this.cloudinaryService = cloudinaryService;
        this.emailService = emailService;
    }

    @PostConstruct
    public void initializeTTLIndexes() {
        if (mongoTemplate == null) {
            return;
        }

        try {
            // TTL index for CAPTCHA tokens: align with the challenge validity window.
            mongoTemplate.getCollection(CAPTCHA_COLLECTION)
                    .createIndex(new Document("createdAt", 1)
                            .append("expireAfterSeconds", MONGO_TTL_SECONDS));
            logger.info("TTL index created on {} collection ({}s expiry)", CAPTCHA_COLLECTION, MONGO_TTL_SECONDS);
        } catch (Exception ex) {
            logger.warn("Failed to create TTL index on {} collection. Collection may already have it. Error: {}", CAPTCHA_COLLECTION, ex.getMessage());
        }

        try {
            // TTL index for rate-limit records: auto-delete after 1 hour (3600 seconds)
            // Each bucket covers a RATE_LIMIT_WINDOW_SECONDS window (600s), so 1 hour = 6 windows
            // Old windows are safely deleted without affecting current rate limiting
            mongoTemplate.getCollection(RATE_LIMIT_COLLECTION)
                    .createIndex(new Document("createdAt", 1)
                            .append("expireAfterSeconds", 3600L));
            logger.info("TTL index created on {} collection (1 hour expiry)", RATE_LIMIT_COLLECTION);
        } catch (Exception ex) {
            logger.warn("Failed to create TTL index on {} collection. Collection may already have it. Error: {}", RATE_LIMIT_COLLECTION, ex.getMessage());
        }
    }

    @GetMapping("/public/captcha")
    public ResponseEntity<Object> getCaptcha() {
        if (captchaSecret == null || captchaSecret.isBlank()) {
            logger.warn("Captcha challenge requested but CAPTCHA secret is not configured");
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(new MessageResponse(false, "Captcha service unavailable (server not configured)."));
        }

        int a = 1 + (int) (Math.random() * 9);
        int b = 1 + (int) (Math.random() * 9);
        String question = a + " + " + b + " = ?";
        int answer = a + b;
        long expiresAt = Instant.now().plusSeconds(CAPTCHA_TTL_SECONDS).getEpochSecond();
        String nonce = UUID.randomUUID().toString();
        String payload = question + "|" + expiresAt + "|" + nonce;
        String signature = hmacSha256Hex(payload, captchaSecret);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString((payload + "|" + signature).getBytes(StandardCharsets.UTF_8));

        if (mongoTemplate != null) {
            Document captchaDoc = new Document()
                    .append("token", token)
                    .append("question", question)
                    .append("answer", answer)
                    .append("expiresAt", expiresAt)
                    .append("used", false)
                    .append("createdAt", Date.from(Instant.now()))
                    .append("nonce", nonce);
            mongoTemplate.save(captchaDoc, CAPTCHA_COLLECTION);
        }

        return ResponseEntity.ok(Map.of(
                "question", question,
                "token", token,
                "expiresAt", expiresAt
        ));
    }

    @PostMapping("/contact")
    public ResponseEntity<MessageResponse> contact(@Valid @RequestBody ContactRequest req, HttpServletRequest request) {
        String ip = clientIp(request);

        if (hasHoneypot(req.getWebsite())) {
            logger.warn("Rejected contact form submission with honeypot trigger from IP {}", ip);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(false, "Invalid request."));
        }

        if (!verifyCaptchaToken(req.getCaptchaToken(), req.getCaptchaAnswer(), ip)) {
            logger.warn("Rejected contact form captcha for IP {}", ip);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(false, "Captcha validation failed."));
        }

        if (!allowRequest(ip, "/api/contact")) {
            logger.warn("Rate limit hit for contact form from IP {}", ip);
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .header("Retry-After", String.valueOf(RATE_LIMIT_WINDOW_SECONDS))
                    .body(new MessageResponse(false, "Too many requests. Please try again later."));
        }

        String name = sanitizeText(req.getName(), 100);
        String email = sanitizeText(req.getEmail(), 255);
        String subject = sanitizeText(req.getSubject(), 140);
        String message = sanitizeText(req.getMessage(), 2000);

        if (name.isBlank() || email.isBlank() || subject.isBlank() || message.isBlank()) {
            return ResponseEntity.badRequest().body(new MessageResponse(false, "Please provide all required information."));
        }

        if (!isValidEmail(email)) {
            return ResponseEntity.badRequest().body(new MessageResponse(false, "Please provide a valid email address."));
        }

        if (mongoTemplate != null) {
            Document doc = new Document()
                    .append("name", HtmlUtils.htmlEscape(name))
                    .append("email", HtmlUtils.htmlEscape(email))
                    .append("subject", HtmlUtils.htmlEscape(subject))
                    .append("message", HtmlUtils.htmlEscape(message))
                    .append("clientIp", ip)
                    .append("createdAt", Date.from(Instant.now()));
            mongoTemplate.save(doc, "contact_messages");
        }

        try {
            String supportTo = (supportEmail != null && !supportEmail.isBlank()) ? supportEmail : "studentpg.support@gmail.com";
            String textBody = "Name: " + name + "\nEmail: " + email + "\nSubject: " + subject + "\n\nMessage:\n" + message + "\n\nIP: " + ip;
            String htmlBody = "<p><strong>Name:</strong> " + HtmlUtils.htmlEscape(name) + "</p>"
                    + "<p><strong>Email:</strong> " + HtmlUtils.htmlEscape(email) + "</p>"
                    + "<p><strong>Subject:</strong> " + HtmlUtils.htmlEscape(subject) + "</p>"
                    + "<p><strong>IP:</strong> " + HtmlUtils.htmlEscape(ip) + "</p>"
                    + "<p><strong>Message:</strong></p><p>" + HtmlUtils.htmlEscape(message).replace("\n", "<br>") + "</p>";
            if (emailService != null) {
                emailService.sendSupportEmail(supportTo, "New Contact Message: " + subject, textBody, htmlBody);
            } else {
                throw new IllegalStateException("Email service is not configured");
            }
        } catch (Exception ex) {
            logger.error("Contact form email notification failed for IP {}. Message was saved but email was not delivered. Error: {}", ip, ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(new MessageResponse(false, "Message saved, but email delivery failed. Please try again later."));
        }

        return ResponseEntity.ok(new MessageResponse(true, "Your message has been received."));
    }

    @PostMapping("/report-issue")
    public ResponseEntity<MessageResponse> reportIssue(@Valid @ModelAttribute ReportIssueRequest req, HttpServletRequest request) {
        String ip = clientIp(request);

        if (hasHoneypot(req.getWebsite())) {
            logger.warn("Rejected issue report submission with honeypot trigger from IP {}", ip);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(false, "Invalid request."));
        }

        if (!verifyCaptchaToken(req.getCaptchaToken(), req.getCaptchaAnswer(), ip)) {
            logger.warn("Rejected issue report captcha for IP {}", ip);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(false, "Captcha validation failed."));
        }

        if (!allowRequest(ip, "/api/report-issue")) {
            logger.warn("Rate limit hit for issue report from IP {}", ip);
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .header("Retry-After", String.valueOf(RATE_LIMIT_WINDOW_SECONDS))
                    .body(new MessageResponse(false, "Too many requests. Please try again later."));
        }

        List<String> uploadedImageUrls = new ArrayList<>();
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
                } catch (Exception ex) {
                    logger.warn("Issue image upload failed for IP {}. Error: {}", ip, ex.getMessage());
                }
            }
        }

        String title = sanitizeText(req.getTitle(), 140);
        String detail = sanitizeText(req.getDetail(), 5000);
        if (title.isBlank() || detail.isBlank()) {
            return ResponseEntity.badRequest().body(new MessageResponse(false, "Please complete the required issue details."));
        }

        if (mongoTemplate != null) {
            Document doc = new Document()
                    .append("title", HtmlUtils.htmlEscape(title))
                    .append("detail", HtmlUtils.htmlEscape(detail))
                    .append("images", uploadedImageUrls)
                    .append("clientIp", ip)
                    .append("createdAt", Date.from(Instant.now()));
            mongoTemplate.save(doc, "issue_reports");
        }

        try {
            String supportTo = (supportEmail != null && !supportEmail.isBlank()) ? supportEmail : "studentpg.support@gmail.com";
            String textBody = "Issue Report\nTitle: " + title + "\nIP: " + ip + "\n\nDetails:\n" + detail + "\n\nImages: " + uploadedImageUrls.size();
            String htmlBody = "<p><strong>Issue Report</strong></p>"
                    + "<p><strong>Title:</strong> " + HtmlUtils.htmlEscape(title) + "</p>"
                    + "<p><strong>IP:</strong> " + HtmlUtils.htmlEscape(ip) + "</p>"
                    + "<p><strong>Details:</strong></p><p>" + HtmlUtils.htmlEscape(detail).replace("\n", "<br>") + "</p>"
                    + "<p><strong>Images:</strong> " + uploadedImageUrls.size() + "</p>";
            if (emailService != null) {
                emailService.sendSupportEmail(supportTo, "New Issue Report: " + title, textBody, htmlBody);
            }
        } catch (Exception ex) {
            logger.warn("Issue report email notification failed for IP {}. Report saved successfully but email not delivered. Error: {}", ip, ex.getMessage());
        }

        return ResponseEntity.ok(new MessageResponse(true, "Report received. Thank you."));
    }

    private boolean allowRequest(String ip, String endpoint) {
        if (ip == null || ip.isBlank()) {
            return false;
        }

        try {
            if (mongoTemplate == null) {
                return true;
            }

            String bucketKey = endpoint + ":" + ip + ":" + (Instant.now().getEpochSecond() / RATE_LIMIT_WINDOW_SECONDS);
            Query query = new Query(Criteria.where("key").is(bucketKey));

            // ATOMIC: Upsert with increment in a single operation (no race condition)
            Update update = new Update()
                    .inc("count", 1)
                    .set("updatedAt", Date.from(Instant.now()))
                    .setOnInsert("createdAt", Date.from(Instant.now()));

            Document result = mongoTemplate.findAndModify(
                    query,
                    update,
                    new FindAndModifyOptions().upsert(true).returnNew(true),
                    Document.class,
                    RATE_LIMIT_COLLECTION
            );

            if (result == null) {
                return false;
            }

            int count = result.getInteger("count", 0);
            return count <= MAX_REQUESTS_PER_WINDOW;
        } catch (DataAccessException | IllegalArgumentException ex) {
            logger.warn("Rate limit storage failed for {} {}. Error: {}", endpoint, ip, ex.getMessage());
            return false;
        }
    }

    private boolean verifyCaptchaToken(String token, String answer, String ip) {
        if (captchaSecret == null || captchaSecret.isBlank()) {
            return false;
        }

        if (token == null || token.isBlank() || answer == null || answer.isBlank()) {
            return false;
        }

        try {
            byte[] decoded = Base64.getUrlDecoder().decode(token);
            String combined = new String(decoded, StandardCharsets.UTF_8);
            String[] parts = combined.split("\\|");
            if (parts.length != 4) {
                return false;
            }

            String question = parts[0];
            long expiresAt = Long.parseLong(parts[1]);
            String nonce = parts[2];
            String signature = parts[3];
            long now = Instant.now().getEpochSecond();

            if (now > expiresAt) {
                logger.warn("Expired captcha token for IP {}", ip);
                return false;
            }

            String payload = question + "|" + expiresAt + "|" + nonce;
            String expectedSignature = hmacSha256Hex(payload, captchaSecret);
            if (!expectedSignature.equalsIgnoreCase(signature)) {
                logger.warn("Invalid captcha signature for IP {}", ip);
                return false;
            }

            if (mongoTemplate == null) {
                return false;
            }

            // ATOMIC: Mark as used and retrieve in single operation (prevents replay)
            Query recordQuery = new Query(Criteria.where("token").is(token).and("used").is(false));
            Update markUsed = new Update()
                    .set("used", true)
                    .set("usedAt", Date.from(Instant.now()));

            Document existing = mongoTemplate.findAndModify(
                    recordQuery,
                    markUsed,
                    new FindAndModifyOptions().returnNew(false),
                    Document.class,
                    CAPTCHA_COLLECTION
            );

            if (existing == null) {
                logger.warn("Captcha token not found or already used for IP {}", ip);
                return false;
            }

            int expectedAnswer = existing.getInteger("answer", -1);
            int userAnswer;
            try {
                userAnswer = Integer.parseInt(answer.trim());
            } catch (NumberFormatException ex) {
                logger.warn("Invalid captcha answer format for IP {}", ip);
                return false;
            }

            boolean matches = expectedAnswer == userAnswer;
            if (!matches) {
                logger.warn("Incorrect captcha answer for IP {}", ip);
            }
            return matches;
        } catch (Exception ex) {
            logger.warn("Captcha verification failed for IP {}. Error: {}", ip, ex.getMessage());
            return false;
        }
    }

    private String sanitizeText(String value, int maxLength) {
        if (value == null) {
            return "";
        }
        String cleaned = value.replaceAll("[\\p{Cntrl}&&[^\\r\\n\\t]]", "");
        cleaned = cleaned.replaceAll("\\s+", " ").trim();
        if (cleaned.length() > maxLength) {
            return cleaned.substring(0, maxLength);
        }
        return cleaned;
    }

    private boolean hasHoneypot(String value) {
        return value != null && !value.isBlank();
    }

    private boolean isValidEmail(String email) {
        return email != null && email.matches("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    }

    private String clientIp(HttpServletRequest req) {
        // SECURITY FIX: Use ONLY Spring's processed remote address
        // Spring Security's forward-headers-strategy=framework validates X-Forwarded-* headers
        // from trusted proxies ONLY, preventing IP spoofing via direct header injection.
        // Do NOT trust raw X-Forwarded-For or X-Real-IP headers without Spring validation.
        String remoteAddr = req.getRemoteAddr();
        return (remoteAddr == null || remoteAddr.isBlank()) ? "unknown" : remoteAddr;
    }

    @ExceptionHandler({MethodArgumentNotValidException.class, HttpMessageNotReadableException.class})
    public ResponseEntity<MessageResponse> handleBadRequest(Exception ex) {
        logger.warn("Malformed anonymous form request blocked: {}", ex.getMessage());
        return ResponseEntity.badRequest().body(new MessageResponse(false, "Invalid request payload."));
    }

    private String hmacSha256Hex(String payload, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] raw = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(raw);
        } catch (Exception ex) {
            throw new IllegalStateException("Failed to generate CAPTCHA signature", ex);
        }
    }

    @Data
    public static class ContactRequest {
        @NotBlank
        @Size(max = 100)
        private String name;

        @NotBlank
        @Email
        @Size(max = 255)
        private String email;

        @NotBlank
        @Size(min = 2, max = 140)
        private String subject;

        @NotBlank
        @Size(min = 5, max = 2000)
        private String message;

        @Size(max = 255)
        private String website;

        @NotBlank
        private String captchaToken;

        @NotBlank
        @Size(max = 50)
        private String captchaAnswer;
    }

    @Data
    public static class ReportIssueRequest {
        @NotBlank
        @Size(max = 140)
        private String title;

        @NotBlank
        @Size(max = 5000)
        private String detail;

        private MultipartFile[] images;

        @Size(max = 255)
        private String website;

        @NotBlank
        private String captchaToken;

        @NotBlank
        @Size(max = 50)
        private String captchaAnswer;
    }
}

