#!/usr/bin/env python3
"""
Component Migration Script
Migrates components from 1001.mask.services to 01.mask.services structure
"""

import os
import shutil
import json
from pathlib import Path

class ComponentMigrator:
    def __init__(self):
        self.source_root = "/home/tom/github/zlecenia/1001.mask.services"
        self.target_root = "/home/tom/github/zlecenia/01.mask.services"
        
        # Component mapping based on migration guidelines
        self.component_mapping = {
            # Pages (complete applications)
            "loginForm": {"type": "page", "target": "login"},
            "mainMenu": {"type": "page", "target": "dashboard"},
            "userMenu": {"type": "page", "target": "dashboard"},
            "testMenu": {"type": "page", "target": "tests"},
            "deviceSelect": {"type": "page", "target": "devices"},
            "reportsView": {"type": "page", "target": "reports"},
            "systemSettings": {"type": "page", "target": "system"},
            "workshop": {"type": "page", "target": "workshop"},
            "serviceMenu": {"type": "page", "target": "service"},
            "userData": {"type": "page", "target": "settings"},
            
            # Modules (reusable components)
            "appHeader": {"type": "module", "target": "header"},
            "appFooter": {"type": "module", "target": "footer"},
            "pageTemplate": {"type": "module", "target": "menu"},
        }
    
    def migrate_component(self, source_name, mapping):
        """Migrate a single component"""
        source_path = f"{self.source_root}/js/features/{source_name}"
        
        if not os.path.exists(source_path):
            print(f"⚠️  Source not found: {source_path}")
            return False
            
        target_type = mapping["type"]
        target_name = mapping["target"]
        target_path = f"{self.target_root}/{target_type}/{target_name}"
        
        print(f"🔄 Migrating {source_name} → {target_type}/{target_name}")
        
        # Create target structure
        os.makedirs(f"{target_path}/js/0.1.0", exist_ok=True)
        if target_type == "page":
            os.makedirs(f"{target_path}/py/0.1.0", exist_ok=True)
            os.makedirs(f"{target_path}/docker/0.1.0", exist_ok=True)
        
        # Copy source files
        self._copy_component_files(source_path, target_path, target_name, target_type)
        
        # Create additional required files
        self._create_makefile(target_path, target_name, target_type)
        self._create_package_json(target_path, target_name, target_type)
        self._create_readme(target_path, target_name, target_type)
        
        if target_type == "page":
            self._create_backend_files(target_path, target_name)
            self._create_docker_files(target_path, target_name)
        
        return True
    
    def _copy_component_files(self, source_path, target_path, target_name, target_type):
        """Copy and adapt component files"""
        # Find the latest version in source
        versions = [d for d in os.listdir(source_path) if os.path.isdir(f"{source_path}/{d}")]
        if not versions:
            print(f"⚠️  No versions found in {source_path}")
            return
            
        latest_version = sorted(versions)[-1]
        source_version_path = f"{source_path}/{latest_version}"
        
        # Copy JS files
        for file in os.listdir(source_version_path):
            if file.endswith(('.js', '.css', '.html')):
                source_file = f"{source_version_path}/{file}"
                target_file = f"{target_path}/js/0.1.0/{file}"
                
                # Rename main component file
                if file.startswith(source_path.split('/')[-1]):
                    target_file = f"{target_path}/js/0.1.0/{target_name}.{file.split('.')[-1]}"
                
                shutil.copy2(source_file, target_file)
                print(f"  📄 Copied: {file}")
    
    def _create_makefile(self, target_path, target_name, target_type):
        """Create Makefile for component"""
        makefile_content = f"""# Makefile for {target_type}/{target_name}
COMPONENT_NAME := {target_name}
COMPONENT_TYPE := {target_type}
VERSION := 0.1.0

# Port configuration
BACKEND_PORT := 810{len(target_name)}
FRONTEND_PORT := 820{len(target_name)}

.PHONY: help build test clean install docker-build docker-up docker-down

help: ## Show help
\t@echo "Available targets for {target_type}/{target_name}:"
\t@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {{FS = ":.*?## "}}; {{printf "  %-15s %s\\n", $$1, $$2}}'

install: ## Install dependencies
\tcd js/$(VERSION) && npm install

build: ## Build component
\t@echo "Building {target_name}..."
\tcd js/$(VERSION) && npm run build

test: ## Run tests
\t@echo "Testing {target_name}..."
\tcd js/$(VERSION) && npm test

clean: ## Clean build artifacts
\trm -rf js/$(VERSION)/node_modules
\trm -rf js/$(VERSION)/dist

"""
        
        if target_type == "page":
            makefile_content += f"""
docker-build: ## Build Docker images
\tcd docker/$(VERSION) && docker-compose build

docker-up: ## Start Docker containers
\tcd docker/$(VERSION) && docker-compose up -d

docker-down: ## Stop Docker containers
\tcd docker/$(VERSION) && docker-compose down

dev: ## Start development server
\tcd docker/$(VERSION) && docker-compose up
"""
        
        with open(f"{target_path}/Makefile", "w") as f:
            f.write(makefile_content)
    
    def _create_package_json(self, target_path, target_name, target_type):
        """Create package.json for component"""
        package_json = {
            "name": f"@maskservice/{target_name}-{target_type}",
            "version": "0.1.0",
            "description": f"MaskService {target_name} {target_type}",
            "main": f"{target_name}.js",
            "scripts": {
                "test": f"echo '{target_name.title()} {target_type} tests not implemented yet'",
                "build": "echo 'Build complete'",
                "dev": "python3 -m http.server 8080"
            },
            "dependencies": {},
            "devDependencies": {}
        }
        
        with open(f"{target_path}/js/0.1.0/package.json", "w") as f:
            json.dump(package_json, f, indent=2)
    
    def _create_readme(self, target_path, target_name, target_type):
        """Create README.md for component"""
        readme_content = f"""# {target_name.title()} {target_type.title()}

## Overview
MaskService {target_name} {target_type} component migrated from c201001.mask.services.

## Structure
```
{target_type}/{target_name}/
├── js/0.1.0/           # Frontend files
│   ├── {target_name}.js
│   ├── {target_name}.css
│   ├── index.html
│   └── package.json
"""
        
        if target_type == "page":
            readme_content += f"""├── py/0.1.0/           # Backend files
│   ├── main.py
│   └── requirements.txt
├── docker/0.1.0/       # Docker configuration
│   ├── docker-compose.yml
│   ├── Dockerfile.frontend
│   └── Dockerfile.backend
"""
        
        readme_content += f"""└── Makefile            # Build automation
```

## Usage

### Development
```bash
cd {target_path}
make install    # Install dependencies
make build      # Build component
make test       # Run tests
"""
        
        if target_type == "page":
            readme_content += f"""make dev        # Start development server
```

### Docker Testing
```bash
cd {target_path}/docker/0.1.0
docker-compose up
```

Access at: http://127.0.0.1:820{len(target_name)}
"""
        else:
            readme_content += "```"
        
        readme_content += f"""

## Migration Notes
- Migrated from: `js/features/{target_name}/`
- Target structure: `{target_type}/{target_name}/`
- Version: 0.1.0
"""
        
        with open(f"{target_path}/README.md", "w") as f:
            f.write(readme_content)
    
    def _create_backend_files(self, target_path, target_name):
        """Create backend files for pages"""
        # Create main.py
        main_py_content = f'''"""
FastAPI backend for {target_name} page
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="MaskService {target_name.title()} API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {{"message": "MaskService {target_name.title()} API v0.1.0", "status": "active"}}

@app.get("/health")
async def health_check():
    return {{"status": "healthy", "service": "{target_name}", "version": "0.1.0"}}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=810{len(target_name)})
'''
        
        with open(f"{target_path}/py/0.1.0/main.py", "w") as f:
            f.write(main_py_content)
        
        # Create requirements.txt
        requirements_content = """fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.5.0
python-multipart==0.0.6
"""
        
        with open(f"{target_path}/py/0.1.0/requirements.txt", "w") as f:
            f.write(requirements_content)
    
    def _create_docker_files(self, target_path, target_name):
        """Create Docker configuration for pages"""
        # Create docker-compose.yml
        docker_compose_content = f"""services:
  {target_name}-backend:
    build:
      context: ../..
      dockerfile: docker/0.1.0/Dockerfile.backend
    container_name: maskservice-{target_name}-backend
    ports:
      - "810{len(target_name)}:810{len(target_name)}"
    environment:
      - PYTHONUNBUFFERED=1
    healthcheck:
      test: ["CMD", "python", "-c", "import requests; requests.get('http://localhost:810{len(target_name)}/health')"]
      interval: 30s
      timeout: 3s
      retries: 3

  {target_name}-frontend:
    build:
      context: ../..
      dockerfile: docker/0.1.0/Dockerfile.frontend
    container_name: maskservice-{target_name}-frontend
    ports:
      - "820{len(target_name)}:80"
    depends_on:
      {target_name}-backend:
        condition: service_healthy
"""
        
        with open(f"{target_path}/docker/0.1.0/docker-compose.yml", "w") as f:
            f.write(docker_compose_content)
        
        # Create Dockerfile.backend
        dockerfile_backend = f"""FROM python:3.11-slim

WORKDIR /app

COPY py/0.1.0/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY py/0.1.0/ .

EXPOSE 810{len(target_name)}

CMD ["python", "main.py"]
"""
        
        with open(f"{target_path}/docker/0.1.0/Dockerfile.backend", "w") as f:
            f.write(dockerfile_backend)
        
        # Create Dockerfile.frontend
        dockerfile_frontend = """FROM nginx:alpine

COPY js/0.1.0/ /usr/share/nginx/html/
COPY docker/0.1.0/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
"""
        
        with open(f"{target_path}/docker/0.1.0/Dockerfile.frontend", "w") as f:
            f.write(dockerfile_frontend)
        
        # Create nginx.conf
        nginx_conf = f"""events {{
    worker_connections 1024;
}}

http {{
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {{
        listen 80;
        server_name localhost;

        location / {{
            root /usr/share/nginx/html;
            try_files $uri $uri/ /index.html;
        }}

        location /api/ {{
            proxy_pass http://{target_name}-backend:810{len(target_name)};
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }}
    }}
}}
"""
        
        with open(f"{target_path}/docker/0.1.0/nginx.conf", "w") as f:
            f.write(nginx_conf)
    
    def migrate_all(self):
        """Migrate all components"""
        print("🚀 Starting component migration...")
        
        migrated = 0
        for source_name, mapping in self.component_mapping.items():
            if self.migrate_component(source_name, mapping):
                migrated += 1
        
        print(f"\n✅ Migration complete: {migrated}/{len(self.component_mapping)} components migrated")
        return migrated

if __name__ == "__main__":
    migrator = ComponentMigrator()
    migrator.migrate_all()
