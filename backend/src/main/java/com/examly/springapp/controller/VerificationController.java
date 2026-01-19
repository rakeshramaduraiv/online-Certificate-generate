package com.examly.springapp.controller;

import com.examly.springapp.entity.Certificate;
import com.examly.springapp.service.CertificateService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/verify")
@RequiredArgsConstructor
public class VerificationController {
    private final CertificateService certificateService;

    @GetMapping("/{code}")
    public ResponseEntity<?> verifyCertificate(@PathVariable String code, HttpServletRequest request) {
        String verifierInfo = request.getHeader("User-Agent");
        String ipAddress = getClientIpAddress(request);
        
        Certificate certificate = certificateService.verifyCertificate(code, verifierInfo, ipAddress);
        
        if (certificate != null) {
            return ResponseEntity.ok(certificate);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedForHeader = request.getHeader("X-Forwarded-For");
        if (xForwardedForHeader == null) {
            return request.getRemoteAddr();
        } else {
            return xForwardedForHeader.split(",")[0];
        }
    }
}