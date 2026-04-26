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
export const createRazorpayOrder = (data) => api.post('/create-order', data);
export const verifyRazorpayPayment = (data) => api.post('/verify-payment', data);
export const savePayment = (studentId, data) => api.post(`/payments/${studentId}`, data);
export const downloadReceipt = (studentId) => api.get(`/payments/receipt/${studentId}`, { responseType: 'blob' });

// Diploma Internship
export const submitDiplomaInternship = (formData) => api.post('/diploma-internship/submit', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const getDiplomaInternships = (filters = {}) => api.get('/diploma-internship/applications', { params: filters });
export const getDiplomaInternshipDetails = (id) => api.get(`/diploma-internship/applications/${id}`);
export const deleteDiplomaInternship = (id) => api.delete(`/diploma-internship/applications/${id}`);
export const exportDiplomaInternships = (filters = {}) => api.get('/diploma-internship/export', { params: filters, responseType: 'blob' });

// Btech/Degree Internship
export const submitBtechInternship = (formData) => api.post('/btech-internship/submit', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const getBtechInternships = (filters = {}) => api.get('/btech-internship/applications', { params: filters });
export const getBtechInternshipDetails = (id) => api.get(`/btech-internship/applications/${id}`);
export const deleteBtechInternship = (id) => api.delete(`/btech-internship/applications/${id}`);
export const exportBtechInternships = (filters = {}) => api.get('/btech-internship/export', { params: filters, responseType: 'blob' });


export default api;
