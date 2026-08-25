package com.studentpg.modules.owner.service;

import com.studentpg.infrastructure.cloudinary.CloudinaryService;
import com.studentpg.infrastructure.email.EmailService;
import com.studentpg.modules.owner.dto.request.ChangePasswordRequest;
import com.studentpg.modules.owner.dto.request.ForgotPasswordRequest;
// import com.studentpg.modules.owner.dto.request.OwnerLoginRequest;
import com.studentpg.modules.owner.dto.request.OwnerRegisterRequest;
import com.studentpg.modules.owner.dto.request.ResetPasswordRequest;
import com.studentpg.modules.owner.dto.request.UpdateOwnerProfileRequest;
// import com.studentpg.modules.owner.dto.response.LoginResponse;
import com.studentpg.modules.owner.dto.response.OwnerProfileResponse;
import com.studentpg.modules.owner.entity.Owner;
import com.studentpg.modules.owner.repository.OwnerRepository;
import com.studentpg.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.MailException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.IOException;
import java.security.SecureRandom;
import java.util.Map;


import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

 

@Service
@RequiredArgsConstructor
public class OwnerService {
         

    private static final Logger logger =
            LoggerFactory.getLogger(OwnerService.class);

    private static final int MAX_LOGIN_ATTEMPTS = 5;
  

    private static final long LOGIN_LOCK_MILLIS =
            15 * 60 * 1000L;

    private static final long OTP_VALID_MILLIS =
            10 * 60 * 1000L;

    private static final long OTP_COOLDOWN_MILLIS =
            60 * 1000L;

    private static final int OTP_MAX_PER_HOUR = 5;

    private static final long OTP_WINDOW_MILLIS =
            60 * 60 * 1000L;

    private final OwnerRepository ownerRepository;
    private final JwtService jwtService;
    private final CloudinaryService cloudinaryService;
    private final EmailService emailService;

    private final PasswordEncoder passwordEncoder;

    // =========================================================
    // GET LOGGED-IN OWNER
    // =========================================================

    private Owner getLoggedInOwner() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication.getName() == null
                || authentication.getName().isBlank()) {

            throw new IllegalStateException(
                    "User is not authenticated"
            );
        }

        String email =
                normalizeEmail(authentication.getName());

        Owner owner =
                ownerRepository.findByEmail(email)
                        .orElse(null);

        if (owner == null) {
            throw new IllegalStateException(
                    "Authenticated owner not found"
            );
        }

        return owner;
    }

    // =========================================================
    // REGISTER OWNER
    // =========================================================
  
    private void validatePassword(String password) {

    if (password == null || password.length() < 8) {

        throw new IllegalArgumentException(
                "Password must be at least 8 characters."
        );
    }
}

   public String registerOwner(
        OwnerRegisterRequest request
) {

    String email =
            normalizeEmail(request.getEmail());
            validatePassword(request.getPassword());    

    if (ownerRepository.existsByEmail(email)) {

        throw new IllegalStateException(
                "Email already exists"
        );
    }

    Owner owner = new Owner();

    owner.setName(
            request.getName().trim()
    );

    owner.setEmail(email);

    owner.setPhone(
            request.getPhone().trim()
    );

    if (request.getWhatsappNumber() != null
            && !request.getWhatsappNumber().isBlank()) {

        owner.setWhatsappNumber(
                request.getWhatsappNumber().trim()
        );
    }

    owner.setPassword(
            passwordEncoder.encode(
                    request.getPassword()
            )
    );

    owner.setRole("OWNER");

    ownerRepository.save(owner);

    return "Owner registered successfully";
}

    // =========================================================
    // OWNER LOGIN
    // =========================================================

//     public LoginResponse loginOwner(
//             OwnerLoginRequest request
//     ) {

//         String email =
//                 normalizeEmail(request.getEmail());

//         Owner owner =
//                 ownerRepository.findByEmail(email)
//                         .orElse(null);

//         if (owner == null) {

