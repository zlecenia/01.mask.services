# 📘 Instrukcja tworzenia komponentów Frontend/Backend dla 01.mask.services

## 🎯 Zasady główne

1. **Każda strona = 2 komponenty** (frontend + backend)
2. **Zero współdzielenia kodu** między stronami
3. **Wersjonowanie semantyczne** (0.1.0 → 0.1.1 → 0.2.0)
4. **Standalone first** - każdy komponent musi działać niezależnie

## 📁 Struktura komponentu Frontend

### Szablon: `js/features/[pageName]Page/[version]/`

```bash
js/features/loginPage/0.1.0/
├── index.js              # Standardowy eksport (NIE MODYFIKOWAĆ WZORCA!)
├── LoginPage.js          # Główny komponent strony
├── LoginPage.test.js     # Testy jednostkowe
├── LoginPage.css         # Style lokalne
├── standalone.html       # Do testowania niezależnego
├── package.json          # Zależności lokalne
├── CHANGELOG.md          # Historia zmian
├── config/
│   ├── config.json      # Konfiguracja źródłowa
│   ├── data.json        # Dane runtime
│   ├── schema.json      # Walidacja
│   └── crud.json        # Reguły edycji
└── locales/
    ├── pl.json          # Tłumaczenia PL
    └── en.json          # Tłumaczenia EN
```

### 1. Utworzenie komponentu Frontend

```bash
# Krok 1: Stwórz strukturę
mkdir -p 01.mask.services/js/features/dashboardPage/0.1.0/{config,locales}
cd 01.mask.services/js/features/dashboardPage/0.1.0

# Krok 2: Stwórz package.json
cat > package.json << 'EOF'
{
  "name": "@maskservice/dashboard-page",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "python3 -m http.server 3010",
    "test": "node --test DashboardPage.test.js"
  }
}
EOF
```

### 2. index.js - Standardowy wzorzec (NIE MODYFIKUJ!)

```javascript
// js/features/dashboardPage/0.1.0/index.js
const { reactive, computed, onMounted } = window.Vue || {};

const pageModule = {
  metadata: {
    name: 'dashboardPage',
    version: '0.1.0',
    type: 'page',
    apiEndpoint: '/api/dashboard'
  },
  
  component: null,
  config: null,
  apiClient: null,
  
  async init(context = {}) {
    try {
      // 1. Załaduj komponent
      const module = await import('./DashboardPage.js');
      this.component = module.default;
      
      // 2. Załaduj konfigurację
      const configResponse = await fetch('./config/config.json');
      this.config = await configResponse.json();
      
      // 3. Ustaw API client
      this.apiClient = {
        baseUrl: context.apiUrl || 'http://localhost:8002',
        async fetch(endpoint, options = {}) {
          const response = await fetch(this.baseUrl + endpoint, {
            ...options,
            headers: {
              'Content-Type': 'application/json',
              ...options.headers
            }
          });
          if (!response.ok) throw new Error(`API Error: ${response.status}`);
          return response.json();
        }
      };
      
      return { 
        success: true, 
        message: `${this.metadata.name} v${this.metadata.version} initialized`
      };
    } catch (error) {
      console.error(`[${this.metadata.name}] Init failed:`, error);
      return { success: false, error: error.message };
    }
  },
  
  async mount(selector) {
    const { createApp } = window.Vue;
    const app = createApp(this.component);
    
    // Inject API client
    app.provide('api', this.apiClient);
    app.provide('config', this.config);
    
    app.mount(selector);
    return app;
  }
};

export default pageModule;
```

### 3. Komponent strony - DashboardPage.js

```javascript
// js/features/dashboardPage/0.1.0/DashboardPage.js
export default {
  name: 'DashboardPage',
  
  template: `
    <div class="dashboard-page">
      <header class="dashboard-header">
        <h1>{{ title }}</h1>
        <div class="user-info">{{ currentUser }}</div>
      </header>
      
      <main class="dashboard-content">
        <div class="stats-grid">
          <div v-for="stat in stats" :key="stat.id" class="stat-card">
            <h3>{{ stat.label }}</h3>
            <p class="stat-value">{{ stat.value }}</p>
          </div>
        </div>
        
        <div v-if="loading" class="loading">Ładowanie...</div>
        <div v-if="error" class="error">{{ error }}</div>
      </main>
    </div>
  `,
  
  setup() {
    const { ref, onMounted, inject } = window.Vue;
    
    // Inject dependencies
    const api = inject('api');
    const config = inject('config');
    
    // State
    const title = ref('Dashboard');
    const currentUser = ref('');
    const stats = ref([]);
    const loading = ref(false);
    const error = ref(null);
    
    // Methods
    const loadDashboardData = async () => {
      loading.value = true;
      error.value = null;
      
      try {
        const data = await api.fetch('/api/dashboard/stats');
        stats.value = data.stats;
        currentUser.value = data.user;
      } catch (e) {
        error.value = 'Nie można załadować danych: ' + e.message;
      } finally {
        loading.value = false;
      }
    };
    
    // Lifecycle
    onMounted(() => {
      loadDashboardData();
      // Refresh co 30 sekund
      setInterval(loadDashboardData, 30000);
    });
    
    return {
      title,
      currentUser,
      stats,
      loading,
      error
    };
  }
};
```

