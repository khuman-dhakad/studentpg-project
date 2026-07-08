package com.studentpg;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class HelloController {

    @Autowired
    private MongoTemplate mongoTemplate;

    @GetMapping("/hello")
    public String hello() {
        return "Student pg Backend Running 🚀";
    }

    @GetMapping("/test-db")
    public String testDB() {
        return "Connected to DB: " + mongoTemplate.getDb().getName();
    }
}