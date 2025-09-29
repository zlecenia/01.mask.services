# Auth Module

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
