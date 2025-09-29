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
