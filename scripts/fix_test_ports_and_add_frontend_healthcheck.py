#!/usr/bin/env python3

"""
Fix test scripts to use correct 82xx ports and add frontend healthchecks to docker-compose.yml
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

def fix_makefile_test_ports(page_name, ports):
    """Fix test ports in Makefile docker-test target"""
    makefile_path = Path(f"/home/tom/github/zlecenia/01.mask.services/page/{page_name}/Makefile")
    
    if not makefile_path.exists():
        print(f"⚠️ Makefile not found: {makefile_path}")
        return False
    
    print(f"🔧 Fixing test ports in {page_name} Makefile...")
    
    content = makefile_path.read_text()
    
    # Replace old port references with new 82xx ports in test commands
    old_patterns = [
        ('8101', f'{ports["backend"]}'),
        ('8102', f'{ports["backend"]}'), 
        ('8105', f'{ports["backend"]}'),
        ('8108', f'{ports["backend"]}'),
        ('8109', f'{ports["backend"]}'),
        ('8110', f'{ports["backend"]}'),
        ('8111', f'{ports["backend"]}'),
        ('8201', f'{ports["frontend"]}'),
        ('8202', f'{ports["frontend"]}'),
        ('8205', f'{ports["frontend"]}'),
        ('8208', f'{ports["frontend"]}'),
        ('8209', f'{ports["frontend"]}'),
        ('8210', f'{ports["frontend"]}'),
        ('8211', f'{ports["frontend"]}')
    ]
    
    updated_content = content
    for old_port, new_port in old_patterns:
        if f'localhost:{old_port}' in updated_content:
            updated_content = updated_content.replace(f'localhost:{old_port}', f'localhost:{new_port}')
    
    if updated_content != content:
        makefile_path.write_text(updated_content)
        print(f"  ✅ Updated test ports in {makefile_path}")
    
    return True

def add_frontend_healthcheck_to_compose(page_name, ports):
    """Add frontend healthcheck to docker-compose.yml"""
    compose_file = Path(f"/home/tom/github/zlecenia/01.mask.services/page/{page_name}/docker/0.1.0/docker-compose.yml")
    
    if not compose_file.exists():
        print(f"⚠️ Docker compose file not found: {compose_file}")
        return False
    
    print(f"🔧 Adding frontend healthcheck to {page_name} docker-compose.yml...")
    
    # Create enhanced docker-compose.yml with frontend healthcheck
    enhanced_content = f"""services:
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
    healthcheck:
      test: [\"CMD\", \"wget\", \"--no-verbose\", \"--tries=1\", \"--spider\", \"http://localhost:80/\"]
      interval: 30s
      timeout: 3s
      retries: 3
    depends_on:
      {page_name}-backend:
        condition: service_healthy

  # Advanced Frontend Testing Service
  {page_name}-frontend-tester:
    image: node:18-alpine
    container_name: maskservice-{page_name}-frontend-tester
    working_dir: /app
    volumes:
      - ./test-frontend.js:/app/test-frontend.js
    command: >
      sh -c "
        npm install -g puppeteer &&
        node test-frontend.js http://{page_name}-frontend:80/
      "
    depends_on:
      {page_name}-frontend:
        condition: service_healthy
    profiles:
      - testing
"""
    
    compose_file.write_text(enhanced_content)
    print(f"  ✅ Added frontend healthcheck and testing service to {compose_file}")
    return True

def create_frontend_test_script(page_name):
    """Create JavaScript frontend testing script with Puppeteer"""
    test_dir = Path(f"/home/tom/github/zlecenia/01.mask.services/page/{page_name}/docker/0.1.0")
    test_file = test_dir / "test-frontend.js"
    
    test_script = f"""const puppeteer = require('puppeteer');

async function testFrontend(url) {{
    console.log(`🧪 Testing frontend: ${{url}}`);
    
    const browser = await puppeteer.launch({{
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }});
    
    try {{
        const page = await browser.newPage();
        
        // Set viewport
        await page.setViewport({{ width: 1280, height: 720 }});
        
        // Navigate to page
        console.log('📄 Loading page...');
        await page.goto(url, {{ waitUntil: 'networkidle2', timeout: 30000 }});
        
        // Check if Vue.js is loaded
        console.log('🔍 Checking Vue.js loading...');
        const vueLoaded = await page.evaluate(() => {{
            return typeof Vue !== 'undefined' || typeof window.Vue !== 'undefined';
        }});
        
        // Check if app div exists and has content
        console.log('🔍 Checking app content...');
        const appContent = await page.evaluate(() => {{
            const appDiv = document.getElementById('app');
            if (!appDiv) return false;
            return appDiv.innerHTML.trim().length > 0;
        }});
        
        // Wait for potential Vue components to render
        await page.waitForTimeout(2000);
        
        // Check final rendered content
        const finalContent = await page.evaluate(() => {{
            const appDiv = document.getElementById('app');
            return appDiv ? appDiv.innerHTML.trim() : '';
        }});
        
        // Take screenshot for debugging
        await page.screenshot({{ path: '/app/frontend-test-screenshot.png' }});
        
        console.log('📊 Test Results:');
        console.log(`  Vue.js loaded: ${{vueLoaded}}`);
        console.log(`  App has content: ${{appContent}}`);
        console.log(`  Final content length: ${{finalContent.length}}`);
        
        if (vueLoaded && finalContent.length > 0) {{
            console.log('✅ Frontend test PASSED');
            process.exit(0);
        }} else {{
            console.log('❌ Frontend test FAILED');
            console.log('Final content:', finalContent.substring(0, 200) + '...');
            process.exit(1);
        }}
        
    }} catch (error) {{
        console.error('❌ Frontend test ERROR:', error.message);
        process.exit(1);
    }} finally {{
        await browser.close();
    }}
}}

// Run test
const url = process.argv[2] || 'http://localhost:80/';
testFrontend(url);
"""
    
    test_file.write_text(test_script)
    print(f"  ✅ Created frontend test script: {test_file}")
    return True

def main():
    """Fix test ports and add comprehensive frontend testing"""
    print("🚀 Fixing Test Ports + Adding Frontend HealthChecks + Advanced Testing")
    print("=" * 80)
    
    success_count = 0
    for page_name, ports in PORT_ASSIGNMENTS_82XX.items():
        print(f"\n🔧 Processing {page_name}...")
        
        # Fix makefile test ports
        fix_makefile_test_ports(page_name, ports)
        
        # Add frontend healthcheck to docker-compose.yml
        if add_frontend_healthcheck_to_compose(page_name, ports):
            success_count += 1
            
        # Create frontend test script
        create_frontend_test_script(page_name)
    
    print(f"\n📊 Enhanced {success_count}/{len(PORT_ASSIGNMENTS_82XX)} docker-compose.yml files")    
    print("\n📋 Frontend HealthChecks Added:")
    for page_name, ports in PORT_ASSIGNMENTS_82XX.items():
        print(f"  {page_name:10} Backend: {ports['backend']}, Frontend: {ports['frontend']} + HealthCheck")
    
    print("\n🧪 Advanced Frontend Testing Features:")
    print("  • Puppeteer-based JS rendering verification")
    print("  • Vue.js loading detection") 
    print("  • Content rendering validation")
    print("  • Screenshot capture for debugging")
    print("  • Separate testing service container")
    
    return 0 if success_count == len(PORT_ASSIGNMENTS_82XX) else 1

if __name__ == "__main__":
    sys.exit(main())
