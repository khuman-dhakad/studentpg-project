package com.studentpg.security.userdetails;

import com.studentpg.modules.owner.entity.Owner;
import com.studentpg.modules.owner.repository.OwnerRepository;
import com.studentpg.modules.admin.entity.Admin;
import com.studentpg.modules.admin.repository.AdminRepository;
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

    @Autowired
    private AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        Owner owner = ownerRepository.findByEmail(email);

        if (owner != null) {
            return User.builder()
                    .username(owner.getEmail())
                    .password(owner.getPassword())
                    .roles(owner.getRole())
                    .build();
        }

        Admin admin = adminRepository.findByEmail(email);

        if (admin != null) {
            return User.builder()
                    .username(admin.getEmail())
                    .password(admin.getPassword())
                    .roles(admin.getRole())
                    .build();
        }

        throw new UsernameNotFoundException("User not found");
    }
}