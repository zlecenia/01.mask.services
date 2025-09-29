/**
 * MASKSERVICE C20 1001 - AppHeader Component 0.1.1
 * Components.md v2.0 Contract Compliant
 * 
 * UI Layout Component - System Header with Device Status, Branding & Navigation
 * Optimized for 7.9" Industrial Touch Displays (1280x400 landscape)
 * 
 * @version 0.1.1
 * @contractVersion 2.0
 * @created 2024-12-19
 * @refactored 2024-12-19 - Full v2.0 contract compliance
 */

// Vue 3 Global Pattern (CDN compatible)
const { createApp, reactive, computed, onMounted, inject } = Vue || window.Vue || {};

/**
 * AppHeader Component Metadata
 * Components.md v2.0 compliant metadata structure
 */
const metadata = {
  // Basic Component Info
  name: 'appHeader',
  version: '0.1.1',
  contractVersion: '2.0',
  displayName: 'App Header',
  description: 'System header component with device status, branding, notifications, and navigation for MASKSERVICE C20 1001',
  
  // Component Classification
  type: 'layout',
  category: 'ui-component',
  tags: ['header', 'layout', 'system-info', 'navigation', 'branding'],
  
  // Technical Specifications
  dependencies: {
    vue: '^3.0.0',
    runtime: 'browser'
  },
  
  // Features & Capabilities
  features: [
    'system-branding',
    'device-status-display', 
    'system-info-panel',
    'notification-center',
    'language-selector',
    'user-info-display',
    'touch-optimizations',
    '7.9-inch-display-optimized'
  ],
  
  // Display Optimization
  displayOptimization: {
    targetSize: '7.9-inch',
    resolution: '1280x400',
    orientation: 'landscape',
    touchOptimized: true,
    compactMode: true
  },
  
  // Performance Characteristics
  performance: {
    loadTime: 'immediate',
    renderTime: '<100ms',
    memoryUsage: 'low',
    cpuUsage: 'minimal'
  },
  
  // State & Lifecycle
  initialized: false,
  loaded: false,
  renderCount: 0,
  lastUpdate: null
};

/**
 * AppHeader Component State
 * Reactive state management for header component
 */
const componentState = reactive({
  // Component Status
  isInitialized: false,
  isLoaded: false,
  isRendered: false,
  hasError: false,
  errorMessage: null,
  
  // Configuration
  config: null,
  
  // Header Content State
  systemInfo: {
    companyName: 'MASKSERVICE',
    systemName: 'C20 1001',
    version: '3.0.0'
  },
  
  // Device Status State
  deviceStatus: 'OFFLINE', // ONLINE, OFFLINE, ERROR, MAINTENANCE
  deviceInfo: {
    name: 'CONNECT',
    type: '500',
    url: 'c201001.mask.services',
    lastConnection: null,
    connectionQuality: 'unknown'
  },
  
  // User & Session State
  currentUser: null,
  currentRole: null,
  sessionInfo: {
    startTime: null,
    lastActivity: null,
    timeRemaining: null
  },
  
  // UI State
  currentLanguage: 'pl',
  theme: 'industrial-dark',
  notificationCount: 0,
  notifications: [],
  
  // Performance Metrics
  renderTime: 0,
  lastRenderTime: null,
  updateCount: 0
});

/**
 * AppHeader Action Handlers
 * Comprehensive action handling system for header operations
 */
