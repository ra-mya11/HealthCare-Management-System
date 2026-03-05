package com.healthcare.medicalrecords.dto;

import lombok.Data;
import java.util.List;

@Data
public class PredictionResponse {
    private double diabetesRisk;
    private double heartDiseaseRisk;
    private double hypertensionRisk;
    private String diabetesPrediction;
    private String heartDiseasePrediction;
    private String hypertensionPrediction;
    private String overallRisk;
    private List<String> recommendations;
}
