# API REST

Base local: `http://localhost:8080/api`. Swagger: `http://localhost:8080/swagger-ui.html`.

## Autenticación

```http
POST /api/auth/login
Content-Type: application/json

{"email":"admin@establo.cr","password":"Admin123!"}
```

Respuesta `200`:

```json
{"token":"eyJ...","id":1,"name":"Administrador","email":"admin@establo.cr","role":"ADMIN"}
```

Las rutas privadas reciben `Authorization: Bearer <token>`. Los errores usan una estructura uniforme con estado, mensaje, ruta y errores de validación.

## Recuperación de contraseña

```http
POST /api/auth/forgot-password
Content-Type: application/json

{"email":"cliente@establo.cr"}
```

La respuesta es deliberadamente idéntica para cuentas existentes e inexistentes. En desarrollo, el enlace se escribe en el log del backend; con `MAIL_MODE=smtp` se envía por correo.

```http
POST /api/auth/reset-password
Content-Type: application/json

{"token":"token-recibido","password":"NuevaClave123!"}
```

## Paginación móvil

Los endpoints `/horses/search`, `/reservations/search` e `/inventory/search` aceptan `page`, `size` y `sort`. Ejemplo:

```http
GET /api/horses/search?q=andaluz&page=0&size=20&sort=name,asc
Authorization: Bearer <token>
```

La respuesta contiene `content`, `number`, `size`, `totalElements` y `totalPages`. Los filtros adicionales de reservas son `type` y `date`; inventario acepta `category` y `lowStock`.

## Carga de fotografías

```http
POST /api/files/horses
Authorization: Bearer <token>
Content-Type: multipart/form-data

file=<JPG, PNG o WebP; máximo 5 MB>
```

Respuesta: `{"url":"/uploads/horses/..."}` en modo local o una URL pública en modo S3.

## Estados de error

- `400`: validación o regla de negocio.
- `401`: token ausente, inválido o vencido.
- `403`: el rol no permite la acción.
- `404`: recurso inexistente.
- `413`: imagen superior a 5 MB.

## Reportes operativos

```http
GET /api/reports/overview?from=2026-06-01&to=2026-06-30
Authorization: Bearer <token>
```

Disponible para administrador, cuidador y veterinario. Consolida cinco reportes: vencimientos médicos, stock y movimientos, reservas y ocupación, carga del personal y cobertura alimentaria. El período máximo permitido es un año.

La versión PDF profesional se descarga desde:

```http
GET /api/reports/overview.pdf?from=2026-06-01&to=2026-06-30
Authorization: Bearer <token>
Accept: application/pdf
```

El documento incluye resumen ejecutivo, cinco secciones tabulares, identidad visual, fecha de generación y numeración de páginas.
