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
