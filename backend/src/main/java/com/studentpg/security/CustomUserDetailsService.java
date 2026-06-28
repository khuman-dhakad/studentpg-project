package com.studentpg.security;

import com.studentpg.model.Owner;
import com.studentpg.repository.OwnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private OwnerRepository ownerRepository;

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        Owner owner = ownerRepository.findByEmail(email);

        if (owner == null) {
            throw new UsernameNotFoundException("Owner not found");
        }

        return User.builder()
                .username(owner.getEmail())
                .password(owner.getPassword())
                .roles(owner.getRole())
                .build();
    }
}