#!/usr/bin/env python3
"""
AI Prescription Analyzer - Project Structure Setup
This script creates the complete directory structure and files for the application.
"""

import os
import json
from pathlib import Path

def create_directory_structure():
    """Create the complete project directory structure"""
    
    base_dir = Path("ai-prescription-analyzer")
    
    # Create main directories
    directories = [
        base_dir,
        base_dir / "backend",
        base_dir / "backend" / "integration",
        base_dir / "frontend",
        base_dir / "frontend" / "public",
        base_dir / "frontend" / "src",
    ]
    
    for directory in directories:
        directory.mkdir(parents=True, exist_ok=True)
        print(f"Created directory: {directory}")
    
    return base_dir

def create_backend_files(base_dir):
    """Create backend files"""
    backend_dir = base_dir / "backend"
    
    # Copy the prescription analyzer (this would be the content from the previous artifacts)
    print("✅ prescription_analyzer.py should be placed in backend/")
    print("✅ main.py should be placed in backend/")
    
    # Create integration files
    integration_dir = backend_dir / "integration"
    
    # Create requirements.txt
    requirements_content = """# Web & API
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6
aiofiles==23.2.1
python-dotenv==1.0.0
python-jose==3.3.0

# Core ML/OCR
opencv-python==4.8.1.78
numpy==1.26.4
Pillow==10.3.0
easyocr==1.7.0
pytesseract==0.3.10
scikit-image==0.25.2

# NLP
spacy==3.7.2
fuzzywuzzy==0.18.0
python-Levenshtein==0.23.0

# LangChain & AI
cohere==4.32

# Data & Utils
pandas==2.0.3
pydantic==2.5.0
python-dateutil==2.8.2
"""
    
    with open(integration_dir / "requirements.txt", "w") as f:
        f.write(requirements_content)
    print("✅ Created requirements.txt")
    
    # Create keys.py (template)
    keys_content = """# API Keys Configuration
# Replace with your actual API keys

# Cohere API Key (optional, for advanced NLP analysis)
# Get your free API key from: https://cohere.ai/
COHERE_API_KEY = "your_cohere_api_key_here"

# Tesseract Path (optional, if not in system PATH)
# Windows example: r"C:\\Program Files\\Tesseract-OCR\\tesseract.exe"
# Leave empty to use system default
TESSERACT_PATH = ""
"""
    
    with open(integration_dir / "keys.py", "w") as f:
        f.write(keys_content)
    print("✅ Created keys.py template")

def create_frontend_files(base_dir):
    """Create frontend files"""
    frontend_dir = base_dir / "frontend"
    
    # Create package.json
    package_json = {
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
        },
        "proxy": "http://localhost:8000"
    }
    
    with open(frontend_dir / "package.json", "w") as f:
        json.dump(package_json, f, indent=2)
    print("✅ Created package.json")
    
    # Create public/index.html
    index_html = """<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="AI-powered prescription analysis and medicine ordering system"
    />
    <title>AI Prescription Analyzer</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>"""
    
    with open(frontend_dir / "public" / "index.html", "w") as f:
        f.write(index_html)
    print("✅ Created public/index.html")
    
    # Create src/index.js
    index_js = """import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();"""
    
    with open(frontend_dir / "src" / "index.js", "w") as f:
        f.write(index_js)
    print("✅ Created src/index.js")
    
    # Create src/index.css
    index_css = """body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f8fafc;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}

* {
  box-sizing: border-box;
}"""
    
    with open(frontend_dir / "src" / "index.css", "w") as f:
        f.write(index_css)
    print("✅ Created src/index.css")
    
    # Create src/reportWebVitals.js
    web_vitals = """const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;"""
    
    with open(frontend_dir / "src" / "reportWebVitals.js", "w") as f:
        f.write(web_vitals)
    print("✅ Created src/reportWebVitals.js")
    
    print("✅ App.js and App.css should be placed in frontend/src/")

