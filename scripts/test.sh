#!/bin/bash

# MaskService Test Script
# Universal test script for pages and modules

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[TEST]${NC} $1"
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
    echo "MaskService Test Script"
    echo "Usage: $0 [OPTIONS] <component_path>"
    echo ""
    echo "Options:"
    echo "  -t, --type     Component type (page|module)"
    echo "  -n, --name     Component name"
    echo "  --frontend     Test only frontend"
    echo "  --backend      Test only backend"
    echo "  --docker       Test Docker containers"
    echo "  --integration  Run integration tests"
    echo "  --e2e          Run end-to-end tests"
    echo "  --health       Health check only"
    echo "  -v, --verbose  Verbose output"
    echo "  -h, --help     Show this help"
    echo ""
    echo "Examples:"
    echo "  $0 page/login"
    echo "  $0 --type page --name dashboard --docker"
    echo "  $0 module/auth --health"
}

# Default values
COMPONENT_PATH=""
COMPONENT_TYPE=""
COMPONENT_NAME=""
TEST_FRONTEND=true
TEST_BACKEND=true
TEST_DOCKER=false
TEST_INTEGRATION=false
TEST_E2E=false
HEALTH_CHECK_ONLY=false
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
            TEST_FRONTEND=true
            TEST_BACKEND=false
            shift
            ;;
        --backend)
            TEST_BACKEND=true
            TEST_FRONTEND=false
            shift
            ;;
        --docker)
            TEST_DOCKER=true
            shift
            ;;
        --integration)
            TEST_INTEGRATION=true
            shift
            ;;
        --e2e)
            TEST_E2E=true
            shift
            ;;
        --health)
            HEALTH_CHECK_ONLY=true
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

print_info "Testing component: $COMPONENT_TYPE/$COMPONENT_NAME"
print_info "Component directory: $COMPONENT_DIR"

# Check if component directory exists
if [[ ! -d "$COMPONENT_DIR" ]]; then
    print_error "Component directory does not exist: $COMPONENT_DIR"
    exit 1
fi

# Change to component directory
cd "$COMPONENT_DIR"

# Port mapping for different pages
declare -A PORT_MAP
PORT_MAP[login]="8001"
PORT_MAP[dashboard]="8002"
PORT_MAP[tests]="8003"
PORT_MAP[system]="8004"

# Get the port for this component
BACKEND_PORT=${PORT_MAP[$COMPONENT_NAME]:-8000}
FRONTEND_PORT=$((BACKEND_PORT + 80))  # 8081, 8082, etc.

print_info "Using ports: Backend=$BACKEND_PORT, Frontend=$FRONTEND_PORT"

# Health check function
perform_health_check() {
    local service_name=$1
    local port=$2
    local max_attempts=30
    local attempt=1
    
    print_info "Performing health check for $service_name on port $port..."
    
    while [[ $attempt -le $max_attempts ]]; do
        if curl -s -f "http://localhost:$port/" >/dev/null 2>&1; then
            print_status "$service_name is healthy on port $port"
            return 0
        fi
        
        if [[ $VERBOSE = true ]]; then
            print_info "Health check attempt $attempt/$max_attempts for $service_name..."
        fi
        
        sleep 2
        ((attempt++))
    done
    
    print_error "$service_name health check failed on port $port"
    return 1
}

# Test frontend
if [[ "$TEST_FRONTEND" = true && "$HEALTH_CHECK_ONLY" = false ]]; then
    print_status "Testing frontend..."
    
    if [[ -f "js/0.1.0/package.json" ]]; then
        cd js/0.1.0
        
        # Run frontend tests if they exist
        if grep -q '"test"' package.json 2>/dev/null; then
            print_info "Running frontend tests..."
            npm test
        else
            print_warning "No frontend tests configured"
        fi
        
        # Validate HTML and JavaScript files
        print_info "Validating frontend files..."
        
        if [[ -f "index.html" ]]; then
            print_info "✓ index.html exists"
        else
            print_error "✗ index.html missing"
        fi
        
        # Check for main JS and CSS files
        if find . -name "*.js" -not -path "./node_modules/*" | head -1 | grep -q .; then
            print_info "✓ JavaScript files found"
        else
            print_warning "⚠ No JavaScript files found"
        fi
        
        if find . -name "*.css" -not -path "./node_modules/*" | head -1 | grep -q .; then
            print_info "✓ CSS files found"
        else
            print_warning "⚠ No CSS files found"
        fi
        
        cd ../..
        print_status "Frontend testing completed"
    else
        print_warning "No frontend package.json found, skipping frontend tests"
    fi
