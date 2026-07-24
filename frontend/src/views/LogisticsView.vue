<template>
  <MainLayout>
    <div class="space-y-6">
      
      <!-- Selector de Contrato -->
      <div class="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center gap-4">
        <label class="text-sm font-medium text-slate-700">Seleccionar Obra/Contrato:</label>
        <select v-model="selectedContractId" @change="fetchMovements" class="border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="" disabled>Seleccione...</option>
          <option v-for="c in contracts" :key="c.id" :value="c.id">{{ c.title }}</option>
        </select>
      </div>

      <div v-if="selectedContractId">
        
        <!-- Header de la Tabla -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div class="p-4 border-b border-slate-200 flex justify-between items-center">
            <h3 class="font-semibold text-slate-700">Movimientos de Bodega</h3>
            <button @click="openModal" class="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
              + Registrar Movimiento
            </button>
          </div>
          
          <div v-if="loading" class="p-10 text-center text-slate-500">Cargando movimientos...</div>
          
          <table v-else class="w-full text-sm text-left text-slate-500">
            <thead class="text-xs text-slate-700 uppercase bg-slate-50">
              <tr>
                <th class="px-6 py-3">Producto</th>
                <th class="px-6 py-3">Tipo</th>
                <th class="px-6 py-3">Cantidad</th>
                <th class="px-6 py-3">Fecha</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="movements.length === 0">
                <td colspan="4" class="px-6 py-8 text-center text-slate-400">No hay movimientos registrados para esta obra.</td>
              </tr>
              <tr v-for="mov in movements" :key="mov.id" class="border-b border-slate-200 hover:bg-slate-50">
                <td class="px-6 py-4 font-medium text-slate-900">
                  {{ mov.product.name }} <span class="text-slate-400 text-xs">({{ mov.product.sku }})</span>
                </td>
                <td class="px-6 py-4">
                  <span :class="getMovementClass(mov.type)" class="px-2 py-1 text-xs rounded-full font-semibold">
                    {{ translateMovement(mov.type) }}
                  </span>
                </td>
                <td class="px-6 py-4 font-semibold">{{ mov.quantity }} {{ mov.product.unit || '' }}</td>
                <td class="px-6 py-4">{{ new Date(mov.createdAt).toLocaleString('es-CL') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else class="bg-white p-10 rounded-lg shadow-sm border border-slate-200 text-center text-slate-400">
        Seleccione un contrato para ver o registrar movimientos de bodega.
      </div>
    </div>

    <!-- Modal para Registrar Movimiento -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="closeModal">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div class="p-4 border-b border-slate-200 flex justify-between items-center">
          <h3 class="font-semibold text-slate-800">Registrar Movimiento</h3>
          <button @click="closeModal" class="text-slate-400 hover:text-slate-600 text-2xl">×</button>
        </div>
        <div class="p-6 space-y-4">
          
          <!-- Buscador de Productos -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Buscar Producto</label>
            <input 
              v-model="productSearch" 
              @input="searchProducts" 
              type="text" 
              placeholder="Escriba nombre o SKU..." 
              class="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div v-if="searchResults.length > 0" class="mt-2 border border-slate-200 rounded max-h-40 overflow-y-auto">
              <div 
                v-for="p in searchResults" 
                :key="p.id" 
                @click="selectProduct(p)"
                class="p-2 hover:bg-blue-50 cursor-pointer text-sm border-b border-slate-100"
              >
                <span class="font-medium">{{ p.name }}</span> <span class="text-slate-400">({{ p.sku }})</span>
              </div>
            </div>
          </div>

          
          <!-- Producto Seleccionado -->
          <div v-if="selectedProduct" class="bg-slate-50 p-3 rounded border border-slate-200 text-sm flex justify-between items-center">
            <div>
              <span class="text-slate-500">Seleccionado:</span> 
              <span class="font-semibold">{{ selectedProduct.name }}</span>
              <span class="text-slate-400 text-xs ml-1">({{ selectedProduct.sku }})</span>
            </div>
            <button @click="selectedProduct = null; movementData.productId = 0" class="text-red-500 text-xs hover:text-red-700">Cambiar</button>
          </div>

          <!-- Tipo de Movimiento -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Tipo de Movimiento</label>
            <select v-model="movementData.type" class="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="OUT_TO_SITE">Salida a Obra (Bodega Periférica)</option>
              <option value="CONSUMED">Consumido (Facturar)</option>
              <option value="RETURNED">Retorno a Bodega Central</option>
            </select>
          </div>

          <!-- Cantidad -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Cantidad</label>
            <input v-model.number="movementData.quantity" type="number" min="1" class="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

        </div>
        <div class="p-4 border-t border-slate-200 flex justify-end gap-2">
          <button @click="closeModal" class="px-4 py-2 bg-slate-100 text-slate-700 rounded text-sm hover:bg-slate-200">Cancelar</button>
          <button @click="saveMovement" :disabled="!movementData.productId" class="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50">Guardar</button>
        </div>
      </div>
    </div>

  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import MainLayout from '@/layouts/MainLayout.vue';
import api from '@/services/api';

interface Contract { id: number; title: string; }
interface Product { id: number; sku: string; name: string; unit: string | null; }
interface Movement {
  id: number;
  type: 'OUT_TO_SITE' | 'CONSUMED' | 'RETURNED';
  quantity: number;
  createdAt: string;
  product: Product;
}

const contracts = ref<Contract[]>([]);
const selectedContractId = ref<number | ''>('');
const movements = ref<Movement[]>([]);
const loading = ref(false);
const showModal = ref(false);

// Búsqueda de productos
const productSearch = ref('');
const searchResults = ref<Product[]>([]);
let searchTimer: ReturnType<typeof setTimeout>;
const selectedProduct = ref<Product | null>(null);

const movementData = ref({
  productId: 0,
  type: 'OUT_TO_SITE' as 'OUT_TO_SITE' | 'CONSUMED' | 'RETURNED',
  quantity: 1
});

const selectedProductName = computed(() => {
  return searchResults.value.find(p => p.id === movementData.value.productId)?.name || '';
});

const fetchContracts = async () => {
  try {
    const response = await api.get('/contracts');
    contracts.value = response.data;
  } catch (error) {
    console.error('Error al obtener contratos:', error);
  }
};

const fetchMovements = async () => {
  if (!selectedContractId.value) return;
  loading.value = true;
  movements.value = [];
  try {
    const response = await api.get(`/logistics/movements/${selectedContractId.value}`);
    movements.value = response.data;
  } catch (error) {
    console.error('Error al obtener movimientos:', error);
  } finally {
    loading.value = false;
  }
};

const openModal = () => {
  productSearch.value = '';
  searchResults.value = [];
  selectedProduct.value = null; // <--- Limpia el seleccionado
  movementData.value = { productId: 0, type: 'OUT_TO_SITE', quantity: 1 };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

// Búsqueda con debounce (espera 300ms sin escribir para buscar)
const searchProducts = () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(async () => {
    if (productSearch.value.length < 2) {
      searchResults.value = [];
      return;
    }
    try {
      const response = await api.get('/logistics/products', {
        params: { search: productSearch.value }
      });
      searchResults.value = response.data;
    } catch (error) {
      console.error('Error al buscar productos:', error);
    }
  }, 300);
};

const selectProduct = (product: Product) => {
  selectedProduct.value = product; // Guardamos el producto completo
  movementData.value.productId = product.id;
  productSearch.value = '';
  searchResults.value = [];
};

const saveMovement = async () => {
  try {
    await api.post('/logistics/movements', {
      ...movementData.value,
      contractId: selectedContractId.value
    });
    closeModal();
    fetchMovements(); // Actualizar lista
  } catch (error) {
    console.error('Error al guardar movimiento:', error);
    alert('No se pudo guardar el movimiento.');
  }
};

// Helpers
const getMovementClass = (type: string) => {
  switch (type) {
    case 'OUT_TO_SITE': return 'bg-blue-100 text-blue-800';
    case 'CONSUMED': return 'bg-red-100 text-red-800';
    case 'RETURNED': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const translateMovement = (type: string) => {
  switch (type) {
    case 'OUT_TO_SITE': return 'Salida a Obra';
    case 'CONSUMED': return 'Consumido';
    case 'RETURNED': return 'Retorno';
    default: return type;
  }
};

onMounted(() => {
  fetchContracts();
});
</script>