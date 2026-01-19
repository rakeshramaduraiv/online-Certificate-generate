package com.examly.springapp.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CertificateRequest {
    @NotNull
    private Long courseId;

    // Either ID or email can be used to identify recipient
    private Long recipientId;
    private String recipientEmail;
}
