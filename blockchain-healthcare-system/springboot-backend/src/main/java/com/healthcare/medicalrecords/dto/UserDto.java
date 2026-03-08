package com.healthcare.medicalrecords.dto;

import com.healthcare.medicalrecords.entity.User;

public class UserDto {
    public Long id;
    public String name;
    public String email;
    public String role;
    public Boolean enabled;

    public UserDto() {}

    public UserDto(Long id, String name, String email, String role, Boolean enabled) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.enabled = enabled;
    }

    public static UserDto from(User user) {
        return new UserDto(user.getId(), user.getName(), user.getEmail(),
                user.getRole() != null ? user.getRole().toString() : "PATIENT",
                user.isEnabled());
    }

    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public Boolean getEnabled() { return enabled; }
}
