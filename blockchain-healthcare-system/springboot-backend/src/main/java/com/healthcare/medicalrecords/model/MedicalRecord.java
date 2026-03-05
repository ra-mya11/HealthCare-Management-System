package com.healthcare.medicalrecords.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "medical_records")
public class MedicalRecord {
    
    @Id
    private String id;
    
    private String recordId;
    private String patientId;
    private String doctorId;
    private String ipfsHash;
    private String fileName;
    private String fileType;
    private String recordType;
    private Long fileSize;
    private String blockchainTxHash;
    private LocalDateTime uploadedAt;
    private boolean verified;
    
    public MedicalRecord() {
        this.uploadedAt = LocalDateTime.now();
        this.verified = false;
    }
}