### 4. Plik testowy standalone.html

```html
<!-- js/features/dashboardPage/0.1.0/standalone.html -->
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Dashboard Page - Test</title>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <link rel="stylesheet" href="./DashboardPage.css">
    <style>
        body { 
            margin: 0; 
            font-family: system-ui, -apple-system, sans-serif;
            background: #f5f5f5;
        }
        .dashboard-page {
            max-width: 1280px;
            margin: 0 auto;
            padding: 20px;
        }
        .dashboard-header {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
        }
        .stat-value {
            font-size: 2em;
            font-weight: bold;
            color: #3498db;
        }
    </style>
</head>
<body>
    <div id="app"></div>
    
    <script type="module">
        // Import i inicjalizacja
        import pageModule from './index.js';
        
        // Mock API dla testów
        window.fetch = async (url) => {
            console.log('Mock fetch:', url);
            
            if (url.includes('/api/dashboard/stats')) {
                return {
                    ok: true,
                    json: async () => ({
                        user: 'Jan Kowalski',
                        stats: [
                            { id: 1, label: 'Testy dziś', value: 42 },
                            { id: 2, label: 'Raporty', value: 15 },
                            { id: 3, label: 'Alarmy', value: 3 },
                            { id: 4, label: 'Urządzenia', value: 8 }
                        ]
                    })
                };
            }
            
            if (url.includes('config.json')) {
                return {
                    ok: true,
                    json: async () => ({
                        refreshInterval: 30000,
                        features: ['stats', 'alerts']
                    })
                };
            }
            
            return { ok: false, status: 404 };
        };
        
        // Inicjalizacja i montowanie
        await pageModule.init({ apiUrl: 'http://localhost:8002' });
        pageModule.mount('#app');
    </script>
</body>
</html>
```

## 📁 Struktura komponentu Backend

### Szablon: `py/features/[pageName]Api/[version]/`

```bash
py/features/dashboardApi/0.1.0/
├── __init__.py          # Eksport modułu
├── main.py              # FastAPI aplikacja
├── models.py            # Modele danych (Pydantic)
├── handlers.py          # Logika biznesowa
├── database.py          # Połączenie z DB (opcjonalne)
├── requirements.txt     # Zależności
├── standalone.py        # Do testowania
├── config.json          # Konfiguracja API
├── CHANGELOG.md         # Historia zmian
└── tests/
    ├── __init__.py
    └── test_api.py      # Testy
```

### 1. Utworzenie komponentu Backend

```bash
# Krok 1: Stwórz strukturę
mkdir -p 01.mask.services/py/features/dashboardApi/0.1.0/tests
cd 01.mask.services/py/features/dashboardApi/0.1.0

# Krok 2: Requirements
cat > requirements.txt << 'EOF'
fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.5.0
python-multipart==0.0.6
EOF

# Krok 3: Instalacja
pip install -r requirements.txt
```

### 2. main.py - API endpoint

```python
# py/features/dashboardApi/0.1.0/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import json

# Inicjalizacja
app = FastAPI(title="Dashboard API", version="0.1.0")

# CORS dla frontendu
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modele
class StatItem(BaseModel):
    id: int
    label: str
    value: int | str
    unit: Optional[str] = None

class DashboardData(BaseModel):
    user: str
    stats: List[StatItem]
    timestamp: datetime = datetime.now()

# Endpoints
@app.get("/api/dashboard/stats")
async def get_dashboard_stats():
    """Pobierz statystyki dashboard"""
    
    # W prawdziwej aplikacji - dane z bazy
    # Tu przykładowe dane
    return DashboardData(
        user="Jan Kowalski",
        stats=[
            StatItem(id=1, label="Testy dziś", value=42),
            StatItem(id=2, label="Raporty", value=15),
            StatItem(id=3, label="Alarmy aktywne", value=3),
            StatItem(id=4, label="Urządzenia online", value=8)
        ]
    )

@app.get("/api/dashboard/config")
async def get_dashboard_config():
    """Pobierz konfigurację dashboard"""
    with open("config.json", "r") as f:
        return json.load(f)

@app.post("/api/dashboard/refresh")
async def refresh_dashboard():
    """Wymuś odświeżenie danych"""
    # Logika odświeżenia
    return {"status": "refreshed", "timestamp": datetime.now()}

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "0.1.0"}
```

### 3. standalone.py - Do testowania

