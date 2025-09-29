#!/bin/bash

# MaskService Build Script
# Universal build script for pages and modules

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[BUILD]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Help function
show_help() {
    echo "MaskService Build Script"
    echo "Usage: $0 [OPTIONS] <component_path>"
    echo ""
    echo "Options:"
    echo "  -t, --type     Component type (page|module)"
    echo "  -n, --name     Component name"
    echo "  --frontend     Build only frontend"
    echo "  --backend      Build only backend"
    echo "  --docker       Build Docker containers"
    echo "  --clean        Clean build artifacts"
    echo "  -v, --verbose  Verbose output"
    echo "  -h, --help     Show this help"
    echo ""
    echo "Examples:"
    echo "  $0 page/login"
    echo "  $0 --type page --name dashboard --docker"
    echo "  $0 module/auth --frontend"
}

# Default values
COMPONENT_PATH=""
COMPONENT_TYPE=""
COMPONENT_NAME=""
BUILD_FRONTEND=true
BUILD_BACKEND=true
BUILD_DOCKER=false
CLEAN_BUILD=false
VERBOSE=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -t|--type)
            COMPONENT_TYPE="$2"
            shift 2
            ;;
        -n|--name)
            COMPONENT_NAME="$2"
            shift 2
            ;;
        --frontend)
            BUILD_FRONTEND=true
            BUILD_BACKEND=false
            shift
            ;;
        --backend)
            BUILD_BACKEND=true
            BUILD_FRONTEND=false
            shift
            ;;
        --docker)
            BUILD_DOCKER=true
            shift
            ;;
        --clean)
            CLEAN_BUILD=true
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        -*)
            print_error "Unknown option $1"
            show_help
            exit 1
            ;;
        *)
            COMPONENT_PATH="$1"
            shift
            ;;
    esac
done

# Determine component type and name from path if not provided
if [[ -n "$COMPONENT_PATH" ]]; then
    if [[ -z "$COMPONENT_TYPE" ]]; then
        COMPONENT_TYPE=$(echo "$COMPONENT_PATH" | cut -d'/' -f1)
    fi
    if [[ -z "$COMPONENT_NAME" ]]; then
        COMPONENT_NAME=$(echo "$COMPONENT_PATH" | cut -d'/' -f2)
    fi
fi

# Validate input
if [[ -z "$COMPONENT_TYPE" || -z "$COMPONENT_NAME" ]]; then
    print_error "Component type and name are required"
    show_help
    exit 1
fi

# Set working directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
COMPONENT_DIR="$PROJECT_ROOT/$COMPONENT_TYPE/$COMPONENT_NAME"

print_info "Building component: $COMPONENT_TYPE/$COMPONENT_NAME"
print_info "Component directory: $COMPONENT_DIR"

# Check if component directory exists
if [[ ! -d "$COMPONENT_DIR" ]]; then
    print_error "Component directory does not exist: $COMPONENT_DIR"
    exit 1
fi

# Change to component directory
cd "$COMPONENT_DIR"

# Clean build artifacts if requested
if [[ "$CLEAN_BUILD" = true ]]; then
    print_status "Cleaning build artifacts..."
    
    # Clean Docker containers and images
    if [[ -f "docker/0.1.0/docker-compose.yml" ]]; then
        cd docker/0.1.0
        docker-compose down --remove-orphans --volumes 2>/dev/null || true
        cd ../..
    fi
    
    # Clean node_modules and Python cache
    find . -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true
    find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
    find . -name "*.pyc" -type f -delete 2>/dev/null || true
    
    print_status "Clean completed"
fi

# Build frontend if requested
if [[ "$BUILD_FRONTEND" = true ]]; then
    print_status "Building frontend..."
    
    if [[ -f "js/0.1.0/package.json" ]]; then
        cd js/0.1.0
        
        # Install dependencies if package.json exists
        if [[ -f "package.json" ]]; then
            print_info "Installing Node.js dependencies..."
            npm install
        fi
        
        cd ../..
        print_status "Frontend build completed"
    else
        print_warning "No frontend package.json found, skipping frontend build"
    fi
fi

# Build backend if requested
if [[ "$BUILD_BACKEND" = true ]]; then
    print_status "Building backend..."
    
    if [[ -f "py/0.1.0/requirements.txt" ]]; then
        cd py/0.1.0
        
        # Create virtual environment if it doesn't exist
        if [[ ! -d "venv" ]]; then
            print_info "Creating Python virtual environment..."
            python3 -m venv venv
        fi
        
        # Activate virtual environment and install dependencies
        source venv/bin/activate
        print_info "Installing Python dependencies..."
        pip install -r requirements.txt
        
        cd ../..
        print_status "Backend build completed"
    else
        print_warning "No backend requirements.txt found, skipping backend build"
    fi
fi

# Build Docker containers if requested
if [[ "$BUILD_DOCKER" = true ]]; then
    print_status "Building Docker containers..."
    
    if [[ -f "docker/0.1.0/docker-compose.yml" ]]; then
        cd docker/0.1.0
        
        # Make test script executable
        if [[ -f "test-docker.sh" ]]; then
            chmod +x test-docker.sh
        fi
        
        # Build Docker images
        print_info "Building Docker images..."
        docker-compose build
        
        cd ../..
        print_status "Docker build completed"
    else
        print_warning "No Docker configuration found, skipping Docker build"
    fi
fi

print_status "Build process completed successfully for $COMPONENT_TYPE/$COMPONENT_NAME"
