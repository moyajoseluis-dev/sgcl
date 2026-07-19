<template>
  <div class="min-h-screen bg-slate-100 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-slate-900 text-white flex flex-col fixed h-full">
      <div class="h-16 flex items-center justify-center border-b border-slate-800">
        <h1 class="text-xl font-bold text-blue-400">SGCL App</h1>
      </div>
      <nav class="flex-1 p-4 space-y-2">
        <router-link to="/" class="block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-800 hover:text-blue-400">
          📊 Dashboard
        </router-link>
        <router-link to="/sales" class="block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-800 hover:text-blue-400">
          🧾 Facturas de Venta
        </router-link>
        <router-link to="/users" class="block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-800 hover:text-blue-400">
          👤 Usuarios
        </router-link>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col ml-64">
      <!-- Header -->
      <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
        <h2 class="text-lg font-semibold text-slate-700">Bienvenido al Sistema</h2>
        <div class="flex items-center space-x-4">
          <span class="text-sm text-slate-500">{{ authStore.user?.username || 'Usuario' }}</span>
          <button @click="handleLogout" class="px-3 py-1.5 bg-slate-100 text-slate-600 rounded text-sm hover:bg-slate-200">
            Cerrar Sesión
          </button>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 p-6 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>