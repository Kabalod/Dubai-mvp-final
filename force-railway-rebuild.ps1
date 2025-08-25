# Force Railway Rebuild Script for Dubai MVP
# This script forces Railway to rebuild the Docker image

Write-Host "🔨 Force Railway Rebuild for Dubai MVP..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "railway.json")) {
    Write-Host "❌ railway.json not found. Please run this script from the project root." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Found railway.json" -ForegroundColor Green

# Show current git status
Write-Host "📊 Current git status:" -ForegroundColor Yellow
git status --porcelain

# Check if there are uncommitted changes
$uncommitted = git status --porcelain
if ($uncommitted) {
    Write-Host ""
    Write-Host "⚠️  You have uncommitted changes:" -ForegroundColor Yellow
    Write-Host $uncommitted -ForegroundColor White
    
    $commit = Read-Host "📝 Commit these changes before rebuilding? (y/n)"
    if ($commit -eq "y" -or $commit -eq "Y") {
        Write-Host "📝 Committing changes..." -ForegroundColor Yellow
        git add .
        git commit -m "🔨 Force Railway rebuild - update dependencies and configuration"
        Write-Host "✅ Changes committed" -ForegroundColor Green
    } else {
        Write-Host "❌ Please commit or stash changes before rebuilding" -ForegroundColor Red
        exit 1
    }
}

# Force push to trigger rebuild
Write-Host ""
Write-Host "🚀 Force pushing to trigger Railway rebuild..." -ForegroundColor Yellow
Write-Host "This will force Railway to rebuild the Docker image with new requirements.txt" -ForegroundColor Cyan

$confirm = Read-Host "🚀 Proceed with force push? (y/n)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "❌ Rebuild cancelled" -ForegroundColor Red
    exit 0
}

# Force push
Write-Host "🔄 Force pushing to prod branch..." -ForegroundColor Yellow
git push origin prod --force

Write-Host ""
Write-Host "🎉 Force push completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Check GitHub Actions: https://github.com/Kabalod/Workerproject/actions" -ForegroundColor White
Write-Host "   2. Monitor Railway deployment" -ForegroundColor White
Write-Host "   3. Check logs for any errors" -ForegroundColor White
Write-Host ""
Write-Host "⏰ Railway will now rebuild the image with updated dependencies" -ForegroundColor Yellow
