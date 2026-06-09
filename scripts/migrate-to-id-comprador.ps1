# Script de Migração: customer_id → idComprador
# Data: 8 de Junho de 2026
# Objetivo: Alinhar backend e frontend com padrão legado

# Configurações
$projectRoot = "c:\Users\LG\Downloads\netto1\AllIn-OS2"
$backupDir = "$projectRoot\backup_before_migration"
$logFile = "$projectRoot\migration_log.txt"

# Criar diretório de backup
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
    Write-Host "Backup directory created: $backupDir"
}

# Iniciar log
Start-Transcript -Path $logFile -Force

Write-Host "=== MIGRAÇÃO: customer_id → idComprador ===" -ForegroundColor Green
Write-Host "Project Root: $projectRoot"
Write-Host "Backup Dir: $backupDir"
Write-Host ""

# Função para fazer backup de arquivo
function Backup-File {
    param($filePath)
    $relativePath = $filePath.Replace($projectRoot, "")
    $backupPath = $backupDir + $relativePath
    $backupDirPath = Split-Path $backupPath -Parent
    
    if (-not (Test-Path $backupDirPath)) {
        New-Item -ItemType Directory -Path $backupDirPath -Force | Out-Null
    }
    
    Copy-Item -Path $filePath -Destination $backupPath -Force
    Write-Host "Backed up: $relativePath" -ForegroundColor Gray
}

# Função para substituir em arquivo
function Replace-InFile {
    param($filePath, $oldText, $newText)
    try {
        $content = Get-Content -Path $filePath -Raw -Encoding UTF8
        if ($content -match [regex]::Escape($oldText)) {
            $newContent = $content -replace [regex]::Escape($oldText), $newText
            Set-Content -Path $filePath -Value $newContent -Encoding UTF8 -NoNewline
            return $true
        }
        return $false
    } catch {
        $errorMsg = $_.Exception.Message
        Write-Host "Error processing $filePath: $errorMsg" -ForegroundColor Red
        return $false
    }
}

# Encontrar todos os arquivos TypeScript/TypeScript React
Write-Host "Finding TypeScript files..." -ForegroundColor Yellow
$tsFiles = Get-ChildItem -Path $projectRoot -Recurse -Include *.ts,*.tsx | 
    Where-Object { $_.FullName -notlike "*node_modules*" -and $_.FullName -notlike "*backup*" }

Write-Host "Found $($tsFiles.Count) TypeScript files" -ForegroundColor Green
Write-Host ""

# Backup de todos os arquivos
Write-Host "=== BACKUP ===" -ForegroundColor Yellow
foreach ($file in $tsFiles) {
    Backup-File -filePath $file.FullName
}
Write-Host "Backup completed" -ForegroundColor Green
Write-Host ""

# Substituições a fazer
$replacements = @(
    @{ Old = "customer_id"; New = "id_comprador" },
    @{ Old = "customerId"; New = "idComprador" },
    @{ Old = "Customer ID"; New = "ID Comprador" },
    @{ Old = "customer ID"; New = "ID comprador" }
)

# Aplicar substituições
Write-Host "=== REPLACEMENTS ===" -ForegroundColor Yellow
$totalReplacements = 0

foreach ($replacement in $replacements) {
    Write-Host "Replacing '$($replacement.Old)' → '$($replacement.New)'" -ForegroundColor Cyan
    
    $fileCount = 0
    foreach ($file in $tsFiles) {
        $relativePath = $file.FullName.Replace($projectRoot, "")
        if (Replace-InFile -filePath $file.FullName -oldText $replacement.Old -newText $replacement.New) {
            $fileCount++
            Write-Host "  Updated: $relativePath" -ForegroundColor Gray
        }
    }
    
    Write-Host "  Files updated: $fileCount" -ForegroundColor Green
    $totalReplacements += $fileCount
    Write-Host ""
}

Write-Host "=== SUMMARY ===" -ForegroundColor Green
Write-Host "Total files processed: $($tsFiles.Count)"
Write-Host "Total replacements made: $totalReplacements"
Write-Host "Backup location: $backupDir"
Write-Host "Log file: $logFile"

Stop-Transcript

Write-Host ""
Write-Host "Migration completed!" -ForegroundColor Green
Write-Host "Please review the changes and test the system." -ForegroundColor Yellow
