<template>
  <MainLayout>
    <div class="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      
      <!-- Header con Buscador -->
      <div class="p-4 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <h3 class="font-semibold text-slate-700">Facturas de Venta</h3>
        <div class="flex gap-2 w-full md:w-auto">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Buscar por ID (ej: 3932)..." 
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
            <th class="px-6 py-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="invoices.length === 0">
            <td colspan="3" class="px-6 py-8 text-center text-slate-400">No se encontraron facturas.</td>
          </tr>
          <tr v-for="invoice in invoices" :key="invoice.salesInvoiceId" class="border-b border-slate-200 hover:bg-slate-50">
            <td class="px-6 py-4 font-medium text-slate-900">{{ invoice.salesInvoiceId }}</td>
            <td class="px-6 py-4">{{ invoice.issuedDate }}</td>
            <td class="px-6 py-4 text-center space-x-2">
              <button @click="viewDetail(invoice.salesInvoiceId)" class="text-blue-600 hover:text-blue-800 text-xs font-semibold">Ver Detalle</button>
              <button @click="downloadPdf(invoice.salesInvoiceId)" class="text-red-600 hover:text-red-800 text-xs font-semibold">PDF</button>
            </td>
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

    <!-- Modal de Detalle (Oculto por defecto) -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="showModal = false">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div class="p-4 border-b border-slate-200 flex justify-between items-center">
          <h3 class="font-semibold text-slate-800">Detalle Factura {{ detailData?.salesInvoiceId || '...' }}</h3>
          <button @click="showModal = false" class="text-slate-400 hover:text-slate-600 text-2xl">×</button>
        </div>
        <div class="p-6">
          <div v-if="modalLoading" class="text-center text-slate-500 py-8">Cargando detalle...</div>
          <div v-else-if="detailData" class="space-y-3">
            <div class="flex justify-between border-b pb-2"><span class="font-medium text-slate-600">ID:</span> <span>{{ detailData.salesInvoiceId }}</span></div>
            <div class="flex justify-between border-b pb-2"><span class="font-medium text-slate-600">Fecha:</span> <span>{{ detailData.issuedDate }}</span></div>
            <!-- Aquí puedes agregar más campos cuando el modelo se expanda -->
            <pre class="bg-slate-50 p-4 rounded text-xs mt-4 overflow-auto">{{ JSON.stringify(detailData, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>

  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import MainLayout from '@/layouts/MainLayout.vue';
import api from '@/services/api';
import { useAuthStore } from '@/stores/auth';

interface Invoice {
  salesInvoiceId: string;
  issuedDate: string;
}

const authStore = useAuthStore();
const invoices = ref<Invoice[]>([]);
const loading = ref(false);
const currentPage = ref(1);
const limit = ref(10);
const searchQuery = ref('');

// Estado del Modal
const showModal = ref(false);
const modalLoading = ref(false);
const detailData = ref<any>(null);

const fetchInvoices = async () => {
  loading.value = true;
  invoices.value = []; // <--- AGREGA ESTO para limpiar la tabla inmediatamente
  try {
    
    
    // Construimos los filtros.
    const filters = [];
    if (searchQuery.value) {
      filters.push({
        field: "salesInvoiceId",
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

    // Enviamos offset y limit exactos
    const response = await api.post('/sales/invoices/list', {
      offset: (currentPage.value - 1) * limit.value,
      limit: limit.value,
      fields: ["salesInvoiceId", "issuedDate"],
      filterBy: filters,
      orderBy: [{ field: "issuedDate", direction: "DESC" }]
    });

    // Procesamos la respuesta
    if (typeof response.data === 'string') {
       invoices.value = response.data.split('\n').slice(1).map((line: string): Invoice => {
         const [id, date] = line.split(',');
         return { 
           salesInvoiceId: id?.replace(/"/g, '') || '', 
           issuedDate: date?.replace(/"/g, '') || '' 
         };
       }).filter((inv: Invoice) => inv.salesInvoiceId);
    } else if (Array.isArray(response.data)) {
       invoices.value = response.data as Invoice[];
    } else if (response.data && response.data.rows) {
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

// Función para el botón de Buscar
const resetAndFetch = () => {
  currentPage.value = 1;
  fetchInvoices();
};

// Funciones de Paginación
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

// Función Ver Detalle
const viewDetail = async (id: string) => {
  showModal.value = true;
  modalLoading.value = true;
  detailData.value = null;
  try {
    const response = await api.get(`/sales/invoices/${id}`);
    detailData.value = response.data;
  } catch (error) {
    console.error('Error al obtener detalle:', error);
  } finally {
    modalLoading.value = false;
  }
};

// Función Descargar PDF
const downloadPdf = async (id: string) => {
  try {
    // Importante: responseType blob para archivos
    const response = await api.get(`/sales/invoices/${id}/pdf`, { responseType: 'blob' });
    
    // Crear URL temporal y descargar
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `factura-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Error al descargar PDF:', error);
    alert('No se pudo descargar el PDF. Es posible que Laudus no tenga este documento generado.');
  }
};

onMounted(() => {
  fetchInvoices();
});
</script>