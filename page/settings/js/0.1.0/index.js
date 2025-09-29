/**
 * UserData Module - FeatureRegistry Integration
 * Migrated from UserDataTemplate.js
 * Provides comprehensive user profile management with session tracking and permissions
 */

class UserDataModule {
    constructor() {
        this.name = 'userData';
        this.version = '0.1.0';
        this.description = 'User profile management with editing, session tracking, and data export';
        this.component = null;
        this.config = null;
        this.isInitialized = false;
    }

    // Module metadata for FeatureRegistry
    getMetadata() {
        return {
            name: this.name,
            version: this.version,
            description: this.description,
            author: '1001.mask.services Team',
            category: 'user-management',
            tags: ['profile', 'session', 'permissions', 'export'],
            dependencies: ['vue'],
            contractVersion: '2.0'
        };
    }

    // Initialize module with configuration
    async init(options = {}) {
        try {
            console.log(`🔶 Initializing ${this.name} module v${this.version}`);
            
            // Load configuration
            this.config = await this.loadConfig();
            
            // Apply any initialization options
            if (options.user) {
                this.config.user = { ...this.config.user, ...options.user };
            }
            
            if (options.language) {
                this.config.language = options.language;
            }

            this.isInitialized = true;
            console.log(`✅ ${this.name} module initialized successfully`);
            
            return true;
        } catch (error) {
            console.error(`❌ Failed to initialize ${this.name} module:`, error);
            throw error;
        }
    }

    // Load Vue component
    async loadComponent() {
        if (!this.isInitialized) {
            throw new Error('Module must be initialized before loading component');
        }

        try {
            // Import the Vue component
            const componentModule = await import('./userData.js');
            this.component = componentModule.default || componentModule.UserDataComponent;
            
            console.log(`✅ ${this.name} component loaded`);
            return this.component;
        } catch (error) {
            console.error(`❌ Failed to load ${this.name} component:`, error);
            throw error;
        }
    }

    // Load configuration from JSON files
    async loadConfig() {
        try {
            const [schema, data, crud] = await Promise.all([
                import('./config/schema.json', { assert: { type: 'json' } }),
                import('./config/data.json', { assert: { type: 'json' } }),
                import('./config/crud.json', { assert: { type: 'json' } })
            ]);

            return {
                schema: schema.default,
                data: data.default,
                crud: crud.default,
                user: data.default.user,
                session: data.default.session,
                permissions: data.default.permissions,
                language: data.default.language || 'pl'
            };
        } catch (error) {
            console.error(`❌ Failed to load ${this.name} config:`, error);
            // Fallback configuration
            return {
                schema: {},
                data: {
                    user: { username: null, role: null, isAuthenticated: false },
                    session: { loginTime: null, lastActivity: null, sessionDuration: 0 },
                    permissions: [],
                    language: 'pl'
                },
                crud: {},
                user: { username: null, role: null, isAuthenticated: false },
                session: { loginTime: null, lastActivity: null, sessionDuration: 0 },
                permissions: [],
                language: 'pl'
            };
        }
    }

    // Handle module actions
    async handle(action, data = {}) {
        console.log(`🔶 ${this.name} handling action: ${action}`, data);

        switch (action) {
            case 'update-user-profile':
                return await this.updateUserProfile(data);
            case 'export-user-data':
                return await this.exportUserData(data);
            case 'get-user-permissions':
                return this.getUserPermissions(data);
            case 'track-session':
                return this.trackSession(data);
            case 'user-role-changed':
                return this.handleRoleChange(data);
            case 'language-changed':
                return this.handleLanguageChange(data);
            default:
                console.warn(`⚠️ Unknown action: ${action}`);
                return { success: false, error: 'Unknown action' };
        }
    }

