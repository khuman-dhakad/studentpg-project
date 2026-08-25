package com.studentpg.modules.publicapi.controller;

import com.studentpg.modules.student.dto.response.PGDetailsResponse;
import com.studentpg.modules.student.service.StudentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PublicPGController.class)
class PublicPGControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StudentService studentService;

    @Test
    void getPublicPG_returnsOk() throws Exception {
        PGDetailsResponse resp = new PGDetailsResponse();
        resp.setId("pg1");

        when(studentService.getPGDetails("pg1")).thenReturn(resp);

        mockMvc.perform(get("/api/public/pg/pg1").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }
}
