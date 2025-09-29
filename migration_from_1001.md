# 📋 Plan Migracji 1001 → 01 z Promptami dla LLM

przenieś kolejne moduły z /home/tom/github/zlecenia/1001.mask.services/js/components
do /home/tom/github/zlecenia/01.mask.services/*/*/*/* uwzględniając wskazówki migracji z pliku /home/tom/github/zlecenia/01.mask.services/components.md


- makefile dla wszystkich procesow w module/*/makefile i  page/*/makefile
- ./scripts/*.sh  ./scripts/*.py dla skryptow uzywanych z makefile
- testowanie poszczegolnych modulow jeden po drugim


stworz dodatkowoe pliki jesli to koneiczne i dodaj scripts w package.json oraz zaktualizuj dokumetnacje README.md w każdym module, aby
po wejściu do folderu feature, np  /home/tom/github/zlecenia/01.mask.services/module/header/js/0.1.0/   uruchomienie danego rozszerzenia w przegladarce poprzez docker w celu przetetsowania /home/tom/github/zlecenia/01.mask.services/module/header/docker/0.1.0/


## 🎯 Strategia migracji

### Mapowanie komponentów na strony

| Strona docelowa | Komponenty z 1001 do konsolidacji | Priorytet |
|-----------------|-----------------------------------|-----------|
| **page/login** | loginForm + appHeader + appFooter | 🔴 HIGH |
| **page/dashboard** | mainMenu + userMenu + pageTemplate | 🔴 HIGH |
| **page/tests** | testMenu + testReports + pressurePanel + realtimeSensors | 🔴 HIGH |
| **page/reports** | reportsViewer + reportsBatch + reportsSchedule + reportsView | 🟡 MEDIUM |
| **page/devices** | deviceData + deviceHistory + deviceSelect | 🟡 MEDIUM |
| **page/settings** | systemSettings + systemIntegration + systemScenarios | 🟡 MEDIUM |
| **page/workshop** | workshop + workshopInventory + workshopMaintenance + workshopParts + workshopTools | 🟢 LOW |
| **page/users** | users + userData + auditLogViewer | 🟢 LOW |
| **page/service** | serviceMenu + calibration + diagnostics | 🟢 LOW |

## 📝 Prompty dla LLM - Krok po kroku

### **PROMPT 1: Analiza komponentów**

```
Przeanalizuj następujące komponenty z projektu 1001.mask.services:
- loginForm (js/features/loginForm/0.1.0/)
- appHeader (js/features/appHeader/0.1.0/)
- appFooter (js/features/appFooter/0.1.0/)

Wypisz:
1. Główną funkcjonalność każdego komponentu
2. Zależności między komponentami
3. Używane metody i data properties
4. Template HTML każdego komponentu

Cel: Przygotowanie do konsolidacji w jedną stronę logowania.
```

### **PROMPT 2: Tworzenie strony login**

```
Stwórz nową stronę logowania dla projektu 01.mask.services w strukturze:
page/login/js/0.1.0/

Wymagania:
1. Skonsoliduj funkcjonalności z loginForm, appHeader i appFooter w jeden plik
2. Użyj window.Vue (CDN), NIE używaj importów ES6
3. Stwórz pliki:
   - index.html (prosty HTML z Vue CDN)
   - login.js (cała logika)
   - login.css (style lokalne)
   - login.test.js (podstawowe testy)
   - package.json (minimalne)

Szablon login.js:
```javascript
const { createApp, ref, computed } = window.Vue;

const LoginPage = {
  setup() {
    // Tu logika z loginForm
    return { /* ... */ };
  },
  template: `
    <div class="login-page">
      <!-- Header z appHeader -->
      <!-- Form z loginForm -->
      <!-- Footer z appFooter -->
    </div>
  `
};

createApp(LoginPage).mount('#app');
```

### **PROMPT 3: Backend dla strony login**

```
Stwórz backend API dla strony logowania w strukturze:
page/login/py/0.1.0/

Pliki do utworzenia:
1. main.py - FastAPI aplikacja z endpointem /api/login
2. models.py - Pydantic modele (LoginRequest, LoginResponse)
3. requirements.txt - minimalne zależności
4. test_api.py - testy

Wymagania:
- FastAPI z CORS enabled
- Endpoint POST /api/login
- Walidacja użytkowników (tymczasowo hardcoded)
- Port 8001

Szablon main.py:
```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"])

class LoginRequest(BaseModel):
    username: str
    password: str

@app.post("/api/login")
async def login(request: LoginRequest):
    # Logika logowania
    pass
```

### **PROMPT 4: Dashboard - analiza**

```
Przeanalizuj komponenty dla dashboard:
- mainMenu (js/features/mainMenu/0.1.0/)
- userMenu (js/features/userMenu/0.1.0/)  
- pageTemplate (js/features/pageTemplate/0.1.0/)

Znajdź:
1. Strukturę menu items
2. Role użytkowników i uprawnienia
3. Wspólne elementy UI
4. Routing/nawigację

Przygotuj plan konsolidacji tych 3 komponentów w jedną stronę dashboard.
```

### **PROMPT 5: Tworzenie strony dashboard**

