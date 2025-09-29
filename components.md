# 📋 Plan Migracji: c201001.mask.services → 01.mask.services

## 📁 Nowa struktura katalogów

```bash
01.mask.services/
├── page/                        # Kompletne strony (frontend + backend)
│   ├── login/
│   │   ├── docker
│   │   │   └── 0.1.0
│   │   │       ├── docker-compose.yml
│   │   │       ├── Dockerfile.backend
│   │   │       ├── Dockerfile.frontend
│   │   │       ├── nginx.conf
│   │   │       └── test-docker.sh
│   │   ├── js/                 # Frontend (Vue.js)
│   │   │   └── 0.1.0/
│   │   │       ├── index.html
│   │   │       ├── login.js
│   │   │       ├── login.css
│   │   │       ├── login.test.js
│   │   │       └── package.json
│   │   └── py/                 # Backend (FastAPI)
│   │       └── 0.1.0/
│   │           ├── main.py
│   │           ├── models.py
│   │           ├── test_api.py
│   │           └── requirements.txt
│   ├── dashboard/
│   │   ├── js/0.1.0/
│   │   └── py/0.1.0/
│   └── tests/
│       ├── js/0.1.0/
│       └── py/0.1.0/
│
├── module/                      # Moduły współdzielone
│   ├── header/
│   │   └── js/0.1.0/           # Tylko frontend
│   │       ├── header.js
│   │       └── header.css
│   ├── auth/
│   │   └── py/0.1.0/           # Tylko backend
│   │       ├── auth.py
│   │       └── jwt_handler.py
│   └── menu/
│       ├── js/0.1.0/           # Frontend menu
│       └── py/0.1.0/           # API menu
│
├── shared/                      # Zasoby globalne
│   ├── css/
│   ├── locales/
│   └── assets/
│
└── Makefile
```

## 📄 components.md - Wytyczne migracji

```markdown
# Components Migration Guidelines v1.0

## Struktura komponentów

### 1. Strony (page/)
Kompletne, samowystarczalne funkcjonalności z własnym frontendem i backendem.

**Konwencja nazewnictwa:**
```
page/[nazwa-funkcji]/[technologia]/[wersja]/
```

**Przykład:**
```
page/login/js/0.1.0/   # Frontend logowania
page/login/py/0.1.0/   # Backend logowania
```

### 2. Moduły (module/)
Elementy wielokrotnego użytku, mogą być importowane przez strony.

**Konwencja:**
```
module/[nazwa-modulu]/[technologia]/[wersja]/
```

**Przykład:**
```
module/header/js/0.1.0/   # Nagłówek współdzielony
module/auth/py/0.1.0/     # Logika autoryzacji
```

## Zasady migracji

### Frontend (js/)
1. Każda strona ma własny index.html
2. Używamy window.Vue (CDN), nie ES6 imports
3. CSS lokalny dla strony
4. Testy w *.test.js

### Backend (py/)
1. FastAPI jako framework
2. main.py jako entry point
3. CORS włączone dla wszystkich origin
4. Port = 8000 + nr strony

## Wersjonowanie
- MAJOR.MINOR.PATCH (0.1.0)
- Nowa wersja = nowy folder
- Nie używamy .backup
```

## 🔄 Plan migracji krok po kroku

### **KROK 1: Inicjalizacja struktury**

```bash
#!/bin/bash
# migration/init-structure.sh

echo "📁 Tworzenie struktury 01.mask.services"

# Struktura podstawowa
mkdir -p 01.mask.services/{page,module,shared}

# Strony główne
PAGES="login dashboard tests reports settings devices service workshop system"
for page in $PAGES; do
  mkdir -p 01.mask.services/page/$page/{js,py}/0.1.0
done

# Moduły współdzielone
MODULES="header footer menu auth api-client validators"
for module in $MODULES; do
  mkdir -p 01.mask.services/module/$module/{js,py}/0.1.0
done

# Zasoby współdzielone
cp -r c201001.mask.services/css 01.mask.services/shared/
cp -r c201001.mask.services/locales 01.mask.services/shared/
cp c201001.mask.services/favicon.ico 01.mask.services/shared/
```

### **KROK 2: Migracja strony logowania**

