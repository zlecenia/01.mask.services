// Migracja z: js/components/LoginScreen.js
// Standalone Vue.js login page for MaskService
const { createApp, reactive, ref, computed, onMounted } = Vue;

const LoginApp = {
    name: 'LoginApp',
    
    setup() {
        // Reactive state
        const loginState = reactive({
            password: '',
            showPassword: false,
            isLoading: false,
            selectedRole: null,
            showKeyboard: false,
            error: ''
        });

        // Available roles for login
        const availableRoles = ref([
            { key: 'OPERATOR', label: 'Operator', color: 'blue' },
            { key: 'ADMIN', label: 'Administrator', color: 'green' },
            { key: 'SUPERUSER', label: 'Superuser', color: 'purple' },
            { key: 'SERVICEUSER', label: 'Serwisant', color: 'orange' }
        ]);

        // Computed properties
        const loginButtonText = computed(() => {
            return loginState.isLoading ? 'Logowanie...' : 'Zaloguj';
        });

        // Methods
        const togglePasswordVisibility = () => {
            loginState.showPassword = !loginState.showPassword;
            console.log('🔶 Vue: Password visibility toggled');
        };

        const selectRole = (role) => {
            loginState.selectedRole = role;
            loginState.error = '';
            console.log(`🔶 Vue: Role selected: ${role.key}`);
        };

        const toggleKeyboard = () => {
            loginState.showKeyboard = !loginState.showKeyboard;
            console.log('🔶 Vue: Virtual keyboard toggled');
        };

        const handleLogin = async () => {
            if (!loginState.selectedRole) {
                loginState.error = 'Wybierz rolę użytkownika';
                return;
            }

            loginState.isLoading = true;
            loginState.error = '';
            console.log(`🔶 Vue: Attempting login as ${loginState.selectedRole.key}`);

            try {
                // Simulate authentication with backend
                const response = await fetch('http://localhost:8001/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        role: loginState.selectedRole.key,
                        password: loginState.password || 'default'
                    })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    
                    // Store authentication data
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', data.username);
                    localStorage.setItem('role', data.role);
                    
                    // Navigate to dashboard
                    window.location.href = '/page/dashboard/js/0.1.0/';
                } else {
                    const errorData = await response.json();
                    loginState.error = errorData.detail || 'Błąd logowania';
                }
                
            } catch (error) {
                console.error('🔶 Vue: Login error:', error);
                loginState.error = 'Błąd połączenia z serwerem';
                
                // Fallback for development without backend
                if (error.message.includes('fetch')) {
                    console.log('🔶 Vue: Using fallback authentication');
                    localStorage.setItem('user', loginState.selectedRole.key.toLowerCase());
                    localStorage.setItem('role', loginState.selectedRole.key);
                    window.location.href = '/page/dashboard/js/0.1.0/';
                }
            } finally {
                loginState.isLoading = false;
            }
        };

        const handleScannerLogin = () => {
            console.log('🔶 Vue: Scanner login initiated');
            alert('Scanner login - coming soon!');
        };

        const handleKeywordLogin = () => {
            console.log('🔶 Vue: Keyword login initiated');
            alert('Keyword login - coming soon!');
        };

        // Lifecycle
        onMounted(() => {
            console.log('🔶 Vue: LoginApp component mounted');
            
            // Focus on password input if role is selected
            const passwordInput = document.querySelector('#vue-password-input');
            if (passwordInput) {
                passwordInput.focus();
            }
        });

        return {
            loginState,
            availableRoles,
            loginButtonText,
            togglePasswordVisibility,
            selectRole,
            toggleKeyboard,
            handleLogin,
            handleScannerLogin,
            handleKeywordLogin
        };
    },

    template: `
        <div class="login-screen">
            <div class="login-container">
                <!-- Header -->
                <div class="login-header">
                    <h1>MASKTRONIC C20 <span class="vue-badge">Vue</span></h1>
                    <p>System testowania urządzeń ochrony osobistej</p>
                </div>

                <!-- Login Methods -->
                <div class="login-methods">
                    <button class="login-method-btn scanner-btn" @click="handleScannerLogin">
                        <i class="icon-scanner">📱</i>
                        <span>Scanner</span>
                    </button>
                    
                    <button class="login-method-btn keyword-btn" @click="handleKeywordLogin">
                        <i class="icon-keyboard">⌨️</i>
                        <span>Keyword</span>
                    </button>
                </div>

                <!-- Role Selection -->
                <div class="role-selection">
                    <h3>Wybierz rolę:</h3>
                    <div class="role-buttons">
                        <button 
                            v-for="role in availableRoles" 
                            :key="role.key"
                            class="role-btn"
                            :class="[
                                'role-' + role.color,
                                { active: loginState.selectedRole?.key === role.key }
                            ]"
                            @click="selectRole(role)"
                        >
                            Login as {{ role.label }}
                        </button>
                    </div>
                </div>

                <!-- Password Input -->
                <div class="password-section" v-if="loginState.selectedRole">
                    <div class="password-input-group">
                        <input 
                            id="vue-password-input"
                            v-model="loginState.password"
                            :type="loginState.showPassword ? 'text' : 'password'"
                            placeholder="Hasło (opcjonalne)"
                            class="password-input"
                            @keyup.enter="handleLogin"
                        />
                        <button 
                            class="password-toggle"
                            @click="togglePasswordVisibility"
                            type="button"
                        >
                            {{ loginState.showPassword ? '🙈' : '👁️' }}
                        </button>
                    </div>
                    
                    <button 
                        class="keyboard-toggle-btn"
                        @click="toggleKeyboard"
                        :class="{ active: loginState.showKeyboard }"
                    >
                        {{ loginState.showKeyboard ? 'Ukryj klawiaturę' : 'Użyj klawiatury' }}
                    </button>
                </div>

                <!-- Error Message -->
                <div v-if="loginState.error" class="error-message">
                    {{ loginState.error }}
                </div>

                <!-- Login Button -->
                <div class="login-action" v-if="loginState.selectedRole">
                    <button 
                        class="login-btn"
                        :class="{ loading: loginState.isLoading }"
                        @click="handleLogin"
                        :disabled="loginState.isLoading"
                    >
                        {{ loginButtonText }}
                    </button>
                </div>

                <!-- Footer -->
                <div class="login-footer">
                    <p>🔶 Vue.js Component Active</p>
                    <p>Version 0.1.0 | {{ new Date().getFullYear() }}</p>
                </div>
            </div>
        </div>
    `
};

// Mount the application
createApp(LoginApp).mount('#app');
console.log('🔶 Vue LoginApp mounted successfully');
