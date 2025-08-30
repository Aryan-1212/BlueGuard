#!/usr/bin/env python3
"""
Startup script for the Coastal Threat Prediction Flask Server
This script provides a simple way to start the server with proper error handling
"""

import os
import sys
import subprocess
import time

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        print(f"Current version: {sys.version}")
        return False
    print(f"✅ Python version: {sys.version}")
    return True

def check_dependencies():
    """Check if required packages are installed"""
    required_packages = [
        'flask', 'flask_cors', 'pandas', 'numpy', 'sklearn', 
        'matplotlib', 'seaborn', 'statsmodels', 'joblib', 'plotly'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
            print(f"✅ {package}")
        except ImportError:
            missing_packages.append(package)
            print(f"❌ {package} - Missing")
    
    if missing_packages:
        print(f"\n⚠️  Missing packages: {', '.join(missing_packages)}")
        print("Install them using: pip install -r requirements.txt")
        return False
    
    return True

def install_dependencies():
    """Install required dependencies"""
    print("\n📦 Installing dependencies...")
    try:
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], 
                      check=True, capture_output=True, text=True)
        print("✅ Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False

def start_server():
    """Start the Flask server"""
    print("\n🚀 Starting Flask server...")
    
    # Check if app.py exists
    if not os.path.exists("app.py"):
        print("❌ app.py not found in current directory")
        return False
    
    try:
        # Start the server
        print("🌐 Server will be available at: http://localhost:5000")
        print("📊 API endpoints:")
        print("   GET  /health         - Health check")
        print("   GET  /model-info     - Model information")
        print("   GET  /threat-report  - Threat analysis")
        print("   GET  /forecast       - Time series forecasts")
        print("   POST /predict        - Make predictions")
        print("   POST /retrain        - Retrain models")
        print("\n💡 Press Ctrl+C to stop the server")
        print("=" * 60)
        
        # Run the Flask app
        subprocess.run([sys.executable, "app.py"])
        
    except KeyboardInterrupt:
        print("\n\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        return False
    
    return True

def main():
    """Main function"""
    print("🌊 Coastal Threat Prediction AI Server")
    print("=" * 50)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Check dependencies
    print("\n🔍 Checking dependencies...")
    if not check_dependencies():
        print("\n📦 Attempting to install dependencies...")
        if not install_dependencies():
            print("❌ Failed to install dependencies. Please install them manually.")
            sys.exit(1)
        
        # Check again after installation
        print("\n🔍 Re-checking dependencies...")
        if not check_dependencies():
            print("❌ Dependencies still missing after installation")
            sys.exit(1)
    
    # Start server
    start_server()

if __name__ == "__main__":
    main()
