package com.examly.springapp.repository;

import com.examly.springapp.entity.CertificateTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CertificateTemplateRepository extends JpaRepository<CertificateTemplate, Long> {
}