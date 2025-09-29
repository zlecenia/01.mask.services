/**
 * MaskService System Page - Vue.js 3 Application
 * Migrated from SystemScreen.js component to standalone application
 * Port: 8104 (82** series port assignment)
 */

const { createApp, reactive, computed, onMounted } = Vue;

const SystemApp = {
    setup() {
        // Reactive state
        const systemState = reactive({
            isLoading: true,
            showAnimation: true,
            loadingProgress: 0,
            language: 'pl',
            user: {
                username: localStorage.getItem('username') || 'Demo User',
                role: localStorage.getItem('role') || 'OPERATOR',
                isAuthenticated: localStorage.getItem('token') ? true : false
            },
            systemInfo: {
                name: 'MASKTRONIC C20',
                version: '0.1.0',
                status: 'online',
                modules: ['Authentication', 'Testing', 'Reports', 'Dashboard']
            }
        });

        // Computed properties
        const welcomeText = computed(() => {
            const textMap = {
                pl: 'Witamy w systemie',
                en: 'Welcome to the system',
                de: 'Willkommen im System'
            };
            return textMap[systemState.language] || 'Witamy w systemie';
        });

        const systemName = computed(() => {
            return systemState.systemInfo.name;
        });

        const userRoleText = computed(() => {
            if (systemState.user.isAuthenticated) {
                const roleMap = {
                    pl: {
                        OPERATOR: 'Operator',
                        ADMIN: 'Administrator',
                        SUPERUSER: 'Superuser',
                        SERVICEUSER: 'Serwisant'
                    },
                    en: {
                        OPERATOR: 'Operator',
                        ADMIN: 'Administrator', 
                        SUPERUSER: 'Superuser',
                        SERVICEUSER: 'Service Technician'
                    },
                    de: {
                        OPERATOR: 'Bediener',
                        ADMIN: 'Administrator',
                        SUPERUSER: 'Superuser',
                        SERVICEUSER: 'Servicetechniker'
                    }
                };
                
                const langRoles = roleMap[systemState.language] || roleMap.pl;
                return langRoles[systemState.user.role] || systemState.user.role;
            }
            return '';
        });

        const loadingText = computed(() => {
            if (systemState.loadingProgress < 30) {
                return 'Inicjalizacja systemu...';
            } else if (systemState.loadingProgress < 60) {
                return 'Ładowanie modułów...';
            } else if (systemState.loadingProgress < 90) {
                return 'Sprawdzanie połączeń...';
            } else {
                return 'Prawie gotowe...';
            }
        });

        // Methods
        const startLoadingAnimation = () => {
            systemState.isLoading = true;
            systemState.showAnimation = true;
            systemState.loadingProgress = 0;

            const progressInterval = setInterval(() => {
                systemState.loadingProgress += Math.random() * 15 + 5;
                
                if (systemState.loadingProgress >= 100) {
                    systemState.loadingProgress = 100;
                    clearInterval(progressInterval);
                    
                    // Complete loading after animation
                    setTimeout(() => {
                        systemState.isLoading = false;
                        systemState.showAnimation = false;
                    }, 500);
                }
            }, 150);
        };

        const skipAnimation = () => {
            systemState.isLoading = false;
            systemState.showAnimation = false;
        };

        const navigateToDashboard = () => {
            // Store current user state
            localStorage.setItem('system_ready', 'true');
            
            // Navigate to dashboard
            window.location.href = '../../../dashboard/js/0.1.0/index.html';
        };

        const navigateToLogin = () => {
            // Clear authentication
            localStorage.clear();
            
            // Navigate to login
            window.location.href = '../../../login/js/0.1.0/index.html';
        };

        const checkSystemHealth = async () => {
            try {
                const response = await fetch('/api/system/health');
                const data = await response.json();
                
                systemState.systemInfo.status = data.status;
                systemState.systemInfo.modules = data.modules || systemState.systemInfo.modules;
                
                return data.status === 'online';
            } catch (error) {
                console.warn('System health check failed:', error);
                systemState.systemInfo.status = 'offline';
                return false;
            }
        };

        const restartSystem = async () => {
            systemState.isLoading = true;
            systemState.showAnimation = true;
            systemState.loadingProgress = 0;
            
            try {
                await fetch('/api/system/restart', { method: 'POST' });
                startLoadingAnimation();
            } catch (error) {
                console.error('System restart failed:', error);
                systemState.isLoading = false;
                systemState.showAnimation = false;
            }
        };

        // Lifecycle
        onMounted(() => {
            console.log('🛡️ System page mounted');
            
            // Check system health
            checkSystemHealth();
            
            // Start loading animation after short delay
            setTimeout(() => {
                startLoadingAnimation();
            }, 300);
        });

        return {
            systemState,
            welcomeText,
            systemName,
            userRoleText,
            loadingText,
            startLoadingAnimation,
            skipAnimation,
            navigateToDashboard,
            navigateToLogin,
            checkSystemHealth,
            restartSystem
        };
    },

    template: `
        <div class="system-screen">
            <div class="system-container">
                
                <!-- Loading Animation -->
                <div v-if="systemState.showAnimation" class="system-loading">
                    <div class="system-logo-large">
                        <div class="logo-icon">🛡️</div>
                        <h1 class="system-title">{{ systemName }}</h1>
                        <p class="system-subtitle">System testowania urządzeń ochrony osobistej</p>
                        <div class="vue-badge-large">Vue.js 3</div>
                    </div>
                    
                    <div class="loading-section" v-if="systemState.isLoading">
                        <div class="loading-bar">
                            <div 
                                class="loading-progress" 
                                :style="{ width: systemState.loadingProgress + '%' }"
                            ></div>
                        </div>
                        <p class="loading-text">{{ loadingText }}</p>
                        <p class="loading-progress-text">{{ Math.round(systemState.loadingProgress) }}%</p>
                    </div>
                    
                    <button 
                        v-if="systemState.isLoading" 
                        class="skip-btn"
                        @click="skipAnimation"
                        title="Pomiń animację ładowania"
                    >
                        Pomiń animację
                    </button>
                </div>

                <!-- System Ready Screen -->
                <div v-else class="system-welcome">
                    <div class="welcome-content">
                        <h1 class="welcome-title">{{ welcomeText }}</h1>
                        
                        <div class="system-info">
                            <div class="system-logo">{{ systemName }}</div>
                            <div class="system-version">v{{ systemState.systemInfo.version }}</div>
                            
                            <div v-if="systemState.user.isAuthenticated" class="user-info">
                                <p><strong>Użytkownik:</strong> {{ systemState.user.username }}</p>
                                <p><strong>Rola:</strong> {{ userRoleText }}</p>
                            </div>
                            <div v-else class="user-info">
                                <p><em>Brak uwierzytelnienia</em></p>
                            </div>
                        </div>
                        
                        <div class="system-status">
                            <div class="status-item">
                                <span 
                                    class="status-dot" 
                                    :class="{ 'online': systemState.systemInfo.status === 'online', 'offline': systemState.systemInfo.status !== 'online' }"
                                ></span>
                                <span>System {{ systemState.systemInfo.status === 'online' ? 'gotowy' : 'offline' }}</span>
                            </div>
                            <div class="status-item">
                                <span class="status-dot online"></span>
                                <span>Vue.js aktywny</span>
                            </div>
                        </div>

                        <div class="modules-status">
                            <h3>Załadowane moduły:</h3>
                            <div class="modules-grid">
                                <div 
                                    v-for="module in systemState.systemInfo.modules" 
                                    :key="module"
                                    class="module-item"
                                >
                                    <span class="module-icon">✅</span>
                                    <span>{{ module }}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="action-buttons">
                            <button 
                                v-if="systemState.user.isAuthenticated"
                                class="continue-btn primary"
                                @click="navigateToDashboard"
                            >
                                Kontynuuj do Dashboard →
                            </button>
                            <button 
                                v-else
                                class="continue-btn primary"
                                @click="navigateToLogin"
                            >
                                Przejdź do logowania →
                            </button>
                            
                            <button 
                                class="continue-btn secondary"
                                @click="restartSystem"
                                title="Restart systemu"
                            >
                                🔄 Restart systemu
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
};

// Create and mount the Vue application
const app = createApp(SystemApp);
app.mount('#app');

console.log('🛡️ MaskService System page loaded successfully');
