const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Vercel build...');

try {
  // Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Build the application
  console.log('🔨 Building application...');
  execSync('npm run build', { stdio: 'inherit' });

  // Verify build output
  const buildDir = path.join(__dirname, 'build', 'client');
  const indexHtml = path.join(buildDir, 'index.html');

  if (!fs.existsSync(indexHtml)) {
    throw new Error('Build failed: index.html not found');
  }

  console.log('✅ Build completed successfully!');
  console.log(`📁 Build output: ${buildDir}`);
  console.log(`📄 Index file: ${indexHtml}`);

  // List build contents
  const files = fs.readdirSync(buildDir);
  console.log('📋 Build contents:', files);

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}