# Vercel Deployment Steps - Fix 404 NOT_FOUND Error

This guide will help you deploy your application to Vercel and resolve the 404 NOT_FOUND error.

## Prerequisites

- Vercel account
- GitHub repository with your code
- Node.js 18 or higher

## Step 1: Prepare Your Repository

Make sure your repository has the following structure:
```
your-repo/
├── web/
│   ├── package.json
│   ├── vercel.json
│   ├── vite.config.ts
│   ├── react-router.config.ts
│   └── src/
└── README.md
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Create New Project**
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Project Settings**
   - **Framework Preset**: `Vite`
   - **Root Directory**: `web` (important!)
   - **Build Command**: `npm run build`
   - **Output Directory**: `build/client`
   - **Install Command**: `npm install`

4. **Set Environment Variables**
   Add these in the Environment Variables section:
   ```env
   DATABASE_URL=your_production_database_url
   AUTH_SECRET=your_production_auth_secret
   AUTH_URL=https://your-vercel-domain.vercel.app
   PROJECT_GROUP_ID=your_project_group_id
   BASE_URL=https://your-vercel-domain.vercel.app
   PROXY_BASE_URL=https://your-vercel-domain.vercel.app
   HOST=your-vercel-domain.vercel.app
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd web
   vercel
   ```

4. **Follow the prompts**
   - Set root directory to `web`
   - Confirm build settings
   - Set environment variables

## Step 3: Verify Configuration Files

### vercel.json
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "build/client",
  "framework": "vite",
  "installCommand": "npm install",
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
      "src": "/assets/(.*)",
      "dest": "/assets/$1"
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
  ssr: false, // Important: Disabled for Vercel
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
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: 'build/client',
    sourcemap: false,
  },
});
```

## Step 4: Troubleshooting 404 NOT_FOUND Error

### Common Causes and Solutions

1. **Wrong Root Directory**
   - **Problem**: Vercel is looking in the wrong directory
   - **Solution**: Set Root Directory to `web` in Vercel project settings

2. **Incorrect Output Directory**
   - **Problem**: Vercel can't find the built files
   - **Solution**: Set Output Directory to `build/client`

3. **Missing Build Command**
   - **Problem**: Vercel doesn't know how to build the project
   - **Solution**: Set Build Command to `npm run build`

4. **Framework Detection Issues**
   - **Problem**: Vercel detects the wrong framework
   - **Solution**: Manually set Framework Preset to `Vite`

### Debug Steps

1. **Check Build Logs**
   - Go to your Vercel project dashboard
   - Click on the latest deployment
   - Check the build logs for errors

2. **Verify File Structure**
   ```bash
   # Your build should create this structure:
   web/build/client/
   ├── index.html
   ├── assets/
   │   ├── manifest-*.js
   │   ├── entry.client-*.js
   │   └── ...
   └── .vite/
   ```

3. **Test Locally**
   ```bash
   cd web
   npm run build
   # Check that build/client/index.html exists
   ```

4. **Check Vercel Project Settings**
   - Go to Project Settings in Vercel dashboard
   - Verify all configuration is correct
   - Check that environment variables are set

## Step 5: Post-Deployment Verification

### Test These URLs

1. **Main Application**
   ```
   https://your-domain.vercel.app/
   ```

2. **Health Check**
   ```
   https://your-domain.vercel.app/health
   ```

3. **404 Handling**
   ```
   https://your-domain.vercel.app/non-existent-page
   ```

4. **Assets Loading**
   ```
   https://your-domain.vercel.app/assets/manifest-*.js
   ```

### Expected Behavior

- ✅ Main page loads without errors
- ✅ Client-side routing works
- ✅ Assets (CSS, JS) load correctly
- ✅ 404 pages are handled properly
- ✅ No console errors in browser

## Step 6: Environment Variables

### Required Variables
```env
DATABASE_URL=postgresql://username:password@host:port/database
AUTH_SECRET=your-super-secret-auth-key-here
AUTH_URL=https://your-vercel-domain.vercel.app
PROJECT_GROUP_ID=your_project_group_id
BASE_URL=https://your-vercel-domain.vercel.app
PROXY_BASE_URL=https://your-vercel-domain.vercel.app
HOST=your-vercel-domain.vercel.app
```

### How to Set in Vercel

1. Go to your Vercel project dashboard
2. Click "Settings" tab
3. Click "Environment Variables"
4. Add each variable with the correct value
5. Select "Production" environment
6. Click "Save"

## Step 7: Monitoring and Debugging

### Vercel Dashboard Features

1. **Function Logs**
   - Check for serverless function errors
   - Monitor API route performance

2. **Analytics**
   - Track page views and performance
   - Monitor error rates

3. **Real-time Monitoring**
   - Set up alerts for critical errors
   - Monitor response times

### Common Issues and Solutions

1. **Build Fails**
   ```bash
   # Check locally first
   cd web
   npm install
   npm run build
   ```

2. **Assets Not Loading**
   - Verify `vercel.json` routes configuration
   - Check that assets are in `build/client/assets/`

3. **Routing Issues**
   - Ensure client-side routing is configured
   - Check that all routes fall back to `index.html`

4. **Environment Variables**
   - Verify all variables are set in Vercel
   - Check for typos in variable names

## Success Checklist

- [ ] Repository is connected to Vercel
- [ ] Root directory is set to `web`
- [ ] Build command is `npm run build`
- [ ] Output directory is `build/client`
- [ ] Framework preset is `Vite`
- [ ] All environment variables are set
- [ ] Build completes successfully
- [ ] Application loads without errors
- [ ] Client-side routing works
- [ ] Assets load correctly

## Support

If you continue to experience issues:

1. **Check Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
2. **Vercel Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
3. **Vercel Support**: [vercel.com/support](https://vercel.com/support)

## Alternative Deployment Options

If Vercel continues to cause issues:

1. **Netlify**: Similar to Vercel, good for static sites
2. **Railway**: Good for full-stack applications
3. **AWS Amplify**: Good for AWS ecosystem
4. **Docker deployment**: More control over the environment

Your application should now deploy successfully to Vercel without the 404 NOT_FOUND error!