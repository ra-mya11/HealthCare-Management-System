package com.healthcare.chatbot.dto;

import lombok.Data;
import java.util.Map;
import java.util.List;

@Data
public class PredictionResponse {
    private String disease;
    private Double riskPercentage;
    private Map<String, Double> featureImportance;
    private String explanationText;
    private List<Double> shapValues;
}