```
Stwórz stronę dashboard konsolidując mainMenu + userMenu + pageTemplate.

Struktura: page/dashboard/js/0.1.0/

Wymagania:
1. Połącz menu items z obu komponentów
2. Zachowaj filtrowanie po rolach
3. Użyj grid layout dla opcji menu
4. Dodaj header z info o użytkowniku
5. window.location.href dla nawigacji (bez routera)

Template powinien zawierać:
- Header z nazwą użytkownika i logout
- Grid z opcjami menu (filtrowane po roli)
- Footer ze statusem systemu
```

### **PROMPT 6: Strona testów - złożona konsolidacja**

```
Skonsoliduj komponenty testowe w jedną stronę:
- testMenu → lista testów
- testReports → wyświetlanie raportów
- pressurePanel → panel ciśnienia
- realtimeSensors → czujniki

Struktura: page/tests/js/0.1.0/

Stwórz uproszczoną wersję z 3 widokami:
1. Lista testów (view='list')
2. Wykonanie testu (view='execution') 
3. Raporty (view='reports')

Użyj v-if do przełączania widoków.
Zachowaj tylko kluczowe funkcje, usuń złożoność.
```

### **PROMPT 7: Moduł współdzielony**

```
Wyodrębnij wspólną funkcjonalność menu do modułu:
module/menu/js/0.1.0/menu.js

Moduł powinien:
1. Eksportować komponent Vue do window.MenuModule
2. Przyjmować props: items, userRole
3. Emitować event 'select' przy wyborze
4. Filtrować items po rolach

Przykład użycia w stronach:
```javascript
components: {
  'menu-module': window.MenuModule
}
```

### **PROMPT 8: Skrypt migracji**

```
Napisz skrypt bash do automatycznej migracji komponentu.

migration/migrate-component.sh

Parametry:
1. Nazwa komponentu źródłowego
2. Nazwa strony docelowej
3. Technologia (js/py)

Skrypt powinien:
1. Kopiować pliki z 1001/js/features/[component]/0.1.0/
2. Tworzyć strukturę 01/page/[name]/[tech]/0.1.0/
3. Modyfikować importy (ES6 → window.Vue)
4. Generować standalone.html
5. Tworzyć package.json

Przykład użycia:
./migrate-component.sh loginForm login js
```

## 🔧 Skrypty pomocnicze

### **analyze-for-consolidation.js**
```javascript
// Analizuje które komponenty można skonsolidować
const fs = require('fs');
const path = require('path');

const components = fs.readdirSync('1001.mask.services/js/features');

const groups = {
  login: ['loginForm', 'appHeader', 'appFooter'],
  dashboard: ['mainMenu', 'userMenu', 'pageTemplate'],
  tests: ['testMenu', 'testReports', 'pressurePanel'],
  // ...
};

for (const [page, comps] of Object.entries(groups)) {
  console.log(`\n📦 ${page}:`);
  for (const comp of comps) {
    if (components.includes(comp)) {
      const size = getComponentSize(comp);
      console.log(`  ✓ ${comp} (${size} lines)`);
    }
  }
}
```

### **Makefile dla migracji**
```makefile
# 01.mask.services/Makefile

# Migracja strony krok po kroku
migrate-login:
	@echo "📦 Migracja: Login"
	@echo "Komponenty: loginForm + appHeader + appFooter"
	./migration/consolidate.sh login "loginForm appHeader appFooter"

migrate-dashboard:
	@echo "📦 Migracja: Dashboard"
	@echo "Komponenty: mainMenu + userMenu + pageTemplate"
	./migration/consolidate.sh dashboard "mainMenu userMenu pageTemplate"

# Status migracji
status:
	@echo "📊 Status migracji:"
	@echo "Komponenty 1001: $$(ls ../1001.mask.services/js/features | wc -l)"
	@echo "Strony 01: $$(ls page 2>/dev/null | wc -l)"
	@echo ""
	@echo "✅ Zmigrowane:"
	@ls -la page 2>/dev/null || echo "(brak)"
	@echo ""
	@echo "⏳ Do migracji:"
	@echo "- tests (4 komponenty)"
	@echo "- reports (4 komponenty)"
	@echo "- devices (3 komponenty)"

# Test zmigrowanej strony
test-page-%:
	cd page/$*/js/0.1.0 && python3 -m http.server 9000 &
	cd page/$*/py/0.1.0 && python main.py &
	open http://localhost:9000
```

## ✅ Checklist migracji

### Dla każdej strony:
- [ ] Analiza komponentów źródłowych
- [ ] Konsolidacja templates
- [ ] Połączenie metod i data
- [ ] Uproszczenie logiki
- [ ] Utworzenie backend API
- [ ] Test standalone
- [ ] Porównanie z oryginałem

### Końcowa weryfikacja:
- [ ] Wszystkie funkcje działają
- [ ] Brak zależności między stronami
- [ ] Każda strona < 500 linii kodu
- [ ] Backend odpowiada na wszystkie endpoints

## 📊 Metryki sukcesu

| Metryka | 1001.mask.services | 01.mask.services | Redukcja |
|---------|-------------------|------------------|----------|
| Komponenty/Strony | 40+ | 9 | 78% |
| Pliki JS | 200+ | 18 | 91% |
| Linie kodu | ~15,000 | ~4,500 | 70% |
| Złożoność | Bardzo wysoka | Niska | 85% |
| Czas LLM na zmianę | 30+ min | 5 min | 83% |

Ta migracja drastycznie upraszcza architekturę, redukując liczbę komponentów z 40+ do 9 stron!