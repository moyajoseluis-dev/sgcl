<template>
  <MainLayout>
    <div class="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div class="p-4 border-b border-slate-200">
        <h3 class="font-semibold text-slate-700">Auditoría del Sistema (Últimos 50 movimientos)</h3>
      </div>
      
      <div v-if="loading" class="p-10 text-center text-slate-500">Cargando logs...</div>
      
      <table v-else class="w-full text-sm text-left text-slate-500">
        <thead class="text-xs text-slate-700 uppercase bg-slate-50">
          <tr>
            <th class="px-6 py-3">Fecha y Hora</th>
            <th class="px-6 py-3">Usuario</th>
            <th class="px-6 py-3">Acción</th>
            <th class="px-6 py-3">Entidad</th>
            <th class="px-6 py-3">Detalle</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="logs.length === 0">
            <td colspan="5" class="px-6 py-8 text-center text-slate-400">No hay actividad registrada.</td>
          </tr>
          <tr v-for="log in logs" :key="log.id" class="border-b border-slate-200 hover:bg-slate-50">
            <td class="px-6 py-4 text-xs text-slate-500">{{ new Date(log.createdAt).toLocaleString('es-CL') }}</td>
            <td class="px-6 py-4 font-medium text-slate-900">{{ log.user?.email || 'Sistema' }}</td>
            <td class="px-6 py-4">
              <span :class="getActionClass(log.action)" class="px-2 py-1 text-xs rounded-full font-semibold">{{ log.action }}</span>
            </td>
            <td class="px-6 py-4">{{ log.entity }}</td>
            <td class="px-6 py-4 text-xs text-slate-500">{{ log.details }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import MainLayout from '@/layouts/MainLayout.vue';
import api from '@/services/api';

const logs = ref<any[]>([]);
const loading = ref(false);

const fetchLogs = async () => {
  loading.value = true;
  try {
    const response = await api.get('/logs');
    logs.value = response.data;
  } catch (error) {
    console.error('Error al obtener logs:', error);
  } finally {
    loading.value = false;
  }
};

const getActionClass = (action: string) => {
  switch (action) {
    case 'CREATE': return 'bg-green-100 text-green-800';
    case 'UPDATE': return 'bg-blue-100 text-blue-800';
    case 'DELETE': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

onMounted(() => {
  fetchLogs();
});
</script>