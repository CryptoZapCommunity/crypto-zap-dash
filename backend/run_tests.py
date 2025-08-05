#!/usr/bin/env python3
"""
Test runner for all Python tests
Equivalent to running all the original Node.js tests
"""

import subprocess
import sys
import os
from datetime import datetime


def run_test_script(script_name: str) -> bool:
    """Run a test script and return success status"""
    try:
        print(f"🚀 Running {script_name}...")
        print("=" * 60)
        
        result = subprocess.run([
            sys.executable, f"tests/{script_name}"
        ], cwd=".", capture_output=False)
        
        print("=" * 60)
        if result.returncode == 0:
            print(f"✅ {script_name} completed successfully!")
        else:
            print(f"❌ {script_name} failed with exit code {result.returncode}")
        print("")
        
        return result.returncode == 0
        
    except Exception as error:
        print(f"❌ Error running {script_name}: {error}")
        return False


def main():
    """Run all test scripts"""
    print("🧪 Crypto Dashboard API - Python Test Suite")
    print("=" * 60)
    print(f"📅 Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("")
    
    # List of test scripts to run
    test_scripts = [
        "test_api_health.py",
        "test_apis.py", 
        "test_fed.py"
    ]
    
    results = {}
    
    for script in test_scripts:
        success = run_test_script(script)
        results[script] = success
    
    # Summary
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 60)
    
    passed = 0
    failed = 0
    
    for script, success in results.items():
        status = "✅ PASSED" if success else "❌ FAILED"
        print(f"{script:<25} {status}")
        if success:
            passed += 1
        else:
            failed += 1
    
    print("")
    print(f"📈 Total: {len(test_scripts)} tests")
    print(f"✅ Passed: {passed}")
    print(f"❌ Failed: {failed}")
    
    if failed == 0:
        print("🎉 All tests passed!")
        return 0
    else:
        print("⚠️ Some tests failed!")
        return 1


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)