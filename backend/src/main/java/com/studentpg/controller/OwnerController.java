package com.studentpg.controller;

import com.studentpg.dto.ChangePasswordRequest;
import com.studentpg.dto.LoginResponse;
import com.studentpg.dto.OwnerLoginRequest;
import com.studentpg.dto.OwnerProfileResponse;
import com.studentpg.dto.OwnerRegisterRequest;
import com.studentpg.dto.UpdateOwnerProfileRequest;
import com.studentpg.service.OwnerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/owners")
@CrossOrigin("*")
public class OwnerController {

    @Autowired
    private OwnerService ownerService;

    // ===========================
    // Register Owner
    // ===========================

    @PostMapping("/register")
    public String registerOwner(
            @Valid @RequestBody OwnerRegisterRequest request) {

        return ownerService.registerOwner(request);
    }

    // ===========================
    // Login Owner
    // ===========================

    @PostMapping("/login")
    public LoginResponse loginOwner(
            @Valid @RequestBody OwnerLoginRequest request) {

        return ownerService.loginOwner(request);
    }

    // ===========================
    // Get My Profile
    // ===========================

    @GetMapping("/profile")
    public OwnerProfileResponse getMyProfile() {

        return ownerService.getMyProfile();
    }

    // ===========================
    // Update My Profile
    // ===========================

    @PutMapping("/profile")
    public String updateMyProfile(
            @Valid @RequestBody UpdateOwnerProfileRequest request) {

        return ownerService.updateMyProfile(request);
    }

    // ===========================
    // Change Password
    // ===========================

    @PutMapping("/change-password")
    public String changePassword(
            @Valid @RequestBody ChangePasswordRequest request) {

        return ownerService.changePassword(request);
    }
}