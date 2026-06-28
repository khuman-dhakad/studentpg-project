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

@Service
public class OwnerService {

    @Autowired
    private OwnerRepository ownerRepository;

    @Autowired
    private JwtService jwtService;

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
                owner.getRole()
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

        ownerRepository.save(owner);

        return "Profile updated successfully";
    }
}