def create_root_files(base_dir):
    """Create root level files"""
    
    # Create README.md
    readme_content = """# 💊 AI Prescription Analyzer

An advanced AI-powered prescription analysis system that uses OCR and NLP to extract medicine information from prescription images and enable online ordering.

## 🚀 Quick Start

1. **Setup the project structure**:
```bash
python setup_project_structure.py
```

2. **Install Python dependencies**:
```bash
cd ai-prescription-analyzer
pip install -r backend/integration/requirements.txt
```

3. **Install frontend dependencies**:
```bash
cd frontend
npm install
cd ..
```

4. **Run the application**:
```bash
python run.py
```

The application will start both frontend (http://localhost:3000) and backend (http://localhost:8000) servers.

## 📁 Project Structure

```
ai-prescription-analyzer/
├── run.py                          # Main application runner
├── setup_project_structure.py      # Project setup script
├── README.md
├── backend/
│   ├── main.py                     # FastAPI backend
│   ├── prescription_analyzer.py    # Core analysis engine
│   └── integration/
│       ├── requirements.txt        # Python dependencies
│       └── keys.py                 # API keys configuration
└── frontend/
    ├── package.json                # Node.js dependencies
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js
        ├── index.css
        ├── App.js                  # React frontend
        ├── App.css
        └── reportWebVitals.js
```

## 🔧 Configuration

### API Keys (Optional)
Edit `backend/integration/keys.py`:
- **Cohere API Key**: For advanced AI analysis (get free key from https://cohere.ai/)
- **Tesseract Path**: If Tesseract is not in your system PATH

### System Requirements
- Python 3.8+
- Node.js 16+
- At least 4GB RAM

## 🌟 Features

- **Advanced OCR**: EasyOCR + Tesseract for text extraction
- **AI Analysis**: Cohere API for intelligent medicine identification
- **Medicine Database**: Comprehensive database with availability
- **Order System**: Complete medicine ordering with delivery tracking
- **Modern UI**: React-based responsive interface
- **REST API**: FastAPI backend with documentation

## ⚠️ Medical Disclaimer

This application is for educational and demonstration purposes only. Always consult qualified healthcare professionals for medical advice. Do not rely solely on AI analysis for medical decisions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
"""
    
    with open(base_dir / "README.md", "w") as f:
        f.write(readme_content)
    print("✅ Created README.md")
    
    # Create setup.py
    setup_content = """from setuptools import setup, find_packages

setup(
    name="ai-prescription-analyzer",
    version="1.0.0",
    description="AI-powered prescription analysis and medicine ordering system",
    packages=find_packages(),
    python_requires=">=3.8",
    install_requires=[
        "fastapi>=0.104.1",
        "uvicorn[standard]>=0.24.0",
        "opencv-python>=4.8.1",
        "numpy>=1.26.4",
        "Pillow>=10.3.0",
        "easyocr>=1.7.0",
        "pytesseract>=0.3.10",
        "spacy>=3.7.2",
        "fuzzywuzzy>=0.18.0",
        "cohere>=4.32",
        "pandas>=2.0.3",
        "pydantic>=2.5.0",
    ],
    entry_points={
        "console_scripts": [
            "prescription-analyzer=run:main",
        ],
    },
)"""
    
    with open(base_dir / "setup.py", "w") as f:
        f.write(setup_content)
    print("✅ Created setup.py")

