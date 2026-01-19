package com.examly.springapp.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "certificates")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Certificate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(unique = true, nullable = false)
    private String certificateNumber;

    @NotBlank
    @Column(unique = true, nullable = false)
    private String verificationCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id", nullable = false)
    private User recipient;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime issueDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CertificateStatus status = CertificateStatus.ACTIVE;

    public enum CertificateStatus {
        ACTIVE, REVOKED, EXPIRED
    }
}