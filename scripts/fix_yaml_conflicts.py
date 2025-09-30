#!/usr/bin/env python3

"""
Fix YAML conflicts in docker-compose.yml files - remove duplicate keys and conflicting sections
"""

import os
import sys
from pathlib import Path

PAGE_NAMES = ['login', 'dashboard', 'tests', 'system', 'devices', 'reports', 'service', 'settings', 'workshop']

def clean_docker_compose_yaml(page_name):
    """Clean docker-compose.yml to remove conflicts and fix syntax"""
    compose_path = Path(f"/home/tom/github/zlecenia/01.mask.services/page/{page_name}/docker/0.1.0/docker-compose.yml")
    
    if not compose_path.exists():
        print(f"⚠️ Docker compose file not found: {compose_path}")
        return False
    
    print(f"🔧 Cleaning {page_name} docker-compose.yml...")
    
    content = compose_path.read_text()
    lines = content.split('\n')
    
    # Clean up - remove conflicting sections
    cleaned_lines = []
    skip_section = False
    puppeteer_section_started = False
    
    for line in lines:
        # Skip old frontend tester sections
        if 'login-frontend-tester:' in line or 'frontend-tester:' in line:
            skip_section = True
            continue
        elif line.strip().startswith('maskservice-') and '-puppeteer:' in line:
            puppeteer_section_started = True
            skip_section = False
            cleaned_lines.append(line)
            continue
        elif skip_section and (line.startswith('  ') or line.strip() == ''):
            # Skip lines that are part of the section we're removing
            continue
        elif skip_section and not line.startswith('  ') and line.strip() != '':
            # End of section
            skip_section = False
            
        # Handle duplicate volumes section
        if line.strip() == 'volumes:' and puppeteer_section_started:
            # Skip duplicate volumes section
            continue
        elif line.strip().startswith('- ./test-frontend.js:') or line.strip().startswith('- /tmp:/tmp'):
            # Skip old volume mappings that conflict
            continue
        elif 'command: >' in line or 'sh -c "' in line:
            # Skip old command sections
            skip_section = True
            continue
        elif line.strip().startswith('profiles:') and skip_section:
            # Skip profiles section of old tester
            continue
        elif line.strip().startswith('- testing') and skip_section:
            skip_section = False  # End of profiles section
            continue
            
        if not skip_section:
            cleaned_lines.append(line)
    
    # Write cleaned content
    cleaned_content = '\n'.join(cleaned_lines).strip() + '\n'
    compose_path.write_text(cleaned_content)
    print(f"  ✅ Cleaned {compose_path}")
    return True

def create_clean_puppeteer_compose(page_name, backend_port, frontend_port):
    """Create a clean docker-compose.yml with proper Puppeteer integration"""
    compose_path = Path(f"/home/tom/github/zlecenia/01.mask.services/page/{page_name}/docker/0.1.0/docker-compose.yml")
    
    clean_compose_content = f"""services:
  {page_name}-backend:
    build:
      context: ../..
      dockerfile: docker/0.1.0/Dockerfile.backend
    container_name: maskservice-{page_name}-backend
    ports:
      - "{backend_port}:{backend_port}"
    environment:
      - PYTHONUNBUFFERED=1
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:{backend_port}/health"]
      interval: 30s
      timeout: 3s
      retries: 3

  {page_name}-frontend:
    build:
      context: ../..
      dockerfile: docker/0.1.0/Dockerfile.frontend
    container_name: maskservice-{page_name}-frontend
    ports:
      - "{frontend_port}:80"
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:80/"]
      interval: 30s
      timeout: 3s
      retries: 3
    depends_on:
      {page_name}-backend:
        condition: service_healthy

  maskservice-{page_name}-puppeteer:
    build:
      context: .
      dockerfile: Dockerfile.puppeteer
    container_name: maskservice-{page_name}-puppeteer
    depends_on:
      maskservice-{page_name}-backend:
        condition: service_healthy
      maskservice-{page_name}-frontend:
        condition: service_started
    environment:
      - BACKEND_URL=http://maskservice-{page_name}-backend:{backend_port}
      - FRONTEND_URL=http://maskservice-{page_name}-frontend
    volumes:
      - /tmp:/tmp
    command: ["sh", "-c", "sleep 10 && node puppeteer-test.js"]
"""
    
    compose_path.write_text(clean_compose_content)
    print(f"  ✅ Created clean docker-compose.yml for {page_name}")
    return True

def main():
    """Fix YAML conflicts and create clean docker-compose files"""
    print("🚀 Fixing YAML Conflicts in Docker Compose Files")
    print("=" * 60)
    
    # Port assignments
    port_assignments = {
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
    
    success_count = 0
    for page_name in PAGE_NAMES:
        print(f"\n🔧 Processing {page_name}...")
        ports = port_assignments[page_name]
        
        try:
            # Create clean docker-compose.yml
            create_clean_puppeteer_compose(page_name, ports['backend'], ports['frontend'])
            success_count += 1
        except Exception as e:
            print(f"  ❌ Error processing {page_name}: {e}")
    
    print(f"\n📊 Fixed YAML conflicts: {success_count}/{len(PAGE_NAMES)} docker-compose files")
    
    print("\n🎯 Ready for testing:")
    print("• Clean YAML syntax")
    print("• Proper Puppeteer integration")  
    print("• 82xx port assignments")
    print("• Advanced JS rendering verification")
    
    return 0 if success_count == len(PAGE_NAMES) else 1

if __name__ == "__main__":
    sys.exit(main())
