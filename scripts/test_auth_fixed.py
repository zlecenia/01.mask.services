#!/usr/bin/env python3
"""
Fixed authentication test with correct request format
"""

import requests
import json

def test_correct_auth():
    """Test authentication with correct request format"""
    login_backend = "http://127.0.0.1:8101"
    
    # Correct request format based on backend code
    test_credentials = [
        {"role": "OPERATOR", "password": "operator"},
        {"role": "OPERATOR", "password": "default"},  # Default password
        {"role": "ADMIN", "password": "admin"},
        {"role": "ADMIN", "password": "default"},
        {"role": "SUPERUSER", "password": "superuser"},
        {"role": "SUPERUSER", "password": "default"}
    ]
    
    print("🔐 Testing Correct Authentication Format")
    print("=" * 50)
    
    for creds in test_credentials:
        try:
            login_url = f"{login_backend}/api/login"
            response = requests.post(login_url, json=creds, timeout=10)
            
            print(f"Testing {creds['role']} with password '{creds['password']}':")
            print(f"  Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"  ✅ SUCCESS - Token: {data.get('token', 'N/A')[:20]}...")
                print(f"  Username: {data.get('username')}")
                print(f"  Role: {data.get('role')}")
                print(f"  Message: {data.get('message')}")
            else:
                print(f"  ❌ FAILED - {response.text}")
            print()
            
        except Exception as e:
            print(f"  ❌ ERROR - {str(e)}")
            print()

if __name__ == "__main__":
    test_correct_auth()
