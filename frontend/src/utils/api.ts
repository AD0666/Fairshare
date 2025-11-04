import axios from 'axios';

// Get the API URL from environment or use default
const envApiUrl = (import.meta as any).env?.VITE_API_URL || '';
// If it's a full URL (starts with http), append /api, otherwise use /api as base
const baseURL = envApiUrl && (envApiUrl.startsWith('http://') || envApiUrl.startsWith('https://'))
  ? `${envApiUrl}/api`
  : '/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

