package com.studentpg.modules.owner.service;

import com.studentpg.infrastructure.cloudinary.CloudinaryService;
import com.studentpg.infrastructure.email.EmailService;
import com.studentpg.modules.admin.repository.AdminRepository;
import com.studentpg.modules.owner.dto.request.OwnerRegisterRequest;
import com.studentpg.modules.owner.dto.request.OwnerRegisterVerifyRequest;
import com.studentpg.modules.owner.entity.Owner;
import com.studentpg.modules.owner.repository.OwnerRepository;
import com.studentpg.security.jwt.JwtService;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.MailSendException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.client.RestClientException;

import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OwnerRegistrationAndOtpRegressionTest {

    @Mock
    private OwnerRepository ownerRepository;

    @Mock
    private AdminRepository adminRepository;

    @Mock
    private JwtService jwtService;

    @Mock
    private CloudinaryService cloudinaryService;

    @Mock
    private EmailService emailService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private OwnerService ownerService;

    private Validator validator;

    @BeforeEach
    void setUp() {
        validator = Validation.buildDefaultValidatorFactory().getValidator();
    }

    @Nested
    @DisplayName("Fix A & SPG-QA-001: Owner Registration Validation")
    class RegistrationValidationTests {

        @Test
        @DisplayName("Valid registration with optional WhatsApp number omitted succeeds")
        void registrationWithoutWhatsappSucceeds() {
            OwnerRegisterRequest request = new OwnerRegisterRequest(
                    "Al", "host@example.com", "SecurePassword123", "9876543210", null
            );

            Set<ConstraintViolation<OwnerRegisterRequest>> violations = validator.validate(request);
            assertThat(violations).isEmpty();
        }

        @Test
        @DisplayName("Valid registration with empty string WhatsApp number succeeds")
        void registrationWithEmptyWhatsappSucceeds() {
            OwnerRegisterRequest request = new OwnerRegisterRequest(
                    "Rajesh", "host@example.com", "SecurePassword123", "9876543210", ""
            );

            Set<ConstraintViolation<OwnerRegisterRequest>> violations = validator.validate(request);
            assertThat(violations).isEmpty();
        }

        @Test
        @DisplayName("Valid registration with valid 10-digit WhatsApp number succeeds")
        void registrationWithValidWhatsappSucceeds() {
            OwnerRegisterRequest request = new OwnerRegisterRequest(
                    "Pooja Sharma", "pooja@example.com", "SecurePassword123", "9876543210", "9876543211"
            );

            Set<ConstraintViolation<OwnerRegisterRequest>> violations = validator.validate(request);
            assertThat(violations).isEmpty();
        }

        @Test
        @DisplayName("Invalid WhatsApp format (non-Indian mobile pattern) fails validation")
        void registrationWithInvalidWhatsappFails() {
            OwnerRegisterRequest request = new OwnerRegisterRequest(
                    "Pooja Sharma", "pooja@example.com", "SecurePassword123", "9876543210", "12345"
            );

            Set<ConstraintViolation<OwnerRegisterRequest>> violations = validator.validate(request);
            assertThat(violations).hasSize(1);
            assertThat(violations.iterator().next().getMessage()).contains("Invalid Indian WhatsApp number");
        }

        @Test
        @DisplayName("Boundary name length: 2 characters succeeds, 1 character fails")
        void boundaryNameLengthValidation() {
            OwnerRegisterRequest validTwoChar = new OwnerRegisterRequest(
                    "Om", "om@example.com", "SecurePassword123", "9876543210", ""
            );
            assertThat(validator.validate(validTwoChar)).isEmpty();

            OwnerRegisterRequest invalidOneChar = new OwnerRegisterRequest(
                    "O", "om@example.com", "SecurePassword123", "9876543210", ""
            );
            Set<ConstraintViolation<OwnerRegisterRequest>> violations = validator.validate(invalidOneChar);
            assertThat(violations).hasSize(1);
            assertThat(violations.iterator().next().getMessage()).contains("Name must be between 2 and 50 characters");
        }

        @Test
        @DisplayName("Duplicate email rejection when already verified")
        void duplicateVerifiedEmailThrowsException() {
            Owner existing = new Owner();
            existing.setEmail("verified@example.com");
            existing.setEmailVerified(true);
            when(ownerRepository.findByEmail("verified@example.com")).thenReturn(Optional.of(existing));

            OwnerRegisterRequest request = new OwnerRegisterRequest(
                    "John Doe", "verified@example.com", "Password123", "9876543210", ""
            );

            assertThatThrownBy(() -> ownerService.registerOwner(request))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessage("Email already exists");
        }
    }

    @Nested
    @DisplayName("Fix B & SPG-QA-002: Resend Registration OTP")
    class ResendOtpTests {

        @Test
        @DisplayName("Resending OTP generates new code, updates expiry, and sends email")
        void resendOtpSuccess() {
            Owner unverifiedOwner = new Owner();
            unverifiedOwner.setEmail("pending@example.com");
            unverifiedOwner.setEmailVerified(false);
            unverifiedOwner.setRegistrationOtpHash("old_hash");
            when(ownerRepository.findByEmail("pending@example.com")).thenReturn(Optional.of(unverifiedOwner));

            String result = ownerService.resendRegistrationOtp("pending@example.com");

            assertThat(result).contains("A new verification code has been sent");
            verify(emailService).sendRegistrationOtpEmail(eq("pending@example.com"), anyString());
            verify(ownerRepository).save(unverifiedOwner);
            assertThat(unverifiedOwner.getRegistrationOtpHash()).isNotEqualTo("old_hash");
        }

        @Test
        @DisplayName("Rapid repeated resend attempts within 60s cooldown trigger rate-limit exception")
        void rapidResendViolatesCooldown() {
            Owner unverifiedOwner = new Owner();
            unverifiedOwner.setEmail("pending@example.com");
            unverifiedOwner.setEmailVerified(false);
            unverifiedOwner.setLastOtpSentAt(System.currentTimeMillis() - 20_000L); // 20 seconds ago
            when(ownerRepository.findByEmail("pending@example.com")).thenReturn(Optional.of(unverifiedOwner));

            assertThatThrownBy(() -> ownerService.resendRegistrationOtp("pending@example.com"))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessageContaining("Please wait")
                    .hasMessageContaining("second(s) before requesting another code");

            verify(emailService, never()).sendRegistrationOtpEmail(anyString(), anyString());
        }

        @Test
        @DisplayName("Exceeding hourly OTP limit triggers rate-limit exception")
        void exceedingHourlyLimitThrows() {
            Owner unverifiedOwner = new Owner();
            unverifiedOwner.setEmail("pending@example.com");
            unverifiedOwner.setEmailVerified(false);
            unverifiedOwner.setLastOtpSentAt(System.currentTimeMillis() - 70_000L); // past cooldown
            unverifiedOwner.setOtpWindowStart(System.currentTimeMillis() - 100_000L);
            unverifiedOwner.setOtpRequestCount(5); // reached limit of 5
            when(ownerRepository.findByEmail("pending@example.com")).thenReturn(Optional.of(unverifiedOwner));

            assertThatThrownBy(() -> ownerService.resendRegistrationOtp("pending@example.com"))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessage("Too many OTP requests. Please try again later.");
        }

        @Test
        @DisplayName("Resend for already-verified owner is rejected")
        void resendForVerifiedOwnerFails() {
            Owner verifiedOwner = new Owner();
            verifiedOwner.setEmail("verified@example.com");
            verifiedOwner.setEmailVerified(true);
            when(ownerRepository.findByEmail("verified@example.com")).thenReturn(Optional.of(verifiedOwner));

            assertThatThrownBy(() -> ownerService.resendRegistrationOtp("verified@example.com"))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessage("Email is already verified. Please log in.");
        }
    }

    @Nested
    @DisplayName("Fix C & SPG-QA-003: OTP Verification and Refresh Recovery")
    class OtpVerificationTests {

        @Test
        @DisplayName("DTO allows verification with only email and 6-digit OTP")
        void verifyDtoAcceptsMinimalPayload() {
            OwnerRegisterVerifyRequest request = new OwnerRegisterVerifyRequest("user@example.com", "654321");
            Set<ConstraintViolation<OwnerRegisterVerifyRequest>> violations = validator.validate(request);
            assertThat(violations).isEmpty();
        }

        @Test
        @DisplayName("DTO rejects invalid or non-6-digit OTP")
        void verifyDtoRejectsMalformedOtp() {
            OwnerRegisterVerifyRequest request = new OwnerRegisterVerifyRequest("user@example.com", "123");
            Set<ConstraintViolation<OwnerRegisterVerifyRequest>> violations = validator.validate(request);
            assertThat(violations).hasSize(1);
            assertThat(violations.iterator().next().getMessage()).contains("OTP must be 6 digits");
        }

        @Test
        @DisplayName("Correct OTP successfully verifies owner account")
        void correctOtpVerifiesAccount() {
            Owner owner = new Owner();
            owner.setEmail("host@example.com");
            owner.setEmailVerified(false);
            owner.setRegistrationOtpExpiry(System.currentTimeMillis() + 600_000L);

            // Seed with valid hash for OTP "123456"
            // hashOtp uses SHA-256
            OwnerRegisterRequest registerRequest = new OwnerRegisterRequest("Host", "host@example.com", "Password123", "9876543210", "");
            when(ownerRepository.findByEmail("host@example.com")).thenReturn(Optional.empty());
            when(passwordEncoder.encode(anyString())).thenReturn("encodedPass");

            ownerService.registerOwner(registerRequest);

            ArgumentCaptor<Owner> savedOwnerCaptor = ArgumentCaptor.forClass(Owner.class);
            verify(ownerRepository).save(savedOwnerCaptor.capture());
            Owner registeredOwner = savedOwnerCaptor.getValue();

            ArgumentCaptor<String> otpCaptor = ArgumentCaptor.forClass(String.class);
            verify(emailService).sendRegistrationOtpEmail(eq("host@example.com"), otpCaptor.capture());
            String generatedOtp = otpCaptor.getValue();

            // Now verify with generated OTP
            when(ownerRepository.findByEmail("host@example.com")).thenReturn(Optional.of(registeredOwner));
            OwnerRegisterVerifyRequest verifyRequest = new OwnerRegisterVerifyRequest("host@example.com", generatedOtp);
            String verifyResult = ownerService.verifyOwnerRegistration(verifyRequest);

            assertThat(verifyResult).isEqualTo("Email verified successfully. You can now log in.");
            assertThat(registeredOwner.isEmailVerified()).isTrue();
            assertThat(registeredOwner.isActive()).isTrue();
            assertThat(registeredOwner.getRegistrationOtpHash()).isNull();
        }

        @Test
        @DisplayName("Incorrect OTP returns failure message without activating account")
        void incorrectOtpFails() {
            Owner owner = new Owner();
            owner.setEmail("host@example.com");
            owner.setEmailVerified(false);
            owner.setRegistrationOtpHash("some_hash");
            owner.setRegistrationOtpExpiry(System.currentTimeMillis() + 600_000L);
            when(ownerRepository.findByEmail("host@example.com")).thenReturn(Optional.of(owner));

            OwnerRegisterVerifyRequest verifyRequest = new OwnerRegisterVerifyRequest("host@example.com", "000000");
            String result = ownerService.verifyOwnerRegistration(verifyRequest);

            assertThat(result).isEqualTo("Incorrect verification code.");
            assertThat(owner.isEmailVerified()).isFalse();
        }

        @Test
        @DisplayName("Expired OTP is invalidated and requires re-registration")
        void expiredOtpRequiresReRegistration() {
            Owner owner = new Owner();
            owner.setEmail("host@example.com");
            owner.setEmailVerified(false);
            owner.setRegistrationOtpHash("some_hash");
            owner.setRegistrationOtpExpiry(System.currentTimeMillis() - 1000L); // expired 1s ago
            when(ownerRepository.findByEmail("host@example.com")).thenReturn(Optional.of(owner));

            OwnerRegisterVerifyRequest verifyRequest = new OwnerRegisterVerifyRequest("host@example.com", "123456");
            String result = ownerService.verifyOwnerRegistration(verifyRequest);

            assertThat(result).isEqualTo("Verification code expired. Please register again.");
            assertThat(owner.getRegistrationOtpHash()).isNull();
            verify(ownerRepository).save(owner);
        }
    }

    @Nested
    @DisplayName("Fix D & SPG-QA-004: Email Delivery Reliability")
    class EmailReliabilityTests {

        @Test
        @DisplayName("Provider RestClientException during registration is caught and returns sanitized error")
        void providerRestClientExceptionIsHandledGracefully() {
            doThrow(new RestClientException("Brevo API timeout"))
                    .when(emailService).sendRegistrationOtpEmail(anyString(), anyString());

            OwnerRegisterRequest request = new OwnerRegisterRequest(
                    "Host", "host@example.com", "Password123", "9876543210", ""
            );
            when(ownerRepository.findByEmail("host@example.com")).thenReturn(Optional.empty());
            when(passwordEncoder.encode(anyString())).thenReturn("encodedPass");

            assertThatThrownBy(() -> ownerService.registerOwner(request))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessageContaining("Unable to send verification OTP email");

            // Verify owner is NOT persisted when email fails
            verify(ownerRepository, never()).save(any());
        }

        @Test
        @DisplayName("Provider MailSendException during registration is caught and owner is not saved")
        void mailSendExceptionIsHandledGracefully() {
            doThrow(new MailSendException("SMTP relay refused"))
                    .when(emailService).sendRegistrationOtpEmail(anyString(), anyString());

            OwnerRegisterRequest request = new OwnerRegisterRequest(
                    "Host", "host@example.com", "Password123", "9876543210", ""
            );
            when(ownerRepository.findByEmail("host@example.com")).thenReturn(Optional.empty());
            when(passwordEncoder.encode(anyString())).thenReturn("encodedPass");

            assertThatThrownBy(() -> ownerService.registerOwner(request))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessageContaining("Unable to send verification OTP email");

            verify(ownerRepository, never()).save(any());
        }
    }
}
