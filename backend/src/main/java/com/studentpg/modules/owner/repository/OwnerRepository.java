package com.studentpg.modules.owner.repository;

import com.studentpg.modules.owner.entity.Owner;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface OwnerRepository extends MongoRepository<Owner, String> {
    boolean existsByEmail(String email);
    Owner findByEmail(String email);
}