# Railway Readiness Check Script for Dubai MVP
# This script checks if the project is ready for Railway deployment

Write-Host "🔍 Checking Railway Readiness for Dubai MVP..." -ForegroundColor Green

# Check if all required files exist
Write-Host "📁 Checking required files..." -ForegroundColor Yellow

$requiredFiles = @(
    "apps/realty-main/Dockerfile",
    "railway.json",
    "apps/realty-main/requirements.txt", 
    "apps/realty-main/realty/settings_railway.py",
    "apps/realty-main/realty/urls.py",
    "apps/realty-main/realty/api/views.py",
    "apps/realty-main/manage.py"
)

$missingFiles = @()
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $file (MISSING)" -ForegroundColor Red
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host ""
    Write-Host "❌ Missing required files:" -ForegroundColor Red
    foreach ($file in $missingFiles) {
        Write-Host "   - $file" -ForegroundColor Red
    }
    exit 1
}

# Check Dockerfile.railway content
Write-Host ""
Write-Host "🐳 Checking apps/realty-main/Dockerfile..." -ForegroundColor Yellow
$dockerfileContent = Get-Content "apps/realty-main/Dockerfile" -Raw
if ($dockerfileContent -match "gunicorn") {
    Write-Host "✅ Gunicorn configured correctly" -ForegroundColor Green
} else {
    Write-Host "❌ Gunicorn not found in Dockerfile" -ForegroundColor Red
}

if ($dockerfileContent -match "HEALTHCHECK") {
    Write-Host "✅ Health check configured" -ForegroundColor Green
} else {
    Write-Host "❌ Health check not configured" -ForegroundColor Red
}

# Check requirements.txt for essential packages
Write-Host ""
Write-Host "📦 Checking requirements.txt..." -ForegroundColor Yellow
$requirementsContent = Get-Content "apps/realty-main/requirements.txt" -Raw
$essentialPackages = @("django", "gunicorn", "environs", "marshmallow", "psycopg", "redis")

foreach ($package in $essentialPackages) {
    if ($requirementsContent -match $package) {
        Write-Host "✅ $package" -ForegroundColor Green
    } else {
        Write-Host "❌ $package (MISSING)" -ForegroundColor Red
    }
}

# Check railway.json configuration
Write-Host ""
Write-Host "🚂 Checking railway.json..." -ForegroundColor Yellow
if (Test-Path "railway.json") {
    try {
        $railwayConfig = Get-Content "railway.json" | ConvertFrom-Json
        Write-Host "✅ railway.json is valid JSON" -ForegroundColor Green
        
        if ($railwayConfig.build.dockerfilePath -eq "Dockerfile.railway") {
            Write-Host "✅ Dockerfile path configured correctly" -ForegroundColor Green
        } else {
            Write-Host "❌ Dockerfile path mismatch" -ForegroundColor Red
        }
        
        if ($railwayConfig.deploy.healthcheckPath -eq "/health/") {
            Write-Host "✅ Health check path configured" -ForegroundColor Green
        } else {
            Write-Host "❌ Health check path mismatch" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ railway.json is not valid JSON" -ForegroundColor Red
    }
}

# Check Django settings
Write-Host ""
Write-Host "⚙️ Checking Django settings..." -ForegroundColor Yellow
$settingsContent = Get-Content "realty/settings.py" -Raw

if ($settingsContent -match "environs") {
    Write-Host "✅ environs import found" -ForegroundColor Green
} else {
    Write-Host "❌ environs import not found" -ForegroundColor Red
}

if ($settingsContent -match "marshmallow") {
    Write-Host "✅ marshmallow import found" -ForegroundColor Green
} else {
    Write-Host "❌ marshmallow import not found" -ForegroundColor Red
}

# Check health check endpoint
Write-Host ""
Write-Host "🏥 Checking health check endpoint..." -ForegroundColor Yellow
$urlsContent = Get-Content "realty/urls.py" -Raw
if ($urlsContent -match "health/") {
    Write-Host "✅ Health check URL pattern found" -ForegroundColor Green
} else {
    Write-Host "❌ Health check URL pattern not found" -ForegroundColor Red
}

# Check .dockerignore
Write-Host ""
Write-Host "🚫 Checking .dockerignore..." -ForegroundColor Yellow
if (Test-Path ".dockerignore") {
    Write-Host "✅ .dockerignore exists" -ForegroundColor Green
} else {
    Write-Host "❌ .dockerignore missing" -ForegroundColor Red
}

# Final summary
Write-Host ""
Write-Host "📊 Railway Readiness Summary:" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

if ($missingFiles.Count -eq 0) {
    Write-Host "🎉 Project is READY for Railway deployment!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Next steps:" -ForegroundColor Cyan
    Write-Host "   1. Install Railway CLI: npm install -g @railway/cli" -ForegroundColor White
    Write-Host "   2. Login to Railway: railway login" -ForegroundColor White
    Write-Host "   3. Deploy: .\deploy-railway.ps1" -ForegroundColor White
} else {
    Write-Host "❌ Project is NOT READY for Railway deployment" -ForegroundColor Red
    Write-Host "   Fix the missing files above first" -ForegroundColor Red
}

Write-Host ""
Write-Host "📚 For more information, see: DOCKER_AND_RAILWAY_GUIDE.md" -ForegroundColor Yellow
