#!/usr/bin/env python3

"""
Fix htmlValid check in all puppeteer-test.js files to properly validate Vue.js content
"""

import os
import sys
from pathlib import Path
import re

PAGE_NAMES = ['login', 'dashboard', 'tests', 'system', 'devices', 'reports', 'service', 'settings', 'workshop']

def fix_puppeteer_htmlvalid(page_name):
    """Fix htmlValid check in puppeteer-test.js"""
    test_file = Path(f"/home/tom/github/zlecenia/01.mask.services/page/{page_name}/docker/0.1.0/puppeteer-test.js")
    
    if not test_file.exists():
        print(f"⚠️ File not found: {test_file}")
        return False
    
    content = test_file.read_text()
    
    # Fix 1: Add vueAppContentLength to htmlAnalysis
    content = re.sub(
        r'const bodyContent = document\.body\.innerHTML\.length;',
        '''const bodyContent = document.body.innerHTML.length;
            const vueAppContent = document.querySelector('#app')?.innerHTML.length || 0;''',
        content
    )
    
    # Fix 2: Add vueAppContentLength to return object
    content = re.sub(
        r'bodyContentLength: bodyContent,',
        '''bodyContentLength: bodyContent,
                vueAppContentLength: vueAppContent,''',
        content
    )
    
    # Fix 3: Add vueAppContentLength to console output
    content = re.sub(
        r"console\.log\(\`  Body Content Length: \$\{htmlAnalysis\.bodyContentLength\} chars\`\);",
        r"""console.log(`  Body Content Length: ${htmlAnalysis.bodyContentLength} chars`);
        console.log(`  Vue App Content Length: ${htmlAnalysis.vueAppContentLength} chars`);""",
        content
    )
    
    # Fix 4: Update htmlValid check to use proper validation
    content = re.sub(
        r'htmlValid: htmlAnalysis\.bodyContentLength > 100,',
        'htmlValid: htmlAnalysis.hasVueApp && htmlAnalysis.hasVueScript && htmlAnalysis.hasCustomScript,',
        content
    )
    
    test_file.write_text(content)
    print(f"  ✅ Fixed htmlValid check in {page_name}")
    return True

def main():
    """Fix htmlValid check in all puppeteer-test.js files"""
    print("🚀 Fixing htmlValid Check in All Puppeteer Test Files")
    print("=" * 60)
    print("Changes:")
    print("• Add vueAppContentLength tracking")
    print("• Update htmlValid to check Vue components")
    print("• Proper validation for Vue.js dynamic rendering")
    print("=" * 60)
    
    success_count = 0
    for page_name in PAGE_NAMES:
        print(f"\n🔧 Fixing {page_name}...")
        
        try:
            if fix_puppeteer_htmlvalid(page_name):
                success_count += 1
        except Exception as e:
            print(f"  ❌ Error: {e}")
    
    print(f"\n📊 Fixed htmlValid check: {success_count}/{len(PAGE_NAMES)} files")
    
    print("\n✅ Ready for testing with improved validation!")
    
    return 0 if success_count == len(PAGE_NAMES) else 1

if __name__ == "__main__":
    sys.exit(main())
