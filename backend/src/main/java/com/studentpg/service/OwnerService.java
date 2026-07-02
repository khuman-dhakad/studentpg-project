package com.studentpg.service;

import com.studentpg.dto.LoginResponse;
import com.studentpg.dto.OwnerLoginRequest;
import com.studentpg.dto.OwnerProfileResponse;
import com.studentpg.dto.OwnerRegisterRequest;
import com.studentpg.dto.UpdateOwnerProfileRequest;
import com.studentpg.model.Owner;
import com.studentpg.repository.OwnerRepository;
import com.studentpg.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.studentpg.dto.ChangePasswordRequest;
import com.studentpg.dto.ForgotPasswordRequest;
import com.studentpg.dto.ResetPasswordRequest;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Map;


@Service
public class OwnerService {

    @Autowired
    private OwnerRepository ownerRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private CloudinaryService cloudinaryService;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    private Owner getLoggedInOwner() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return ownerRepository.findByEmail(email);
    }

    // ===========================
    // Register Owner
    // ===========================

    public String registerOwner(OwnerRegisterRequest request) {

        if (ownerRepository.existsByEmail(request.getEmail())) {
            return "Email already exists";
        }

        Owner owner = new Owner();

        owner.setName(request.getName());
        owner.setEmail(request.getEmail());
        owner.setPhone(request.getPhone());
        owner.setWhatsappNumber(request.getWhatsappNumber());

        owner.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        owner.setRole("OWNER");

        ownerRepository.save(owner);

        return "Owner registered successfully";
    }

    // ===========================
    // Login Owner
    // ===========================

    public LoginResponse loginOwner(OwnerLoginRequest request) {

        Owner owner = ownerRepository.findByEmail(request.getEmail());

        if (owner == null) {

            return new LoginResponse(
                    "Owner not found",
                    null,
                    null,
                    null,
                    null
            );
        }

        if (!passwordEncoder.matches(
                request.getPassword(),
                owner.getPassword())) {

            return new LoginResponse(
                    "Invalid password",
                    null,
                    null,
                    null,
                    null
            );
        }

        String token =
                jwtService.generateToken(owner.getEmail());

        return new LoginResponse(
                "Login successful",
                token,
                "Bearer",
                owner.getEmail(),
                owner.getRole()
        );
    }

    // ===========================
    // Get My Profile
    // ===========================

    public OwnerProfileResponse getMyProfile() {

        Owner owner = getLoggedInOwner();

        return new OwnerProfileResponse(
                owner.getId(),
                owner.getName(),
                owner.getEmail(),
                owner.getPhone(),
                owner.getRole(),
                owner.getWhatsappNumber()
        );
    }

    // ===========================
    // Update My Profile
    // ===========================

    public String updateMyProfile(UpdateOwnerProfileRequest request) {

        Owner owner = getLoggedInOwner();

        Owner existingOwner =
                ownerRepository.findByEmail(request.getEmail());

        if (existingOwner != null &&
                !existingOwner.getId().equals(owner.getId())) {

            return "Email already exists";
        }

        owner.setName(request.getName());
        owner.setEmail(request.getEmail());
        owner.setPhone(request.getPhone());
       owner.setWhatsappNumber(request.getWhatsappNumber());

        ownerRepository.save(owner);

        return "Profile updated successfully";
    }
    // ===========================
// Change Password
// ===========================

public String changePassword(ChangePasswordRequest request) {

    Owner owner = getLoggedInOwner();

    // Verify old password
    if (!passwordEncoder.matches(
            request.getOldPassword(),
            owner.getPassword())) {

        return "Old password is incorrect";
    }

    // Prevent same password
    if (passwordEncoder.matches(
            request.getNewPassword(),
            owner.getPassword())) {

        return "New password must be different from the old password";
    }

    owner.setPassword(
            passwordEncoder.encode(request.getNewPassword())
    );

    ownerRepository.save(owner);

    return "Password changed successfully";
}

// ===========================
// Forgot Password
// ===========================

public String forgotPassword(ForgotPasswordRequest request) {

    Owner owner = ownerRepository.findByEmail(request.getEmail());

    if (owner != null) {
        // TODO: Send OTP email later
    }

    return "If an account exists with this email, password reset instructions will be sent.";
}

// ===========================
// Reset Password
// ===========================

public String resetPassword(ResetPasswordRequest request) {

    Owner owner = ownerRepository.findByEmail(request.getEmail());

    if (owner == null) {
        return "Invalid password reset request.";
    }

    owner.setPassword(
            passwordEncoder.encode(request.getNewPassword())
    );

    ownerRepository.save(owner);

    return "Password reset successfully.";
}
// ===========================
// Upload Profile Image
// ===========================

public String uploadProfileImage(MultipartFile image) throws IOException {

    Owner owner = getLoggedInOwner();

    // Delete old image if it exists
    if (owner.getProfileImagePublicId() != null &&
            !owner.getProfileImagePublicId().isEmpty()) {

        cloudinaryService.deleteImage(
                owner.getProfileImagePublicId()
        );
    }

    Map<String, String> uploadedImage =
            cloudinaryService.uploadProfileImage(image);

    owner.setProfileImageUrl(uploadedImage.get("url"));
    owner.setProfileImagePublicId(uploadedImage.get("publicId"));

    ownerRepository.save(owner);

    return "Profile image uploaded successfully.";
}

// ===========================
// Delete Profile Image
// ===========================

public String deleteProfileImage() throws IOException {

    Owner owner = getLoggedInOwner();

    if (owner.getProfileImagePublicId() == null ||
            owner.getProfileImagePublicId().isEmpty()) {

        return "Profile image not found.";
    }

    cloudinaryService.deleteImage(
            owner.getProfileImagePublicId()
    );

    owner.setProfileImageUrl(null);
    owner.setProfileImagePublicId(null);

    ownerRepository.save(owner);

    return "Profile image deleted successfully.";
   }
}