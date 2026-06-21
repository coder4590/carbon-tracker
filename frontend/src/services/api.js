import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const factoryAPI = {
  getAll: () => api.get('/factories/'),
  create: (data) => api.post('/factories/', data),
  delete: (id) => api.delete(`/factories/${id}`),
};

export const emissionFactorAPI = {
  getAll: () => api.get('/emissions/factors'),
  create: (data) => api.post('/emissions/factors', data),
  delete: (id) => api.delete(`/emissions/factors/${id}`),
};

export const emissionRecordAPI = {
  create: (data) => api.post('/emissions/records', data),
  delete: (id) => api.delete(`/emissions/records/${id}`),
  uploadCSV: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/emissions/records/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const reportAPI = {
  getReport: (data) => api.post('/reports/emissions', data),
  getSummary: () => api.get('/reports/factories-summary'),
  getTrends: (factoryId) => api.get('/reports/trends', { params: { factory_id: factoryId } }),
};