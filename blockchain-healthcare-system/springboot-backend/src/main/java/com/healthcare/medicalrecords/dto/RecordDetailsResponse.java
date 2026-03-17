package com.healthcare.medicalrecords.dto;

public class RecordDetailsResponse {
    private String recordId;
    private String patientId;
    private String doctorId;
    private String ipfsHash;
    private String fileName;
    private String fileType;
    private String recordType;
    private Long fileSize;
    private String blockchainTxHash;
    private String uploadedAt;
    private boolean verified;
    private String status;
    private String expiresAt;
    private String message;
    private boolean success;

    public RecordDetailsResponse() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String recordId;
        private String patientId;
        private String doctorId;
        private String ipfsHash;
        private String fileName;
        private String fileType;
        private String recordType;
        private Long fileSize;
        private String blockchainTxHash;
        private String uploadedAt;
        private boolean verified;
        private String status;
        private String expiresAt;
        private String message;
        private boolean success;

        public Builder recordId(String v) { this.recordId = v; return this; }
        public Builder patientId(String v) { this.patientId = v; return this; }
        public Builder doctorId(String v) { this.doctorId = v; return this; }
        public Builder ipfsHash(String v) { this.ipfsHash = v; return this; }
        public Builder fileName(String v) { this.fileName = v; return this; }
        public Builder fileType(String v) { this.fileType = v; return this; }
        public Builder recordType(String v) { this.recordType = v; return this; }
        public Builder fileSize(Long v) { this.fileSize = v; return this; }
        public Builder blockchainTxHash(String v) { this.blockchainTxHash = v; return this; }
        public Builder uploadedAt(String v) { this.uploadedAt = v; return this; }
        public Builder verified(boolean v) { this.verified = v; return this; }
        public Builder status(String v) { this.status = v; return this; }
        public Builder expiresAt(String v) { this.expiresAt = v; return this; }
        public Builder message(String v) { this.message = v; return this; }
        public Builder success(boolean v) { this.success = v; return this; }

        public RecordDetailsResponse build() {
            RecordDetailsResponse r = new RecordDetailsResponse();
            r.recordId = this.recordId; r.patientId = this.patientId; r.doctorId = this.doctorId;
            r.ipfsHash = this.ipfsHash; r.fileName = this.fileName; r.fileType = this.fileType;
            r.recordType = this.recordType; r.fileSize = this.fileSize; r.blockchainTxHash = this.blockchainTxHash;
            r.uploadedAt = this.uploadedAt; r.verified = this.verified; r.status = this.status;
            r.expiresAt = this.expiresAt; r.message = this.message; r.success = this.success;
            return r;
        }
    }

    public String getRecordId() { return recordId; }
    public void setRecordId(String recordId) { this.recordId = recordId; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getDoctorId() { return doctorId; }
    public void setDoctorId(String doctorId) { this.doctorId = doctorId; }

    public String getIpfsHash() { return ipfsHash; }
    public void setIpfsHash(String ipfsHash) { this.ipfsHash = ipfsHash; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }

    public String getRecordType() { return recordType; }
    public void setRecordType(String recordType) { this.recordType = recordType; }

    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }

    public String getBlockchainTxHash() { return blockchainTxHash; }
    public void setBlockchainTxHash(String blockchainTxHash) { this.blockchainTxHash = blockchainTxHash; }

    public String getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(String uploadedAt) { this.uploadedAt = uploadedAt; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getExpiresAt() { return expiresAt; }
    public void setExpiresAt(String expiresAt) { this.expiresAt = expiresAt; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
}
