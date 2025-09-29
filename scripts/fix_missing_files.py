#!/usr/bin/env python3
"""
Fix missing files in migrated components
Creates index.html files and missing module files
"""

import os
from pathlib import Path

def create_index_html(page_name, page_path):
    """Create index.html for a page"""
    index_content = f'''<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{page_name.title()} - MaskService</title>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <link rel="stylesheet" href="{page_name}.css">
</head>
<body>
    <div id="app"></div>
    <script src="{page_name}.js"></script>
</body>
</html>'''
    
    index_path = f"{page_path}/js/0.1.0/index.html"
    with open(index_path, "w") as f:
        f.write(index_content)
    print(f"✅ Created: {index_path}")

def create_module_css(module_name, module_path):
    """Create CSS file for a module"""
    css_content = f'''/* {module_name.title()} Module Styles */
.{module_name}-container {{
    /* Add your {module_name} styles here */
}}

.{module_name}-item {{
    /* Add your {module_name} item styles here */
}}
'''
    
    css_path = f"{module_path}/js/0.1.0/{module_name}.css"
    with open(css_path, "w") as f:
        f.write(css_content)
    print(f"✅ Created: {css_path}")

def create_auth_module():
    """Create the missing auth module"""
    auth_path = "/home/tom/github/zlecenia/01.mask.services/module/auth"
    
    # Create directory structure
    os.makedirs(f"{auth_path}/js/0.1.0", exist_ok=True)
    os.makedirs(f"{auth_path}/py/0.1.0", exist_ok=True)
    
    # Create auth.js
    auth_js_content = '''// Authentication Module
const AuthModule = {
    name: 'AuthModule',
    
    // Check if user is authenticated
    isAuthenticated() {
        return localStorage.getItem('token') !== null;
    },
    
    // Get current user
    getCurrentUser() {
        return {
            username: localStorage.getItem('user'),
            role: localStorage.getItem('role'),
            token: localStorage.getItem('token')
        };
    },
    
    // Logout user
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        window.location.href = 'http://127.0.0.1:8201/';
    },
    
    // Check if user has required role
    hasRole(requiredRole) {
        const userRole = localStorage.getItem('role');
        const roleHierarchy = {
            'OPERATOR': 1,
            'ADMIN': 2,
            'SUPERUSER': 3
        };
        
        return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
    }
};

// Export for use in other components
window.AuthModule = AuthModule;
'''
    
    with open(f"{auth_path}/js/0.1.0/auth.js", "w") as f:
        f.write(auth_js_content)
    
    # Create auth.css
    auth_css_content = '''/* Authentication Module Styles */
.auth-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
}

.auth-status {
    background: #f0f0f0;
    padding: 10px;
    border-radius: 5px;
    margin: 10px 0;
}

.auth-user-info {
    display: flex;
    align-items: center;
    gap: 10px;
}

.auth-logout-btn {
    background: #dc3545;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
}

.auth-logout-btn:hover {
    background: #c82333;
}
'''
    
    with open(f"{auth_path}/js/0.1.0/auth.css", "w") as f:
        f.write(auth_css_content)
    
    # Create package.json
    package_json_content = '''{
  "name": "@maskservice/auth-module",
  "version": "0.1.0",
  "description": "MaskService authentication module",
  "main": "auth.js",
  "scripts": {
    "test": "echo 'Auth module tests not implemented yet'",
    "build": "echo 'Build complete'"
  }
}'''
    
    with open(f"{auth_path}/js/0.1.0/package.json", "w") as f:
        f.write(package_json_content)
    
    # Create Makefile
    makefile_content = '''# Makefile for module/auth
COMPONENT_NAME := auth
COMPONENT_TYPE := module
VERSION := 0.1.0

.PHONY: help build test clean install

help: ## Show help
\t@echo "Available targets for module/auth:"
\t@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-15s %s\\n", $$1, $$2}'

install: ## Install dependencies
\tcd js/$(VERSION) && npm install

build: ## Build component
\t@echo "Building auth module..."

test: ## Run tests
\t@echo "Testing auth module..."
\tcd js/$(VERSION) && npm test

clean: ## Clean build artifacts
\trm -rf js/$(VERSION)/node_modules
'''
    
    with open(f"{auth_path}/Makefile", "w") as f:
        f.write(makefile_content)
    
    # Create README.md
    readme_content = '''# Auth Module

## Overview
MaskService authentication module providing user authentication utilities.

## Structure
```
module/auth/
├── js/0.1.0/           # Frontend authentication utilities
│   ├── auth.js         # Main authentication module
│   ├── auth.css        # Authentication styles
│   └── package.json    # Package configuration
└── Makefile            # Build automation
```

## Usage

### Include in your page
```html
<script src="/module/auth/js/0.1.0/auth.js"></script>
<link rel="stylesheet" href="/module/auth/js/0.1.0/auth.css">
```

### Use in JavaScript
```javascript
// Check authentication
if (AuthModule.isAuthenticated()) {
    const user = AuthModule.getCurrentUser();
    console.log(`Logged in as: ${user.username} (${user.role})`);
}

// Check role permissions
if (AuthModule.hasRole('ADMIN')) {
    // Show admin features
}

// Logout
AuthModule.logout();
```

## API

- `isAuthenticated()` - Check if user is logged in
- `getCurrentUser()` - Get current user info
- `hasRole(role)` - Check if user has required role
- `logout()` - Log out current user
'''
    
    with open(f"{auth_path}/README.md", "w") as f:
        f.write(readme_content)
    
    print("✅ Created complete auth module")

def fix_all_missing_files():
    """Fix all missing files identified in validation"""
    base_path = "/home/tom/github/zlecenia/01.mask.services"
    
    # Pages missing index.html
    pages_needing_index = ["devices", "reports", "service", "settings", "workshop"]
    
    for page in pages_needing_index:
        page_path = f"{base_path}/page/{page}"
        if os.path.exists(page_path):
            create_index_html(page, page_path)
    
    # Modules missing CSS files
    modules_needing_css = ["footer", "header", "menu"]
    
    for module in modules_needing_css:
        module_path = f"{base_path}/module/{module}"
        if os.path.exists(module_path):
            create_module_css(module, module_path)
    
    # Create auth module
    create_auth_module()
    
    print("\n🎯 All missing files have been created!")

if __name__ == "__main__":
    fix_all_missing_files()
