#!/usr/bin/env python3

"""
Fix all docker-compose.yml files to use correct 82xx frontend ports
"""

import os
import sys
from pathlib import Path

# 82xx port assignments - frontend ports should map to :80
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

def fix_docker_compose_ports(page_name, ports):
    """Fix docker-compose.yml file for specific page"""
    compose_file = Path(f"/home/tom/github/zlecenia/01.mask.services/page/{page_name}/docker/0.1.0/docker-compose.yml")
    
    if not compose_file.exists():
        print(f"⚠️ Docker compose file not found: {compose_file}")
        return False
    
    print(f"🔧 Fixing {page_name} docker-compose.yml...")
    
    content = compose_file.read_text()
    lines = content.split('\n')
    
    in_backend = False
    in_frontend = False
    
    for i, line in enumerate(lines):
        # Track which service we're in
        if f'{page_name}-backend:' in line:
            in_backend = True
            in_frontend = False
        elif f'{page_name}-frontend:' in line:
            in_backend = False
            in_frontend = True
        elif line.strip().startswith('services:') or (line.strip() and not line.startswith(' ') and ':' in line):
            in_backend = False
            in_frontend = False
        
        # Fix port mappings
        if 'ports:' not in line and '"' in line and ':' in line and 'ports:' in content[max(0, content.rfind('\n', 0, content.find(line))-100):content.find(line)]:
            if in_backend and f'"{ports["backend"]}:' not in line:
                lines[i] = f'      - "{ports["backend"]}:{ports["backend"]}"'
                print(f"  ✅ Fixed backend port: {lines[i].strip()}")
            elif in_frontend and f'"{ports["frontend"]}:80"' not in line:
                lines[i] = f'      - "{ports["frontend"]}:80"'
                print(f"  ✅ Fixed frontend port: {lines[i].strip()}")
        
        # Fix health check URL
        if 'localhost:' in line and 'health' in line and f'localhost:{ports["backend"]}' not in line:
            lines[i] = f'      test: ["CMD", "curl", "-f", "http://localhost:{ports["backend"]}/health"]'
            print(f"  ✅ Fixed health check URL: {lines[i].strip()}")
    
    compose_file.write_text('\n'.join(lines))
    print(f"  ✅ Updated {compose_file}")
    return True

def main():
    """Fix all docker-compose.yml files with correct 82xx frontend ports"""
    print("🚀 Fixing All Docker Frontend Ports (82xx range)")
    print("=" * 60)
    
    success_count = 0
    for page_name, ports in PORT_ASSIGNMENTS_82XX.items():
        if fix_docker_compose_ports(page_name, ports):
            success_count += 1
    
    print(f"\n📊 Fixed {success_count}/{len(PORT_ASSIGNMENTS_82XX)} docker-compose.yml files")
    
    print("\n📋 82xx Port Mappings Summary:")
    for page_name, ports in PORT_ASSIGNMENTS_82XX.items():
        print(f"  {page_name:10} Backend: {ports['backend']}:{ports['backend']}, Frontend: {ports['frontend']}:80")
    
    return 0 if success_count == len(PORT_ASSIGNMENTS_82XX) else 1

if __name__ == "__main__":
    sys.exit(main())
