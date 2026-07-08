package com.studentpg.modules.admin.controller;

import com.studentpg.modules.admin.dto.request.AdminLoginRequest;
import com.studentpg.modules.admin.dto.response.AdminLoginResponse;
import com.studentpg.modules.admin.service.AdminAuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/auth")
@CrossOrigin("*")
public class AdminAuthController {

    @Autowired
    private AdminAuthService adminAuthService;

    @PostMapping("/login")
    public AdminLoginResponse login(@Valid @RequestBody AdminLoginRequest request) {
        return adminAuthService.login(request);
    }
}