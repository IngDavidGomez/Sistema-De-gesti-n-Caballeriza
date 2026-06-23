# Despliegue y servicios externos

## Stack completo con Docker

1. Copiar `.env.example` como `.env` y cambiar contraseñas y `JWT_SECRET`.
2. Ejecutar `docker compose up --build -d`.
3. Abrir `http://localhost:8088`.
4. Consultar logs con `docker compose logs -f backend`.
5. Detener con `docker compose down`. Agregar `-v` únicamente si se desea eliminar los datos.

PostgreSQL no se publica al host. El frontend Nginx sirve la SPA y enruta `/api`, `/uploads` y las imágenes de demostración hacia Spring Boot.

## Almacenamiento S3 compatible

Funciona con AWS S3, Cloudflare R2, MinIO y proveedores compatibles. Configure:

```env
STORAGE_PROVIDER=s3
STORAGE_PUBLIC_URL=https://cdn.example.com
S3_BUCKET=establo
S3_REGION=us-east-1
S3_ENDPOINT=https://<endpoint-opcional>
S3_ACCESS_KEY=<secreto>
S3_SECRET_KEY=<secreto>
```

## PostgreSQL administrado en Neon

Crear un proyecto en Neon y usar las credenciales de la cadena de conexión en variables separadas. En Render, `DB_URL` debe usar formato JDBC y SSL:

```env
DB_URL=jdbc:postgresql://<endpoint-neon>/<database>?sslmode=require
DB_USER=<usuario-neon>
DB_PASSWORD=<contrasena-neon>
DB_POOL_MAX_SIZE=5
DB_POOL_MIN_IDLE=0
```

No guardar estas credenciales en `.env`, GitHub ni `render.yaml`. Flyway ejecuta automáticamente las migraciones pendientes cuando inicia el backend. Para cargas normales conviene seleccionar el endpoint pooled de Neon y mantener el pool de la aplicación pequeño.

## Backend en Render

El archivo [`render.yaml`](../render.yaml) define el servicio Docker `establo-horizonte-api`. Render construye [`backend/Dockerfile`](../backend/Dockerfile), inyecta `PORT` y verifica `/actuator/health`.

1. Conectar el repositorio GitHub desde **New > Blueprint**.
2. Seleccionar `render.yaml`.
3. Completar las variables marcadas como secretas, especialmente `DB_URL`, `DB_USER`, `DB_PASSWORD`, `FRONTEND_URL` y `CORS_ALLOWED_ORIGINS`.
4. El Blueprint comienza con `STORAGE_PROVIDER=local` para permitir el primer despliegue. Antes de producción, cambiarlo a `s3` y completar las variables S3/R2; el disco local de Render no conserva de forma fiable las fotografías entre despliegues.
5. Tras desplegar, comprobar `/actuator/health`, `/swagger-ui.html` y un inicio de sesión real.

Render genera `JWT_SECRET` durante la creación del Blueprint. Cambiar este secreto invalida todas las sesiones existentes.

`STORAGE_PUBLIC_URL` debe apuntar al dominio público o CDN del bucket. Para desarrollo use `STORAGE_PROVIDER=local`; las imágenes quedan en un volumen persistente.

## Correo SMTP

```env
MAIL_MODE=smtp
MAIL_FROM=no-reply@example.com
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USERNAME=<usuario>
SMTP_PASSWORD=<secreto>
```

En desarrollo, `MAIL_MODE=log` evita dependencias externas y escribe el enlace de recuperación en el log. Nunca versionar el archivo `.env`.

## Migraciones

Flyway ejecuta `backend/src/main/resources/db/migration` antes de que JPA valide el modelo. Cada cambio futuro debe agregarse como una migración nueva; no se deben editar migraciones ya desplegadas.

## SonarQube opcional

El perfil Docker `quality` inicia SonarQube y una base PostgreSQL aislada en `http://localhost:9000`. No forma parte del arranque normal de la aplicación. Las instrucciones de cobertura, token y análisis están en [QUALITY.md](QUALITY.md).
