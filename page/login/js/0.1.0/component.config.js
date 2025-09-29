/**
 * LoginForm Component 0.1.1 - Unified Configuration
 * Konfiguracja komponentu zgodna z components.md v2.0 specification
 * Optymalizacja dla 7.9" wyświetlacza przemysłowego (1280x400 landscape)
 */

export default {
  // Component Metadata
  metadata: {
    name: 'loginForm',
    version: '0.1.1',
    contractVersion: '2.0',
    description: 'Login form with virtual keyboard optimized for 7.9" industrial touch displays',
    author: 'MASKSERVICE C20 1001 Team',
    created: '2024-12-19',
    lastModified: '2024-12-19',
    tags: ['authentication', 'virtual-keyboard', '7.9-inch', 'touch-optimized', 'industrial', 'role-based'],
    category: 'authentication',
    displayOptimization: '7.9-inch-landscape-1280x400px'
  },

  // UI Configuration
  ui: {
    theme: 'industrial',
    colorScheme: 'dark',
    primaryColor: '#667eea',
    secondaryColor: '#764ba2',
    successColor: '#28a745',
    errorColor: '#dc3545',
    warningColor: '#ffc107',
    
    // 7.9" Display Specific Settings
    display: {
      width: 1280,
      height: 400,
      orientation: 'landscape',
      pixelDensity: 'normal',
      touchOptimized: true,
      scaleFactor: 1.0
    },
    
    // Layout Settings
    layout: {
      containerMaxWidth: 400,
      containerPadding: 30,
      formGap: 20,
      borderRadius: 10,
      boxShadowIntensity: 'high'
    },
    
    // Typography
    typography: {
      fontFamily: "'Segoe UI', Arial, sans-serif",
      fontSize: {
        small: '12px',
        medium: '14px',
        large: '16px',
        xlarge: '18px',
        title: '24px'
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        bold: 700
      }
    },
    
    // Form Elements
    form: {
      inputPadding: '12px 15px',
      inputBorderRadius: '6px',
      inputFontSize: '16px',
      inputBackground: 'rgba(255,255,255,0.9)',
      buttonHeight: '50px',
      buttonFontSize: '16px',
      buttonFontWeight: 500,
      labelMarginBottom: '8px',
      errorColor: '#ff6b6b',
      errorFontSize: '14px'
    },
    
    // Touch Targets (minimum 48px for accessibility)
    touchTargets: {
      minSize: 48,
      recommendedSize: 50,
      spacing: 8,
      feedbackEnabled: true
    },
    
    // Animations
    animations: {
      enabled: true,
      duration: {
        fast: '0.15s',
        normal: '0.3s',
        slow: '0.5s'
      },
      easing: {
        standard: 'ease',
        accelerate: 'ease-in',
        decelerate: 'ease-out',
        emphasized: 'cubic-bezier(0.2, 0, 0, 1)'
      }
    }
  },

  // Authentication Configuration
  authentication: {
    // Credential Requirements
    minUsernameLength: 3,
    maxUsernameLength: 50,
    minPasswordLength: 3,
    maxPasswordLength: 128,
    
    // Default Settings
    defaultRole: 'OPERATOR',
    showRoleSelection: true,
    rememberUsername: false,
    autoFocusUsername: true,
    
    // Available Roles with Metadata
    availableRoles: [
      {
        value: 'OPERATOR',
        label: 'Operator',
        icon: 'fas fa-user',
        color: '#28a745',
        description: 'Podstawowe operacje systemu',
        level: 1,
        permissions: ['tests:view', 'reports:view']
      },
      {
        value: 'ADMIN',
        label: 'Administrator', 
        icon: 'fas fa-user-shield',
        color: '#007bff',
        description: 'Funkcje administracyjne',
        level: 2,
        permissions: ['tests:view', 'reports:view', 'users:manage', 'system:configure']
      },
      {
        value: 'SUPERUSER',
        label: 'Superuser',
        icon: 'fas fa-user-crown',
        color: '#6f42c1',
        description: 'Zaawansowana kontrola systemu',
        level: 3,
        permissions: ['integration:manage', 'analytics:view', 'system:advanced', 'audit:view']
      },
      {
        value: 'SERWISANT',
        label: 'Serwisant',
        icon: 'fas fa-user-cog',
        color: '#fd7e14',
        description: 'Serwis techniczny',
        level: 4,
        permissions: ['diagnostics:run', 'calibration:perform', 'maintenance:manage', 'workshop:access']
      }
    ],
    
    // Role Validation
    roleValidation: {
      strictMode: true,
      caseSensitive: true,
      allowCustomRoles: false
    },
    
    // Session Management
    session: {
      timeout: 30 * 60 * 1000, // 30 minutes
      renewBeforeExpiry: 5 * 60 * 1000, // 5 minutes
      maxConcurrentSessions: 1,
      trackLoginAttempts: true
    }
  },

  // Virtual Keyboard Configuration
  virtualKeyboard: {
    enabled: true,
    layout: 'QWERTY',
    language: 'pl',
    
    // Display Settings
    height: '60vh',
    keySize: '32px',
    keySpacing: '2px',
    backgroundColor: 'rgba(0,0,0,0.9)',
    keyColor: '#ffffff',
    keyActiveColor: '#667eea',
    
    // Behavior
    autoShow: true,
    hideOnSubmit: true,
    preventNativeKeyboard: true,
    vibrateOnKeypress: true,
    soundOnKeypress: false,
    
    // Touch Optimization
    touchOptimized: true,
    minimumKeySize: 40,
    recommendedKeySize: 44,
    
    // Responsive Adjustments
    responsive: {
      smallScreen: {
        height: '50vh',
        keySize: '28px'
      },
      threshold: 450 // pixels height
    },
    
    // Special Keys
    specialKeys: {
      space: { width: '40%', label: 'Spacja' },
      backspace: { width: '15%', label: '⌫' },
      enter: { width: '20%', label: '↵' },
      shift: { width: '15%', label: '⇧' },
      numbers: { enabled: true, label: '123' },
      symbols: { enabled: true, label: '#@!' }
    }
  },

  // Data Configuration
  data: {
    // Form State
    initialState: {
      username: '',
      password: '',
      role: 'OPERATOR',
      rememberMe: false,
      showPassword: false
    },
    
    // Validation Rules
    validation: {
      realtime: true,
      onSubmit: true,
      debounceMs: 300,
      
      rules: {
        username: {
          required: true,
          minLength: 3,
          maxLength: 50,
          pattern: '^[a-zA-Z0-9._-]+$',
          message: 'Nazwa użytkownika musi mieć 3-50 znaków (litery, cyfry, ., _, -)'
        },
        password: {
          required: true,
          minLength: 3,
          maxLength: 128,
          message: 'Hasło musi mieć co najmniej 3 znaki'
        },
        role: {
          required: true,
          enum: ['OPERATOR', 'ADMIN', 'SUPERUSER', 'SERWISANT'],
          message: 'Wybierz prawidłową rolę'
        }
      }
    },
    
    // Error Handling
    errorHandling: {
      showInlineErrors: true,
      showGeneralError: true,
      clearErrorsOnInput: true,
      errorDisplayDuration: 5000,
      maxRetryAttempts: 3
    }
  },

  // Role-Based Access Control
  roles: {
    // Access Levels
    hierarchy: {
      OPERATOR: 1,
      ADMIN: 2, 
      SUPERUSER: 3,
      SERWISANT: 4
    },
    
    // Role Permissions
    permissions: {
      OPERATOR: {
        level: 1,
        canAccess: ['dashboard', 'tests', 'reports'],
        features: ['basic-login', 'role-selection'],
        restrictions: ['no-admin-functions']
      },
      ADMIN: {
        level: 2,
        canAccess: ['dashboard', 'tests', 'reports', 'users', 'system'],
        features: ['basic-login', 'role-selection', 'user-management'],
        restrictions: ['limited-system-access']
      },
      SUPERUSER: {
        level: 3,
        canAccess: ['dashboard', 'tests', 'reports', 'users', 'system', 'integration', 'analytics'],
        features: ['basic-login', 'role-selection', 'user-management', 'system-control'],
        restrictions: ['no-hardware-access']
      },
      SERWISANT: {
        level: 4,
        canAccess: ['dashboard', 'diagnostics', 'calibration', 'maintenance', 'workshop'],
        features: ['basic-login', 'role-selection', 'hardware-access', 'service-tools'],
        restrictions: ['no-user-management']
      }
    },
    
    // Role Display Configuration
    display: {
      showRoleIcons: true,
      showRoleDescriptions: true,
      showPermissionCount: false,
      groupByLevel: false,
      sortBy: 'level' // 'level', 'alphabetical', 'custom'
    }
  },

  // Responsive Design
  responsive: {
    enabled: true,
    
    // Breakpoints (optimized for 7.9" landscape)
    breakpoints: {
      mobile: 480,
      tablet: 768,
      desktop: 1024,
      large: 1280
    },
    
    // 7.9" Specific Optimizations
    display_7_9: {
      width: 1280,
      height: 400,
      orientation: 'landscape',
      
      // Layout Adjustments
      containerWidth: '100%',
      maxContainerWidth: 400,
      formPadding: 30,
      inputHeight: 50,
      buttonHeight: 50,
      fontSize: 16,
      
      // Touch Optimizations
      touchTargetSize: 48,
      touchSpacing: 12,
      swipeGestures: false,
      zoomDisabled: true
    },
    
    // Fallback for smaller screens
    compact: {
      threshold: 600,
      adjustments: {
        containerPadding: 20,
        formGap: 15,
        inputHeight: 45,
        buttonHeight: 45,
        fontSize: 14
      }
    }
  },

  // Accessibility Configuration
  accessibility: {
    enabled: true,
    
    // WCAG 2.1 Compliance
    wcag: {
      level: 'AA',
      colorContrast: 'enhanced',
      focusIndicators: 'visible',
      keyboardNavigation: 'full'
    },
    
    // Screen Reader Support
    screenReader: {
      enabled: true,
      announceErrors: true,
      announceStateChanges: true,
      labelAssociation: 'explicit'
    },
    
    // Keyboard Navigation
    keyboard: {
      enabled: true,
      tabOrder: ['username', 'password', 'role', 'submit'],
      shortcuts: {
        'Enter': 'submit',
        'Escape': 'clear',
        'F1': 'help'
      },
      skipToContent: true
    },
    
    // ARIA Support
    aria: {
      labels: true,
      descriptions: true,
      roles: true,
      landmarks: true,
      liveRegions: true
    },
    
    // Touch Accessibility
    touch: {
      minTargetSize: 48,
      spacing: 8,
      feedback: {
        haptic: true,
        visual: true,
        audio: false
      }
    },
    
    // High Contrast Mode
    highContrast: {
      enabled: true,
      autoDetect: true,
      customColors: {
        background: '#000000',
        text: '#ffffff',
        primary: '#00ff00',
        error: '#ff0000'
      }
    }
  },

  // Performance Configuration
  performance: {
    // Optimization Settings
    optimization: {
      lazy: false, // Login form should load immediately
      preload: true,
      caching: true,
      compression: true
    },
    
    // Performance Benchmarks
    benchmarks: {
      initialization: {
        target: 500, // ms
        warning: 800,
        critical: 1200
      },
      firstRender: {
        target: 200, // ms
        warning: 400,
        critical: 800
      },
      interactionResponse: {
        target: 50, // ms
        warning: 100,
        critical: 200
      },
      formSubmission: {
        target: 100, // ms
        warning: 300,
        critical: 500
      }
    },
    
    // Memory Management
    memory: {
      autoCleanup: true,
      cleanupInterval: 300000, // 5 minutes
      maxCacheSize: 10 * 1024 * 1024, // 10MB
      garbageCollection: 'automatic'
    },
    
    // Network Optimization
    network: {
      timeout: 10000, // 10 seconds
      retryAttempts: 3,
      retryDelay: 1000,
      compression: true
    }
  },

  // Security Configuration
  security: {
    // Authentication Security
    authentication: {
      maxLoginAttempts: 3,
      lockoutDuration: 15 * 60 * 1000, // 15 minutes
      passwordStrengthCheck: false, // Simple passwords allowed for industrial use
      sessionTimeout: 30 * 60 * 1000 // 30 minutes
    },
    
    // Input Validation & Sanitization
    validation: {
      enabled: true,
      strictMode: true,
      sanitizeInput: true,
      preventXSS: true,
      preventSQLInjection: true,
      allowedCharacters: {
        username: 'a-zA-Z0-9._-',
        password: 'all', // Allow all characters in password
        role: 'A-Z_'
      }
    },
    
    // CSRF Protection
    csrf: {
      enabled: true,
      tokenName: 'loginFormToken',
      tokenExpiry: 3600000, // 1 hour
      validateOnSubmit: true
    },
    
    // Content Security Policy
    csp: {
      enabled: true,
      directives: {
        'default-src': "'self'",
        'script-src': "'self' 'unsafe-inline'",
        'style-src': "'self' 'unsafe-inline'",
        'img-src': "'self' data:",
        'font-src': "'self'"
      }
    },
    
    // Audit Logging
    audit: {
      enabled: true,
      logLevel: 'info',
      events: [
        'login-attempt',
        'login-success',
        'login-failure',
        'account-lockout',
        'session-timeout',
        'password-change',
        'role-change'
      ],
      retention: 90 * 24 * 60 * 60 * 1000, // 90 days
      encryptLogs: false
    },
    
    // Rate Limiting
    rateLimit: {
      enabled: true,
      maxAttempts: 5,
      timeWindow: 60000, // 1 minute
      blockDuration: 300000 // 5 minutes
    }
  },

  // Internationalization (i18n)
  translations: {
    defaultLanguage: 'pl',
    supportedLanguages: ['pl', 'en', 'de'],
    
    // Polish translations
    pl: {
      title: 'MASKSERVICE C20 1001 - Logowanie',
      username: 'Nazwa użytkownika',
      password: 'Hasło',
      role: 'Rola',
      login: 'Zaloguj się',
      loginInProgress: 'Logowanie...',
      showPassword: 'Pokaż hasło',
      hidePassword: 'Ukryj hasło',
      rememberMe: 'Zapamiętaj mnie',
      forgotPassword: 'Zapomniałeś hasła?',
      
      // Roles
      roles: {
        OPERATOR: 'Operator',
        ADMIN: 'Administrator',
        SUPERUSER: 'Superuser',
        SERWISANT: 'Serwisant'
      },
      
      // Error messages
      errors: {
        invalidCredentials: 'Nieprawidłowe dane logowania',
        accountLocked: 'Konto zostało zablokowane',
        sessionExpired: 'Sesja wygasła',
        networkError: 'Błąd połączenia',
        generalError: 'Wystąpił błąd. Spróbuj ponownie.',
        usernameRequired: 'Nazwa użytkownika jest wymagana',
        passwordRequired: 'Hasło jest wymagane',
        roleRequired: 'Rola jest wymagana',
        usernameTooShort: 'Nazwa użytkownika za krótka',
        passwordTooShort: 'Hasło za krótkie',
        invalidRole: 'Nieprawidłowa rola'
      },
      
      // Success messages
      success: {
        loginSuccessful: 'Logowanie pomyślne',
        welcomeUser: 'Witaj, {username}!',
        roleSelected: 'Wybrano rolę: {role}'
      },
      
      // Virtual keyboard
      keyboard: {
        space: 'Spacja',
        backspace: 'Usuń',
        enter: 'Enter',
        shift: 'Shift',
        numbers: '123',
        symbols: '#@!',
        close: 'Zamknij'
      }
    },
    
    // English translations
    en: {
      title: 'MASKSERVICE C20 1001 - Login',
      username: 'Username',
      password: 'Password',
      role: 'Role',
      login: 'Log In',
      loginInProgress: 'Logging in...',
      showPassword: 'Show password',
      hidePassword: 'Hide password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      
      roles: {
        OPERATOR: 'Operator',
        ADMIN: 'Administrator',
        SUPERUSER: 'Superuser',
        SERWISANT: 'Service Technician'
      },
      
      errors: {
        invalidCredentials: 'Invalid login credentials',
        accountLocked: 'Account has been locked',
        sessionExpired: 'Session expired',
        networkError: 'Connection error',
        generalError: 'An error occurred. Please try again.',
        usernameRequired: 'Username is required',
        passwordRequired: 'Password is required',
        roleRequired: 'Role is required',
        usernameTooShort: 'Username too short',
        passwordTooShort: 'Password too short',
        invalidRole: 'Invalid role'
      },
      
      success: {
        loginSuccessful: 'Login successful',
        welcomeUser: 'Welcome, {username}!',
        roleSelected: 'Role selected: {role}'
      },
      
      keyboard: {
        space: 'Space',
        backspace: 'Backspace',
        enter: 'Enter',
        shift: 'Shift',
        numbers: '123',
        symbols: '#@!',
        close: 'Close'
      }
    },
    
    // German translations
    de: {
      title: 'MASKSERVICE C20 1001 - Anmeldung',
      username: 'Benutzername',
      password: 'Passwort',
      role: 'Rolle',
      login: 'Anmelden',
      loginInProgress: 'Anmeldung läuft...',
      showPassword: 'Passwort anzeigen',
      hidePassword: 'Passwort verbergen',
      rememberMe: 'Angemeldet bleiben',
      forgotPassword: 'Passwort vergessen?',
      
      roles: {
        OPERATOR: 'Bediener',
        ADMIN: 'Administrator',
        SUPERUSER: 'Superuser',
        SERWISANT: 'Servicetechniker'
      },
      
      errors: {
        invalidCredentials: 'Ungültige Anmeldedaten',
        accountLocked: 'Konto wurde gesperrt',
        sessionExpired: 'Sitzung abgelaufen',
        networkError: 'Verbindungsfehler',
        generalError: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
        usernameRequired: 'Benutzername ist erforderlich',
        passwordRequired: 'Passwort ist erforderlich',
        roleRequired: 'Rolle ist erforderlich',
        usernameTooShort: 'Benutzername zu kurz',
        passwordTooShort: 'Passwort zu kurz',
        invalidRole: 'Ungültige Rolle'
      },
      
      success: {
        loginSuccessful: 'Anmeldung erfolgreich',
        welcomeUser: 'Willkommen, {username}!',
        roleSelected: 'Rolle ausgewählt: {role}'
      },
      
      keyboard: {
        space: 'Leertaste',
        backspace: 'Rücktaste',
        enter: 'Eingabe',
        shift: 'Umschalt',
        numbers: '123',
        symbols: '#@!',
        close: 'Schließen'
      }
    }
  },

  // Animation Configuration
  animations: {
    enabled: true,
    
    // Login Form Animations
    form: {
      entrance: {
        type: 'fadeInUp',
        duration: 600,
        delay: 0,
        easing: 'ease-out'
      },
      error: {
        type: 'shake',
        duration: 500,
        intensity: 'medium'
      },
      success: {
        type: 'fadeOut',
        duration: 300,
        delay: 1000
      }
    },
    
    // Virtual Keyboard Animations
    virtualKeyboard: {
      show: {
        type: 'slideUp',
        duration: 300,
        easing: 'ease-out'
      },
      hide: {
        type: 'slideDown',
        duration: 200,
        easing: 'ease-in'
      },
      keyPress: {
        type: 'scale',
        duration: 100,
        scale: 0.95
      }
    },
    
    // Button Animations
    buttons: {
      hover: {
        type: 'scale',
        duration: 200,
        scale: 1.02
      },
      press: {
        type: 'scale',
        duration: 100,
        scale: 0.98
      },
      loading: {
        type: 'rotate',
        duration: 1000,
        infinite: true
      }
    },
    
    // Input Field Animations
    inputs: {
      focus: {
        type: 'borderGlow',
        duration: 200,
        color: '#667eea'
      },
      error: {
        type: 'borderPulse',
        duration: 300,
        color: '#dc3545',
        iterations: 2
      }
    }
  },

  // Development & Debug Configuration
  development: {
    debug: {
      enabled: false, // Set to true for development
      logLevel: 'info', // 'debug', 'info', 'warn', 'error'
      showPerformanceMetrics: false,
      showStateChanges: false
    },
    
    // Mock Data for Testing
    mockData: {
      enabled: false,
      users: [
        { username: 'operator', password: 'test', role: 'OPERATOR' },
        { username: 'admin', password: 'test', role: 'ADMIN' },
        { username: 'super', password: 'test', role: 'SUPERUSER' },
        { username: 'service', password: 'test', role: 'SERWISANT' }
      ]
    },
    
    // Testing Configuration
    testing: {
      smokeTests: {
        enabled: true,
        timeout: 10000,
        coverage: ['initialization', 'authentication', 'validation', 'keyboard']
      }
    }
  }
};
