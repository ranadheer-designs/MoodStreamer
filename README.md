# Full-Stack Application

This is a full-stack application with both web and mobile components, built with React Router for the web and Expo for mobile.

## Project Structure

```
├── web/                 # React Router web application
├── mobile/             # Expo React Native application
├── docker-compose.yml  # Docker deployment configuration
└── README.md          # This file
```

## Features

- **Web Application**: Built with React Router, TypeScript, and Tailwind CSS
- **Mobile Application**: Built with Expo and React Native
- **Authentication**: Integrated with Auth.js
- **Database**: PostgreSQL with Neon Database
- **Payments**: Stripe integration
- **Cloud Ready**: Docker configuration for easy deployment

## Prerequisites

- Node.js 18 or higher
- Docker and Docker Compose (for deployment)
- PostgreSQL database (Neon Database recommended)
- Stripe account (for payments)

## Local Development

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd <your-repo-name>
```

### 2. Install dependencies

```bash
# Install web dependencies
cd web
npm install

# Install mobile dependencies
cd ../mobile
npm install
```

### 3. Environment Configuration

Create environment files for both applications:

#### Web Application (.env)
```bash
cd web
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
# Database
DATABASE_URL=your_neon_database_url_here

# Authentication
AUTH_SECRET=your_auth_secret_here
AUTH_URL=http://localhost:3000

# Project Configuration
PROJECT_GROUP_ID=your_project_group_id
BASE_URL=http://localhost:3000
PROXY_BASE_URL=http://localhost:3000
HOST=localhost:3000

# Stripe (if using payments)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

#### Mobile Application (.env)
```bash
cd mobile
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
EXPO_PUBLIC_BASE_URL=http://localhost:3000
EXPO_PUBLIC_PROXY_BASE_URL=http://localhost:3000
EXPO_PUBLIC_PROJECT_GROUP_ID=your_project_group_id
EXPO_PUBLIC_HOST=localhost:3000
```

### 4. Start development servers

#### Web Application
```bash
cd web
npm run dev
```

The web application will be available at `http://localhost:3000`

#### Mobile Application
```bash
cd mobile
npm start
```

This will start the Expo development server. You can:
- Press `w` to open in web browser
- Press `a` to open Android emulator
- Press `i` to open iOS simulator
- Scan QR code with Expo Go app on your phone

## Production Deployment

### Option 1: Docker Deployment (Recommended)

1. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=your_production_database_url
   AUTH_SECRET=your_production_auth_secret
   AUTH_URL=https://your-domain.com
   PROJECT_GROUP_ID=your_project_group_id
   BASE_URL=https://your-domain.com
   PROXY_BASE_URL=https://your-domain.com
   HOST=your-domain.com
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   EXPO_PUBLIC_BASE_URL=https://your-domain.com
   EXPO_PUBLIC_PROXY_BASE_URL=https://your-domain.com
   EXPO_PUBLIC_PROJECT_GROUP_ID=your_project_group_id
   EXPO_PUBLIC_HOST=your-domain.com
   ```

2. **Build and deploy with Docker Compose**
   ```bash
   docker-compose up -d --build
   ```

   This will:
   - Build both web and mobile applications
   - Start the web application on port 3000
   - Start the mobile web application on port 8080
   - Set up proper networking between services

### Option 2: Manual Deployment

#### Web Application
```bash
cd web
npm run build
npm start
```

#### Mobile Application
```bash
cd mobile
npm run web:build
npm run web:start
```

### Option 3: Cloud Platform Deployment

#### Vercel (Web Application)
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

#### Railway (Full Stack)
1. Connect your repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy both web and mobile applications

#### AWS/GCP/Azure
Use the provided Dockerfiles to deploy to your preferred cloud platform:

```bash
# Build web application
cd web
docker build -t your-app-web .

# Build mobile application
cd ../mobile
docker build -t your-app-mobile .

# Run with your preferred orchestration tool
```

## Database Setup

1. **Create a PostgreSQL database** (Neon Database recommended)
2. **Set up your schema** (if you have database migrations)
3. **Update the DATABASE_URL** in your environment variables

## Authentication Setup

1. **Configure Auth.js** with your preferred providers
2. **Set AUTH_SECRET** to a secure random string
3. **Update AUTH_URL** to your production domain

## Stripe Integration

1. **Create a Stripe account**
2. **Get your API keys** from the Stripe dashboard
3. **Set STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY** in environment variables

## Health Checks

The application includes health check endpoints:
- Web: `http://localhost:3000/health`
- Mobile: `http://localhost:8080/health`

## Monitoring and Logs

### Docker Compose
```bash
# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f web
docker-compose logs -f mobile-web
```

### Manual Deployment
```bash
# Web application logs
cd web && npm start 2>&1 | tee web.logs

# Mobile application logs
cd mobile && npm run web:start 2>&1 | tee mobile.logs
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Find process using port
   lsof -i :3000
   # Kill process
   kill -9 <PID>
   ```

2. **Database connection issues**
   - Verify DATABASE_URL is correct
   - Check database is accessible from your deployment environment
   - Ensure database schema is properly set up

3. **Authentication issues**
   - Verify AUTH_SECRET is set
   - Check AUTH_URL matches your domain
   - Ensure OAuth providers are properly configured

4. **Build failures**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

### Performance Optimization

1. **Enable caching** for static assets
2. **Use CDN** for global distribution
3. **Optimize images** and assets
4. **Enable compression** in your web server

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.