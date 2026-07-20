🏛️ Informe de Diseño Arquitectónico: SGCL (Sistema de Gestión y Control Laudus)
1. Resumen Ejecutivo
El sistema SGCL es una aplicación web empresarial diseñada para extender y optimizar las capacidades del ERP Laudus. Su objetivo principal es proporcionar una interfaz altamente reactiva, gestión de contratos propia, y administración de usuarios, mitigando la latencia de la API de Laudus mediante un patrón avanzado de sincronización híbrida y caché local en base de datos.

2. Justificación Tecnológica (Stack)
La selección de tecnologías se basó en criterios de rendimiento, seguridad, escalabilidad y mantenibilidad:

Frontend (Vue 3 + Vite + TailwindCSS 4): Vue 3 ofrece un sistema de reactividad superior y un rendimiento óptimo mediante la Composition API. Vite elimina los tiempos de espera en desarrollo, y TailwindCSS permite construir interfaces corporativas consistentes y responsivas sin escribir CSS personalizado.
Backend (NestJS 11 + TypeScript Estricto): NestJS proporciona una arquitectura modular lista para producción, ideal para aplicaciones empresariales. El uso de TypeScript en modo estricto (prohibiendo any) garantiza la integridad de los datos en tiempo de compilación, reduciendo errores en producción.
Base de Datos (PostgreSQL 16 + Prisma ORM): PostgreSQL es el estándar de oro para bases de datos relacionales open-source. Prisma ORM se utiliza para tener consultas type-safe, migraciones versionadas y prevención de inyección SQL a nivel de compilación.
Infraestructura (Docker): El uso de Docker y Docker Compose garantiza que el entorno de desarrollo (Base de datos, caché) sea idéntico al de producción, eliminando el problema de "funciona en mi máquina".
3. Diagrama de Arquitectura del Sistema
El sistema sigue una arquitectura de Monolito Modular Desacoplado, donde el backend actúa como un BFF (Backend For Frontend) y orquestador de servicios externos.

text

┌────────────────────────────────────────────────────────────┐
│                    CLIENTE (Navegador Web)                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Frontend: Vue 3 SPA (Vite + Pinia + TailwindCSS)      │ │
│  │  - Autenticación JWT                                   │ │
│  │  - Peticiones HTTP (Axios)                             │ │
│  └──────────────┬─────────────────────────────────────────┘ │
└─────────────────┼──────────────────────────────────────────┘
                  │ (REST API / JSON / HTTPS)
                  ▼
┌────────────────────────────────────────────────────────────┐
│               BACKEND: NestJS (TypeScript)                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Capa de Presentación (Controllers + Guards + DTOs)    │ │
│  └──────────────┬─────────────────────────────────────────┘ │
│                 │                                            │
│  ┌──────────────▼─────────────────────────────────────────┐ │
│  │  Capa de Aplicación (Services: Auth, Users, Contracts) │ │
│  └──────┬───────────────────────────────────┬─────────────┘ │
│         │                                   │               │
│  ┌──────▼─────────────────┐  ┌──────────────▼─────────────┐ │
│  │  Capa de Persistencia  │  │  Capa de Integración (SDK) │ │
│  │  (Prisma ORM)          │  │  LaudusAuthService         │ │
│  │  - Tablas Locales      │  │  LaudusClientService       │ │
│  │  - Sincronización      │  │  BaseRepository            │ │
│  └──────────┬─────────────┘  └──────────────┬─────────────┘ │
└─────────────┼───────────────────────────────┼──────────────┘
              │                                │ (HTTPS)
              ▼                                ▼
┌──────────────────────────┐    ┌─────────────────────────────┐
│   PostgreSQL (Docker)    │    │   API Externa: Laudus ERP   │
│   - Users, Contracts     │    │   - Facturas (Ventas/Compr.)│
│   - Customers (Sincron.) │    │   - Clientes                │
└──────────────────────────┘    └─────────────────────────────┘
4. Patrones de Diseño Implementados
Patrón SDK Desacoplado (Adapter): Laudus tiene una API con respuestas a veces inconsistentes (CSV vs JSON) y validaciones estrictas. Se construyó un SDK interno (laudus-sdk/) que aísla toda esta lógica. Si Laudus cambia su API mañana, solo se modifica el SDK; el resto de la aplicación (Servicios y Controladores) queda intacta.
Patrón Repository: El BaseRepository estandariza las operaciones CRUD hacia Laudus. Los repositorios específicos (SalesInvoicesRepository, CustomersRepository) heredan esta funcionalidad, promoviendo la reutilización de código (Principio DRY).
Sincronización Híbrida (Caché + Throttle): Para resolver la latencia de Laudus, los datos maestros (ej. Clientes) se copian a la base de datos local mediante un upsert. Se implementa un mecanismo de Throttling (límite de 5 minutos) para proteger la API de Laudus de solicitudes abusivas, combinando sincronización manual (on-demand) con futura sincronización programada (Cron Jobs).
Seguridad Basada en Roles (RBAC): Mediantes Guards (JwtAuthGuard, RolesGuard) y Decoradores (@Roles('ADMIN')), la seguridad se evalúa a nivel de ruta HTTP. En el Frontend, la reactividad de Pinia oculta los componentes de administración si el usuario no tiene el rol adecuado.
5. Modelo de Datos Relacional (Local)
La base de datos local almacena información crítica del sistema y una caché de datos maestros:

User: Gestiona las credenciales de acceso (hash Bcrypt), roles (ADMIN, MANAGER, USER) y datos personales.
Contract: Entidad de negocio principal del sistema SGCL. Almacena montos, estados y fechas de vigencia.
Customer: Tabla de caché sincronizada con Laudus. Permite búsquedas full-text instantáneas sin consultar al ERP externo.
Setting: Almacena configuraciones clave-valor, como la fecha de la última sincronización (lastSyncAt).
