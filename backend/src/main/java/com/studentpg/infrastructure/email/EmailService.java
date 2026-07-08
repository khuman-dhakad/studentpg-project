package com.studentpg.infrastructure.email;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${mail.from}")
    private String fromEmail;

    public void sendOtpEmail(String toEmail, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom("studentpg.support@gmail.com");
        message.setTo(toEmail);
        message.setSubject("StudentPG - Password Reset Code");
        message.setText(
                "Hello,\n\n" +
                "Your password reset code is: " + otp + "\n\n" +
                "This code will expire in 10 minutes.\n" +
                "If you did not request this, please ignore this email.\n\n" +
                "- StudentPG Team"
        );

        try {
            mailSender.send(message);
            logger.info("OTP email sent to {}", toEmail);
        } catch (Exception ex) {
            // Log the full stack trace to see actual error
            logger.error("Failed to send OTP email to {}", toEmail, ex);
        }
    }
}