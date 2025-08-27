#!/bin/bash

# Deployment script for the full-stack application
set -e

echo "🚀 Starting deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create a .env file with your configuration."
    echo "You can copy from .env.example and update the values."
    exit 1
fi

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $port is already in use. Stopping existing process..."
        lsof -ti:$port | xargs kill -9
        sleep 2
    fi
}

# Check and free up ports if needed
check_port 3000
check_port 8080

# Build and start the applications
echo "🔨 Building and starting applications..."

# Build the images
docker-compose build

# Start the services
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
echo "🔍 Checking service health..."

# Check web service
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Web application is healthy"
else
    echo "❌ Web application health check failed"
    docker-compose logs web
    exit 1
fi

# Check mobile service
if curl -f http://localhost:8080 > /dev/null 2>&1; then
    echo "✅ Mobile application is healthy"
else
    echo "❌ Mobile application health check failed"
    docker-compose logs mobile-web
    exit 1
fi

echo "🎉 Deployment completed successfully!"
echo ""
echo "📱 Applications are now running:"
echo "   Web Application: http://localhost:3000"
echo "   Mobile Web App:  http://localhost:8080"
echo ""
echo "📊 To view logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 To stop the applications:"
echo "   docker-compose down"
echo ""
echo "🔄 To restart:"
echo "   docker-compose restart"