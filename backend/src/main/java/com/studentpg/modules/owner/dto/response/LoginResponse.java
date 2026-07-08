package com.studentpg.modules.owner.dto.response;

public class LoginResponse {

    private String message;
    private String token;
    private String type;
    private String email;
    private String role;

    public LoginResponse() {}

    public LoginResponse(String message, String token, String type, String email, String role) {
        this.message = message;
        this.token = token;
        this.type = type;
        this.email = email;
        this.role = role;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}