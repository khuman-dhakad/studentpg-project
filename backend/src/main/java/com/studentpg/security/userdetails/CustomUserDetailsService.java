package com.studentpg.security.userdetails;

import com.studentpg.modules.admin.entity.Admin;
import com.studentpg.modules.admin.repository.AdminRepository;
import com.studentpg.modules.owner.entity.Owner;
import com.studentpg.modules.owner.repository.OwnerRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService
        implements UserDetailsService {


    private final OwnerRepository ownerRepository;

    private final AdminRepository adminRepository;


    @Override
    public UserDetails loadUserByUsername(
            String email
    ) throws UsernameNotFoundException {


        /*
         * ============================================================
         * 1. VALIDATE EMAIL
         * ============================================================
         */

        if (
                email == null
                        || email.isBlank()
        ) {

            throw new UsernameNotFoundException(
                    "User not found"
            );
        }


        /*
         * ============================================================
         * 2. NORMALIZE EMAIL
         * ============================================================
         */

        String normalizedEmail =
                email
                        .trim()
                        .toLowerCase();


        /*
         * ============================================================
         * 3. SEARCH OWNER
         * ============================================================
         */
        

        Owner owner =
                ownerRepository
                        .findByEmailIgnoreCase(
                                normalizedEmail
                        )
                        .orElse(null);

        if (owner != null) {
            if (!owner.isActive()) {
                throw new UsernameNotFoundException(
                        "User not found"
                );
            }

            return new StudentPgUserDetails(
                    owner.getId(),
                    owner.getEmail().trim().toLowerCase(),
                    owner.getPassword(),
                    owner.getRole(),
                    owner.getTokenVersion(),
                    owner.isActive()
            );
        }


        /*
         * ============================================================
         * 4. SEARCH ADMIN
         * ============================================================
         */

        Admin admin =
                adminRepository
                        .findByEmailIgnoreCase(
                                normalizedEmail
                        )
                        .orElse(null);


        if (
                admin != null
        ) {

            /*
             * Disabled admin must not authenticate.
             */

            if (
                    !admin.isActive()
            ) {

                throw new UsernameNotFoundException(
                        "User not found"
                );
            }


            return new StudentPgUserDetails(
                    admin.getId(),
                    admin.getEmail().trim().toLowerCase(),
                    admin.getPassword(),
                    admin.getRole(),
                    0L,
                    admin.isActive()
            );
        }


        /*
         * ============================================================
         * 5. USER NOT FOUND
         * ============================================================
         */

        throw new UsernameNotFoundException(
                "User not found"
        );
    }


    /*
     * ============================================================
     * BUILD USER DETAILS
     * ============================================================
     */

    private UserDetails buildUserDetails(
            String email,
            String password,
            String role
    ) {


        if (
                email == null
                        || email.isBlank()
        ) {

            throw new UsernameNotFoundException(
                    "User email is not configured"
            );
        }


        if (
                password == null
                        || password.isBlank()
        ) {

            throw new UsernameNotFoundException(
                    "User password is not configured"
            );
        }


        if (
                role == null
                        || role.isBlank()
        ) {

            throw new UsernameNotFoundException(
                    "User role is not configured"
            );
        }


        return User
                .builder()
                .username(
                        email
                                .trim()
                                .toLowerCase()
                )
                .password(
                        password
                )
                .roles(
                        normalizeRole(role)
                )
                .build();
    }


    /*
     * ============================================================
     * NORMALIZE ROLE
     * ============================================================
     *
     * Database:
     *
     * OWNER
     *
     * becomes:
     *
     * ROLE_OWNER
     *
     *
     * Database:
     *
     * ROLE_ADMIN
     *
     * becomes:
     *
     * ROLE_ADMIN
     *
     * because .roles("ADMIN")
     * automatically adds ROLE_.
     */

    private String normalizeRole(
            String role
    ) {


        String normalizedRole =
                role
                        .trim()
                        .toUpperCase();


        if (
                normalizedRole
                        .startsWith(
                                "ROLE_"
                        )
        ) {

            return normalizedRole
                    .substring(
                            5
                    );
        }


        return normalizedRole;
    }
}