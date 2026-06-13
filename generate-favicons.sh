#!/bin/bash

# Favicon Generator Script for MILO Landing Page
# Requires ImageMagick (brew install imagemagick)

echo "Generating favicon files from favicon.svg..."

# Check if favicon.svg exists
if [ ! -f "favicon.svg" ]; then
    echo "Error: favicon.svg not found!"
    exit 1
fi

# Create favicon.ico (16x16, 32x32, 48x48) - Windows/Legacy
echo "Creating favicon.ico..."
convert -density 256x256 -background transparent favicon.svg -define icon:auto-resize=16,32,48 favicon.ico

# Create favicon-16x16.png - Browser tabs
echo "Creating favicon-16x16.png..."
convert -density 256x256 -background transparent favicon.svg -resize 16x16 favicon-16x16.png

# Create favicon-32x32.png - Browser tabs (Retina)
echo "Creating favicon-32x32.png..."
convert -density 256x256 -background transparent favicon.svg -resize 32x32 favicon-32x32.png

# Create apple-touch-icon.png (180x180) - iOS home screen
echo "Creating apple-touch-icon.png..."
convert -density 256x256 -background transparent favicon.svg -resize 180x180 apple-touch-icon.png

# Create android-chrome-192x192.png - Android home screen
echo "Creating android-chrome-192x192.png..."
convert -density 256x256 -background transparent favicon.svg -resize 192x192 android-chrome-192x192.png

# Create android-chrome-512x512.png - Android splash screen
echo "Creating android-chrome-512x512.png..."
convert -density 256x256 -background transparent favicon.svg -resize 512x512 android-chrome-512x512.png

# Create safari-pinned-tab.svg - Safari pinned tab
echo "Creating safari-pinned-tab.svg..."
cp favicon.svg safari-pinned-tab.svg

# Update site.webmanifest with relative paths
echo "Updating site.webmanifest..."
cat > site.webmanifest << EOL
{
  "name": "MILO",
  "short_name": "MILO",
  "icons": [
    {
      "src": "./android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "./android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#4FACFE",
  "background_color": "#030712",
  "display": "standalone"
}
EOL

echo ""
echo "✅ All favicon files generated successfully!"
echo ""
echo "Generated files:"
echo "  - favicon.ico (16x16, 32x32, 48x48)"
echo "  - favicon-16x16.png"
echo "  - favicon-32x32.png"
echo "  - apple-touch-icon.png (180x180)"
echo "  - android-chrome-192x192.png"
echo "  - android-chrome-512x512.png"
echo "  - safari-pinned-tab.svg"
echo "  - site.webmanifest (updated)"
echo ""
echo "To use: Place these files in your landing page root directory."
