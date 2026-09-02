package com.studentpg.modules.app.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.bson.Document;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.studentpg.security.jwt.JwtService;
import com.studentpg.security.userdetails.CustomUserDetailsService;
import com.studentpg.infrastructure.email.EmailService;
import com.studentpg.infrastructure.cloudinary.CloudinaryService;
import org.springframework.data.mongodb.core.MongoTemplate;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ContactController.class)
@AutoConfigureMockMvc(addFilters = false)
@org.springframework.test.context.TestPropertySource(properties = "app.captcha.secret=test-secret")
class ContactControllerCaptchaTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

        @MockBean
        private JwtService jwtService;

        @MockBean
        private CustomUserDetailsService userDetailsService;

        @MockBean
        private MongoTemplate mongoTemplate;

        @MockBean
        private EmailService emailService;

        @MockBean
        private CloudinaryService cloudinaryService;

    @Test
    void captchaEndpoint_shouldReturnQuestionAndToken() throws Exception {
        mockMvc.perform(get("/api/public/captcha"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.question").exists())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.expiresAt").exists());
    }

    @Test
    void contact_shouldRejectInvalidCaptcha() throws Exception {
        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                        {
                          "name": "Student Test",
                          "email": "student@example.com",
                          "subject": "Help",
                          "message": "Need help with a PG listing",
                          "captchaToken": "bad-token",
                          "captchaAnswer": "999",
                          "website": ""
                        }
                        """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void contact_shouldRejectHoneypotSubmission() throws Exception {
        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                        {
                          "name": "Student Test",
                          "email": "student@example.com",
                          "subject": "Help",
                          "message": "Need help with a PG listing",
                          "captchaToken": "valid-token",
                          "captchaAnswer": "7",
                          "website": "https://example.com"
                        }
                        """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void contact_shouldRejectReusedCaptcha() throws Exception {
        String captchaJson = mockMvc.perform(get("/api/public/captcha"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        JsonNode captcha = objectMapper.readTree(captchaJson);
        String token = captcha.get("token").asText();
        String question = captcha.get("question").asText();
        String[] tokens = question.split("\\+");
        int answer = Integer.parseInt(tokens[0].trim()) + Integer.parseInt(tokens[1].replace("= ?", "").trim());

        String payload = """
                {
                  "name": "Student Test",
                  "email": "student@example.com",
                  "subject": "Help",
                  "message": "Need help with a PG listing",
                  "captchaToken": "%s",
                  "captchaAnswer": "%d",
                  "website": ""
                }
                """.formatted(token, answer);

        when(mongoTemplate.findAndModify(
                any(), any(), any(), eq(Document.class), eq("captcha_tokens")))
                .thenReturn(new org.bson.Document("answer", answer))
                .thenReturn(null);
        when(mongoTemplate.findAndModify(
                any(), any(), any(), eq(Document.class), eq("request_rate_limits")))
                .thenReturn(new Document("count", 1));

        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest());
    }
}
