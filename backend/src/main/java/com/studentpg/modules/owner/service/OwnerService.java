package com.studentpg.modules.owner.service;

import com.studentpg.modules.owner.dto.response.LoginResponse;
import com.studentpg.modules.owner.dto.request.OwnerLoginRequest;
import com.studentpg.modules.owner.dto.response.OwnerProfileResponse;
import com.studentpg.modules.owner.dto.request.OwnerRegisterRequest;
import com.studentpg.modules.owner.dto.request.UpdateOwnerProfileRequest;
import com.studentpg.modules.owner.dto.request.ChangePasswordRequest;
import com.studentpg.modules.owner.dto.request.ForgotPasswordRequest;
import com.studentpg.modules.owner.dto.request.ResetPasswordRequest;
import com.studentpg.modules.owner.entity.Owner;
import com.studentpg.modules.owner.repository.OwnerRepository;
import com.studentpg.security.jwt.JwtService;
import com.studentpg.infrastructure.cloudinary.CloudinaryService;
import com.studentpg.infrastructure.email.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.SecureRandom;
import java.util.Map;

@Service
public class OwnerService {

    @Autowired
    private OwnerRepository ownerRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private EmailService emailService;

    private static final Logger logger = LoggerFactory.getLogger(OwnerService.class);

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private static final long OTP_VALID_MILLIS = 10 * 60 * 1000;        // OTP valid 10 min
    private static final long OTP_COOLDOWN_MILLIS = 60 * 1000;          // 60 sec between requests
    private static final int OTP_MAX_PER_HOUR = 5;
    private static final long OTP_WINDOW_MILLIS = 60 * 60 * 1000;       // 1 hour window

    private static final int MAX_LOGIN_ATTEMPTS = 5;
    private static final long LOGIN_LOCK_MILLIS = 15 * 60 * 1000;       // 15 minutes

