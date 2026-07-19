<template>
  <MainLayout>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <!-- Card 1: Usuarios -->
      <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-slate-500 text-sm font-medium uppercase">Usuarios</h3>
          <span class="text-blue-500 text-2xl">👥</span>
        </div>
        <p class="text-3xl font-bold text-slate-800">{{ stats.totalUsers }}</p>
        <p class="text-slate-400 text-sm mt-2">Activos en el sistema</p>
      </div>
      
      <!-- Card 2: Contratos Activos -->
      <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-slate-500 text-sm font-medium uppercase">Contratos Activos</h3>
          <span class="text-green-500 text-2xl">📄</span>
        </div>
        <p class="text-3xl font-bold text-slate-800">{{ stats.activeContracts }}</p>
        <p class="text-slate-400 text-sm mt-2">de {{ stats.totalContracts }} totales</p>
      </div>

      <!-- Card 3: Monto Total Contratos -->
      <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-slate-500 text-sm font-medium uppercase">Monto Total</h3>
          <span class="text-yellow-500 text-2xl">💰</span>
        </div>
        <p class="text-3xl font-bold text-slate-800">{{ formatCurrency(stats.totalAmount) }}</p>
        <p class="text-slate-400 text-sm mt-2">En contratos</p>
      </div>

      <!-- Card 4: Espacio para Laudus (Ej. Ventas) -->
      <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-slate-500 text-sm font-medium uppercase">Integración</h3>
          <span class="text-purple-500 text-2xl">🔗</span>
        </div>
        <p class="text-3xl font-bold text-slate-800">Laudus</p>
        <p class="text-green-500 text-sm mt-2">API Conectada</p>
      </div>
    </div>

    <!-- Tabla de Resumen (La dejamos estática por ahora) -->
    <div class="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div class="p-4 border-b border-slate-200 flex justify-between items-center">
        <h3 class="font-semibold text-slate-700">Resumen del Sistema</h3>
        <router-link to="/contracts" class="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
          Ver Contratos
        </router-link>
      </div>
      <div class="p-6 text-slate-500 text-sm">
        Bienvenido al panel de control. Navega por el menú lateral para gestionar facturas de venta, compras, contratos y usuarios.
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import MainLayout from '@/layouts/MainLayout.vue';
import api from '@/services/api';

interface DashboardStats {
  totalUsers: number;
  totalContracts: number;
  activeContracts: number;
  totalAmount: number;
}

const stats = ref<DashboardStats>({
  totalUsers: 0,
  totalContracts: 0,
  activeContracts: 0,
  totalAmount: 0,
});

const fetchStats = async () => {
  try {
    const response = await api.get('/dashboard/stats');
    stats.value = response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
  }
};

// Formatear números a formato moneda chilena (CLP)
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
};

onMounted(() => {
  fetchStats();
});
</script>