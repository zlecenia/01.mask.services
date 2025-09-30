#!/usr/bin/env python3

"""
Fix YAML syntax errors in all docker-compose.yml files caused by port update script
"""

import os
import sys
from pathlib import Path

# 82xx port assignments
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

def fix_yaml_syntax(page_name, ports):
    """Fix YAML syntax errors in docker-compose.yml"""
    compose_file = Path(f"/home/tom/github/zlecenia/01.mask.services/page/{page_name}/docker/0.1.0/docker-compose.yml")
    
    if not compose_file.exists():
        print(f"⚠️ Docker compose file not found: {compose_file}")
        return False
    
    print(f"🔧 Fixing YAML syntax for {page_name}...")
    
    # Create correct docker-compose.yml content
    correct_content = f"""services:
  {page_name}-backend:
    build:
      context: ../..
      dockerfile: docker/0.1.0/Dockerfile.backend
    container_name: maskservice-{page_name}-backend
    ports:
      - \"{ports['backend']}:{ports['backend']}\"
    environment:
      - PYTHONUNBUFFERED=1
    healthcheck:
      test: [\"CMD\", \"curl\", \"-f\", \"http://localhost:{ports['backend']}/health\"]
      interval: 30s
      timeout: 3s
      retries: 3

  {page_name}-frontend:
    build:
      context: ../..
      dockerfile: docker/0.1.0/Dockerfile.frontend
    container_name: maskservice-{page_name}-frontend
    ports:
      - \"{ports['frontend']}:80\"
    depends_on:
      {page_name}-backend:
        condition: service_healthy
"""
    
    compose_file.write_text(correct_content)
    print(f"  ✅ Fixed YAML syntax in {compose_file}")
    return True

def fix_docker_test_scripts(page_name, ports):
    """Fix docker test scripts to use correct 82xx ports"""
    makefile_path = Path(f"/home/tom/github/zlecenia/01.mask.services/page/{page_name}/Makefile")
    
    if not makefile_path.exists():
        print(f"⚠️ Makefile not found: {makefile_path}")
        return False
    
    content = makefile_path.read_text()
    
    # Update health check URLs in Makefile docker-test target
    updated_content = content
    
    # Replace old port references with new 82xx ports
    old_backend_patterns = ['8101', '8102', '8105', '8108', '8109', '8110', '8111']
    old_frontend_patterns = ['8201', '8202', '8205', '8208', '8209', '8210', '8211']
    
    for old_port in old_backend_patterns:
        if f'localhost:{old_port}' in updated_content:
            updated_content = updated_content.replace(f'localhost:{old_port}', f'localhost:{ports["backend"]}')
    
    for old_port in old_frontend_patterns:
        if f'localhost:{old_port}' in updated_content:
            updated_content = updated_content.replace(f'localhost:{old_port}', f'localhost:{ports["frontend"]}')
    
    if updated_content != content:
        makefile_path.write_text(updated_content)
        print(f"  ✅ Updated test ports in {makefile_path}")
    
    return True

def main():
    """Fix all YAML syntax errors and test port references"""
    print("🚀 Fixing All YAML Syntax Errors + Test Port References")
    print("=" * 70)
    
    success_count = 0
    for page_name, ports in PORT_ASSIGNMENTS_82XX.items():
        print(f"\n🔧 Processing {page_name}...")
        if fix_yaml_syntax(page_name, ports):
            fix_docker_test_scripts(page_name, ports)
            success_count += 1
    
    print(f"\n📊 Fixed {success_count}/{len(PORT_ASSIGNMENTS_82XX)} docker-compose.yml files")
    
    print("\n📋 All containers should now use these 82xx ports:")
    for page_name, ports in PORT_ASSIGNMENTS_82XX.items():
        print(f"  {page_name:10} Backend: {ports['backend']}, Frontend: {ports['frontend']}")
    
    return 0 if success_count == len(PORT_ASSIGNMENTS_82XX) else 1

if __name__ == "__main__":
    sys.exit(main())
