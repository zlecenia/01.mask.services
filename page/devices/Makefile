# Makefile for page/devices
COMPONENT_NAME := devices
COMPONENT_TYPE := page
VERSION := 0.1.0

# Port configuration
BACKEND_PORT := 8207
FRONTEND_PORT := 8227

.PHONY: help build test clean install docker-build docker-up docker-down

help: ## Show help
	@echo "Available targets for page/devices:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-15s %s\n", $$1, $$2}'

install: ## Install dependencies
	cd js/$(VERSION) && npm install

build: ## Build component
	@echo "Building devices..."
	cd js/$(VERSION) && npm run build

test: ## Run tests
	@echo "Testing devices..."
	cd js/$(VERSION) && npm test

clean: ## Clean build artifacts
	rm -rf js/$(VERSION)/node_modules
	rm -rf js/$(VERSION)/dist


docker-build: ## Build Docker images
	cd docker/$(VERSION) && docker-compose build

docker-up: ## Start Docker containers
	cd docker/$(VERSION) && docker-compose up -d

docker-down: ## Stop Docker containers
	cd docker/$(VERSION) && docker-compose down

dev: ## Start development server
	cd docker/$(VERSION) && docker-compose up

# Docker testing target
.PHONY: docker-test

# Stop all services (python, npm, docker)
.PHONY: stop
stop:
	@echo "[STOP] Stopping all services for $(notdir $(CURDIR))..."
	@-pkill -f "python.*$(notdir $(CURDIR))" 2>/dev/null || true
	@-pkill -f "npm.*$(notdir $(CURDIR))" 2>/dev/null || true
	@-pkill -f "node.*$(notdir $(CURDIR))" 2>/dev/null || true
	@if [ -d "docker/0.1.0" ]; then \
		echo "[STOP] Stopping Docker containers..."; \
		cd docker/0.1.0 && docker-compose down --remove-orphans 2>/dev/null || true; \
	fi
	@echo "[STOP] All services stopped for $(notdir $(CURDIR))"
# Test Docker containers with correct 82xx ports
.PHONY: docker-test
docker-test: docker-up
	@echo "[DOCKER-TEST] Testing Docker containers..."
	@echo "[INFO] Testing backend health check..."
	@curl -f http://localhost:8207/health || echo "[ERROR] Backend health check failed"
	@echo "[INFO] Testing frontend accessibility..."
	@curl -f http://localhost:8227/ || echo "[ERROR] Frontend accessibility failed"
	@echo "[DOCKER-TEST] Docker test completed"


# Health check for root-level health-check-all
.PHONY: test-health
test-health: ## Health check for devices (backend 8207, frontend 8227)
	@echo "[HEALTH] Checking devices backend (8207) and frontend (8227)..."
	@curl -s -f http://localhost:8207/health >/dev/null && echo "  ✓ Backend healthy" || echo "  ✗ Backend not healthy"
	@curl -s -f http://localhost:8227/ >/dev/null && echo "  ✓ Frontend reachable" || echo "  ✗ Frontend not reachable"

# E2E testing using scripts/*
.PHONY: e2e e2e-puppeteer
e2e: ## Run devices E2E (starts Docker, runs scripts/test_devices_page.py, then stops)
	@echo "[E2E] Starting devices containers..."
	@cd docker/$(VERSION) && docker-compose up -d
	@sleep 5
	@echo "[E2E] Running scripts/test_devices_page.py..."
	@python3 ../../scripts/test_devices_page.py || (echo "[E2E] devices E2E failed" && exit 1)
	@echo "[E2E] Stopping devices containers..."
	@cd docker/$(VERSION) && docker-compose down

e2e-puppeteer: ## Run Puppeteer E2E (headless browser)
	@echo "[E2E-PUPPETEER] Building and starting backend/frontend..."
	@cd docker/$(VERSION) && docker-compose up -d devices-backend devices-frontend
	@sleep 5
	@echo "[E2E-PUPPETEER] Running Puppeteer test container..."
	@cd docker/$(VERSION) && docker-compose run --rm maskservice-devices-puppeteer || (echo "[E2E-PUPPETEER] Failed" && exit 1)
	@echo "[E2E-PUPPETEER] Shutting down containers..."
	@cd docker/$(VERSION) && docker-compose down

