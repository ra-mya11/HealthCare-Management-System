import axios from 'axios';
import { getToken } from '../utils/auth';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Health APIs
export const getPrediction = async (healthData) => {
  const response = await api.post('/health/predict', healthData);
  return response.data;
};

export const getHealthScore = async () => {
  const response = await api.get('/health/score');
  return response.data;
};

export const getHealthHistory = async () => {
  const response = await api.get('/health/history');
  return response.data;
};

export const getRecommendations = async () => {
  const response = await api.get('/health/recommendations');
  return response.data;
};

// Medical Records APIs
export const getMedicalRecords = async () => {
  const response = await api.get('/records');
  return response.data;
};

export const uploadRecord = async (recordData) => {
  const response = await api.post('/records/upload', recordData);
  return response.data;
};

export const grantAccess = async (recordId, doctorAddress) => {
  const response = await api.post('/records/grant-access', { recordId, doctorAddress });
  return response.data;
};

export const revokeAccess = async (recordId, doctorAddress) => {
  const response = await api.post('/records/revoke-access', { recordId, doctorAddress });
  return response.data;
};

// Appointment APIs
export const getAppointments = async () => {
  const response = await api.get('/appointments/my-appointments');
  return response.data;
};

export const getAvailableDoctors = async (department, date) => {
  const params = {};
  if (department) params.department = department;
  if (date) params.date = date;
  const response = await api.get('/appointments/doctors/available', { params });
  return response.data;
};

export const bookAppointment = async (appointmentData) => {
  const response = await api.post('/appointments/book', appointmentData);
  return response.data;
};

export const cancelAppointment = async (appointmentId) => {
  const response = await api.delete(`/appointments/${appointmentId}`);
  return response.data;
};

// Get doctor appointments
export const getDoctorAppointments = async () => {
  const response = await api.get('/appointments/doctor-appointments');
  return response.data;
};

// Get patient records (for doctors)
export const getPatientRecords = async (patientId) => {
  const response = await api.get(`/records?patientId=${patientId}`);
  return response.data;
};

export default api;
