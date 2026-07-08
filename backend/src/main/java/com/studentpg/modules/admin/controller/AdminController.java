package com.studentpg.modules.admin.controller;

import com.studentpg.modules.pg.entity.PG;
import com.studentpg.modules.admin.service.AdminService;
import com.studentpg.common.response.PagedResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/pgs/pending")
    public PagedResponse<PG> getPendingPGs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        Pageable pageable = com.studentpg.common.util.PageableUtils.build(page, size, sortBy, direction);
        Page<PG> result = adminService.getPendingPGs(pageable);

        return new PagedResponse<>(
                result.getContent(),
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages());
    }

    @PutMapping("/pgs/{id}/approve")
    public String approvePG(@PathVariable String id) {
        return adminService.approvePG(id);
    }

    @DeleteMapping("/pgs/{id}")
    public String rejectPG(@PathVariable String id) {
        return adminService.rejectPG(id);
    }

    @GetMapping("/pgs/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(adminService.getAdminStats());
    }

    @GetMapping("/pgs")
    public PagedResponse<PG> getPGs(
            @RequestParam(defaultValue = "ALL") String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        Pageable pageable = com.studentpg.common.util.PageableUtils.build(page, size, sortBy, direction);
        Page<PG> result = adminService.getAllPGsByStatus(status, pageable);

        return new PagedResponse<>(
                result.getContent(),
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages());
    }

    @GetMapping("/pgs/suggestions")
    public ResponseEntity<List<PG>> getSuggestions(@RequestParam String query) {
        return ResponseEntity.ok(adminService.getSearchSuggestions(query));
    }
}