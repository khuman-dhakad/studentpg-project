package com.studentpg.security.jwt;

import com.studentpg.security.jwt.entity.RefreshToken;
import com.studentpg.security.jwt.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository repository;

    /**
     * Revokes a refresh token.
     *
     * The raw token is never searched directly in the database.
     * We hash it first and search using the stored hash.
     */
    public void revokeToken(String token) {

        if (token == null || token.isBlank()) {
            return;
        }

        String tokenHash = hashToken(token);

        repository.findByTokenHash(tokenHash)
                .ifPresent(refreshToken -> {

                    refreshToken.setRevoked(true);

                    repository.save(refreshToken);
                });
    }

    /**
     * Creates a SHA-256 hash of the refresh token.
     */
    private String hashToken(String token) {

        try {

            MessageDigest digest =
                    MessageDigest.getInstance("SHA-256");

            byte[] hash =
                    digest.digest(
                            token.getBytes(StandardCharsets.UTF_8)
                    );

            return HexFormat.of().formatHex(hash);

        } catch (NoSuchAlgorithmException e) {

            throw new IllegalStateException(
                    "SHA-256 algorithm is not available",
                    e
            );
        }
    }
}