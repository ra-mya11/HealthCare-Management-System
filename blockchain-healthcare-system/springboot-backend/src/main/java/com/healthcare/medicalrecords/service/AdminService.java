package com.healthcare.medicalrecords.service;

import com.healthcare.medicalrecords.dto.AnalyticsDto;
import com.healthcare.medicalrecords.dto.DoctorDto;
import com.healthcare.medicalrecords.dto.UserDto;
import com.healthcare.medicalrecords.entity.*;
import com.healthcare.medicalrecords.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired private UserRepository userRepository;
    @Autowired private DepartmentRepository departmentRepository;
    @Autowired private DoctorRepository doctorRepository;
    @Autowired private AppointmentRepository appointmentRepository;
    @Autowired private MedicalRecordRepository recordRepository;
    @Autowired private PredictionLogRepository predictionLogRepository;
    @Autowired private NotificationRepository notificationRepository;
    @Autowired private AuditLogRepository auditLogRepository;

    // ============ USER MANAGEMENT ============

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDto::from)
                .collect(Collectors.toList());
    }

    public List<User> getUsersByRole(String role) {
        return userRepository.findByRole(role);
    }

    public User approveUser(Long userId, boolean enable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEnabled(enable);
        return userRepository.save(user);
    }

    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }

    public User updateUserStatus(Long userId, String status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEnabled("ACTIVE".equalsIgnoreCase(status));
        return userRepository.save(user);
    }

    // ============ DEPARTMENT MANAGEMENT ============

    public Department createDepartment(Department dept) {
        if (departmentRepository.existsByName(dept.getName())) {
            throw new RuntimeException("Department already exists: " + dept.getName());
        }
        return departmentRepository.save(dept);
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public Department getDepartment(Long deptId) {
        return departmentRepository.findById(deptId)
                .orElseThrow(() -> new RuntimeException("Department not found"));
    }

    public Department updateDepartment(Long deptId, Department updated) {
        Department dept = getDepartment(deptId);
        dept.setName(updated.getName());
        dept.setDescription(updated.getDescription());
        return departmentRepository.save(dept);
    }

    public void deleteDepartment(Long deptId) {
        departmentRepository.deleteById(deptId);
    }

    // ============ DOCTOR MANAGEMENT ============

    public Doctor registerDoctor(Long userId, String specialization, Integer yearsExp, Long deptId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!"DOCTOR".equalsIgnoreCase(user.getRole() != null ? user.getRole().toString() : "")) {
            throw new RuntimeException("User must have DOCTOR role");
        }

        Department dept = null;
        if (deptId != null) {
            dept = departmentRepository.findById(deptId)
                    .orElseThrow(() -> new RuntimeException("Department not found"));
        }

        Doctor doctor = new Doctor(userId, specialization, yearsExp);
        doctor.setDepartment(dept);
        return doctorRepository.save(doctor);
    }

    public List<DoctorDto> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(DoctorDto::from)
                .collect(Collectors.toList());
    }

    public List<Doctor> getDoctorsByDepartment(Long deptId) {
        Department dept = departmentRepository.findById(deptId)
                .orElseThrow(() -> new RuntimeException("Department not found"));
        return doctorRepository.findByDepartment(dept);
    }

    public Doctor updateDoctor(Long userId, String specialization, Integer yearsExp, Long deptId) {
        Doctor doctor = doctorRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        doctor.setSpecialization(specialization);
        doctor.setExperienceYears(yearsExp);

        if (deptId != null) {
            Department dept = departmentRepository.findById(deptId)
                    .orElseThrow(() -> new RuntimeException("Department not found"));
            doctor.setDepartment(dept);
        }

        return doctorRepository.save(doctor);
    }

    // ============ APPOINTMENT MANAGEMENT ============

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public List<Appointment> getAppointmentsByStatus(String status) {
        return appointmentRepository.findByStatus(status);
    }

    public Appointment cancelAppointment(Long appointmentId) {
        Appointment apt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        apt.setStatus("CANCELLED");
        return appointmentRepository.save(apt);
    }

    public Appointment rescheduleAppointment(Long appointmentId, LocalDateTime newTime) {
        Appointment apt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        apt.setScheduledAt(newTime);
        apt.setStatus("RESCHEDULED");
        return appointmentRepository.save(apt);
    }

    // ============ MEDICAL RECORD MONITORING ============

    public List<MedicalRecord> getAllRecords() {
        return recordRepository.findAll();
    }

    public List<MedicalRecord> getPatientRecords(Long patientId) {
        return recordRepository.findByPatientId(patientId);
    }

    public long countRecords() {
        return recordRepository.count();
    }

    // ============ AI PREDICTIONS MONITORING ============

    public List<PredictionLog> getAllPredictionLogs() {
        return predictionLogRepository.findAll();
    }

    public List<PredictionLog> getRecentPredictions(int days) {
        LocalDateTime since = LocalDateTime.now().minus(days, ChronoUnit.DAYS);
        return predictionLogRepository.findRecent(since);
    }

    public long countPredictionsByType(PredictionLog.ModelType type) {
        return predictionLogRepository.countByModelType(type);
    }

    public long countTotalPredictions() {
        return predictionLogRepository.count();
    }

    // ============ NOTIFICATION MANAGEMENT ============

    public Notification createNotification(String title, String message, Notification.TargetRole targetRole) {
        Notification notif = new Notification(title, message, targetRole);
        return notificationRepository.save(notif);
    }

    public List<Notification> getUnsent() {
        return notificationRepository.findBySentAtIsNull();
    }

    public Notification broadcastNotification(Long notificationId) {
        Notification notif = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notif.setSentAt(LocalDateTime.now());
        return notificationRepository.save(notif);
    }

    // ============ ANALYTICS ============

    public AnalyticsDto getSystemAnalytics() {
        long patients = countUsersByRole("PATIENT");
        long doctors = countUsersByRole("DOCTOR");
        long appointments = appointmentRepository.count();
        long records = recordRepository.count();
        long predictions = predictionLogRepository.count();
        long diabetesPred = countPredictionsByType(PredictionLog.ModelType.DIABETES);
        long heartPred = countPredictionsByType(PredictionLog.ModelType.HEART);
        long scheduled = appointmentRepository.countByStatus("SCHEDULED");
        long completed = appointmentRepository.countByStatus("COMPLETED");
        long cancelled = appointmentRepository.countByStatus("CANCELLED");

        return new AnalyticsDto(patients, doctors, appointments, records,
                predictions, diabetesPred, heartPred, scheduled, completed, cancelled);
    }

    private long countUsersByRole(String role) {
        return userRepository.findByRole(role).size();
    }

    // ============ AUDIT LOGGING ============

    public void logAuditAction(Long adminId, String action, String entityType, Long entityId, String details) {
        AuditLog log = new AuditLog(adminId, action, entityType, entityId, details);
        auditLogRepository.save(log);
    }

    public List<AuditLog> getAuditLog(Long adminId) {
        return auditLogRepository.findByAdminId(adminId);
    }
}
