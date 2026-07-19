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
 Base de datos PostgreSQL integrada con Prisma ORM (Modelos: User, Role, Contract, ContractStatus).
 Módulo de Autenticación real (JWT, Passport, Bcrypt). Usuario real: admin@sgcl.cl / admin123.
 Control de Acceso por Roles (RBAC) con Guards y Decoradores.
 Base del SDK de Laudus (LaudusAuthService, LaudusClientService, BaseRepository).
 Módulo de Ventas (SalesModule) con buscador, paginación, detalle y descarga PDF.
 Módulo de Usuarios (UsersModule) con CRUD completo (Protegido para ADMIN).
 Módulo de Contratos (ContractsModule) con CRUD completo (Base de datos local).
 Inicialización Frontend (Vue 3, Tailwind 4, Layout profesional, Login, Rutas Protegidas).
 Conexión Frontend-Backend para todos los módulos.
Próximos Pasos
 Módulo de Compras (Integración Laudus /purchases/invoices).
 Dashboard con gráficos reales.
Estructura de Carpetas Actual
sgcl/├── docker-compose.yml├── ESTADO_PROYECTO.md├── .gitignore├── backend/│ ├── prisma/│ │ ├── schema.prisma│ │ └── seed.ts│ └── src/│ ├── app.module.ts│ ├── main.ts│ ├── config/│ ├── common/ (Guards: JWT, Roles; Decorators: Public, Roles)│ ├── prisma/ (PrismaService, PrismaModule)│ ├── laudus-sdk/│ └── modules/│ ├── auth/ (JWT strategy, login)│ ├── users/ (CRUD completo)│ ├── contracts/ (CRUD completo)│ └── sales/ (SalesController, SalesService con PDF y Paginación)└── frontend/ └── src/ ├── App.vue ├── main.ts ├── style.css ├── router/index.ts ├── services/api.ts (Instancia Axios) ├── stores/auth.ts (Pinia) ├── layouts/MainLayout.vue └── views/ (LoginView, DashboardView, SalesView, UsersView, ContractsView)


