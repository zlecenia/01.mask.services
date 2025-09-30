#!/usr/bin/env python3

"""
Add 'make stop' target to all Makefiles to stop python/npm/docker services
"""

import os
import sys
from pathlib import Path

def add_stop_target_to_makefile(makefile_path):
    """Add stop target to a Makefile"""
    if not makefile_path.exists():
        print(f"⚠️ Makefile not found: {makefile_path}")
        return False
    
    content = makefile_path.read_text()
    
    # Check if stop target already exists
    if 'stop:' in content or '.PHONY: stop' in content:
        print(f"  ℹ️ Stop target already exists in {makefile_path}")
        return True
    
    # Add stop target
    stop_target = """
# Stop all services (python, npm, docker)
.PHONY: stop
stop:
	@echo "[STOP] Stopping all services for $(notdir $(CURDIR))..."
	@-pkill -f "python.*$(notdir $(CURDIR))" 2>/dev/null || true
	@-pkill -f "npm.*$(notdir $(CURDIR))" 2>/dev/null || true
	@-pkill -f "node.*$(notdir $(CURDIR))" 2>/dev/null || true
	@if [ -d "docker/0.1.0" ]; then \\
		echo "[STOP] Stopping Docker containers..."; \\
		cd docker/0.1.0 && docker-compose down --remove-orphans 2>/dev/null || true; \\
	fi
	@echo "[STOP] All services stopped for $(notdir $(CURDIR))"
"""
    
    # Add to end of file
    updated_content = content.rstrip() + '\n' + stop_target + '\n'
    makefile_path.write_text(updated_content)
    
    print(f"  ✅ Added stop target to {makefile_path}")
    return True

def main():
    """Add stop targets to all Makefiles"""
    print("🚀 Adding 'make stop' targets to all Makefiles")
    print("=" * 60)
    
    base_dir = Path("/home/tom/github/zlecenia/01.mask.services")
    success_count = 0
    total_count = 0
    
    # Process page Makefiles
    for page_dir in (base_dir / "page").glob("*/"):
        if page_dir.is_dir():
            makefile = page_dir / "Makefile"
            print(f"🔧 Processing page: {page_dir.name}")
            if add_stop_target_to_makefile(makefile):
                success_count += 1
            total_count += 1
    
    # Process module Makefiles  
    for module_dir in (base_dir / "module").glob("*/"):
        if module_dir.is_dir():
            makefile = module_dir / "Makefile"
            print(f"🔧 Processing module: {module_dir.name}")
            if add_stop_target_to_makefile(makefile):
                success_count += 1
            total_count += 1
    
    # Process main Makefile
    main_makefile = base_dir / "Makefile"
    print(f"🔧 Processing main Makefile")
    
    # Add stop-all target to main Makefile
    if main_makefile.exists():
        content = main_makefile.read_text()
        
        if 'stop-all:' not in content:
            stop_all_target = """
# Stop all services across all components  
.PHONY: stop-all
stop-all:
	@echo "[STOP-ALL] Stopping all services across all components..."
	@for dir in page/* module/*; do \\
		if [ -d "$$dir" ] && [ -f "$$dir/Makefile" ]; then \\
			echo "[STOP-ALL] Stopping services in $$dir..."; \\
			$(MAKE) -C "$$dir" stop || true; \\
		fi; \\
	done
	@echo "[STOP-ALL] All services stopped"

# Alias for convenience
.PHONY: stop
stop: stop-all
"""
            updated_content = content.rstrip() + '\n' + stop_all_target + '\n'
            main_makefile.write_text(updated_content)
            print(f"  ✅ Added stop-all target to main Makefile")
            success_count += 1
        else:
            print(f"  ℹ️ Stop-all target already exists in main Makefile")
            success_count += 1
        total_count += 1
    
    print(f"\n📊 Added stop targets to {success_count}/{total_count} Makefiles")
    
    return 0 if success_count == total_count else 1

if __name__ == "__main__":
    sys.exit(main())
