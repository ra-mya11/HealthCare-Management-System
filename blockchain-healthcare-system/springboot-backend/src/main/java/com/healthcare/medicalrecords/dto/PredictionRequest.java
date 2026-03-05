package com.healthcare.medicalrecords.dto;

import lombok.Data;
import java.util.List;

@Data
public class PredictionRequest {
    private int age;
    private int bpSystolic;
    private int bpDiastolic;
    private double sugarLevel;
    private double bmi;
    private int cholesterol;
    private List<String> symptoms;
}