    private Owner getLoggedInOwner() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return ownerRepository.findByEmail(email);
    }

    public String registerOwner(OwnerRegisterRequest request) {
        if (ownerRepository.existsByEmail(request.getEmail())) {
            return "Email already exists";
        }

        Owner owner = new Owner();
        owner.setName(request.getName());
        owner.setEmail(request.getEmail());
        owner.setPhone(request.getPhone());
        owner.setWhatsappNumber(request.getWhatsappNumber());
        owner.setPassword(passwordEncoder.encode(request.getPassword()));
        owner.setRole("OWNER");

        ownerRepository.save(owner);
        return "Owner registered successfully";
    }

    // ===========================
    // Login - now with attack protection
    // ===========================
    public LoginResponse loginOwner(OwnerLoginRequest request) {

        Owner owner = ownerRepository.findByEmail(request.getEmail());

        if (owner == null) {
            return new LoginResponse("Invalid credentials", null, null, null, null);
        }

        if (owner.getLockedUntil() != null && System.currentTimeMillis() < owner.getLockedUntil()) {
            long minutesLeft = (owner.getLockedUntil() - System.currentTimeMillis()) / 60000 + 1;
            return new LoginResponse(
                    "Account locked due to too many failed attempts. Try again in " + minutesLeft + " minute(s).",
                    null, null, null, null);
        }

        if (!passwordEncoder.matches(request.getPassword(), owner.getPassword())) {

            owner.setFailedLoginAttempts(owner.getFailedLoginAttempts() + 1);

            if (owner.getFailedLoginAttempts() >= MAX_LOGIN_ATTEMPTS) {
                owner.setLockedUntil(System.currentTimeMillis() + LOGIN_LOCK_MILLIS);
                owner.setFailedLoginAttempts(0);
                ownerRepository.save(owner);
                return new LoginResponse(
                        "Too many failed attempts. Account locked for 15 minutes.",
                        null, null, null, null);
            }

            ownerRepository.save(owner);
            return new LoginResponse("Invalid credentials", null, null, null, null);
        }

        owner.setFailedLoginAttempts(0);
        owner.setLockedUntil(null);
        ownerRepository.save(owner);

        String token = jwtService.generateToken(owner.getEmail());
        return new LoginResponse("Login successful", token, "Bearer", owner.getEmail(), owner.getRole());
    }

    public OwnerProfileResponse getMyProfile() {
        Owner owner = getLoggedInOwner();
        return new OwnerProfileResponse(
                owner.getId(), owner.getName(), owner.getEmail(),
                owner.getPhone(), owner.getRole(), owner.getWhatsappNumber());
    }

    public String updateMyProfile(UpdateOwnerProfileRequest request) {
        Owner owner = getLoggedInOwner();
        Owner existingOwner = ownerRepository.findByEmail(request.getEmail());

        if (existingOwner != null && !existingOwner.getId().equals(owner.getId())) {
            return "Email already exists";
        }

        owner.setName(request.getName());
        owner.setEmail(request.getEmail());
        owner.setPhone(request.getPhone());
        owner.setWhatsappNumber(request.getWhatsappNumber());

        ownerRepository.save(owner);
        return "Profile updated successfully";
    }

    public String changePassword(ChangePasswordRequest request) {
        Owner owner = getLoggedInOwner();

        if (!passwordEncoder.matches(request.getOldPassword(), owner.getPassword())) {
            return "Old password is incorrect";
        }

        if (passwordEncoder.matches(request.getNewPassword(), owner.getPassword())) {
            return "New password must be different from the old password";
        }

        owner.setPassword(passwordEncoder.encode(request.getNewPassword()));
        ownerRepository.save(owner);

        return "Password changed successfully";
    }

    // ===========================
    // Forgot Password - now with spam protection
    // ===========================
    public String forgotPassword(ForgotPasswordRequest request) {

        logger.info("forgotPassword called for email={}", request.getEmail());

        Owner owner = ownerRepository.findByEmail(request.getEmail());

        if (owner == null) {
            logger.info("No owner found for email={}", request.getEmail());
            return "If an account exists with this email, a reset code has been sent.";
        }

        logger.info("Owner found for forgot-password: id={} email={}", owner.getId(), owner.getEmail());

        long now = System.currentTimeMillis();

        // Cooldown: block if last OTP sent less than 60 seconds ago
        if (owner.getLastOtpSentAt() != null && (now - owner.getLastOtpSentAt()) < OTP_COOLDOWN_MILLIS) {
            long secondsLeft = (OTP_COOLDOWN_MILLIS - (now - owner.getLastOtpSentAt())) / 1000 + 1;
            logger.info("OTP request for {} blocked by cooldown: {}s remaining", owner.getEmail(), secondsLeft);
            return "Please wait " + secondsLeft + " second(s) before requesting another code.";
        }

        // Hourly limit: reset window if expired, else check count
        if (owner.getOtpWindowStart() == null || (now - owner.getOtpWindowStart()) > OTP_WINDOW_MILLIS) {
            owner.setOtpWindowStart(now);
            owner.setOtpRequestCount(0);
        }

        if (owner.getOtpRequestCount() >= OTP_MAX_PER_HOUR) {
            logger.info("OTP request limit reached for email={}", owner.getEmail());
            return "Too many reset requests. Please try again after some time.";
        }

        logger.info("Generating OTP for email={}", owner.getEmail());
        String otp = generateOtp();

        owner.setResetOtp(otp);
        owner.setResetOtpExpiry(now + OTP_VALID_MILLIS);
        owner.setLastOtpSentAt(now);
        owner.setOtpRequestCount(owner.getOtpRequestCount() + 1);

        ownerRepository.save(owner);
        logger.info("Saved OTP and metadata for owner id={}", owner.getId());

        logger.info("Calling EmailService.sendOtpEmail for {}", owner.getEmail());
        emailService.sendOtpEmail(owner.getEmail(), otp);
        logger.info("EmailService.sendOtpEmail returned for {}", owner.getEmail());

        return "If an account exists with this email, a reset code has been sent.";
    }

    public String resetPassword(ResetPasswordRequest request) {
        Owner owner = ownerRepository.findByEmail(request.getEmail());

        if (owner == null || owner.getResetOtp() == null) {
            return "Invalid password reset request.";
        }

        if (!owner.getResetOtp().equals(request.getOtp())) {
            return "Incorrect reset code.";
        }

        if (owner.getResetOtpExpiry() == null || System.currentTimeMillis() > owner.getResetOtpExpiry()) {
            return "Reset code expired. Please request a new one.";
        }

        owner.setPassword(passwordEncoder.encode(request.getNewPassword()));
        owner.setResetOtp(null);
        owner.setResetOtpExpiry(null);

        ownerRepository.save(owner);
        return "Password reset successfully.";
    }

    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    public String uploadProfileImage(MultipartFile image) throws IOException {
        Owner owner = getLoggedInOwner();

        if (owner.getProfileImagePublicId() != null && !owner.getProfileImagePublicId().isEmpty()) {
            cloudinaryService.deleteImage(owner.getProfileImagePublicId());
        }

        Map<String, String> uploadedImage = cloudinaryService.uploadProfileImage(image);

        owner.setProfileImageUrl(uploadedImage.get("url"));
        owner.setProfileImagePublicId(uploadedImage.get("publicId"));

        ownerRepository.save(owner);
        return "Profile image uploaded successfully.";
    }

    public String deleteProfileImage() throws IOException {
        Owner owner = getLoggedInOwner();

        if (owner.getProfileImagePublicId() == null || owner.getProfileImagePublicId().isEmpty()) {
            return "Profile image not found.";
        }

        cloudinaryService.deleteImage(owner.getProfileImagePublicId());
        owner.setProfileImageUrl(null);
        owner.setProfileImagePublicId(null);

        ownerRepository.save(owner);
        return "Profile image deleted successfully.";
    }
}