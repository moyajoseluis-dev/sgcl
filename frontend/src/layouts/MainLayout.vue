<template>
  <div class="min-h-screen bg-slate-100 flex">
    
    <!-- Overlay para celulares (fondo oscuro al abrir el menú) -->
    <div v-if="isSidebarOpen" class="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" @click="toggleSidebar"></div>

    <!-- Sidebar -->
    <aside 
      class="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-40 transition-transform duration-300 ease-in-out md:translate-x-0"
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="h-16 flex items-center justify-center border-b border-slate-800">
        <h1 class="text-xl font-bold text-blue-400">SGCL App</h1>
      </div>
      <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
        <router-link to="/" @click="closeSidebar" class="block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-800 hover:text-blue-400">
          📊 Dashboard
        </router-link>
        <router-link to="/sales" @click="closeSidebar" class="block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-800 hover:text-blue-400">
          🧾 Facturas de Venta
        </router-link>
        <router-link to="/purchases" @click="closeSidebar" class="block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-800 hover:text-blue-400">
          📦 Compras
        </router-link>
        <router-link to="/contracts" @click="closeSidebar" class="block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-800 hover:text-blue-400">
          📄 Contratos
        </router-link>
        <router-link to="/kanban" @click="closeSidebar" class="block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-800 hover:text-blue-400">
          📋 Workflow Kanban
        </router-link>
        <router-link to="/customers" @click="closeSidebar" class="block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-800 hover:text-blue-400">
          👥 Clientes
        </router-link>
        <router-link to="/petty-cash" @click="closeSidebar" class="block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-800 hover:text-blue-400">
          💰 Fondo Fijo
        </router-link>
        <router-link to="/logistics" @click="closeSidebar" class="block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-800 hover:text-blue-400">
          📦 Bodegas
        </router-link>
        
        <div v-if="authStore.isAdmin" class="space-y-2 pt-2 mt-2 border-t border-slate-800">
          <router-link to="/users" @click="closeSidebar" class="block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-800 hover:text-blue-400">
            👤 Administración
          </router-link>
          <router-link to="/logs" @click="closeSidebar" class="block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-800 hover:text-blue-400">
            📜 Auditoría
          </router-link>
        </div>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col w-full md:ml-64">
      <!-- Header -->
      <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
        <div class="flex items-center gap-4">
          <!-- Botón Hamburguesa (Solo visible en móviles) -->
          <button @click="toggleSidebar" class="md:hidden text-slate-600 text-2xl">
            ☰
          </button>
          <h2 class="text-lg font-semibold text-slate-700 hidden md:block">Bienvenido al Sistema</h2>
        </div>
        
        <div class="flex items-center space-x-2 md:space-x-4">
          <span class="text-sm text-slate-500 hidden sm:block">{{ authStore.user?.username || 'Usuario' }}</span>
          <button @click="handleLogout" class="px-3 py-1.5 bg-slate-100 text-slate-600 rounded text-sm hover:bg-slate-200">
            Salir
          </button>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 p-4 md:p-6 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
  // Al hacer clic en un enlace, cerramos el menú en móviles
  if (window.innerWidth < 768) {
    isSidebarOpen.value = false;
  }
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>