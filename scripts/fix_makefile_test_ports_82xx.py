#!/usr/bin/env python3

"""
Fix ALL Makefile test ports to use correct 82xx ports
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

def fix_makefile_test_ports_direct(page_name, ports):
    """Directly fix test ports in Makefile docker-test target"""
    makefile_path = Path(f"/home/tom/github/zlecenia/01.mask.services/page/{page_name}/Makefile")
    
    if not makefile_path.exists():
        print(f"⚠️ Makefile not found: {makefile_path}")
        return False
    
    print(f"🔧 Fixing {page_name} Makefile test ports...")
    
    content = makefile_path.read_text()
    
    # Find docker-test target and replace curl commands with correct ports
    lines = content.split('\n')
    updated_lines = []
    in_docker_test = False
    
    for line in lines:
        # Detect docker-test target
        if line.strip().startswith('docker-test:'):
            in_docker_test = True
            
        # Replace port references in curl commands
        if in_docker_test and 'localhost:' in line and 'curl' in line:
            # Replace old port with correct backend port
            if 'health' in line:
                # Backend health check
                new_line = line
                # Replace any 8xxx port with correct backend port
                import re
                new_line = re.sub(r'localhost:8\d{3}', f'localhost:{ports["backend"]}', new_line)
                updated_lines.append(new_line)
                print(f"  ✅ Updated backend test: localhost:{ports['backend']}")
            elif '/health' not in line and 'curl' in line:
                # Frontend accessibility check
                new_line = line
                # Replace any 8xxx port with correct frontend port
                import re
                new_line = re.sub(r'localhost:8\d{3}', f'localhost:{ports["frontend"]}', new_line)
                updated_lines.append(new_line)
                print(f"  ✅ Updated frontend test: localhost:{ports['frontend']}")
            else:
                updated_lines.append(line)
        else:
            updated_lines.append(line)
        
        # End of docker-test target
        if in_docker_test and line.strip() and not line.startswith('\t') and not line.strip().startswith('docker-test:'):
            in_docker_test = False
    
    # Write updated content
    makefile_path.write_text('\n'.join(updated_lines))
    print(f"  ✅ Updated {makefile_path}")
    return True

def create_correct_docker_test_target(page_name, ports):
    """Create correct docker-test target with proper 82xx ports"""
    makefile_path = Path(f"/home/tom/github/zlecenia/01.mask.services/page/{page_name}/Makefile")
    
    if not makefile_path.exists():
        print(f"⚠️ Makefile not found: {makefile_path}")
        return False
    
    print(f"🔧 Creating correct docker-test target for {page_name}...")
    
    content = makefile_path.read_text()
    
    # Remove old docker-test target
    lines = content.split('\n')
    filtered_lines = []
    skip_docker_test = False
    
    for line in lines:
        if line.strip().startswith('docker-test:'):
            skip_docker_test = True
            continue
        elif skip_docker_test and (line.startswith('\t') or line.strip() == ''):
            continue
        else:
            skip_docker_test = False
            filtered_lines.append(line)
    
    # Add correct docker-test target
    correct_docker_test = f"""
# Test Docker containers with correct 82xx ports
.PHONY: docker-test
docker-test: docker-up
	@echo "[DOCKER-TEST] Testing Docker containers..."
	@echo "[INFO] Testing backend health check..."
	@curl -f http://localhost:{ports['backend']}/health || echo "[ERROR] Backend health check failed"
	@echo "[INFO] Testing frontend accessibility..."
	@curl -f http://localhost:{ports['frontend']}/ || echo "[ERROR] Frontend accessibility failed"
	@echo "[DOCKER-TEST] Docker test completed"
"""
    
    # Append correct target
    updated_content = '\n'.join(filtered_lines).rstrip() + correct_docker_test + '\n'
    
    makefile_path.write_text(updated_content)
    print(f"  ✅ Created correct docker-test target with ports {ports['backend']}/{ports['frontend']}")
    return True

def main():
    """Fix ALL Makefile test ports to use correct 82xx ports"""
    print("🚀 Fixing ALL Makefile Test Ports to 82xx Range")
    print("=" * 60)
    
    success_count = 0
    for page_name, ports in PORT_ASSIGNMENTS_82XX.items():
        print(f"\n🔧 Processing {page_name} (backend:{ports['backend']}, frontend:{ports['frontend']})...")
        
        if create_correct_docker_test_target(page_name, ports):
            success_count += 1
    
    print(f"\n📊 Fixed test ports in {success_count}/{len(PORT_ASSIGNMENTS_82XX)} Makefiles")
    
    print("\n📋 Test Port Summary (Backend/Frontend):")
    for page_name, ports in PORT_ASSIGNMENTS_82XX.items():
        print(f"  {page_name:10} {ports['backend']}/{ports['frontend']}")
    
    return 0 if success_count == len(PORT_ASSIGNMENTS_82XX) else 1

if __name__ == "__main__":
    sys.exit(main())
