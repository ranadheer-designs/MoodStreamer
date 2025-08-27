#!/bin/bash

echo "🚀 Vercel Deployment Script"
echo "=========================="

# Check if we're in the right directory
if [ ! -f "web/package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    echo "   Expected structure: ./web/package.json"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Build the application
echo "🔨 Building application..."
cd web
npm run build

# Check if build was successful
if [ ! -f "build/client/index.html" ]; then
    echo "❌ Build failed: index.html not found"
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
echo ""
echo "📋 Important Configuration:"
echo "   - Root Directory: web"
echo "   - Build Command: npm run build"
echo "   - Output Directory: build/client"
echo "   - Framework: Vite"
echo ""

vercel --prod

echo ""
echo "🎉 Deployment completed!"
echo ""
echo "📝 Next steps:"
echo "   1. Set environment variables in Vercel dashboard"
echo "   2. Test your application"
echo "   3. Configure custom domain if needed"
echo ""
echo "📖 For detailed instructions, see VERCEL_DEPLOYMENT_STEPS.md"