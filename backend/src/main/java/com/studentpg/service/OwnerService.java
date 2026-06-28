package com.studentpg.service;

import com.studentpg.dto.LoginResponse;
import com.studentpg.dto.OwnerLoginRequest;
import com.studentpg.dto.OwnerRegisterRequest;
import com.studentpg.model.Owner;
import com.studentpg.repository.OwnerRepository;
import com.studentpg.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
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
}