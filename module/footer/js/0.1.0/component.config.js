/**
 * AppFooter Component Configuration v0.1.1
 * Comprehensive Unified Configuration System
 * 
 * MASKSERVICE C20 1001 - Industrial Footer Configuration
 * Optimized for 7.9" landscape touch displays (1280x400)
 * 
 * Configuration Sections:
 * 1. Component Metadata & Classification
 * 2. Footer Layout & UI Configuration
 * 3. System Information Display
 * 4. Version & Build Information
 * 5. User Session & Role Management
 * 6. Connection Status & Monitoring
 * 7. Responsive Design & 7.9" Display
 * 8. Accessibility & WCAG Compliance
 * 9. Performance Monitoring & Targets
 * 10. Security & Validation
 * 11. Multi-Language Support
 * 12. Development & Testing Configuration
 * 
 * @author MASKSERVICE Development Team
 * @version 0.1.1
 * @since 2024-12-19
 */

export default {
  
  // ===== 1. COMPONENT METADATA & CLASSIFICATION =====
  metadata: {
    name: 'appFooter',
    version: '0.1.1',
    type: 'layout',
    category: 'ui-component',
    displayName: 'Application Footer',
    description: 'Industrial application footer with comprehensive system status, version information, and user session management',
    
    // Component classification
    classification: {
      complexity: 'medium',
      criticality: 'high',
      performance: 'optimized',
      accessibility: 'wcag-aa-compliant',
      security: 'validated',
      testing: 'comprehensive'
    },
    
    // Contract compliance
    contract: {
      version: '2.0',
      compliance: '100%',
      methods: 6,
      validation: 'passed'
    },
    
    // Dependencies
    dependencies: {
      vue: '^3.0.0',
      browser: 'modern',
      display: '7.9-inch-industrial',
      touchscreen: 'required'
    }
  },

  // ===== 2. FOOTER LAYOUT & UI CONFIGURATION =====
  ui: {
    // Layout configuration
    layout: {
      type: 'horizontal',
      height: {
        default: 60,
        compact: 40,
        expanded: 80,
        minimum: 35,
        maximum: 120
      },
      
      // Section distribution
      sections: {
        left: {
          name: 'system-info',
          width: '30%',
          minWidth: 200,
          content: ['system-name', 'version', 'build'],
          alignment: 'left',
          priority: 'high'
        },
        center: {
          name: 'status-display',
          width: '40%',
          minWidth: 250,
          content: ['connection-status', 'timestamp', 'uptime'],
          alignment: 'center',
          priority: 'critical'
        },
        right: {
          name: 'user-session',
          width: '30%',
          minWidth: 180,
          content: ['user-info', 'role', 'language'],
          alignment: 'right',
          priority: 'medium'
        }
      },
      
      // Responsive behavior
      responsive: {
        enabled: true,
        breakpoints: {
          compact: 1024,
          mobile: 768,
          tiny: 480
        },
        behavior: {
          compact: 'reduce-spacing',
          mobile: 'stack-sections',
          tiny: 'minimal-display'
        }
      }
    },

    // Theme system
    themes: {
      'industrial-dark': {
        name: 'Industrial Dark',
        background: 'linear-gradient(135deg, #2c3e50, #34495e)',
        text: '#ecf0f1',
        accent: '#3498db',
        success: '#27ae60',
        warning: '#f39c12',
        error: '#e74c3c',
        border: '#34495e',
        shadow: 'rgba(0, 0, 0, 0.3)'
      },
      'industrial-light': {
        name: 'Industrial Light',
        background: 'linear-gradient(135deg, #ecf0f1, #bdc3c7)',
        text: '#2c3e50',
        accent: '#2980b9',
        success: '#229954',
        warning: '#d68910',
        error: '#cb4335',
        border: '#95a5a6',
        shadow: 'rgba(0, 0, 0, 0.1)'
      },
      'high-contrast': {
        name: 'High Contrast',
        background: '#000000',
        text: '#ffffff',
        accent: '#ffff00',
        success: '#00ff00',
        warning: '#ff8800',
        error: '#ff0000',
        border: '#ffffff',
        shadow: 'rgba(255, 255, 255, 0.2)'
      }
    },

    // Typography
    typography: {
      fontFamily: {
        primary: 'Arial, sans-serif',
        monospace: 'Courier New, monospace'
      },
      fontSize: {
        small: '11px',
        normal: '13px',
        medium: '14px',
        large: '16px'
      },
      fontWeight: {
        normal: 400,
        medium: 500,
        bold: 600
      },
      lineHeight: {
        compact: 1.2,
        normal: 1.4,
        relaxed: 1.6
      }
    },

    // Visual effects
    effects: {
      animations: {
        enabled: true,
        duration: {
          fast: '150ms',
          normal: '300ms',
          slow: '500ms'
        },
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      },
      transitions: {
        enabled: true,
        properties: ['background-color', 'color', 'transform', 'opacity'],
        duration: '200ms'
      },
      shadows: {
        enabled: true,
        elevation: {
          low: '0 1px 3px rgba(0, 0, 0, 0.1)',
          medium: '0 2px 6px rgba(0, 0, 0, 0.15)',
          high: '0 4px 12px rgba(0, 0, 0, 0.2)'
        }
      }
    }
  },

  // ===== 3. SYSTEM INFORMATION DISPLAY =====
  systemInfo: {
    // System identification
    system: {
      name: 'MASKSERVICE C20 1001',
      fullName: 'MASKSERVICE C20 1001 Industrial Control System',
      abbreviation: 'MS C20',
      type: 'Industrial Control Unit',
      series: 'C20',
      model: '1001'
    },
    
    // Display configuration
    display: {
      showName: true,
      showType: false,
      showSeries: true,
      format: 'abbreviated', // 'full', 'abbreviated', 'minimal'
      separator: ' ',
      maxLength: 25
    },
    
    // Status indicators
    status: {
      types: {
        operational: { color: '#27ae60', icon: '●', text: 'OPERATIONAL' },
        maintenance: { color: '#f39c12', icon: '⚠', text: 'MAINTENANCE' },
        error: { color: '#e74c3c', icon: '✕', text: 'ERROR' },
        offline: { color: '#95a5a6', icon: '○', text: 'OFFLINE' },
        startup: { color: '#3498db', icon: '↻', text: 'STARTUP' }
      },
      default: 'operational',
      showIcon: true,
      showText: true,
      updateInterval: 5000 // ms
    }
  },

  // ===== 4. VERSION & BUILD INFORMATION =====
  versionInfo: {
    // Version display
    version: {
      current: 'v3.0.0',
      format: 'semantic', // 'semantic', 'numeric', 'custom'
      showPrefix: true,
      prefix: 'v',
      showBuild: true,
      separator: ' | '
    },
    
    // Build information
    build: {
      date: '2024.12.19',
      format: 'YYYY.MM.DD',
      showTime: false,
      environment: 'production', // 'development', 'staging', 'production'
      commit: 'a1b2c3d',
      showCommit: false
    },
    
    // Display options
    display: {
      location: 'left-section',
      priority: 'medium',
      compact: true,
      tooltip: true,
      clickable: false
    },
    
    // Update mechanism
    updates: {
      checkInterval: 300000, // 5 minutes
      showUpdateAvailable: true,
      updateNotification: true,
      autoUpdate: false
    }
  },

  // ===== 5. USER SESSION & ROLE MANAGEMENT =====
  userSession: {
    // Role definitions
    roles: {
      OPERATOR: {
        level: 1,
        name: 'Operator',
        color: '#3498db',
        permissions: ['view', 'operate'],
        displayName: 'OP'
      },
      ADMIN: {
        level: 2,
        name: 'Administrator',
        color: '#27ae60',
        permissions: ['view', 'operate', 'configure'],
        displayName: 'ADMIN'
      },
      SUPERUSER: {
        level: 3,
        name: 'Super User',
        color: '#f39c12',
        permissions: ['view', 'operate', 'configure', 'manage'],
        displayName: 'SUPER'
      },
      SERWISANT: {
        level: 4,
        name: 'Service Technician',
        color: '#e74c3c',
        permissions: ['view', 'operate', 'configure', 'manage', 'service'],
        displayName: 'SRV'
      }
    },
    
    // Session configuration
    session: {
      timeout: 1800000, // 30 minutes in ms
      warningTime: 300000, // 5 minutes before timeout
      renewTime: 600000, // 10 minutes auto-renew
      showTimeRemaining: true,
      showLastActivity: false
    },
    
    // Display settings
    display: {
      showUser: true,
      showRole: true,
      showLevel: false,
      showPermissions: false,
      showSessionTime: false,
      maxUserNameLength: 15,
      format: 'compact' // 'full', 'compact', 'minimal'
    },
    
    // User status indicators
    status: {
      active: { color: '#27ae60', icon: '●' },
      idle: { color: '#f39c12', icon: '◐' },
      inactive: { color: '#95a5a6', icon: '○' },
      locked: { color: '#e74c3c', icon: '🔒' }
    }
  },

  // ===== 6. CONNECTION STATUS & MONITORING =====
  connectionStatus: {
    // Connection types
    types: {
      primary: {
        name: 'Primary Connection',
        url: 'c201001.mask.services',
        port: 443,
        protocol: 'wss',
        priority: 1
      },
      backup: {
        name: 'Backup Connection',
        url: 'backup.mask.services',
        port: 443,
        protocol: 'wss',
        priority: 2
      }
    },
    
    // Status definitions
    statuses: {
      connected: {
        name: 'Connected',
        color: '#27ae60',
        icon: '●',
        priority: 1,
        description: 'Connection established'
      },
      connecting: {
        name: 'Connecting',
        color: '#3498db',
        icon: '◐',
        priority: 2,
        description: 'Establishing connection'
      },
      disconnected: {
        name: 'Disconnected',
        color: '#95a5a6',
        icon: '○',
        priority: 4,
        description: 'No connection'
      },
      error: {
        name: 'Error',
        color: '#e74c3c',
        icon: '✕',
        priority: 5,
        description: 'Connection error'
      },
      maintenance: {
        name: 'Maintenance',
        color: '#f39c12',
        icon: '⚠',
        priority: 3,
        description: 'Maintenance mode'
      }
    },
    
    // Quality indicators
    quality: {
      excellent: { color: '#27ae60', threshold: 0, maxLatency: 50 },
      good: { color: '#3498db', threshold: 50, maxLatency: 100 },
      fair: { color: '#f39c12', threshold: 100, maxLatency: 200 },
      poor: { color: '#e74c3c', threshold: 200, maxLatency: 999 }
    },
    
    // Monitoring configuration
    monitoring: {
      pingInterval: 10000, // 10 seconds
      timeoutThreshold: 5000, // 5 seconds
      retryAttempts: 3,
      retryDelay: 2000, // 2 seconds
      showLatency: true,
      showUptime: false,
      showLastPing: false
    }
  },

  // ===== 7. RESPONSIVE DESIGN & 7.9" DISPLAY =====
  responsive: {
    // Target display specifications
    targetDisplay: {
      size: '7.9-inch',
      resolution: '1280x400',
      orientation: 'landscape',
      touchscreen: true,
      pixelDensity: 'standard',
      viewingDistance: '30-60cm'
    },
    
    // Breakpoints
    breakpoints: {
      desktop: {
        minWidth: 1280,
        maxWidth: 9999,
        columns: 3,
        spacing: 'normal'
      },
      compact: {
        minWidth: 1024,
        maxWidth: 1279,
        columns: 3,
        spacing: 'reduced'
      },
      mobile: {
        minWidth: 768,
        maxWidth: 1023,
        columns: 2,
        spacing: 'minimal'
      },
      tiny: {
        minWidth: 320,
        maxWidth: 767,
        columns: 1,
        spacing: 'tight'
      }
    },
    
    // Responsive behavior
    behavior: {
      hideElements: {
        compact: ['build-time', 'session-details'],
        mobile: ['system-type', 'connection-details', 'uptime'],
        tiny: ['version-details', 'user-permissions', 'connection-quality']
      },
      adjustSizes: {
        compact: { fontSize: '12px', height: '50px' },
        mobile: { fontSize: '11px', height: '45px' },
        tiny: { fontSize: '10px', height: '40px' }
      },
      stackSections: {
        mobile: true,
        tiny: true
      }
    },
    
    // Touch optimization
    touch: {
      enabled: true,
      minTargetSize: 44, // px - WCAG minimum
      recommendedSize: 48, // px - WCAG AAA
      spacing: 8, // px minimum between targets
      feedback: {
        haptic: false, // Not available in web
        visual: true,
        audio: false
      }
    }
  },

  // ===== 8. ACCESSIBILITY & WCAG COMPLIANCE =====
  accessibility: {
    // WCAG compliance level
    wcag: {
      level: 'AA',
      guidelines: '2.1',
      compliance: {
        perceivable: true,
        operable: true,
        understandable: true,
        robust: true
      }
    },
    
    // Color contrast
    contrast: {
      normalText: 4.5, // WCAG AA minimum
      largeText: 3.0,
      uiComponents: 3.0,
      targetLevel: 'AA',
      testAgainstBackground: true
    },
    
    // Keyboard navigation
    keyboard: {
      enabled: true,
      shortcuts: {
        'Alt+F': 'focus-footer',
        'Alt+S': 'focus-system-info',
        'Alt+U': 'focus-user-info',
        'Alt+C': 'focus-connection-status'
      },
      tabOrder: ['system-info', 'connection-status', 'user-session'],
      visualFocus: {
        enabled: true,
        style: '2px solid #3498db',
        offset: '2px'
      }
    },
    
    // Screen reader support
    screenReader: {
      enabled: true,
      labels: {
        footer: 'Application footer with system status',
        systemInfo: 'System information and version',
        connectionStatus: 'Connection status and quality',
        userSession: 'User session and role information'
      },
      announcements: {
        statusChange: true,
        connectionChange: true,
        userChange: false
      },
      liveRegions: {
        connectionStatus: 'polite',
        systemStatus: 'assertive',
        userSession: 'off'
      }
    },
    
    // High contrast mode
    highContrast: {
      enabled: true,
      autoDetect: true,
      theme: 'high-contrast',
      customColors: {
        background: '#000000',
        text: '#ffffff',
        border: '#ffffff',
        focus: '#ffff00'
      }
    },
    
    // Reduced motion
    reducedMotion: {
      respectPreference: true,
      fallbacks: {
        animations: 'none',
        transitions: 'instant',
        effects: 'static'
      }
    }
  },

  // ===== 9. PERFORMANCE MONITORING & TARGETS =====
  performance: {
    // Performance targets (in milliseconds)
    targets: {
      initialization: {
        target: 500,
        warning: 1000,
        critical: 2000,
        description: 'Component initialization time'
      },
      render: {
        target: 150,
        warning: 300,
        critical: 500,
        description: 'Initial render time'
      },
      interaction: {
        target: 50,
        warning: 100,
        critical: 200,
        description: 'User interaction response time'
      },
      update: {
        target: 30,
        warning: 60,
        critical: 100,
        description: 'Status update time'
      }
    },
    
    // Memory management
    memory: {
      target: 1, // MB
      warning: 2,
      critical: 4,
      cleanupInterval: 300000, // 5 minutes
      autoCleanup: true
    },
    
    // Monitoring configuration
    monitoring: {
      enabled: true,
      interval: 10000, // 10 seconds
      metrics: ['initialization', 'render', 'interaction', 'memory'],
      alerts: {
        enabled: true,
        thresholds: 'warning', // 'target', 'warning', 'critical'
        console: true,
        notification: false
      }
    },
    
    // Optimization settings
    optimization: {
      lazyLoading: false,
      debounceUpdates: 100, // ms
      throttleEvents: 50, // ms
      cacheResults: true,
      prefetchData: false
    }
  },

  // ===== 10. SECURITY & VALIDATION =====
  security: {
    // Input validation
    validation: {
      enabled: true,
      strict: true,
      sanitization: {
        xss: true,
        html: true,
        scripts: true,
        maxLength: 1000
      },
      allowedChars: {
        systemInfo: /^[a-zA-Z0-9\s\.\-\_\(\)]+$/,
        userInfo: /^[a-zA-Z0-9\s\.\-\_@]+$/,
        version: /^[a-zA-Z0-9\.\-]+$/
      }
    },
    
    // Security headers
    headers: {
      contentSecurityPolicy: {
        enabled: true,
        directives: {
          'default-src': "'self'",
          'script-src': "'self' 'unsafe-inline'",
          'style-src': "'self' 'unsafe-inline'",
          'img-src': "'self' data:",
          'connect-src': "'self' wss: ws:"
        }
      },
      xssProtection: true,
      contentTypeOptions: true,
      frameOptions: 'DENY'
    },
    
    // Role-based access
    roleAccess: {
      systemInfo: ['OPERATOR', 'ADMIN', 'SUPERUSER', 'SERWISANT'],
      versionInfo: ['ADMIN', 'SUPERUSER', 'SERWISANT'],
      userSession: ['OPERATOR', 'ADMIN', 'SUPERUSER', 'SERWISANT'],
      connectionStatus: ['OPERATOR', 'ADMIN', 'SUPERUSER', 'SERWISANT']
    },
    
    // Audit logging
    audit: {
      enabled: true,
      events: ['role-change', 'status-update', 'configuration-change'],
      retention: 30, // days
      format: 'json',
      fields: ['timestamp', 'user', 'action', 'data', 'result']
    }
  },

  // ===== 11. MULTI-LANGUAGE SUPPORT =====
  translations: {
    // Supported languages
    supported: ['pl', 'en', 'de'],
    default: 'pl',
    fallback: 'en',
    
    // Translation keys
    keys: {
      // System information
      'system.name': {
        pl: 'MASKSERVICE C20 1001',
        en: 'MASKSERVICE C20 1001',
        de: 'MASKSERVICE C20 1001'
      },
      'system.status.operational': {
        pl: 'Operacyjny',
        en: 'Operational',
        de: 'Betriebsbereit'
      },
      'system.status.maintenance': {
        pl: 'Konserwacja',
        en: 'Maintenance',
        de: 'Wartung'
      },
      'system.status.error': {
        pl: 'Błąd',
        en: 'Error',
        de: 'Fehler'
      },
      
      // Connection status
      'connection.connected': {
        pl: 'Połączony',
        en: 'Connected',
        de: 'Verbunden'
      },
      'connection.connecting': {
        pl: 'Łączenie',
        en: 'Connecting',
        de: 'Verbindung'
      },
      'connection.disconnected': {
        pl: 'Rozłączony',
        en: 'Disconnected',
        de: 'Getrennt'
      },
      'connection.error': {
        pl: 'Błąd połączenia',
        en: 'Connection Error',
        de: 'Verbindungsfehler'
      },
      
      // User roles
      'role.operator': {
        pl: 'Operator',
        en: 'Operator',
        de: 'Bediener'
      },
      'role.admin': {
        pl: 'Administrator',
        en: 'Administrator',
        de: 'Administrator'
      },
      'role.superuser': {
        pl: 'Super Użytkownik',
        en: 'Super User',
        de: 'Super Benutzer'
      },
      'role.serwisant': {
        pl: 'Serwisant',
        en: 'Service Tech',
        de: 'Service-Techniker'
      },
      
      // Time and date
      'time.format': {
        pl: 'DD.MM.YYYY HH:mm:ss',
        en: 'MM/DD/YYYY HH:mm:ss',
        de: 'DD.MM.YYYY HH:mm:ss'
      },
      
      // Accessibility labels
      'aria.footer': {
        pl: 'Stopka aplikacji ze statusem systemu',
        en: 'Application footer with system status',
        de: 'Anwendungsfußzeile mit Systemstatus'
      },
      'aria.systemInfo': {
        pl: 'Informacje o systemie i wersji',
        en: 'System information and version',
        de: 'Systeminformationen und Version'
      },
      'aria.connectionStatus': {
        pl: 'Status połączenia i jakość',
        en: 'Connection status and quality',
        de: 'Verbindungsstatus und Qualität'
      }
    },
    
    // Formatting options
    formatting: {
      dateTime: {
        pl: { locale: 'pl-PL', options: { timeZone: 'Europe/Warsaw' } },
        en: { locale: 'en-US', options: { timeZone: 'UTC' } },
        de: { locale: 'de-DE', options: { timeZone: 'Europe/Berlin' } }
      },
      numbers: {
        pl: 'pl-PL',
        en: 'en-US',
        de: 'de-DE'
      }
    }
  },

  // ===== 12. DEVELOPMENT & TESTING CONFIGURATION =====
  development: {
    // Debug mode
    debug: {
      enabled: false,
      level: 'info', // 'error', 'warn', 'info', 'debug'
      console: true,
      performance: true,
      events: false
    },
    
    // Testing configuration
    testing: {
      smokeTests: {
        enabled: true,
        timeout: 10000, // 10 seconds
        retries: 2,
        parallel: false
      },
      mockData: {
        systemInfo: {
          name: 'MASKSERVICE C20 1001',
          version: 'v3.0.0-test',
          status: 'operational'
        },
        userSession: {
          user: 'test.user',
          role: 'OPERATOR',
          active: true
        },
        connectionStatus: {
          status: 'connected',
          quality: 'excellent',
          latency: 25
        }
      }
    },
    
    // Development tools
    tools: {
      hotReload: false,
      sourceMap: true,
      profiling: false,
      coverage: false
    },
    
    // Environment detection
    environment: {
      detection: 'auto', // 'auto', 'development', 'staging', 'production'
      overrides: {
        development: {
          debug: true,
          performance: false,
          validation: false
        },
        production: {
          debug: false,
          performance: true,
          validation: true
        }
      }
    }
  }
};

// ===== CONFIGURATION VALIDATION =====
export const validateConfig = (config) => {
  const errors = [];
  
  // Required sections
  const requiredSections = ['metadata', 'ui', 'systemInfo', 'responsive', 'accessibility'];
  for (const section of requiredSections) {
    if (!config[section]) {
      errors.push(`Missing required section: ${section}`);
    }
  }
  
  // Theme validation
  if (config.ui?.themes) {
    const themes = Object.keys(config.ui.themes);
    if (themes.length === 0) {
      errors.push('At least one theme must be defined');
    }
  }
  
  // Language validation
  if (config.translations?.supported) {
    if (!Array.isArray(config.translations.supported) || config.translations.supported.length === 0) {
      errors.push('At least one language must be supported');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors: errors
  };
};

// ===== CONFIGURATION MERGER =====
export const mergeConfig = (baseConfig, userConfig) => {
  const merged = JSON.parse(JSON.stringify(baseConfig));
  
  const deepMerge = (target, source) => {
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        target[key] = target[key] || {};
        deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  };
  
  deepMerge(merged, userConfig);
  return merged;
};
