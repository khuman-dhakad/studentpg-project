package com.studentpg.infrastructure.email;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.client.RestTemplate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

class EmailServiceTest {

    @Test
    void registrationOtpEmailUsesVerificationSubject() {
        JavaMailSender mailSender = mock(JavaMailSender.class);
        EmailService emailService = new EmailService(mailSender, new RestTemplate());

        emailService.sendRegistrationOtpEmail("owner@example.com", "123456");

        ArgumentCaptor<SimpleMailMessage> captor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(captor.capture());

        assertEquals("StudentPG - Email Verification Code", captor.getValue().getSubject());
        assertEquals("Hello,\n\nYour email verification code is: 123456\n\nThis code will expire in 10 minutes.\nIf you did not request this, please ignore this email.\n\n- StudentPG Team",
                captor.getValue().getText());
    }
}
