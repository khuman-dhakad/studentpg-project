package com.studentpg.controller;

import com.studentpg.model.PG;
import com.studentpg.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @GetMapping("/pgs")
    public List<PG> getApprovedPGs() {
        return studentService.getApprovedPGs();
    }
    @GetMapping("/pgs/{id}")
    public PG getPGDetails(@PathVariable String id) {
    return studentService.getPGDetails(id);
    }
    @GetMapping("/pgs/search")
    public List<PG> searchByCity(@RequestParam String city) {
    return studentService.searchByCity(city);
    }
    @GetMapping("/pgs/search/gender")
    public List<PG> filterByGender(@RequestParam String gender) {
    return studentService.filterByGender(gender);
    }
}