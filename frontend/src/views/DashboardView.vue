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

      <!-- Card 4: Sincronización Laudus -->
      <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex flex-col">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-slate-500 text-sm font-medium uppercase">Sincronización</h3>
          <span class="text-purple-500 text-2xl">🔄</span>
        </div>
        <p class="text-sm text-slate-500 mb-1">Última actualización:</p>
        <p class="text-sm font-semibold text-slate-800 mb-4">
          {{ syncStatus.lastSyncAt ? formatDate(syncStatus.lastSyncAt) : 'Nunca' }}
        </p>
        <button 
          @click="triggerSync" 
          :disabled="syncing"
          class="mt-auto w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700 transition duration-200 disabled:opacity-50"
        >
          {{ syncing ? 'Sincronizando...' : 'Sincronizar Ahora' }}
        </button>
        <p v-if="syncError" class="text-red-500 text-xs mt-2">{{ syncError }}</p>
      </div>
    </div>

    <!-- Fila de Gráficos y Resumen -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Gráfico de Torta (Doughnut) -->
      <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-200 lg:col-span-1">
        <h3 class="font-semibold text-slate-700 mb-4">Estado de Contratos</h3>
        <div class="flex justify-center items-center h-64">
          <Doughnut v-if="stats.chartData" :data="stats.chartData" :options="chartOptions" />
          <p v-else class="text-slate-400 text-sm">Cargando gráfico...</p>
        </div>
      </div>

      <!-- Tabla de Resumen -->
      <div class="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden lg:col-span-2">
        <div class="p-4 border-b border-slate-200 flex justify-between items-center">
          <h3 class="font-semibold text-slate-700">Resumen del Sistema</h3>
          <router-link to="/contracts" class="bg-slate-800 text-white px-4 py-2 rounded text-sm hover:bg-slate-900">
            Ver Contratos
          </router-link>
        </div>
        <div class="p-6 text-slate-500 text-sm">
          Bienvenido al panel de control. Navega por el menú lateral para gestionar facturas de venta, compras, contratos y usuarios.
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import MainLayout from '@/layouts/MainLayout.vue';
import api from '@/services/api';

// Registrar componentes de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

interface DashboardStats {
  totalUsers: number;
  totalContracts: number;
  activeContracts: number;
  totalAmount: number;
  chartData: any;
}

const stats = ref<DashboardStats>({
  totalUsers: 0,
  totalContracts: 0,
  activeContracts: 0,
  totalAmount: 0,
  chartData: null,
});

const syncStatus = ref<{ lastSyncAt: string | null }>({ lastSyncAt: null });
const syncing = ref(false);
const syncError = ref('');

// Opciones del gráfico (ocultar leyenda para que se vea más limpio)
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
    }
  }
};

const fetchStats = async () => {
  try {
    const response = await api.get('/dashboard/stats');
    stats.value = response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
  }
};

const fetchSyncStatus = async () => {
  try {
    const response = await api.get('/sync/status');
    syncStatus.value = response.data;
  } catch (error) {
    console.error('Error al obtener estado de sync:', error);
  }
};

const triggerSync = async () => {
  syncing.value = true;
  syncError.value = '';
  try {
    await api.post('/sync/now');
    await fetchSyncStatus(); 
  } catch (error: any) {
    syncError.value = error.response?.data?.message || 'Error al sincronizar.';
  } finally {
    syncing.value = false;
  }
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('es-CL', { dateStyle: 'medium', timeStyle: 'short' });
};

onMounted(() => {
  fetchStats();
  fetchSyncStatus();
});
</script>