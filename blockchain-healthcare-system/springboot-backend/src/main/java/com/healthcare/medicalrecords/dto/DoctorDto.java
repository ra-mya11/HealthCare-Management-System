package com.healthcare.medicalrecords.dto;

import com.healthcare.medicalrecords.entity.Doctor;

public class DoctorDto {
    public Long userId;
    public String name;
    public String email;
    public String specialization;
    public Integer experienceYears;
    public String availability;
    public Long departmentId;
    public String departmentName;

    public DoctorDto() {}

    public DoctorDto(Long userId, String name, String email, String specialization,
                     Integer experienceYears, String availability,
                     Long departmentId, String departmentName) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.specialization = specialization;
        this.experienceYears = experienceYears;
        this.availability = availability;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
    }

    public static DoctorDto from(Doctor doc) {
        return new DoctorDto(
            doc.getUserId(),
            doc.getUser() != null ? doc.getUser().getName() : "",
            doc.getUser() != null ? doc.getUser().getEmail() : "",
            doc.getSpecialization(),
            doc.getExperienceYears(),
            doc.getAvailability(),
            doc.getDepartment() != null ? doc.getDepartment().getId() : null,
            doc.getDepartment() != null ? doc.getDepartment().getName() : ""
        );
    }

    // Getters
    public Long getUserId() { return userId; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getSpecialization() { return specialization; }
    public Integer getExperienceYears() { return experienceYears; }
    public String getAvailability() { return availability; }
    public Long getDepartmentId() { return departmentId; }
    public String getDepartmentName() { return departmentName; }
}
