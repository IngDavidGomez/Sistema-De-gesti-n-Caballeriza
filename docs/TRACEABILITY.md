# Matriz de trazabilidad

| Criterio | Interfaz | API / persistencia | Evidencia automatizada |
|---|---|---|---|
| CRUD y foto de caballos | Caballos | `/api/horses`, `/api/files/horses` | `FileStorageServiceTest` |
| Historial médico | Historial médico | `/api/medical-records` | Validación Jakarta y permisos de controlador |
| Personal, turnos y tareas | Personal | `/api/employees` | Acceso exclusivo ADMIN |
| Agenda, filtros y cancelación | Agenda | `/api/reservations` | `ReservationServiceTest` |
| Cupos | Agenda | Validación en `ReservationService` | Rechazo sobre capacidad |
| Alimentación | Alimentación | `/api/feeding-plans` | Validación de cantidades |
| Inventario y stock | Inventario | `/api/inventory` | `InventoryItemTest` |
| Suministros | Suministros | `/api/supply-records` | `SupplyRecordServiceTest` |
| Alertas y bandeja | Campana global | `/api/notifications` | Persistencia y estado leído |
| Registro y JWT | Acceso | `/api/auth` | BCrypt, JWT y rol CLIENT forzado |
| Recuperación | Acceso | `/api/auth/forgot-password`, `reset-password` | `PasswordResetServiceTest`, `PasswordRecovery.test.jsx` |
| Roles | Usuarios y rutas | `@PreAuthorize` y rutas privadas | Matriz ADMIN/CAREGIVER/VETERINARIAN/CLIENT |
| API móvil | Swagger | Endpoints paginados y filtrados | Contrato documentado en `API.md` |
| Responsividad | Todas las vistas | React/CSS | Verificación 390 px y escritorio |
| Arquitectura | — | Controller → Service → Repository | Paquetes separados y DTOs |
| Base relacional | — | PostgreSQL/H2 + Flyway | Migraciones V1-V4, 3FN, triggers, funciones y vistas |
| Despliegue | — | Docker Compose | PostgreSQL + backend + frontend |
| Reportes | Reportes operativos, CSV y PDF | `/api/reports/overview`, `/api/reports/overview.pdf` | `ReportServiceTest`, `ReportPdfServiceTest`, `Reports.test.jsx` |
