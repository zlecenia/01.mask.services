// Migracja z: js/components/UserMenuScreen.js
// Standalone Vue.js dashboard page for MaskService
const { createApp, reactive, ref, computed, onMounted } = Vue;

const DashboardApp = {
    name: 'DashboardApp',
    
    setup() {
        // Reactive state
        const dashboardState = reactive({
            isLoading: true,
            currentView: 'menu',
            selectedMenuItem: null,
            error: ''
        });

        // User data from authentication
        const user = ref({
            username: localStorage.getItem('user') || 'Guest',
            role: localStorage.getItem('role') || 'OPERATOR'
        });

        // Menu configuration based on role
        const menuConfigs = {
            OPERATOR: [
                { id: 'test_menu', icon: '🧪', label: 'Test Menu', description: 'Rozpocznij testy urządzeń', path: '/page/tests/js/0.1.0/' },
                { id: 'device_select', icon: '🛡️', label: 'Device Selection', description: 'Wybierz urządzenie do testów', path: '/page/devices/js/0.1.0/' },
                { id: 'user_data', icon: '👤', label: 'User Data', description: 'Dane użytkownika', path: '/page/settings/js/0.1.0/' },
                { id: 'device_data', icon: '📊', label: 'Device Data', description: 'Dane urządzenia', path: '/page/devices/js/0.1.0/' },
                { id: 'test_reports', icon: '📋', label: 'Test Reports', description: 'Raporty testów', path: '/page/reports/js/0.1.0/' },
                { id: 'realtime_sensors', icon: '📡', label: 'Real-time Sensors', description: 'Czujniki w czasie rzeczywistym', path: '/page/devices/js/0.1.0/' },
                { id: 'device_history', icon: '📈', label: 'Device History', description: 'Historia urządzenia', path: '/page/devices/js/0.1.0/' }
            ],
            ADMIN: [
                { id: 'test_menu', icon: '🧪', label: 'Test Menu', description: 'Zarządzanie testami', path: '/page/tests/js/0.1.0/' },
                { id: 'user_data', icon: '👤', label: 'User Data', description: 'Dane użytkownika', path: '/page/settings/js/0.1.0/' },
                { id: 'users', icon: '👥', label: 'Users Management', description: 'Zarządzanie użytkownikami', path: '/page/settings/js/0.1.0/' },
                { id: 'reports_view', icon: '📊', label: 'Reports View', description: 'Przeglądanie raportów', path: '/page/reports/js/0.1.0/' },
                { id: 'reports_batch', icon: '📋', label: 'Batch Reports', description: 'Raporty zbiorcze', path: '/page/reports/js/0.1.0/' },
                { id: 'reports_schedule', icon: '⏰', label: 'Reports Schedule', description: 'Harmonogram raportów', path: '/page/reports/js/0.1.0/' },
                { id: 'device_history', icon: '📈', label: 'Device History', description: 'Historia urządzeń', path: '/page/devices/js/0.1.0/' },
                { id: 'workshop', icon: '🔧', label: 'Workshop', description: 'Warsztat serwisowy', path: '/page/workshop/js/0.1.0/' },
                { id: 'settings_system', icon: '⚙️', label: 'System Settings', description: 'Ustawienia systemu', path: '/page/system/js/0.1.0/' }
            ],
            SUPERUSER: [
                { id: 'test_menu', icon: '🧪', label: 'Test Menu', description: 'Kompletne zarządzanie testami', path: '/page/tests/js/0.1.0/' },
                { id: 'user_data', icon: '👤', label: 'User Data', description: 'Dane użytkownika', path: '/page/settings/js/0.1.0/' },
                { id: 'users', icon: '👥', label: 'Users Management', description: 'Zarządzanie wszystkimi użytkownikami', path: '/page/settings/js/0.1.0/' },
                { id: 'reports_view', icon: '📊', label: 'Reports View', description: 'Wszystkie raporty', path: '/page/reports/js/0.1.0/' },
                { id: 'reports_batch', icon: '📋', label: 'Batch Reports', description: 'Raporty zbiorcze', path: '/page/reports/js/0.1.0/' },
                { id: 'reports_schedule', icon: '⏰', label: 'Reports Schedule', description: 'Zaawansowany harmonogram', path: '/page/reports/js/0.1.0/' },
                { id: 'device_history', icon: '📈', label: 'Device History', description: 'Pełna historia urządzeń', path: '/page/devices/js/0.1.0/' },
                { id: 'workshop', icon: '🔧', label: 'Workshop', description: 'Zarządzanie warsztatem', path: '/page/workshop/js/0.1.0/' },
                { id: 'settings_system', icon: '⚙️', label: 'System Settings', description: 'Zaawansowane ustawienia', path: '/page/system/js/0.1.0/' },
                { id: 'settings_integration', icon: '🔗', label: 'Integrations', description: 'Integracje zewnętrzne', path: '/page/system/js/0.1.0/' },
                { id: 'settings_standards', icon: '📏', label: 'Standards', description: 'Standardy i normy', path: '/page/system/js/0.1.0/' },
                { id: 'settings_scenarios', icon: '🎯', label: 'Scenarios', description: 'Scenariusze testowe', path: '/page/system/js/0.1.0/' },
                { id: 'service_menu', icon: '🛠️', label: 'Service Menu', description: 'Menu serwisowe', path: '/page/service/js/0.1.0/' },
                { id: 'advanced_diagnostics', icon: '🔍', label: 'Advanced Diagnostics', description: 'Zaawansowana diagnostyka', path: '/page/system/js/0.1.0/' }
            ],
            SERVICEUSER: [
                { id: 'test_menu', icon: '🧪', label: 'Test Menu', description: 'Menu testów serwisowych', path: '/page/tests/js/0.1.0/' },
                { id: 'user_data', icon: '👤', label: 'User Data', description: 'Dane serviceusera', path: '/page/settings/js/0.1.0/' },
                { id: 'device_data', icon: '📊', label: 'Device Data', description: 'Dane urządzenia', path: '/page/devices/js/0.1.0/' },
                { id: 'test_reports', icon: '📋', label: 'Test Reports', description: 'Raporty serwisowe', path: '/page/reports/js/0.1.0/' },
                { id: 'realtime_sensors', icon: '📡', label: 'Real-time Sensors', description: 'Monitoring czujników', path: '/page/devices/js/0.1.0/' },
                { id: 'device_history', icon: '📈', label: 'Device History', description: 'Historia serwisowania', path: '/page/devices/js/0.1.0/' },
                { id: 'workshop_parts', icon: '🔩', label: 'Workshop Parts', description: 'Części zamienne', path: '/page/workshop/js/0.1.0/' },
                { id: 'workshop_maintenance', icon: '🔧', label: 'Maintenance', description: 'Harmonogram konserwacji', path: '/page/workshop/js/0.1.0/' },
                { id: 'workshop_tools', icon: '🛠️', label: 'Tools', description: 'Narzędzia serwisowe', path: '/page/workshop/js/0.1.0/' },
                { id: 'workshop_inventory', icon: '📦', label: 'Inventory', description: 'Inwentarz warsztatowy', path: '/page/workshop/js/0.1.0/' },
                { id: 'service_menu', icon: '⚙️', label: 'Service Menu', description: 'Menu serwisowe', path: '/page/service/js/0.1.0/' },
                { id: 'advanced_diagnostics', icon: '🔍', label: 'Advanced Diagnostics', description: 'Diagnostyka zaawansowana', path: '/page/system/js/0.1.0/' }
            ]
        };

        // Computed properties
        const currentMenu = computed(() => {
            return menuConfigs[user.value.role] || menuConfigs.OPERATOR;
        });
        
        const userRoleText = computed(() => {
            const roleMap = {
                OPERATOR: 'Operator',
                ADMIN: 'Administrator',
                SUPERUSER: 'Superuser',
                SERVICEUSER: 'Serwisant'
            };
            return roleMap[user.value.role] || user.value.role;
        });

        const welcomeText = computed(() => {
            return `Witaj, ${user.value.username}`;
        });

        // Methods
        const selectMenuItem = async (menuItem) => {
            console.log(`🔶 Vue: Menu item selected: ${menuItem.id}`);
            dashboardState.selectedMenuItem = menuItem;
            
            try {
                // Navigate to the selected page
                window.location.href = menuItem.path;
            } catch (error) {
                console.error(`🔶 Vue: Navigation failed for ${menuItem.id}:`, error);
                dashboardState.error = `Navigation failed: ${error.message}`;
            }
        };

        const handleLogout = () => {
            console.log('🔶 Vue: Logout initiated');
            
            // Clear authentication data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('role');
            
            // Navigate back to login
            window.location.href = '/page/login/js/0.1.0/';
        };

        const refreshMenu = () => {
            console.log('🔶 Vue: Menu refresh initiated');
            dashboardState.isLoading = true;
            dashboardState.error = '';
            
            setTimeout(() => {
                dashboardState.isLoading = false;
            }, 500);
        };

        const loadMenuData = async () => {
            try {
                // Try to load menu data from API
                const response = await fetch(`http://localhost:8102/api/menu?role=${user.value.role}`);
                if (response.ok) {
                    const apiMenu = await response.json();
                    console.log('🔶 Vue: Menu data loaded from API', apiMenu);
                }
            } catch (error) {
                console.log('🔶 Vue: Using default menu (API not available)');
            }
        };

        // Lifecycle
        onMounted(async () => {
            console.log('🔶 Vue: DashboardApp component mounted');
            console.log(`🔶 Vue: Menu loaded for role: ${user.value.role} (${currentMenu.value.length} items)`);
            
            // Check if user is authenticated
            if (!user.value.username || user.value.username === 'Guest') {
                console.log('🔶 Vue: No authentication found, redirecting to login');
                window.location.href = '/page/login/js/0.1.0/';
                return;
            }
            
            // Load menu data
            await loadMenuData();
            
            // Finish loading
            setTimeout(() => {
                dashboardState.isLoading = false;
            }, 300);
        });

        return {
            dashboardState,
            user,
            currentMenu,
            userRoleText,
            welcomeText,
            selectMenuItem,
            handleLogout,
            refreshMenu
        };
    },

    template: `
        <div class="dashboard-screen">
            <div class="dashboard-container">
                
                <!-- Dashboard Header -->
                <div class="dashboard-header">
                    <div class="header-content">
                        <h1 class="welcome-text">{{ welcomeText }}</h1>
                        <div class="user-badge">
                            <span class="role-badge" :class="'role-' + (user.role || 'guest').toLowerCase()">
                                {{ userRoleText }}
                            </span>
                            <span class="vue-indicator">Vue</span>
                        </div>
                    </div>
                    
                    <div class="header-actions">
                        <button class="refresh-btn" @click="refreshMenu" :disabled="dashboardState.isLoading">
                            {{ dashboardState.isLoading ? '⏳' : '🔄' }}
                        </button>
                        <button class="logout-btn" @click="handleLogout">
                            🚪 Wyloguj
                        </button>
                    </div>
                </div>

                <!-- Error Message -->
                <div v-if="dashboardState.error" class="error-message">
                    {{ dashboardState.error }}
                </div>

                <!-- Loading State -->
                <div v-if="dashboardState.isLoading" class="dashboard-loading">
                    <div class="loading-spinner"></div>
                    <p>Ładowanie menu...</p>
                </div>

                <!-- Menu Grid -->
                <div v-else class="menu-layout">
                    <div class="menu-grid">
                        <div 
                            v-for="menuItem in currentMenu" 
                            :key="menuItem.id"
                            class="menu-item"
                            :class="{ active: dashboardState.selectedMenuItem?.id === menuItem.id }"
                            @click="selectMenuItem(menuItem)"
                        >
                            <div class="menu-icon">{{ menuItem.icon }}</div>
                            <div class="menu-content">
                                <h3 class="menu-title">{{ menuItem.label }}</h3>
                                <p class="menu-description">{{ menuItem.description }}</p>
                            </div>
                            <div class="menu-arrow">→</div>
                        </div>
                    </div>
                    
                    <!-- Menu Stats -->
                    <div class="menu-stats">
                        <p>{{ currentMenu.length }} opcji dostępnych dla roli {{ userRoleText }}</p>
                        <p class="version-info">Dashboard v0.1.0 | Vue.js Component</p>
                    </div>
                </div>
            </div>
        </div>
    `
};

// Mount the application
createApp(DashboardApp).mount('#app');
console.log('🔶 Vue DashboardApp mounted successfully');
