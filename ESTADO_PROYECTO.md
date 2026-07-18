🚀 SGCL - Sistema de Gestión y Control Laudus
Arquitectura General
Frontend: Vue 3 + Vite + TailwindCSS + Pinia (Próximamente)
Backend: NestJS 11 + TypeScript Estricto (Sin any)
Base de Datos: PostgreSQL 16 (Gestionado con Prisma ORM próximamente)
Infraestructura: Docker, Docker Compose
Integración: Laudus API (Vía SDK interno desacoplado)
Reglas de Diseño
Arquitectura modular en Backend.
Uso de patrones (Repository, DTOs, Builders).
SDK de Laudus aislado en backend/src/laudus-sdk/.
Seguridad: JWT, Validación estricta, Swagger.
Imports limpios usando alias @/ (configurado en tsconfig.json).
Estado Actual del Proyecto (Fase Backend)
 Infraestructura base (Git, Docker Compose para Postgres/Redis).
 Configuración base de Backend (NestJS, TS estricto, ESLint, Prettier).
 Módulo de Autenticación propio (JWT, Passport, AuthService). Usuario en memoria: admin/admin.
 Base del SDK de Laudus (LaudusAuthService para login automático y LaudusClientService para peticiones HTTP).
 Patrón BaseRepository y DTOs de Laudus (Filtros, Paginación).
 Módulo de Ventas (Sales Invoices) integrado con Laudus.
 Inicialización Frontend (Vue 3).
Configuración de Entorno (.env)
El backend requiere un archivo .env en backend/ con las siguientes variables:

PORT, NODE_ENV, JWT_SECRET, JWT_EXPIRES_IN
DATABASE_URL (PostgreSQL de Docker)
LAUDUS_BASE_URL, LAUDUS_USERNAME, LAUDUS_PASSWORD, LAUDUS_COMPANY_VAT_ID
Estructura de Carpetas Actual (Backend)
sgcl/├── docker-compose.yml├── ESTADO_PROYECTO.md├── .gitignore└── backend/ ├── .env ├── .env.example ├── .prettierrc ├── eslint.config.mjs ├── nest-cli.json ├── package.json ├── tsconfig.json ├── tsconfig.build.json └── src/ ├── app.module.ts ├── main.ts ├── config/ │ ├── configuration.ts │ └── validation.ts ├── common/ │ └── decorators/ │ └── public.decorator.ts ├── laudus-sdk/ │ ├── laudus-sdk.module.ts │ ├── models/ │ │ ├── login-request.model.ts │ │ ├── login-response.model.ts │ │ └── token.model.ts │ └── services/ │ ├── laudus-auth.service.ts │ └── laudus-client.service.ts └── modules/ └── auth/ ├── auth.module.ts ├── auth.controller.ts ├── auth.service.ts ├── dto/ │ ├── login.dto.ts │ └── login-response.dto.ts ├── interfaces/ │ └── jwt-payload.interface.ts └── strategies/ └── jwt.strategy.ts

