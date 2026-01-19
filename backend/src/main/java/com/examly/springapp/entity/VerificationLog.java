package com.examly.springapp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "verification_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class VerificationLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "certificate_id", nullable = false)
    private Certificate certificate;

    @Column(columnDefinition = "TEXT")
    private String verifierInfo;

    @Column(nullable = false)
    private Boolean verificationResult;

    private String ipAddress;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime verificationDate;
}