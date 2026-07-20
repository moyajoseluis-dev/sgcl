🚀 SGCL - Sistema de Gestión y Control Laudus
Arquitectura General
Frontend: Vue 3 + Vite + TailwindCSS 4 + Pinia + Axios (Puerto 5173)
Backend: NestJS 11 + TypeScript Estricto (Sin any) (Puerto 3001)
Base de Datos: PostgreSQL 16 (Gestionado con Prisma ORM 5)
Infraestructura: Docker, Docker Compose
Integración: Laudus API (Vía SDK interno desacoplado + Sync Híbrido)
Estado Actual del Proyecto
 Infraestructura base (Git, Docker Compose para Postgres/Redis).
 Configuración base de Backend (NestJS, TS estricto, ESLint, Prettier).
 Base de datos PostgreSQL con Prisma ORM (Modelos: User, Contract, Setting, Customer).
 Módulo de Autenticación real (JWT, Passport, Bcrypt).
 Control de Acceso por Roles (RBAC) ocultando menús en Frontend.
 Base del SDK de Laudus (Auth, HttpClient, BaseRepository, Sales, Purchases, Customers).
 Módulo de Ventas y Compras (Integración directa con buscador, paginación y PDF).
 Módulo de Usuarios y Contratos (CRUD local completo).
 Módulo de Sincronización (Sync) con botón en Dashboard, límite de tiempo (throttle) y guardado en DB local.
 Dashboard dinámico con métricas de base de datos local y control de sincronización.
Próximos Pasos
 Vista de Clientes local (Leer de la base de datos local sincronizada).
 Dashboard con gráficos reales.
 Documentación técnica (README, Diagramas).
Estructura de Carpetas Actual
sgcl/├── docker-compose.yml├── ESTADO_PROYECTO.md├── .gitignore├── backend/│ ├── prisma/│ │ ├── schema.prisma│ │ └── seed.ts│ └── src/│ ├── app.module.ts│ ├── main.ts│ ├── config/│ ├── common/ (Guards, Decorators)│ ├── prisma/ (PrismaService, PrismaModule)│ ├── laudus-sdk/│ └── modules/│ ├── auth/│ ├── users/│ ├── contracts/│ ├── sales/│ ├── purchases/│ └── sync/ (SyncService con Throttle y Upsert)└── frontend/ └── src/ ├── App.vue ├── main.ts ├── style.css ├── router/index.ts ├── services/api.ts ├── stores/auth.ts (Pinia, maneja isAdmin) ├── layouts/MainLayout.vue └── views/ (Login, Dashboard, Sales, Purchases, Users, Contracts)




