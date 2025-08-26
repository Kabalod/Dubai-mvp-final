# Monitor Railway Deployment Script for Dubai MVP
# This script monitors the deployment progress

Write-Host "📊 Monitoring Railway Deployment for Dubai MVP..." -ForegroundColor Green

# Check GitHub Actions status
Write-Host ""
Write-Host "🔍 Checking GitHub Actions status..." -ForegroundColor Yellow
Write-Host "GitHub Actions URL: https://github.com/Kabalway/Workerproject/actions" -ForegroundColor Cyan

# Check if Railway CLI is available
try {
    $railwayVersion = npx @railway/cli --version
    Write-Host "✅ Railway CLI available: $railwayVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Railway CLI not available" -ForegroundColor Red
    Write-Host "Install with: npm install -g @railway/cli" -ForegroundColor Yellow
    exit 1
}

# Check Railway login status
Write-Host ""
Write-Host "🔐 Checking Railway login status..." -ForegroundColor Yellow
try {
    $loginStatus = npx @railway/cli whoami
    Write-Host "✅ Logged in as: $loginStatus" -ForegroundColor Green
} catch {
    Write-Host "❌ Not logged in to Railway" -ForegroundColor Red
    Write-Host "Please login first: npx @railway/cli login" -ForegroundColor Yellow
    exit 1
}

# Show Railway project status
Write-Host ""
Write-Host "📊 Railway project status:" -ForegroundColor Yellow
npx @railway/cli status

# Show recent logs
Write-Host ""
Write-Host "📋 Recent Railway logs:" -ForegroundColor Yellow
npx @railway/cli logs --tail=20

Write-Host ""
Write-Host "🔍 Monitoring commands:" -ForegroundColor Cyan
Write-Host "   • Real-time logs: npx @railway/cli logs -f" -ForegroundColor White
Write-Host "   • Project status: npx @railway/cli status" -ForegroundColor White
Write-Host "   • Open in browser: npx @railway/cli open" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Check GitHub Actions: https://github.com/Kabalway/Workerproject/actions" -ForegroundColor Yellow
