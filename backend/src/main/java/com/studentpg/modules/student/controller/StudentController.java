package com.studentpg.modules.student.controller;

import com.studentpg.common.response.PagedResponse;
import com.studentpg.common.util.PageableUtils;
import com.studentpg.modules.pg.entity.PG;
import com.studentpg.modules.student.service.StudentService;
import com.studentpg.modules.pg.service.PGService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private PGService pgService;

    @GetMapping("/pgs")
    public PagedResponse<PG> getApprovedPGs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        Pageable pageable = PageableUtils.build(page, size, sortBy, direction);
        Page<PG> result = studentService.getApprovedPGs(pageable);

        return toPagedResponse(result);
    }

    @GetMapping("/pgs/{id}")
    public PG getPGDetails(@PathVariable String id) {
        return pgService.getPGById(id);
    }

    @GetMapping("/pgs/search")
    public PagedResponse<PG> searchByCity(
            @RequestParam String city,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        Pageable pageable = PageableUtils.build(page, size, sortBy, direction);
        return toPagedResponse(studentService.searchByCity(city, pageable));
    }

    @GetMapping("/pgs/search/gender")
    public PagedResponse<PG> filterByGender(
            @RequestParam String gender,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        Pageable pageable = PageableUtils.build(page, size, sortBy, direction);
        return toPagedResponse(studentService.filterByGender(gender, pageable));
    }

    @GetMapping("/pgs/search/rent")
    public PagedResponse<PG> filterByRent(
            @RequestParam double rent,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        Pageable pageable = PageableUtils.build(page, size, sortBy, direction);
        return toPagedResponse(studentService.filterByRent(rent, pageable));
    }

    @GetMapping("/pgs/filter")
    public PagedResponse<PG> filterPGs(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double maxRent,
            @RequestParam(required = false) Boolean food,
            @RequestParam(required = false) Boolean wifi,
            @RequestParam(required = false) Boolean parking,
            @RequestParam(required = false) Boolean laundry,
            @RequestParam(required = false) String roomType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        Pageable pageable = PageableUtils.build(page, size, sortBy, direction);
        Page<PG> result = studentService.filterPGs(
                city, category, maxRent, food, wifi, parking, laundry, roomType, pageable);

        return toPagedResponse(result);
    }
    @GetMapping("/pgs/search-suggestions")
public List<PG> getSearchSuggestions(@RequestParam("q") String query) {
    return studentService.getSearchSuggestions(query);
}

    private PagedResponse<PG> toPagedResponse(Page<PG> result) {
        return new PagedResponse<>(
                result.getContent(), result.getNumber(), result.getSize(),
                result.getTotalElements(), result.getTotalPages());
    }
}