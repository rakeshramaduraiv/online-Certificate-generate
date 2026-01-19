package com.examly.springapp.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WelcomeController {

    @GetMapping("/")
    public String welcome() {
        return "Online Course Certificate Generator System - Backend is running!";
    }

    @GetMapping("/health")
    public String health() {
        return "OK";
    }
}