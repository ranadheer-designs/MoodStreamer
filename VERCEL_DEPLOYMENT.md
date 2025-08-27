# Vercel Deployment Guide

This guide will help you deploy your React Router application to Vercel and fix common deployment errors.

## Prerequisites

- Vercel account
- GitHub repository with your code
- Node.js 18 or higher

## Quick Deployment

1. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click "New Project"

2. **Import your repository**
   - Select your repository
   - Vercel will automatically detect it's a Vercel project

3. **Configure the project**
   - **Framework Preset**: Vite
   - **Root Directory**: `web` (since your web app is in the web folder)
   - **Build Command**: `npm run build`
   - **Output Directory**: `build/client`
   - **Install Command**: `npm install`

4. **Set Environment Variables**
   - Add all required environment variables from your `.env` file
   - Make sure to use production values

5. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application

## Environment Variables

Set these in your Vercel project settings:

```env
# Database
DATABASE_URL=your_production_database_url

# Authentication
AUTH_SECRET=your_production_auth_secret
AUTH_URL=https://your-vercel-domain.vercel.app

# Project Configuration
PROJECT_GROUP_ID=your_project_group_id
BASE_URL=https://your-vercel-domain.vercel.app
PROXY_BASE_URL=https://your-vercel-domain.vercel.app
HOST=your-vercel-domain.vercel.app

# Stripe (if using payments)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## Common Vercel Errors and Solutions

### 1. FUNCTION_INVOCATION_FAILED (Function500)

**Cause**: Server-side rendering issues or build errors

**Solution**:
- Disable SSR by setting `ssr: false` in `react-router.config.ts`
- Check build logs for specific errors
- Ensure all dependencies are properly installed

### 2. DEPLOYMENT_BLOCKED (Deployment403)

**Cause**: Build configuration issues

**Solution**:
- Verify `vercel.json` configuration
- Check that build command and output directory are correct
- Ensure all required environment variables are set

### 3. BODY_NOT_A_STRING_FROM_FUNCTION (Function502)

**Cause**: Server function returning invalid response

**Solution**:
- Use client-side routing instead of SSR
- Ensure API routes return proper responses
- Check for infinite loops in server code

### 4. FUNCTION_INVOCATION_TIMEOUT (Function504)

**Cause**: Server function taking too long to respond

**Solution**:
- Optimize server code
- Use static generation where possible
- Implement proper caching

### 5. NOT_FOUND (Deployment404)

**Cause**: Missing routes or incorrect routing configuration

**Solution**:
- Verify `vercel.json` routes configuration
- Ensure all static files are in the correct output directory
- Check that client-side routing is properly configured

## Configuration Files

### vercel.json
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build/client",
  "framework": "vite",
  "routes": [
    {
      "src": "/health",
      "dest": "/api/health"
    },
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### react-router.config.ts
```typescript
import type { Config } from '@react-router/dev/config';

export default {
  appDirectory: './src/app',
  ssr: false, // Disable SSR for Vercel
  prerender: false,
} satisfies Config;
```

### vite.config.ts
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { aliases } from './plugins/aliases';
import { reactRouter } from '@react-router/dev/vite';

export default defineConfig({
  plugins: [
    react(),
    aliases(),
    reactRouter(),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    outDir: 'build/client',
    sourcemap: false,
  },
});
```

## Troubleshooting Steps

### 1. Check Build Logs
- Go to your Vercel project dashboard
- Click on the latest deployment
- Check the build logs for specific errors

### 2. Test Locally
```bash
cd web
npm run build
npm start
```

### 3. Verify Dependencies
```bash
cd web
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 4. Check Environment Variables
- Ensure all required environment variables are set in Vercel
- Use production values, not development values
- Check for typos in variable names

### 5. Debug Routing Issues
- Test your application locally first
- Ensure all routes are properly configured
- Check that client-side routing works

## Performance Optimization

### 1. Enable Caching
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 2. Optimize Bundle Size
- Use dynamic imports for large components
- Implement code splitting
- Optimize images and assets

### 3. Enable Compression
- Vercel automatically enables gzip compression
- Ensure your assets are optimized

## Monitoring and Debugging

### 1. Vercel Analytics
- Enable Vercel Analytics in your project settings
- Monitor performance and errors

### 2. Function Logs
- Check function logs in the Vercel dashboard
- Monitor for errors and performance issues

### 3. Real-time Monitoring
- Use Vercel's real-time monitoring features
- Set up alerts for critical errors

## Best Practices

1. **Use Static Generation** when possible
2. **Implement proper error boundaries** in your React components
3. **Optimize images** and use Vercel's image optimization
4. **Use environment variables** for configuration
5. **Implement proper caching strategies**
6. **Test thoroughly** before deploying to production

## Support

If you continue to experience issues:

1. Check the [Vercel documentation](https://vercel.com/docs)
2. Review the [Vercel community forum](https://github.com/vercel/vercel/discussions)
3. Contact [Vercel support](https://vercel.com/support)

## Alternative Deployment Options

If Vercel continues to cause issues, consider:

1. **Netlify**: Similar to Vercel, good for static sites
2. **Railway**: Good for full-stack applications
3. **AWS Amplify**: Good for AWS ecosystem
4. **Docker deployment**: More control over the environment