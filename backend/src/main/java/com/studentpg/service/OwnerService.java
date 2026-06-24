package com.studentpg.service;

import com.studentpg.model.Owner;
import com.studentpg.repository.OwnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.studentpg.model.Owner;

@Service
public class OwnerService {

    @Autowired
    private OwnerRepository ownerRepository;

    private BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public String registerOwner(Owner owner) {

        if (ownerRepository.existsByEmail(owner.getEmail())) {
            return "Email already exists";
        }

        owner.setRole("OWNER");

        owner.setPassword(
                passwordEncoder.encode(owner.getPassword())
        );

        ownerRepository.save(owner);

        return "Owner registered successfully";
    }
    public String loginOwner(String email, String password) {

    Owner owner = ownerRepository.findByEmail(email);

    if (owner == null) {
        return "Owner not found";
    }

    if (passwordEncoder.matches(password, owner.getPassword())) {
        return "Login successful";
    }

    return "Invalid password";
}
}