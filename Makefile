# MaskService Project Root Makefile
# Universal build system for all MaskService pages and modules

# Project configuration
PROJECT_NAME := MaskService
VERSION := 0.1.0
PROJECT_ROOT := .

# Available pages and modules
PAGES := login dashboard tests system devices reports service settings workshop
MODULES := auth footer header menu
SCRIPTS_DIR := $(PROJECT_ROOT)/scripts

# Port range configuration
BASE_BACKEND_PORT := 8001
BASE_FRONTEND_PORT := 8081

# Colors for output
GREEN := \033[0;32m
RED := \033[0;31m
YELLOW := \033[1;33m
BLUE := \033[0;34m
CYAN := \033[0;36m
BOLD := \033[1m
NC := \033[0m

# Default target
.PHONY: help
help: ## Show this comprehensive help message
	@echo "$(BOLD)$(CYAN)MaskService Project - Universal Build System$(NC)"
	@echo "$(CYAN)================================================$(NC)"
	@echo ""
	@echo "$(GREEN)Project Overview:$(NC)"
	@echo "  Project: $(PROJECT_NAME)"
	@echo "  Version: $(VERSION)"
	@echo "  Pages: $(PAGES)"
	@echo "  Modules: $(MODULES)"
	@echo ""
	@echo "$(GREEN)Available Commands:$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(BLUE)%-25s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(YELLOW)Project-Wide Examples:$(NC)"
	@echo "  make build-all           # Build all pages and modules"
	@echo "  make test-all            # Test all components"
	@echo "  make docker-up-all       # Start all Docker containers"
	@echo "  make clean-all           # Clean all build artifacts"
	@echo ""
	@echo "$(YELLOW)Individual Component Examples:$(NC)"
	@echo "  make page-login-build    # Build only login page"
	@echo "  make page-login-test     # Test only login page"
	@echo "  make page-login-docker   # Docker operations for login"
	@echo ""
	@echo "$(YELLOW)Quick Development:$(NC)"
	@echo "  make dev-login           # Start login page in development mode"
	@echo "  make status              # Show project status"
	@echo "  make validate-all        # Validate all components"

# Project-wide operations
.PHONY: install-all
install-all: $(addprefix install-page-,$(PAGES)) ## Install dependencies for all components
	@echo "$(GREEN)[INSTALL-ALL]$(NC) All dependencies installed successfully"

.PHONY: build-all
build-all: $(addprefix build-page-,$(PAGES)) ## Build all pages and modules
	@echo "$(GREEN)[BUILD-ALL]$(NC) All components built successfully"

.PHONY: test-all
test-all: $(addprefix test-page-,$(PAGES)) ## Test all components
	@echo "$(GREEN)[TEST-ALL]$(NC) All tests completed"

.PHONY: test
test: test-all ## Alias for test-all

.PHONY: docker-build-all
docker-build-all: $(addprefix docker-build-page-,$(PAGES)) ## Build all Docker images
	@echo "$(GREEN)[DOCKER-BUILD-ALL]$(NC) All Docker images built"

.PHONY: docker-up-all
docker-up-all: ## Start all Docker containers (WARNING: Port conflicts possible)
	@echo "$(YELLOW)[WARNING]$(NC) Starting all containers may cause port conflicts"
	@echo "$(BLUE)[INFO]$(NC) Consider running containers individually or with port offsets"
	@for page in $(PAGES); do \
		echo "$(GREEN)[DOCKER-UP]$(NC) Starting $$page..."; \
		$(MAKE) docker-up-page-$$page || echo "$(RED)[ERROR]$(NC) Failed to start $$page"; \
	done

.PHONY: docker-down-all
docker-down-all: $(addprefix docker-down-page-,$(PAGES)) ## Stop all Docker containers
	@echo "$(YELLOW)[DOCKER-DOWN-ALL]$(NC) All Docker containers stopped"

.PHONY: clean-all
clean-all: $(addprefix clean-page-,$(PAGES)) clean-project ## Clean all build artifacts
	@echo "$(YELLOW)[CLEAN-ALL]$(NC) All artifacts cleaned"

.PHONY: clean-project
clean-project: ## Clean project-level artifacts
	@echo "$(YELLOW)[CLEAN-PROJECT]$(NC) Cleaning project artifacts..."
	@find . -name "*.pyc" -delete
	@find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
	@find . -name ".pytest_cache" -type d -exec rm -rf {} + 2>/dev/null || true
	@find . -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true

# Individual page operations - Dynamic targets
.PHONY: $(addprefix install-page-,$(PAGES))
$(addprefix install-page-,$(PAGES)): install-page-%:
	@echo "$(GREEN)[INSTALL]$(NC) Installing dependencies for page: $*"
	@cd page/$* && $(MAKE) install

.PHONY: $(addprefix build-page-,$(PAGES))
$(addprefix build-page-,$(PAGES)): build-page-%:
	@echo "$(GREEN)[BUILD]$(NC) Building page: $*"
	@cd page/$* && $(MAKE) build

.PHONY: $(addprefix test-page-,$(PAGES))
$(addprefix test-page-,$(PAGES)): test-page-%:
	@echo "$(GREEN)[TEST]$(NC) Testing page: $*"
	@cd page/$* && $(MAKE) test

.PHONY: $(addprefix docker-build-page-,$(PAGES))
$(addprefix docker-build-page-,$(PAGES)): docker-build-page-%:
	@echo "$(GREEN)[DOCKER-BUILD]$(NC) Building Docker images for page: $*"
	@cd page/$* && $(MAKE) docker-build

.PHONY: $(addprefix docker-up-page-,$(PAGES))
$(addprefix docker-up-page-,$(PAGES)): docker-up-page-%:
	@echo "$(GREEN)[DOCKER-UP]$(NC) Starting Docker containers for page: $*"
	@cd page/$* && $(MAKE) docker-up

.PHONY: $(addprefix docker-down-page-,$(PAGES))
$(addprefix docker-down-page-,$(PAGES)): docker-down-page-%:
	@echo "$(YELLOW)[DOCKER-DOWN]$(NC) Stopping Docker containers for page: $*"
	@cd page/$* && $(MAKE) docker-down

.PHONY: $(addprefix clean-page-,$(PAGES))
$(addprefix clean-page-,$(PAGES)): clean-page-%:
	@echo "$(YELLOW)[CLEAN]$(NC) Cleaning page: $*"
	@cd page/$* && $(MAKE) clean

# Development shortcuts
.PHONY: $(addprefix dev-,$(PAGES))
$(addprefix dev-,$(PAGES)): dev-%:
	@echo "$(GREEN)[DEV]$(NC) Starting development environment for: $*"
	@cd page/$* && $(MAKE) dev

# Status and validation
.PHONY: status
status: ## Show comprehensive project status
	@echo "$(BOLD)$(CYAN)MaskService Project Status$(NC)"
	@echo "$(CYAN)=============================$(NC)"
	@echo ""
	@echo "$(GREEN)Project Information:$(NC)"
	@echo "  Name: $(PROJECT_NAME)"
	@echo "  Version: $(VERSION)"
	@echo "  Root: $(shell pwd)"
	@echo ""
	@echo "$(GREEN)Available Pages:$(NC)"
	@for page in $(PAGES); do \
		if [ -d "page/$$page" ]; then \
			echo "  ✓ $$page"; \
		else \
			echo "  ✗ $$page (missing)"; \
		fi; \
	done
	@echo ""
	@echo "$(GREEN)Available Modules:$(NC)"
	@for module in $(MODULES); do \
		if [ -d "module/$$module" ]; then \
			echo "  ✓ $$module"; \
		else \
			echo "  ✗ $$module (not yet created)"; \
		fi; \
	done
	@echo ""
	@echo "$(GREEN)Scripts Status:$(NC)"
	@ls -la $(SCRIPTS_DIR)/ 2>/dev/null | grep -E '\.(sh|py)$$' | awk '{print "  " $$9 " (" $$1 ")"}'
	@echo ""
	@echo "$(GREEN)Port Allocation:$(NC)"
	@for i in $(shell seq 1 4); do \
		page=$$(echo "$(PAGES)" | cut -d' ' -f$$i); \
		if [ "$$page" != "" ]; then \
			backend_port=$$(($(BASE_BACKEND_PORT) + $$i - 1)); \
			frontend_port=$$(($(BASE_FRONTEND_PORT) + $$i - 1)); \
			echo "  $$page: Backend=$$backend_port, Frontend=$$frontend_port"; \
		fi; \
	done

.PHONY: validate-all
validate-all: ## Validate all components
	@echo "$(GREEN)[VALIDATE-ALL]$(NC) Validating all components..."
	@python3 $(SCRIPTS_DIR)/test_runner.py --type files --type syntax
	@echo "$(GREEN)[VALIDATE-ALL]$(NC) All validations completed"

.PHONY: validate-page
validate-page: ## Validate specific page (usage: make validate-page PAGE=login)
ifndef PAGE
	@echo "$(RED)[ERROR]$(NC) Please specify PAGE. Usage: make validate-page PAGE=login"
	@exit 1
endif
	@echo "$(GREEN)[VALIDATE]$(NC) Validating page: $(PAGE)"
	@cd page/$(PAGE) && $(MAKE) validate

# Testing utilities
.PHONY: test-docker-all
test-docker-all: ## Test all Docker containers individually
	@echo "$(GREEN)[TEST-DOCKER-ALL]$(NC) Testing all Docker containers..."
	@for page in $(PAGES); do \
		echo "$(BLUE)[INFO]$(NC) Testing Docker setup for $$page..."; \
		cd page/$$page && $(MAKE) docker-test || echo "$(RED)[ERROR]$(NC) Docker test failed for $$page"; \
		cd ../..; \
	done

.PHONY: health-check-all
health-check-all: ## Run health checks on all running services
	@echo "$(GREEN)[HEALTH-CHECK-ALL]$(NC) Running health checks..."
	@for page in $(PAGES); do \
		echo "$(BLUE)[INFO]$(NC) Health check for $$page..."; \
		cd page/$$page && $(MAKE) test-health || echo "$(YELLOW)[WARNING]$(NC) Health check failed for $$page"; \
		cd ../..; \
	done

# Maintenance operations
.PHONY: update-scripts
update-scripts: ## Make all scripts executable
	@echo "$(GREEN)[UPDATE-SCRIPTS]$(NC) Making all scripts executable..."
	@find $(SCRIPTS_DIR) -name "*.sh" -exec chmod +x {} \;
	@find . -path "*/docker/*/test-docker.sh" -exec chmod +x {} \;
	@echo "$(GREEN)[UPDATE-SCRIPTS]$(NC) All scripts are now executable"

.PHONY: docker-cleanup-all
docker-cleanup-all: ## Clean up all Docker resources
	@echo "$(YELLOW)[DOCKER-CLEANUP-ALL]$(NC) Cleaning up all Docker resources..."
	@docker system prune -f
	@docker volume prune -f
	@echo "$(YELLOW)[DOCKER-CLEANUP-ALL]$(NC) Docker cleanup completed"

# Information and debugging
.PHONY: list-pages
list-pages: ## List all available pages
	@echo "$(GREEN)Available Pages:$(NC)"
	@for page in $(PAGES); do echo "  - $$page"; done

.PHONY: list-modules
list-modules: ## List all available modules
	@echo "$(GREEN)Available Modules:$(NC)"
	@for module in $(MODULES); do echo "  - $$module"; done

.PHONY: show-ports
show-ports: ## Show port allocation for all services
	@echo "$(GREEN)Service Port Allocation:$(NC)"
	@echo "$(BLUE)Backend Ports:$(NC)"
	@for i in $(shell seq 1 4); do \
		page=$$(echo "$(PAGES)" | cut -d' ' -f$$i); \
		if [ "$$page" != "" ]; then \
			port=$$(($(BASE_BACKEND_PORT) + $$i - 1)); \
			echo "  $$page: $$port"; \
		fi; \
	done
	@echo "$(BLUE)Frontend Ports:$(NC)"
	@for i in $(shell seq 1 4); do \
		page=$$(echo "$(PAGES)" | cut -d' ' -f$$i); \
		if [ "$$page" != "" ]; then \
			port=$$(($(BASE_FRONTEND_PORT) + $$i - 1)); \
			echo "  $$page: $$port"; \
		fi; \
	done

.PHONY: project-info
project-info: ## Show detailed project information
	@echo "$(BOLD)$(CYAN)MaskService Project Information$(NC)"
	@echo "$(CYAN)================================$(NC)"
	@echo ""
	@echo "$(GREEN)Directory Structure:$(NC)"
	@tree -L 3 -I 'node_modules|venv|__pycache__|*.pyc' . 2>/dev/null || find . -type d -not -path '*/.*' | head -20
	@echo ""
	@echo "$(GREEN)Component Status:$(NC)"
	@$(MAKE) status

# Quick access aliases
.PHONY: b ba t ta d da c ca
b: build-all ## Alias for build-all
ba: build-all ## Alias for build-all
t: test-all ## Alias for test-all
ta: test-all ## Alias for test-all
d: docker-up-all ## Alias for docker-up-all
da: docker-up-all ## Alias for docker-up-all
c: clean-all ## Alias for clean-all
ca: clean-all ## Alias for clean-all

# Auto-completion helper
.PHONY: _completion
_completion:
	@echo "build-all build-page-login build-page-dashboard build-page-tests build-page-system clean-all clean-page-login clean-page-dashboard clean-page-tests clean-page-system dev-login dev-dashboard dev-tests dev-system docker-build-all docker-cleanup-all docker-down-all docker-up-all health-check-all help install-all list-modules list-pages project-info show-ports status test-all test-docker-all update-scripts validate-all validate-page"
