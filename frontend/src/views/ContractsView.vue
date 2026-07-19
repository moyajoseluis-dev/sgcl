<template>
  <MainLayout>
    <div class="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      
      <!-- Header -->
      <div class="p-4 border-b border-slate-200 flex justify-between items-center">
        <h3 class="font-semibold text-slate-700">Gestión de Contratos</h3>
        <button @click="openCreateModal" class="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
          + Nuevo Contrato
        </button>
      </div>
      
      <!-- Tabla -->
      <div v-if="loading" class="p-10 text-center text-slate-500">Cargando contratos...</div>
      
      <table v-else class="w-full text-sm text-left text-slate-500">
        <thead class="text-xs text-slate-700 uppercase bg-slate-50">
          <tr>
            <th class="px-6 py-3">Título</th>
            <th class="px-6 py-3">Entidad</th>
            <th class="px-6 py-3">Monto</th>
            <th class="px-6 py-3">Estado</th>
            <th class="px-6 py-3">Vencimiento</th>
            <th class="px-6 py-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="contracts.length === 0">
            <td colspan="6" class="px-6 py-8 text-center text-slate-400">No hay contratos registrados.</td>
          </tr>
          <tr v-for="contract in contracts" :key="contract.id" class="border-b border-slate-200 hover:bg-slate-50">
            <td class="px-6 py-4 font-medium text-slate-900">{{ contract.title }}</td>
            <td class="px-6 py-4">{{ contract.entityName }}</td>
            <td class="px-6 py-4 font-semibold">${{ contract.amount.toLocaleString('es-CL') }}</td>
            <td class="px-6 py-4">
              <span :class="getStatusClass(contract.status)" class="px-2 py-1 text-xs rounded-full font-semibold">
                {{ contract.status }}
              </span>
            </td>
            <td class="px-6 py-4">{{ formatDate(contract.endDate) }}</td>
            <td class="px-6 py-4 text-center space-x-2">
              <button @click="openEditModal(contract)" class="text-blue-600 hover:text-blue-800 text-xs font-semibold">Editar</button>
              <button @click="deleteContract(contract.id)" class="text-red-600 hover:text-red-800 text-xs font-semibold">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de Crear/Editar -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="closeModal">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div class="p-4 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white">
          <h3 class="font-semibold text-slate-800">{{ editingContract ? 'Editar Contrato' : 'Nuevo Contrato' }}</h3>
          <button @click="closeModal" class="text-slate-400 hover:text-slate-600 text-2xl">×</button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Título</label>
            <input v-model="formData.title" type="text" class="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Entidad (Cliente/Proveedor)</label>
            <input v-model="formData.entityName" type="text" class="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Monto ($)</label>
            <input v-model.number="formData.amount" type="number" class="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Fecha Inicio</label>
              <input v-model="formData.startDate" type="date" class="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Fecha Término</label>
              <input v-model="formData.endDate" type="date" class="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Estado</label>
            <select v-model="formData.status" class="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="ACTIVE">Activo</option>
              <option value="PENDING">Pendiente</option>
              <option value="EXPIRED">Vencido</option>
              <option value="CANCELLED">Cancelado</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Descripción (Opcional)</label>
            <textarea v-model="formData.description" rows="3" class="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          </div>
        </div>
        <div class="p-4 border-t border-slate-200 flex justify-end gap-2 sticky bottom-0 bg-white">
          <button @click="closeModal" class="px-4 py-2 bg-slate-100 text-slate-700 rounded text-sm hover:bg-slate-200">Cancelar</button>
          <button @click="saveContract" class="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">Guardar</button>
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
  description?: string;
  status: string;
  startDate: string;
  endDate: string;
  amount: number;
  entityName: string;
}

const contracts = ref<Contract[]>([]);
const loading = ref(false);
const showModal = ref(false);
const editingContract = ref<Contract | null>(null);

const formData = ref({
  title: '',
  entityName: '',
  amount: 0,
  startDate: '',
  endDate: '',
  status: 'ACTIVE',
  description: ''
});

const fetchContracts = async () => {
  loading.value = true;
  try {
    const response = await api.get('/contracts');
    contracts.value = response.data;
  } catch (error) {
    console.error('Error al obtener contratos:', error);
  } finally {
    loading.value = false;
  }
};

const openCreateModal = () => {
  editingContract.value = null;
  formData.value = { title: '', entityName: '', amount: 0, startDate: '', endDate: '', status: 'ACTIVE', description: '' };
  showModal.value = true;
};

const openEditModal = (contract: Contract) => {
  editingContract.value = contract;
  formData.value = { 
    title: contract.title, 
    entityName: contract.entityName, 
    amount: contract.amount, 
    startDate: contract.startDate.split('T')[0], 
    endDate: contract.endDate.split('T')[0], 
    status: contract.status, 
    description: contract.description || '' 
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const saveContract = async () => {
  try {
    // Convertir fechas a formato ISO completo para el backend
    const payload = {
      ...formData.value,
      startDate: new Date(formData.value.startDate).toISOString(),
      endDate: new Date(formData.value.endDate).toISOString(),
    };

    if (editingContract.value) {
      await api.put(`/contracts/${editingContract.value.id}`, payload);
    } else {
      await api.post('/contracts', payload);
    }
    closeModal();
    fetchContracts();
  } catch (error) {
    console.error('Error al guardar contrato:', error);
    alert('Ocurrió un error al guardar el contrato.');
  }
};

const deleteContract = async (id: number) => {
  if (!confirm('¿Estás seguro de eliminar este contrato?')) return;
  try {
    await api.delete(`/contracts/${id}`);
    fetchContracts();
  } catch (error) {
    console.error('Error al eliminar:', error);
    alert('No se pudo eliminar el contrato.');
  }
};

// Helpers visuales
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-CL', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'ACTIVE': return 'bg-green-100 text-green-800';
    case 'PENDING': return 'bg-yellow-100 text-yellow-800';
    case 'EXPIRED': return 'bg-gray-100 text-gray-800';
    case 'CANCELLED': return 'bg-red-100 text-red-800';
    default: return 'bg-blue-100 text-blue-800';
  }
};

onMounted(() => {
  fetchContracts();
});
</script>