🗄️ Documentación de Base de Datos y Arquitectura de Módulos (SGCL v2.0)
Esta documentación describe detalladamente el esquema de la base de datos PostgreSQL local, la relación entre las tablas, el propósito de cada campo y cómo interactúan los módulos del sistema SGCL.

1. Visión General de la Arquitectura
SGCL utiliza una arquitectura de Sincronización Híbrida. Las entidades maestras (Clientes, Productos) se sincronizan desde Laudus a la base de datos local para garantizar lecturas ultrarrápidas. Las entidades operativas (Contratos, Tareas, Fondos Fijos, Estados de Pago) nacen y viven exclusivamente en la base de datos local.

2. Diccionario de Datos (Tablas y Campos)
User (Usuarios del Sistema)
Almacena las credenciales de acceso y roles para la autenticación RBAC.

id (Int, PK): Identificador único.
email (String, Unique): Correo electrónico para login.
password (String): Contraseña hasheada con Bcrypt.
firstName / lastName (String): Nombres del usuario.
role (Enum: ADMIN, MANAGER, USER): Rol que determina los permisos (ej. solo ADMIN ve el módulo de Auditoría y Usuarios).
Relaciones: Puede ser responsable de Fondos Fijos (PettyCash) y registra actividad en ActivityLog.
Customer (Clientes - Sincronizado)
Caché local de los clientes de Laudus. Se actualiza mediante el módulo de Sincronización.

id (Int, PK): ID original del cliente en Laudus.
name (String): Razón social o nombre.
vatId (String): RUT del cliente.
email / phone (String): Datos de contacto.
Relaciones: Un cliente puede tener múltiples Establishment (Establecimientos/Sucursales).
Establishment (Establecimientos)
Sucursales físicas de los clientes (ej. Hospital Sotero del Río).

id (Int, PK): Identificador local.
name (String): Nombre del establecimiento.
customerId (Int, FK): Relación con Customer.
Relaciones: Un establecimiento puede tener múltiples Contract.
Contract (Contratos - Núcleo del Sistema)
El eje central de la aplicación. Todo gira alrededor de esta tabla.

id (Int, PK): Identificador único.
title (String): Nombre del contrato (ej. "Mantención Climatización").
status (Enum: PENDING, ACTIVE, EXPIRED, CANCELLED): Estado operacional.
type (Enum: SERVICE, WORK, SUPPLY, RENTAL): Define la dinámica de la UI.
amount (Float): Monto total adjudicado.
progress (Float): Porcentaje de avance (0-100).
establishmentId (Int, FK): Establecimiento donde se ejecuta.
costCenterId (Int, FK): Centro de costo financiero asociado en Laudus.
Relaciones: Tiene PettyCash, ContractTask, StockMovement, BillingCycle, ContractDocument.
ContractTask (Tareas de Operación)
Actividades a realizar dentro de un contrato (Preventivos, Correctivos, Obras). Base para el cálculo de Prefacturas.

id (Int, PK): Identificador.
contractId (Int, FK): Contrato al que pertenece.
description (String): Qué se debe hacer (ej. "Mantención mensual equipo 1").
type (Enum: PREVENTIVE, CORRECTIVE, WORK, OTHER): Tipo de actividad.
status (Enum: PENDING, EXECUTED, RESCHEDULED): Estado de la tarea.
unitPrice (Float): Valor monetino. Si la tarea se ejecuta, este monto se suma al Estado de Pago.
startDate / dueDate (DateTime): Fechas para la Carta Gantt y Calendario.
executedAt (DateTime): Fecha real de ejecución.
BillingCycle (Estados de Pago / Prefacturas)
Cierres mensuales o por periodo de un contrato. Agrupa las tareas ejecutadas y los documentos de respaldo.

id (Int, PK): Identificador.
contractId (Int, FK): Contrato facturado.
period (String): Texto del periodo (ej. "Octubre 2026").
totalAmount (Float): Suma automática de los unitPrice de las tareas ejecutadas en ese contrato.
status (Enum: DRAFT, SUBMITTED, APPROVED, REJECTED, INVOICED): Controlado por el Motor de Workflow. Define si se puede editar, si está en revisión del cliente, o si ya se facturó en Laudus.
BillingDocument (Documentos de Cierre)
Archivos obligatorios exigidos por el cliente para aprobar un Estado de Pago (ej. F-30, Informes).

id (Int, PK).
billingCycleId (Int, FK): Ciclo al que pertenece.
docType (String): Tipo (F30, F30_1, ATTENDANCE, EXPENSE_REPORT).
fileName / fileUrl (String): Nombre y ruta del archivo.
ContractDocument (Gestor Documental General)
Archivos adjuntos directamente al contrato (Contrato firmado, OC, Garantías).

id (Int, PK).
contractId (Int, FK).
fileType (Enum: PDF, WORD, EXCEL, IMAGE, OTHER).
fileName / fileUrl (String): Ruta física en el servidor /uploads.
PettyCash y PettyCashExpense (Fondo Fijo)
Manejo de caja chica por contrato.

PettyCash.assignedAmount: Monto inicial asignado.
PettyCash.currentBalance: Saldo real disponible (se descuenta al aprobar gastos).
PettyCashExpense: Boletas subidas por supervisores. Al cambiar de PENDING a APPROVED, descuenta del saldo.
Product y StockMovement (Logística)
Product: Caché local de productos de Laudus.
StockMovement: Registro de salidas a bodega periférica (OUT_TO_SITE), consumos (CONSUMED) y retomos (RETURNED).
ActivityLog (Auditoría)
Registro inmutable de quién hizo qué y cuándo. Se llena automáticamente mediante el AuditInterceptor.

userId, action (CREATE, UPDATE, DELETE), entity (Contrato, Tarea...), details, ipAddress.
3. Integración de Módulos y Flujo de Datos
Sincronización: El botón en el Dashboard ejecuta SyncService. Este pide 1000 clientes y productos a Laudus y hace upsert en las tablas locales.
Operación: El supervisor entra al Contrato, va a la pestaña "Operación", crea tareas y les asigna fechas. Esto alimenta las pestañas "Gantt" y "Calendario".
Cierre (Estados de Pago): A fin de mes, se genera un BillingCycle. El sistema suma todas las ContractTask con status: EXECUTED y calcula el totalAmount.
Validación (Workflow): El supervisor sube los BillingDocument (F-30). Luego presiona "Enviar a Cliente" (DRAFT -> SUBMITTED). Si el cliente aprueba, el admin presiona "Aprobar" (SUBMITTED -> APPROVED). Finalmente, se factura en Laudus (APPROVED -> INVOICED).
Informes: En cualquier momento, se puede descargar el PDF del Informe de Ejecución generado por Puppeteer.
Auditoría: Todos los pasos 2, 3 y 4 quedan registrados en ActivityLog.