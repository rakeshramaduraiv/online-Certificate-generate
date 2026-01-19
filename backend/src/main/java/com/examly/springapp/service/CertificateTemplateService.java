package com.examly.springapp.service;

import com.examly.springapp.entity.CertificateTemplate;
import com.examly.springapp.repository.CertificateTemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CertificateTemplateService {
    private final CertificateTemplateRepository templateRepository;

    public List<CertificateTemplate> getAllTemplates() {
        return templateRepository.findAll();
    }

    public Optional<CertificateTemplate> getTemplateById(Long id) {
        return templateRepository.findById(id);
    }

    public CertificateTemplate createTemplate(CertificateTemplate template) {
        if (template.getCreatedBy() == null) {
            // Set default user ID 1 if not provided
            com.examly.springapp.entity.User defaultUser = new com.examly.springapp.entity.User();
            defaultUser.setId(1L);
            template.setCreatedBy(defaultUser);
        }
        if (template.getApprovalStatus() == null) {
            template.setApprovalStatus(com.examly.springapp.entity.CertificateTemplate.ApprovalStatus.PENDING);
        }
        if (template.getVersion() == null) {
            template.setVersion(1);
        }
        return templateRepository.save(template);
    }

    public CertificateTemplate updateTemplate(Long id, CertificateTemplate templateDetails) {
        CertificateTemplate template = templateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Template not found with id: " + id));

        if (templateDetails.getName() != null) {
            template.setName(templateDetails.getName());
        }
        if (templateDetails.getDesignData() != null) {
            template.setDesignData(templateDetails.getDesignData());
        }
        if (templateDetails.getVersion() != null) {
            template.setVersion(templateDetails.getVersion());
        }
        if (templateDetails.getApprovalStatus() != null) {
            template.setApprovalStatus(templateDetails.getApprovalStatus());
        }

        return templateRepository.save(template);
    }

    public void deleteTemplate(Long id) {
        if (!templateRepository.existsById(id)) {
            throw new RuntimeException("Template not found with id: " + id);
        }
        templateRepository.deleteById(id);
    }
}