<template>
  <MainLayout>
    <div v-if="contract" class="space-y-6">
      
      <!-- Encabezado Superior -->
      <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <div class="flex flex-col md:flex-row justify-between md:items-center">
          <div>
            <h1 class="text-2xl font-bold text-slate-800">{{ contract.establishment?.name || contract.entityName }}</h1>
            <p class="text-slate-500 mt-1">
              Contrato #{{ contract.id }} - {{ contract.title }}
            </p>
          </div>
          <div class="flex gap-2 mt-4 md:mt-0">
            <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
              Vigencia: {{ new Date(contract.startDate).getFullYear() }} - {{ new Date(contract.endDate).getFullYear() }}
            </span>
            <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
              {{ contract.status }}
            </span>
          </div>
        </div>
      </div>

      <!-- Tarjetas de KPIs -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div class="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <p class="text-xs text-slate-500 uppercase font-medium mb-1">Facturado</p>
          <p class="text-lg font-bold text-slate-800">{{ formatCurrencyShort(contract.kpis.facturado) }}</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <p class="text-xs text-slate-500 uppercase font-medium mb-1">Cobrado</p>
          <p class="text-lg font-bold text-green-600">{{ formatCurrencyShort(contract.kpis.cobrado) }}</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <p class="text-xs text-slate-500 uppercase font-medium mb-1">Costo</p>
          <p class="text-lg font-bold text-red-600">{{ formatCurrencyShort(contract.kpis.costo) }}</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <p class="text-xs text-slate-500 uppercase font-medium mb-1">Margen</p>
          <p class="text-lg font-bold text-blue-600">{{ contract.kpis.margen }}%</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <p class="text-xs text-slate-500 uppercase font-medium mb-1">Avance</p>
          <p class="text-lg font-bold text-purple-600">{{ contract.kpis.avance }}%</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <p class="text-xs text-slate-500 uppercase font-medium mb-1">Doc. Pend.</p>
          <p class="text-lg font-bold text-yellow-600">{{ contract.kpis.documentosPendientes }}</p>
        </div>
      </div>

      <!-- Navegación por Pestañas (Tabs) -->
      <div class="border-b border-slate-200">
        <nav class="flex space-x-6 overflow-x-auto">
          <button 
            v-for="tab in tabs" 
            :key="tab" 
            @click="activeTab = tab" 
            :class="activeTab === tab ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'"
            class="py-3 text-sm font-medium border-b-2 whitespace-nowrap transition duration-200"
          >
            {{ tab }}
          </button>
        </nav>
      </div>

      <!-- Contenido de las Pestañas -->
      <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-200 min-h-[300px]">
        
        <div v-if="activeTab === 'Resumen'">
          <h3 class="text-lg font-semibold text-slate-800 mb-4">Información General</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div class="flex justify-between border-b border-slate-100 pb-2">
              <span class="text-slate-500">Cliente:</span>
              <span class="font-medium text-slate-800">{{ contract.entityName }}</span>
            </div>
            <div class="flex justify-between border-b border-slate-100 pb-2">
              <span class="text-slate-500">Monto Adjudicado:</span>
              <span class="font-medium text-slate-800">{{ formatCurrency(contract.amount) }}</span>
            </div>
            <div class="flex justify-between border-b border-slate-100 pb-2">
              <span class="text-slate-500">Fecha Inicio:</span>
              <span class="font-medium text-slate-800">{{ new Date(contract.startDate).toLocaleDateString('es-CL') }}</span>
            </div>
            <div class="flex justify-between border-b border-slate-100 pb-2">
              <span class="text-slate-500">Fecha Término:</span>
              <span class="font-medium text-slate-800">{{ new Date(contract.endDate).toLocaleDateString('es-CL') }}</span>
            </div>
          </div>
        </div>

        <div v-else-if="activeTab === 'Finanzas'">
          <h3 class="text-lg font-semibold text-slate-800 mb-4">Dashboard Financiero</h3>
          <div class="space-y-4">
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span class="text-slate-600">Ingresos (Facturado)</span>
                <span class="font-medium text-green-600">{{ formatCurrency(contract.kpis.facturado) }}</span>
              </div>
              <div class="w-full bg-slate-200 rounded-full h-2.5">
                <div class="bg-green-500 h-2.5 rounded-full" style="width: 100%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span class="text-slate-600">Egresos (Costo)</span>
                <span class="font-medium text-red-600">{{ formatCurrency(contract.kpis.costo) }}</span>
              </div>
              <div class="w-full bg-slate-200 rounded-full h-2.5">
                <div class="bg-red-500 h-2.5 rounded-full" :style="`width: ${(contract.kpis.costo / contract.kpis.facturado) * 100}%`"></div>
              </div>
            </div>
            <div class="pt-4 border-t border-slate-100">
              <div class="flex justify-between text-sm">
                <span class="text-slate-600 font-medium">Utilidad Estimada</span>
                <span class="font-bold text-blue-600">{{ formatCurrency(contract.kpis.facturado - contract.kpis.costo) }} ({{ contract.kpis.margen }}%)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Contenido para la pestaña de Operación -->
        <div v-else-if="activeTab === 'Operación'">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-slate-800">Registro de Actividades</h3>
            <button @click="openTaskModal" class="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
              + Nueva Tarea
            </button>
          </div>
          
          <table class="w-full text-sm text-left text-slate-500">
            <thead class="text-xs text-slate-700 uppercase bg-slate-50">
              <tr>
                <th class="px-4 py-3">Descripción</th>
                <th class="px-4 py-3">Tipo</th>
                <th class="px-4 py-3">Valor Unitario</th>
                <th class="px-4 py-3">Estado</th>
                <th class="px-4 py-3 text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="tasks.length === 0">
                <td colspan="5" class="px-4 py-6 text-center text-slate-400">No hay tareas registradas.</td>
              </tr>
              <tr v-for="task in tasks" :key="task.id" class="border-b border-slate-200 hover:bg-slate-50">
                <td class="px-4 py-3 font-medium text-slate-800">{{ task.description }}</td>
                <td class="px-4 py-3">
                  <span :class="getTaskTypeClass(task.type)" class="px-2 py-1 text-xs rounded-full font-semibold">
                    {{ translateTaskType(task.type) }}
                  </span>
                </td>
                <td class="px-4 py-3">{{ formatCurrency(task.unitPrice) }}</td>
                <td class="px-4 py-3">
                  <span :class="task.status === 'EXECUTED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'" class="px-2 py-1 text-xs rounded-full font-semibold">
                    {{ task.status === 'EXECUTED' ? 'Ejecutada' : 'Pendiente' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-center">
                  <button 
                    v-if="task.status === 'PENDING'" 
                    @click="executeTask(task.id)" 
                    class="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded text-xs hover:bg-green-100 font-semibold"
                  >
                    ✔ Ejecutar
                  </button>
                  <span v-else class="text-slate-400 text-xs">{{ new Date(task.executedAt).toLocaleDateString('es-CL') }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Placeholder para las demás pestañas -->
                <!-- Contenido para la pestaña de Estados de Pago -->
        <div v-else-if="activeTab === 'Estados de Pago'">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-slate-800">Ciclos de Facturación (Prefacturas)</h3>
            <button @click="createCycle" class="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
              + Generar Ciclo Mensual
            </button>
          </div>

          <div class="space-y-4">
            <div v-if="cycles.length === 0" class="text-center text-slate-400 py-6">
              No hay ciclos generados. Haz clic en "Generar Ciclo Mensual" para calcular las tareas ejecutadas.
            </div>

            <div v-for="cycle in cycles" :key="cycle.id" class="border border-slate-200 rounded-lg p-4">
              <div class="flex flex-col md:flex-row justify-between md:items-center mb-4">
                <div>
                  <h4 class="font-semibold text-slate-800">{{ cycle.period }}</h4>
                  <p class="text-sm text-slate-500">Monto Calculado: <span class="font-bold text-green-600">{{ formatCurrency(cycle.totalAmount) }}</span></p>
                </div>
                                <div class="flex items-center gap-2 mt-2 md:mt-0">
                  <span :class="getCycleStatusClass(cycle.status)" class="px-3 py-1 text-xs rounded-full font-semibold">
                    {{ translateCycleStatus(cycle.status) }}
                  </span>
                  <button 
                    @click="downloadReport(cycle.id)" 
                    class="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                  >
                    📄 Descargar Informe
                  </button>
                  <button 
                    v-if="cycle.status === 'DRAFT'" 
                    @click="submitCycle(cycle.id)" 
                    class="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                  >
                    Enviar a Cliente
                  </button>
                </div>
              </div>

              <!-- Sección de Documentos -->
              <div class="bg-slate-50 p-3 rounded border border-slate-100">
                <h5 class="text-xs font-bold text-slate-600 uppercase mb-2">Documentos Adjuntos</h5>
                <ul class="space-y-1 mb-3">
                  <li v-if="cycle.documents.length === 0" class="text-xs text-slate-400">No hay documentos adjuntos.</li>
                  <li v-for="doc in cycle.documents" :key="doc.id" class="text-xs text-slate-700 flex justify-between">
                    <span>📎 {{ translateDocType(doc.docType) }} - {{ doc.fileName }}</span>
                  </li>
                </ul>
                
                <!-- Formulario para adjuntar (solo si está en DRAFT) -->
                <div v-if="cycle.status === 'DRAFT'" class="flex flex-col md:flex-row gap-2 mt-2">
                  <select v-model="newDocData[cycle.id].docType" class="border border-slate-300 rounded px-2 py-1 text-xs flex-1">
                    <option value="F30">F-30 (RRHH)</option>
                    <option value="F30_1">F-30-1 (RRHH)</option>
                    <option value="ATTENDANCE">Informe Asistencia</option>
                    <option value="EXPENSE_REPORT">Informe Gastos</option>
                    <option value="EXECUTION_REPORT">Informe Ejecución</option>
                  </select>
                  <input v-model="newDocData[cycle.id].fileName" type="text" placeholder="Nombre archivo" class="border border-slate-300 rounded px-2 py-1 text-xs flex-1" />
                  <input v-model="newDocData[cycle.id].fileUrl" type="text" placeholder="URL archivo" class="border border-slate-300 rounded px-2 py-1 text-xs flex-1" />
                  <button @click="attachDoc(cycle.id)" class="bg-slate-800 text-white px-3 py-1 rounded text-xs hover:bg-slate-900">Adjuntar</button>
                </div>
              </div>
            </div>
          </div>
        </div>

                <!-- Contenido para la pestaña de Documentos -->
        <div v-else-if="activeTab === 'Documentos'">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-slate-800">Gestor Documental</h3>
            <div class="flex items-center gap-2">
              <input type="file" @change="handleFileSelect" ref="fileInput" class="hidden" />
              <button @click="fileInput?.click()" class="bg-slate-100 text-slate-700 px-4 py-2 rounded text-sm hover:bg-slate-200">
                Seleccionar Archivo
              </button>
              <button @click="uploadFile" :disabled="!selectedFile" class="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                Subir Archivo
              </button>
            </div>
          </div>
          
          <p v-if="selectedFile" class="text-sm text-slate-500 mb-4">
            Archivo listo para subir: <span class="font-semibold text-slate-800">{{ selectedFile.name }}</span>
          </p>

          <table class="w-full text-sm text-left text-slate-500">
            <thead class="text-xs text-slate-700 uppercase bg-slate-50">
              <tr>
                <th class="px-4 py-3">Nombre del Archivo</th>
                <th class="px-4 py-3">Tipo</th>
                <th class="px-4 py-3">Fecha Subida</th>
                <th class="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="documents.length === 0">
                <td colspan="4" class="px-4 py-6 text-center text-slate-400">No hay documentos subidos.</td>
              </tr>
              <tr v-for="doc in documents" :key="doc.id" class="border-b border-slate-200 hover:bg-slate-50">
                <td class="px-4 py-3 font-medium text-slate-800">
                  <a :href="`http://localhost:3001${doc.fileUrl}`" target="_blank" class="text-blue-600 hover:underline">
                    {{ doc.fileName }}
                  </a>
                </td>
                <td class="px-4 py-3">
                  <span class="bg-slate-100 text-slate-700 px-2 py-1 text-xs rounded-full font-semibold">{{ doc.fileType }}</span>
                </td>
                <td class="px-4 py-3">{{ new Date(doc.uploadedAt).toLocaleDateString('es-CL') }}</td>
                <td class="px-4 py-3 text-center">
                  <button @click="deleteDoc(doc.id)" class="text-red-600 hover:text-red-800 text-xs font-semibold">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Placeholder para las demás pestañas -->
                <!-- Contenido para la pestaña de Cronología -->
        <div v-else-if="activeTab === 'Cronología'">
          <h3 class="text-lg font-semibold text-slate-800 mb-6">Línea de Tiempo del Contrato</h3>
          
          <div class="relative border-l-2 border-slate-200 pl-6 space-y-8 ml-4">
            
            <div v-if="timeline.length === 0" class="text-slate-400">
              No hay eventos registrados.
            </div>

            <div v-for="(event, index) in timeline" :key="index" class="relative">
              <!-- Punto en la línea -->
              <span :class="getTimelineDotClass(event.type)" class="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white"></span>
              
              <!-- Tarjeta del evento -->
              <div class="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div class="flex justify-between items-center mb-1">
                  <h4 class="font-semibold text-slate-800 text-sm">{{ event.title }}</h4>
                  <span class="text-xs text-slate-400">{{ new Date(event.date).toLocaleDateString('es-CL', { year: 'numeric', month: 'short', day: 'numeric' }) }}</span>
                </div>
                <p class="text-sm text-slate-600">{{ event.description }}</p>
              </div>
            </div>

          </div>
        </div>

               <!-- Contenido para la pestaña de Gantt -->
        <div v-else-if="activeTab === 'Gantt'">
          <h3 class="text-lg font-semibold text-slate-800 mb-4">Cronograma de Tareas (Gantt)</h3>
          
          <div class="space-y-3">
            <div v-if="tasks.length === 0" class="text-slate-400 text-sm">No hay tareas programadas.</div>
            
            <div v-for="task in tasks" :key="task.id" class="flex items-center gap-4">
              <!-- Nombre de la tarea -->
              <div class="w-1/4 text-sm font-medium text-slate-700 truncate">
                {{ task.description }}
              </div>
              
              <!-- Barra de Gantt -->
              <div class="flex-1 bg-slate-100 rounded-full h-4 relative overflow-hidden">
                <div 
                  v-if="task.startDate && task.dueDate"
                  :class="task.status === 'EXECUTED' ? 'bg-green-500' : 'bg-blue-500'"
                  class="h-4 rounded-full absolute"
                  :style="getGanttBarStyle(task)"
                  :title="`${new Date(task.startDate).toLocaleDateString('es-CL')} - ${new Date(task.dueDate).toLocaleDateString('es-CL')}`"
                ></div>
                <span v-else class="text-xs text-slate-400 absolute inset-0 flex items-center justify-center">
                  Sin fechas programadas
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Placeholder para las demás pestañas -->
                <!-- Contenido para la pestaña de Calendario -->
        <div v-else-if="activeTab === 'Calendario'">
          <div class="flex justify-between items-center mb-6">
            <button @click="prevMonth" class="bg-slate-100 px-3 py-1 rounded hover:bg-slate-200 text-sm">← Mes Anterior</button>
            <h3 class="text-lg font-semibold text-slate-800">{{ formatMonthYear(calendarMonth) }}</h3>
            <button @click="nextMonth" class="bg-slate-100 px-3 py-1 rounded hover:bg-slate-200 text-sm">Mes Siguiente →</button>
          </div>

          <div class="grid grid-cols-7 gap-1 text-center text-xs text-slate-500 font-bold mb-2">
            <div>Lun</div><div>Mar</div><div>Mié</div><div>Jue</div><div>Vie</div><div>Sáb</div><div>Dom</div>
          </div>

          <div class="grid grid-cols-7 gap-1">
           <div v-for="(day, index) in calendarDays" :key="index" class="min-h-[80px] border border-slate-100 p-1 rounded">
              <p v-if="day.date" class="text-xs text-slate-400 mb-1">{{ day.date.getDate() }}</p>
              <div v-for="task in day.tasks" :key="task.id" class="bg-blue-100 text-blue-800 text-xs rounded px-1 py-0.5 mb-0.5 truncate">
                {{ task.description }}
              </div>
            </div>
          </div>
        </div>

        <!-- Placeholder para las demás pestañas -->
        <div v-else class="text-center text-slate-400 py-10">
          Módulo de {{ activeTab }} en construcción.
        </div>
      </div>

    </div>
    
    <div v-else class="bg-white p-10 rounded-lg shadow-sm border border-slate-200 text-center text-slate-400">
      Cargando contrato...
    </div>

    <!-- Modal para Nueva Tarea -->
    <div v-if="showTaskModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="closeTaskModal">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="p-4 border-b border-slate-200 flex justify-between items-center">
          <h3 class="font-semibold text-slate-800">Nueva Tarea / Actividad</h3>
          <button @click="closeTaskModal" class="text-slate-400 hover:text-slate-600 text-2xl">×</button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
            <input v-model="taskData.description" type="text" class="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej: Mantención mensual equipo 1" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
            <select v-model="taskData.type" class="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="PREVENTIVE">Preventivo</option>
              <option value="CORRECTIVE">Correctivo</option>
              <option value="WORK">Obra / Hito</option>
              <option value="OTHER">Otro</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Valor Unitario ($)</label>
            <input v-model.number="taskData.unitPrice" type="number" class="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Fecha Inicio</label>
              <input v-model="taskData.startDate" type="date" class="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Fecha Vencimiento</label>
              <input v-model="taskData.dueDate" type="date" class="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>
        
        <div class="p-4 border-t border-slate-200 flex justify-end gap-2">
          <button @click="closeTaskModal" class="px-4 py-2 bg-slate-100 text-slate-700 rounded text-sm hover:bg-slate-200">Cancelar</button>
          <button @click="saveTask" class="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">Guardar</button>
        </div>
      </div>
    </div>
    

  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import MainLayout from '@/layouts/MainLayout.vue';
import api from '@/services/api';

const route = useRoute();
const contract = ref<any>(null);
const activeTab = ref('Resumen');
const tasks = ref<any[]>([]);
const cycles = ref<any[]>([]);
const documents = ref<any[]>([]);
const timeline = ref<any[]>([]);
const selectedFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);


const newDocData = ref<Record<number, { docType: string; fileName: string; fileUrl: string }>>({});

const tabs = ['Resumen', 'Finanzas', 'Operación', 'Documentos', 'Estados de Pago', 'Gantt', 'Calendario','Cronología'];

const showTaskModal = ref(false);
const taskData = ref({
  description: '',
  type: 'PREVENTIVE',
  unitPrice: 0,
  startDate: '', // <--- Añadido
  dueDate: '',   // <--- Añadido
});

const fetchContract = async () => {
  const id = route.params.id;
  try {
    const response = await api.get(`/contracts/${id}`);
    contract.value = response.data;
    fetchTasks(); // Cargar tareas apenas carga el contrato
    fetchCycles();
    fetchDocuments();
    fetchTimeline();
  } catch (error) {
    console.error('Error al obtener el contrato:', error);
  }
};

const fetchTasks = async () => {
  if (!contract.value) return;
  try {
    const response = await api.get(`/tasks/contract/${contract.value.id}`);
    tasks.value = response.data;
  } catch (error) {
    console.error('Error al obtener tareas:', error);
  }
};

const fetchTimeline = async () => {
  if (!contract.value) return;
  try {
    const response = await api.get(`/contracts/${contract.value.id}/timeline`);
    timeline.value = response.data;
  } catch (error) {
    console.error('Error al obtener cronología:', error);
  }
};

const openTaskModal = () => {
  taskData.value = { description: '', type: 'PREVENTIVE', unitPrice: 0, startDate: '', dueDate: '' };
  showTaskModal.value = true;
};

const closeTaskModal = () => {
  showTaskModal.value = false;
};

const saveTask = async () => {
  if (!contract.value) return;
  try {
    await api.post('/tasks', { ...taskData.value, contractId: contract.value.id });
    closeTaskModal();
    fetchTasks();
  } catch (error) {
    console.error('Error al guardar tarea:', error);
  }
};

const executeTask = async (taskId: number) => {
  try {
    await api.post(`/tasks/${taskId}/execute`);
    fetchTasks(); // Actualizar lista para ver el estado cambiado
  } catch (error) {
    console.error('Error al ejecutar tarea:', error);
  }
};

// --- Lógica de Estados de Pago ---
const fetchCycles = async () => {
  if (!contract.value) return;
  try {
    const response = await api.get(`/billing/contract/${contract.value.id}`);
    cycles.value = response.data;
    // Inicializar el objeto para los inputs de documentos
    cycles.value.forEach(c => {
      if (!newDocData.value[c.id]) {
        newDocData.value[c.id] = { docType: 'F30', fileName: '', fileUrl: '' };
      }
    });
  } catch (error) {
    console.error('Error al obtener ciclos:', error);
  }
};

const createCycle = async () => {
  if (!contract.value) return;
  const period = prompt("Ingrese el periodo (Ej: Octubre 2026):");
  if (!period) return;

  try {
    await api.post('/billing/cycle', { contractId: contract.value.id, period });
    fetchCycles();
  } catch (error) {
    console.error('Error al crear ciclo:', error);
    alert('No se pudo generar el ciclo.');
  }
};

const attachDoc = async (cycleId: number) => {
  const docData = newDocData.value[cycleId];
  if (!docData.fileName || !docData.fileUrl) {
    alert('Debe ingresar nombre y URL del archivo.');
    return;
  }
  try {
    await api.post(`/billing/cycle/${cycleId}/document`, docData);
    // Limpiar inputs
    newDocData.value[cycleId] = { docType: 'F30', fileName: '', fileUrl: '' };
    fetchCycles();
  } catch (error) {
    console.error('Error al adjuntar:', error);
  }
};

const submitCycle = async (cycleId: number) => {
  if (!confirm('¿Estás seguro de enviar este paquete al cliente? No podrás modificarlo después.')) return;
  try {
    await api.post(`/billing/cycle/${cycleId}/submit`);
    fetchCycles();
  } catch (error: any) {
    alert(error.response?.data?.message || 'Error al enviar el paquete.');
  }
};


// --- Lógica de Gestión Documental ---
const fetchDocuments = async () => {
  if (!contract.value) return;
  try {
    const response = await api.get(`/documents/contract/${contract.value.id}`);
    documents.value = response.data;
  } catch (error) {
    console.error('Error al obtener documentos:', error);
  }
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0];
  }
};

