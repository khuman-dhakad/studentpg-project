package com.studentpg.modules.owner.repository;

import com.studentpg.modules.owner.entity.Owner;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

import com.studentpg.modules.owner.entity.VerificationStatus;

public interface OwnerRepository extends MongoRepository<Owner, String> {
    boolean existsByEmail(String email);
    Optional<Owner> findByEmail(String email);
    Optional<Owner> findByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email);
    List<Owner> findByVerificationStatus(VerificationStatus verificationStatus);
}