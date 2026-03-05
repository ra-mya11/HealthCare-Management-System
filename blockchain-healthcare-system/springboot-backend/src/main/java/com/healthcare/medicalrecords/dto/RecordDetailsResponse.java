package com.healthcare.medicalrecords.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for medical record details response
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RecordDetailsResponse {
    private String recordId;
    private String patientId;
    private String doctorId;
    private String ipfsHash;
    private String fileName;
    private String fileType;
    private String recordType;
    private Long fileSize;
    private String blockchainTxHash;
    private String uploadedAt;
    private boolean verified;
    private String status;
    private String expiresAt;
    private String message;
    private boolean success;
}
