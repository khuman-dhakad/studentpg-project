package com.studentpg.security.jwt.repository;

import com.studentpg.security.jwt.entity.RefreshToken;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.Instant;
import java.util.Optional;

public interface RefreshTokenRepository

        extends MongoRepository<RefreshToken, String> {

    Optional<RefreshToken> findByTokenHash(String tokenHash);

    void deleteByUsername(String username);
    void deleteByRevokedTrue();
    void deleteByExpiryDateBefore(Instant now);
void deleteByTokenHash(String tokenHash);
    
}