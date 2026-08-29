package com.studentpg.security.jwt;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;


import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


import javax.crypto.SecretKey;


import java.nio.charset.StandardCharsets;
import java.util.Date;


@Service
public class JwtService {


       
        private static final Logger logger =
        LoggerFactory.getLogger(JwtService.class);

        private SecretKey signingKey;

    @Value("${jwt.secret}")
    private String secret;


    @Value("${jwt.expiration}")
    private long jwtExpiration;


   private SecretKey getSigningKey() {
    return signingKey;
}



     public String generateToken(String email) {
         return generateToken(email, 0L);
     }

     public String generateToken(String email, long tokenVersion) {
         Date now = new Date();
         Date expiry = new Date(now.getTime() + jwtExpiration);

         return Jwts.builder()
             .id(java.util.UUID.randomUUID().toString())
             .subject(email)
             .claim("tokenVersion", tokenVersion)
             .issuedAt(now)
             .issuer("StudentPG")
             .expiration(expiry)
             .signWith(getSigningKey())
             .compact();
     }

     public Long extractTokenVersion(String token) {
         try {
             Claims claims = extractAllClaims(token);
             Object versionObj = claims.get("tokenVersion");
             if (versionObj instanceof Number) {
                 return ((Number) versionObj).longValue();
             }
             return null;
         } catch (Exception e) {
             return null;
         }
     }
 

    public String extractEmail(

            String token

    ) {


        return extractAllClaims(

                token

        )

                .getSubject();

    }


    private Claims extractAllClaims(String token) {

    return Jwts.parser()
            .verifyWith(signingKey)
            .build()
            .parseSignedClaims(token)
            .getPayload();
}


    @PostConstruct
public void init() {

    if (secret == null || secret.isBlank()) {
        throw new IllegalStateException("JWT_SECRET is not configured");
    }

    byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);

    if (keyBytes.length < 32) {
        throw new IllegalStateException(
                "JWT_SECRET must be at least 32 bytes long"
        );
    }

    signingKey = Keys.hmacShaKeyFor(keyBytes);

    logger.info("JWT signing key initialized.");
}


    public boolean isTokenValid(
            String token,
            String email,
            Long expectedTokenVersion
    ) {
        try {
            Claims claims = extractAllClaims(token);
            String tokenEmail = claims.getSubject();
            Date expiration = claims.getExpiration();

            boolean emailMatches = tokenEmail != null && tokenEmail.equalsIgnoreCase(email);
            boolean notExpired = expiration != null && expiration.after(new Date());

            if (!emailMatches || !notExpired) {
                return false;
            }

            if (expectedTokenVersion != null) {
                Object versionObj = claims.get("tokenVersion");
                if (!(versionObj instanceof Number)) {
                    return false;
                }
                long tokenVersion = ((Number) versionObj).longValue();
                if (tokenVersion != expectedTokenVersion) {
                    logger.debug("JWT tokenVersion mismatch: token={}, expected={}", tokenVersion, expectedTokenVersion);
                    return false;
                }
            }

            return true;
        } catch (ExpiredJwtException ex) {
            logger.debug("JWT expired.");
            return false;
        } catch (JwtException ex) {
            logger.warn("Invalid JWT.");
            return false;
        } catch (Exception ex) {
            logger.error("JWT validation error.", ex);
            return false;
        }
    }

    public boolean isTokenValid(
            String token,
            String email
    ) {
        return isTokenValid(token, email, null);
    }

}