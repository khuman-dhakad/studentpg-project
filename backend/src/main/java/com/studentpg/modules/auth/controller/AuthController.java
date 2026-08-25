package com.studentpg.modules.auth.controller;

import com.studentpg.modules.auth.dto.request.LoginRequest;
import com.studentpg.modules.auth.dto.response.AuthLoginResult;
import com.studentpg.modules.auth.dto.response.LoginResponse;
import com.studentpg.modules.auth.service.AuthService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Map;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {


    private static final String ACCESS_TOKEN_COOKIE =
            "access_token";


    private final AuthService authService;


    @Value("${app.cookie.secure:false}")
    private boolean secureCookie;

    @Value("${app.cookie.domain:}")
     private String cookieDomain;


    @Value("${app.cookie.same-site:Lax}")
    private String sameSite;


    @Value("${jwt.expiration}")
    private long jwtExpiration;


    /*
     * =====================================================
     * LOGIN
     * =====================================================
     *
     * POST /api/auth/login
     *
     */

@PostMapping("/login")
public ResponseEntity<LoginResponse> login(

        @Valid
        @RequestBody
        LoginRequest request

) {

    AuthLoginResult result =
            authService.login(request);


ResponseCookie.ResponseCookieBuilder cookieBuilder =
        ResponseCookie.from(
                ACCESS_TOKEN_COOKIE,
                result.accessToken()
        )
        .httpOnly(true)
        .secure(secureCookie)
        .sameSite(sameSite)
        .path("/")
        .maxAge(Duration.ofMillis(jwtExpiration));

if (!cookieDomain.isBlank()) {

    cookieBuilder.domain(cookieDomain);
}

ResponseCookie accessCookie =
        cookieBuilder.build();
        


    LoginResponse response =

            new LoginResponse(

                    "Login successful",

                    result.email(),

                    result.role()

            );


    return ResponseEntity

            .ok()

            .header( HttpHeaders.SET_COOKIE,  accessCookie.toString()            )
             .header(HttpHeaders.CACHE_CONTROL, "no-store")

        .header(HttpHeaders.PRAGMA, "no-cache")
         .header(
                "X-Content-Type-Options",
                "nosniff"
        )
        .header(
                "X-Frame-Options",
                "DENY"
        )

            .body(response);
}

    /*
     * =====================================================
     * CURRENT SESSION
     * =====================================================
     *
     * GET /api/auth/session
     *
     */

    @GetMapping("/session")
    public ResponseEntity<Map<String, Object>> getSession(

            Authentication authentication

    ) {


        /*
         * =================================================
         * NOT AUTHENTICATED
         * =================================================
         */

        if (

                authentication == null

                        || !authentication.isAuthenticated()

        ) {


            Map<String, Object> response =
                    new LinkedHashMap<>();


            response.put(
                    "isAuthenticated",
                    false
            );


            response.put(
                    "user",
                    null
            );


            response.put(
                    "profile",
                    null
            );


            return ResponseEntity.ok(response);
        }


        /*
         * =================================================
         * AUTHENTICATED USER
         * =================================================
         */

        String email =
                authentication.getName();


        String role =

                authentication

                        .getAuthorities()

                        .stream()

                        .findFirst()

                        .map(
                                GrantedAuthority::getAuthority
                        )

                        .orElse("ROLE_USER");


        if (

                role.startsWith("ROLE_")

        ) {

            role =
                    role.substring(
                            "ROLE_".length()
                    );
        }


        /*
         * =================================================
         * USER OBJECT
         * =================================================
         */

        Map<String, Object> user =
                new LinkedHashMap<>();


        user.put(
                "email",
                email
        );


        user.put(
                "role",
                role
        );


        /*
         * =================================================
         * FINAL RESPONSE
         * =================================================
         */

        Map<String, Object> response =
                new LinkedHashMap<>();


        response.put(
                "isAuthenticated",
                true
        );


        response.put(
                "user",
                user
        );


        response.put(
                "profile",
                null
        );


        return ResponseEntity.ok(response);
    }


    /*
     * =====================================================
     * LOGOUT
     * =====================================================
     *
     * POST /api/auth/logout
     *
     */

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {

ResponseCookie.ResponseCookieBuilder cookieBuilder =
        ResponseCookie.from(
                ACCESS_TOKEN_COOKIE,
                ""
        )
        .httpOnly(true)
        .secure(secureCookie)
        .sameSite(sameSite)
        .path("/")
        .maxAge(0);

if (!cookieDomain.isBlank()) {

    cookieBuilder.domain(cookieDomain);
}

ResponseCookie deleteCookie =
        cookieBuilder.build();


        return ResponseEntity

                .ok()

                .header(
                        HttpHeaders.SET_COOKIE,
                        deleteCookie.toString()
                )
                .header(HttpHeaders.CACHE_CONTROL,"no-store")
                .header(HttpHeaders.PRAGMA,"no-cache")  
                  .header(
                "X-Content-Type-Options",
                "nosniff"
        )
        .header(
                "X-Frame-Options",
                "DENY"
        )

                .body(

                        Map.of(
                                "message",
                                "Logout successful"
                        )

                );
    }
}