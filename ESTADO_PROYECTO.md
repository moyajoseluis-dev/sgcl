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





