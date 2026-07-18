<template>
  <MainLayout>
    <div class="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div class="p-4 border-b border-slate-200 flex justify-between items-center">
        <h3 class="font-semibold text-slate-700">Facturas de Venta (Reales desde Laudus)</h3>
        <button @click="fetchInvoices" class="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
          Cargar Facturas
        </button>
      </div>
      
      <div v-if="loading" class="p-6 text-center text-slate-500">Cargando datos desde Laudus...</div>
      
      <table v-else class="w-full text-sm text-left text-slate-500">
        <thead class="text-xs text-slate-700 uppercase bg-slate-50">
          <tr>
            <th class="px-6 py-3">ID Factura</th>
            <th class="px-6 py-3">Fecha Emisión</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="invoice in invoices" :key="invoice.salesInvoiceId" class="border-b border-slate-200 hover:bg-slate-50">
            <td class="px-6 py-4 font-medium text-slate-900">{{ invoice.salesInvoiceId }}</td>
            <td class="px-6 py-4">{{ invoice.issuedDate }}</td>
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
import { useAuthStore } from '@/stores/auth';

// Definimos la interfaz para que TypeScript sepa qué forma tienen los datos
interface Invoice {
  salesInvoiceId: string;
  issuedDate: string;
}

const authStore = useAuthStore();
const invoices = ref<Invoice[]>([]);
const loading = ref(false);

const fetchInvoices = async () => {
  loading.value = true;
  try {
    // 1. Asegurarnos de estar logueados en nuestro backend
    await authStore.login();
    
    // 2. Pedir las facturas a nuestro NestJS (que a su vez pedirá a Laudus)
    const response = await api.post('/sales/invoices/list', {
      page: 1,
      pageSize: 15,
      fields: ["salesInvoiceId", "issuedDate"],
      filterBy: [
        {
          field: "issuedDate",
          operator: ">",
          value: "2023-01-01T00:00:00"
        }
      ],
      orderBy: [
        {
          field: "issuedDate",
          direction: "DESC"
        }
      ]
    });

    // Laudus a veces devuelve CSV o JSON
    if (typeof response.data === 'string') {
       invoices.value = response.data.split('\n').slice(1).map((line: string): Invoice => {
         const [id, date] = line.split(',');
         return { 
           salesInvoiceId: id?.replace(/"/g, '') || '', 
           issuedDate: date?.replace(/"/g, '') || '' 
         };
       }).filter((inv: Invoice) => inv.salesInvoiceId);
    } else if (Array.isArray(response.data)) {
       // Si Laudus devuelve un arreglo JSON directo
       invoices.value = response.data as Invoice[];
    } else if (response.data.rows) {
       // Si Laudus devuelve un objeto con propiedad "rows"
       invoices.value = response.data.rows;
    } else {
       invoices.value = [];
    }

  } catch (error) {
    console.error('Error al obtener facturas:', error);
  } finally {
    loading.value = false;
  }
};

// Cargar automáticamente al entrar a la página
onMounted(() => {
  fetchInvoices();
});
</script>