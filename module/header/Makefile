# Makefile for module/header
COMPONENT_NAME := header
COMPONENT_TYPE := module
VERSION := 0.1.0

# Port configuration
BACKEND_PORT := 8106
FRONTEND_PORT := 8206

.PHONY: help build test clean install docker-build docker-up docker-down

help: ## Show help
	@echo "Available targets for module/header:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-15s %s\n", $$1, $$2}'

install: ## Install dependencies
	cd js/$(VERSION) && npm install

build: ## Build component
	@echo "Building header..."
	cd js/$(VERSION) && npm run build

test: ## Run tests
	@echo "Testing header..."
	cd js/$(VERSION) && npm test

clean: ## Clean build artifacts
	rm -rf js/$(VERSION)/node_modules
	rm -rf js/$(VERSION)/dist

