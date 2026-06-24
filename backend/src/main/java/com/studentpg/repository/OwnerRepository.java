package com.studentpg.repository;

import com.studentpg.model.Owner;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface OwnerRepository extends MongoRepository<Owner, String> {

    boolean existsByEmail(String email);

    Owner findByEmail(String email);
}