package com.studentpg.security.config;

import com.studentpg.modules.admin.entity.Admin;
import com.studentpg.modules.admin.repository.AdminRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminSeeder
        implements CommandLineRunner {


    private static final Logger logger =

            LoggerFactory.getLogger(
                    AdminSeeder.class
            );


    private final AdminRepository adminRepository;

    private final PasswordEncoder passwordEncoder;


    @Value("${admin.seed.email}")
    private String seedEmail;


    @Value("${admin.seed.password}")
    private String seedPassword;


    public AdminSeeder(

            AdminRepository adminRepository,

            PasswordEncoder passwordEncoder

    ) {

        this.adminRepository =
                adminRepository;

        this.passwordEncoder =
                passwordEncoder;
    }


    @Override
    public void run(

            String... args

    ) {


        if (

                seedEmail == null
                        || seedEmail.isBlank()

        ) {

            throw new IllegalStateException(

                    "admin.seed.email is not configured"

            );
        }


        if (

                seedPassword == null
                        || seedPassword.isBlank()

        ) {

            throw new IllegalStateException(

                    "admin.seed.password is not configured"

            );
        }


        String email =

                seedEmail
                        .trim()
                        .toLowerCase();


        if (

                adminRepository
                        .existsByEmailIgnoreCase(email)

        ) {

            logger.info(

                    "Default admin already exists: {}",

                    email

            );

            return;
        }


        Admin admin =

                new Admin(

                        "Super Admin",

                        email,

                        passwordEncoder.encode(

                                seedPassword

                        ),

                        "ADMIN"

                );


        try {
            adminRepository.save(admin);
            logger.info("Default admin created successfully: {}", email);
        } catch (org.springframework.dao.DuplicateKeyException ex) {
            logger.info("Default admin already initialized by another instance: {}", email);
        }
    }
}