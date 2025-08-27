#!/bin/bash

echo "🔧 Vercel 404 NOT_FOUND Error Fix Script"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "web/package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    echo "   Expected structure: ./web/package.json"
    exit 1
fi

echo "✅ Project structure verified"

# Step 1: Clean and rebuild
echo ""
echo "🧹 Step 1: Cleaning and rebuilding..."
cd web

# Remove existing build artifacts
rm -rf build/
rm -rf node_modules/
rm -f package-lock.json

# Reinstall dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Verify build output
if [ ! -f "build/client/index.html" ]; then
    echo "❌ Build failed: index.html not found"
    exit 1
fi

echo "✅ Build successful!"

# Step 2: Verify configuration files
echo ""
echo "📋 Step 2: Verifying configuration files..."

# Check if vercel.json exists
if [ ! -f "vercel.json" ]; then
    echo "❌ vercel.json not found"
    exit 1
fi

# Check if vite.config.ts exists
if [ ! -f "vite.config.ts" ]; then
    echo "❌ vite.config.ts not found"
    exit 1
fi

# Check if react-router.config.ts exists
if [ ! -f "react-router.config.ts" ]; then
    echo "❌ react-router.config.ts not found"
    exit 1
fi

echo "✅ All configuration files present"

# Step 3: Display build output
echo ""
echo "📁 Step 3: Build output verification..."
echo "Build directory contents:"
ls -la build/client/

echo ""
echo "📄 index.html exists: $(test -f build/client/index.html && echo '✅ YES' || echo '❌ NO')"
echo "📁 assets directory exists: $(test -d build/client/assets && echo '✅ YES' || echo '❌ NO')"

# Step 4: Display configuration
echo ""
echo "⚙️  Step 4: Current configuration..."
echo ""
echo "vercel.json content:"
cat vercel.json

echo ""
echo "📋 Vercel Project Settings (set these in Vercel dashboard):"
echo "   Framework Preset: Vite"
echo "   Root Directory: web"
echo "   Build Command: npm run build"
echo "   Output Directory: build/client"
echo "   Install Command: npm install"

# Step 5: Deployment instructions
echo ""
echo "🚀 Step 5: Deployment Instructions"
echo "=================================="
echo ""
echo "Option 1: Vercel Dashboard"
echo "1. Go to https://vercel.com"
echo "2. Create new project"
echo "3. Import your GitHub repository"
echo "4. Set Root Directory to: web"
echo "5. Set Framework Preset to: Vite"
echo "6. Set Build Command to: npm run build"
echo "7. Set Output Directory to: build/client"
echo "8. Deploy"
echo ""
echo "Option 2: Vercel CLI"
echo "1. Install Vercel CLI: npm i -g vercel"
echo "2. Run: cd web && vercel"
echo "3. Follow the prompts"
echo ""
echo "Option 3: Force Redeploy"
echo "1. Delete current Vercel project"
echo "2. Create new project with settings above"
echo "3. Deploy"
echo ""

# Step 6: Troubleshooting tips
echo "🔍 Step 6: Troubleshooting Tips"
echo "==============================="
echo ""
echo "If you still get 404 errors:"
echo "1. Verify Root Directory is set to 'web' in Vercel"
echo "2. Check that build/client/index.html exists"
echo "3. Ensure all environment variables are set"
echo "4. Try deleting and recreating the Vercel project"
echo "5. Check Vercel build logs for errors"
echo ""

echo "🎯 Next Steps:"
echo "1. Deploy to Vercel using the settings above"
echo "2. Test your application"
echo "3. If issues persist, check VERCEL_404_TROUBLESHOOTING.md"
echo ""
echo "📖 For detailed troubleshooting, see: VERCEL_404_TROUBLESHOOTING.md"