const uploadFile = async () => {
  if (!selectedFile.value || !contract.value) return;
  
  const formData = new FormData();
  formData.append('file', selectedFile.value);

  try {
    await api.post(`/documents/upload/${contract.value.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    selectedFile.value = null;
    if (fileInput.value) fileInput.value.value = ''; // Limpiar input
    fetchDocuments(); // Actualizar lista
  } catch (error) {
    console.error('Error al subir archivo:', error);
    alert('No se pudo subir el archivo.');
  }
};

const deleteDoc = async (id: number) => {
  if (!confirm('¿Estás seguro de eliminar este documento?')) return;
  try {
    await api.delete(`/documents/${id}`);
    fetchDocuments();
  } catch (error) {
    console.error('Error al eliminar:', error);
  }
};

// Descargar el PDF del informe de ejecución
const downloadReport = async (cycleId: number) => {
  try {
    // Importante: responseType blob para archivos binarios
    const response = await api.get(`/reports/billing-cycle/${cycleId}/pdf`, { responseType: 'blob' });
    
    // Crear URL temporal y descargar
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `informe-ejecucion-${cycleId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error al descargar el informe:', error);
    alert('No se pudo generar el PDF.');
  }
};

// --- Lógica del Calendario ---
const calendarMonth = ref(new Date());

const nextMonth = () => {
  calendarMonth.value = new Date(calendarMonth.value.getFullYear(), calendarMonth.value.getMonth() + 1, 1);
};
const prevMonth = () => {
  calendarMonth.value = new Date(calendarMonth.value.getFullYear(), calendarMonth.value.getMonth() - 1, 1);
};

const calendarDays = computed(() => {
  const year = calendarMonth.value.getFullYear();
  const month = calendarMonth.value.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // Ajustar para empezar en Lunes (0=Domingo en JS, lo convertimos a Lunes=0)
  let startDayOfWeek = firstDay.getDay() - 1;
  if (startDayOfWeek < 0) startDayOfWeek = 6; // Si es Domingo

  const days = [];
  // Días vacíos al inicio
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push({ date: null, tasks: [] });
  }
  // Días del mes
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(year, month, d);
    const dayTasks = tasks.value.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate.getDate() === d && taskDate.getMonth() === month && taskDate.getFullYear() === year;
    });
    days.push({ date, tasks: dayTasks });
  }
  
  return days;
});

