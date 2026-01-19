package com.examly.springapp.controller;

import com.examly.springapp.entity.CertificateTemplate;
import com.examly.springapp.service.CertificateTemplateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/templates")
@RequiredArgsConstructor
@Slf4j
public class CertificateTemplateController {
    private final CertificateTemplateService templateService;

    @GetMapping
    public ResponseEntity<List<CertificateTemplate>> getAllTemplates() {
        return ResponseEntity.ok(templateService.getAllTemplates());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CertificateTemplate> getTemplateById(@PathVariable Long id) {
        return templateService.getTemplateById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('CERTIFICATE_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<CertificateTemplate> createTemplate(@RequestBody CertificateTemplate template) {
        CertificateTemplate createdTemplate = templateService.createTemplate(template);
        return ResponseEntity.ok(createdTemplate);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CERTIFICATE_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<CertificateTemplate> updateTemplate(@PathVariable Long id, @RequestBody CertificateTemplate templateDetails) {
        try {
            CertificateTemplate updatedTemplate = templateService.updateTemplate(id, templateDetails);
            return ResponseEntity.ok(updatedTemplate);
        } catch (Exception e) {
            log.error("Error updating template: {}", e.getMessage());
            throw new RuntimeException("Failed to update template");
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CERTIFICATE_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<Void> deleteTemplate(@PathVariable Long id) {
        try {
            templateService.deleteTemplate(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error deleting template: {}", e.getMessage());
            throw new RuntimeException("Failed to delete template");
        }
    }
}