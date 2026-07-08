package com.studentpg.security.config;


import com.studentpg.modules.admin.entity.Admin;
import com.studentpg.modules.admin.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminSeeder implements CommandLineRunner {

    private final AdminRepository adminRepository;

    @Value("${admin.seed.email}")
    private String seedEmail;

    @Value("${admin.seed.password}")
    private String seedPassword;

    public AdminSeeder(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @Override
    public void run(String... args) {

        if (!adminRepository.existsByEmail(seedEmail)) {

            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

            Admin admin = new Admin(
                    "Super Admin",
                    seedEmail,
                    encoder.encode(seedPassword),
                    "ADMIN"
            );

            adminRepository.save(admin);
            System.out.println("=== Default admin created: " + seedEmail);
        }
    }
}