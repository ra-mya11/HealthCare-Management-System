package com.healthcare.chatbot.dto;

import lombok.Data;

@Data
public class HealthDataRequest {
    private Double age;
    private Double bloodPressure;
    private Double bmi;
    private Double cholesterol;
    private Double sugarLevel;
}
