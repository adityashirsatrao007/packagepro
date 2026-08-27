#!/bin/bash
# PackagePro Setup Script
# Run this after cloning to download assets and start the server

set -e

echo "📦 Setting up PackagePro..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Download hackathon database
echo "Downloading database..."
mkdir -p data
if [ ! -f data/PS-04.db ]; then
  curl -L -o data/PS-04.db "https://raw.githubusercontent.com/adityashirsatrao007/packagepro/main/data/PS-04.db" 2>/dev/null || \
  echo "⚠️  Please download PS-04.db from the hackathon resources and place it in data/"
fi

# Download city images
echo "Downloading city images..."
mkdir -p public/images/packages
CITIES="agra bali bangkok chennai darjeeling delhi dubai goa jaipur jodhpur kathmandu kolkata kyoto manali mumbai rishikesh singapore udaipur varanasi zurich"
for city in $CITIES; do
  if [ ! -f "public/images/packages/${city}.jpg" ]; then
    curl -sL -o "public/images/packages/${city}.jpg" "https://placehold.co/800x600/1a1a2e/ffffff?text=${city^}" 2>/dev/null || true
  fi
done

if [ ! -f "public/images/packages/default.jpg" ]; then
  curl -sL -o "public/images/packages/default.jpg" "https://placehold.co/800x600/1a1a2e/ffffff?text=PackagePro" 2>/dev/null || true
fi

echo "✅ Setup complete!"
echo ""
echo "Run the development server:"
echo "  npm run dev"
echo ""
echo "Or production:"
echo "  npx next build && npx next start -p 3456"
