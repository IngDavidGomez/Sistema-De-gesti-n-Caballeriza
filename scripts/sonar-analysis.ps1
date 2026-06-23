param(
    [string]$Token = $env:SONAR_TOKEN,
    [switch]$SkipServerStart
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot

if ([string]::IsNullOrWhiteSpace($Token)) {
    throw "Defina SONAR_TOKEN o use -Token con un token generado en SonarQube."
}

function Invoke-CheckedCommand {
    param(
        [Parameter(Mandatory)] [string]$Command,
        [Parameter(Mandatory)] [string[]]$Arguments,
        [Parameter(Mandatory)] [string]$WorkingDirectory
    )

    Push-Location $WorkingDirectory
    try {
        & $Command @Arguments
        if ($LASTEXITCODE -ne 0) {
            throw "El comando '$Command' termino con codigo $LASTEXITCODE."
        }
    }
    finally {
        Pop-Location
    }
}

if (-not $SkipServerStart) {
    Invoke-CheckedCommand -Command "docker" -Arguments @(
        "compose", "--profile", "quality", "up", "-d", "sonarqube"
    ) -WorkingDirectory $projectRoot
}

$deadline = (Get-Date).AddMinutes(8)
do {
    try {
        $system = Invoke-RestMethod -Uri "http://localhost:9000/api/system/status" -TimeoutSec 5
        if ($system.status -eq "UP") { break }
    }
    catch {
        # El servidor puede rechazar conexiones durante el arranque.
    }

    if ((Get-Date) -gt $deadline) {
        throw "SonarQube no estuvo disponible en http://localhost:9000 dentro del tiempo esperado."
    }
    Start-Sleep -Seconds 5
} while ($true)

Invoke-CheckedCommand -Command "mvn.cmd" -Arguments @(
    "clean", "verify", "dependency:copy-dependencies",
    "-DincludeScope=test", "-DoutputDirectory=target/dependency"
) -WorkingDirectory (Join-Path $projectRoot "backend")

Invoke-CheckedCommand -Command "npm.cmd" -Arguments @(
    "run", "test:coverage"
) -WorkingDirectory (Join-Path $projectRoot "frontend")

$env:SONAR_TOKEN = $Token
try {
    Invoke-CheckedCommand -Command "docker" -Arguments @(
        "compose", "--profile", "quality", "--profile", "scan",
        "run", "--rm", "sonar-scanner"
    ) -WorkingDirectory $projectRoot
}
finally {
    Remove-Item Env:SONAR_TOKEN -ErrorAction SilentlyContinue
}

Write-Host "Analisis completado: http://localhost:9000/dashboard?id=establo-horizonte"
