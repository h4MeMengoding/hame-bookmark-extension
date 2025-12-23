# Create minimal PNG icons for Chrome Extension
# This creates valid 1x1 pixel PNG files that Chrome will accept

$iconsDir = "C:\Users\Ilhame\Documents\Code\bookmark-extension\extension\dist\icons"

# Ensure directory exists
New-Item -ItemType Directory -Path $iconsDir -Force | Out-Null

# Minimal valid PNG file (1x1 purple pixel) in base64
# This is a valid PNG that Chrome will accept
$base64PNG = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
$pngBytes = [Convert]::FromBase64String($base64PNG)

# Create all required icon sizes (they'll all be 1x1, Chrome doesn't validate size)
@(16, 32, 48, 128) | ForEach-Object {
    $iconPath = Join-Path $iconsDir "icon$_.png"
    [System.IO.File]::WriteAllBytes($iconPath, $pngBytes)
    Write-Host "Created $iconPath" -ForegroundColor Green
}

Write-Host ""
Write-Host "All icons created successfully!" -ForegroundColor Green
Write-Host "Note: These are minimal 1x1 placeholder icons." -ForegroundColor Yellow
Write-Host "For production, replace with proper sized icons." -ForegroundColor Yellow
