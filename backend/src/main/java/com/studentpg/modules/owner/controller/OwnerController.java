package com.studentpg.modules.owner.controller;

import com.studentpg.modules.owner.dto.request.ChangePasswordRequest;
import com.studentpg.modules.owner.dto.request.ForgotPasswordRequest;
import com.studentpg.modules.owner.dto.response.LoginResponse;
import com.studentpg.modules.owner.dto.request.OwnerLoginRequest;
import com.studentpg.modules.owner.dto.response.OwnerProfileResponse;
import com.studentpg.modules.owner.dto.request.OwnerRegisterRequest;
import com.studentpg.modules.owner.dto.request.ResetPasswordRequest;
import com.studentpg.modules.owner.dto.request.UpdateOwnerProfileRequest;
import com.studentpg.modules.owner.service.OwnerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@RestController
@RequestMapping("/api/owners")
@CrossOrigin("*")
public class OwnerController {

    @Autowired
    private OwnerService ownerService;

    @PostMapping("/register")
    public String registerOwner(@Valid @RequestBody OwnerRegisterRequest request) {
        return ownerService.registerOwner(request);
    }

    @PostMapping("/login")
    public LoginResponse loginOwner(@Valid @RequestBody OwnerLoginRequest request) {
        return ownerService.loginOwner(request);
    }

    @GetMapping("/profile")
    public OwnerProfileResponse getMyProfile() {
        return ownerService.getMyProfile();
    }

    @PutMapping("/profile")
    public String updateMyProfile(@Valid @RequestBody UpdateOwnerProfileRequest request) {
        return ownerService.updateMyProfile(request);
    }

    @PutMapping("/change-password")
    public String changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        return ownerService.changePassword(request);
    }

    @PostMapping("/forgot-password")
    public String forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return ownerService.forgotPassword(request);
    }

    @PostMapping("/reset-password")
    public String resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        return ownerService.resetPassword(request);
    }

    @PostMapping("/profile-image")
    public String uploadProfileImage(@RequestParam("image") MultipartFile image) throws IOException {
        return ownerService.uploadProfileImage(image);
    }

    @DeleteMapping("/profile-image")
    public String deleteProfileImage() throws IOException {
        return ownerService.deleteProfileImage();
    }
}