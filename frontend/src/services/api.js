import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_email');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  // Signup with phone parameter (aligned)
  signup: async (email, password, confirmPassword, fullName, phone) => {
    const response = await api.post('/api/auth/signup', {
      email,
      password,
      confirmPassword,
      fullName,
      phone,  // Field name: phone (aligned with backend and database)
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/api/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  },

  verify: async () => {
    const response = await api.get('/api/auth/verify');
    return response.data;
  },
};

// Data APIs (PCOS Assessments)
export const dataAPI = {
  // Create new assessment
  create: async (assessmentData) => {
    const response = await api.post('/api/data', assessmentData);
    return response.data;
  },

  // Get all assessments for logged-in user
  getAll: async () => {
    const response = await api.get('/api/data');
    return response.data;
  },

  // Get single assessment by ID
  getById: async (id) => {
    const response = await api.get(`/api/data/${id}`);
    return response.data;
  },

  // Update assessment
  update: async (id, assessmentData) => {
    const response = await api.put(`/api/data/${id}`, assessmentData);
    return response.data;
  },

  // Delete assessment
  delete: async (id) => {
    const response = await api.delete(`/api/data/${id}`);
    return response.data;
  },

  // Get summary statistics
  getStats: async () => {
    const response = await api.get('/api/data/stats/summary');
    return response.data;
  },
};

export default api;
