import { defineStore } from 'pinia';
import api from '@/services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('sgcl_token') as string | null,
  }),
  actions: {
   async login() {
      if (this.token) return;

      try {
        const response = await api.post('/auth/login', {
          username: 'admin@sgcl.cl', // <--- Cambiado
          password: 'admin123',      // <--- Cambiado
        });
        
        const accessToken: string = response.data.accessToken;
        
        this.token = accessToken;
        localStorage.setItem('sgcl_token', accessToken);
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
      }
    },
    logout() {
      this.token = null;
      localStorage.removeItem('sgcl_token');
    }
  },
});