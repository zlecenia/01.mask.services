#!/usr/bin/env python3

"""
Add missing docker-test targets to all component Makefiles
This fixes the 'No rule to make target docker-test' errors
"""

import os
import sys
from pathlib import Path

DOCKER_TEST_TARGET = """
# Docker testing target
docker-test: docker-up
	@echo "[DOCKER-TEST] Testing Docker containers..."
	@sleep 5  # Wait for containers to be ready
	@echo "[INFO] Testing backend health check..."
	@curl -f http://localhost:$(BACKEND_PORT)/health || echo "[ERROR] Backend health check failed"
	@echo "[INFO] Testing frontend accessibility..."
	@curl -f http://localhost:$(FRONTEND_PORT)/ || echo "[ERROR] Frontend accessibility failed"
	@echo "[DOCKER-TEST] Docker test completed"

.PHONY: docker-test
"""

def add_docker_test_to_makefile(makefile_path):
    """Add docker-test target to a Makefile"""
    if not makefile_path.exists():
        print(f"⚠️ Makefile not found: {makefile_path}")
        return False
    
    content = makefile_path.read_text()
    
    # Check if docker-test target already exists
    if 'docker-test:' in content:
        print(f"  ✅ docker-test target already exists in {makefile_path}")
        return True
    
    # Add the docker-test target at the end
    content += DOCKER_TEST_TARGET
    makefile_path.write_text(content)
    print(f"  ✅ Added docker-test target to {makefile_path}")
    return True

def fix_all_makefiles():
    """Add docker-test targets to all component Makefiles"""
    print("🚀 Adding docker-test targets to all component Makefiles")
    print("=" * 60)
    
    base_dir = Path("/home/tom/github/zlecenia/01.mask.services")
    success_count = 0
    total_count = 0
    
    # Fix page Makefiles
    pages_dir = base_dir / "page"
    if pages_dir.exists():
        for page_dir in pages_dir.iterdir():
            if page_dir.is_dir():
                makefile = page_dir / "Makefile"
                total_count += 1
                print(f"🔧 Processing page/{page_dir.name}/Makefile")
                if add_docker_test_to_makefile(makefile):
                    success_count += 1
    
    # Fix module Makefiles
    modules_dir = base_dir / "module"
    if modules_dir.exists():
        for module_dir in modules_dir.iterdir():
            if module_dir.is_dir():
                makefile = module_dir / "Makefile"
                total_count += 1
                print(f"🔧 Processing module/{module_dir.name}/Makefile")
                if add_docker_test_to_makefile(makefile):
                    success_count += 1
    
    print(f"\n📊 Added docker-test targets to {success_count}/{total_count} Makefiles")
    return success_count == total_count

def main():
    """Main function"""
    success = fix_all_makefiles()
    
    if success:
        print("\n🎉 All Makefiles updated successfully!")
        print("📋 The 'make test-docker-all' command should now work")
        return 0
    else:
        print("\n⚠️ Some Makefiles could not be updated")
        return 1

if __name__ == "__main__":
    sys.exit(main())
