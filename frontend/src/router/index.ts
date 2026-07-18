import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '@/views/DashboardView.vue';
import SalesView from '@/views/SalesView.vue';

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView,
  },
  {
    path: '/sales',
    name: 'sales',
    component: SalesView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;