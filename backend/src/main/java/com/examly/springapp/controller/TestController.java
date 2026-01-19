package com.examly.springapp.controller;

import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class TestController {

    @GetMapping("/ping")
    public Map<String, String> ping() {
        return Map.of("message", "Backend is running!", "timestamp", String.valueOf(System.currentTimeMillis()));
    }

    @PostMapping("/register-test")
    public Map<String, Object> testRegister(@RequestBody Map<String, Object> data) {
        return Map.of(
            "received", data,
            "message", "Data received successfully"
        );
    }
}