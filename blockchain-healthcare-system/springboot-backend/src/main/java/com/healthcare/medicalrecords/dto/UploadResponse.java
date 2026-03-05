package com.healthcare.medicalrecords.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UploadResponse {
    private String recordId;
    private String ipfsHash;
    private String blockchainTxHash;
    private String message;
    private boolean success;
}
