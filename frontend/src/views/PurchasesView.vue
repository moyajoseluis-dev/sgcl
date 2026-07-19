<template>
  <MainLayout>
    <div class="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      
      <!-- Header con Buscador -->
      <div class="p-4 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <h3 class="font-semibold text-slate-700">Facturas de Compra</h3>
        <div class="flex gap-2 w-full md:w-auto">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Buscar por ID..." 
            class="border border-slate-300 rounded px-3 py-2 text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            @keyup.enter="resetAndFetch"
          />
          <button @click="resetAndFetch" class="bg-slate-800 text-white px-4 py-2 rounded text-sm hover:bg-slate-900">Buscar</button>
        </div>
      </div>
      
      <!-- Tabla -->
      <div v-if="loading" class="p-10 text-center text-slate-500">Cargando datos desde Laudus...</div>
      
      <table v-else class="w-full text-sm text-left text-slate-500">
        <thead class="text-xs text-slate-700 uppercase bg-slate-50">
          <tr>
            <th class="px-6 py-3">ID Factura</th>
            <th class="px-6 py-3">Fecha Emisión</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="invoices.length === 0">
            <td colspan="2" class="px-6 py-8 text-center text-slate-400">No se encontraron facturas.</td>
          </tr>
          <tr v-for="invoice in invoices" :key="invoice.purchaseInvoiceId" class="border-b border-slate-200 hover:bg-slate-50">
            <td class="px-6 py-4 font-medium text-slate-900">{{ invoice.purchaseInvoiceId }}</td>
            <td class="px-6 py-4">{{ invoice.issuedDate }}</td>
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
        <span class="text-sm text-slate-500">Página {{ currentPage }}</span>
        <button 
          @click="nextPage" 
          :disabled="invoices.length < limit"
          class="px-4 py-2 bg-slate-100 text-slate-700 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200"
        >
          Siguiente →
        </button>
      </div>
    </div>

  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import MainLayout from '@/layouts/MainLayout.vue';
import api from '@/services/api';

interface Invoice {
  purchaseInvoiceId: string;
  issuedDate: string;
}

const invoices = ref<Invoice[]>([]);
const loading = ref(false);
const currentPage = ref(1);
const limit = ref(10);
const searchQuery = ref('');

const fetchInvoices = async () => {
  loading.value = true;
  invoices.value = []; // Limpiar tabla
  try {
    const filters = [];
    if (searchQuery.value) {
      filters.push({
        field: "purchaseInvoiceId",
        operator: "contains",
        value: searchQuery.value
      });
    } else {
      filters.push({
        field: "issuedDate",
        operator: ">",
        value: "2023-01-01T00:00:00"
      });
    }

    const response = await api.post('/purchases/invoices/list', {
      offset: (currentPage.value - 1) * limit.value,
      limit: limit.value,
      fields: ["purchaseInvoiceId", "issuedDate"],
      filterBy: filters,
      orderBy: [{ field: "issuedDate", direction: "DESC" }]
    });

    if (typeof response.data === 'string') {
       invoices.value = response.data.split('\n').slice(1).map((line: string): Invoice => {
         const [id, date] = line.split(',');
         return { 
           purchaseInvoiceId: id?.replace(/"/g, '') || '', 
           issuedDate: date?.replace(/"/g, '') || '' 
         };
       }).filter((inv: Invoice) => inv.purchaseInvoiceId);
    } else if (Array.isArray(response.data)) {
       invoices.value = response.data as Invoice[];
    } else if (response.data && response.data.rows) {
       invoices.value = response.data.rows;
    } else {
       invoices.value = [];
    }

  } catch (error) {
    console.error('Error al obtener facturas de compra:', error);
  } finally {
    loading.value = false;
  }
};

const resetAndFetch = () => {
  currentPage.value = 1;
  fetchInvoices();
};

const nextPage = () => {
  currentPage.value++;
  fetchInvoices();
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchInvoices();
  }
};

onMounted(() => {
  fetchInvoices();
});
</script>