from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="ai-prescription-analyzer",
    version="1.0.0",
    author="AI Medical Team",
    author_email="contact@medicalai.com",
    description="AI-powered prescription analysis and medicine ordering system",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/yourusername/ai-prescription-analyzer",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Healthcare Industry",
        "Topic :: Scientific/Engineering :: Medical Science Apps.",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
    ],
    python_requires=">=3.8",
    install_requires=[
        # Web & API
        "fastapi>=0.104.1",
        "uvicorn[standard]>=0.24.0",
        "python-multipart>=0.0.6",
        "aiofiles>=23.2.1",
        "python-dotenv>=1.0.0",
        "python-jose>=3.3.0",
        
        # Core ML/OCR
        "opencv-python>=4.8.1",
        "numpy>=1.26.4",
        "Pillow>=10.3.0",
        "easyocr>=1.7.0",
        "pytesseract>=0.3.10",
        "scikit-image>=0.25.2",
        
        # NLP
        "spacy>=3.7.2",
        "fuzzywuzzy>=0.18.0",
        "python-Levenshtein>=0.23.0",
        
        # LangChain & AI
        "cohere>=4.32",
        
        # Data & Utils
        "pandas>=2.0.3",
        "pydantic>=2.5.0",
        "python-dateutil>=2.8.2",
    ],
    extras_require={
        "dev": [
            "pytest>=7.0.0",
            "pytest-fastapi>=0.1.0",
            "black>=23.0.0",
            "flake8>=6.0.0",
            "mypy>=1.0.0",
        ],
        "prod": [
            "gunicorn>=21.0.0",
            "waitress>=2.1.0",
        ]
    },
    entry_points={
        "console_scripts": [
            "prescription-analyzer=run:main",
        ],
    },
    include_package_data=True,
    package_data={
        "": ["*.json", "*.csv", "*.pkl"],
    },
)