🚀 SGCL - Sistema de Gestión y Control Laudus
Arquitectura General
Frontend: Vue 3 + Vite + TailwindCSS 4 + Pinia + Axios (Puerto 5173)
Backend: NestJS 11 + TypeScript Estricto (Sin any) (Puerto 3001)
Base de Datos: PostgreSQL 16 (Gestionado con Prisma ORM 5)
Infraestructura: Docker, Docker Compose
Integración: Laudus API (Vía SDK interno desacoplado)
Estado Actual del Proyecto
 Infraestructura base (Git, Docker Compose para Postgres/Redis).
 Configuración base de Backend (NestJS, TS estricto, ESLint, Prettier).
 Base de datos PostgreSQL integrada con Prisma ORM (Modelo User y Role).
 Módulo de Autenticación real (JWT, Passport, Bcrypt). Usuario real: admin@sgcl.cl / admin123.
 Base del SDK de Laudus (LaudusAuthService, LaudusClientService, BaseRepository).
 Módulo de Ventas (SalesModule) con buscador, paginación (offset/limit), detalle y descarga PDF.
 Inicialización Frontend (Vue 3, Tailwind 4, Layout profesional).
 Conexión Frontend-Backend (Login automático y fetch de facturas reales en Vue).
Próximos Pasos (Por decidir)
 Panel de administración de usuarios (CRUD).
 Nuevo módulo de Compras o Clientes.
 Módulo de Contratos (Base de datos propia + relación con Laudus).
 Gráficos en el Dashboard.
Estructura de Carpetas Actual
sgcl/├── docker-compose.yml├── ESTADO_PROYECTO.md├── .gitignore├── backend/│ ├── prisma/│ │ ├── schema.prisma│ │ └── seed.ts│ └── src/│ ├── app.module.ts│ ├── main.ts│ ├── config/│ ├── common/│ ├── prisma/ (PrismaService, PrismaModule)│ ├── laudus-sdk/│ └── modules/│ ├── auth/ (JWT strategy, login)│ ├── users/ (UsersService, CreateUserDto)│ └── sales/ (SalesController, SalesService con PDF y Paginación)└── frontend/ └── src/ ├── App.vue ├── main.ts ├── style.css ├── router/index.ts ├── services/api.ts (Instancia Axios) ├── stores/auth.ts (Pinia) ├── layouts/MainLayout.vue └── views/ (DashboardView.vue, SalesView.vue)
