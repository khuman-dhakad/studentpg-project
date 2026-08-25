package com.studentpg.modules.pg.controller;

import com.studentpg.modules.pg.entity.PG;
import com.studentpg.modules.pg.service.PGService;
import com.studentpg.security.jwt.JwtService;
import com.studentpg.security.userdetails.CustomUserDetailsService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PGController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(com.studentpg.common.exception.GlobalExceptionHandler.class)
@TestPropertySource(properties = {
        "jwt.secret=test-secret-key-that-is-at-least-32-bytes-long",
        "jwt.expiration=3600000"
})
class PGControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PGService pgService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    void createPGReturnsJsonMessagePayload() throws Exception {
        when(pgService.addPG(any(PG.class))).thenReturn("PG added successfully. Waiting for admin approval.");

        mockMvc.perform(post("/api/owner/pgs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "pgName": "Sunset PG",
                                  "address": "Main Road",
                                  "city": "Bhopal",
                                  "state": "MP",
                                  "pincode": "462001",
                                  "landmark": "Near Metro",
                                  "description": "Comfortable PG",
                                  "category": "HOSTEL",
                                  "rent": 6000,
                                  "securityDeposit": 10000,
                                  "noticePeriod": "1 Month",
                                  "gender": "MALE",
                                  "roomType": "SINGLE"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("PG added successfully. Waiting for admin approval."));
    }
}
