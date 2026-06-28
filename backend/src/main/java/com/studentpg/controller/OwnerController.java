package com.studentpg.controller;

import com.studentpg.dto.LoginResponse;
import com.studentpg.dto.OwnerLoginRequest;
import com.studentpg.dto.OwnerRegisterRequest;
import com.studentpg.service.OwnerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/owners")
@CrossOrigin("*")
public class OwnerController {

    @Autowired
    private OwnerService ownerService;

    @PostMapping("/register")
    public String registerOwner(
            @Valid @RequestBody OwnerRegisterRequest request) {

        return ownerService.registerOwner(request);
    }

    @PostMapping("/login")
    public LoginResponse loginOwner(
            @Valid @RequestBody OwnerLoginRequest request) {

        return ownerService.loginOwner(request);
    }
}