package com.examly.springapp.service;

import com.examly.springapp.dto.CertificateRequest;
import com.examly.springapp.entity.Certificate;
import com.examly.springapp.entity.Course;
import com.examly.springapp.entity.User;
import com.examly.springapp.entity.VerificationLog;
import com.examly.springapp.repository.CertificateRepository;
import com.examly.springapp.repository.CourseRepository;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.repository.VerificationLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final VerificationLogRepository verificationLogRepository;

    public List<Certificate> getAllCertificates() {
        return certificateRepository.findAll();
    }

    public Optional<Certificate> getCertificateById(Long id) {
        return certificateRepository.findById(id);
    }

    public List<Certificate> getCertificatesByRecipient(User recipient) {
        return certificateRepository.findByRecipient(recipient);
    }

    public Certificate createCertificate(CertificateRequest request) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        User recipient = null;

        if (request.getRecipientId() != null) {
            recipient = userRepository.findById(request.getRecipientId())
                    .orElseThrow(() -> new RuntimeException("Recipient not found"));
        } else if (request.getRecipientEmail() != null) {
            recipient = userRepository.findByEmail(request.getRecipientEmail())
                    .orElseThrow(() -> new RuntimeException("Recipient not found with email: " + request.getRecipientEmail()));
        } else {
            throw new RuntimeException("Either recipientId or recipientEmail must be provided");
        }

        Certificate certificate = new Certificate();
        certificate.setCertificateNumber(generateCertificateNumber());
        certificate.setVerificationCode(generateVerificationCode());
        certificate.setCourse(course);
        certificate.setRecipient(recipient);

        return certificateRepository.save(certificate);
    }

    public Certificate updateCertificate(Long id, Certificate certificateDetails) {
        Certificate certificate = certificateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certificate not found with id: " + id));

        if (certificateDetails.getStatus() != null) {
            certificate.setStatus(certificateDetails.getStatus());
        }
        return certificateRepository.save(certificate);
    }

    public void deleteCertificate(Long id) {
        if (!certificateRepository.existsById(id)) {
            throw new RuntimeException("Certificate not found with id: " + id);
        }
        certificateRepository.deleteById(id);
    }

    public Certificate verifyCertificate(String verificationCode, String verifierInfo, String ipAddress) {
        Optional<Certificate> certificateOpt = certificateRepository.findByVerificationCode(verificationCode);

        VerificationLog log = new VerificationLog();
        log.setVerifierInfo(verifierInfo);
        log.setIpAddress(ipAddress);

        if (certificateOpt.isPresent()) {
            Certificate certificate = certificateOpt.get();
            log.setCertificate(certificate);
            log.setVerificationResult(true);
            verificationLogRepository.save(log);
            return certificate;
        } else {
            log.setCertificate(null);
            log.setVerificationResult(false);
            verificationLogRepository.save(log);
            return null;
        }
    }

    private String generateCertificateNumber() {
        return "CERT-" + System.currentTimeMillis();
    }

    private String generateVerificationCode() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
    }
}