    // Update user profile data
    async updateUserProfile(data) {
        try {
            console.log('🔶 Updating user profile:', data);
            
            // Validate data against schema if available
            if (this.config.schema.user) {
                // Add validation logic here
            }

            // Check CRUD permissions
            const canEdit = this.config.crud?.user?.update?.enabled && 
                          this.hasPermission(data.currentUser?.role, this.config.crud.user.update.requiredRoles);
            
            if (!canEdit) {
                throw new Error('Insufficient permissions to update user profile');
            }

            // Simulate API call or update local storage
            const updatedUser = {
                ...this.config.user,
                ...data.updates,
                lastUpdated: new Date().toISOString()
            };

            // Store in localStorage for persistence
            localStorage.setItem(`userData_${updatedUser.username}`, JSON.stringify(updatedUser));

            // Update module config
            this.config.user = updatedUser;

            console.log('✅ User profile updated successfully');
            return { 
                success: true, 
                user: updatedUser,
                message: 'Profile updated successfully'
            };
        } catch (error) {
            console.error('❌ Failed to update user profile:', error);
            return { 
                success: false, 
                error: error.message 
            };
        }
    }

    // Export user data
    async exportUserData(data) {
        try {
            console.log('🔶 Exporting user data');
            
            const userData = {
                user: this.config.user,
                session: this.config.session,
                permissions: this.getUserPermissions(data),
                exportTime: new Date().toISOString(),
                version: this.version
            };

            return { 
                success: true, 
                data: userData,
                filename: `user-data-${this.config.user.username}-${Date.now()}.json`
            };
        } catch (error) {
            console.error('❌ Failed to export user data:', error);
            return { 
                success: false, 
                error: error.message 
            };
        }
    }

    // Get user permissions based on role
    getUserPermissions(data) {
        const role = data.user?.role || this.config.user?.role;
        const permissionMap = {
            OPERATOR: ['read_devices', 'run_tests', 'view_reports'],
            ADMIN: ['read_devices', 'run_tests', 'view_reports', 'manage_users', 'system_settings'],
            SUPERUSER: ['read_devices', 'run_tests', 'view_reports', 'manage_users', 'system_settings', 'advanced_config', 'integrations'],
            SERWISANT: ['read_devices', 'run_tests', 'view_reports', 'service_mode', 'diagnostics', 'calibration']
        };
        
        return permissionMap[role] || [];
    }

    // Track session activity
    trackSession(data) {
        try {
            const sessionData = {
                lastActivity: new Date(),
                sessionDuration: (this.config.session?.sessionDuration || 0) + 1
            };

            this.config.session = { ...this.config.session, ...sessionData };
            
            return { success: true, session: this.config.session };
        } catch (error) {
            console.error('❌ Failed to track session:', error);
            return { success: false, error: error.message };
        }
    }

    // Handle role changes
    handleRoleChange(data) {
        try {
            console.log('🔶 User role changed:', data);
            
            if (data.user && data.newRole) {
                this.config.user.role = data.newRole;
                this.config.permissions = this.getUserPermissions(data);
            }

            return { success: true, permissions: this.config.permissions };
        } catch (error) {
            console.error('❌ Failed to handle role change:', error);
            return { success: false, error: error.message };
        }
    }

    // Handle language changes
    handleLanguageChange(data) {
        try {
            console.log('🔶 Language changed:', data);
            
            if (data.language) {
                this.config.language = data.language;
            }

            return { success: true, language: this.config.language };
        } catch (error) {
            console.error('❌ Failed to handle language change:', error);
            return { success: false, error: error.message };
        }
    }

    // Helper method to check permissions
    hasPermission(userRole, requiredRoles) {
        if (!requiredRoles || requiredRoles.length === 0) return true;
        return requiredRoles.includes(userRole);
    }

    // Get module configuration
    getConfig() {
        return this.config;
    }

    // Update module configuration
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        return this.config;
    }
}

// Export module instance (not factory) for FeatureRegistry
const userDataModule = new UserDataModule();
export default userDataModule;

// Also export for CommonJS compatibility if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = userDataModule;
}