//             return new LoginResponse(
//                     "Invalid credentials",
//                     null,
//                     null,
//                     null,
//                     null
//             );
//         }

//         long now =
//                 System.currentTimeMillis();

//         // Account lock check
//         if (owner.getLockedUntil() != null
//                 && now < owner.getLockedUntil()) {

//             long minutesLeft =
//                     (owner.getLockedUntil() - now)
//                             / 60000
//                             + 1;

//             return new LoginResponse(
//                     "Account temporarily locked. Try again in "
//                             + minutesLeft
//                             + " minute(s).",
//                     null,
//                     null,
//                     null,
//                     null
//             );
//         }

//         // Password check
//         if (!passwordEncoder.matches(
//                 request.getPassword(),
//                 owner.getPassword()
//         )) {

//             int failedAttempts =
//                     owner.getFailedLoginAttempts() + 1;

//             owner.setFailedLoginAttempts(
//                     failedAttempts
//             );

//             if (failedAttempts >= MAX_LOGIN_ATTEMPTS) {

//                 owner.setLockedUntil(
//                         now + LOGIN_LOCK_MILLIS
//                 );

//                 owner.setFailedLoginAttempts(0);

//                 ownerRepository.save(owner);

//                 return new LoginResponse(
//                         "Too many failed attempts. Account temporarily locked.",
//                         null,
//                         null,
//                         null,
//                         null
//                 );
//             }

//             ownerRepository.save(owner);

//             return new LoginResponse(
//                     "Invalid credentials",
//                     null,
//                     null,
//                     null,
//                     null
//             );
//         }

//         // Successful login
//         owner.setFailedLoginAttempts(0);
//         owner.setLockedUntil(null);

//         ownerRepository.save(owner);

//         String token =
//                 jwtService.generateToken(
//                         owner.getEmail()
//                 );

