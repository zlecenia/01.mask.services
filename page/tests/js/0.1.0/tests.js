// Migracja z: js/components/TestMenuTemplate.js
// Standalone Vue.js tests management page for MaskService
const { createApp, reactive, ref, computed, onMounted } = Vue;

const TestsApp = {
    name: 'TestsApp',
    
    setup() {
        // Reactive state
        const testState = reactive({
            selectedOption: null,
            exportInProgress: false,
            exportFormat: null,
            testData: [],
            
            // Test Wizard state (4-step process)
            wizardActive: false,
            wizardStep: 1,
            wizardData: {
                step1: { deviceType: null, deviceModel: null },
                step2: { testType: null, testStandard: null, pressureRange: null },
                step3: { duration: 300, cycles: 1, tolerance: 5, alerts: true },
                step4: { name: '', description: '', saveAsTemplate: false }
            },
            
            // Custom Scenarios state
            scenariosActive: false,
            customScenarios: [],
            selectedScenario: null,
            
            // Test History state
            historyActive: false,
            testHistory: [],
            historyFilter: 'all',
            
            // Test Templates state
            templatesActive: false,
            testTemplates: [],
            selectedTemplate: null,
            
            error: ''
        });

        // User data from authentication
        const user = ref({
            username: localStorage.getItem('user') || 'Guest',
            role: localStorage.getItem('role') || 'OPERATOR'
        });

        // Test menu options with enhanced features
        const testOptions = computed(() => [
            {
                id: 'wizard',
                icon: '🪄',
                title: 'Kreator Testów',
                description: 'Guided 4-step test creation process',
                color: 'blue',
                advanced: true
            },
            {
                id: 'scenarios',
                icon: '📈',
                title: 'Własne Scenariusze',
                description: 'Manage custom test scenarios',
                color: 'green',
                advanced: true
            },
            {
                id: 'history',
                icon: '📅',
                title: 'Historia Testów',
                description: 'View previous test results',
                color: 'purple',
                advanced: true
            },
            {
                id: 'templates',
                icon: '📋',
                title: 'Szablony Testów',
                description: 'Pre-configured test templates',
                color: 'orange',
                advanced: true
            },
            {
                id: 'device',
                icon: '🛡️',
                title: 'Rodzaj urządzenia',
                description: 'Wybierz rodzaj urządzenia',
                color: 'blue'
            },
            {
                id: 'type',
                icon: '🔧',
                title: 'Typ urządzenia',
                description: 'Wybierz typ urządzenia',
                color: 'green'
            },
            {
                id: 'test',
                icon: '🧪',
                title: 'Rodzaj testu',
                description: 'Wybierz rodzaj testu',
                color: 'purple'
            },
            {
                id: 'flow',
                icon: '🎯',
                title: 'Przepływ testu',
                description: 'Scenariusz testowy',
                color: 'orange'
            }
        ]);

        // Export formats
        const exportFormats = computed(() => [
            {
                id: 'json',
                label: 'JSON',
                icon: '📄',
                color: 'blue',
                description: 'JavaScript Object Notation'
            },
            {
                id: 'xml',
                label: 'XML',
                icon: '📋',
                color: 'green',
                description: 'Extensible Markup Language'
            },
            {
                id: 'csv',
                label: 'CSV',
                icon: '📊',
                color: 'purple',
                description: 'Comma Separated Values'
            },
            {
                id: 'pdf',
                label: 'PDF',
                icon: '📑',
                color: 'red',
                description: 'Portable Document Format'
            }
        ]);

        const pageTitle = computed(() => 'Menu Testów');
        const exportTitle = computed(() => 'Eksport danych testowych');

        // Main methods
        const selectTestOption = async (option) => {
            console.log(`🔶 Vue: Test option selected: ${option.id}`);
            testState.selectedOption = option;
            testState.error = '';
            
            // Handle advanced features
            switch (option.id) {
                case 'wizard':
                    startTestWizard();
                    break;
                case 'scenarios':
                    showCustomScenarios();
                    break;
                case 'history':
                    showTestHistory();
                    break;
                case 'templates':
                    showTestTemplates();
                    break;
                default:
                    // Basic test options - navigate to device selection
                    try {
                        // Try to communicate with backend
                        const response = await fetch(`http://localhost:8103/api/test/start`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                option: option.id,
                                user: user.value.username,
                                role: user.value.role
                            })
                        });
                        
                        if (response.ok) {
                            const result = await response.json();
                            console.log('🔶 Vue: Test started:', result);
                        }
                    } catch (error) {
                        console.log('🔶 Vue: Backend not available, using fallback');
                    }
                    
                    // Navigate to device selection page
                    setTimeout(() => {
                        window.location.href = '/page/devices/js/0.1.0/';
                    }, 500);
                    break;
            }
        };

        // Test Wizard Methods
        const startTestWizard = () => {
            console.log('🪄 Starting Test Wizard (4-step process)');
            testState.wizardActive = true;
            testState.wizardStep = 1;
            resetWizardData();
        };
        
        const resetWizardData = () => {
            testState.wizardData = {
                step1: { deviceType: null, deviceModel: null },
                step2: { testType: null, testStandard: null, pressureRange: null },
                step3: { duration: 300, cycles: 1, tolerance: 5, alerts: true },
                step4: { name: '', description: '', saveAsTemplate: false }
            };
        };
        
        const nextWizardStep = () => {
            if (testState.wizardStep < 4) {
                testState.wizardStep++;
                console.log(`🪄 Test Wizard: Step ${testState.wizardStep}`);
            }
        };
        
        const prevWizardStep = () => {
            if (testState.wizardStep > 1) {
                testState.wizardStep--;
                console.log(`🪄 Test Wizard: Step ${testState.wizardStep}`);
            }
        };
        
        const finishTestWizard = async () => {
            console.log('🪄 Finishing Test Wizard with data:', testState.wizardData);
            
            // Create test configuration
            const testConfig = {
                id: `test_${Date.now()}`,
                name: testState.wizardData.step4.name || 'New Test',
                description: testState.wizardData.step4.description,
                device: testState.wizardData.step1,
                test: testState.wizardData.step2,
                parameters: testState.wizardData.step3,
                created: new Date().toISOString(),
                status: 'configured'
            };
            
            // Save as template if requested
            if (testState.wizardData.step4.saveAsTemplate) {
                testState.testTemplates.push({
                    ...testConfig,
                    isTemplate: true,
                    templateName: testConfig.name
                });
                console.log('📋 Test saved as template');
            }
            
            // Add to history
            testState.testHistory.unshift(testConfig);
            
            // Close wizard
            testState.wizardActive = false;
            
            alert('Test został skonfigurowany pomyślnie!');
        };
        
        const cancelTestWizard = () => {
            testState.wizardActive = false;
            testState.wizardStep = 1;
            resetWizardData();
        };

        // Custom Scenarios Methods
        const showCustomScenarios = () => {
            console.log('📈 Showing Custom Scenarios');
            testState.scenariosActive = true;
            loadCustomScenarios();
        };
        
        const loadCustomScenarios = () => {
            // Mock data for demonstration
            testState.customScenarios = [
                {
                    id: 'sc1',
                    name: 'High Pressure Test',
                    description: 'Test for high pressure environments',
                    steps: ['Init', 'Pressure', 'Hold', 'Release'],
                    duration: 600,
                    created: '2024-01-15'
                },
                {
                    id: 'sc2',
                    name: 'Endurance Test',
                    description: 'Long duration endurance testing',
                    steps: ['Init', 'Cycle', 'Monitor', 'Report'],
                    duration: 3600,
                    created: '2024-01-10'
                }
            ];
        };

        // Test History Methods
        const showTestHistory = () => {
            console.log('📅 Showing Test History');
            testState.historyActive = true;
            loadTestHistory();
        };

        const loadTestHistory = () => {
            // Mock test history data
            testState.testHistory = [
                {
                    id: 'test_001',
                    name: 'Mask Pressure Test',
                    device: 'FFP2 Mask',
                    result: 'PASSED',
                    date: '2024-01-20T10:30:00Z',
                    duration: '00:05:30'
                },
                {
                    id: 'test_002',
                    name: 'Filter Efficiency Test',
                    device: 'FFP3 Filter',
                    result: 'FAILED',
                    date: '2024-01-19T14:15:00Z',
                    duration: '00:08:45'
                }
            ];
        };

        // Test Templates Methods
        const showTestTemplates = () => {
            console.log('📋 Showing Test Templates');
            testState.templatesActive = true;
            loadTestTemplates();
        };

        const loadTestTemplates = () => {
            // Mock template data
            testState.testTemplates = [
                {
                    id: 'tmpl_001',
                    name: 'Standard FFP2 Test',
                    description: 'Standard testing protocol for FFP2 masks',
                    deviceType: 'Respiratory Mask',
                    testType: 'Pressure Test',
                    isTemplate: true
                },
                {
                    id: 'tmpl_002',
                    name: 'Quick Filter Test',
                    description: 'Quick efficiency test for filters',
                    deviceType: 'Filter',
                    testType: 'Efficiency Test',
                    isTemplate: true
                }
            ];
        };

        // Export Methods
        const startExport = (format) => {
            console.log(`📤 Starting export in ${format.id} format`);
            testState.exportInProgress = true;
            testState.exportFormat = format;
            
            // Simulate export process
            setTimeout(() => {
                completeExport();
            }, 2000);
        };

        const completeExport = () => {
            const exportData = {
                testHistory: testState.testHistory,
                testTemplates: testState.testTemplates,
                customScenarios: testState.customScenarios,
                exportDate: new Date().toISOString(),
                format: testState.exportFormat.id
            };
            
            // Create download link
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `maskservice_tests_${new Date().toISOString().split('T')[0]}.${testState.exportFormat.id}`;
            link.click();
            
            URL.revokeObjectURL(url);
            
            testState.exportInProgress = false;
            testState.exportFormat = null;
            
            alert(`Eksport ${testState.exportFormat?.label || 'danych'} zakończony pomyślnie!`);
        };

        const goBack = () => {
            window.location.href = '/page/dashboard/js/0.1.0/';
        };

        const closeModal = () => {
            testState.wizardActive = false;
            testState.scenariosActive = false;
            testState.historyActive = false;
            testState.templatesActive = false;
        };

        // Lifecycle
        onMounted(() => {
            console.log('🔶 Vue: TestsApp component mounted');
            
            // Check authentication
            if (!user.value.username || user.value.username === 'Guest') {
                console.log('🔶 Vue: No authentication found, redirecting to login');
                window.location.href = '/page/login/js/0.1.0/';
                return;
            }
            
            // Load initial data
            loadTestHistory();
            loadTestTemplates();
            loadCustomScenarios();
        });

        return {
            testState,
            user,
            testOptions,
            exportFormats,
            pageTitle,
            exportTitle,
            selectTestOption,
            startTestWizard,
            nextWizardStep,
            prevWizardStep,
            finishTestWizard,
            cancelTestWizard,
            showCustomScenarios,
            showTestHistory,
            showTestTemplates,
            startExport,
            goBack,
            closeModal
        };
    },

    template: `
        <div class="tests-screen">
            <div class="tests-container">
                
                <!-- Header -->
                <div class="tests-header">
                    <button class="back-btn" @click="goBack">← Powrót</button>
                    <h1>{{ pageTitle }}</h1>
                    <div class="user-info">{{ user.username }} ({{ user.role }})</div>
                </div>

                <!-- Error Message -->
                <div v-if="testState.error" class="error-message">
                    {{ testState.error }}
                </div>

                <!-- Test Options Grid -->
                <div class="test-options-grid">
                    <div 
                        v-for="option in testOptions" 
                        :key="option.id"
                        class="test-option"
                        :class="[
                            'color-' + option.color,
                            { advanced: option.advanced, active: testState.selectedOption?.id === option.id }
                        ]"
                        @click="selectTestOption(option)"
                    >
                        <div class="option-icon">{{ option.icon }}</div>
                        <div class="option-content">
                            <h3 class="option-title">{{ option.title }}</h3>
                            <p class="option-description">{{ option.description }}</p>
                        </div>
                        <div v-if="option.advanced" class="advanced-badge">PRO</div>
                    </div>
                </div>

                <!-- Export Section -->
                <div class="export-section">
                    <h2>{{ exportTitle }}</h2>
                    <div class="export-formats">
                        <button 
                            v-for="format in exportFormats"
                            :key="format.id"
                            class="export-btn"
                            :class="'color-' + format.color"
                            @click="startExport(format)"
                            :disabled="testState.exportInProgress"
                        >
                            <span class="format-icon">{{ format.icon }}</span>
                            <span class="format-label">{{ format.label }}</span>
                            <span class="format-desc">{{ format.description }}</span>
                        </button>
                    </div>
                    <div v-if="testState.exportInProgress" class="export-progress">
                        <div class="progress-spinner"></div>
                        <p>Eksportowanie danych w formacie {{ testState.exportFormat?.label }}...</p>
                    </div>
                </div>

                <!-- Test Wizard Modal -->
                <div v-if="testState.wizardActive" class="modal-overlay" @click="closeModal">
                    <div class="modal-content wizard-modal" @click.stop>
                        <div class="modal-header">
                            <h2>🪄 Kreator Testów - Krok {{ testState.wizardStep }}/4</h2>
                            <button class="close-btn" @click="cancelTestWizard">×</button>
                        </div>
                        
                        <!-- Wizard Steps -->
                        <div class="wizard-content">
                            <div class="wizard-progress">
                                <div 
                                    v-for="step in 4" 
                                    :key="step"
                                    class="progress-step"
                                    :class="{ active: step <= testState.wizardStep, current: step === testState.wizardStep }"
                                >
                                    {{ step }}
                                </div>
                            </div>
                            
                            <!-- Step Content would go here -->
                            <div class="step-content">
                                <div v-if="testState.wizardStep === 1">
                                    <h3>Wybierz urządzenie</h3>
                                    <p>Krok 1: Konfiguracja urządzenia testowego</p>
                                    <select v-model="testState.wizardData.step1.deviceType">
                                        <option value="">Wybierz typ urządzenia</option>
                                        <option value="mask">Maska ochronna</option>
                                        <option value="filter">Filtr</option>
                                        <option value="respirator">Respirator</option>
                                    </select>
                                </div>
                                
                                <div v-if="testState.wizardStep === 2">
                                    <h3>Rodzaj testu</h3>
                                    <p>Krok 2: Wybór parametrów testowych</p>
                                    <select v-model="testState.wizardData.step2.testType">
                                        <option value="">Wybierz typ testu</option>
                                        <option value="pressure">Test ciśnieniowy</option>
                                        <option value="efficiency">Test skuteczności</option>
                                        <option value="durability">Test wytrzymałości</option>
                                    </select>
                                </div>
                                
                                <div v-if="testState.wizardStep === 3">
                                    <h3>Parametry testu</h3>
                                    <p>Krok 3: Konfiguracja parametrów</p>
                                    <label>Czas trwania (s): <input type="number" v-model="testState.wizardData.step3.duration" min="1"></label>
                                    <label>Liczba cykli: <input type="number" v-model="testState.wizardData.step3.cycles" min="1"></label>
                                    <label>Tolerancja (%): <input type="number" v-model="testState.wizardData.step3.tolerance" min="0" max="100"></label>
                                    <label><input type="checkbox" v-model="testState.wizardData.step3.alerts"> Włącz alerty</label>
                                </div>
                                
                                <div v-if="testState.wizardStep === 4">
                                    <h3>Podsumowanie</h3>
                                    <p>Krok 4: Zapisz konfigurację testu</p>
                                    <label>Nazwa testu: <input type="text" v-model="testState.wizardData.step4.name" placeholder="Nowy test"></label>
                                    <label>Opis: <textarea v-model="testState.wizardData.step4.description" placeholder="Opis testu"></textarea></label>
                                    <label><input type="checkbox" v-model="testState.wizardData.step4.saveAsTemplate"> Zapisz jako szablon</label>
                                </div>
                            </div>
                        </div>
                        
                        <div class="modal-footer">
                            <button v-if="testState.wizardStep > 1" @click="prevWizardStep" class="btn-secondary">← Poprzedni</button>
                            <button v-if="testState.wizardStep < 4" @click="nextWizardStep" class="btn-primary">Następny →</button>
                            <button v-if="testState.wizardStep === 4" @click="finishTestWizard" class="btn-success">Zakończ test</button>
                        </div>
                    </div>
                </div>

                <!-- Other Modals would be similar... -->
            </div>
        </div>
    `
};

// Mount the application
createApp(TestsApp).mount('#app');
console.log('🔶 Vue TestsApp mounted successfully');
