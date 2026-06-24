package com.studentpg.controller;

import com.studentpg.model.Owner;
import com.studentpg.service.OwnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/owners")
@CrossOrigin("*")
public class OwnerController {

    @Autowired
    private OwnerService ownerService;

    @PostMapping("/register")
    public String registerOwner(@RequestBody Owner owner) {
        return ownerService.registerOwner(owner);
    }
    @PostMapping("/login")
public String loginOwner(
        @RequestParam String email,
        @RequestParam String password) {

    return ownerService.loginOwner(email, password);
}
}