#!/usr/bin/env python3

"""
Update all ports to 82xx range and fix Docker configurations
"""

import os
import sys
from pathlib import Path

# New 82xx port assignments
PORT_ASSIGNMENTS_82XX = {
    'login': {'backend': 8201, 'frontend': 8221},
    'dashboard': {'backend': 8202, 'frontend': 8222}, 
    'tests': {'backend': 8203, 'frontend': 8223},
    'system': {'backend': 8204, 'frontend': 8224},
    'devices': {'backend': 8207, 'frontend': 8227},
    'reports': {'backend': 8208, 'frontend': 8228},
    'service': {'backend': 8209, 'frontend': 8229},
    'settings': {'backend': 8210, 'frontend': 8230},
    'workshop': {'backend': 8211, 'frontend': 8231}
}

def update_page_ports_82xx(page_name, ports):
    """Update ports for a specific page to 82xx range"""
    page_dir = Path(f"/home/tom/github/zlecenia/01.mask.services/page/{page_name}")
    
    if not page_dir.exists():
        print(f"⚠️ Page directory not found: {page_dir}")
        return False
    
    print(f"🔧 Updating {page_name} to 82xx range: backend={ports['backend']}, frontend={ports['frontend']}")
    
    # Update main.py port
    main_py = page_dir / "py/0.1.0/main.py"
    if main_py.exists():
        content = main_py.read_text()
        lines = content.split('\n')
        for i, line in enumerate(lines):
            if 'uvicorn.run' in line and 'port=' in line:
                lines[i] = f'    uvicorn.run(app, host="0.0.0.0", port={ports["backend"]})'
                break
        main_py.write_text('\n'.join(lines))
        print(f"  ✅ Updated {main_py}")
    
    # Update Dockerfile.backend EXPOSE
    dockerfile = page_dir / "docker/0.1.0/Dockerfile.backend"
    if dockerfile.exists():
        content = dockerfile.read_text()
        lines = content.split('\n')
        for i, line in enumerate(lines):
            if line.startswith('EXPOSE'):
                lines[i] = f'EXPOSE {ports["backend"]}'
                break
        dockerfile.write_text('\n'.join(lines))
        print(f"  ✅ Updated {dockerfile}")
    
    # Update docker-compose.yml ports and health check
    compose_file = page_dir / "docker/0.1.0/docker-compose.yml"
    if compose_file.exists():
        content = compose_file.read_text()
        lines = content.split('\n')
        for i, line in enumerate(lines):
            # Fix backend port mapping
            if '"8' in line and ':8' in line and 'ports:' not in line:
                if f'{page_name}-backend' in content[:content.find(line)]:
                    lines[i] = f'      - "{ports["backend"]}:{ports["backend"]}"'
                elif f'{page_name}-frontend' in content[:content.find(line)]:
                    lines[i] = f'      - "{ports["frontend"]}:80"'
            # Fix health check URL
            elif 'localhost:' in line and 'health' in line:
                lines[i] = f'      test: ["CMD", "curl", "-f", "http://localhost:{ports["backend"]}/health"]'
        
        compose_file.write_text('\n'.join(lines))
        print(f"  ✅ Updated {compose_file}")
    
    return True

def create_env_file(page_name, ports):
    """Create .env file for Docker configuration"""
    env_dir = Path(f"/home/tom/github/zlecenia/01.mask.services/page/{page_name}/docker/0.1.0")
    env_file = env_dir / ".env"
    
    env_content = f"""# MaskService {page_name.capitalize()} Configuration
# Generated automatically - do not edit manually

# Service Ports
BACKEND_PORT={ports['backend']}
FRONTEND_PORT={ports['frontend']}

# Service Hosts  
BACKEND_HOST=localhost
FRONTEND_HOST=localhost

# Docker Configuration
COMPOSE_PROJECT_NAME=maskservice-{page_name}
DOCKER_BUILDKIT=1

# Development Configuration
NODE_ENV=development
PYTHONUNBUFFERED=1

# Health Check Configuration  
HEALTH_CHECK_INTERVAL=30s
HEALTH_CHECK_TIMEOUT=3s
HEALTH_CHECK_RETRIES=3

# Nginx Configuration
NGINX_WORKER_PROCESSES=auto
NGINX_WORKER_CONNECTIONS=1024
"""
    
    env_file.write_text(env_content)
    print(f"  ✅ Created {env_file}")
    return True

def main():
    """Update all ports to 82xx range and create .env files"""
    print("🚀 Updating All Ports to 82xx Range")
    print("=" * 60)
    
    success_count = 0
    for page_name, ports in PORT_ASSIGNMENTS_82XX.items():
        if update_page_ports_82xx(page_name, ports):
            create_env_file(page_name, ports)
            success_count += 1
    
    print(f"\n📊 Updated {success_count}/{len(PORT_ASSIGNMENTS_82XX)} pages to 82xx range")
    
    print("\n📋 New 82xx Port Assignment Summary:")
    for page_name, ports in PORT_ASSIGNMENTS_82XX.items():
        print(f"  {page_name:10} Backend: {ports['backend']}, Frontend: {ports['frontend']}")
    
    return 0 if success_count == len(PORT_ASSIGNMENTS_82XX) else 1

if __name__ == "__main__":
    sys.exit(main())