def create_instructions_file(base_dir):
    """Create setup instructions"""
    instructions = """# 🚀 Setup Instructions for AI Prescription Analyzer

## Files to Copy

After running this setup script, you need to copy the following files from your artifacts:

### Backend Files
1. Copy `prescription_analyzer.py` to `backend/`
2. Copy `main.py` to `backend/`
3. Copy `run.py` to the root directory

### Frontend Files
1. Copy `App.js` to `frontend/src/`
2. Copy `App.css` to `frontend/src/`

## Installation Steps

1. **Install Python dependencies**:
   ```bash
   pip install -r backend/integration/requirements.txt
   ```

2. **Install additional OCR components**:
   ```bash
   # For spaCy English model
   python -m spacy download en_core_web_sm
   ```

3. **Install Node.js dependencies**:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Configure API keys** (optional):
   - Edit `backend/integration/keys.py`
   - Add your Cohere API key for advanced analysis
   - Set Tesseract path if needed

5. **Run the application**:
   ```bash
   python run.py
   ```

## Troubleshooting

### Common Issues

1. **EasyOCR installation issues**:
   ```bash
   pip install easyocr --no-deps
   pip install torch torchvision
   ```

2. **Tesseract not found**:
   - Install Tesseract OCR from https://github.com/tesseract-ocr/tesseract
   - Set the path in `backend/integration/keys.py`

3. **spaCy model not found**:
   ```bash
   python -m spacy download en_core_web_sm
   ```

4. **Frontend build issues**:
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   cd ..
   ```

5. **Port conflicts**:
   - Backend runs on port 8000
   - Frontend runs on port 3000
   - Make sure these ports are available

### System Requirements

- **Windows**: Install Visual Studio Build Tools for Python packages
- **macOS**: Install Xcode command line tools: `xcode-select --install`
- **Linux**: Install build essentials: `sudo apt-get install build-essential`

## Testing the Installation

1. **Test backend**:
   ```bash
   cd backend
   python -c "from prescription_analyzer import EnhancedPrescriptionAnalyzer; print('Backend OK')"
   ```

2. **Test frontend**:
   ```bash
   cd frontend
   npm test -- --watchAll=false
   ```

3. **Full application test**:
   ```bash
   python run.py
   ```
   - Visit http://localhost:3000
   - Upload a sample prescription image
   - Check if analysis works

## Production Deployment

For production deployment:

1. **Build frontend**:
   ```bash
   cd frontend
   npm run build
   cd ..
   ```

2. **Use production server**:
   ```bash
   pip install gunicorn
   cd backend
   gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
   ```

3. **Serve frontend**:
   Use nginx, Apache, or any static file server to serve the `frontend/build` directory.

## Support

If you encounter any issues:

1. Check the console logs
2. Verify all dependencies are installed
3. Ensure API keys are configured correctly
4. Test individual components separately

For more help, create an issue in the project repository.
"""

def main():
    """Main setup function"""
    print("🚀 Setting up AI Prescription Analyzer project structure...")
    print("=" * 60)
    
    # Create directory structure
    base_dir = create_directory_structure()
    
    # Create backend files
    print("\n📂 Creating backend files...")
    create_backend_files(base_dir)
    
    # Create frontend files
    print("\n⚛️  Creating frontend files...")
    create_frontend_files(base_dir)
    
    # Create root files
    print("\n📄 Creating root files...")
    create_root_files(base_dir)
    
    # Create instructions
    print("\n📝 Creating setup instructions...")
    create_instructions_file(base_dir)
    
    print("\n" + "=" * 60)
    print("✅ Project structure created successfully!")
    print("=" * 60)
    print(f"📁 Project directory: {base_dir.absolute()}")
    print("\n📋 Next steps:")
    print("1. Copy the required files (see SETUP_INSTRUCTIONS.txt)")
    print("2. Install Python dependencies: pip install -r backend/integration/requirements.txt")
    print("3. Install Node.js dependencies: cd frontend && npm install")
    print("4. Configure API keys in backend/integration/keys.py")
    print("5. Run the application: python run.py")
    print("\n📖 See README.md for detailed instructions")
    print("📝 See SETUP_INSTRUCTIONS.txt for troubleshooting")
    
    return True

if __name__ == "__main__":
    try:
        main()
        print("\n🎉 Setup completed successfully!")
    except Exception as e:
        print(f"\n❌ Setup failed: {e}")
        exit(1)