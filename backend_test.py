import requests
import unittest
import sys
import os
import json
from datetime import datetime

class OpenAlgoAPITester(unittest.TestCase):
    """Test suite for OpenAlgo API endpoints"""
    
    def __init__(self, *args, **kwargs):
        super(OpenAlgoAPITester, self).__init__(*args, **kwargs)
        self.base_url = "http://127.0.0.1:5000"
        self.api_url = f"{self.base_url}/api"
        self.session = requests.Session()
        self.test_results = {
            "passed": 0,
            "failed": 0,
            "errors": []
        }
    
    def setUp(self):
        """Setup before each test"""
        print(f"\n{'='*50}")
        print(f"Running test: {self._testMethodName}")
        print(f"{'-'*50}")
    
    def tearDown(self):
        """Cleanup after each test"""
        print(f"{'-'*50}")
    
    def test_01_landing_page(self):
        """Test if the landing page loads correctly"""
        try:
            response = self.session.get(self.base_url)
            self.assertEqual(response.status_code, 200)
            
            # Check for key elements in the landing page
            self.assertIn(b'OpenAlgo', response.content)
            self.assertIn(b'particles-js', response.content)
            self.assertIn(b'typed-text', response.content)
            
            print("✅ Landing page loads successfully with particles and typed text elements")
            self.test_results["passed"] += 1
        except Exception as e:
            print(f"❌ Landing page test failed: {str(e)}")
            self.test_results["failed"] += 1
            self.test_results["errors"].append(f"Landing page: {str(e)}")
            raise
    
    def test_02_theme_toggle(self):
        """Test if the theme toggle endpoint works"""
        try:
            # This is a client-side feature, so we're just checking if the theme.js is loaded
            response = self.session.get(f"{self.base_url}/static/js/theme.js")
            self.assertEqual(response.status_code, 200)
            print("✅ Theme toggle script loads successfully")
            self.test_results["passed"] += 1
        except Exception as e:
            print(f"❌ Theme toggle test failed: {str(e)}")
            self.test_results["failed"] += 1
            self.test_results["errors"].append(f"Theme toggle: {str(e)}")
            raise
    
    def test_03_animation_scripts(self):
        """Test if animation scripts load correctly"""
        try:
            # Check particles config
            response = self.session.get(f"{self.base_url}/static/js/particles-config.js")
            self.assertEqual(response.status_code, 200)
            
            # Check advanced animations
            response = self.session.get(f"{self.base_url}/static/js/advanced-animations.js")
            self.assertEqual(response.status_code, 200)
            
            # Check trading effects
            response = self.session.get(f"{self.base_url}/static/js/trading-effects.js")
            self.assertEqual(response.status_code, 200)
            
            print("✅ All animation scripts load successfully")
            self.test_results["passed"] += 1
        except Exception as e:
            print(f"❌ Animation scripts test failed: {str(e)}")
            self.test_results["failed"] += 1
            self.test_results["errors"].append(f"Animation scripts: {str(e)}")
            raise
    
    def test_04_navigation_links(self):
        """Test if navigation links are working"""
        try:
            # Test FAQ page
            response = self.session.get(f"{self.base_url}/faq")
            self.assertEqual(response.status_code, 200)
            self.assertIn(b'FAQ', response.content)
            
            # Test Download page
            response = self.session.get(f"{self.base_url}/download")
            self.assertEqual(response.status_code, 200)
            self.assertIn(b'Download', response.content)
            
            print("✅ Navigation links work correctly")
            self.test_results["passed"] += 1
        except Exception as e:
            print(f"❌ Navigation links test failed: {str(e)}")
            self.test_results["failed"] += 1
            self.test_results["errors"].append(f"Navigation links: {str(e)}")
            raise
    
    def test_05_css_styles(self):
        """Test if CSS styles load correctly"""
        try:
            response = self.session.get(f"{self.base_url}/static/css/main.css")
            self.assertEqual(response.status_code, 200)
            
            # Check for Tailwind and DaisyUI classes
            self.assertIn(b'btn-primary', response.content)
            self.assertIn(b'card', response.content)
            
            print("✅ CSS styles load successfully")
            self.test_results["passed"] += 1
        except Exception as e:
            print(f"❌ CSS styles test failed: {str(e)}")
            self.test_results["failed"] += 1
            self.test_results["errors"].append(f"CSS styles: {str(e)}")
            raise
    
    def test_06_external_links(self):
        """Test if external links are properly formatted"""
        try:
            response = self.session.get(self.base_url)
            
            # Check for GitHub link
            self.assertIn(b'github.com/marketcalls/openalgo', response.content)
            
            # Check for Discord link
            self.assertIn(b'discord.com', response.content)
            
            # Check for Documentation link
            self.assertIn(b'docs.openalgo.in', response.content)
            
            print("✅ External links are properly formatted")
            self.test_results["passed"] += 1
        except Exception as e:
            print(f"❌ External links test failed: {str(e)}")
            self.test_results["failed"] += 1
            self.test_results["errors"].append(f"External links: {str(e)}")
            raise
    
    def print_summary(self):
        """Print a summary of all test results"""
        print("\n" + "="*50)
        print("TEST SUMMARY")
        print("="*50)
        print(f"Total tests: {self.test_results['passed'] + self.test_results['failed']}")
        print(f"Passed: {self.test_results['passed']}")
        print(f"Failed: {self.test_results['failed']}")
        
        if self.test_results["errors"]:
            print("\nErrors:")
            for error in self.test_results["errors"]:
                print(f"- {error}")
        
        print("="*50)

def run_tests():
    """Run all tests and return exit code"""
    suite = unittest.TestLoader().loadTestsFromTestCase(OpenAlgoAPITester)
    result = unittest.TextTestRunner(verbosity=2).run(suite)
    
    # Print summary
    tester = OpenAlgoAPITester()
    tester.print_summary()
    
    return 0 if result.wasSuccessful() else 1

if __name__ == "__main__":
    sys.exit(run_tests())