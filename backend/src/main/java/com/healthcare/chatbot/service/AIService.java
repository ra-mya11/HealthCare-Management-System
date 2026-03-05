package com.healthcare.chatbot.service;

import com.healthcare.chatbot.dto.HealthDataRequest;
import com.healthcare.chatbot.dto.PredictionResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;

@Service
public class AIService {
    
    @Value("${ai.service.url:http://localhost:8000}")
    private String aiServiceUrl;
    
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    public AIService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
        this.objectMapper.setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
    }
    
    public PredictionResponse getPrediction(HealthDataRequest request) {
        String url = aiServiceUrl + "/predict";
        return restTemplate.postForObject(url, request, PredictionResponse.class);
    }
}
