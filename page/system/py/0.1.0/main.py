"""
FastAPI backend for system page
Port: 8004 (page number-based port assignment)
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
import psutil
import platform
import uuid

# FastAPI application
app = FastAPI(title="MaskService System API", version="0.1.0")

# CORS middleware - allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response models
class SystemInfo(BaseModel):
    name: str
    version: str
    status: str
    modules: List[str]
    platform: str
    uptime: float
    memory_usage: float
    cpu_usage: float

class SystemModule(BaseModel):
    name: str
    version: str
    status: str
    description: str
    last_updated: str

class SystemRestart(BaseModel):
    reason: Optional[str] = "Manual restart"
    delay_seconds: int = 5

class SystemHealthCheck(BaseModel):
    status: str
    timestamp: str
    services: Dict[str, str]
    modules: List[str]
    system_load: Dict[str, float]

# System modules registry
SYSTEM_MODULES = [
    {
        "name": "Authentication",
        "version": "0.1.0",
        "status": "active",
        "description": "User authentication and authorization module",
        "last_updated": "2024-01-20T10:00:00Z"
    },
    {
        "name": "Testing",
        "version": "0.1.0", 
        "status": "active",
        "description": "Device testing and validation module",
        "last_updated": "2024-01-20T10:00:00Z"
    },
    {
        "name": "Reports",
        "version": "0.1.0",
        "status": "active", 
        "description": "Report generation and management module",
        "last_updated": "2024-01-20T10:00:00Z"
    },
    {
        "name": "Dashboard",
        "version": "0.1.0",
        "status": "active",
        "description": "Main dashboard and navigation module",
        "last_updated": "2024-01-20T10:00:00Z"
    },
    {
        "name": "Devices",
        "version": "0.1.0",
        "status": "pending",
        "description": "Device management and configuration module",
        "last_updated": "2024-01-20T10:00:00Z"
    }
]

# System status tracking
system_status = {
    "name": "MASKTRONIC C20",
    "version": "0.1.0",
    "status": "online",
    "startup_time": datetime.now().isoformat(),
    "restart_count": 0
}

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "MaskService System API v0.1.0", "status": "active"}

@app.get("/api/system/health", response_model=SystemHealthCheck)
async def get_system_health():
    """
    Get comprehensive system health information
    """
    try:
        # Get system metrics
        memory = psutil.virtual_memory()
        cpu_percent = psutil.cpu_percent(interval=1)
        disk = psutil.disk_usage('/')
        
        # Check service status
        services = {
            "api": "online",
            "database": "online",  # Would check actual DB in production
            "authentication": "online",
            "testing_engine": "online"
        }
        
        # Active modules
        active_modules = [mod["name"] for mod in SYSTEM_MODULES if mod["status"] == "active"]
        
        system_load = {
            "cpu_usage": cpu_percent,
            "memory_usage": memory.percent,
            "disk_usage": (disk.used / disk.total) * 100,
            "load_average": psutil.getloadavg()[0] if hasattr(psutil, 'getloadavg') else 0.0
        }
        
        health_status = "online" if all(status == "online" for status in services.values()) else "degraded"
        
        return SystemHealthCheck(
            status=health_status,
            timestamp=datetime.now().isoformat(),
            services=services,
            modules=active_modules,
            system_load=system_load
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Health check failed: {str(e)}")

@app.get("/api/system/info", response_model=SystemInfo)
async def get_system_info():
    """
    Get detailed system information
    """
    try:
        # System metrics
        memory = psutil.virtual_memory()
        cpu_percent = psutil.cpu_percent(interval=1)
        boot_time = psutil.boot_time()
        uptime = datetime.now().timestamp() - boot_time
        
        # Active modules
        active_modules = [mod["name"] for mod in SYSTEM_MODULES if mod["status"] == "active"]
        
        return SystemInfo(
            name=system_status["name"],
            version=system_status["version"],
            status=system_status["status"],
            modules=active_modules,
            platform=f"{platform.system()} {platform.release()}",
            uptime=uptime,
            memory_usage=memory.percent,
            cpu_usage=cpu_percent
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get system info: {str(e)}")

@app.get("/api/system/modules", response_model=List[SystemModule])
async def get_system_modules():
    """
    Get all system modules with their status
    """
    return [SystemModule(**module) for module in SYSTEM_MODULES]

@app.post("/api/system/modules/{module_name}/toggle")
async def toggle_module(module_name: str):
    """
    Toggle module status (enable/disable)
    """
    module = next((mod for mod in SYSTEM_MODULES if mod["name"] == module_name), None)
    
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    
    # Toggle status
    new_status = "inactive" if module["status"] == "active" else "active"
    module["status"] = new_status
    module["last_updated"] = datetime.now().isoformat()
    
    return {
        "message": f"Module {module_name} {'activated' if new_status == 'active' else 'deactivated'}",
        "module": module
    }

@app.post("/api/system/restart")
async def restart_system(restart_info: SystemRestart):
    """
    Initiate system restart (simulation)
    """
    system_status["restart_count"] += 1
    system_status["status"] = "restarting"
    
    restart_id = str(uuid.uuid4())
    
    # In a real system, this would trigger actual restart procedures
    # For demo purposes, we'll simulate the restart process
    
    return {
        "message": "System restart initiated",
        "restart_id": restart_id,
        "reason": restart_info.reason,
        "delay_seconds": restart_info.delay_seconds,
        "estimated_completion": datetime.now().isoformat()
    }

@app.post("/api/system/shutdown")
async def shutdown_system():
    """
    Initiate system shutdown (simulation)
    """
    system_status["status"] = "shutting_down"
    
    return {
        "message": "System shutdown initiated",
        "timestamp": datetime.now().isoformat(),
        "final_status": "offline"
    }

@app.get("/api/system/logs")
async def get_system_logs(limit: int = 50, level: str = "all"):
    """
    Get system logs (simulation)
    """
    # Simulated log entries
    log_levels = ["INFO", "WARNING", "ERROR", "DEBUG"]
    log_entries = []
    
    for i in range(limit):
        log_entries.append({
            "id": str(uuid.uuid4()),
            "timestamp": datetime.now().isoformat(),
            "level": log_levels[i % len(log_levels)],
            "module": SYSTEM_MODULES[i % len(SYSTEM_MODULES)]["name"],
            "message": f"System operation {i+1} completed successfully",
            "details": f"Processing module {SYSTEM_MODULES[i % len(SYSTEM_MODULES)]['name']}"
        })
    
    # Filter by level if specified
    if level != "all":
        log_entries = [log for log in log_entries if log["level"].lower() == level.lower()]
    
    return {
        "logs": log_entries,
        "total": len(log_entries),
        "filter": level,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/system/performance")
async def get_performance_metrics():
    """
    Get system performance metrics
    """
    try:
        # CPU metrics
        cpu_count = psutil.cpu_count()
        cpu_percent = psutil.cpu_percent(interval=1, percpu=True)
        cpu_freq = psutil.cpu_freq()
        
        # Memory metrics
        memory = psutil.virtual_memory()
        swap = psutil.swap_memory()
        
        # Disk metrics
        disk = psutil.disk_usage('/')
        disk_io = psutil.disk_io_counters()
        
        # Network metrics (if available)
        try:
            network = psutil.net_io_counters()
            network_stats = {
                "bytes_sent": network.bytes_sent,
                "bytes_recv": network.bytes_recv,
                "packets_sent": network.packets_sent,
                "packets_recv": network.packets_recv
            }
        except:
            network_stats = {}
        
        return {
            "cpu": {
                "count": cpu_count,
                "usage_percent": cpu_percent,
                "frequency_mhz": cpu_freq.current if cpu_freq else None
            },
            "memory": {
                "total_gb": round(memory.total / (1024**3), 2),
                "available_gb": round(memory.available / (1024**3), 2),
                "used_percent": memory.percent,
                "swap_used_percent": swap.percent
            },
            "disk": {
                "total_gb": round(disk.total / (1024**3), 2),
                "free_gb": round(disk.free / (1024**3), 2),
                "used_percent": round((disk.used / disk.total) * 100, 2),
                "io_read_bytes": disk_io.read_bytes if disk_io else 0,
                "io_write_bytes": disk_io.write_bytes if disk_io else 0
            },
            "network": network_stats,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get performance metrics: {str(e)}")

@app.get("/api/system/status")
async def get_system_status():
    """
    Get current system status
    """
    return {
        **system_status,
        "current_time": datetime.now().isoformat(),
        "active_modules": len([mod for mod in SYSTEM_MODULES if mod["status"] == "active"]),
        "total_modules": len(SYSTEM_MODULES)
    }

@app.get("/health")
async def health_check():
    """Health check endpoint for Docker container health monitoring"""
    return {
        "status": "healthy",
        "service": "system",
        "version": "0.1.0",
        "timestamp": "2025-09-29"
    }

if __name__ == "__main__":
    import uvicorn
    print("🛡️ Starting MaskService System API on http://localhost:8004")
    uvicorn.run(app, host="0.0.0.0", port=8004)
