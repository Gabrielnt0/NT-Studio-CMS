param(
  [string]$OutputPath = "..\portfolio-CMS-clean.zip"
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$TempRoot = Join-Path $env:TEMP ("portfolio-cms-export-" + [guid]::NewGuid())
$TempProject = Join-Path $TempRoot "portfolio-CMS"

$ExcludedDirectories = @(
  ".git",
  "node_modules",
  "dist",
  ".agents",
  ".vite",
  "coverage",
  "supabase\.temp"
)

try {
  New-Item -ItemType Directory -Path $TempProject -Force | Out-Null

  $robocopyArgs = @(
    $ProjectRoot,
    $TempProject,
    "/E",
    "/NFL",
    "/NDL",
    "/NJH",
    "/NJS",
    "/NP",
    "/XD"
  ) + ($ExcludedDirectories | ForEach-Object {
    Join-Path $ProjectRoot $_
  })

  & robocopy @robocopyArgs | Out-Null

  if ($LASTEXITCODE -ge 8) {
    throw "Falha ao preparar os arquivos para compactação. Código Robocopy: $LASTEXITCODE"
  }

  $ResolvedOutput = [System.IO.Path]::GetFullPath(
    (Join-Path $ProjectRoot $OutputPath)
  )

  if (Test-Path $ResolvedOutput) {
    Remove-Item -Force $ResolvedOutput
  }

  Compress-Archive `
    -Path (Join-Path $TempProject "*") `
    -DestinationPath $ResolvedOutput `
    -CompressionLevel Optimal

  Write-Host ""
  Write-Host "ZIP limpo criado com sucesso:" -ForegroundColor Green
  Write-Host $ResolvedOutput
}
finally {
  if (Test-Path $TempRoot) {
    Remove-Item -Recurse -Force $TempRoot
  }
}
