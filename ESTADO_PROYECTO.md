🚀 SGCL - Sistema de Gestión y Control Laudus (v2.0)
Arquitectura General
Frontend: Vue 3 + Vite + TailwindCSS 4 + Pinia + Axios + Chart.js (Desplegado en Vercel)
Backend: NestJS 11 + TypeScript Estricto (Sin any) (Desplegado en Render)
Base de Datos: PostgreSQL 16 (Gestionado con Prisma ORM 5) (Desplegado en Neon)
Integraciones: Laudus API (SDK + Sync Híbrido), Wazzup API (WhatsApp), SMTP (Email)
Enfoque V2.0: Entity-Centric & Operación Ágil
SGCL se posiciona como la "Capa de Operación Diaria" que une la rapidez de un CRM con el rigor de un ERP (Laudus). El enfoque Contract-Centric permite centralizar finanzas, operación, documentación y comunicación en un solo lugar, ocultando la complejidad de Laudus y el ruido de Bitrix24.

Roadmap V2.0
 Fase 1: Arquitectura Base y UI Contract-Centric
Nuevo schema.prisma: Project, CostCenter, Workflow.
Rediseño Frontend: Múltiples módulos operativos, responsivo (Mobile First).
 Fase 2: Módulo Logístico (Bodegas y Consignación)
Sincronización de stock local.
Flujos: Bodega Central -> Periférica (Consignación) -> Consumo.
 Fase 3: Módulo Financiero y Fondo Fijo
Sincronización de Facturas (Compra/Venta) y Presupuestos desde Laudus por Centro de Costo.
Panel de Salud Financiera del Proyecto (Presupuesto vs Real).
Módulo de Fondo Fijo: Carga de boletas por supervisor y aprobación de contador.
 Fase 4: Procesos Ágiles y Workflows
Compras de Mercado Público (OC directas sin contrato).
Motor de estados y diagramas visuales (vue-flow).
 Fase 5: Documentos, Comunicaciones y Firmas
Gestor documental (PDF, Word, Excel) asociado a contratos.
Bitácora bidireccional (WhatsApp/Email con Webhooks).
Firma electrónica avanzada (pdf-lib).
 Fase 6: Generador de Informes y App Móvil
Diseñador de PDF (Plantillas HTML -> Puppeteer).
Empaquetado APK con Capacitor.
Estado Actual (V1.0 Completada ✅)
Infraestructura base, Auth, RBAC, SDK Laudus, Módulo de Ventas/Compras, Sincronización Híbrida, Dashboard, Comunicaciones, Despliegue en Producción.

🚀 SGCL - Sistema de Gestión y Control Laudus (v2.0)
Arquitectura General
Frontend: Vue 3 + Vite + TailwindCSS 4 + Pinia + Axios + Chart.js (Desplegado en Vercel)
Backend: NestJS 11 + TypeScript Estricto (Sin any) (Desplegado en Render)
Base de Datos: PostgreSQL 16 (Gestionado con Prisma ORM 5) (Desplegado en Neon)
Integraciones: Laudus API (SDK + Sync Híbrido), Wazzup API (WhatsApp), SMTP (Email)
Enfoque V2.0: Entity-Centric & Operación Ágil
SGCL se posiciona como la "Capa de Operación Diaria". El enfoque Contract-Centric permite centralizar finanzas, operación, documentación y comunicación en un solo lugar (Hub del Contrato).

Estado Actual del Proyecto (V2.0 En Progreso)
 Infraestructura base, Auth, RBAC, SDK Laudus, Comunicaciones (V1.0).
 Arquitectura de Datos V2: Proyectos, Centros de Costo, Establecimientos, Workflows.
 Módulo de Fondo Fijo: Carga de boletas y aprobación contable.
 Módulo Logístico: Sincronización de productos, movimientos de bodega (Salida, Consumo, Retorno).
 Hub del Contrato (UI): Vista de detalle con KPIs y navegación por pestañas.
 Pestaña Operación: Registro de tareas (Preventivos/Correctivos) y ejecución.
 Pestaña Estados de Pago: Ciclos de facturación, cálculo automático desde tareas, y paquete documental (F-30, etc.).
 Pestaña Documentos: Gestor documental con subida real de archivos (Multer).
Próximos Pasos (Roadmap Inmediato)

Sistema de Logs: Registro de auditoría global (quién hizo qué y cuándo).

Cronología Visual: Línea de tiempo de eventos en el contrato.

Dashboard Ejecutivo Mejorado: Conexión con datos reales de la base de datos local.

Integrar Vista Detalle: Enlazar la lista de contratos al Hub del contrato.
Pendientes Posteriores
 Comunicaciones Bidireccionales (Webhooks Wazzup).
 Firma Electrónica (pdf-lib).
 Generador de Informes (Puppeteer).
 App Móvil (Capacitor).
Estructura de Carpetas Actual
sgcl/├── docker-compose.yml├── ESTADO_PROYECTO.md├── .gitignore├── docs/ (Informe Diseño, Manual Técnico, Manual Usuario)├── backend/│ ├── uploads/ (Archivos subidos)│ ├── prisma/│ │ ├── schema.prisma│ │ └── seed.ts│ └── src/│ ├── app.module.ts│ ├── main.ts│ ├── config/│ ├── common/ (Guards, Decorators)│ ├── prisma/ (PrismaService, PrismaModule)│ ├── laudus-sdk/│ └── modules/│ ├── auth/│ ├── users/│ ├── contracts/│ ├── sales/│ ├── purchases/│ ├── customers/│ ├── petty-cash/│ ├── logistics/│ ├── tasks/│ ├── billing/│ ├── documents/│ ├── sync/│ ├── dashboard/│ └── notifications/└── frontend/ └── src/ ├── App.vue ├── main.ts ├── style.css ├── router/index.ts ├── services/api.ts ├── stores/auth.ts ├── layouts/MainLayout.vue └── views/ (Login, Dashboard, Sales, Purchases, Users, Contracts, Customers, PettyCash, Logistics, ContractDetailView)





