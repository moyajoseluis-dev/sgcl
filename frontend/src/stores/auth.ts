import { defineStore } from 'pinia';
import api from '@/services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('sgcl_token') as string | null,
  }),
  actions: {
    async login() {
      // Si ya tenemos token, no hacemos login de nuevo
      if (this.token) return;

      try {
        const response = await api.post('/auth/login', {
          username: 'admin',
          password: 'admin',
        });
        
        // Extraemos el token asegurándonos de que sea un string
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