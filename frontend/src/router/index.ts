import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '@/views/DashboardView.vue';
import SalesView from '@/views/SalesView.vue';
import UsersView from '@/views/UsersView.vue';
import LoginView from '@/views/LoginView.vue';
import ContractsView from '@/views/ContractsView.vue';
import { useAuthStore } from '@/stores/auth'; // <--- Esta línea es la que faltaba
import PurchasesView from '@/views/PurchasesView.vue'; // <--- Nuevo
import CustomersView from '@/views/CustomersView.vue'; // <--- Nuevo


const routes = [
  { path: '/login', name: 'login', component: LoginView, meta: { guestOnly: true } },
  { path: '/', name: 'dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/sales', name: 'sales', component: SalesView, meta: { requiresAuth: true } },
  { path: '/users', name: 'users', component: UsersView, meta: { requiresAuth: true } },
  { path: '/customers', name: 'customers', component: CustomersView, meta: { requiresAuth: true } }, // <--- Nuevo
  { path: '/purchases', name: 'purchases', component: PurchasesView, meta: { requiresAuth: true } }, // <--- Nuevo
  { path: '/contracts', name: 'contracts', component: ContractsView, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guardia de navegación global
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Si la ruta requiere auth y no hay token, va al login
    next('/login');
  } else if (to.meta.guestOnly && authStore.isAuthenticated) {
    // Si ya está logueado e intenta ir al login, lo manda al dashboard
    next('/');
  } else {
    next();
  }
});

export default router;