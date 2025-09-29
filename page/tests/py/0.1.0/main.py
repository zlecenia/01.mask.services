"""
FastAPI backend for tests page
Port: 8003 (page number-based port assignment)
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

# FastAPI application
app = FastAPI(title="MaskService Tests API", version="0.1.0")

# CORS middleware - allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response models
class TestStartRequest(BaseModel):
    option: str
    user: str
    role: str

class TestConfigRequest(BaseModel):
    name: str
    description: Optional[str] = ""
    device: Dict[str, Any]
    test: Dict[str, Any]
    parameters: Dict[str, Any]
    save_as_template: bool = False

class TestScenario(BaseModel):
    id: str
    name: str
    description: str
    steps: List[str]
    duration: int
    created: str

class TestTemplate(BaseModel):
    id: str
    name: str
    description: str
    device_type: str
    test_type: str
    is_template: bool = True

class TestHistory(BaseModel):
    id: str
    name: str
    device: str
    result: str
    date: str
    duration: str

# In-memory storage (in production, use proper database)
test_scenarios = [
    {
        "id": "sc1",
        "name": "High Pressure Test",
        "description": "Test for high pressure environments",
        "steps": ["Init", "Pressure", "Hold", "Release"],
        "duration": 600,
        "created": "2024-01-15"
    },
    {
        "id": "sc2", 
        "name": "Endurance Test",
        "description": "Long duration endurance testing",
        "steps": ["Init", "Cycle", "Monitor", "Report"],
        "duration": 3600,
        "created": "2024-01-10"
    }
]

test_templates = [
    {
        "id": "tmpl_001",
        "name": "Standard FFP2 Test",
        "description": "Standard testing protocol for FFP2 masks",
        "device_type": "Respiratory Mask",
        "test_type": "Pressure Test",
        "is_template": True
    },
    {
        "id": "tmpl_002",
        "name": "Quick Filter Test", 
        "description": "Quick efficiency test for filters",
        "device_type": "Filter",
        "test_type": "Efficiency Test",
        "is_template": True
    }
]

test_history = [
    {
        "id": "test_001",
        "name": "Mask Pressure Test",
        "device": "FFP2 Mask",
        "result": "PASSED",
        "date": "2024-01-20T10:30:00Z",
        "duration": "00:05:30"
    },
    {
        "id": "test_002",
        "name": "Filter Efficiency Test",
        "device": "FFP3 Filter", 
        "result": "FAILED",
        "date": "2024-01-19T14:15:00Z",
        "duration": "00:08:45"
    }
]

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "MaskService Tests API v0.1.0", "status": "active"}

@app.post("/api/test/start")
async def start_test(request: TestStartRequest):
    """
    Start a new test based on selected option
    """
    test_id = str(uuid.uuid4())
    
    # Create test session
    test_session = {
        "id": test_id,
        "option": request.option,
        "user": request.user,
        "role": request.role,
        "status": "started",
        "created": datetime.now().isoformat(),
        "next_step": "device_selection"
    }
    
    return {
        "test_id": test_id,
        "message": f"Test started for option: {request.option}",
        "session": test_session,
        "next_url": "/page/devices/js/0.1.0/"
    }

@app.post("/api/test/configure")
async def configure_test(request: TestConfigRequest):
    """
    Configure a new test from wizard data
    """
    test_id = str(uuid.uuid4())
    
    # Create test configuration
    test_config = {
        "id": test_id,
        "name": request.name,
        "description": request.description,
        "device": request.device,
        "test": request.test,
        "parameters": request.parameters,
        "created": datetime.now().isoformat(),
        "status": "configured"
    }
    
    # Save as template if requested
    if request.save_as_template:
        template = {
            "id": f"tmpl_{test_id}",
            "name": request.name,
            "description": request.description,
            "device_type": request.device.get("deviceType", "Unknown"),
            "test_type": request.test.get("testType", "Unknown"),
            "is_template": True
        }
        test_templates.append(template)
    
    # Add to history
    history_entry = {
        "id": test_id,
        "name": request.name,
        "device": request.device.get("deviceType", "Unknown"),
        "result": "CONFIGURED",
        "date": datetime.now().isoformat(),
        "duration": "00:00:00"
    }
    test_history.insert(0, history_entry)
    
    return {
        "test_id": test_id,
        "message": "Test configured successfully",
        "config": test_config,
        "saved_as_template": request.save_as_template
    }

@app.get("/api/scenarios", response_model=List[TestScenario])
async def get_scenarios():
    """Get all custom test scenarios"""
    return [TestScenario(**scenario) for scenario in test_scenarios]

@app.post("/api/scenarios")
async def create_scenario(scenario: TestScenario):
    """Create a new test scenario"""
    scenario_dict = scenario.dict()
    scenario_dict["id"] = str(uuid.uuid4())
    scenario_dict["created"] = datetime.now().isoformat()
    
    test_scenarios.append(scenario_dict)
    
    return {
        "message": "Scenario created successfully",
        "scenario": scenario_dict
    }

@app.get("/api/templates", response_model=List[TestTemplate])
async def get_templates():
    """Get all test templates"""
    return [TestTemplate(**template) for template in test_templates]

@app.get("/api/history", response_model=List[TestHistory])
async def get_history(filter: str = "all"):
    """Get test execution history"""
    if filter == "all":
        return [TestHistory(**entry) for entry in test_history]
    
    # Filter by result
    filtered = [entry for entry in test_history if entry.get("result", "").lower() == filter.lower()]
    return [TestHistory(**entry) for entry in filtered]

@app.get("/api/export")
async def export_data(format: str = "json"):
    """Export test data in specified format"""
    export_data = {
        "scenarios": test_scenarios,
        "templates": test_templates, 
        "history": test_history,
        "export_date": datetime.now().isoformat(),
        "format": format
    }
    
    return {
        "message": f"Data exported in {format} format",
        "data": export_data,
        "filename": f"maskservice_tests_{datetime.now().strftime('%Y%m%d')}.{format}"
    }

@app.get("/api/stats")
async def get_stats():
    """Get test statistics"""
    total_tests = len(test_history)
    passed_tests = len([t for t in test_history if t.get("result") == "PASSED"])
    failed_tests = len([t for t in test_history if t.get("result") == "FAILED"])
    
    return {
        "total_tests": total_tests,
        "passed_tests": passed_tests,
        "failed_tests": failed_tests,
        "success_rate": (passed_tests / total_tests * 100) if total_tests > 0 else 0,
        "total_scenarios": len(test_scenarios),
        "total_templates": len(test_templates)
    }

@app.delete("/api/test/{test_id}")
async def delete_test(test_id: str):
    """Delete a test from history"""
    global test_history
    original_length = len(test_history)
    test_history = [t for t in test_history if t["id"] != test_id]
    
    if len(test_history) < original_length:
        return {"message": f"Test {test_id} deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Test not found")

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting MaskService Tests API on http://localhost:8003")
    uvicorn.run(app, host="0.0.0.0", port=8003)
