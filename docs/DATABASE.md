# Arquitectura de base de datos

## Normalización 3FN

El modelo separa cada concepto en una relación con una única responsabilidad:

- `employee` conserva exclusivamente identidad, rol, contacto, estado y referencia de turno.
- `work_shift` almacena la definición reutilizable del turno; evita repetir horarios por empleado.
- `employee_task` representa cada tarea como una fila independiente con estado, prioridad y vencimiento.
- Caballos, historiales, reservas, planes, inventario y movimientos se relacionan mediante claves foráneas y no duplican atributos maestros.

La migración V3 transforma los textos heredados de turnos y tareas, elimina las columnas desnormalizadas y agrega control de versión a inventario y reservas.

## Garantías ACID

- Los casos de uso que modifican varias tablas se ejecutan con `@Transactional`.
- Inventario usa bloqueo pesimista `SELECT ... FOR UPDATE`; evita que dos salidas simultáneas consuman el mismo stock.
- Inventario y reservas incluyen versión optimista para detectar escrituras obsoletas.
- PostgreSQL aplica una restricción de exclusión GiST para impedir reservas solapadas incluso bajo concurrencia.
- Claves foráneas, `CHECK`, `UNIQUE` y `NOT NULL` protegen consistencia aunque la escritura no provenga de la API.
- Flyway versiona el esquema; Hibernate opera con `ddl-auto=validate` y nunca modifica producción.

## Funciones PostgreSQL

- `fn_inventory_status(item_id)`: estado de disponibilidad.
- `fn_horse_health_status(horse_id)`: vencido, próximo o al día.
- `fn_set_updated_at()`: sello temporal automático.
- `fn_audit_row()`: auditoría JSONB genérica.
- `fn_protect_last_admin()`: evita eliminar o desactivar el último administrador.

## Triggers

Las tablas críticas tienen triggers `updated_at` y auditoría para inserciones, cambios y eliminaciones. `users` incorpora además protección del último administrador. La auditoría registra tabla, identificador, operación, usuario SQL, fecha, transacción y valores anterior/nuevo en JSONB.

## Vistas

- `vw_inventory_status`: stock, entradas, salidas y estado.
- `vw_horse_health_summary`: último control, próximo vencimiento y riesgo.
- `vw_reservation_utilization`: demanda y ocupación diaria por actividad.
- `vw_employee_workload`: tareas pendientes/completadas y turno.

## Operación segura

- Usar un usuario de aplicación sin permisos de propietario en producción.
- Ejecutar migraciones con una cuenta separada de despliegue.
- Mantener copias automáticas, pruebas de restauración y retención definida.
- Revisar y archivar `audit_log` según la política de conservación.
- No editar migraciones aplicadas; crear siempre una versión nueva.
