package com.healthcare.medicalrecords.dto;

import com.healthcare.medicalrecords.entity.Department;

public class DepartmentDto {
    public Long id;
    public String name;
    public String description;

    public DepartmentDto() {}

    public DepartmentDto(Long id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    public static DepartmentDto from(Department dept) {
        return new DepartmentDto(dept.getId(), dept.getName(), dept.getDescription());
    }

    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
}
