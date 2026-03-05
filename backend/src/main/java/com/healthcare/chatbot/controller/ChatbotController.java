package com.healthcare.chatbot.controller;

import com.healthcare.chatbot.dto.HealthDataRequest;
import com.healthcare.chatbot.dto.PredictionResponse;
import com.healthcare.chatbot.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "*")
public class ChatbotController {
    
    @Autowired
    private AIService aiService;
    
    @PostMapping("/predict")
    public ResponseEntity<PredictionResponse> predict(@RequestBody HealthDataRequest request) {
        PredictionResponse response = aiService.getPrediction(request);
        return ResponseEntity.ok(response);
    }
}
