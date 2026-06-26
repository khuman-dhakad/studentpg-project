package com.studentpg.controller;

import com.studentpg.model.PG;
import com.studentpg.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/pgs/pending")
    public List<PG> getPendingPGs() {
        return adminService.getPendingPGs();
    }
    @PutMapping("/pgs/{id}/approve")
    public String approvePG(@PathVariable String id) {
    return adminService.approvePG(id);
   }
}