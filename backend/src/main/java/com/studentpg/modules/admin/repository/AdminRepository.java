package com.studentpg.modules.admin.repository;

import com.studentpg.modules.admin.entity.Admin;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface AdminRepository
        extends MongoRepository<Admin, String> {


    Optional<Admin>
    findByEmailIgnoreCase(
            String email
    );


    boolean
    existsByEmailIgnoreCase(
            String email
    );
}