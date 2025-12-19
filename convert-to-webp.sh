#!/bin/bash

# WebP Image Conversion Script
# Converts all JPG, JPEG, and PNG images to WebP format
# Keeps originals as fallbacks

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if cwebp is installed
if ! command -v cwebp &> /dev/null; then
    echo "❌ cwebp is not installed. Installing via Homebrew..."
    brew install webp
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install webp. Please install manually: brew install webp"
        exit 1
    fi
fi

echo "🖼️  Starting WebP conversion..."
echo ""

# Function to convert image
convert_image() {
    local input="$1"
    local output="${input%.*}.webp"
    
    # Skip if WebP already exists
    if [ -f "$output" ]; then
        echo "⏭️  Skipping $input (WebP already exists)"
        return
    fi
    
    # Determine quality based on file type
    local quality=85
    if [[ "$input" == *"cert"* ]] || [[ "$input" == *"logo"* ]] || [[ "$input" == *"badge"* ]]; then
        quality=95  # Higher quality for logos/certifications
    fi
    
    # Convert to WebP
    cwebp -q "$quality" "$input" -o "$output" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        # Get file sizes (works on both macOS and Linux)
        if [[ "$OSTYPE" == "darwin"* ]]; then
            original_size=$(stat -f%z "$input" 2>/dev/null)
            webp_size=$(stat -f%z "$output" 2>/dev/null)
        else
            original_size=$(stat -c%s "$input" 2>/dev/null)
            webp_size=$(stat -c%s "$output" 2>/dev/null)
        fi
        
        if [ -n "$original_size" ] && [ -n "$webp_size" ] && [ "$original_size" -gt 0 ]; then
            savings=$(awk "BEGIN {printf \"%.1f\", (1 - $webp_size / $original_size) * 100}")
            echo "✅ Converted: $input → $output (${savings}% smaller)"
        else
            echo "✅ Converted: $input → $output"
        fi
    else
        echo "❌ Failed to convert: $input"
    fi
}

# Convert images in main img directory
echo "${YELLOW}Converting images in static/assets/img/${NC}"
shopt -s nullglob
for ext in jpg jpeg png JPG JPEG PNG; do
    for img in static/assets/img/*.$ext; do
        convert_image "$img"
    done
done

# Convert images in certs subdirectory
echo ""
echo "${YELLOW}Converting images in static/assets/img/certs/${NC}"
for ext in jpg jpeg png JPG JPEG PNG; do
    for img in static/assets/img/certs/*.$ext; do
        convert_image "$img"
    done
done
shopt -u nullglob

echo ""
echo "${GREEN}✨ WebP conversion complete!${NC}"
echo ""
echo "📝 Next steps:"
echo "   1. Review the converted WebP images"
echo "   2. Templates will be updated to use WebP with fallbacks"
echo "   3. Test the site to ensure images load correctly"

