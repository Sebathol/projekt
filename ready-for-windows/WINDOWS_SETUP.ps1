# API Master - Windows Setup Script
# Führe dieses Skript auf deinem Windows 11 System aus
# Rechtsklick -> "Mit PowerShell ausführen"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  API Master - Windows Setup" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Zielverzeichnis
$targetDir = "D:\claudeapps\multi api management plattform"

# Erstelle Verzeichnisse
Write-Host "Erstelle Verzeichnisse..." -ForegroundColor Yellow

if (-not (Test-Path "D:\claudeapps")) {
    New-Item -Path "D:\claudeapps" -ItemType Directory -Force | Out-Null
    Write-Host "✓ D:\claudeapps erstellt" -ForegroundColor Green
} else {
    Write-Host "✓ D:\claudeapps existiert bereits" -ForegroundColor Green
}

if (-not (Test-Path $targetDir)) {
    New-Item -Path $targetDir -ItemType Directory -Force | Out-Null
    Write-Host "✓ $targetDir erstellt" -ForegroundColor Green
} else {
    Write-Host "✓ $targetDir existiert bereits" -ForegroundColor Green
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Verzeichnis bereit!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Nächster Schritt:" -ForegroundColor Yellow
Write-Host "Kopieren Sie den 'api-master' Ordner nach:" -ForegroundColor White
Write-Host "$targetDir" -ForegroundColor Cyan
Write-Host ""
Write-Host "Öffne Explorer..." -ForegroundColor Yellow

# Öffne Explorer
Start-Process explorer.exe -ArgumentList $targetDir

Write-Host ""
Write-Host "Drücken Sie eine beliebige Taste zum Beenden..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
