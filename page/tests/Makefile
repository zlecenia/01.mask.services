# MaskService Tests Page Makefile
# Universal build system for MaskService pages

# Page configuration
PAGE_NAME := tests
PAGE_TYPE := page
VERSION := 0.1.0
PROJECT_ROOT := ../..

# Port configuration
BACKEND_PORT := 8003
FRONTEND_PORT := 8083

# Directories
JS_DIR := js/$(VERSION)
PY_DIR := py/$(VERSION)
DOCKER_DIR := docker/$(VERSION)
SCRIPTS_DIR := $(PROJECT_ROOT)/scripts

# Docker configuration
DOCKER_COMPOSE := $(DOCKER_DIR)/docker-compose.yml
BACKEND_IMAGE := maskservice-$(PAGE_NAME)-backend
FRONTEND_IMAGE := maskservice-$(PAGE_NAME)-frontend

# Colors for output
GREEN := \033[0;32m
RED := \033[0;31m
YELLOW := \033[1;33m
BLUE := \033[0;34m
NC := \033[0m

# Default target
.PHONY: help
help: ## Show this help message
	@echo "$(GREEN)MaskService $(PAGE_NAME) Page - Available Commands:$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(BLUE)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(YELLOW)Examples:$(NC)"
	@echo "  make build           # Build all components"
	@echo "  make test            # Run all tests"
	@echo "  make docker-up       # Start Docker containers"
	@echo "  make clean           # Clean all artifacts"

.PHONY: install
install: install-frontend install-backend ## Install all dependencies

.PHONY: install-frontend
install-frontend: ## Install frontend dependencies
	@echo "$(GREEN)[INSTALL]$(NC) Installing frontend dependencies..."
	@cd $(JS_DIR) && npm install
	@echo "$(GREEN)[INSTALL]$(NC) Frontend dependencies installed"

.PHONY: install-backend
install-backend: ## Install backend dependencies
	@echo "$(GREEN)[INSTALL]$(NC) Installing backend dependencies..."
	@cd $(PY_DIR) && python3 -m venv venv && bash -c "source venv/bin/activate && pip install -r requirements.txt"
	@echo "$(GREEN)[INSTALL]$(NC) Backend dependencies installed"

.PHONY: build
build: build-frontend build-backend ## Build all components

.PHONY: build-frontend
build-frontend: install-frontend ## Build frontend
	@echo "$(GREEN)[BUILD]$(NC) Building frontend..."
	@cd $(JS_DIR) && npm run build 2>/dev/null || echo "No build script found, using files as-is"
	@echo "$(GREEN)[BUILD]$(NC) Frontend build completed"

.PHONY: build-backend
build-backend: install-backend ## Build backend
	@echo "$(GREEN)[BUILD]$(NC) Building backend..."
	@cd $(PY_DIR) && bash -c "source venv/bin/activate && python -m py_compile main.py"
	@echo "$(GREEN)[BUILD]$(NC) Backend build completed"

.PHONY: dev
dev: ## Start development servers
	@echo "$(GREEN)[DEV]$(NC) Starting development servers..."
	@cd $(JS_DIR) && npm run dev &
	@echo "$(GREEN)[DEV]$(NC) Development servers started"
	@echo "$(BLUE)[INFO]$(NC) Frontend: http://localhost:$(FRONTEND_PORT)"
	@echo "$(BLUE)[INFO]$(NC) Backend: http://localhost:$(BACKEND_PORT)"

.PHONY: dev-frontend
dev-frontend: ## Start frontend development server
	@echo "$(GREEN)[DEV]$(NC) Starting frontend development server..."
	@cd $(JS_DIR) && python3 -m http.server $(FRONTEND_PORT)

.PHONY: dev-backend
dev-backend: ## Start backend development server
	@echo "$(GREEN)[DEV]$(NC) Starting backend development server..."
	@cd $(PY_DIR) && bash -c "source venv/bin/activate && python main.py"

.PHONY: test
test: test-frontend test-backend test-integration ## Run all tests

.PHONY: test-frontend
test-frontend: ## Test frontend
	@echo "$(GREEN)[TEST]$(NC) Testing frontend..."
	@$(SCRIPTS_DIR)/test.sh --type $(PAGE_TYPE) --name $(PAGE_NAME) --frontend

.PHONY: test-backend
test-backend: ## Test backend
	@echo "$(GREEN)[TEST]$(NC) Testing backend..."
	@$(SCRIPTS_DIR)/test.sh --type $(PAGE_TYPE) --name $(PAGE_NAME) --backend

.PHONY: test-integration
test-integration: ## Run integration tests
	@echo "$(GREEN)[TEST]$(NC) Running integration tests..."
	@$(SCRIPTS_DIR)/test.sh --type $(PAGE_TYPE) --name $(PAGE_NAME) --integration

.PHONY: test-health
test-health: ## Check service health
	@echo "$(GREEN)[TEST]$(NC) Checking service health..."
	@$(SCRIPTS_DIR)/test.sh --type $(PAGE_TYPE) --name $(PAGE_NAME) --health

.PHONY: docker-build
docker-build: ## Build Docker images
	@echo "$(GREEN)[DOCKER]$(NC) Building Docker images..."
	@cd $(DOCKER_DIR) && docker-compose build
	@echo "$(GREEN)[DOCKER]$(NC) Docker images built"

.PHONY: docker-up
docker-up: docker-build ## Start Docker containers
	@echo "$(GREEN)[DOCKER]$(NC) Starting Docker containers..."
	@cd $(DOCKER_DIR) && docker-compose up -d
	@echo "$(GREEN)[DOCKER]$(NC) Docker containers started"
	@echo "$(BLUE)[INFO]$(NC) Frontend: http://localhost:$(FRONTEND_PORT)"
	@echo "$(BLUE)[INFO]$(NC) Backend: http://localhost:$(BACKEND_PORT)"
	@echo "$(BLUE)[INFO]$(NC) API Docs: http://localhost:$(BACKEND_PORT)/docs"

.PHONY: docker-down
docker-down: ## Stop Docker containers
	@echo "$(YELLOW)[DOCKER]$(NC) Stopping Docker containers..."
	@cd $(DOCKER_DIR) && docker-compose down
	@echo "$(YELLOW)[DOCKER]$(NC) Docker containers stopped"

.PHONY: docker-logs
docker-logs: ## Show Docker container logs
	@cd $(DOCKER_DIR) && docker-compose logs -f

.PHONY: docker-test
docker-test: ## Test Docker containers
	@echo "$(GREEN)[DOCKER]$(NC) Testing Docker containers..."
	@cd $(DOCKER_DIR) && chmod +x test-docker.sh && ./test-docker.sh

.PHONY: docker-clean
docker-clean: ## Clean Docker containers and images
	@echo "$(YELLOW)[DOCKER]$(NC) Cleaning Docker containers and images..."
	@cd $(DOCKER_DIR) && docker-compose down --volumes --remove-orphans
	@docker rmi $(BACKEND_IMAGE) $(FRONTEND_IMAGE) 2>/dev/null || true
	@echo "$(YELLOW)[DOCKER]$(NC) Docker cleanup completed"

.PHONY: lint
lint: lint-frontend lint-backend ## Run linters

.PHONY: lint-frontend
lint-frontend: ## Lint frontend code
	@echo "$(GREEN)[LINT]$(NC) Linting frontend..."
	@cd $(JS_DIR) && npm run lint 2>/dev/null || echo "No linting configured"

.PHONY: lint-backend
lint-backend: ## Lint backend code
	@echo "$(GREEN)[LINT]$(NC) Linting backend..."
	@cd $(PY_DIR) && bash -c "source venv/bin/activate && flake8 . 2>/dev/null || echo 'flake8 not installed'"

.PHONY: format
format: format-frontend format-backend ## Format code

.PHONY: format-frontend
format-frontend: ## Format frontend code
	@echo "$(GREEN)[FORMAT]$(NC) Formatting frontend..."
	@cd $(JS_DIR) && npm run format 2>/dev/null || echo "No formatting configured"

.PHONY: format-backend
format-backend: ## Format backend code
	@echo "$(GREEN)[FORMAT]$(NC) Formatting backend..."
	@cd $(PY_DIR) && bash -c "source venv/bin/activate && black . 2>/dev/null || echo 'black not installed'"

.PHONY: clean
clean: clean-frontend clean-backend docker-clean ## Clean all build artifacts

.PHONY: clean-frontend
clean-frontend: ## Clean frontend artifacts
	@echo "$(YELLOW)[CLEAN]$(NC) Cleaning frontend..."
	@cd $(JS_DIR) && rm -rf node_modules dist build .cache
	@echo "$(YELLOW)[CLEAN]$(NC) Frontend cleaned"

.PHONY: clean-backend
clean-backend: ## Clean backend artifacts
	@echo "$(YELLOW)[CLEAN]$(NC) Cleaning backend..."
	@cd $(PY_DIR) && rm -rf venv __pycache__ *.pyc .pytest_cache
	@echo "$(YELLOW)[CLEAN]$(NC) Backend cleaned"

.PHONY: status
status: ## Show component status
	@echo "$(BLUE)[INFO]$(NC) MaskService $(PAGE_NAME) Page Status:"
	@echo "  Page Type: $(PAGE_TYPE)"
	@echo "  Version: $(VERSION)"
	@echo "  Backend Port: $(BACKEND_PORT)"
	@echo "  Frontend Port: $(FRONTEND_PORT)"
	@echo ""
	@echo "$(BLUE)[INFO]$(NC) File Structure:"
	@ls -la $(JS_DIR)/ 2>/dev/null | head -5 || echo "  Frontend directory not found"
	@ls -la $(PY_DIR)/ 2>/dev/null | head -5 || echo "  Backend directory not found"
	@ls -la $(DOCKER_DIR)/ 2>/dev/null | head -5 || echo "  Docker directory not found"

.PHONY: validate
validate: ## Validate component configuration
	@echo "$(GREEN)[VALIDATE]$(NC) Validating component..."
	@python3 $(SCRIPTS_DIR)/test_runner.py $(PAGE_TYPE)/$(PAGE_NAME) --type files --type syntax

# Auto-completion for make targets
.PHONY: _completion
_completion:
	@echo "build build-frontend build-backend clean clean-frontend clean-backend dev dev-frontend dev-backend docker-build docker-clean docker-down docker-logs docker-test docker-up format format-frontend format-backend help install install-frontend install-backend lint lint-frontend lint-backend status test test-backend test-frontend test-health test-integration validate"
