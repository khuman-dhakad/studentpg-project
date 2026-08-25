package com.studentpg.modules.auth.dto.response;

public record LoginResponse(
        String message,
        String email,
        String role
) {
}