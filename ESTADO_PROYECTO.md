🚀 SGCL - Sistema de Gestión y Control Laudus
Arquitectura General
Frontend: Vue 3 + Vite + TailwindCSS 4 + Pinia + Axios + Chart.js (Puerto 5173)
Backend: NestJS 11 + TypeScript Estricto (Sin any) (Puerto 3001)
Base de Datos: PostgreSQL 16 (Gestionado con Prisma ORM 5)
Infraestructura: Docker, Docker Compose
Integraciones: Laudus API (SDK + Sync Híbrido), Wazzup API (WhatsApp), SMTP (Email)
Estado Actual del Proyecto (Plan Original Completado ✅)
 Infraestructura base (Git, Docker Compose para Postgres/Redis).
 Configuración base de Backend (NestJS, TS estricto, ESLint, Prettier).
 Base de datos PostgreSQL con Prisma ORM (Modelos: User, Contract, Setting, Customer).
 Módulo de Autenticación real (JWT, Passport, Bcrypt).
 Control de Acceso por Roles (RBAC) ocultando menús en Frontend.
 Base del SDK de Laudus (Auth, HttpClient, BaseRepository, Sales, Purchases, Customers).
 Módulo de Ventas y Compras (Integración directa con buscador, paginación y PDF).
 Módulo de Usuarios y Contratos (CRUD local completo).
 Módulo de Sincronización (Sync) con botón en Dashboard, límite de tiempo (throttle) y guardado en DB local.
 Módulo de Clientes Local (Lectura ultrarrápida desde base de datos propia).
 Dashboard dinámico con métricas de base de datos local, control de sincronización y Gráficos (Chart.js).
 Documentación Técnica (Informe de Diseño, Manual Técnico, Manual de Usuario).
 Motor de Comunicaciones (Notificaciones por WhatsApp y Email funcionando).
Próximas Funcionalidades (Futuras)
 Sincronización automática en background (Cron Jobs con @nestjs/schedule).
 Módulo de Productos local (Sincronizado).
 Exportación de reportes a Excel.
Estructura de Carpetas Actual
sgcl/├── docker-compose.yml├── ESTADO_PROYECTO.md├── .gitignore├── docs/ (Informe Diseño, Manual Técnico, Manual Usuario)├── backend/│ ├── prisma/│ │ ├── schema.prisma│ │ └── seed.ts│ └── src/│ ├── app.module.ts│ ├── main.ts│ ├── config/│ ├── common/ (Guards, Decorators)│ ├── prisma/ (PrismaService, PrismaModule)│ ├── laudus-sdk/│ └── modules/│ ├── auth/│ ├── users/│ ├── contracts/│ ├── sales/│ ├── purchases/│ ├── customers/ (Lectura local)│ ├── sync/ (SyncService con Throttle y Upsert)│ ├── dashboard/│ └── notifications/ (WhatsApp via Wazzup, Email via Nodemailer)└── frontend/ └── src/ ├── App.vue ├── main.ts ├── style.css ├── router/index.ts ├── services/api.ts ├── stores/auth.ts (Pinia, maneja isAdmin) ├── layouts/MainLayout.vue └── views/ (Login, Dashboard, Sales, Purchases, Users, Contracts, Customers)




