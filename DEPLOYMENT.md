# Deployment Guide

This guide will help you deploy your full-stack application to various cloud platforms.

## Prerequisites

- Node.js 18 or higher
- Docker and Docker Compose (for containerized deployment)
- Git repository with your code
- Cloud platform account (AWS, GCP, Azure, Vercel, Railway, etc.)

## Quick Deployment Options

### Option 1: Docker Deployment (Recommended)

1. **Clone your repository**
   ```bash
   git clone <your-repo-url>
   cd <your-repo-name>
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your production values
   ```

3. **Deploy with Docker Compose**
   ```bash
   ./deploy.sh
   ```

### Option 2: Vercel (Web Application)

1. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Connect your GitHub repository
   - Set environment variables in Vercel dashboard

2. **Deploy**
   - Vercel will automatically deploy on push to main branch
   - Web application will be available at your Vercel URL

### Option 3: Railway (Full Stack)

1. **Connect to Railway**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Set environment variables in Railway dashboard

2. **Deploy**
   - Railway will automatically deploy both web and mobile applications
   - Both applications will be available at Railway URLs

### Option 4: AWS/GCP/Azure

1. **Build Docker images**
   ```bash
   # Build web application
   cd web
   docker build -t your-app-web .
   
   # Build mobile application
   cd ../mobile
   docker build -t your-app-mobile .
   ```

2. **Deploy to your preferred platform**
   - Use AWS ECS, GCP Cloud Run, or Azure Container Instances
   - Set environment variables in your platform's dashboard

## Environment Variables

### Required Variables

```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Authentication
AUTH_SECRET=your-super-secret-auth-key-here
AUTH_URL=https://your-domain.com

# Project Configuration
PROJECT_GROUP_ID=your-project-group-id
BASE_URL=https://your-domain.com
PROXY_BASE_URL=https://your-domain.com
HOST=your-domain.com

# Mobile Configuration
EXPO_PUBLIC_BASE_URL=https://your-domain.com
EXPO_PUBLIC_PROXY_BASE_URL=https://your-domain.com
EXPO_PUBLIC_PROJECT_GROUP_ID=your-project-group-id
EXPO_PUBLIC_HOST=your-domain.com
```

### Optional Variables

```env
# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

## Database Setup

### Option 1: Neon Database (Recommended)

1. **Create account**
   - Go to [neon.tech](https://neon.tech)
   - Create a free account

2. **Create database**
   - Create a new project
   - Copy the connection string
   - Set as `DATABASE_URL` in environment variables

### Option 2: Supabase

1. **Create account**
   - Go to [supabase.com](https://supabase.com)
   - Create a free account

2. **Create database**
   - Create a new project
   - Copy the connection string
   - Set as `DATABASE_URL` in environment variables

### Option 3: AWS RDS / GCP Cloud SQL

1. **Create database instance**
   - Follow your cloud provider's documentation
   - Create a PostgreSQL instance

2. **Configure connection**
   - Get the connection string
   - Set as `DATABASE_URL` in environment variables

## Authentication Setup

### Option 1: Auth.js (Recommended)

1. **Install Auth.js**
   ```bash
   cd web
   npm install @auth/core @auth/react
   ```

2. **Configure providers**
   - Set up OAuth providers (Google, GitHub, etc.)
   - Configure in your Auth.js configuration

### Option 2: Custom Authentication

1. **Implement your own auth system**
   - Use JWT tokens
   - Implement login/logout functionality
   - Secure your API endpoints

## Monitoring and Logs

### Docker Compose
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f web
docker-compose logs -f mobile-web
```

### Cloud Platforms
- Use your platform's built-in logging and monitoring
- Set up alerts for errors and performance issues
- Monitor database connections and API usage

## Health Checks

The application includes health check endpoints:
- Web: `https://your-domain.com/health`
- Mobile: `https://your-mobile-domain.com/health`

## SSL/HTTPS Setup

### Automatic (Recommended)
- Most cloud platforms provide automatic SSL certificates
- Vercel, Railway, and others handle this automatically

### Manual Setup
- Use Let's Encrypt for free SSL certificates
- Configure your web server (nginx, Apache) to handle SSL

## Performance Optimization

1. **Enable caching**
   - Set up CDN for static assets
   - Configure browser caching headers

2. **Database optimization**
   - Add indexes to frequently queried columns
   - Use connection pooling

3. **Image optimization**
   - Compress images
   - Use modern formats (WebP, AVIF)

## Troubleshooting

### Common Issues

1. **Build failures**
   ```bash
   # Clear cache and rebuild
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Database connection issues**
   - Verify DATABASE_URL is correct
   - Check database is accessible from deployment environment
   - Ensure database schema is properly set up

3. **Authentication issues**
   - Verify AUTH_SECRET is set
   - Check AUTH_URL matches your domain
   - Ensure OAuth providers are properly configured

4. **Port conflicts**
   ```bash
   # Check what's using the port
   lsof -i :3000
   # Kill the process
   kill -9 <PID>
   ```

### Getting Help

- Check the application logs for error messages
- Verify all environment variables are set correctly
- Test locally before deploying to production
- Use the health check endpoints to verify application status

## Security Checklist

- [ ] Environment variables are set and secure
- [ ] Database connection uses SSL
- [ ] Authentication is properly configured
- [ ] API endpoints are protected
- [ ] HTTPS is enabled
- [ ] Regular security updates are applied
- [ ] Backups are configured
- [ ] Monitoring and alerting are set up

## Cost Optimization

### Free Tiers
- Vercel: Free tier for web applications
- Railway: Free tier for small applications
- Neon Database: Free tier for development
- Supabase: Free tier for small projects

### Paid Options
- Scale up as your application grows
- Monitor usage to optimize costs
- Use reserved instances for predictable workloads

## Next Steps

1. **Set up CI/CD**
   - Configure automatic deployments
   - Add testing to your pipeline

2. **Add monitoring**
   - Set up application performance monitoring
   - Configure error tracking

3. **Implement backups**
   - Set up database backups
   - Configure disaster recovery

4. **Scale your application**
   - Add load balancing
   - Implement caching strategies
   - Optimize database queries