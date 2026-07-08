package com.studentpg.modules.admin.service;

import com.studentpg.modules.admin.dto.request.AdminLoginRequest;
import com.studentpg.modules.admin.dto.response.AdminLoginResponse;
import com.studentpg.modules.admin.entity.Admin;
import com.studentpg.modules.admin.repository.AdminRepository;
import com.studentpg.security.jwt.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminAuthService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private JwtService jwtService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private static final int MAX_ATTEMPTS = 5;
    private static final long LOCK_DURATION_MILLIS = 15 * 60 * 1000; // 15 minutes

    public AdminLoginResponse login(AdminLoginRequest request) {

        Admin admin = adminRepository.findByEmail(request.getEmail());

        if (admin == null) {
            return new AdminLoginResponse("Invalid credentials", null, null, null, null);
        }

        // Check if account is currently locked
        if (admin.getLockedUntil() != null && System.currentTimeMillis() < admin.getLockedUntil()) {
            long minutesLeft = (admin.getLockedUntil() - System.currentTimeMillis()) / 60000 + 1;
            return new AdminLoginResponse(
                    "Account locked due to too many failed attempts. Try again in " + minutesLeft + " minute(s).",
                    null, null, null, null);
        }

        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {

            admin.setFailedLoginAttempts(admin.getFailedLoginAttempts() + 1);

            if (admin.getFailedLoginAttempts() >= MAX_ATTEMPTS) {
                admin.setLockedUntil(System.currentTimeMillis() + LOCK_DURATION_MILLIS);
                admin.setFailedLoginAttempts(0);
                adminRepository.save(admin);
                return new AdminLoginResponse(
                        "Too many failed attempts. Account locked for 15 minutes.",
                        null, null, null, null);
            }

            adminRepository.save(admin);
            return new AdminLoginResponse("Invalid credentials", null, null, null, null);
        }

        // Correct password - reset counters
        admin.setFailedLoginAttempts(0);
        admin.setLockedUntil(null);
        adminRepository.save(admin);

        String token = jwtService.generateToken(admin.getEmail());

        return new AdminLoginResponse("Login successful", token, "Bearer", admin.getEmail(), admin.getRole());
    }
}