```python
# py/features/dashboardApi/0.1.0/standalone.py
#!/usr/bin/env python3
"""
Standalone server dla Dashboard API
Uruchom: python standalone.py
"""

if __name__ == "__main__":
    import uvicorn
    from main import app
    
    print("🚀 Dashboard API starting...")
    print("📍 URL: http://localhost:8002")
    print("📚 Docs: http://localhost:8002/docs")
    print("\nEndpoints:")
    print("  GET  /api/dashboard/stats")
    print("  GET  /api/dashboard/config")
    print("  POST /api/dashboard/refresh")
    print("\nPress CTRL+C to stop")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8002,
        reload=True,
        log_level="info"
    )
```

### 4. config.json - Konfiguracja API

```json
{
  "version": "0.1.0",
  "features": {
    "stats": true,
    "alerts": true,
    "reports": true,
    "realtime": false
  },
  "refresh_interval": 30000,
  "max_items": 100,
  "database": {
    "type": "sqlite",
    "path": "./dashboard.db"
  }
}
```

## 🚀 Uruchomienie kompletnej strony

### 1. Makefile główny

```makefile
# 01.mask.services/Makefile

# Uruchom Dashboard (frontend + backend)
run-dashboard:
	@echo "🚀 Starting Dashboard Page..."
	@echo "Backend: http://localhost:8002"
	@echo "Frontend: http://localhost:3010"
	@echo "---"
	cd py/features/dashboardApi/0.1.0 && python standalone.py &
	sleep 2
	cd js/features/dashboardPage/0.1.0 && python3 -m http.server 3010

# Stop wszystko
stop:
	@pkill -f "standalone.py" || true
	@pkill -f "http.server" || true

# Test strony
test-dashboard:
	cd js/features/dashboardPage/0.1.0 && npm test
	cd py/features/dashboardApi/0.1.0 && pytest

# Nowa strona z szablonu
new-page:
	@read -p "Page name (np. reports): " name; \
	./scripts/create-page-pair.sh $$name
```

### 2. Skrypt tworzenia pary komponentów

```bash
#!/bin/bash
# scripts/create-page-pair.sh

PAGE_NAME=$1
VERSION="0.1.0"

echo "📦 Creating page pair: ${PAGE_NAME}"

# Frontend
FRONTEND_DIR="js/features/${PAGE_NAME}Page/${VERSION}"
mkdir -p "${FRONTEND_DIR}/config" "${FRONTEND_DIR}/locales"

# Kopiuj szablon
cp -r templates/frontend/* "${FRONTEND_DIR}/"
# Podmień nazwy
sed -i "s/TEMPLATE_NAME/${PAGE_NAME}/g" "${FRONTEND_DIR}"/*.js

# Backend  
BACKEND_DIR="py/features/${PAGE_NAME}Api/${VERSION}"
mkdir -p "${BACKEND_DIR}/tests"

# Kopiuj szablon
cp -r templates/backend/* "${BACKEND_DIR}/"
# Podmień nazwy
sed -i "s/TEMPLATE_NAME/${PAGE_NAME}/g" "${BACKEND_DIR}"/*.py

echo "✅ Created: ${PAGE_NAME}Page + ${PAGE_NAME}Api"
echo ""
echo "Run with: make run-${PAGE_NAME}"
```

## 📋 Checklist dla nowego komponentu

### Frontend:
- [ ] Folder: `js/features/[name]Page/0.1.0/`
- [ ] `index.js` - używa window.Vue
- [ ] `[Name]Page.js` - główny komponent
- [ ] `standalone.html` - do testów
- [ ] `package.json` - z wersją
- [ ] `config/config.json` - konfiguracja
- [ ] `CHANGELOG.md` - pusty

### Backend:
- [ ] Folder: `py/features/[name]Api/0.1.0/`
- [ ] `main.py` - FastAPI app
- [ ] `standalone.py` - runner
- [ ] `requirements.txt` - zależności
- [ ] `config.json` - konfiguracja
- [ ] CORS włączone
- [ ] Health endpoint

### Testowanie:
- [ ] Frontend standalone działa
- [ ] Backend `/docs` dostępne
- [ ] CORS pozwala na komunikację
- [ ] `make run-[name]` działa

## ⚠️ Ważne zasady

1. **NIE współdziel kodu** - każda strona jest niezależna
2. **NIE używaj importów ES6** - tylko window.Vue
3. **ZAWSZE wersjonuj** - 0.1.0, 0.1.1, nie .backup
4. **Port = unikalny** - Frontend 3001+, Backend 8001+
5. **Standalone first** - musi działać bez reszty systemu

## 🎯 Przykład: Kompletna strona w 5 minut

```bash
# 1. Stwórz parę komponentów
./scripts/create-page-pair.sh reports

# 2. Uruchom
make run-reports

# 3. Testuj
# Frontend: http://localhost:3011/standalone.html
# Backend: http://localhost:8003/docs

# 4. Modyfikuj i od razu widzisz zmiany (hot reload)
```

Ta instrukcja zapewnia prostotę dla LLM - jeden kontekst, dwa pliki, zero zależności między stronami!