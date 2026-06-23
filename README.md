# Establo Horizonte

Sistema web para la gestión integral de una caballeriza. Incluye caballos, expedientes médicos, personal, agenda, planes de alimentación, inventario, alertas y control de acceso por roles.

## Arquitectura

El repositorio está separado en dos aplicaciones:

- `backend`: API REST con Java 21 y Spring Boot. Usa las capas Controller → Service → Repository, DTOs de entrada/salida, validación Jakarta, JPA, seguridad JWT y manejo global de excepciones.
- `frontend`: SPA responsiva con React, Vite y React Router. La comunicación HTTP está centralizada en `src/api.js`, facilitando reutilizar la lógica en una futura aplicación React Native.

El entorno local usa H2 persistente para reducir requisitos de instalación. El perfil `prod` utiliza PostgreSQL; Flyway V1-V4 es la única fuente de verdad del esquema relacional. Swagger documenta los contratos directamente desde la API.

Documentación ampliada: [API y ejemplos](docs/API.md), [arquitectura de base de datos](docs/DATABASE.md), [despliegue, S3 y SMTP](docs/DEPLOYMENT.md) y [trazabilidad de requisitos](docs/TRACEABILITY.md).

## Modelo de datos

- `User`: credenciales cifradas con BCrypt y rol (`ADMIN`, `CAREGIVER`, `VETERINARIAN`, `CLIENT`).
- `Horse`: identificador, datos físicos y fotografía opcional.
- `MedicalRecord`: vacuna, tratamiento, alergia u observación asociada a un caballo.
- `Employee`: rol laboral, contacto, turno y tareas.
- `Reservation`: actividad, intervalo, caballo, responsable y estado.
- `FeedingPlan`: alimento, cantidad y horario por caballo.
- `InventoryItem`: cantidad, unidad y umbral mínimo de stock.
- `SupplyRecord`: entradas y salidas de inventario con fecha, cantidad y responsable.
- `NotificationAlert`: alertas persistentes de stock, vacunación y tratamientos con estado leído.

## Ejecución local

Requisitos: Java 21, Maven 3.9+, Node.js 20+ y npm.

Backend:

```powershell
cd backend
mvn spring-boot:run
```

Frontend, en otra terminal:

```powershell
cd frontend
npm install
npm run dev
```

Abrir `http://localhost:5173`. La documentación Swagger está en `http://localhost:8080/swagger-ui.html` y la consola H2 en `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:file:./data/establo`, usuario `sa`, contraseña vacía).

### Credenciales de demostración

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | `admin@establo.cr` | `Admin123!` |
| Veterinario | `vet@establo.cr` | `Vet12345!` |
| Cuidador | `cuidador@establo.cr` | `Cuidador123!` |
| Cliente | `cliente@establo.cr` | `Cliente123!` |

Los usuarios registrados desde `/api/auth/register` reciben el rol `CLIENT`. Un administrador debe asignar roles privilegiados directamente mediante un flujo administrativo futuro; el registro público nunca acepta un rol enviado por el cliente.

## PostgreSQL

```powershell
docker compose up -d
$env:SPRING_PROFILES_ACTIVE="prod"
$env:JWT_SECRET="una-clave-segura-de-32-caracteres-o-mas"
cd backend
mvn spring-boot:run
```

Flyway ya está incorporado y JPA opera en modo `validate`; los cambios de esquema se versionan en `backend/src/main/resources/db/migration`.

No ejecute scripts manuales sobre una base administrada por Flyway. Cada cambio debe incorporarse como una migración nueva y revisada.

## Endpoints principales

| Método y ruta | Función |
|---|---|
| `POST /api/auth/login` | Autenticación y token JWT |
| `POST /api/auth/register` | Registro de cliente |
| `GET/POST/PUT/DELETE /api/horses` | Gestión de caballos |
| `GET /api/medical-records/horse/{id}` | Historial por caballo |
| `POST/PUT/DELETE /api/medical-records` | Gestión clínica |
| `GET/POST/PUT/DELETE /api/employees` | Personal (administrador) |
| `GET/POST/PUT /api/reservations` | Agenda y reservas |
| `PATCH /api/reservations/{id}/cancel` | Cancelar reserva |
| `GET/POST/PUT/DELETE /api/inventory` | Inventario |
| `GET/POST/PUT/DELETE /api/feeding-plans` | Alimentación |
| `GET/POST/DELETE /api/supply-records` | Movimientos de suministros |
| `GET/PATCH /api/notifications` | Bandeja y lectura de alertas |
| `GET/PATCH /api/users` | Administración de roles y cuentas |
| `POST /api/files/horses` | Carga validada de fotografías |
| `GET /api/horses/search` | Búsqueda paginada de caballos |
| `GET /api/reservations/search` | Reservas paginadas y filtradas |
| `GET /api/inventory/search` | Inventario paginado y filtrado |
| `GET /api/dashboard` | Indicadores y alertas |

## Pruebas y compilación

```powershell
cd backend
mvn test

cd ../frontend
npm test
npm run build
```

Las pruebas backend verifican stock, cupos, horarios y movimientos de suministros. Vitest y Testing Library verifican filtrado y acciones de componentes React; el build valida el empaquetado completo.

## Guion sugerido para video (máximo 5 minutos)

1. Iniciar sesión y explicar el dashboard y las alertas (30 s).
2. Registrar y editar un caballo (45 s).
3. Crear un expediente médico con próxima vacuna (45 s).
4. Registrar personal y explicar roles (35 s).
5. Agendar una monta e intentar un horario en conflicto (60 s).
6. Crear un plan de alimentación y mostrar una alerta de stock bajo (50 s).
7. Mostrar Swagger, diseño móvil y estructura del proyecto (40 s).

## Seguridad

Las contraseñas se almacenan con BCrypt. La API es stateless, usa JWT y aplica autorización tanto en endpoints como en rutas/acciones visibles del frontend. Cambie `JWT_SECRET` antes de desplegar, configure CORS para el dominio real y no versionar archivos `.env`.
