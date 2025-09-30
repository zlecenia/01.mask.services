#!/usr/bin/env python3

"""
Fix Docker Port Conflicts
Assigns unique ports to each page component to avoid conflicts
"""

import os
import sys
from pathlib import Path

# Port assignments for pages
PORT_ASSIGNMENTS = {
    'login': {'backend': 8101, 'frontend': 8201},
    'dashboard': {'backend': 8102, 'frontend': 8202}, 
    'tests': {'backend': 8103, 'frontend': 8203},
    'system': {'backend': 8104, 'frontend': 8204},
    'devices': {'backend': 8107, 'frontend': 8207},  # Already correct
    'reports': {'backend': 8108, 'frontend': 8208},  # Already correct
    'service': {'backend': 8109, 'frontend': 8209},  # Fixed conflict
    'settings': {'backend': 8110, 'frontend': 8210}, # Fixed conflict
    'workshop': {'backend': 8111, 'frontend': 8211}  # Fixed conflict
}

def fix_page_ports(page_name, ports):
    """Fix ports for a specific page"""
    page_dir = Path(f"/home/tom/github/zlecenia/01.mask.services/page/{page_name}")
    
    if not page_dir.exists():
        print(f"⚠️ Page directory not found: {page_dir}")
        return False
    
    print(f"🔧 Fixing ports for {page_name}: backend={ports['backend']}, frontend={ports['frontend']}")
    
    # Fix main.py port
    main_py = page_dir / "py/0.1.0/main.py"
    if main_py.exists():
        content = main_py.read_text()
        # Find and replace port in uvicorn.run
        lines = content.split('\n')
        for i, line in enumerate(lines):
            if 'uvicorn.run' in line and 'port=' in line:
                lines[i] = f'    uvicorn.run(app, host="0.0.0.0", port={ports["backend"]})'
                break
        main_py.write_text('\n'.join(lines))
        print(f"  ✅ Updated {main_py}")
    
    # Fix Dockerfile.backend EXPOSE
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
    
    # Fix docker-compose.yml ports and health check
    compose_file = page_dir / "docker/0.1.0/docker-compose.yml"
    if compose_file.exists():
        content = compose_file.read_text()
        lines = content.split('\n')
        for i, line in enumerate(lines):
            # Fix backend port mapping
            if f'- "{ports["backend"]}' not in line and '8' in line and ':8' in line and 'ports:' not in line:
                if f'{page_name}-backend' in content[max(0, content.rfind('\n', 0, content.find(line)))]:
                    lines[i] = f'      - "{ports["backend"]}:{ports["backend"]}"'
            # Fix frontend port mapping  
            elif f'- "{ports["frontend"]}' not in line and ':80"' in line:
                lines[i] = f'      - "{ports["frontend"]}:80"'
            # Fix health check URL
            elif 'localhost:' in line and 'health' in line:
                lines[i] = f'      test: ["CMD", "curl", "-f", "http://localhost:{ports["backend"]}/health"]'
        
        compose_file.write_text('\n'.join(lines))
        print(f"  ✅ Updated {compose_file}")
    
    return True

def main():
    """Fix all port conflicts"""
    print("🚀 Fixing Docker Port Conflicts")
    print("=" * 50)
    
    success_count = 0
    for page_name, ports in PORT_ASSIGNMENTS.items():
        if fix_page_ports(page_name, ports):
            success_count += 1
    
    print(f"\n📊 Fixed ports for {success_count}/{len(PORT_ASSIGNMENTS)} pages")
    
    print("\n📋 Port Assignment Summary:")
    for page_name, ports in PORT_ASSIGNMENTS.items():
        print(f"  {page_name:10} Backend: {ports['backend']}, Frontend: {ports['frontend']}")
    
    return 0 if success_count == len(PORT_ASSIGNMENTS) else 1

if __name__ == "__main__":
    sys.exit(main())
