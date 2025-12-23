# Icons for Extension

## Quick Fix - Create Icons from SVG

Untuk sementara, gunakan online converter untuk convert `icon.svg` ke PNG:

1. Buka https://cloudconvert.com/svg-to-png
2. Upload `icon.svg`
3. Convert ke ukuran:
   - 16x16 → save as `icon16.png`
   - 32x32 → save as `icon32.png`
   - 48x48 → save as `icon48.png`
   - 128x128 → save as `icon128.png`
4. Copy semua PNG ke folder `extension/dist/icons/`

## Or Use This PowerShell Command (Requires ImageMagick)

```powershell
# Install ImageMagick first: winget install ImageMagick.ImageMagick

cd extension/public/icons
magick icon.svg -resize 16x16 ../../dist/icons/icon16.png
magick icon.svg -resize 32x32 ../../dist/icons/icon32.png
magick icon.svg -resize 48x48 ../../dist/icons/icon48.png
magick icon.svg -resize 128x128 ../../dist/icons/icon128.png
```

## Temporary Workaround

Extension akan tetap berfungsi tanpa icon, hanya icon default Chrome yang akan muncul.
