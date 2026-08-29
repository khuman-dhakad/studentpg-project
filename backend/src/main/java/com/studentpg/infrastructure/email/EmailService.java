package com.studentpg.infrastructure.email;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);


    private final JavaMailSender mailSender;
    private final RestTemplate restTemplate;

    public EmailService(
            @Autowired(required = false) JavaMailSender mailSender,
            @Autowired(required = false) RestTemplate restTemplate
    ) {
        this.mailSender = mailSender;
        this.restTemplate = restTemplate;
    }
    @Value("${brevo.url}")
private String brevoUrl;

    @Value("${mail.from:studentpg.support@gmail.com}")
    private String fromEmail;

    @Value("${mail.sender.name:StudentPG}")
    private String senderName;

    @Value("${brevo.api.key:}")
    private String brevoApiKey;

    @Value("${brevo.sender.email:}")
    private String brevoSenderEmail;

    @Value("${brevo.sender.name:StudentPG}")
    private String brevoSenderName;

    public void sendOtpEmail(String toEmail, String otp) {
        validateOtpRequest(toEmail, otp);

        String normalizedEmail = toEmail.trim().toLowerCase();
        sendEmailWithFallback(normalizedEmail, otp, "StudentPG - Password Reset Code",
                "Hello,\n\nYour password reset code is: " + otp + "\n\nThis code will expire in 10 minutes.\nIf you did not request this, please ignore this email.\n\n- StudentPG Team",
                "<p>Hello,</p><p>Your password reset code is: <strong>" + otp + "</strong></p><p>This code will expire in 10 minutes.</p><p>If you did not request this, please ignore this email.</p>");
    }

    public void sendRegistrationOtpEmail(String toEmail, String otp) {
        validateOtpRequest(toEmail, otp);

        String normalizedEmail = toEmail.trim().toLowerCase();
        sendEmailWithFallback(normalizedEmail, otp, "StudentPG - Email Verification Code",
                "Hello,\n\nYour email verification code is: " + otp + "\n\nThis code will expire in 10 minutes.\nIf you did not request this, please ignore this email.\n\n- StudentPG Team",
                "<p>Hello,</p><p>Your email verification code is: <strong>" + otp + "</strong></p><p>This code will expire in 10 minutes.</p><p>If you did not request this, please ignore this email.</p>");
    }

    private void validateOtpRequest(String toEmail, String otp) {
        if (toEmail == null || toEmail.isBlank()) {
            throw new IllegalArgumentException("Recipient email is required");
        }
        if (!toEmail.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            throw new IllegalArgumentException("Invalid email address.");
        }
        if (otp == null || otp.isBlank()) {
            throw new IllegalArgumentException("OTP is required");
        }
        if (!otp.matches("\\d{6}")) {
            throw new IllegalArgumentException("OTP must contain exactly 6 digits.");
        }
    }

    private void sendEmailWithFallback(String toEmail, String otp, String subject, String textBody, String htmlBody) {
        String effectiveFrom = (fromEmail != null && !fromEmail.isBlank()) ? fromEmail : "studentpg.support@gmail.com";
        String effectiveSenderName = (senderName != null && !senderName.isBlank()) ? senderName : "StudentPG";
        String effectiveSender = (effectiveSenderName != null && !effectiveSenderName.isBlank())
                ? effectiveSenderName + " <" + effectiveFrom + ">"
                : effectiveFrom;

        if (mailSender != null) {
            try {
                sendOtpEmailViaSmtp(toEmail, otp, subject, textBody, effectiveSender);
                return;
            } catch (MailException ex) {
                logger.warn("SMTP delivery failed for OTP email to {}. Attempting Brevo API fallback. Error: {}", toEmail, ex.getMessage());
                if (brevoApiKey == null || brevoApiKey.isBlank()) {
                    throw ex;
                }
            }
        }

        if (brevoApiKey != null && !brevoApiKey.isBlank()) {
            sendOtpEmailViaBrevo(toEmail, otp, subject, htmlBody, textBody, effectiveFrom, effectiveSenderName);
            return;
        }

        throw new MailSendException("No email delivery provider is configured for OTP emails");
    }

    private void sendOtpEmailViaSmtp(String toEmail, String otp, String subject, String textBody, String effectiveSender) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(effectiveSender);
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(textBody);

        try {
            if (mailSender == null) {
                throw new IllegalStateException("Mail sender is not configured");
            }
            mailSender.send(message);
            logger.info("OTP email sent successfully to {} from {} with subject {}", toEmail, effectiveSender, subject);
        } catch (MailException ex) {
            logger.error("Failed to send OTP email to {} using sender {}. Mail error: {}", toEmail, effectiveSender, ex.getMessage(), ex);
            throw ex;
        }
    }

    private void sendOtpEmailViaBrevo(String toEmail, String otp, String subject, String htmlBody, String textBody, String effectiveFrom, String effectiveSenderName) {
        if (restTemplate == null) {
            throw new IllegalStateException("Brevo REST client is not configured");
        }

        String senderEmail = (brevoSenderEmail != null && !brevoSenderEmail.isBlank()) ? brevoSenderEmail : effectiveFrom;
        String senderName = (brevoSenderName != null && !brevoSenderName.isBlank()) ? brevoSenderName : effectiveSenderName;

        Map<String, Object> payload = Map.of(
                "sender", Map.of("name", senderName, "email", senderEmail),
                "to", List.of(Map.of("email", toEmail)),
                "subject", subject,
                "htmlContent", htmlBody,
                "textContent", textBody
        );

        HttpHeaders headers = new HttpHeaders();
        headers.set("api-key", brevoApiKey.trim());
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(
        brevoUrl,
        request,
        String.class
);
            logger.info("OTP email sent successfully via Brevo API to {} from {} with status {}", toEmail, senderEmail, response.getStatusCode());
        } catch (HttpStatusCodeException ex) {
            logger.error("Failed to send OTP email to {} via Brevo API. Status: {}, body: {}", toEmail, ex.getStatusCode(), ex.getResponseBodyAsString(), ex);
            throw ex;
        } catch (RestClientException ex) {
            logger.error("Failed to send OTP email to {} via Brevo API. Error: {}", toEmail, ex.getMessage(), ex);
            throw ex;
        }
    }
}