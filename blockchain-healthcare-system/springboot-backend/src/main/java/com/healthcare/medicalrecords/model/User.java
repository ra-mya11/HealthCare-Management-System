package com.healthcare.medicalrecords.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Document(collection = "users")
public class User {
    
    @Id
    private String id;
    private String email;
    private String password;
    private String name;
    private String role; // PATIENT, DOCTOR
    private String phone;
    private LocalDateTime createdAt;
    private Set<String> authorizedDoctors = new HashSet<>();
    
    public User() {
        this.createdAt = LocalDateTime.now();
    }
}