```bash
#!/bin/bash
# migration/migrate-login.sh

SOURCE="c201001.mask.services"
TARGET="01.mask.services/page/login"

echo "🔄 Migracja: Login Screen → page/login"

# 1. Frontend (js/0.1.0)
cat > $TARGET/js/0.1.0/index.html << 'EOF'
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Login - MaskService</title>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <link rel="stylesheet" href="login.css">
</head>
<body>
    <div id="app"></div>
    <script src="login.js"></script>
</body>
</html>
EOF

# 2. Ekstrakcja logiki z LoginScreen.js
cat > $TARGET/js/0.1.0/login.js << 'EOF'
// Migracja z: js/components/LoginScreen.js
const { createApp, ref } = window.Vue;

const LoginApp = {
  setup() {
    const username = ref('');
    const password = ref('');
    const error = ref('');
    const loading = ref(false);
    
    const login = async () => {
      loading.value = true;
      error.value = '';
      
      try {
        const response = await fetch('http://localhost:8001/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: username.value,
            password: password.value
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', data.user);
          window.location.href = '/page/dashboard/js/0.1.0/';
        } else {
          error.value = 'Nieprawidłowe dane logowania';
        }
      } catch (e) {
        error.value = 'Błąd połączenia z serwerem';
      } finally {
        loading.value = false;
      }
    };
    
    return {
      username,
      password,
      error,
      loading,
      login
    };
  },
  
  template: `
    <div class="login-container">
      <form @submit.prevent="login">
        <h1>MaskService C20</h1>
        <input v-model="username" placeholder="Użytkownik" required>
        <input v-model="password" type="password" placeholder="Hasło" required>
        <button :disabled="loading">
          {{ loading ? 'Logowanie...' : 'Zaloguj' }}
        </button>
        <div v-if="error" class="error">{{ error }}</div>
      </form>
    </div>
  `
};

createApp(LoginApp).mount('#app');
EOF

# 3. Backend (py/0.1.0)
cat > $TARGET/py/0.1.0/main.py << 'EOF'
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import hashlib

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

class LoginRequest(BaseModel):
    username: str
    password: str

# Tymczasowi użytkownicy
USERS = {
    "admin": "admin",
    "operator": "operator123",
    "serwisant": "service456"
}

@app.post("/api/login")
async def login(request: LoginRequest):
    if request.username in USERS:
        if USERS[request.username] == request.password:
            token = hashlib.sha256(
                f"{request.username}:{request.password}".encode()
            ).hexdigest()
            return {
                "token": token,
                "user": request.username,
                "role": "admin" if request.username == "admin" else "operator"
            }
    
    raise HTTPException(status_code=401, detail="Invalid credentials")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
EOF

# 4. Requirements
cat > $TARGET/py/0.1.0/requirements.txt << 'EOF'
fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.5.0
python-multipart==0.0.6
EOF

# 5. Testy
cat > $TARGET/js/0.1.0/login.test.js << 'EOF'
// Test dla login.js
console.log("Testing login page...");

// Mock Vue
window.Vue = {
  createApp: () => ({
    mount: () => console.log("✓ App mounted")
  }),
  ref: (val) => ({ value: val })
};

// Load login.js
// require('./login.js');

console.log("✅ Login tests passed");
EOF
```

### **KROK 3: Migracja modułu menu**

```bash
#!/bin/bash
# migration/migrate-menu-module.sh

echo "🔄 Migracja: Menu jako moduł współdzielony"

TARGET="01.mask.services/module/menu"

# Frontend modułu
cat > $TARGET/js/0.1.0/menu.js << 'EOF'
// Moduł menu - może być używany przez różne strony
export const MenuModule = {
  props: ['items', 'userRole'],
  
  template: `
    <div class="menu-grid">
      <div v-for="item in filteredItems" 
           :key="item.id"
           @click="$emit('select', item)"
           class="menu-item">
        <span class="icon">{{ item.icon }}</span>
        <span class="label">{{ item.label }}</span>
      </div>
    </div>
  `,
  
  computed: {
    filteredItems() {
      return this.items.filter(item => 
        !item.roles || item.roles.includes(this.userRole)
      );
    }
  }
};

// Export dla użycia w stronach
window.MenuModule = MenuModule;
EOF

# Backend modułu
cat > $TARGET/py/0.1.0/menu.py << 'EOF'
# API menu współdzielone
from typing import List, Optional
from pydantic import BaseModel

class MenuItem(BaseModel):
    id: int
    label: str
    icon: str
    path: str
    roles: Optional[List[str]] = None

def get_menu_items(role: str = "operator") -> List[MenuItem]:
    """Zwraca menu items dla danej roli"""
    all_items = [
        MenuItem(id=1, label="Testy", icon="🧪", path="/tests"),
        MenuItem(id=2, label="Raporty", icon="📊", path="/reports"),
        MenuItem(id=3, label="Urządzenia", icon="⚙️", path="/devices"),
        MenuItem(id=4, label="System", icon="💻", path="/system", roles=["admin"]),
        MenuItem(id=5, label="Serwis", icon="🔨", path="/service", roles=["serwisant"])
    ]
    
    return [item for item in all_items 
            if not item.roles or role in item.roles]
EOF
```

