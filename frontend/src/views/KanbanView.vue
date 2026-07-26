<template>
  <MainLayout>
    <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <h3 class="font-semibold text-slate-700 mb-6">Flujo de Contratos (Kanban)</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Columnas -->
        <div 
          v-for="col in columns" 
          :key="col.status" 
          class="bg-slate-50 rounded-lg p-3 min-h-[400px]"
          @dragover.prevent="onDragOver(col.status)"
          @drop="onDrop"
        >
          <div class="flex justify-between items-center mb-3">
            <h4 class="font-semibold text-slate-700 text-sm">{{ col.title }}</h4>
            <span class="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full">{{ getContractsByStatus(col.status).length }}</span>
          </div>

          <div class="space-y-3">
            <!-- Tarjetas -->
            <div 
              v-for="contract in getContractsByStatus(col.status)" 
              :key="contract.id" 
              draggable="true"
              @dragstart="onDragStart(contract.id)"
              class="bg-white p-3 rounded shadow-sm border border-slate-200 cursor-move hover:shadow-md transition"
            >
              <p class="font-semibold text-slate-800 text-sm">{{ contract.title }}</p>
              <p class="text-xs text-slate-500 mt-1">{{ contract.entityName }}</p>
              <p class="text-xs font-bold text-green-600 mt-2">{{ formatCurrency(contract.amount) }}</p>
            </div>

            <div v-if="getContractsByStatus(col.status).length === 0" class="text-center text-slate-300 text-xs py-4">
              Arrastra aquí
            </div>
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

interface Contract {
  id: number;
  title: string;
  entityName: string;
  amount: number;
  status: string;
}

const contracts = ref<Contract[]>([]);
const draggedId = ref<number | null>(null);
const draggedOverStatus = ref<string>('');

const columns = [
  { status: 'PENDING', title: 'Pendientes / Borrador' },
  { status: 'ACTIVE', title: 'Activos' },
  { status: 'EXPIRED', title: 'Vencidos / Finalizados' },
  { status: 'CANCELLED', title: 'Cancelados' },
];

const fetchContracts = async () => {
  try {
    const response = await api.get('/contracts');
    contracts.value = response.data;
  } catch (error) {
    console.error('Error al obtener contratos:', error);
  }
};

const getContractsByStatus = (status: string) => {
  return contracts.value.filter(c => c.status === status);
};

// Eventos de Drag & Drop
const onDragStart = (id: number) => {
  draggedId.value = id;
};

const onDragOver = (status: string) => {
  draggedOverStatus.value = status;
};

const onDrop = async () => {
  if (draggedId.value === null || !draggedOverStatus.value) return;

  const contract = contracts.value.find(c => c.id === draggedId.value);
  if (contract && contract.status !== draggedOverStatus.value) {
    const oldStatus = contract.status;
    contract.status = draggedOverStatus.value; // Actualización optimista en UI

    try {
      await api.put(`/contracts/${draggedId.value}/status`, { status: draggedOverStatus.value });
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      contract.status = oldStatus; // Revertir si falla
      alert('No se pudo cambiar el estado del contrato.');
    }
  }

  draggedId.value = null;
  draggedOverStatus.value = '';
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
};

onMounted(() => {
  fetchContracts();
});
</script>