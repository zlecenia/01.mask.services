#!/usr/bin/env python3

"""
Fix browser errors in all components:
1. Remove CSS link from index.html (CSS is injected by injectStyles())
2. Remove ES6 export and add direct Vue mounting
"""

import os
import sys
from pathlib import Path
import re

PAGE_NAMES = ['login', 'dashboard', 'tests', 'system', 'devices', 'reports', 'service', 'settings', 'workshop']

def fix_index_html(page_name):
    """Remove CSS link from index.html"""
    index_path = Path(f"/home/tom/github/zlecenia/01.mask.services/page/{page_name}/js/0.1.0/index.html")
    
    if not index_path.exists():
        print(f"  ⚠️ index.html not found for {page_name}")
        return False
    
    content = index_path.read_text()
    
    # Remove CSS link
    content = re.sub(r'\s*<link rel="stylesheet" href="[^"]+\.css">\s*', '\n', content)
    
    index_path.write_text(content)
    print(f"  ✅ Removed CSS link from {page_name}/index.html")
    return True

def fix_js_export(page_name):
    """Remove ES6 export and add direct Vue mounting"""
    js_path = Path(f"/home/tom/github/zlecenia/01.mask.services/page/{page_name}/js/0.1.0/{page_name}.js")
    
    if not js_path.exists():
        print(f"  ⚠️ {page_name}.js not found")
        return False
    
    content = js_path.read_text()
    
    # Check if ES6 export exists
    if 'export default' not in content:
        print(f"  ℹ️  No ES6 export in {page_name}.js")
        return True
    
    # Replace ES6 export with Vue mounting
    # Find the component name from export statement
    export_match = re.search(r'export default (\w+);', content)
    if not export_match:
        print(f"  ⚠️ Could not find export statement in {page_name}.js")
        return False
    
    component_name = export_match.group(1)
    
    # Replace export with Vue mounting
    new_ending = f"""// Mount Vue app directly (no ES6 export needed)
if (typeof window !== 'undefined' && typeof Vue !== 'undefined') {{
    const {{ createApp }} = Vue;
    createApp({component_name}).mount('#app');
}}"""
    
    content = re.sub(
        r'// Export component\s*export default \w+;',
        new_ending,
        content
    )
    
    js_path.write_text(content)
    print(f"  ✅ Fixed ES6 export in {page_name}.js (mounting {component_name})")
    return True

def main():
    """Fix browser errors in all components"""
    print("🚀 Fixing Browser Errors in All Components")
    print("=" * 60)
    print("Fixes:")
    print("• Remove CSS links from index.html")
    print("• Remove ES6 exports from JS files")
    print("• Add direct Vue mounting")
    print("=" * 60)
    
    success_count = 0
    
    for page_name in PAGE_NAMES:
        print(f"\n🔧 Fixing {page_name}...")
        
        try:
            html_fixed = fix_index_html(page_name)
            js_fixed = fix_js_export(page_name)
            
            if html_fixed and js_fixed:
                success_count += 1
        except Exception as e:
            print(f"  ❌ Error: {e}")
    
    print(f"\n📊 Fixed components: {success_count}/{len(PAGE_NAMES)}")
    
    print("\n✅ Ready for testing without browser errors!")
    print("Run: make test-docker-all")
    
    return 0 if success_count == len(PAGE_NAMES) else 1

if __name__ == "__main__":
    sys.exit(main())
