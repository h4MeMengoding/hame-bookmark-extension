# Package Extension Script
# This script builds and packages the extension into a .zip file ready for distribution

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Bookmark Extension - Package Script  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get version from manifest.json
$manifest = Get-Content "manifest.json" | ConvertFrom-Json
$version = $manifest.version
$packageName = "bookmark-extension-v$version.zip"

Write-Host "📦 Packaging Extension v$version..." -ForegroundColor Yellow
Write-Host ""

# Step 1: Clean previous builds
Write-Host "🧹 Cleaning previous builds..." -ForegroundColor Cyan
if (Test-Path "dist") {
    Remove-Item -Path "dist" -Recurse -Force
}
if (Test-Path "releases") {
    Remove-Item -Path "releases\*.zip" -Force -ErrorAction SilentlyContinue
}

# Step 2: Install dependencies
Write-Host "📥 Installing dependencies..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm install failed!" -ForegroundColor Red
    exit 1
}

# Step 3: Build extension
Write-Host "🔨 Building extension..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

# Step 4: Create releases directory
if (-not (Test-Path "releases")) {
    New-Item -Path "releases" -ItemType Directory | Out-Null
}

# Step 5: Copy necessary files to dist
Write-Host "📋 Copying files..." -ForegroundColor Cyan
Copy-Item "manifest.json" -Destination "dist/" -Force
if (Test-Path "public/icons") {
    Copy-Item "public/icons" -Destination "dist/" -Recurse -Force
}

# Step 6: Create ZIP package
Write-Host "📦 Creating ZIP package..." -ForegroundColor Cyan
$distPath = Resolve-Path "dist"
$zipPath = Join-Path (Get-Location) "releases\$packageName"

# Remove old zip if exists
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

# Create zip
Compress-Archive -Path "$distPath\*" -DestinationPath $zipPath -CompressionLevel Optimal

# Step 7: Verify package
$zipSize = (Get-Item $zipPath).Length / 1KB
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ Package created successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📦 Package: $packageName" -ForegroundColor Cyan
Write-Host "📁 Location: releases\$packageName" -ForegroundColor Cyan
Write-Host "📊 Size: $([math]::Round($zipSize, 2)) KB" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Ready for distribution!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "1. Test the extension by loading from dist/ folder" -ForegroundColor Gray
Write-Host "2. Upload releases\$packageName to GitHub Releases" -ForegroundColor Gray
Write-Host "3. Users can download and extract the .zip file" -ForegroundColor Gray
Write-Host ""
