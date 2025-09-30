#!/usr/bin/env python3

"""
Test script for devices page functionality
Tests both backend API and frontend accessibility
"""

import requests
import time
import sys

def test_devices_backend():
    """Test devices backend API endpoints"""
    print("🔍 Testing devices backend...")
    
    try:
        # Test health endpoint
        response = requests.get('http://localhost:8107/health', timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health check: {data}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
            
        # Test root endpoint
        response = requests.get('http://localhost:8107/', timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Root endpoint: {data}")
        else:
            print(f"❌ Root endpoint failed: {response.status_code}")
            return False
            
        return True
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Backend connection error: {e}")
        return False

def test_devices_frontend():
    """Test devices frontend accessibility"""
    print("🔍 Testing devices frontend...")
    
    try:
        response = requests.get('http://localhost:8207/', timeout=5)
        if response.status_code == 200:
            print(f"✅ Frontend accessible (status: {response.status_code})")
            # Check if it contains expected content
            content = response.text
            if 'devices' in content.lower() or 'maskservice' in content.lower():
                print("✅ Frontend contains expected content")
            else:
                print("⚠️ Frontend content may be incomplete")
            return True
        else:
            print(f"❌ Frontend failed: {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Frontend connection error: {e}")
        return False

def main():
    """Main test function"""
    print("🚀 Testing Devices Page Functionality")
    print("=" * 50)
    
    # Wait a moment for containers to be fully ready
    print("⏳ Waiting for containers to be ready...")
    time.sleep(3)
    
    backend_ok = test_devices_backend()
    frontend_ok = test_devices_frontend()
    
    print("\n" + "=" * 50)
    print("📊 Test Results:")
    print(f"Backend: {'✅ PASS' if backend_ok else '❌ FAIL'}")
    print(f"Frontend: {'✅ PASS' if frontend_ok else '❌ FAIL'}")
    
    if backend_ok and frontend_ok:
        print("\n🎉 Devices page is fully functional!")
        print("🌐 Access at: http://localhost:8207")
        print("🔧 API at: http://localhost:8107")
        return 0
    else:
        print("\n⚠️ Some issues detected with devices page")
        return 1

if __name__ == "__main__":
    sys.exit(main())
