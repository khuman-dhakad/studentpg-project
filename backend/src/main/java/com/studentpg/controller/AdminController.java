package com.studentpg.controller;

import com.studentpg.model.PG;
import com.studentpg.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
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

    // === Aapka Existing Code ===
    @GetMapping("/pgs/pending")
    public List<PG> getPendingPGs() {
        return adminService.getPendingPGs();
    }

    @PutMapping("/pgs/{id}/approve")
    public String approvePG(@PathVariable String id) {
        return adminService.approvePG(id);
    }

    @DeleteMapping("/pgs/{id}")
    public String rejectPG(@PathVariable String id) {
        return adminService.rejectPG(id);
    }

    // === Naye Endpoints ===

    @GetMapping("/pgs/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(adminService.getAdminStats());
    }

    @GetMapping("/pgs")
    public ResponseEntity<List<PG>> getPGs(@RequestParam(defaultValue = "ALL") String status) {
        return ResponseEntity.ok(adminService.getAllPGsByStatus(status));
    }

    @GetMapping("/pgs/suggestions")
    public ResponseEntity<List<PG>> getSuggestions(@RequestParam String query) {
        return ResponseEntity.ok(adminService.getSearchSuggestions(query));
    }
}