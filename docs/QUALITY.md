# Calidad de código con SonarQube

El proyecto se analiza como una sola aplicación en SonarQube: Java/Spring Boot y React. La cobertura backend se importa desde JaCoCo y la cobertura frontend desde LCOV generado por Vitest.

## Requisitos

- Docker Desktop activo con al menos 4 GB de memoria disponible.
- Java 21 y Maven para preparar el backend.
- Node.js y npm para preparar el frontend.

SonarQube y su PostgreSQL son servicios opcionales. No se inician con el `docker compose up -d` normal.

## 1. Iniciar SonarQube

```powershell
docker compose --profile quality up -d sonarqube
docker compose --profile quality ps
```

Abrir `http://localhost:9000`. En una instalación nueva, iniciar con `admin` / `admin`, cambiar la contraseña cuando se solicite y crear un token en **My Account → Security**.

No almacene el token en Git. Para la sesión actual:

```powershell
$env:SONAR_TOKEN="squ_token_generado"
```

## 2. Generar pruebas, binarios y cobertura

```powershell
cd backend
mvn clean verify dependency:copy-dependencies -DincludeScope=test -DoutputDirectory=target/dependency

cd ../frontend
npm ci
npm run test:coverage

cd ..
```

Los archivos esperados son:

- `backend/target/site/jacoco/jacoco.xml`
- `backend/target/classes`
- `backend/target/test-classes`
- `backend/target/dependency/*.jar`
- `frontend/coverage/lcov.info`

## 3. Ejecutar el análisis unificado

```powershell
docker compose --profile quality --profile scan run --rm sonar-scanner
```

En Windows se puede ejecutar todo el flujo (arranque, pruebas, cobertura y escaneo) con:

```powershell
$env:SONAR_TOKEN = "squ_..."
.\scripts\sonar-analysis.ps1
```

El script elimina `SONAR_TOKEN` de la sesion al finalizar para reducir la exposicion accidental del secreto.

El escáner usa [sonar-project.properties](../sonar-project.properties) y publica el proyecto `establo-horizonte`. Al terminar, revisar en `http://localhost:9000`:

- Quality Gate.
- Bugs y vulnerabilidades.
- Code Smells.
- Duplicaciones.
- Cobertura backend y frontend.
- Security Hotspots.

## 4. Análisis Maven independiente

Si se necesita analizar únicamente el backend:

```powershell
cd backend
mvn clean verify sonar:sonar `
  -Dsonar.host.url=http://localhost:9000 `
  -Dsonar.token=$env:SONAR_TOKEN `
  -Dsonar.projectKey=establo-horizonte-backend
```

## Operación

Para detener solo los servicios de calidad:

```powershell
docker compose stop sonarqube sonardb
```

Los datos se conservan en volúmenes Docker. Para eliminarlos deliberadamente:

```powershell
docker compose rm -f sonarqube sonardb
docker volume rm examen-final-pgmiv_sonar_data examen-final-pgmiv_sonar_extensions examen-final-pgmiv_sonar_logs examen-final-pgmiv_sonar_db_data
```

Los nombres de volumen pueden cambiar si Docker Compose usa otro nombre de proyecto; verifíquelos antes con `docker volume ls`.
