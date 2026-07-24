<template>
  <MainLayout>
    <div class="space-y-6">
      
      <!-- Selector de Contrato -->
      <div class="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center gap-4">
        <label class="text-sm font-medium text-slate-700">Seleccionar Contrato:</label>
        <select v-model="selectedContractId" @change="fetchPettyCash" class="border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="" disabled>Seleccione...</option>
          <option v-for="c in contracts" :key="c.id" :value="c.id">{{ c.title }}</option>
        </select>
      </div>

      <div v-if="loading" class="bg-white p-10 rounded-lg shadow-sm border border-slate-200 text-center text-slate-500">
        Cargando fondo fijo...
      </div>

      <div v-else-if="pettyCash" class="space-y-6">
        
        <!-- Resumen Financiero -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 class="text-slate-500 text-sm font-medium uppercase mb-2">Asignado</h3>
            <p class="text-2xl font-bold text-blue-600">{{ formatCurrency(pettyCash.assignedAmount) }}</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 class="text-slate-500 text-sm font-medium uppercase mb-2">Saldo Disponible</h3>
            <p class="text-2xl font-bold text-green-600">{{ formatCurrency(pettyCash.currentBalance) }}</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex flex-col justify-center">
            <button @click="openModal" class="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 font-semibold">
              + Registrar Gasto
            </button>
          </div>
        </div>

        <!-- Tabla de Rendiciones -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div class="p-4 border-b border-slate-200">
            <h3 class="font-semibold text-slate-700">Rendiciones de Gastos</h3>
          </div>
          <table class="w-full text-sm text-left text-slate-500">
            <thead class="text-xs text-slate-700 uppercase bg-slate-50">
              <tr>
                <th class="px-6 py-3">Concepto</th>
                <th class="px-6 py-3">Monto</th>
                <th class="px-6 py-3">Estado</th>
                <th class="px-6 py-3">Fecha</th>
                <th class="px-6 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="pettyCash.expenses.length === 0">
                <td colspan="5" class="px-6 py-8 text-center text-slate-400">No hay gastos registrados.</td>
              </tr>
              <tr v-for="expense in pettyCash.expenses" :key="expense.id" class="border-b border-slate-200 hover:bg-slate-50">
                <td class="px-6 py-4 font-medium text-slate-900">{{ expense.concept }}</td>
                <td class="px-6 py-4">{{ formatCurrency(expense.amount) }}</td>
                <td class="px-6 py-4">
                  <span :class="getStatusClass(expense.status)" class="px-2 py-1 text-xs rounded-full font-semibold">
                    {{ translateStatus(expense.status) }}
                  </span>
                </td>
                <td class="px-6 py-4">{{ new Date(expense.createdAt).toLocaleDateString('es-CL') }}</td>
                <td class="px-6 py-4 text-center space-x-2">
                  <template v-if="expense.status === 'PENDING'">
                    <button @click="approveExpense(expense.id)" class="text-green-600 hover:text-green-800 text-xs font-semibold">Aprobar</button>
                    <button @click="rejectExpense(expense.id)" class="text-red-600 hover:text-red-800 text-xs font-semibold">Rechazar</button>
                  </template>
                  <span v-else class="text-slate-400 text-xs">Procesado</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

           <div v-else class="bg-white p-10 rounded-lg shadow-sm border border-slate-200 text-center text-slate-400 space-y-4">
        <p>Este contrato no tiene fondo fijo asignado.</p>
        <button @click="openAssignModal" class="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 font-semibold">
          + Asignar Fondo Fijo
        </button>
      </div>
    </div>

    <!-- Modal para Registrar Gasto -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="closeModal">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="p-4 border-b border-slate-200 flex justify-between items-center">
          <h3 class="font-semibold text-slate-800">Registrar Gasto</h3>
          <button @click="closeModal" class="text-slate-400 hover:text-slate-600 text-2xl">×</button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Monto ($)</label>
            <input v-model.number="expenseData.amount" type="number" class="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Concepto</label>
            <input v-model="expenseData.concept" type="text" class="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej: Tornillos y materiales" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">URL Boleta/Factura (Opcional)</label>
            <input v-model="expenseData.receiptUrl" type="text" class="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="http://..." />
          </div>
        </div>
        <div class="p-4 border-t border-slate-200 flex justify-end gap-2">
          <button @click="closeModal" class="px-4 py-2 bg-slate-100 text-slate-700 rounded text-sm hover:bg-slate-200">Cancelar</button>
          <button @click="saveExpense" class="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">Guardar Gasto</button>
        </div>
      </div>
    </div>
    <!-- Modal para Asignar Fondo Fijo -->
    <div v-if="showAssignModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="closeAssignModal">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="p-4 border-b border-slate-200 flex justify-between items-center">
          <h3 class="font-semibold text-slate-800">Asignar Fondo Fijo</h3>
          <button @click="closeAssignModal" class="text-slate-400 hover:text-slate-600 text-2xl">×</button>
        </div>
        <div class="p-6 space-y-4">
          <p class="text-sm text-slate-500">Contrato: <span class="font-semibold text-slate-700">{{ contracts.find(c => c.id === selectedContractId)?.title }}</span></p>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Monto Asignado ($)</label>
            <input v-model.number="assignAmount" type="number" class="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div class="p-4 border-t border-slate-200 flex justify-end gap-2">
          <button @click="closeAssignModal" class="px-4 py-2 bg-slate-100 text-slate-700 rounded text-sm hover:bg-slate-200">Cancelar</button>
          <button @click="assignPettyCash" class="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700">Asignar</button>
        </div>
      </div>
    </div>

  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import MainLayout from '@/layouts/MainLayout.vue';
