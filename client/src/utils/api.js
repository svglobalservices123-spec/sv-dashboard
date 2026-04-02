import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

// Student
export const createStudent = (data) => api.post('/students', data);
export const getAllStudents = () => api.get('/students');
export const getStudentDetails = (id) => api.get(`/students/${id}`);
export const updateStudentStatus = (id, status) => api.put(`/students/${id}/status`, { status });
export const deleteStudent = (id) => api.delete(`/students/${id}`);

// Dashboard
export const getDashboardStats = () => api.get('/dashboard/stats');
export const exportStudents = (status) => api.get(`/export/students?status=${status}`, { responseType: 'blob' });

// Documents
export const uploadDocuments = (studentId, formData) =>
  api.post(`/documents/upload/${studentId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// Payments (Razorpay)
export const createRazorpayOrder = (data) => api.post('/payments/create-order', data);
export const verifyRazorpayPayment = (data) => api.post('/payments/verify', data);
export const savePayment = (studentId, data) => api.post(`/payments/${studentId}`, data);
export const downloadReceipt = (studentId) => api.get(`/payments/receipt/${studentId}`, { responseType: 'blob' });

export default api;
