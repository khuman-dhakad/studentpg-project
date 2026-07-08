package com.studentpg.modules.admin.repository;

import com.studentpg.modules.admin.entity.Admin;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AdminRepository extends MongoRepository<Admin, String> {
    Admin findByEmail(String email);
    boolean existsByEmail(String email);
}