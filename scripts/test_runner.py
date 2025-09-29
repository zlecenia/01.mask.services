#!/usr/bin/env python3

"""
MaskService Test Runner
Python script for automated testing of pages and modules
"""

import os
import sys
import json
import time
import requests
import subprocess
import argparse
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from concurrent.futures import ThreadPoolExecutor, as_completed

@dataclass
class TestResult:
    component: str
    test_type: str
    success: bool
    duration: float
    message: str
    details: Optional[Dict] = None

class Colors:
    GREEN = '\033[0;32m'
    RED = '\033[0;31m'
    YELLOW = '\033[1;33m'
    BLUE = '\033[0;34m'
    PURPLE = '\033[0;35m'
    CYAN = '\033[0;36m'
    NC = '\033[0m'  # No Color

class TestRunner:
    """Main test runner class"""
    
    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.results: List[TestResult] = []
        
        # Port mapping for different pages
        self.port_map = {
            'login': {'backend': 8001, 'frontend': 8081},
            'dashboard': {'backend': 8002, 'frontend': 8082},
            'tests': {'backend': 8003, 'frontend': 8083},
            'system': {'backend': 8004, 'frontend': 8084},
        }
    
    def print_status(self, message: str, color: str = Colors.GREEN):
        """Print colored status message"""
        print(f"{color}[TEST]{Colors.NC} {message}")
    
    def print_error(self, message: str):
        """Print error message"""
        print(f"{Colors.RED}[ERROR]{Colors.NC} {message}")
    
    def print_info(self, message: str):
        """Print info message"""
        print(f"{Colors.BLUE}[INFO]{Colors.NC} {message}")
    
    def print_warning(self, message: str):
        """Print warning message"""
        print(f"{Colors.YELLOW}[WARN]{Colors.NC} {message}")
    
    def discover_components(self) -> Dict[str, List[str]]:
        """Discover all available components"""
        components = {'page': [], 'module': []}
        
        # Discover pages
        page_dir = self.project_root / 'page'
        if page_dir.exists():
            for item in page_dir.iterdir():
                if item.is_dir() and (item / 'js' / '0.1.0').exists():
                    components['page'].append(item.name)
        
        # Discover modules
        module_dir = self.project_root / 'module'
        if module_dir.exists():
            for item in module_dir.iterdir():
                if item.is_dir() and (item / 'js' / '0.1.0').exists():
                    components['module'].append(item.name)
        
        return components
    
    def check_health(self, url: str, timeout: int = 30) -> Tuple[bool, str]:
        """Check if a service is healthy"""
        for attempt in range(timeout):
            try:
                response = requests.get(url, timeout=5)
                if response.status_code == 200:
                    return True, "Service is healthy"
            except requests.RequestException as e:
                if attempt == 0:
                    time.sleep(1)  # Quick retry on first failure
                else:
                    time.sleep(2)
        
        return False, f"Service not responding after {timeout} attempts"
    
    def test_component_health(self, component_type: str, component_name: str) -> List[TestResult]:
        """Test component health"""
        results = []
        start_time = time.time()
        
        if component_name in self.port_map:
            ports = self.port_map[component_name]
            
            # Test backend health
            backend_url = f"http://localhost:{ports['backend']}/"
            success, message = self.check_health(backend_url, timeout=10)
            
            results.append(TestResult(
                component=f"{component_type}/{component_name}",
                test_type="backend_health",
                success=success,
                duration=time.time() - start_time,
                message=message,
                details={"url": backend_url, "port": ports['backend']}
            ))
            
            # Test frontend health
            frontend_url = f"http://localhost:{ports['frontend']}/"
            success, message = self.check_health(frontend_url, timeout=10)
            
            results.append(TestResult(
                component=f"{component_type}/{component_name}",
                test_type="frontend_health",
                success=success,
                duration=time.time() - start_time,
                message=message,
                details={"url": frontend_url, "port": ports['frontend']}
            ))
        
        return results
    
    def test_component_files(self, component_type: str, component_name: str) -> List[TestResult]:
        """Test component file structure"""
        results = []
        component_dir = self.project_root / component_type / component_name
        
        if not component_dir.exists():
            results.append(TestResult(
                component=f"{component_type}/{component_name}",
                test_type="file_structure",
                success=False,
                duration=0.0,
                message="Component directory does not exist"
            ))
            return results
        
        # Check required files
        required_files = [
            'js/0.1.0/index.html',
            'js/0.1.0/package.json'
        ]
        
        if component_type == 'page':
            required_files.extend([
                'py/0.1.0/main.py',
                'py/0.1.0/requirements.txt',
                'docker/0.1.0/docker-compose.yml',
                'README.md'
            ])
        
        missing_files = []
        existing_files = []
        
        for file_path in required_files:
            full_path = component_dir / file_path
            if full_path.exists():
                existing_files.append(file_path)
            else:
                missing_files.append(file_path)
        
        success = len(missing_files) == 0
        message = f"Files check: {len(existing_files)} found, {len(missing_files)} missing"
        
        results.append(TestResult(
            component=f"{component_type}/{component_name}",
            test_type="file_structure",
            success=success,
            duration=0.1,
            message=message,
            details={
                "existing_files": existing_files,
                "missing_files": missing_files
            }
        ))
        
        return results
    
    def test_component_syntax(self, component_type: str, component_name: str) -> List[TestResult]:
        """Test component syntax"""
        results = []
        component_dir = self.project_root / component_type / component_name
        
        # Test Python syntax
        py_main = component_dir / 'py' / '0.1.0' / 'main.py'
        if py_main.exists():
            try:
                subprocess.run([
                    sys.executable, '-m', 'py_compile', str(py_main)
                ], check=True, capture_output=True)
                
                results.append(TestResult(
                    component=f"{component_type}/{component_name}",
                    test_type="python_syntax",
                    success=True,
                    duration=0.1,
                    message="Python syntax valid"
                ))
            except subprocess.CalledProcessError as e:
                results.append(TestResult(
                    component=f"{component_type}/{component_name}",
                    test_type="python_syntax",
                    success=False,
                    duration=0.1,
                    message="Python syntax error",
                    details={"error": e.stderr.decode() if e.stderr else str(e)}
                ))
        
        # Test package.json validity
        package_json = component_dir / 'js' / '0.1.0' / 'package.json'
        if package_json.exists():
            try:
                with open(package_json) as f:
                    json.load(f)
                
                results.append(TestResult(
                    component=f"{component_type}/{component_name}",
                    test_type="package_json_syntax",
                    success=True,
                    duration=0.1,
                    message="package.json syntax valid"
                ))
            except json.JSONDecodeError as e:
                results.append(TestResult(
                    component=f"{component_type}/{component_name}",
                    test_type="package_json_syntax",
                    success=False,
                    duration=0.1,
                    message="package.json syntax error",
                    details={"error": str(e)}
                ))
        
        return results
    
    def test_component_docker(self, component_type: str, component_name: str) -> List[TestResult]:
        """Test component Docker configuration"""
        results = []
        component_dir = self.project_root / component_type / component_name
        docker_dir = component_dir / 'docker' / '0.1.0'
        
        if not docker_dir.exists():
            results.append(TestResult(
                component=f"{component_type}/{component_name}",
                test_type="docker_config",
                success=False,
                duration=0.0,
                message="Docker directory does not exist"
            ))
            return results
        
        # Check Docker files
        docker_files = ['docker-compose.yml', 'Dockerfile.backend', 'Dockerfile.frontend']
        missing_docker_files = []
        
        for file_name in docker_files:
            if not (docker_dir / file_name).exists():
                missing_docker_files.append(file_name)
        
        if missing_docker_files:
            results.append(TestResult(
                component=f"{component_type}/{component_name}",
                test_type="docker_config",
                success=False,
                duration=0.1,
                message=f"Missing Docker files: {', '.join(missing_docker_files)}"
            ))
        else:
            results.append(TestResult(
                component=f"{component_type}/{component_name}",
                test_type="docker_config",
                success=True,
                duration=0.1,
                message="Docker configuration files present"
            ))
        
        return results
    
    def test_component(self, component_type: str, component_name: str, 
                      test_types: List[str] = None) -> List[TestResult]:
        """Test a single component"""
        if test_types is None:
            test_types = ['files', 'syntax', 'docker', 'health']
        
        results = []
        
        self.print_info(f"Testing {component_type}/{component_name}...")
        
        if 'files' in test_types:
            results.extend(self.test_component_files(component_type, component_name))
        
        if 'syntax' in test_types:
            results.extend(self.test_component_syntax(component_type, component_name))
        
        if 'docker' in test_types:
            results.extend(self.test_component_docker(component_type, component_name))
        
        if 'health' in test_types:
            results.extend(self.test_component_health(component_type, component_name))
        
        return results
    
    def run_tests(self, components: List[str] = None, test_types: List[str] = None,
                  parallel: bool = False) -> Dict[str, List[TestResult]]:
        """Run tests for multiple components"""
        discovered = self.discover_components()
        
        if components is None:
            # Test all discovered components
            test_components = []
            for comp_type, comp_names in discovered.items():
                for comp_name in comp_names:
                    test_components.append((comp_type, comp_name))
        else:
            # Parse component specifications
            test_components = []
            for comp_spec in components:
                if '/' in comp_spec:
                    comp_type, comp_name = comp_spec.split('/', 1)
                    test_components.append((comp_type, comp_name))
                else:
                    # Assume it's a page if no type specified
                    test_components.append(('page', comp_spec))
        
        all_results = {}
        
        if parallel:
            # Run tests in parallel
            with ThreadPoolExecutor(max_workers=4) as executor:
                future_to_component = {
                    executor.submit(self.test_component, comp_type, comp_name, test_types): f"{comp_type}/{comp_name}"
                    for comp_type, comp_name in test_components
                }
                
                for future in as_completed(future_to_component):
                    component = future_to_component[future]
                    try:
                        results = future.result()
                        all_results[component] = results
                        self.results.extend(results)
                    except Exception as exc:
                        self.print_error(f"{component} generated an exception: {exc}")
        else:
            # Run tests sequentially
            for comp_type, comp_name in test_components:
                results = self.test_component(comp_type, comp_name, test_types)
                component_key = f"{comp_type}/{comp_name}"
                all_results[component_key] = results
                self.results.extend(results)
        
        return all_results
    
    def print_summary(self):
        """Print test results summary"""
        if not self.results:
            self.print_warning("No test results to display")
            return
        
        print(f"\n{Colors.CYAN}{'='*60}{Colors.NC}")
        print(f"{Colors.CYAN}TEST RESULTS SUMMARY{Colors.NC}")
        print(f"{Colors.CYAN}{'='*60}{Colors.NC}")
        
        # Group results by component
        by_component = {}
        for result in self.results:
            if result.component not in by_component:
                by_component[result.component] = []
            by_component[result.component].append(result)
        
        total_tests = len(self.results)
        passed_tests = sum(1 for r in self.results if r.success)
        failed_tests = total_tests - passed_tests
        
        # Component summary
        for component, results in sorted(by_component.items()):
            component_passed = sum(1 for r in results if r.success)
            component_total = len(results)
            
            status_color = Colors.GREEN if component_passed == component_total else Colors.RED
            print(f"\n{status_color}{component}{Colors.NC} ({component_passed}/{component_total})")
            
            for result in results:
                status_symbol = "✓" if result.success else "✗"
                status_color = Colors.GREEN if result.success else Colors.RED
                duration = f"{result.duration:.2f}s"
                
                print(f"  {status_color}{status_symbol}{Colors.NC} {result.test_type:<20} {duration:<8} {result.message}")
                
                if not result.success and result.details:
                    if 'error' in result.details:
                        print(f"    {Colors.RED}Error: {result.details['error']}{Colors.NC}")
        
        # Overall summary
        print(f"\n{Colors.CYAN}Overall Results:{Colors.NC}")
        print(f"  Total tests: {total_tests}")
        print(f"  {Colors.GREEN}Passed: {passed_tests}{Colors.NC}")
        print(f"  {Colors.RED}Failed: {failed_tests}{Colors.NC}")
        
        success_rate = (passed_tests / total_tests * 100) if total_tests > 0 else 0
        color = Colors.GREEN if success_rate >= 80 else Colors.YELLOW if success_rate >= 60 else Colors.RED
        print(f"  {color}Success rate: {success_rate:.1f}%{Colors.NC}")

