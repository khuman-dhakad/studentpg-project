package com.studentpg.modules.auth.service;


import com.studentpg.modules.admin.entity.Admin;
import com.studentpg.modules.admin.repository.AdminRepository;

import com.studentpg.modules.auth.dto.request.LoginRequest;
import com.studentpg.modules.auth.dto.response.AuthLoginResult;

import com.studentpg.modules.owner.entity.Owner;
import com.studentpg.modules.owner.repository.OwnerRepository;

import com.studentpg.security.jwt.JwtService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.BadCredentialsException;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final AdminRepository adminRepository;
    private final OwnerRepository ownerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthLoginResult login(LoginRequest request) {
        if (request == null || request.getEmail() == null || request.getPassword() == null) {
            throw new BadCredentialsException("Invalid email or password");
        }

        String email = request.getEmail().trim().toLowerCase();
        String password = request.getPassword();

        if (email.isBlank() || password.isBlank()) {
            throw new BadCredentialsException("Invalid email or password");
        }

        Admin admin = adminRepository.findByEmailIgnoreCase(email).orElse(null);
        if (admin != null) {
            if (!admin.isActive()) {
                throw new BadCredentialsException("Invalid email or password");
            }

            if (!passwordEncoder.matches(password, admin.getPassword())) {
                throw new BadCredentialsException("Invalid email or password");
            }

            String normalizedEmail = admin.getEmail().trim().toLowerCase();
            String accessToken = jwtService.generateToken(normalizedEmail);
            logger.info("Admin login successful: {}", normalizedEmail);
            return new AuthLoginResult(accessToken, normalizedEmail, "ADMIN");
        }

        Owner owner = ownerRepository.findByEmailIgnoreCase(email).orElse(null);
        if (owner == null) {
            throw new BadCredentialsException("Invalid email or password");
        }

        long now = System.currentTimeMillis();
        if (owner.getLockedUntil() != null && now < owner.getLockedUntil()) {
            throw new BadCredentialsException("Invalid email or password");
        }

        if (!passwordEncoder.matches(password, owner.getPassword())) {
            int failedAttempts = owner.getFailedLoginAttempts() + 1;
            owner.setFailedLoginAttempts(failedAttempts);
            if (failedAttempts >= 5) {
                owner.setLockedUntil(now + (15 * 60 * 1000L));
                owner.setFailedLoginAttempts(0);
            }
            ownerRepository.save(owner);
            throw new BadCredentialsException("Invalid email or password");
        }

        owner.setFailedLoginAttempts(0);
        owner.setLockedUntil(null);
        ownerRepository.save(owner);

        String normalizedEmail = owner.getEmail().trim().toLowerCase();
        String accessToken = jwtService.generateToken(normalizedEmail);
        logger.info("Owner login successful: {}", normalizedEmail);
        return new AuthLoginResult(accessToken, normalizedEmail, "OWNER");
    }
}