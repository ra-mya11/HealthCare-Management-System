package com.healthcare.medicalrecords.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

/**
 * DTO for patient records response
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PatientRecordsResponse {
    private String patientId;
    private List<RecordDetailsResponse> records;
    private int totalRecords;
    private String message;
    private boolean success;
}
