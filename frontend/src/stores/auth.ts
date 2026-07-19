import { defineStore } from 'pinia';
import api from '@/services/api';

interface User {
  username: string;
  role: string; // <--- Añadido
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('sgcl_token') as string | null,
    user: JSON.parse(localStorage.getItem('sgcl_user') || 'null') as User | null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'ADMIN', // <--- Añadido
  },
  actions: {
    async login(email: string, password: string) {
      try {
        const response = await api.post('/auth/login', {
          username: email,
          password: password,
        });
        
        const accessToken: string = response.data.accessToken;
        this.token = accessToken;
        this.user = { 
          username: response.data.username,
          role: response.data.role // <--- Guardamos el rol
        };
        
        localStorage.setItem('sgcl_token', accessToken);
        localStorage.setItem('sgcl_user', JSON.stringify(this.user));
      } catch (error) {
        throw new Error('Credenciales incorrectas');
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('sgcl_token');
      localStorage.removeItem('sgcl_user');
    }
  },
});