const formatMonthYear = (date: Date) => {
  return new Intl.DateTimeFormat('es-CL', { month: 'long', year: 'numeric' }).format(date);
};
// Helpers
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
};

const formatCurrencyShort = (value: number) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(0)} MM`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)} K`;
  return formatCurrency(value);
};

const getTaskTypeClass = (type: string) => {
  switch (type) {
    case 'PREVENTIVE': return 'bg-blue-100 text-blue-800';
    case 'CORRECTIVE': return 'bg-red-100 text-red-800';
    case 'WORK': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const translateTaskType = (type: string) => {
  switch (type) {
    case 'PREVENTIVE': return 'Preventivo';
    case 'CORRECTIVE': return 'Correctivo';
    case 'WORK': return 'Obra';
    default: return 'Otro';
  }
};

const getCycleStatusClass = (status: string) => {
  switch (status) {
    case 'DRAFT': return 'bg-yellow-100 text-yellow-800';
    case 'SUBMITTED': return 'bg-blue-100 text-blue-800';
    case 'APPROVED': return 'bg-green-100 text-green-800';
    case 'INVOICED': return 'bg-gray-100 text-gray-800';
    case 'REJECTED': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const translateCycleStatus = (status: string) => {
  switch (status) {
    case 'DRAFT': return 'En Armado';
    case 'SUBMITTED': return 'Enviado a Cliente';
    case 'APPROVED': return 'Aprobado';
    case 'INVOICED': return 'Facturado';
    case 'REJECTED': return 'Rechazado';
    default: return status;
  }
};

const translateDocType = (docType: string) => {
  switch (docType) {
    case 'F30': return 'F-30';
    case 'F30_1': return 'F-30-1';
    case 'ATTENDANCE': return 'Informe Asistencia';
    case 'EXPENSE_REPORT': return 'Informe Gastos';
    case 'EXECUTION_REPORT': return 'Informe Ejecución';
    default: return docType;
  }
};

const getTimelineDotClass = (type: string) => {
  switch (type) {
    case 'CONTRACT_CREATED': return 'bg-blue-500';
    case 'TASK_EXECUTED': return 'bg-green-500';
    case 'TASK_CREATED': return 'bg-yellow-500';
    case 'DOC_UPLOADED': return 'bg-purple-500';
    case 'BILLING_CYCLE': return 'bg-indigo-500';
    default: return 'bg-slate-400';
  }
};

// Calcula el ancho y posición de la barra de Gantt basado en las fechas
const getGanttBarStyle = (task: any) => {
  if (!task.startDate || !task.dueDate) return { width: '0%', left: '0%' };
  
  const start = new Date(task.startDate).getTime();
  const end = new Date(task.dueDate).getTime();
  const today = new Date().getTime();
  
  // Si la tarea ya terminó y está ejecutada, ocupa el 100%
  if (task.status === 'EXECUTED' || today > end) {
    return { width: '100%', left: '0%' };
  }
  
  // Si aún no empieza
  if (today < start) {
    return { width: '100%', left: '0%', opacity: '0.3' }; // Barra tenue
  }
  
  // Si está en progreso, calculamos el porcentaje avanzado hoy
  const totalDuration = end - start;
  const elapsed = today - start;
  const progress = Math.min(100, (elapsed / totalDuration) * 100);
  
  return { width: '100%', left: '0%', clipPath: `inset(0 ${100 - progress}% 0 0)` };
};

// Si el usuario cambia de contrato estando en la misma vista
watch(() => route.params.id, () => {
  fetchContract();
});

onMounted(() => {
  fetchContract();
});
</script>