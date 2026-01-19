import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8082';

// Validate API base URL to prevent SSRF
const isValidUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
};

if (!isValidUrl(API_BASE_URL)) {
  throw new Error('Invalid API base URL');
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
};

export const certificateAPI = {
  getAll: () => api.get('/api/certificates'),
  getById: (id) => {
    if (!id || typeof id !== 'string' && typeof id !== 'number') throw new Error('Invalid ID');
    return api.get(`/api/certificates/${encodeURIComponent(id)}`);
  },
  create: (data) => api.post('/api/certificates', data),
  update: (id, data) => {
    if (!id || typeof id !== 'string' && typeof id !== 'number') throw new Error('Invalid ID');
    return api.put(`/api/certificates/${encodeURIComponent(id)}`, data);
  },
  delete: (id) => {
    if (!id || typeof id !== 'string' && typeof id !== 'number') throw new Error('Invalid ID');
    return api.delete(`/api/certificates/${encodeURIComponent(id)}`);
  },
  getMy: () => api.get('/api/certificates/my'),
};

export const templateAPI = {
  getAll: () => api.get('/api/templates'),
  getById: (id) => {
    if (!id || typeof id !== 'string' && typeof id !== 'number') throw new Error('Invalid ID');
    return api.get(`/api/templates/${encodeURIComponent(id)}`);
  },
  create: (data) => api.post('/api/templates', data),
  update: (id, data) => {
    if (!id || typeof id !== 'string' && typeof id !== 'number') throw new Error('Invalid ID');
    return api.put(`/api/templates/${encodeURIComponent(id)}`, data);
  },
  delete: (id) => {
    if (!id || typeof id !== 'string' && typeof id !== 'number') throw new Error('Invalid ID');
    return api.delete(`/api/templates/${encodeURIComponent(id)}`);
  },
};

export const courseAPI = {
  getAll: () => api.get('/api/courses'),
  getById: (id) => {
    if (!id || typeof id !== 'string' && typeof id !== 'number') throw new Error('Invalid ID');
    return api.get(`/api/courses/${encodeURIComponent(id)}`);
  },
  create: (data) => api.post('/api/courses', data),
  update: (id, data) => {
    if (!id || typeof id !== 'string' && typeof id !== 'number') throw new Error('Invalid ID');
    return api.put(`/api/courses/${encodeURIComponent(id)}`, data);
  },
  delete: (id) => {
    if (!id || typeof id !== 'string' && typeof id !== 'number') throw new Error('Invalid ID');
    return api.delete(`/api/courses/${encodeURIComponent(id)}`);
  },
};

export const userAPI = {
  getAll: () => api.get('/api/users'),
  getById: (id) => {
    if (!id || typeof id !== 'string' && typeof id !== 'number') throw new Error('Invalid ID');
    return api.get(`/api/users/${encodeURIComponent(id)}`);
  },
  update: (id, data) => {
    if (!id || typeof id !== 'string' && typeof id !== 'number') throw new Error('Invalid ID');
    return api.put(`/api/users/${encodeURIComponent(id)}`, data);
  },
  delete: (id) => {
    if (!id || typeof id !== 'string' && typeof id !== 'number') throw new Error('Invalid ID');
    return api.delete(`/api/users/${encodeURIComponent(id)}`);
  },
};

export const verifyAPI = {
  verify: (code) => {
    if (!code || typeof code !== 'string') throw new Error('Invalid verification code');
    return api.get(`/api/verify/${encodeURIComponent(code)}`);
  },
};

export default api;