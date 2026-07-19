<template>
  <div class="min-h-screen bg-slate-900 flex items-center justify-center p-4">
    <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-blue-600">SGCL</h1>
        <p class="text-slate-500 mt-2">Sistema de Gestión y Control Laudus</p>
      </div>
      
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input 
            v-model="email" 
            type="email" 
            required
            class="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="admin@sgcl.cl"
          />
        </div>
        <div class="mb-6">
          <label class="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
          <input 
            v-model="password" 
            type="password" 
            required
            class="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="••••••••"
          />
        </div>
        
        <div v-if="error" class="mb-4 bg-red-50 text-red-600 text-sm p-3 rounded border border-red-200">
          {{ error }}
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2.5 rounded font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50"
        >
          {{ loading ? 'Ingresando...' : 'Iniciar Sesión' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const email = ref('admin@sgcl.cl');
const password = ref('admin123');
const error = ref('');
const loading = ref(false);
const router = useRouter();
const authStore = useAuthStore();

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  try {
    await authStore.login(email.value, password.value);
    router.push('/'); // Redirige al dashboard
  } catch (err) {
    error.value = 'Credenciales incorrectas. Inténtalo de nuevo.';
  } finally {
    loading.value = false;
  }
};
</script>