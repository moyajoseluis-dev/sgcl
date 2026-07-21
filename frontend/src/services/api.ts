import axios from 'axios';

const api = axios.create({
  // Si está en producción, usa la URL de la nube. Si no, localhost
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Antes de cada petición, adjunta el token si lo tenemos
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sgcl_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;