# Makefile for page/settings
COMPONENT_NAME := settings
COMPONENT_TYPE := page
VERSION := 0.1.0

# Port configuration
BACKEND_PORT := 8108
FRONTEND_PORT := 8208

.PHONY: help build test clean install docker-build docker-up docker-down

help: ## Show help
	@echo "Available targets for page/settings:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-15s %s\n", $$1, $$2}'

install: ## Install dependencies
	cd js/$(VERSION) && npm install

build: ## Build component
	@echo "Building settings..."
	cd js/$(VERSION) && npm run build

test: ## Run tests
	@echo "Testing settings..."
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
