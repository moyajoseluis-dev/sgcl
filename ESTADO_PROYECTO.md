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
Estado Actual del Proyecto (Fase MVP Completada)
 Infraestructura base (Git, Docker Compose para Postgres/Redis).
 Configuración base de Backend (NestJS, TS estricto, ESLint, Prettier).
 Módulo de Autenticación propio (JWT, Passport, AuthService). Usuario en memoria: admin/admin.
 Base del SDK de Laudus (LaudusAuthService, LaudusClientService, BaseRepository).
 Módulo de Ventas (SalesModule) integrado y probado exitosamente contra Laudus.
 Inicialización Frontend (Vue 3, Tailwind 4, Layout profesional).
 Conexión Frontend-Backend (Login automático y fetch de facturas reales en Vue).
 Forzar cabeceras Accept: application/json en SDK para evitar respuestas CSV de Laudus.
 Renderizado exitoso de facturas en tabla de Vue.
Próximos Pasos (Por decidir)
 Crear pantalla de Login real en Vue (en vez de auto-login oculto).
 Implementar PostgreSQL con Prisma ORM para guardar usuarios propios y configuraciones.
 Ampliar Tabla de Facturas (Agregar paginación, botón ver detalle, más columnas).
 Crear módulo de Compras (/purchases).
 Generar PDF de facturas desde la interfaz.
