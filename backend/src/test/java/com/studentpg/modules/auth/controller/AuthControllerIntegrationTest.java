package com.studentpg.modules.auth.controller;

import com.studentpg.modules.admin.entity.Admin;
import com.studentpg.modules.admin.repository.AdminRepository;
import com.studentpg.modules.auth.service.AuthService;
import com.studentpg.modules.owner.repository.OwnerRepository;
import com.studentpg.security.filter.JwtAuthenticationFilter;
import com.studentpg.security.jwt.JwtService;
import com.studentpg.security.userdetails.CustomUserDetailsService;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@Import({
        com.studentpg.security.config.SecurityConfig.class,
        JwtAuthenticationFilter.class,
        CustomUserDetailsService.class,
        JwtService.class,
        AuthService.class
})
@TestPropertySource(properties = {
        "jwt.secret=test-secret-key-that-is-at-least-32-bytes-long",
        "jwt.expiration=3600000",
        "app.cookie.secure=false",
        "app.cookie.same-site=Lax",
        "admin.seed.email=admin@example.com",
        "admin.seed.password=Admin123!"
})
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @MockBean
    private AdminRepository adminRepository;

    @MockBean
    private OwnerRepository ownerRepository;

    @Autowired
    private JwtService jwtService;

    @Test
    void loginSetsCookieAndSessionEndpointReturnsAuthenticated() throws Exception {
        Admin admin = new Admin();
        admin.setName("Admin");
        admin.setEmail("admin@example.com");
        admin.setPassword(passwordEncoder.encode("Secret123!"));
        admin.setRole("ADMIN");
        admin.setActive(true);

        when(adminRepository.findByEmailIgnoreCase("admin@example.com"))
                .thenReturn(Optional.of(admin));

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"admin@example.com\",\"password\":\"Secret123!\"}"))
                .andExpect(status().isOk())
                .andExpect(cookie().exists("access_token"))
                .andExpect(jsonPath("$.message").value("Login successful"))
                .andReturn();

        String token = jwtService.generateToken("admin@example.com");

        mockMvc.perform(get("/api/auth/session")
                        .cookie(new Cookie("access_token", token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isAuthenticated").value(true))
                .andExpect(jsonPath("$.user.email").value("admin@example.com"))
                .andExpect(jsonPath("$.user.role").value("ADMIN"));
    }
}
