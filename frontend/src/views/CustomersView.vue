<template>
  <MainLayout>
    <div class="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      
      <!-- Header con Buscador -->
      <div class="p-4 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <h3 class="font-semibold text-slate-700">Clientes (Base de Datos Local)</h3>
        <div class="flex gap-2 w-full md:w-auto">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Buscar por nombre o RUT..." 
            class="border border-slate-300 rounded px-3 py-2 text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            @keyup.enter="resetAndFetch"
          />
          <button @click="resetAndFetch" class="bg-slate-800 text-white px-4 py-2 rounded text-sm hover:bg-slate-900">Buscar</button>
        </div>
      </div>
      
      <!-- Tabla -->
      <div v-if="loading" class="p-10 text-center text-slate-500">Cargando clientes...</div>
      
      <table v-else class="w-full text-sm text-left text-slate-500">
        <thead class="text-xs text-slate-700 uppercase bg-slate-50">
          <tr>
            <th class="px-6 py-3">ID Laudus</th>
            <th class="px-6 py-3">Nombre / Razón Social</th>
            <th class="px-6 py-3">RUT</th>
            <th class="px-6 py-3">Email</th>
            <th class="px-6 py-3">Teléfono</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="customers.length === 0">
            <td colspan="5" class="px-6 py-8 text-center text-slate-400">
              No hay clientes. Ve al Dashboard y sincroniza con Laudus.
            </td>
          </tr>
          <tr v-for="customer in customers" :key="customer.customerId" class="border-b border-slate-200 hover:bg-slate-50">
            <td class="px-6 py-4 font-medium text-slate-900">{{ customer.customerId }}</td>
            <td class="px-6 py-4">{{ customer.name }}</td>
            <td class="px-6 py-4">{{ customer.vatId || '-' }}</td>
            <td class="px-6 py-4">{{ customer.email || '-' }}</td>
            <td class="px-6 py-4">{{ customer.phone || '-' }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Paginación -->
      <div class="p-4 border-t border-slate-200 flex justify-between items-center">
        <button 
          @click="prevPage" 
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-slate-100 text-slate-700 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200"
        >
          ← Anterior
        </button>
        <span class="text-sm text-slate-500">
          Página {{ currentPage }} de {{ totalPages }} (Total: {{ total }})
        </span>
        <button 
          @click="nextPage" 
          :disabled="currentPage >= totalPages"
          class="px-4 py-2 bg-slate-100 text-slate-700 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200"
        >
          Siguiente →
        </button>
      </div>
    </div>

  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import MainLayout from '@/layouts/MainLayout.vue';
import api from '@/services/api';

interface Customer {
  customerId: number;
  name: string;
  vatId: string | null;
  email: string | null;
  phone: string | null;
}

const customers = ref<Customer[]>([]);
const loading = ref(false);
const currentPage = ref(1);
const limit = ref(10);
const total = ref(0);
const searchQuery = ref('');

const totalPages = computed(() => Math.ceil(total.value / limit.value));

const fetchCustomers = async () => {
  loading.value = true;
  try {
    const response = await api.get('/customers', {
      params: {
        page: currentPage.value,
        limit: limit.value,
        search: searchQuery.value
      }
    });
    customers.value = response.data.data;
    total.value = response.data.total;
  } catch (error) {
    console.error('Error al obtener clientes:', error);
  } finally {
    loading.value = false;
  }
};

const resetAndFetch = () => {
  currentPage.value = 1;
  fetchCustomers();
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchCustomers();
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchCustomers();
  }
};

onMounted(() => {
  fetchCustomers();
});
</script>