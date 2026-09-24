package com.studentpg.modules.publicapi.controller;

import com.studentpg.modules.student.dto.response.NearbyPGResponse;
import com.studentpg.modules.student.service.StudentService;
import com.studentpg.security.jwt.JwtService;
import com.studentpg.security.userdetails.CustomUserDetailsService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.anyDouble;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PublicPGController.class)
@AutoConfigureMockMvc(addFilters = false)
class PublicPGControllerNearbyTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StudentService studentService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    void nearbyPGs_returnsOk_forValidRequest() throws Exception {
        NearbyPGResponse response = new NearbyPGResponse();
        response.setId("pg-1");
        response.setPgName("Sunny Stay PG");
        response.setCity("Bhopal");
        response.setLatitude(23.2599);
        response.setLongitude(77.4126);
        response.setDistanceKm(BigDecimal.valueOf(1.8));

        when(studentService.searchNearbyPGs(anyDouble(), anyDouble(), anyDouble()))
                .thenReturn(List.of(response));

        mockMvc.perform(get("/api/public/pg/nearby")
                        .param("latitude", "23.2599")
                        .param("longitude", "77.4126")
                        .param("radiusKm", "5")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void nearbyPGs_returnsBadRequest_forInvalidLatitude() throws Exception {
        mockMvc.perform(get("/api/public/pg/nearby")
                        .param("latitude", "91")
                        .param("longitude", "77.4126")
                        .param("radiusKm", "5")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }
}