//         return new LoginResponse(
//                 "Login successful",
//                 token,
//                 "Bearer",
//                 owner.getEmail(),
//                 owner.getRole()
//         );
//     }

    // =========================================================
    // GET PROFILE
    // =========================================================

    public OwnerProfileResponse getMyProfile() {

        Owner owner =
                getLoggedInOwner();

        return new OwnerProfileResponse(
                owner.getId(),
                owner.getName(),
                owner.getEmail(),
                owner.getPhone(),
                owner.getRole(),
                owner.getWhatsappNumber()
        );
    }

    // =========================================================
    // UPDATE PROFILE
    // =========================================================

    public String updateMyProfile(
            UpdateOwnerProfileRequest request
    ) {

        Owner owner =
                getLoggedInOwner();

        String newEmail =
                normalizeEmail(request.getEmail());

        Owner existingOwner =
                ownerRepository.findByEmail(newEmail).orElse(null);

        if (existingOwner != null
                && !existingOwner.getId()
                .equals(owner.getId())) {

            return "Email already exists";
        }

        owner.setName(
                request.getName().trim()
        );

        owner.setEmail(newEmail);

       owner.setPhone(
        request.getPhone().trim()
                );
        owner.setWhatsappNumber(

        request.getWhatsappNumber() == null

                ? null

                : request.getWhatsappNumber().trim()

        );

        ownerRepository.save(owner);

        return "Profile updated successfully";
    }

    // =========================================================
    // CHANGE PASSWORD
    // =========================================================

    public String changePassword(
            ChangePasswordRequest request
    ) {

        Owner owner =
                getLoggedInOwner();

        if (!passwordEncoder.matches(
                request.getOldPassword(),
                owner.getPassword()
        )) {

            return "Old password is incorrect";
        }

        if (passwordEncoder.matches(
                request.getNewPassword(),
                owner.getPassword()
        )) {

            return "New password must be different from the old password";
        }
        validatePassword(request.getNewPassword());
        owner.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        ownerRepository.save(owner);

        return "Password changed successfully";
    }

    // =========================================================
    // FORGOT PASSWORD
    // =========================================================

  public String forgotPassword(
        ForgotPasswordRequest request
) {

    String email =
            normalizeEmail(request.getEmail());

    Owner owner =
            ownerRepository.findByEmail(email)
                    .orElse(null);

    if (owner == null) {

        return "If an account exists with this email, a reset code has been sent.";
    }

    long now =
            System.currentTimeMillis();

    // Cooldown check
    if (owner.getLastOtpSentAt() != null
            && now - owner.getLastOtpSentAt()
            < OTP_COOLDOWN_MILLIS) {

        return "Please wait before requesting another code.";
    }

    // Reset hourly window
    if (owner.getOtpWindowStart() == null
            || now - owner.getOtpWindowStart()
            >= OTP_WINDOW_MILLIS) {

        owner.setOtpWindowStart(now);
        owner.setOtpRequestCount(0);
    }

    // Hourly limit
    if (owner.getOtpRequestCount()
            >= OTP_MAX_PER_HOUR) {

        return "Too many reset requests. Please try again later.";
    }

    String otp =
            generateOtp();

    String otpHash =
            hashOtp(otp);

    try {

        logger.info(
                "Attempting to send OTP email to {}",
                email
        );

        // Send email first
        emailService.sendOtpEmail(
                email,
                otp
        );

        logger.info(
                "OTP email sent successfully to {}",
                email
        );

        // Save OTP only after successful email sending
        owner.setResetOtpHash(otpHash);
        owner.setResetOtpExpiry(
                now + OTP_VALID_MILLIS
        );
        owner.setResetOtpAttempts(0);
        owner.setLastOtpSentAt(now);
        owner.setOtpRequestCount(
                owner.getOtpRequestCount() + 1
        );

        ownerRepository.save(owner);

        logger.info(
                "OTP hash saved successfully in database for {}",
                email
        );

    } catch (MailException ex) {

        logger.error(
                "OTP process failed for owner {}. Error: {}",
                email,
                ex.getMessage(),
                ex
        );

        throw new IllegalStateException(
                "Unable to send OTP email",
                ex
        );
    }

    return "If an account exists with this email, a reset code has been sent.";
}// =========================================================
    // RESET PASSWORD
    // =========================================================

    public String resetPassword(
            ResetPasswordRequest request
    ) {

        String email =
                normalizeEmail(request.getEmail());

        logger.info(
                "Password reset debug - email received: {}",
                email
        );

        Owner owner =
                ownerRepository.findByEmail(email).orElse(null);

        if (owner == null) {
            logger.info(
                    "Password reset debug - owner found: false"
            );
            return "Invalid password reset request.";
        }

        logger.info(
                "Password reset debug - owner found: true"
        );

        if (owner.getResetOtpHash() == null) {
            return "Invalid password reset request.";
        }

        if (owner.getResetOtpExpiry() == null
                || System.currentTimeMillis()
                > owner.getResetOtpExpiry()) {
            logger.info(
                    "Password reset debug - expiry status: expired"
            );
            return "Reset code expired. Please request a new one.";
        }

        logger.info(
                "Password reset debug - expiry status: valid"
        );

        if (owner.getResetOtpAttempts() >= 5) {
            return "Too many incorrect attempts. Please request a new code.";
        }

        String submittedOtp =
                request.getOtp() == null
                        ? ""
                        : request.getOtp().trim();

        String submittedOtpHash =
                hashOtp(submittedOtp);

        // logger.info(
        //         "Password reset debug - submitted OTP hash: {}",
        //         submittedOtpHash
        // );
        logger.info(
                "Password reset debug - stored OTP hash: {}",
                owner.getResetOtpHash()
        );

        boolean otpMatches =
                owner.getResetOtpHash().equals(submittedOtpHash);

        logger.info(
                "Password reset debug - OTP hash comparison result: {}",
                otpMatches
        );

        if (!otpMatches) {
            owner.setResetOtpAttempts(owner.getResetOtpAttempts() + 1);
            ownerRepository.save(owner);
            return "Incorrect reset code.";
        }
        validatePassword(request.getNewPassword());

        logger.info(
                "Password reset debug - password encoding started"
        );

        owner.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        owner.setResetOtpHash(null);
        owner.setResetOtpExpiry(null);
        owner.setResetOtpAttempts(0);

        owner.setFailedLoginAttempts(0);
        owner.setLockedUntil(null);
        owner.setTokenVersion(owner.getTokenVersion() + 1);

        Owner savedOwner = ownerRepository.save(owner);
        logger.info(
                "Password reset debug - repository save completed"
        );

        Owner persistedOwner = ownerRepository.findByEmail(email).orElse(null);
        boolean passwordVerified = persistedOwner != null
                && persistedOwner.getPassword() != null
                && passwordEncoder.matches(
                        request.getNewPassword(),
                        persistedOwner.getPassword()
                );

        logger.info(
                "Password reset debug - password verification after save: {}",
                passwordVerified
        );

        if (!passwordVerified) {
            throw new IllegalStateException(
                    "Password was not persisted correctly"
            );
        }

        return "Password reset successfully.";
    }

    // =========================================================
    // UPLOAD PROFILE IMAGE
    // =========================================================

    public String uploadProfileImage(
            MultipartFile image
    ) throws IOException {

        if (image == null
                || image.isEmpty()) {

            return "Image is required.";
        }

        Owner owner =
                getLoggedInOwner();
                if (image.getContentType() == null
        || !image.getContentType().startsWith("image/")) {

    throw new IllegalArgumentException(
            "Only image files are allowed."
    );
}

if (image.getSize() > 5 * 1024 * 1024) {

    throw new IllegalArgumentException(
            "Maximum image size is 5 MB."
    );
}

        // Upload new image first
        Map<String, String> uploadedImage =
                cloudinaryService.uploadProfileImage(
                        image
                );

        String oldPublicId =
                owner.getProfileImagePublicId();

        owner.setProfileImageUrl(
                uploadedImage.get("url")
        );

        owner.setProfileImagePublicId(
                uploadedImage.get("publicId")
        );

        ownerRepository.save(owner);

        // Delete old image only after successful new upload
        if (oldPublicId != null
                && !oldPublicId.isBlank()) {

            try {

                cloudinaryService.deleteImage(
                        oldPublicId
                );

            } catch (Exception ex) {

    logger.warn(
            "Old profile image could not be deleted",
            ex
    );
}
        }

        return "Profile image uploaded successfully.";
    }

    // =========================================================
    // DELETE PROFILE IMAGE
    // =========================================================

    public String deleteProfileImage()
            throws IOException {

        Owner owner =
                getLoggedInOwner();

        String publicId =
                owner.getProfileImagePublicId();

        if (publicId == null
                || publicId.isBlank()) {

            return "Profile image not found.";
        }

        cloudinaryService.deleteImage(
                publicId
        );

        owner.setProfileImageUrl(null);
        owner.setProfileImagePublicId(null);

        ownerRepository.save(owner);

        return "Profile image deleted successfully.";
    }

    // =========================================================
    // OTP GENERATOR
    // =========================================================

    private String generateOtp() {

        SecureRandom random =
                new SecureRandom();

        int otp =
                100000
                        + random.nextInt(900000);

        return String.valueOf(otp);
    }

    private String hashOtp(String otp) {
    try {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");

        byte[] hash = digest.digest(
                otp.getBytes(StandardCharsets.UTF_8)
        );

        return HexFormat.of().formatHex(hash);

    } catch (NoSuchAlgorithmException e) {
        throw new IllegalStateException(
                "SHA-256 algorithm is not available",
                e
        );
    }
}

    // =========================================================
    // EMAIL NORMALIZATION
    // =========================================================

    private String normalizeEmail(
            String email
    ) {

        if (email == null
                || email.isBlank()) {

            throw new IllegalArgumentException(
                    "Email is required"
            );
        }

        return email.trim()
                .toLowerCase();
    }
}   