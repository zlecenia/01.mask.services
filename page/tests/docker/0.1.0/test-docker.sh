#!/bin/bash

# Simplified Docker test script for tests page
# This script builds and runs the tests page containers for testing

set -e

echo "🚀 Starting MaskService Tests Page Docker Setup"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi

# Set working directory to Docker folder
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

print_status "Working directory: $SCRIPT_DIR"

# Stop and remove existing containers
print_status "Cleaning up existing containers..."
docker-compose down --remove-orphans 2>/dev/null || true

# Build and start containers
print_status "Building and starting containers..."
docker-compose up --build -d

# Wait for services to be ready
print_status "Waiting for services to start..."
sleep 10

# Check if backend is healthy
print_status "Checking backend health..."
for i in {1..30}; do
    if curl -s http://localhost:8003/ >/dev/null 2>&1; then
        print_status "Backend is healthy!"
        break
    fi
    if [ $i -eq 30 ]; then
        print_error "Backend failed to start properly"
        docker-compose logs tests-backend
        exit 1
    fi
    sleep 2
done

# Check if frontend is accessible
print_status "Checking frontend accessibility..."
if curl -s http://localhost:8083/ >/dev/null 2>&1; then
    print_status "Frontend is accessible!"
else
    print_warning "Frontend may not be ready yet"
fi

echo ""
echo "=============================================="
print_status "Tests page is now running!"
echo ""
echo "Frontend: http://localhost:8083"
echo "Backend API: http://localhost:8003"
echo "API Docs: http://localhost:8003/docs"
echo ""
echo "To stop the containers:"
echo "  docker-compose down"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f"
echo "=============================================="
