#!/usr/bin/env python3
"""
AI Prescription Analyzer - Application Runner
This script handles the setup and running of the entire application.
"""

import os
import sys
import subprocess
import time
import threading
from pathlib import Path
import socket
import webbrowser

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        print(f"   Current version: {sys.version}")
        return False
    print(f"✅ Python {sys.version.split()[0]} detected")
    return True

def check_dependencies():
    """Check if required dependencies are installed"""
    print("\n🔍 Checking dependencies...")
    
    required_packages = {
        'fastapi': 'fastapi',
        'uvicorn': 'uvicorn',
        'opencv-python': 'cv2',
        'numpy': 'numpy',
        'pillow': 'PIL',
        'easyocr': 'easyocr',
        'pytesseract': 'pytesseract',
        'spacy': 'spacy',
        'pandas': 'pandas',
        'cohere': 'cohere'
    }
    
    missing_packages = []
    
    for package, import_name in required_packages.items():
        try:
            __import__(import_name)
            print(f"   ✅ {package}")
        except ImportError:
            print(f"   ❌ {package}")
            missing_packages.append(package)
    
    if missing_packages:
        print(f"\n❌ Missing dependencies: {', '.join(missing_packages)}")
        print("Install them with:")
        print(f"   pip install {' '.join(missing_packages)}")
        return False
    
    return True

def check_prescription_analyzer():
    """Check if prescription analyzer module exists"""
    print("\n🔍 Checking prescription analyzer module...")
    
    backend_dir = Path(__file__).parent / 'backend'
    analyzer_file = backend_dir / 'prescription_analyzer.py'
    
    if not analyzer_file.exists():
        print("❌ prescription_analyzer.py not found in backend directory")
        print("   Please ensure the prescription analyzer module is available")
        return False
    
    print("   ✅ prescription_analyzer.py found")
    return True

def setup_environment():
    """Setup environment variables and configuration"""
    print("\n⚙️  Setting up environment...")
    
    # Set environment variables if not already set
    if not os.getenv('COHERE_API_KEY'):
        # Try to load from keys.py if it exists
        try:
            backend_dir = Path(__file__).parent / 'backend'
            integration_dir = backend_dir / 'integration'
            keys_file = integration_dir / 'keys.py'
            
            if keys_file.exists():
                sys.path.insert(0, str(integration_dir))
                try:
                    from keys import COHERE_API_KEY
                    os.environ['COHERE_API_KEY'] = COHERE_API_KEY
                    print("   ✅ Cohere API key loaded from keys.py")
                except ImportError:
                    print("   ⚠️  No Cohere API key found - will use fallback analysis")
            else:
                print("   ⚠️  No Cohere API key configured - will use pattern-based analysis")
        except Exception as e:
            print(f"   ⚠️  Could not load API key: {e}")
    else:
        print("   ✅ Cohere API key found in environment")
    
    # Check for Tesseract
    tesseract_path = os.getenv('TESSERACT_PATH')
    if tesseract_path:
        print(f"   ✅ Tesseract path configured: {tesseract_path}")
    else:
        print("   ✅ Using system default Tesseract installation")
    
    return True

def start_backend():
    """Start the FastAPI backend server"""
    print("\n🔧 Starting backend server...")
    
    try:
        backend_dir = Path(__file__).parent / 'backend'
        os.chdir(backend_dir)
        
        # Import and start FastAPI app
        import uvicorn
        
        print("   🚀 Backend server starting on http://localhost:8000")
        print("   📚 API docs available at http://localhost:8000/docs")
        
        uvicorn.run(
            "backend.main:app",   
            host="0.0.0.0",
            port=8000,
            reload=False,
            log_level="info"
        )
        
    except Exception as e:
        print(f"   ❌ Error starting backend: {str(e)}")
        return False

def start_frontend():
    """Start the React frontend server"""
    print("\n⚛️  Starting frontend server...")
    
    frontend_dir = Path(__file__).parent / 'frontend'
    
    if not frontend_dir.exists():
        print("   ❌ Frontend directory not found")
        return False
    
    try:
        # Check for npm (try different variants for cross-platform compatibility)
        npm_commands = ['npm', 'npm.cmd']
        npm_executable = None
        
        for cmd in npm_commands:
            try:
                subprocess.run([cmd, '--version'], 
                             capture_output=True, check=True)
                npm_executable = cmd
                break
            except (subprocess.CalledProcessError, FileNotFoundError):
                continue
        
        if not npm_executable:
            print("   ❌ npm not found. Please install Node.js and npm")
            return False
        
        # Check if node_modules exists, if not install dependencies
        node_modules = frontend_dir / 'node_modules'
        if not node_modules.exists():
            print("   📦 Installing frontend dependencies...")
            result = subprocess.run([npm_executable, 'install'], 
                                  cwd=frontend_dir, 
                                  capture_output=True, 
                                  text=True)
            if result.returncode != 0:
                print(f"   ❌ Failed to install dependencies: {result.stderr}")
                return False
        
        print("   🚀 Frontend server starting on http://localhost:3000")
        
        # Start frontend server
        process = subprocess.Popen(
            [npm_executable, 'start'], 
            cwd=frontend_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            universal_newlines=True
        )
        
        return True, process
        
    except Exception as e:
        print(f"   ❌ Error starting frontend: {str(e)}")
        return False

