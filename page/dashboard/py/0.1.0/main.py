"""
FastAPI backend for dashboard page
Port: 8002 (page number-based port assignment)
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import jwt
from typing import List, Optional
from datetime import datetime

# FastAPI application
app = FastAPI(title="MaskService Dashboard API", version="0.1.0")

# CORS middleware - allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JWT Secret (should match login service)
JWT_SECRET = "maskservice-c20-login-secret-key"

# Response models
class MenuItem(BaseModel):
    id: str
    icon: str
    label: str
    description: str
    path: str

class MenuResponse(BaseModel):
    role: str
    items: List[MenuItem]
    total_items: int

class UserStats(BaseModel):
    username: str
    role: str
    login_time: Optional[str] = None
    last_activity: Optional[str] = None
    session_duration: Optional[str] = None

# Menu configurations for different roles
MENU_CONFIGS = {
    "OPERATOR": [
        {"id": "test_menu", "icon": "🧪", "label": "Test Menu", "description": "Rozpocznij testy urządzeń", "path": "/page/tests/js/0.1.0/"},
        {"id": "device_select", "icon": "🛡️", "label": "Device Selection", "description": "Wybierz urządzenie do testów", "path": "/page/devices/js/0.1.0/"},
        {"id": "user_data", "icon": "👤", "label": "User Data", "description": "Dane użytkownika", "path": "/page/settings/js/0.1.0/"},
        {"id": "device_data", "icon": "📊", "label": "Device Data", "description": "Dane urządzenia", "path": "/page/devices/js/0.1.0/"},
        {"id": "test_reports", "icon": "📋", "label": "Test Reports", "description": "Raporty testów", "path": "/page/reports/js/0.1.0/"},
        {"id": "realtime_sensors", "icon": "📡", "label": "Real-time Sensors", "description": "Czujniki w czasie rzeczywistym", "path": "/page/devices/js/0.1.0/"},
        {"id": "device_history", "icon": "📈", "label": "Device History", "description": "Historia urządzenia", "path": "/page/devices/js/0.1.0/"}
    ],
    "ADMIN": [
        {"id": "test_menu", "icon": "🧪", "label": "Test Menu", "description": "Zarządzanie testami", "path": "/page/tests/js/0.1.0/"},
        {"id": "user_data", "icon": "👤", "label": "User Data", "description": "Dane użytkownika", "path": "/page/settings/js/0.1.0/"},
        {"id": "users", "icon": "👥", "label": "Users Management", "description": "Zarządzanie użytkownikami", "path": "/page/settings/js/0.1.0/"},
        {"id": "reports_view", "icon": "📊", "label": "Reports View", "description": "Przeglądanie raportów", "path": "/page/reports/js/0.1.0/"},
        {"id": "reports_batch", "icon": "📋", "label": "Batch Reports", "description": "Raporty zbiorcze", "path": "/page/reports/js/0.1.0/"},
        {"id": "reports_schedule", "icon": "⏰", "label": "Reports Schedule", "description": "Harmonogram raportów", "path": "/page/reports/js/0.1.0/"},
        {"id": "device_history", "icon": "📈", "label": "Device History", "description": "Historia urządzeń", "path": "/page/devices/js/0.1.0/"},
        {"id": "workshop", "icon": "🔧", "label": "Workshop", "description": "Warsztat serwisowy", "path": "/page/workshop/js/0.1.0/"},
        {"id": "settings_system", "icon": "⚙️", "label": "System Settings", "description": "Ustawienia systemu", "path": "/page/system/js/0.1.0/"}
    ],
    "SUPERUSER": [
        {"id": "test_menu", "icon": "🧪", "label": "Test Menu", "description": "Kompletne zarządzanie testami", "path": "/page/tests/js/0.1.0/"},
        {"id": "user_data", "icon": "👤", "label": "User Data", "description": "Dane użytkownika", "path": "/page/settings/js/0.1.0/"},
        {"id": "users", "icon": "👥", "label": "Users Management", "description": "Zarządzanie wszystkimi użytkownikami", "path": "/page/settings/js/0.1.0/"},
        {"id": "reports_view", "icon": "📊", "label": "Reports View", "description": "Wszystkie raporty", "path": "/page/reports/js/0.1.0/"},
        {"id": "reports_batch", "icon": "📋", "label": "Batch Reports", "description": "Raporty zbiorcze", "path": "/page/reports/js/0.1.0/"},
        {"id": "reports_schedule", "icon": "⏰", "label": "Reports Schedule", "description": "Zaawansowany harmonogram", "path": "/page/reports/js/0.1.0/"},
        {"id": "device_history", "icon": "📈", "label": "Device History", "description": "Pełna historia urządzeń", "path": "/page/devices/js/0.1.0/"},
        {"id": "workshop", "icon": "🔧", "label": "Workshop", "description": "Zarządzanie warsztatem", "path": "/page/workshop/js/0.1.0/"},
        {"id": "settings_system", "icon": "⚙️", "label": "System Settings", "description": "Zaawansowane ustawienia", "path": "/page/system/js/0.1.0/"},
        {"id": "settings_integration", "icon": "🔗", "label": "Integrations", "description": "Integracje zewnętrzne", "path": "/page/system/js/0.1.0/"},
        {"id": "settings_standards", "icon": "📏", "label": "Standards", "description": "Standardy i normy", "path": "/page/system/js/0.1.0/"},
        {"id": "settings_scenarios", "icon": "🎯", "label": "Scenarios", "description": "Scenariusze testowe", "path": "/page/system/js/0.1.0/"},
        {"id": "service_menu", "icon": "🛠️", "label": "Service Menu", "description": "Menu serwisowe", "path": "/page/service/js/0.1.0/"},
        {"id": "advanced_diagnostics", "icon": "🔍", "label": "Advanced Diagnostics", "description": "Zaawansowana diagnostyka", "path": "/page/system/js/0.1.0/"}
    ],
    "SERVICEUSER": [
        {"id": "test_menu", "icon": "🧪", "label": "Test Menu", "description": "Menu testów serwisowych", "path": "/page/tests/js/0.1.0/"},
        {"id": "user_data", "icon": "👤", "label": "User Data", "description": "Dane serviceusera", "path": "/page/settings/js/0.1.0/"},
        {"id": "device_data", "icon": "📊", "label": "Device Data", "description": "Dane urządzenia", "path": "/page/devices/js/0.1.0/"},
        {"id": "test_reports", "icon": "📋", "label": "Test Reports", "description": "Raporty serwisowe", "path": "/page/reports/js/0.1.0/"},
        {"id": "realtime_sensors", "icon": "📡", "label": "Real-time Sensors", "description": "Monitoring czujników", "path": "/page/devices/js/0.1.0/"},
        {"id": "device_history", "icon": "📈", "label": "Device History", "description": "Historia serwisowania", "path": "/page/devices/js/0.1.0/"},
        {"id": "workshop_parts", "icon": "🔩", "label": "Workshop Parts", "description": "Części zamienne", "path": "/page/workshop/js/0.1.0/"},
        {"id": "workshop_maintenance", "icon": "🔧", "label": "Maintenance", "description": "Harmonogram konserwacji", "path": "/page/workshop/js/0.1.0/"},
        {"id": "workshop_tools", "icon": "🛠️", "label": "Tools", "description": "Narzędzia serwisowe", "path": "/page/workshop/js/0.1.0/"},
        {"id": "workshop_inventory", "icon": "📦", "label": "Inventory", "description": "Inwentarz warsztatowy", "path": "/page/workshop/js/0.1.0/"},
        {"id": "service_menu", "icon": "⚙️", "label": "Service Menu", "description": "Menu serwisowe", "path": "/page/service/js/0.1.0/"},
        {"id": "advanced_diagnostics", "icon": "🔍", "label": "Advanced Diagnostics", "description": "Diagnostyka zaawansowana", "path": "/page/system/js/0.1.0/"}
    ]
}

def verify_token(token: str):
    """Verify JWT token (optional dependency)"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload
    except:
        return None

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "MaskService Dashboard API v0.1.0", "status": "active"}

