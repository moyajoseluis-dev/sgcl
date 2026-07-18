<template>
  <MainLayout>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <!-- Card 1 -->
      <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-slate-500 text-sm font-medium uppercase">Facturas Hoy</h3>
          <span class="text-blue-500 text-2xl">🧾</span>
        </div>
        <p class="text-3xl font-bold text-slate-800">142</p>
        <p class="text-green-500 text-sm mt-2">↑ 12% vs ayer</p>
      </div>
      
      <!-- Card 2 -->
      <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-slate-500 text-sm font-medium uppercase">Ventas Totales</h3>
          <span class="text-green-500 text-2xl">💰</span>
        </div>
        <p class="text-3xl font-bold text-slate-800">$15.400.000</p>
        <p class="text-green-500 text-sm mt-2">↑ 8% este mes</p>
      </div>

      <!-- Card 3 -->
      <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-slate-500 text-sm font-medium uppercase">Por Vencer</h3>
          <span class="text-yellow-500 text-2xl">⏳</span>
        </div>
        <p class="text-3xl font-bold text-slate-800">8</p>
        <p class="text-yellow-500 text-sm mt-2">Requiere atención</p>
      </div>

      <!-- Card 4 -->
      <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-slate-500 text-sm font-medium uppercase">Vencidas</h3>
          <span class="text-red-500 text-2xl">⚠️</span>
        </div>
        <p class="text-3xl font-bold text-slate-800">3</p>
        <p class="text-red-500 text-sm mt-2">Acción inmediata</p>
      </div>
    </div>

    <!-- Tabla de Resumen -->
    <div class="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div class="p-4 border-b border-slate-200 flex justify-between items-center">
        <h3 class="font-semibold text-slate-700">Últimas Facturas Sincronizadas</h3>
        <button class="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">Sincronizar Laudus</button>
      </div>
      <table class="w-full text-sm text-left text-slate-500">
        <thead class="text-xs text-slate-700 uppercase bg-slate-50">
          <tr>
            <th class="px-6 py-3">Folio</th>
            <th class="px-6 py-3">Cliente</th>
            <th class="px-6 py-3">Fecha</th>
            <th class="px-6 py-3 text-right">Monto</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-slate-200 hover:bg-slate-50">
            <td class="px-6 py-4 font-medium text-slate-900">F-10234</td>
            <td class="px-6 py-4">Distribuidora Norte</td>
            <td class="px-6 py-4">12-04-2024</td>
            <td class="px-6 py-4 text-right font-semibold">$250.000</td>
          </tr>
          <tr class="border-b border-slate-200 hover:bg-slate-50">
            <td class="px-6 py-4 font-medium text-slate-900">F-10233</td>
            <td class="px-6 py-4">Tecnología Sur Ltda.</td>
            <td class="px-6 py-4">11-04-2024</td>
            <td class="px-6 py-4 text-right font-semibold">$1.200.000</td>
          </tr>
        </tbody>
      </table>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue';
</script>