def wait_for_port(host, port, timeout=30):
    """Wait for a port to become available"""
    start = time.time()
    while time.time() - start < timeout:
        try:
            with socket.create_connection((host, port), timeout=1):
                return True
        except (ConnectionRefusedError, OSError):
            time.sleep(1)
    return False

def open_browser():
    """Open the application in the default browser"""
    print("\n🌐 Waiting for frontend to start...")
    if wait_for_port('localhost', 3000, timeout=60):
        time.sleep(2)  # Extra wait for full startup
        webbrowser.open('http://localhost:3000')
        print("   ✅ Opening application in browser...")
    else:
        print("   ⚠️  Frontend did not start in time. Open manually at http://localhost:3000")

def create_package_json():
    """Create package.json for frontend if it doesn't exist"""
    frontend_dir = Path(__file__).parent / 'frontend'
    package_json = frontend_dir / 'package.json'
    
    if not package_json.exists():
        print("   📝 Creating package.json...")
        package_content = {
            "name": "prescription-analyzer-frontend",
            "version": "1.0.0",
            "private": True,
            "dependencies": {
                "@testing-library/jest-dom": "^5.16.4",
                "@testing-library/react": "^13.3.0",
                "@testing-library/user-event": "^13.5.0",
                "lucide-react": "^0.263.1",
                "react": "^18.2.0",
                "react-dom": "^18.2.0",
                "react-scripts": "5.0.1",
                "web-vitals": "^2.1.4"
            },
            "scripts": {
                "start": "react-scripts start",
                "build": "react-scripts build",
                "test": "react-scripts test",
                "eject": "react-scripts eject"
            },
            "eslintConfig": {
                "extends": [
                    "react-app",
                    "react-app/jest"
                ]
            },
            "browserslist": {
                "production": [
                    ">0.2%",
                    "not dead",
                    "not op_mini all"
                ],
                "development": [
                    "last 1 chrome version",
                    "last 1 firefox version",
                    "last 1 safari version"
                ]
            }
        }
        
        import json
        with open(package_json, 'w') as f:
            json.dump(package_content, f, indent=2)
        
        print("   ✅ package.json created")

def main():
    """Main application runner"""
    print("💊 AI Prescription Analyzer - Application Setup")
    print("=" * 60)
    
    # Check Python version
    if not check_python_version():
        return False
    
    # Check dependencies
    if not check_dependencies():
        print("\n💡 Install dependencies with:")
        print("   pip install -r backend/integration/requirements.txt")
        return False
    
    # Check prescription analyzer
    if not check_prescription_analyzer():
        return False
    
    # Setup environment
    setup_environment()
    
    # Create package.json if needed
    frontend_dir = Path(__file__).parent / 'frontend'
    if frontend_dir.exists():
        create_package_json()
    
    print("\n" + "=" * 60)
    print("🎉 Setup completed successfully!")
    
    # Start backend server in a separate thread
    print("\n🔧 Starting services...")
    backend_thread = threading.Thread(target=start_backend, daemon=True)
    backend_thread.start()
    
    # Wait for backend to start
    print("   ⏳ Waiting for backend to start...")
    if wait_for_port('localhost', 8000, timeout=30):
        print("   ✅ Backend server is running")
    else:
        print("   ❌ Backend failed to start")
        return False
    
    # Start frontend if available
    frontend_result = start_frontend()
    frontend_process = None
    
    if isinstance(frontend_result, tuple):
        frontend_started, frontend_process = frontend_result
    else:
        frontend_started = frontend_result
    
    # Open browser if frontend started
    if frontend_started:
        browser_thread = threading.Thread(target=open_browser, daemon=True)
        browser_thread.start()
    
    print("\n" + "=" * 60)
    print("🚀 AI Prescription Analyzer is now running!")
    print("=" * 60)
    print("💊 Frontend: http://localhost:3000")
    print("🔧 Backend API: http://localhost:8000")
    print("📚 API Docs: http://localhost:8000/docs")
    print("🏥 Health Check: http://localhost:8000/health")
    print("=" * 60)
    print("\n⚠️  IMPORTANT MEDICAL DISCLAIMER:")
    print("This application is for educational and demonstration purposes only.")
    print("Always consult qualified healthcare professionals for medical advice.")
    print("Do not rely solely on AI analysis for medical decisions.")
    print("Call emergency services for urgent medical situations.")
    print("=" * 60)
    
    try:
        # Keep the main thread alive
        print("\n💡 Press Ctrl+C to stop the application")
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n👋 Shutting down AI Prescription Analyzer...")
        if frontend_process:
            frontend_process.terminate()
        return True

if __name__ == "__main__":
    try:
        success = main()
        if not success:
            print("\n❌ Application failed to start properly.")
            sys.exit(1)
    except Exception as e:
        print(f"\n❌ Unexpected error: {str(e)}")
        sys.exit(1)