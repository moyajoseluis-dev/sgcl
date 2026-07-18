🚀 SGCL - Sistema de Gestión y Control Laudus
Arquitectura General
Frontend: Vue 3 + Vite + TailwindCSS 4 + Pinia + Axios (Puerto 5173)
Backend: NestJS 11 + TypeScript Estricto (Sin any) (Puerto 3001)
Base de Datos: PostgreSQL 16 (Gestionado con Prisma ORM próximamente)
Infraestructura: Docker, Docker Compose
Integración: Laudus API (Vía SDK interno desacoplado)
Reglas de Diseño
Arquitectura modular en Backend.
Uso de patrones (Repository, DTOs, Builders).
SDK de Laudus aislado en backend/src/laudus-sdk/.
Seguridad: JWT, Validación estricta, Swagger.
Imports limpios usando alias @/ (configurado en tsconfig.json y vite.config.ts).
Estado Actual del Proyecto
 Infraestructura base (Git, Docker Compose para Postgres/Redis).
 Configuración base de Backend (NestJS, TS estricto, ESLint, Prettier).
 Módulo de Autenticación propio (JWT, Passport, AuthService). Usuario en memoria: admin/admin.
 Base del SDK de Laudus (LaudusAuthService, LaudusClientService, BaseRepository).
 Módulo de Ventas (SalesModule) integrado y probado exitosamente contra Laudus.
 Inicialización Frontend (Vue 3, Tailwind 4, Layout profesional).
 Conexión Frontend-Backend (Login automático y fetch de facturas reales en Vue).
 Refactor SDK Laudus: Forzar cabeceras Accept: application/json para evitar respuestas CSV.
 Base de datos PostgreSQL con Prisma ORM (Usuarios propios, configuraciones).
 Nuevos módulos (Compras, Clientes, Proveedores).
Configuración de Entorno
Backend (backend/.env): Requiere PORT, JWT_SECRET, credenciales LAUDUS_*.
Frontend: Apunta a http://localhost:3001/api/v1 por defecto.
Estructura de Carpetas Actual
sgcl/├── docker-compose.yml├── ESTADO_PROYECTO.md├── .gitignore├── backend/│ └── src/│ ├── app.module.ts│ ├── main.ts│ ├── config/│ ├── common/│ ├── laudus-sdk/│ │ ├── laudus-sdk.module.ts│ │ ├── dto/ (PagedRequest, FilterBy, OrderBy, etc)│ │ ├── models/ (SalesInvoice, etc)│ │ ├── repositories/ (BaseRepository, SalesInvoicesRepository)│ │ └── services/ (LaudusAuthService, LaudusClientService)│ └── modules/│ ├── auth/ (JWT strategy, login)│ └── sales/ (SalesController, SalesService)└── frontend/ └── src/ ├── App.vue ├── main.ts ├── style.css ├── router/index.ts ├── services/api.ts (Instancia Axios) ├── stores/auth.ts (Pinia) ├── layouts/MainLayout.vue └── views/ (DashboardView.vue, SalesView.vue)



