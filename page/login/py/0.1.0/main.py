"""
FastAPI backend for login page
Port: 8001 (page number-based port assignment)
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import hashlib
import jwt
from datetime import datetime, timedelta
from typing import Optional

# FastAPI application
app = FastAPI(title="MaskService Login API", version="0.1.0")

# CORS middleware - allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JWT Secret (in production, use environment variable)
JWT_SECRET = "maskservice-c20-login-secret-key"

# Request/Response models
class LoginRequest(BaseModel):
    role: str
    password: Optional[str] = "default"

class LoginResponse(BaseModel):
    token: str
    username: str
    role: str
    message: str

# User database (in production, use proper database)
USERS = {
    "OPERATOR": {"password": "operator", "username": "operator"},
    "ADMIN": {"password": "admin", "username": "admin"},
    "SUPERUSER": {"password": "superuser", "username": "superuser"},
    "SERVICEUSER": {"password": "service", "username": "serviceuser"},
}

# Default passwords for development
DEFAULT_PASSWORDS = {
    "OPERATOR": "default",
    "ADMIN": "default", 
    "SUPERUSER": "default",
    "SERVICEUSER": "default"
}

def generate_token(username: str, role: str) -> str:
    """Generate JWT token for authenticated user"""
    payload = {
        "username": username,
        "role": role,
        "exp": datetime.utcnow() + timedelta(hours=24)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "MaskService Login API v0.1.0", "status": "active"}

@app.post("/api/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """
    Authenticate user based on role and password
    
    Supports both specific passwords and default authentication
    """
    role = request.role.upper()
    password = request.password or "default"
    
    # Validate role exists
    if role not in USERS:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid role: {role}. Available roles: {list(USERS.keys())}"
        )
    
    user_data = USERS[role]
    
    # Check password - either specific or default
    valid_password = (
        password == user_data["password"] or 
        password == DEFAULT_PASSWORDS.get(role, "")
    )
    
    if not valid_password:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )
    
    # Generate token
    username = user_data["username"]
    token = generate_token(username, role)
    
    return LoginResponse(
        token=token,
        username=username,
        role=role,
        message=f"Successfully logged in as {role}"
    )

@app.get("/api/verify")
async def verify_token(token: str):
    """Verify JWT token validity"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return {
            "valid": True,
            "username": payload["username"],
            "role": payload["role"],
            "exp": payload["exp"]
        }
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/api/roles")
async def get_available_roles():
    """Get list of available user roles"""
    return {
        "roles": [
            {"key": "OPERATOR", "label": "Operator", "description": "Basic testing operations"},
            {"key": "ADMIN", "label": "Administrator", "description": "System administration"},
            {"key": "SUPERUSER", "label": "Superuser", "description": "Full system access"},
            {"key": "SERVICEUSER", "label": "Serwisant", "description": "Service and maintenance"}
        ]
    }

@app.get("/health")
async def health_check():
    """Health check endpoint for Docker container health monitoring"""
    return {
        "status": "healthy",
        "service": "login",
        "version": "0.1.0",
        "timestamp": "2025-09-29"
    }

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting MaskService Login API on http://localhost:8001")
    uvicorn.run(app, host="0.0.0.0", port=8001)
