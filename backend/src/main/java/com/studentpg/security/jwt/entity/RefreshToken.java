package com.studentpg.security.jwt.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "refresh_tokens")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RefreshToken {

    @Id
    private String id;

    /**
     * SHA-256 hash of the actual refresh token.
     *
     * Never store the raw refresh token in the database.
     */
    @Indexed(unique = true)
    private String tokenHash;

    /**
     * User email / username associated with this refresh token.
     */
    @Indexed
    private String username;

    /**
     * MongoDB automatically removes the document
     * after this time.
     */
    @Indexed(expireAfter = "0s")
    private Instant expiryDate;

    /**
     * True means this refresh token can no longer be used.
     */
    private boolean revoked;
    private Instant createdAt;
private Instant lastUsedAt;
}