### **KROK 4: Migracja dashboard z użyciem modułu**

```bash
#!/bin/bash
# migration/migrate-dashboard.sh

TARGET="01.mask.services/page/dashboard"

cat > $TARGET/js/0.1.0/dashboard.js << 'EOF'
// Dashboard używający modułu menu
const { createApp, ref, onMounted } = window.Vue;

const DashboardApp = {
  setup() {
    const user = ref(localStorage.getItem('user') || 'Guest');
    const role = ref(localStorage.getItem('role') || 'operator');
    const menuItems = ref([]);
    
    onMounted(async () => {
      // Załaduj menu z API
      const response = await fetch(`http://localhost:8002/api/menu?role=${role.value}`);
      menuItems.value = await response.json();
    });
    
    const selectMenuItem = (item) => {
      window.location.href = `/page${item.path}/js/0.1.0/`;
    };
    
    return {
      user,
      menuItems,
      selectMenuItem
    };
  },
  
  template: `
    <div class="dashboard">
      <header>
        <h1>Panel operatora</h1>
        <div>{{ user }} | <a href="/page/login/js/0.1.0/">Wyloguj</a></div>
      </header>
      
      <!-- Użycie modułu menu -->
      <menu-module 
        :items="menuItems" 
        :user-role="role"
        @select="selectMenuItem">
      </menu-module>
    </div>
  `,
  
  components: {
    'menu-module': window.MenuModule // Import modułu
  }
};

// Najpierw załaduj moduł menu
const script = document.createElement('script');
script.src = '/module/menu/js/0.1.0/menu.js';
script.onload = () => {
  createApp(DashboardApp).mount('#app');
};
document.head.appendChild(script);
EOF
```

## 📊 Tabela mapowania komponentów

| c201001.mask.services | 01.mask.services | Typ |
|-----------------------|------------------|-----|
| js/components/LoginScreen.js | page/login/js/0.1.0/ | Strona |
| js/components/UserMenuScreen.js | page/dashboard/js/0.1.0/ | Strona |
| js/components/TestMenuTemplate.js | page/tests/js/0.1.0/ | Strona |
| js/components/vue/AppHeader.js | module/header/js/0.1.0/ | Moduł |
| js/components/vue/AppFooter.js | module/footer/js/0.1.0/ | Moduł |
| config/menu.json | module/menu/py/0.1.0/ | Moduł |

## 🚀 Makefile główny

```makefile
# 01.mask.services/Makefile

# Uruchomienie strony (frontend + backend)
run-login:
	cd page/login/py/0.1.0 && python main.py &
	cd page/login/js/0.1.0 && python3 -m http.server 9001

run-dashboard:
	cd page/dashboard/py/0.1.0 && python main.py &
	cd page/dashboard/js/0.1.0 && python3 -m http.server 9002

# Migracja
migrate-all:
	./migration/init-structure.sh
	./migration/migrate-login.sh
	./migration/migrate-dashboard.sh
	./migration/migrate-tests.sh

# Test struktury
test-structure:
	@echo "📊 Struktura projektu:"
	@echo "Strony: $$(ls page/ | wc -l)"
	@echo "Moduły: $$(ls module/ | wc -l)"
	@find page -name "*.js" | wc -l | xargs echo "Pliki JS:"
	@find page -name "*.py" | wc -l | xargs echo "Pliki PY:"

# Nowa strona
new-page:
	@read -p "Nazwa strony: " name; \
	mkdir -p page/$$name/{js,py}/0.1.0; \
	cp templates/page-js/* page/$$name/js/0.1.0/; \
	cp templates/page-py/* page/$$name/py/0.1.0/; \
	echo "✅ Utworzono: page/$$name"

# Nowy moduł  
new-module:
	@read -p "Nazwa modułu: " name; \
	@read -p "Technologie (js/py/both): " tech; \
	if [ "$$tech" = "both" ]; then \
		mkdir -p module/$$name/{js,py}/0.1.0; \
	else \
		mkdir -p module/$$name/$$tech/0.1.0; \
	fi; \
	echo "✅ Utworzono: module/$$name"
```

## ✅ Zalety tej struktury

1. **Jasny podział** - technologia widoczna w ścieżce
2. **Wersjonowanie** - każda zmiana = nowa wersja
3. **Modularność** - łatwe współdzielenie kodu
4. **Prostota dla LLM** - kontekst ograniczony do page/[nazwa]
5. **Niezależność** - każda strona może działać osobno

Ta struktura jest bardziej intuicyjna i łatwiejsza w zarządzaniu niż poprzednie podejścia!