import api from '@/services/api';

interface Contract { id: number; title: string; }
interface Expense {
  id: number;
  amount: number;
  concept: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}
interface PettyCash {
  id: number;
  assignedAmount: number;
  currentBalance: number;
  expenses: Expense[];
}

const contracts = ref<Contract[]>([]);
const selectedContractId = ref<number | ''>('');
const pettyCash = ref<PettyCash | null>(null);
const loading = ref(false);
const showModal = ref(false);
const showAssignModal = ref(false);
const assignAmount = ref(0);

const expenseData = ref({
  amount: 0,
  concept: '',
  receiptUrl: ''
});

const fetchContracts = async () => {
  try {
    const response = await api.get('/contracts');
    contracts.value = response.data;
  } catch (error) {
    console.error('Error al obtener contratos:', error);
  }
};

const fetchPettyCash = async () => {
  if (!selectedContractId.value) return;
  loading.value = true;
  pettyCash.value = null;
  try {
    const response = await api.get(`/petty-cash/contract/${selectedContractId.value}`);
    pettyCash.value = response.data;
  } catch (error) {
    console.error('Error al obtener fondo fijo:', error);
    alert('Este contrato no tiene fondo fijo asignado. Asígnalo desde Swagger primero.');
  } finally {
    loading.value = false;
  }
};

const openModal = () => {
  expenseData.value = { amount: 0, concept: '', receiptUrl: '' };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const saveExpense = async () => {
  if (!pettyCash.value) return;
  try {
    await api.post(`/petty-cash/${pettyCash.value.id}/expense`, expenseData.value);
    closeModal();
    fetchPettyCash(); // Actualizar lista
  } catch (error) {
    console.error('Error al guardar gasto:', error);
    alert('No se pudo guardar el gasto.');
  }
};

const approveExpense = async (id: number) => {
  try {
    await api.post(`/petty-cash/expense/${id}/approve`);
    fetchPettyCash();
  } catch (error) {
    console.error('Error al aprobar:', error);
  }
};

const rejectExpense = async (id: number) => {
  try {
    await api.post(`/petty-cash/expense/${id}/reject`);
    fetchPettyCash();
  } catch (error) {
    console.error('Error al rechazar:', error);
  }
};

// Helpers
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'APPROVED': return 'bg-green-100 text-green-800';
    case 'PENDING': return 'bg-yellow-100 text-yellow-800';
    case 'REJECTED': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const translateStatus = (status: string) => {
  switch (status) {
    case 'APPROVED': return 'Aprobado';
    case 'PENDING': return 'Pendiente';
    case 'REJECTED': return 'Rechazado';
    default: return status;
  }
};
const openAssignModal = () => {
  assignAmount.value = 0;
  showAssignModal.value = true;
};

const closeAssignModal = () => {
  showAssignModal.value = false;
};

const assignPettyCash = async () => {
  if (!selectedContractId.value) return;
  try {
    // Asumimos que el responsable es el usuario admin (ID 1) por ahora
    await api.post('/petty-cash', {
      assignedAmount: assignAmount.value,
      contractId: selectedContractId.value,
      responsibleId: 1 // ID del admin logueado
    });
    closeAssignModal();
    fetchPettyCash(); // Actualizar la vista
  } catch (error) {
    console.error('Error al asignar fondo fijo:', error);
    alert('No se pudo asignar el fondo fijo.');
  }
};

onMounted(() => {
  fetchContracts();
});
</script>