package com.healthcare.medicalrecords.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VerificationResponse {
    private String recordId;
    private boolean verified;
    private String ipfsHash;
    private String message;
}