fi

# Test backend
if [[ "$TEST_BACKEND" = true && "$HEALTH_CHECK_ONLY" = false ]]; then
    print_status "Testing backend..."
    
    if [[ -f "py/0.1.0/requirements.txt" ]]; then
        cd py/0.1.0
        
        # Activate virtual environment if it exists
        if [[ -d "venv" ]]; then
            source venv/bin/activate
        fi
        
        # Run backend tests if they exist
        if [[ -f "test_main.py" ]] || find . -name "test_*.py" | head -1 | grep -q .; then
            print_info "Running backend tests..."
            python -m pytest -v
        else
            print_warning "No backend tests found"
        fi
        
        # Validate Python files
        print_info "Validating backend files..."
        
        if [[ -f "main.py" ]]; then
            print_info "✓ main.py exists"
            # Check if main.py is valid Python
            if python -m py_compile main.py 2>/dev/null; then
                print_info "✓ main.py syntax valid"
            else
                print_error "✗ main.py syntax error"
            fi
        else
            print_error "✗ main.py missing"
        fi
        
        cd ../..
        print_status "Backend testing completed"
    else
        print_warning "No backend requirements.txt found, skipping backend tests"
    fi
fi

# Test Docker containers
if [[ "$TEST_DOCKER" = true ]]; then
    print_status "Testing Docker containers..."
    
    if [[ -f "docker/0.1.0/docker-compose.yml" ]]; then
        cd docker/0.1.0
        
        # Stop any existing containers
        docker-compose down --remove-orphans 2>/dev/null || true
        
        # Build and start containers
        print_info "Building and starting Docker containers..."
        docker-compose up --build -d
        
        # Wait for containers to be healthy
        sleep 10
        
        # Test backend health
        if perform_health_check "Backend" "$BACKEND_PORT"; then
            print_status "✓ Backend container is healthy"
        else
            print_error "✗ Backend container health check failed"
            docker-compose logs
            cd ../..
            exit 1
        fi
        
        # Test frontend health (if using nginx)
        if perform_health_check "Frontend" "$FRONTEND_PORT"; then
            print_status "✓ Frontend container is healthy"
        else
            print_warning "⚠ Frontend container health check failed"
        fi
        
        # Stop containers after testing
        print_info "Stopping test containers..."
        docker-compose down
        
        cd ../..
        print_status "Docker testing completed"
    else
        print_warning "No Docker configuration found, skipping Docker tests"
    fi
fi

# Health check only mode
if [[ "$HEALTH_CHECK_ONLY" = true ]]; then
    print_status "Performing health checks only..."
    
    # Check if services are running on expected ports
    if perform_health_check "Backend" "$BACKEND_PORT"; then
        print_status "✓ Backend service is healthy"
    else
        print_warning "⚠ Backend service not responding"
    fi
    
    if perform_health_check "Frontend" "$FRONTEND_PORT"; then
        print_status "✓ Frontend service is healthy"
    else
        print_warning "⚠ Frontend service not responding"
    fi
fi

# Integration tests
if [[ "$TEST_INTEGRATION" = true ]]; then
    print_status "Running integration tests..."
    
    # Run integration test script if it exists
    if [[ -f "tests/integration.py" ]]; then
        python tests/integration.py
    else
        print_warning "No integration tests found"
    fi
fi

# End-to-end tests
if [[ "$TEST_E2E" = true ]]; then
    print_status "Running end-to-end tests..."
    
    # Run e2e test script if it exists  
    if [[ -f "tests/e2e.py" ]]; then
        python tests/e2e.py
    else
        print_warning "No e2e tests found"
    fi
fi

print_status "Testing completed for $COMPONENT_TYPE/$COMPONENT_NAME"
