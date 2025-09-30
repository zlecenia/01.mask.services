#!/usr/bin/env python3

"""
Complete Workflow Test: Login → Dashboard → Devices → Reports
Tests the entire user journey through the MaskService application
"""

import requests
import time
import sys
from urllib.parse import urljoin

class WorkflowTester:
    def __init__(self):
        self.session = requests.Session()
        self.token = None
        self.base_urls = {
            'login': 'http://localhost:8201',
            'dashboard': 'http://localhost:8202', 
            'devices': 'http://localhost:8207',
            'reports': 'http://localhost:8208'
        }
        self.api_urls = {
            'login': 'http://localhost:8101',
            'dashboard': 'http://localhost:8102',
            'devices': 'http://localhost:8107', 
            'reports': 'http://localhost:8108'
        }

    def test_login_flow(self):
        """Test login functionality and token acquisition"""
        print("🔐 Testing Login Flow...")
        
        try:
            # Test login frontend accessibility
            response = self.session.get(self.base_urls['login'], timeout=5)
            if response.status_code != 200:
                print(f"❌ Login frontend not accessible: {response.status_code}")
                return False
            print("✅ Login frontend accessible")
            
            # Test login API authentication
            login_data = {
                "role": "OPERATOR",
                "password": "default"
            }
            
            response = self.session.post(
                f"{self.api_urls['login']}/api/login",
                json=login_data,
                timeout=5
            )
            
            if response.status_code == 200:
                data = response.json()
                self.token = data.get('token')
                print(f"✅ Login successful: {data.get('username')} as {data.get('role')}")
                return True
            else:
                print(f"❌ Login failed: {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Login flow error: {e}")
            return False

    def test_dashboard_access(self):
        """Test dashboard accessibility and menu functionality"""
        print("📊 Testing Dashboard Access...")
        
        try:
            # Test dashboard frontend
            response = self.session.get(self.base_urls['dashboard'], timeout=5)
            if response.status_code != 200:
                print(f"❌ Dashboard frontend not accessible: {response.status_code}")
                return False
            
            content = response.text
            if 'dashboard' in content.lower() and 'menu' in content.lower():
                print("✅ Dashboard frontend accessible with menu content")
            else:
                print("⚠️ Dashboard accessible but content may be incomplete")
            
            # Test dashboard API
            headers = {'Authorization': f'Bearer {self.token}'} if self.token else {}
            response = self.session.get(f"{self.api_urls['dashboard']}/", headers=headers, timeout=5)
            
            if response.status_code == 200:
                print("✅ Dashboard API accessible")
                return True
            else:
                print(f"❌ Dashboard API failed: {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Dashboard access error: {e}")
            return False

    def test_devices_page(self):
        """Test devices page functionality"""
        print("🔧 Testing Devices Page...")
        
        try:
            # Test devices frontend
            response = self.session.get(self.base_urls['devices'], timeout=5)
            if response.status_code != 200:
                print(f"❌ Devices frontend not accessible: {response.status_code}")
                return False
            print("✅ Devices frontend accessible")
            
            # Test devices API
            response = self.session.get(f"{self.api_urls['devices']}/health", timeout=5)
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Devices API healthy: {data}")
                return True
            else:
                print(f"❌ Devices API failed: {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Devices page error: {e}")
            return False

    def test_reports_page(self):
        """Test reports page functionality"""
        print("📈 Testing Reports Page...")
        
        try:
            # Test reports frontend
            response = self.session.get(self.base_urls['reports'], timeout=5)
            if response.status_code != 200:
                print(f"❌ Reports frontend not accessible: {response.status_code}")
                return False
            print("✅ Reports frontend accessible")
            
            # Test reports API
            response = self.session.get(f"{self.api_urls['reports']}/health", timeout=5)
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Reports API healthy: {data}")
                return True
            else:
                print(f"❌ Reports API failed: {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Reports page error: {e}")
            return False

    def run_complete_workflow(self):
        """Run the complete workflow test"""
        print("🚀 Starting Complete Workflow Test")
        print("=" * 60)
        
        # Wait for services to be ready
        print("⏳ Waiting for services to be ready...")
        time.sleep(5)
        
        results = {
            'login': self.test_login_flow(),
            'dashboard': self.test_dashboard_access(),
            'devices': self.test_devices_page(),
            'reports': self.test_reports_page()
        }
        
        print("\n" + "=" * 60)
        print("📊 Complete Workflow Test Results:")
        print("=" * 60)
        
        all_passed = True
        for step, success in results.items():
            status = "✅ PASS" if success else "❌ FAIL"
            print(f"{step.capitalize():12} {status}")
            if not success:
                all_passed = False
        
        print("=" * 60)
        if all_passed:
            print("🎉 COMPLETE WORKFLOW SUCCESS!")
            print("🌐 Full user journey working: Login → Dashboard → Devices → Reports")
            print("\n📋 Access Points:")
            print(f"   Login:     {self.base_urls['login']}")
            print(f"   Dashboard: {self.base_urls['dashboard']}")
            print(f"   Devices:   {self.base_urls['devices']}")
            print(f"   Reports:   {self.base_urls['reports']}")
            return 0
        else:
            print("⚠️ Some workflow steps failed")
            print("🔍 Check individual component logs for details")
            return 1

def main():
    """Main test function"""
    tester = WorkflowTester()
    return tester.run_complete_workflow()

if __name__ == "__main__":
    sys.exit(main())
