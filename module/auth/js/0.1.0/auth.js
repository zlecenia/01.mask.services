// Authentication Module
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
