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

Estado Actual del Proyecto
 Infraestructura base (Git, Docker Compose para Postgres/Redis).
 Configuración base de Backend (NestJS).
 Módulo de Autenticación (JWT).
 SDK de Laudus (Auth, HttpClient, BaseRepository).
 Módulo de Ventas (Sales Invoices).
 Inicialización Frontend (Vue 3).
Estructura de Carpetas Prevista
sgcl/├── docker-compose.yml├── ESTADO_PROYECTO.md├── .gitignore├── backend/└── frontend/
