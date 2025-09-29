#!/usr/bin/env python3
"""
Comprehensive test suite for login and dashboard flow
Tests routing, authentication, and menu functionality
"""

import requests
import json
import time
import sys
from urllib.parse import urljoin

class LoginFlowTester:
    def __init__(self):
        self.login_frontend = "http://127.0.0.1:8201"
        self.login_backend = "http://127.0.0.1:8101"
        self.dashboard_frontend = "http://127.0.0.1:8202"
        self.dashboard_backend = "http://127.0.0.1:8102"
        
        self.session = requests.Session()
        self.test_results = []
        
    def log_test(self, test_name, status, details=""):
        """Log test results"""
        result = {
            "test": test_name,
            "status": status,
            "details": details,
            "timestamp": time.strftime("%H:%M:%S")
        }
        self.test_results.append(result)
        
        status_icon = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
        print(f"{status_icon} {test_name}: {status}")
        if details:
            print(f"   Details: {details}")
        print()

    def test_container_health(self):
        """Test if all containers are running and healthy"""
        print("🔍 Testing Container Health...")
        
        containers = [
            ("Login Frontend", self.login_frontend),
            ("Login Backend", f"{self.login_backend}/health"),
            ("Dashboard Frontend", self.dashboard_frontend),
            ("Dashboard Backend", f"{self.dashboard_backend}/health")
        ]
        
        for name, url in containers:
            try:
                response = self.session.get(url, timeout=5)
                if response.status_code == 200:
                    self.log_test(f"{name} Health Check", "PASS", f"Status: {response.status_code}")
                else:
                    self.log_test(f"{name} Health Check", "FAIL", f"Status: {response.status_code}")
            except Exception as e:
                self.log_test(f"{name} Health Check", "FAIL", f"Error: {str(e)}")

    def test_login_page_files(self):
        """Test if login page serves correct files"""
        print("🔍 Testing Login Page File Serving...")
        
        # Test main page
        try:
            response = self.session.get(self.login_frontend)
            if response.status_code == 200:
                content = response.text
                if "login.css" in content and "login.js" in content:
                    self.log_test("Login Page HTML", "PASS", "Contains correct file references")
                else:
                    self.log_test("Login Page HTML", "FAIL", "Missing login.css or login.js references")
            else:
                self.log_test("Login Page HTML", "FAIL", f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Login Page HTML", "FAIL", f"Error: {str(e)}")
        
        # Test CSS file
        try:
            css_url = f"{self.login_frontend}/login.css"
            response = self.session.get(css_url)
            if response.status_code == 200:
                self.log_test("Login CSS File", "PASS", f"Size: {len(response.content)} bytes")
            else:
                self.log_test("Login CSS File", "FAIL", f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Login CSS File", "FAIL", f"Error: {str(e)}")
        
        # Test JS file
        try:
            js_url = f"{self.login_frontend}/login.js"
            response = self.session.get(js_url)
            if response.status_code == 200:
                self.log_test("Login JS File", "PASS", f"Size: {len(response.content)} bytes")
            else:
                self.log_test("Login JS File", "FAIL", f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Login JS File", "FAIL", f"Error: {str(e)}")

    def test_dashboard_routing_issue(self):
        """Test the specific routing issue mentioned in error"""
        print("🔍 Testing Dashboard Routing Issue...")
        
        # Test the problematic URL from error message
        problematic_urls = [
            f"{self.login_frontend}/page/dashboard/js/0.1.0/login.css",
            f"{self.login_frontend}/page/dashboard/js/0.1.0/login.js"
        ]
        
        for url in problematic_urls:
            try:
                response = self.session.get(url)
                if response.status_code == 404:
                    self.log_test(f"Expected 404 for {url.split('/')[-1]}", "PASS", "Correctly returns 404")
                else:
                    self.log_test(f"Expected 404 for {url.split('/')[-1]}", "WARN", f"Status: {response.status_code}")
            except Exception as e:
                self.log_test(f"Routing test for {url.split('/')[-1]}", "FAIL", f"Error: {str(e)}")

    def test_authentication_flow(self):
        """Test login authentication with different roles"""
        print("🔍 Testing Authentication Flow...")
        
        test_credentials = [
            {"username": "operator", "password": "operator123", "role": "OPERATOR"},
            {"username": "admin", "password": "admin123", "role": "ADMIN"},
            {"username": "superuser", "password": "super123", "role": "SUPERUSER"}
        ]
        
        for creds in test_credentials:
            try:
                login_url = f"{self.login_backend}/api/login"
                response = self.session.post(login_url, json=creds, timeout=10)
                
                if response.status_code == 200:
                    self.log_test(f"Login as {creds['role']}", "PASS", "Authentication successful")
                    
                    # Test if response contains expected data
                    try:
                        data = response.json()
                        if "token" in data or "user" in data:
                            self.log_test(f"Login Response for {creds['role']}", "PASS", "Contains auth data")
                        else:
                            self.log_test(f"Login Response for {creds['role']}", "WARN", "Missing auth data")
                    except:
                        self.log_test(f"Login Response for {creds['role']}", "WARN", "Non-JSON response")
                        
                elif response.status_code == 401:
                    self.log_test(f"Login as {creds['role']}", "FAIL", "Invalid credentials")
                else:
                    self.log_test(f"Login as {creds['role']}", "FAIL", f"Status: {response.status_code}")
                    
            except Exception as e:
                self.log_test(f"Login as {creds['role']}", "FAIL", f"Error: {str(e)}")

    def test_dashboard_access(self):
        """Test dashboard page access and menu loading"""
        print("🔍 Testing Dashboard Access...")
        
        try:
            response = self.session.get(self.dashboard_frontend)
            if response.status_code == 200:
                content = response.text
                if "dashboard.css" in content and "dashboard.js" in content:
                    self.log_test("Dashboard Page HTML", "PASS", "Contains correct file references")
                else:
                    self.log_test("Dashboard Page HTML", "FAIL", "Missing dashboard files references")
            else:
                self.log_test("Dashboard Page HTML", "FAIL", f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Dashboard Page HTML", "FAIL", f"Error: {str(e)}")
        
        # Test dashboard files
        dashboard_files = ["dashboard.css", "dashboard.js"]
        for file in dashboard_files:
            try:
                file_url = f"{self.dashboard_frontend}/{file}"
                response = self.session.get(file_url)
                if response.status_code == 200:
                    self.log_test(f"Dashboard {file}", "PASS", f"Size: {len(response.content)} bytes")
                else:
                    self.log_test(f"Dashboard {file}", "FAIL", f"Status: {response.status_code}")
            except Exception as e:
                self.log_test(f"Dashboard {file}", "FAIL", f"Error: {str(e)}")

    def test_cross_page_navigation(self):
        """Test navigation between login and dashboard"""
        print("🔍 Testing Cross-Page Navigation...")
        
        # Test if login page has correct redirect logic
        try:
            response = self.session.get(self.login_frontend)
            content = response.text
            
            # Check for dashboard redirect logic in JS
            if "8202" in content or "dashboard" in content.lower():
                self.log_test("Login to Dashboard Navigation", "PASS", "Contains dashboard references")
            else:
                self.log_test("Login to Dashboard Navigation", "WARN", "No dashboard navigation found")
                
        except Exception as e:
            self.log_test("Login to Dashboard Navigation", "FAIL", f"Error: {str(e)}")

    def run_all_tests(self):
        """Run all tests and generate report"""
        print("🚀 Starting Comprehensive Login Flow Tests")
        print("=" * 60)
        
        self.test_container_health()
        self.test_login_page_files()
        self.test_dashboard_routing_issue()
        self.test_authentication_flow()
        self.test_dashboard_access()
        self.test_cross_page_navigation()
        
        # Generate summary
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed = len([r for r in self.test_results if r["status"] == "PASS"])
        failed = len([r for r in self.test_results if r["status"] == "FAIL"])
        warnings = len([r for r in self.test_results if r["status"] == "WARN"])
        total = len(self.test_results)
        
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"⚠️  Warnings: {warnings}")
        print(f"📈 Total: {total}")
        print()
        
        if failed > 0:
            print("❌ FAILED TESTS:")
            for result in self.test_results:
                if result["status"] == "FAIL":
                    print(f"   • {result['test']}: {result['details']}")
            print()
        
        if warnings > 0:
            print("⚠️  WARNINGS:")
            for result in self.test_results:
                if result["status"] == "WARN":
                    print(f"   • {result['test']}: {result['details']}")
            print()
        
        # Save detailed results
        with open("/tmp/login_flow_test_results.json", "w") as f:
            json.dump(self.test_results, f, indent=2)
        
        print(f"📄 Detailed results saved to: /tmp/login_flow_test_results.json")
        
        return failed == 0

if __name__ == "__main__":
    tester = LoginFlowTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)