const actionHandlers = {
  /**
   * Get component status and state
   */
  'GET_STATUS': () => {
    return {
      success: true,
      data: {
        componentName: metadata.name,
        version: metadata.version,
        contractVersion: metadata.contractVersion,
        status: componentState.isInitialized ? 'ready' : 'not-initialized',
        isInitialized: componentState.isInitialized,
        isLoaded: componentState.isLoaded,
        isRendered: componentState.isRendered,
        hasError: componentState.hasError,
        errorMessage: componentState.errorMessage,
        deviceStatus: componentState.deviceStatus,
        currentLanguage: componentState.currentLanguage,
        renderCount: metadata.renderCount,
        lastUpdate: metadata.lastUpdate
      },
      timestamp: new Date().toISOString()
    };
  },

  /**
   * Get component metadata
   */
  'GET_METADATA': () => {
    return {
      success: true,
      data: { ...metadata },
      timestamp: new Date().toISOString()
    };
  },

  /**
   * Update device status
   */
  'UPDATE_DEVICE_STATUS': (data) => {
    const { status, deviceInfo = {} } = data;
    
    if (!['ONLINE', 'OFFLINE', 'ERROR', 'MAINTENANCE'].includes(status)) {
      return {
        success: false,
        error: 'Invalid device status. Must be: ONLINE, OFFLINE, ERROR, MAINTENANCE',
        timestamp: new Date().toISOString()
      };
    }
    
    componentState.deviceStatus = status;
    Object.assign(componentState.deviceInfo, deviceInfo);
    componentState.deviceInfo.lastConnection = status === 'ONLINE' ? new Date().toISOString() : componentState.deviceInfo.lastConnection;
    
    return {
      success: true,
      data: {
        deviceStatus: componentState.deviceStatus,
        deviceInfo: componentState.deviceInfo
      },
      timestamp: new Date().toISOString()
    };
  },

  /**
   * Update system information
   */
  'UPDATE_SYSTEM_INFO': (data) => {
    const { companyName, systemName, version } = data;
    
    if (companyName) componentState.systemInfo.companyName = companyName;
    if (systemName) componentState.systemInfo.systemName = systemName;
    if (version) componentState.systemInfo.version = version;
    
    return {
      success: true,
      data: { ...componentState.systemInfo },
      timestamp: new Date().toISOString()
    };
  },

  /**
   * Change language
   */
  'CHANGE_LANGUAGE': (data) => {
    const { language } = data;
    
    if (!['pl', 'en', 'de'].includes(language)) {
      return {
        success: false,
        error: 'Unsupported language. Supported: pl, en, de',
        timestamp: new Date().toISOString()
      };
    }
    
    componentState.currentLanguage = language;
    
    return {
      success: true,
      data: {
        currentLanguage: componentState.currentLanguage,
        message: `Language changed to ${language}`
      },
      timestamp: new Date().toISOString()
    };
  },

  /**
   * Update user information
   */
  'UPDATE_USER_INFO': (data) => {
    const { user, role, sessionInfo = {} } = data;
    
    componentState.currentUser = user;
    componentState.currentRole = role;
    Object.assign(componentState.sessionInfo, sessionInfo);
    
    return {
      success: true,
      data: {
        currentUser: componentState.currentUser,
        currentRole: componentState.currentRole,
        sessionInfo: componentState.sessionInfo
      },
      timestamp: new Date().toISOString()
    };
  },

  /**
   * Add notification
   */
  'ADD_NOTIFICATION': (data) => {
    const { type = 'info', message, duration = 5000 } = data;
    
    const notification = {
      id: Date.now(),
      type,
      message,
      timestamp: new Date().toISOString(),
      duration
    };
    
    componentState.notifications.push(notification);
    componentState.notificationCount = componentState.notifications.length;
    
    // Auto-remove notification after duration
    if (duration > 0) {
      setTimeout(() => {
        const index = componentState.notifications.findIndex(n => n.id === notification.id);
        if (index > -1) {
          componentState.notifications.splice(index, 1);
          componentState.notificationCount = componentState.notifications.length;
        }
      }, duration);
    }
    
    return {
      success: true,
      data: notification,
      timestamp: new Date().toISOString()
    };
  },

  /**
   * Clear all notifications
   */
  'CLEAR_NOTIFICATIONS': () => {
    componentState.notifications = [];
    componentState.notificationCount = 0;
    
    return {
      success: true,
      data: {
        message: 'All notifications cleared',
        notificationCount: 0
      },
      timestamp: new Date().toISOString()
    };
  },

  /**
   * Update theme
   */
  'UPDATE_THEME': (data) => {
    const { theme } = data;
    
    const validThemes = ['industrial-dark', 'industrial-light', 'high-contrast'];
    if (!validThemes.includes(theme)) {
      return {
        success: false,
        error: `Invalid theme. Valid themes: ${validThemes.join(', ')}`,
        timestamp: new Date().toISOString()
      };
    }
    
    componentState.theme = theme;
    
    return {
      success: true,
      data: {
        theme: componentState.theme,
        message: `Theme changed to ${theme}`
      },
      timestamp: new Date().toISOString()
    };
  },

  /**
   * Get performance metrics
   */
  'GET_PERFORMANCE_METRICS': () => {
    return {
      success: true,
      data: {
        renderTime: componentState.renderTime,
        lastRenderTime: componentState.lastRenderTime,
        updateCount: componentState.updateCount,
        renderCount: metadata.renderCount,
        memoryUsage: metadata.performance.memoryUsage,
        averageRenderTime: componentState.renderTime || 0
      },
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * AppHeader Component Main Export
 * Components.md v2.0 Contract Implementation
 */
const appHeaderComponent = {
  // Component Metadata
  metadata,
  
  /**
   * Initialize Component
   * @param {Object} context - Initialization context
   * @returns {Promise<{success: boolean, message?: string, error?: string}>}
   */
  async init(context = {}) {
    try {
      const startTime = performance.now();
      
      // Load configuration
      const configResult = await this.loadConfig();
      if (!configResult.success) {
        console.warn('AppHeader: Using default configuration due to config load failure');
      }
      
      // Initialize component state
      componentState.isInitialized = true;
      componentState.hasError = false;
      componentState.errorMessage = null;
      
      // Update metadata
      metadata.initialized = true;
      metadata.lastUpdate = new Date().toISOString();
      
      const duration = performance.now() - startTime;
      
      return {
        success: true,
        message: `AppHeader 0.1.1 initialized successfully in ${duration.toFixed(2)}ms`,
        data: {
          version: metadata.version,
          contractVersion: metadata.contractVersion,
          initializationTime: duration,
          configLoaded: configResult.success
        },
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      componentState.isInitialized = false;
      componentState.hasError = true;
      componentState.errorMessage = error.message;
      
      return {
        success: false,
        error: `AppHeader initialization failed: ${error.message}`,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Handle Component Actions
   * @param {Object} request - Action request
   * @returns {Object} Action result
   */
  async handle(request = {}) {
    try {
      const { action = 'GET_STATUS', data = {} } = request;
      
      // Validate action
      if (!actionHandlers[action]) {
        return {
          success: false,
          error: `Unknown action: ${action}. Available actions: ${Object.keys(actionHandlers).join(', ')}`,
          timestamp: new Date().toISOString()
        };
      }
      
      // Execute action handler
      const result = actionHandlers[action](data);
      
      // Update component metrics
      componentState.updateCount++;
      metadata.lastUpdate = new Date().toISOString();
      
      return result;
      
    } catch (error) {
      return {
        success: false,
        error: `Action handling failed: ${error.message}`,
        action: request.action,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Load Component Resources
   * @returns {Promise<{success: boolean, message?: string, error?: string}>}
   */
  async loadComponent() {
    try {
      const startTime = performance.now();
      
      // Load component styles (if external)
      // For now, styles are embedded in the render method
      
      componentState.isLoaded = true;
      const duration = performance.now() - startTime;
      
      return {
        success: true,
        message: `AppHeader component loaded in ${duration.toFixed(2)}ms`,
        loadTime: duration,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      componentState.isLoaded = false;
      return {
        success: false,
        error: `Component loading failed: ${error.message}`,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Load Component Configuration
   * @returns {Promise<{success: boolean, config?: Object, error?: string}>}
   */
  async loadConfig() {
    try {
      // Try to load external configuration
      const configModule = await import('./component.config.js').catch(() => null);
      
      if (configModule && configModule.default) {
        componentState.config = configModule.default;
        return {
          success: true,
          config: componentState.config,
          message: 'Configuration loaded from component.config.js',
          timestamp: new Date().toISOString()
        };
      }
      
      // Fallback to default configuration
      componentState.config = getDefaultConfiguration();
      return {
        success: true,
        config: componentState.config,
        message: 'Using default configuration (component.config.js not found)',
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      componentState.config = getDefaultConfiguration();
      return {
        success: false,
        config: componentState.config,
        error: `Configuration loading failed: ${error.message}. Using defaults.`,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Run Component Smoke Tests
   * @returns {Promise<{success: boolean, results: Array}>}
   */
  async runSmokeTests() {
    try {
      const smokeTestModule = await import('./appHeader.smoke.js').catch(() => null);
      
      if (smokeTestModule && smokeTestModule.runSmokeTests) {
        return await smokeTestModule.runSmokeTests();
      }
      
      // Fallback basic tests
      return await runBasicSmokeTests();
      
    } catch (error) {
      return {
        success: false,
        error: `Smoke tests failed: ${error.message}`,
        results: [],
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Render Component
   * @param {string} containerId - Target container ID
   * @param {Object} context - Render context
   * @returns {Promise<{success: boolean, message?: string, error?: string}>}
   */
  async render(containerId, context = {}) {
    try {
      const startTime = performance.now();
      
      const container = document.getElementById(containerId);
      if (!container) {
        throw new Error(`Container element '${containerId}' not found`);
      }
      
      // Ensure component is initialized
      if (!componentState.isInitialized) {
        await this.init(context);
      }
      
      // Create Vue app instance
      const app = createApp({
        setup() {
          return {
            ...componentState,
            config: componentState.config || getDefaultConfiguration(),
            
            // Computed properties
            statusColor: computed(() => {
              switch (componentState.deviceStatus) {
                case 'ONLINE': return '#4CAF50';
                case 'OFFLINE': return '#f44336';
                case 'ERROR': return '#FF5722';
                case 'MAINTENANCE': return '#FF9800';
                default: return '#757575';
              }
            }),
            
            statusText: computed(() => {
              const lang = componentState.currentLanguage;
              const status = componentState.deviceStatus;
              
              const translations = {
                pl: {
                  ONLINE: 'ONLINE',
                  OFFLINE: 'OFFLINE', 
                  ERROR: 'BŁĄD',
                  MAINTENANCE: 'KONSERWACJA'
                },
                en: {
                  ONLINE: 'ONLINE',
                  OFFLINE: 'OFFLINE',
                  ERROR: 'ERROR', 
                  MAINTENANCE: 'MAINTENANCE'
                },
                de: {
                  ONLINE: 'ONLINE',
                  OFFLINE: 'OFFLINE',
                  ERROR: 'FEHLER',
                  MAINTENANCE: 'WARTUNG'
                }
              };
              
              return translations[lang]?.[status] || status;
            }),
            
            // Methods
            changeLanguage(lang) {
              appHeaderComponent.handle({
                action: 'CHANGE_LANGUAGE',
                data: { language: lang }
              });
            },
            
            formatTime(timestamp) {
              if (!timestamp) return '--:--';
              return new Date(timestamp).toLocaleTimeString(componentState.currentLanguage);
            }
          };
        },
        
        template: `
          <div class="app-header" :class="'theme-' + theme">
            <!-- System Branding Section -->
            <div class="header-brand">
              <div class="company-logo">
                <span class="logo-text">{{ systemInfo.companyName }}</span>
              </div>
              <div class="system-info">
                <div class="system-name">{{ systemInfo.systemName }}</div>
                <div class="system-version">v{{ systemInfo.version }}</div>
              </div>
            </div>
            
            <!-- Device Status Section -->
            <div class="header-device-status">
              <div class="device-indicator">
                <div class="status-dot" :style="{ backgroundColor: statusColor }"></div>
                <span class="status-text">{{ statusText }}</span>
              </div>
              <div class="device-info">
                <div class="device-name">{{ deviceInfo.name }}</div>
                <div class="device-details">{{ deviceInfo.type }} | {{ deviceInfo.url }}</div>
              </div>
            </div>
            
            <!-- User & Session Section -->
            <div class="header-user-section" v-if="currentUser">
              <div class="user-info">
                <div class="user-name">{{ currentUser }}</div>
                <div class="user-role">{{ currentRole }}</div>
              </div>
              <div class="session-info" v-if="sessionInfo.startTime">
                <div class="session-time">{{ formatTime(sessionInfo.startTime) }}</div>
              </div>
            </div>
            
            <!-- Controls Section -->
            <div class="header-controls">
              <!-- Notifications -->
              <div class="notification-center" v-if="notificationCount > 0">
                <div class="notification-badge">{{ notificationCount }}</div>
                <div class="notification-icon">🔔</div>
              </div>
              
              <!-- Language Selector -->
              <div class="language-selector">
                <select v-model="currentLanguage" @change="changeLanguage(currentLanguage)" class="lang-select">
                  <option value="pl">PL</option>
                  <option value="en">EN</option>
                  <option value="de">DE</option>
                </select>
              </div>
            </div>
          </div>
        `,
        
        mounted() {
          componentState.isRendered = true;
          metadata.renderCount++;
          
          const duration = performance.now() - startTime;
          componentState.renderTime = duration;
          componentState.lastRenderTime = new Date().toISOString();
        }
      });
      
      app.mount(container);
      
      const duration = performance.now() - startTime;
      
      return {
        success: true,
        message: `AppHeader rendered successfully in ${duration.toFixed(2)}ms`,
        containerId,
        renderTime: duration,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      return {
        success: false,
        error: `Render failed: ${error.message}`,
        containerId,
        timestamp: new Date().toISOString()
      };
    }
  }
};

/**
 * Default Configuration Generator
 * Fallback configuration if external config fails to load
 */
function getDefaultConfiguration() {
  return {
    metadata: {
      name: 'appHeader',
      version: '0.1.1',
      contractVersion: '2.0'
    },
    
    ui: {
      theme: 'industrial-dark',
      showNotifications: true,
      showLanguageSelector: true,
      showUserInfo: true,
      compactMode: true
    },
    
    branding: {
      companyName: 'MASKSERVICE',
      systemName: 'C20 1001',
      showLogo: true,
      showVersion: true
    },
    
    deviceStatus: {
      showIndicator: true,
      showDetails: true,
      updateInterval: 5000
    },
    
    performance: {
      maxRenderTime: 100,
      enableMetrics: true
    }
  };
}

/**
 * Basic Smoke Tests Runner
 * Fallback if external smoke tests not available
 */
async function runBasicSmokeTests() {
  const results = [];
  const startTime = performance.now();
  
  try {
    // Test 1: Component existence
    results.push({
      name: 'Component Existence',
      passed: typeof appHeaderComponent === 'object',
      duration: 0,
      details: 'AppHeader component object exists'
    });
    
    // Test 2: Contract methods
    const requiredMethods = ['init', 'handle', 'loadComponent', 'loadConfig', 'runSmokeTests', 'render'];
    const availableMethods = requiredMethods.filter(method => typeof appHeaderComponent[method] === 'function');
    
    results.push({
      name: 'Contract v2.0 Methods',
      passed: availableMethods.length === requiredMethods.length,
      duration: 0,
      details: `${availableMethods.length}/${requiredMethods.length} methods available`
    });
    
    // Test 3: Metadata structure
    results.push({
      name: 'Metadata Structure',
      passed: appHeaderComponent.metadata && appHeaderComponent.metadata.name === 'appHeader',
      duration: 0,
      details: 'Component metadata structure is valid'
    });
    
    const totalDuration = performance.now() - startTime;
    const passedTests = results.filter(r => r.passed).length;
    
    return {
      success: passedTests === results.length,
      totalTests: results.length,
      passedTests,
      failedTests: results.length - passedTests,
      duration: totalDuration,
      results,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    return {
      success: false,
      error: `Basic smoke tests failed: ${error.message}`,
      results,
      timestamp: new Date().toISOString()
    };
  }
}

// Export the component
export default appHeaderComponent;
