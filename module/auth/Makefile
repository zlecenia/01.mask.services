# Makefile for module/auth
COMPONENT_NAME := auth
COMPONENT_TYPE := module
VERSION := 0.1.0

.PHONY: help build test clean install

help: ## Show help
	@echo "Available targets for module/auth:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-15s %s\n", $$1, $$2}'

install: ## Install dependencies
	cd js/$(VERSION) && npm install

build: ## Build component
	@echo "Building auth module..."

test: ## Run tests
	@echo "Testing auth module..."
	cd js/$(VERSION) && npm test

clean: ## Clean build artifacts
	rm -rf js/$(VERSION)/node_modules

# Docker testing target
docker-test: docker-up
	@echo "[DOCKER-TEST] Testing Docker containers..."
	@sleep 5  # Wait for containers to be ready
	@echo "[INFO] Testing backend health check..."
	@curl -f http://localhost:$(BACKEND_PORT)/health || echo "[ERROR] Backend health check failed"
	@echo "[INFO] Testing frontend accessibility..."
	@curl -f http://localhost:$(FRONTEND_PORT)/ || echo "[ERROR] Frontend accessibility failed"
	@echo "[DOCKER-TEST] Docker test completed"

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