def main():
    parser = argparse.ArgumentParser(description="MaskService Test Runner")
    parser.add_argument('components', nargs='*', help='Components to test (e.g., page/login module/auth)')
    parser.add_argument('--type', choices=['files', 'syntax', 'docker', 'health'], 
                       action='append', help='Types of tests to run')
    parser.add_argument('--parallel', action='store_true', help='Run tests in parallel')
    parser.add_argument('--discover', action='store_true', help='Discover available components')
    
    args = parser.parse_args()
    
    # Get project root (parent of scripts directory)
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    
    runner = TestRunner(str(project_root))
    
    if args.discover:
        components = runner.discover_components()
        print(f"\n{Colors.CYAN}Available Components:{Colors.NC}")
        for comp_type, comp_names in components.items():
            print(f"\n{comp_type.upper()}:")
            for name in sorted(comp_names):
                print(f"  - {name}")
        return
    
    # Run tests
    runner.print_status("Starting MaskService test suite...")
    
    results = runner.run_tests(
        components=args.components or None,
        test_types=args.type or None,
        parallel=args.parallel
    )
    
    runner.print_summary()
    
    # Exit with appropriate code
    failed_results = [r for r in runner.results if not r.success]
    sys.exit(1 if failed_results else 0)

if __name__ == "__main__":
    main()
