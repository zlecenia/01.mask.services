/**
 * MASKSERVICE C20 1001 - AppHeader Component Configuration 0.1.1
 * Unified Configuration System - Components.md v2.0 Compliant
 * 
 * Comprehensive configuration for system header component covering:
 * - System branding and company information
 * - Device status display and monitoring
 * - User session and role management
 * - Notification system and alerts
 * - Multi-language support and internationalization
 * - 7.9" industrial display optimizations
 * - UI themes and visual customization
 * - Performance and accessibility settings
 * 
 * @version 0.1.1
 * @contractVersion 2.0
 * @created 2024-12-19
 * @optimizedFor 7.9-inch industrial touch displays (1280x400 landscape)
 */

export default {
  // ========================================
  // 1. METADATA SECTION
  // ========================================
  metadata: {
    name: 'appHeader',
    version: '0.1.1',
    contractVersion: '2.0',
    displayName: 'App Header Component',
    description: 'System header with branding, device status, notifications and user interface for MASKSERVICE C20 1001',
    category: 'layout',
    type: 'ui-component',
    
    // Component Classification
    tags: [
      'header', 
      'layout', 
      'system-info', 
      'branding', 
      'navigation', 
      'device-status',
      'notifications',
      '7.9-inch-optimized'
    ],
    
    // Compatibility & Dependencies
    compatibilityLevel: 'high',
    dependencies: {
      vue: '^3.0.0',
      runtime: 'browser'
    },
    
    // Timestamps
    created: '2024-12-19T09:59:18+02:00',
    lastModified: '2024-12-19T09:59:18+02:00',
    configVersion: '1.0.0'
  },

  // ========================================
  // 2. UI CONFIGURATION SECTION
  // ========================================
  ui: {
    // Theme Configuration
    theme: {
      default: 'industrial-dark',
      available: [
        'industrial-dark',
        'industrial-light', 
        'high-contrast',
        'maintenance-mode'
      ],
      
      // Color Schemes
      colors: {
        'industrial-dark': {
          primary: '#667eea',
          secondary: '#764ba2',
          background: '#1a1a1a',
          surface: '#2d2d2d',
          text: '#ffffff',
          textSecondary: '#cccccc',
          border: '#404040',
          success: '#4CAF50',
          warning: '#FF9800',
          error: '#f44336',
          info: '#2196F3'
        },
        'industrial-light': {
          primary: '#3f51b5',
          secondary: '#9c27b0',
          background: '#f5f5f5',
          surface: '#ffffff',
          text: '#333333',
          textSecondary: '#666666',
          border: '#e0e0e0',
          success: '#4CAF50',
          warning: '#FF9800',
          error: '#f44336',
          info: '#2196F3'
        },
        'high-contrast': {
          primary: '#ffffff',
          secondary: '#ffff00',
          background: '#000000',
          surface: '#000000',
          text: '#ffffff',
          textSecondary: '#ffffff',
          border: '#ffffff',
          success: '#00ff00',
          warning: '#ffff00',
          error: '#ff0000',
          info: '#00ffff'
        }
      }
    },
    
    // Layout Configuration
    layout: {
      height: '60px', // Header height for 7.9" display
      padding: '0 15px',
      gap: '20px',
      
      // Section Widths (for 1280px display)
      sections: {
        branding: '300px',     // Company logo + system name
        deviceStatus: '400px', // Device status + info
        userSection: '250px',  // User info + session
        controls: '200px'      // Notifications + language
      },
      
      // Responsive Breakpoints
      breakpoints: {
        compact: '1024px',     // Compact mode for smaller screens
        mobile: '768px',       // Mobile layout
        tiny: '480px'          // Minimal layout
      }
    },
    
    // Typography
    typography: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      sizes: {
        brand: '18px',         // Company name
        system: '14px',        // System name
        status: '13px',        // Status text
        details: '11px',       // Details and info
        controls: '12px'       // Controls and buttons
      },
      weights: {
        brand: '600',
        system: '500',
        status: '500',
        details: '400',
        controls: '400'
      }
    },
    
    // Visual Effects
    effects: {
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      transitions: {
        default: '0.3s ease',
        fast: '0.15s ease',
        slow: '0.5s ease'
      },
      
      // Status Indicator Animation
      statusAnimation: {
        enabled: true,
        duration: '2s',
        type: 'pulse'
      }
    }
  },

  // ========================================
  // 3. BRANDING CONFIGURATION SECTION
  // ========================================
  branding: {
    // Company Information
    company: {
      name: 'MASKSERVICE',
      fullName: 'MASKSERVICE Industrial Solutions',
      displayName: 'MASKSERVICE',
      
      // Logo Configuration
      logo: {
        enabled: true,
        type: 'text', // 'text', 'image', 'icon'
        text: 'MS',   // Short logo text
        url: null,    // Image URL if type is 'image'
        icon: '🏭',   // Icon if type is 'icon'
        size: '24px',
        color: 'primary'
      }
    },
    
    // System Information
    system: {
      name: 'C20 1001',
      fullName: 'MASKSERVICE Control System C20 1001',
      version: '3.0.0',
      build: 'prod-2024.12.19',
      
      // Version Display
      showVersion: true,
      showBuild: false,
      versionFormat: 'v{version}' // Template: {version}, {build}
    },
    
    // Additional Branding Elements
    tagline: {
      enabled: false,
      text: 'Industrial Automation Excellence',
      position: 'below-system' // 'below-company', 'below-system', 'right'
    }
  },

  // ========================================
  // 4. DEVICE STATUS CONFIGURATION SECTION
  // ========================================
  deviceStatus: {
    // Status Display Configuration
    display: {
      enabled: true,
      showIndicator: true,
      showStatusText: true,
      showDeviceInfo: true,
      showConnectionDetails: true,
      
      // Indicator Style
      indicator: {
        type: 'dot', // 'dot', 'bar', 'icon'
        size: '12px',
        position: 'left', // 'left', 'right', 'top'
        animation: true
      }
    },
    
    // Status Definitions
    statuses: {
      ONLINE: {
        color: '#4CAF50',
        text: {
          pl: 'ONLINE',
          en: 'ONLINE', 
          de: 'ONLINE'
        },
        priority: 1,
        icon: '🟢'
      },
      OFFLINE: {
        color: '#f44336',
        text: {
          pl: 'OFFLINE',
          en: 'OFFLINE',
          de: 'OFFLINE'
        },
        priority: 4,
        icon: '🔴'
      },
      ERROR: {
        color: '#FF5722',
        text: {
          pl: 'BŁĄD',
          en: 'ERROR',
          de: 'FEHLER'
        },
        priority: 5,
        icon: '⚠️'
      },
      MAINTENANCE: {
        color: '#FF9800',
        text: {
          pl: 'KONSERWACJA',
          en: 'MAINTENANCE',
          de: 'WARTUNG'
        },
        priority: 3,
        icon: '🔧'
      },
      CONNECTING: {
        color: '#2196F3',
        text: {
          pl: 'ŁĄCZENIE',
          en: 'CONNECTING',
          de: 'VERBINDEN'
        },
        priority: 2,
        icon: '🔄'
      }
    },
    
    // Device Information
    device: {
      defaultName: 'CONNECT',
      defaultType: '500',
      defaultUrl: 'c201001.mask.services',
      
      // Information Display Format
      format: {
        name: '{name}',           // Device name
        type: '{type}',           // Device type
        url: '{url}',             // Connection URL
        combined: '{name} {type}' // Combined format
      }
    },
    
    // Auto-Update Configuration
    autoUpdate: {
      enabled: true,
      interval: 5000,           // 5 seconds
      retryAttempts: 3,
      retryDelay: 2000          // 2 seconds
    }
  },

  // ========================================
  // 5. USER SESSION CONFIGURATION SECTION
  // ========================================
  userSession: {
    // User Information Display
    display: {
      enabled: true,
      showUserName: true,
      showUserRole: true,
      showSessionTime: true,
      showTimeRemaining: false,
      
      // Display Format
      format: {
        userName: '{username}',
        role: '{role}',
        sessionTime: 'HH:mm:ss',
        timeFormat: '24h' // '12h', '24h'
      }
    },
    
    // Role Configuration
    roles: {
      OPERATOR: {
        displayName: {
          pl: 'Operator',
          en: 'Operator',
          de: 'Bediener'
        },
        color: '#4CAF50',
        icon: '👤',
        level: 1
      },
      ADMIN: {
        displayName: {
          pl: 'Administrator',
          en: 'Administrator', 
          de: 'Administrator'
        },
        color: '#2196F3',
        icon: '👨‍💼',
        level: 2
      },
      SUPERUSER: {
        displayName: {
          pl: 'Super Użytkownik',
          en: 'Super User',
          de: 'Super Benutzer'
        },
        color: '#FF9800',
        icon: '👨‍💻',
        level: 3
      },
      SERWISANT: {
        displayName: {
          pl: 'Serwisant',
          en: 'Service Technician',
          de: 'Servicetechniker'
        },
        color: '#9C27B0',
        icon: '🔧',
        level: 4
      }
    },
    
    // Session Management
    session: {
      showStartTime: true,
      showDuration: true,
      showLastActivity: false,
      timeoutWarning: 300000,    // 5 minutes before timeout
      refreshInterval: 60000     // 1 minute
    }
  },

  // ========================================
  // 6. NOTIFICATION SYSTEM SECTION
  // ========================================
  notifications: {
    // Notification Center Configuration
    display: {
      enabled: true,
      showBadge: true,
      showIcon: true,
      maxVisible: 5,
      position: 'header-right', // 'header-left', 'header-right', 'header-center'
      
      // Badge Configuration
      badge: {
        maxCount: 99,
        showZero: false,
        color: '#f44336',
        textColor: '#ffffff'
      }
    },
    
    // Notification Types
    types: {
      info: {
        color: '#2196F3',
        icon: 'ℹ️',
        defaultDuration: 5000,
        sound: false
      },
      success: {
        color: '#4CAF50',
        icon: '✅',
        defaultDuration: 3000,
        sound: false
      },
      warning: {
        color: '#FF9800',
        icon: '⚠️',
        defaultDuration: 7000,
        sound: true
      },
      error: {
        color: '#f44336',
        icon: '❌',
        defaultDuration: 10000,
        sound: true
      },
      system: {
        color: '#9C27B0',
        icon: '🔧',
        defaultDuration: 0, // Persistent
        sound: true
      }
    },
    
    // Auto-Clear Configuration
    autoClear: {
      enabled: true,
      maxAge: 300000,           // 5 minutes
      maxCount: 20,
      clearOnPageReload: false
    }
  },

  // ========================================
  // 7. RESPONSIVE DESIGN SECTION
  // ========================================
  responsive: {
    // 7.9" Industrial Display (Primary Target)
    primary: {
      width: 1280,
      height: 400,
      orientation: 'landscape',
      
      // Header Layout for 7.9"
      header: {
        height: '60px',
        fontSize: '13px',
        padding: '0 15px',
        gap: '20px'
      },
      
      // Touch Optimizations
      touch: {
        minTargetSize: '44px',
        targetSpacing: '8px',
        touchResponse: 'immediate',
        hapticFeedback: true
      }
    },
    
    // Breakpoint Configurations
    breakpoints: {
      // Compact Mode (1024px and below)
      compact: {
        width: 1024,
        changes: {
          'branding.system.showVersion': false,
          'deviceStatus.display.showConnectionDetails': false,
          'userSession.display.showSessionTime': false,
          'ui.layout.gap': '15px'
        }
      },
      
      // Mobile Mode (768px and below) 
      mobile: {
        width: 768,
        changes: {
          'ui.layout.height': '50px',
          'ui.typography.sizes.brand': '16px',
          'ui.typography.sizes.system': '12px',
          'ui.layout.padding': '0 10px',
          'ui.layout.gap': '10px',
          'notifications.display.maxVisible': 3
        }
      },
      
      // Tiny Mode (480px and below)
      tiny: {
        width: 480,
        changes: {
          'branding.company.logo.enabled': false,
          'deviceStatus.display.showDeviceInfo': false,
          'userSession.display.enabled': false,
          'ui.layout.height': '45px'
        }
      }
    }
  },

  // ========================================
  // 8. ACCESSIBILITY SECTION
  // ========================================
  accessibility: {
    // WCAG 2.1 AA Compliance
    wcag: {
      level: 'AA',
      colorContrast: 'enhanced', // 'minimum', 'enhanced'
      keyboardNavigation: true,
      screenReaderSupport: true,
      focusManagement: true
    },
    
    // Keyboard Navigation
    keyboard: {
      enabled: true,
      shortcuts: {
        'Alt+H': 'focus-header',
        'Alt+N': 'focus-notifications',
        'Alt+L': 'focus-language',
        'Alt+U': 'focus-user-menu'
      },
      tabOrder: [
        'company-logo',
        'device-status', 
        'user-info',
        'notifications',
        'language-selector'
      ]
    },
    
    // Screen Reader Support
    screenReader: {
      enabled: true,
      announcements: {
        statusChange: true,
        notificationReceived: true,
        languageChange: true,
        userLogin: true
      },
      
      // ARIA Labels
      ariaLabels: {
        header: 'System header navigation',
        deviceStatus: 'Device connection status',
        notifications: 'System notifications',
        languageSelector: 'Language selection',
        userInfo: 'User account information'
      }
    },
    
    // High Contrast Support
    highContrast: {
      enabled: true,
      autoDetect: true,
      customColors: {
        background: '#000000',
        text: '#ffffff',
        border: '#ffffff',
        focus: '#ffff00'
      }
    },
    
    // Touch Accessibility
    touch: {
      minTargetSize: '48px',      // WCAG AAA recommendation
      targetSpacing: '8px',
      gestureAlternatives: true    // Provide alternatives to gesture-based interactions
    }
  },

  // ========================================
  // 9. PERFORMANCE SECTION
  // ========================================
  performance: {
    // Performance Targets
    targets: {
      initialization: 200,        // Target < 200ms
      firstRender: 100,          // Target < 100ms
      rerender: 50,              // Target < 50ms
      interaction: 16            // Target < 16ms (60fps)
    },
    
    // Performance Optimization
    optimization: {
      lazyLoading: false,        // Header loads immediately
      caching: {
        enabled: true,
        duration: 300000,        // 5 minutes
        storage: 'memory'        // 'memory', 'localStorage', 'sessionStorage'
      },
      
      // DOM Optimization
      dom: {
        virtualScrolling: false,  // Not applicable for header
        batchUpdates: true,
        debounceResize: 150,      // Debounce window resize events
        throttleScroll: 16        // Throttle scroll events to 60fps
      }
    },
    
    // Memory Management
    memory: {
      maxCacheSize: '2MB',
      cleanupInterval: 300000,   // 5 minutes
      autoCleanup: true,
      memoryLeakDetection: true
    },
    
    // Monitoring & Metrics
    monitoring: {
      enabled: true,
      metricsCollection: true,
      performanceObserver: true,
      reportingInterval: 60000   // 1 minute
    }
  },

  // ========================================
  // 10. SECURITY SECTION
  // ========================================
  security: {
    // Input Validation
    validation: {
      enabled: true,
      sanitization: true,
      xssProtection: true,
      
      // User Input Rules
      userInput: {
        maxUsernameLength: 50,
        allowedUsernameChars: /^[a-zA-Z0-9._-]+$/,
        maxDisplayNameLength: 100
      }
    },
    
    // Session Security
    session: {
      validation: true,
      tokenValidation: true,
      roleVerification: true,
      sessionTimeout: 1800000,  // 30 minutes
      
      // Security Headers
      headers: {
        xFrameOptions: 'DENY',
        xContentTypeOptions: 'nosniff',
        contentSecurityPolicy: true
      }
    },
    
    // Audit Logging
    audit: {
      enabled: true,
      logLevel: 'info',
      events: [
        'user-login',
        'user-logout', 
        'role-change',
        'status-change',
        'configuration-change'
      ],
      
      // Log Retention
      retention: {
        duration: 2592000000,    // 30 days
        maxSize: '10MB',
        compression: true
      }
    }
  },

  // ========================================
  // 11. TRANSLATIONS SECTION
  // ========================================
  translations: {
    // Default Language
    defaultLanguage: 'pl',
    fallbackLanguage: 'en',
    
    // Supported Languages
    supportedLanguages: ['pl', 'en', 'de'],
    
    // Translation Keys
    keys: {
      // System Branding
      'branding.company': {
        pl: 'MASKSERVICE',
        en: 'MASKSERVICE',
        de: 'MASKSERVICE'
      },
      'branding.system': {
        pl: 'System C20 1001',
        en: 'System C20 1001',
        de: 'System C20 1001'
      },
      
      // Device Status
      'status.online': {
        pl: 'ONLINE',
        en: 'ONLINE',
        de: 'ONLINE'
      },
      'status.offline': {
        pl: 'OFFLINE',
        en: 'OFFLINE', 
        de: 'OFFLINE'
      },
      'status.error': {
        pl: 'BŁĄD',
        en: 'ERROR',
        de: 'FEHLER'
      },
      'status.maintenance': {
        pl: 'KONSERWACJA',
        en: 'MAINTENANCE',
        de: 'WARTUNG'
      },
      'status.connecting': {
        pl: 'ŁĄCZENIE',
        en: 'CONNECTING',
        de: 'VERBINDEN'
      },
      
      // User Interface
      'ui.notifications': {
        pl: 'Powiadomienia',
        en: 'Notifications',
        de: 'Benachrichtigungen'
      },
      'ui.language': {
        pl: 'Język',
        en: 'Language',
        de: 'Sprache'
      },
      'ui.user': {
        pl: 'Użytkownik',
        en: 'User',
        de: 'Benutzer'
      },
      'ui.session': {
        pl: 'Sesja',
        en: 'Session',
        de: 'Sitzung'
      },
      
      // Time & Date
      'time.format': {
        pl: 'HH:mm:ss',
        en: 'HH:mm:ss',
        de: 'HH:mm:ss'
      },
      'date.format': {
        pl: 'DD.MM.YYYY',
        en: 'MM/DD/YYYY',
        de: 'DD.MM.YYYY'
      },
      
      // Accessibility
      'a11y.header': {
        pl: 'Nagłówek systemu',
        en: 'System header',
        de: 'System-Header'
      },
      'a11y.deviceStatus': {
        pl: 'Status połączenia urządzenia',
        en: 'Device connection status',
        de: 'Gerätestatus'
      },
      'a11y.notifications': {
        pl: 'Powiadomienia systemowe',
        en: 'System notifications',
        de: 'System-Benachrichtigungen'
      }
    }
  },

  // ========================================
  // 12. DEVELOPMENT & TESTING SECTION
  // ========================================
  development: {
    // Debug Configuration
    debug: {
      enabled: false,           // Set to true in development
      logLevel: 'info',         // 'error', 'warn', 'info', 'debug'
      showPerformanceMetrics: false,
      showComponentBounds: false,
      verboseLogging: false
    },
    
    // Testing Configuration
    testing: {
      smokeTests: {
        enabled: true,
        timeout: 10000,         // 10 seconds
        performance: true,
        accessibility: true
      },
      
      // Mock Data for Testing
      mockData: {
        deviceStatus: 'ONLINE',
        deviceInfo: {
          name: 'TEST-DEVICE',
          type: '500',
          url: 'test.mask.services'
        },
        user: {
          username: 'testuser',
          role: 'OPERATOR'
        },
        notifications: [
          {
            type: 'info',
            message: 'Test notification',
            timestamp: new Date().toISOString()
          }
        ]
      }
    },
    
    // Development Tools
    tools: {
      componentInspector: false,
      performanceProfiler: false,
      accessibilityChecker: false,
      hotReload: true
    }
  }
};