@app.get("/api/menu", response_model=MenuResponse)
async def get_menu(role: str = "OPERATOR"):
    """
    Get menu items for specified role
    
    Args:
        role: User role (OPERATOR, ADMIN, SUPERUSER, SERVICEUSER)
    """
    role = role.upper()
    
    if role not in MENU_CONFIGS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid role: {role}. Available roles: {list(MENU_CONFIGS.keys())}"
        )
    
    menu_items = [MenuItem(**item) for item in MENU_CONFIGS[role]]
    
    return MenuResponse(
        role=role,
        items=menu_items,
        total_items=len(menu_items)
    )

@app.get("/api/user/stats")
async def get_user_stats(token: Optional[str] = None):
    """Get user session statistics"""
    if token:
        user_data = verify_token(token)
        if user_data:
            return UserStats(
                username=user_data.get("username", "Unknown"),
                role=user_data.get("role", "OPERATOR"),
                login_time=datetime.now().isoformat(),
                last_activity=datetime.now().isoformat(),
                session_duration="Active"
            )
    
    return UserStats(
        username="Guest",
        role="OPERATOR",
        login_time="Not authenticated",
        last_activity="Not authenticated",
        session_duration="Not authenticated"
    )

@app.get("/api/menu/search")
async def search_menu(query: str, role: str = "OPERATOR"):
    """Search menu items by query"""
    role = role.upper()
    
    if role not in MENU_CONFIGS:
        raise HTTPException(status_code=400, detail=f"Invalid role: {role}")
    
    all_items = MENU_CONFIGS[role]
    query_lower = query.lower()
    
    # Search in label and description
    filtered_items = [
        item for item in all_items
        if query_lower in item["label"].lower() or query_lower in item["description"].lower()
    ]
    
    return {
        "query": query,
        "role": role,
        "results": [MenuItem(**item) for item in filtered_items],
        "total_results": len(filtered_items)
    }

@app.post("/api/menu/track")
async def track_menu_selection(menu_id: str, role: str = "OPERATOR"):
    """Track menu item selection for analytics"""
    return {
        "tracked": True,
        "menu_id": menu_id,
        "role": role,
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting MaskService Dashboard API on http://localhost:8002")
    uvicorn.run(app, host="0.0.0.0", port=8002)
