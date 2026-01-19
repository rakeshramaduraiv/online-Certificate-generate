package com.examly.springapp.controller;

import com.examly.springapp.dto.CertificateRequest;
import com.examly.springapp.entity.Certificate;
import com.examly.springapp.entity.User;
import com.examly.springapp.security.UserPrincipal;
import com.examly.springapp.service.CertificateService;
import com.examly.springapp.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
@Slf4j
public class CertificateController {
    private final CertificateService certificateService;
    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('CERTIFICATE_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<List<Certificate>> getAllCertificates() {
        return ResponseEntity.ok(certificateService.getAllCertificates());
    }

    @GetMapping("/my")
    public ResponseEntity<List<Certificate>> getMyCertificates(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userService.getUserById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(certificateService.getCertificatesByRecipient(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Certificate> getCertificateById(@PathVariable Long id) {
        try {
            return certificateService.getCertificateById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            log.error("Error getting certificate by id: {}", e.getMessage());
            throw new RuntimeException("Failed to retrieve certificate");
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('CERTIFICATE_ADMIN') or hasRole('INSTRUCTOR') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<Certificate> createCertificate(@Valid @RequestBody CertificateRequest request) {
        Certificate certificate = certificateService.createCertificate(request);
        return ResponseEntity.ok(certificate);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CERTIFICATE_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<Certificate> updateCertificate(@PathVariable Long id, @RequestBody Certificate certificateDetails) {
        Certificate updatedCertificate = certificateService.updateCertificate(id, certificateDetails);
        return ResponseEntity.ok(updatedCertificate);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CERTIFICATE_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<Void> deleteCertificate(@PathVariable Long id) {
        try {
            certificateService.deleteCertificate(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error deleting certificate: {}", e.getMessage());
            throw new RuntimeException("Failed to delete certificate");
        }
    }
}