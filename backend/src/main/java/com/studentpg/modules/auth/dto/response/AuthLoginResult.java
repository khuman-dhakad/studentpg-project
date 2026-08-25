package com.studentpg.modules.auth.dto.response;

public record AuthLoginResult(
        String accessToken,
        String email,
        String role
) {
}