package com.studentpg.modules.publicapi.controller;

import com.studentpg.modules.student.dto.response.PGDetailsResponse;
import com.studentpg.modules.student.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/pg")
@CrossOrigin(origins = "${app.frontend.url}", allowCredentials = "true")
@RequiredArgsConstructor
public class PublicPGController {

    private final StudentService studentService;

    @GetMapping("/{id}")
    public PGDetailsResponse getPublicPG(@PathVariable String id) {
        return studentService.getPGDetails(id);
    }

}
 