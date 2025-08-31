# 🧹 Очистка старых и дублирующих скриптов
# Версия: Script Cleanup v1.0

Write-Host "🧹 Cleaning up old and duplicate scripts..." -ForegroundColor Cyan

# Список старых/дублирующих скриптов для удаления
$scriptsToRemove = @(
    "check-all-ports.ps1",
    "check-ports.ps1", 
    "check-railway-ready.ps1",
    "scripts/check-railway.ps1",
    "scripts/check-project-structure.ps1",
    "scripts/check-env.ps1",
    "scripts/backend-check.ps1",
    "scripts/comprehensive-check.ps1",
    "scripts/railway-health-check.ps1",
    "scripts/railway-monitor.ps1",
    "scripts/railway-auto-fix.ps1"
)

$removed = 0
foreach ($script in $scriptsToRemove) {
    if (Test-Path $script) {
        Write-Host "🗑️ Removing: $script" -ForegroundColor Yellow
        Remove-Item $script -Force
        $removed++
    }
}

Write-Host ""
Write-Host "✅ Cleanup completed: $removed files removed" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Available test scripts:" -ForegroundColor Cyan
Write-Host "  .\test-frontend.ps1      - Test frontend only (Port 80)"
Write-Host "  .\test-backend.ps1       - Test backend only (Port 8000)"  
Write-Host "  .\test-full-system.ps1   - Complete system test"
Write-Host "  .\check-apollo-status.ps1 - Verify Apollo Client removal"
Write-Host ""
Write-Host "🎯 Apollo Client has been completely removed!" -ForegroundColor Magenta
