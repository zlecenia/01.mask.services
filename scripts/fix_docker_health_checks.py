#!/usr/bin/env python3

"""
Fix Docker Health Checks
Adds curl to Dockerfiles and fixes health check syntax for all pages
"""

import os
import sys
from pathlib import Path

def fix_dockerfile_health_check(dockerfile_path):
    """Add curl installation to Dockerfile"""
    if not dockerfile_path.exists():
        print(f"⚠️ Dockerfile not found: {dockerfile_path}")
        return False
    
    content = dockerfile_path.read_text()
    
    # Check if curl is already installed
    if 'apt-get install -y curl' in content:
        print(f"  ✅ curl already installed in {dockerfile_path}")
        return True
    
    # Find the line with "WORKDIR /app" and add curl installation before it
    lines = content.split('\n')
    for i, line in enumerate(lines):
        if line.strip() == 'WORKDIR /app':
            # Insert curl installation before WORKDIR
            lines.insert(i, '')
            lines.insert(i, 'RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*')
            break
    
    dockerfile_path.write_text('\n'.join(lines))
    print(f"  ✅ Added curl installation to {dockerfile_path}")
    return True

def fix_compose_health_check(compose_path):
    """Fix health check syntax in docker-compose.yml"""
    if not compose_path.exists():
        print(f"⚠️ docker-compose.yml not found: {compose_path}")
        return False
    
    content = compose_path.read_text()
    
    # Check if curl health check is already used
    if 'curl", "-f"' in content:
        print(f"  ✅ curl health check already configured in {compose_path}")
        return True
    
    # Replace python-based health checks with curl-based ones
    lines = content.split('\n')
    for i, line in enumerate(lines):
        if 'import requests; requests.get' in line:
            # Extract port from the URL in the health check
            if 'http://localhost:' in line:
                port_start = line.find('http://localhost:') + len('http://localhost:')
                port_end = line.find('/', port_start)
                if port_end == -1:
                    port_end = line.find('\'', port_start)
                if port_end == -1:
                    port_end = line.find('"', port_start)
                
                if port_end > port_start:
                    port = line[port_start:port_end]
                    lines[i] = f'      test: ["CMD", "curl", "-f", "http://localhost:{port}/health"]'
                    print(f"  ✅ Fixed health check to use curl for port {port}")
    
    compose_path.write_text('\n'.join(lines))
    return True

def fix_page_health_checks(page_name):
    """Fix health checks for a specific page"""
    page_dir = Path(f"/home/tom/github/zlecenia/01.mask.services/page/{page_name}")
    
    if not page_dir.exists():
        print(f"⚠️ Page directory not found: {page_dir}")
        return False
    
    print(f"🔧 Fixing health checks for {page_name}")
    
    # Fix Dockerfile
    dockerfile = page_dir / "docker/0.1.0/Dockerfile.backend"
    dockerfile_success = fix_dockerfile_health_check(dockerfile)
    
    # Fix docker-compose.yml
    compose_file = page_dir / "docker/0.1.0/docker-compose.yml"
    compose_success = fix_compose_health_check(compose_file)
    
    return dockerfile_success and compose_success

def main():
    """Fix health checks for all pages that need it"""
    print("🚀 Fixing Docker Health Checks")
    print("=" * 50)
    
    # Pages that need health check fixes based on earlier output
    pages_to_fix = ['login', 'dashboard', 'tests', 'system']
    
    success_count = 0
    for page_name in pages_to_fix:
        if fix_page_health_checks(page_name):
            success_count += 1
    
    print(f"\n📊 Fixed health checks for {success_count}/{len(pages_to_fix)} pages")
    
    if success_count == len(pages_to_fix):
        print("\n🎉 All health checks fixed successfully!")
        print("📋 Docker containers should now start properly with health checks")
        return 0
    else:
        print("\n⚠️ Some health checks could not be fixed")
        return 1

if __name__ == "__main__":
    sys.exit(main())
