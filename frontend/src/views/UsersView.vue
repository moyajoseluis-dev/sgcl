<template>
  <MainLayout>
    <div class="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      
      <!-- Header -->
      <div class="p-4 border-b border-slate-200 flex justify-between items-center">
        <h3 class="font-semibold text-slate-700">Gestión de Usuarios</h3>
        <button @click="openCreateModal" class="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
          + Nuevo Usuario
        </button>
      </div>
      
      <!-- Tabla -->
      <div v-if="loading" class="p-10 text-center text-slate-500">Cargando usuarios...</div>
      
      <table v-else class="w-full text-sm text-left text-slate-500">
        <thead class="text-xs text-slate-700 uppercase bg-slate-50">
          <tr>
            <th class="px-6 py-3">Nombre</th>
            <th class="px-6 py-3">Email</th>
            <th class="px-6 py-3">Rol</th>
            <th class="px-6 py-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="users.length === 0">
            <td colspan="4" class="px-6 py-8 text-center text-slate-400">No hay usuarios registrados.</td>
          </tr>
          <tr v-for="user in users" :key="user.id" class="border-b border-slate-200 hover:bg-slate-50">
            <td class="px-6 py-4 font-medium text-slate-900">{{ user.firstName }} {{ user.lastName }}</td>
            <td class="px-6 py-4">{{ user.email }}</td>
            <td class="px-6 py-4">
              <span :class="user.role === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'" class="px-2 py-1 text-xs rounded-full font-semibold">
                {{ user.role }}
              </span>
            </td>
            <td class="px-6 py-4 text-center space-x-2">
              <button @click="openEditModal(user)" class="text-blue-600 hover:text-blue-800 text-xs font-semibold">Editar</button>
              <button @click="deleteUser(user.id)" class="text-red-600 hover:text-red-800 text-xs font-semibold">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de Crear/Editar -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="closeModal">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="p-4 border-b border-slate-200 flex justify-between items-center">
          <h3 class="font-semibold text-slate-800">{{ editingUser ? 'Editar Usuario' : 'Nuevo Usuario' }}</h3>
          <button @click="closeModal" class="text-slate-400 hover:text-slate-600 text-2xl">×</button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
            <input v-model="formData.firstName" type="text" class="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Apellido</label>
            <input v-model="formData.lastName" type="text" class="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input v-model="formData.email" type="email" class="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Contraseña {{ editingUser ? '(dejar vacío para no cambiar)' : '' }}</label>
            <input v-model="formData.password" type="password" class="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Rol</label>
            <select v-model="formData.role" class="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="USER">Usuario</option>
              <option value="MANAGER">Supervisor</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>
        </div>
        <div class="p-4 border-t border-slate-200 flex justify-end gap-2">
          <button @click="closeModal" class="px-4 py-2 bg-slate-100 text-slate-700 rounded text-sm hover:bg-slate-200">Cancelar</button>
          <button @click="saveUser" class="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">Guardar</button>
        </div>
      </div>
    </div>

  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import MainLayout from '@/layouts/MainLayout.vue';
import api from '@/services/api';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

const users = ref<User[]>([]);
const loading = ref(false);
const showModal = ref(false);
const editingUser = ref<User | null>(null);

const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: 'USER'
});

const fetchUsers = async () => {
  loading.value = true;
  try {
    const response = await api.get('/users');
    users.value = response.data;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
  } finally {
    loading.value = false;
  }
};

const openCreateModal = () => {
  editingUser.value = null;
  formData.value = { firstName: '', lastName: '', email: '', password: '', role: 'USER' };
  showModal.value = true;
};

const openEditModal = (user: User) => {
  editingUser.value = user;
  formData.value = { 
    firstName: user.firstName, 
    lastName: user.lastName, 
    email: user.email, 
    password: '', 
    role: user.role 
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const saveUser = async () => {
  try {
    if (editingUser.value) {
      // Editar
      // Separamos password del resto de los datos
      const { password, ...payload } = formData.value;
      
      // Si la contraseña está vacía, enviamos solo el payload (sin password)
      // Si tiene algo, la agregamos al payload
      const data = password ? { ...payload, password } : payload;
      
      await api.put(`/users/${editingUser.value.id}`, data);
    } else {
      // Crear
      await api.post('/users', formData.value);
    }
    closeModal();
    fetchUsers();
  } catch (error) {
    console.error('Error al guardar usuario:', error);
    alert('Ocurrió un error al guardar el usuario. Revisa que el email no esté repetido.');
  }
};

const deleteUser = async (id: number) => {
  if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
  try {
    await api.delete(`/users/${id}`);
    fetchUsers();
  } catch (error) {
    console.error('Error al eliminar:', error);
    alert('No se pudo eliminar el usuario.');
  }
};

onMounted(() => {
  fetchUsers();
});
</script>