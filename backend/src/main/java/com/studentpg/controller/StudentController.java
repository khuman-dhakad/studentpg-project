package com.studentpg.controller;

import com.studentpg.model.PG;
import com.studentpg.service.StudentService;
import com.studentpg.service.PGService; // 👈 FIXED: PGService ko import kiya real owner logic ke liye
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private PGService pgService; // 👈 FIXED: PGService bean ko inject kiya bina purane code ko chhede

    @GetMapping("/pgs")
    public List<PG> getApprovedPGs() {
        return studentService.getApprovedPGs();
    }

    // =========================================================================
    // CRITICAL DYNAMIC FIX: Yeh student ke click par owner data automatic load karega
    // =========================================================================
    @GetMapping("/pgs/{id}")
    public PG getPGDetails(@PathVariable String id) {
        // Purane studentService ki jagah humne pgService ka use kiya jo owner data match karta hai
        return pgService.getPGById(id); 
    }

    @GetMapping("/pgs/search")
    public List<PG> searchByCity(@RequestParam String city) {
        return studentService.searchByCity(city);
    }

    @GetMapping("/pgs/search/gender")
    public List<PG> filterByGender(@RequestParam String gender) {
        return studentService.filterByGender(gender);
    }

    @GetMapping("/pgs/search/rent")
    public List<PG> filterByRent(@RequestParam double rent) {
        return studentService.filterByRent(rent);
    }

    @GetMapping("/pgs/filter")
    public List<PG> filterPGs(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double maxRent,
            @RequestParam(required = false) Boolean food,
            @RequestParam(required = false) Boolean wifi,
            @RequestParam(required = false) Boolean parking,
            @RequestParam(required = false) Boolean laundry,
            @RequestParam(required = false) String roomType) {

        return studentService.filterPGs(
                city,
                category,
                maxRent,
                food,
                wifi,
                parking,
                laundry,
                roomType);
    }
}