import os
from pathlib import Path

class Config:
    """Application configuration settings"""
    
    # Base directories
    BASE_DIR = Path(__file__).parent
    BACKEND_DIR = BASE_DIR / 'backend'
    FRONTEND_DIR = BASE_DIR / 'frontend'
    INTEGRATION_DIR = BACKEND_DIR / 'integration'
    UPLOADS_DIR = BACKEND_DIR / 'uploads'
    
    # FastAPI settings
    SECRET_KEY = os.environ.get('SECRET_KEY', 'prescription-analyzer-dev-key')
    DEBUG = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    
    # Server settings
    BACKEND_HOST = os.environ.get('BACKEND_HOST', '0.0.0.0')
    BACKEND_PORT = int(os.environ.get('BACKEND_PORT', 8000))
    FRONTEND_PORT = int(os.environ.get('FRONTEND_PORT', 3000))
    
    # CORS settings
    CORS_ORIGINS = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ]
    
    # API settings
    API_VERSION = "1.0"
    API_TITLE = "AI Prescription Analyzer API"
    API_DESCRIPTION = "Advanced prescription analysis using OCR and NLP"
    
    # File upload settings
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
    MIN_FILE_SIZE = 1024  # 1KB
    ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.tiff', '.bmp', '.webp'}
    ALLOWED_MIME_TYPES = {
        'image/jpeg',
        'image/png', 
        'image/tiff',
        'image/bmp',
        'image/webp'
    }
    
    # OCR settings
    OCR_ENGINES = ['easyocr', 'tesseract']
    TESSERACT_CONFIG = '--oem 3 --psm 6'  # OCR Engine Mode 3, Page Segmentation Mode 6
    EASYOCR_LANGUAGES = ['en']
    OCR_CONFIDENCE_THRESHOLD = 0.3
    
    # NLP settings
    COHERE_MODEL = 'command-light'
    COHERE_MAX_TOKENS = 500
    COHERE_TEMPERATURE = 0.3
    
    # Medicine database settings
    MEDICINE_FUZZY_THRESHOLD = 70  # Minimum fuzzy match score
    MAX_MEDICINE_RESULTS = 20
    SIMILARITY_THRESHOLD = 0.7
    
    # Analysis confidence settings
    MIN_CONFIDENCE_THRESHOLD = 0.1
    HIGH_CONFIDENCE_THRESHOLD = 0.8
    MEDIUM_CONFIDENCE_THRESHOLD = 0.6
    
    # Order management settings
    BASE_MEDICINE_PRICE = 75.0  # Base price per medicine in INR
    DELIVERY_CHARGE = 50.0      # Delivery charge in INR
    BULK_DISCOUNT_THRESHOLD = 5  # Minimum quantity for bulk discount
    BULK_DISCOUNT_RATE = 0.1     # 10% discount for bulk orders
    SMALL_DISCOUNT_THRESHOLD = 3 # Minimum quantity for small discount
    SMALL_DISCOUNT_RATE = 0.05   # 5% discount for small orders
    
    # Delivery settings
    ESTIMATED_DELIVERY_DAYS = 2  # Default delivery time in days
    MAX_DELIVERY_DAYS = 7       # Maximum delivery time
    
    # Medical safety settings
    EMERGENCY_KEYWORDS = [
        'chest pain', 'difficulty breathing', 'shortness of breath', 'severe pain',
        'heart attack', 'stroke', 'bleeding', 'unconscious', 'seizure',
        'severe headache', 'vision loss', 'paralysis', 'severe allergic reaction'
    ]
    
    HIGH_RISK_KEYWORDS = [
        'persistent fever', 'severe fatigue', 'blood in stool', 'blood in urine',
        'severe vomiting', 'dehydration', 'fainting', 'rapid weight loss'
    ]
    
    # Age-based risk factors
    ELDERLY_AGE_THRESHOLD = 65
    CHILD_AGE_THRESHOLD = 12
    
    # Prescription validation
    MAX_MEDICINES_PER_PRESCRIPTION = 20
    MAX_DIAGNOSIS_ITEMS = 5
    PRESCRIPTION_ID_LENGTH = 8
    
    # Pattern matching settings
    NAME_MIN_LENGTH = 2
    NAME_MAX_LENGTH = 30
    AGE_MIN = 1
    AGE_MAX = 120
    
    # Logging settings
    LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO')
    LOG_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    LOG_FILE = BACKEND_DIR / 'logs' / 'prescription_analyzer.log'
    
    # Cache settings
    ENABLE_CACHING = True
    CACHE_TIMEOUT = 3600  # 1 hour in seconds
    MAX_CACHE_SIZE = 100  # Maximum number of cached results
    
    # Performance settings
    MAX_CONCURRENT_REQUESTS = 10
    REQUEST_TIMEOUT = 30  # seconds
    MAX_RETRY_ATTEMPTS = 3
    
    @classmethod
    def ensure_directories(cls):
        """Create necessary directories if they don't exist"""
        directories = [
            cls.BASE_DIR,
            cls.BACKEND_DIR,
            cls.FRONTEND_DIR,
            cls.INTEGRATION_DIR,
            cls.UPLOADS_DIR,
            cls.BACKEND_DIR / 'logs'
        ]
        
        for directory in directories:
            directory.mkdir(parents=True, exist_ok=True)
    
    @classmethod
    def validate_file(cls, file_path: str, file_size: int, content_type: str) -> tuple[bool, str]:
        """Validate uploaded file"""
        file_path = Path(file_path)
        
        # Check file extension
        if file_path.suffix.lower() not in cls.ALLOWED_EXTENSIONS:
            return False, f"File type not allowed. Supported formats: {', '.join(cls.ALLOWED_EXTENSIONS)}"
        
        # Check MIME type
        if content_type not in cls.ALLOWED_MIME_TYPES:
            return False, f"Invalid file format. Please upload an image file."
        
        # Check file size
        if file_size > cls.MAX_FILE_SIZE:
            return False, f"File too large. Maximum size is {cls.MAX_FILE_SIZE // (1024*1024)}MB"
        
        if file_size < cls.MIN_FILE_SIZE:
            return False, f"File too small. Please ensure the image is readable."
        
        return True, ""
    
    @classmethod
    def get_api_keys(cls):
        """Load API keys from environment or keys.py"""
        api_keys = {}
        
        # Try environment variables first
        api_keys['cohere'] = os.getenv('COHERE_API_KEY')
        api_keys['tesseract_path'] = os.getenv('TESSERACT_PATH')
        
        # Try loading from keys.py if environment variables not found
        if not api_keys['cohere']:
            try:
                import sys
                sys.path.append(str(cls.INTEGRATION_DIR))
                from keys import COHERE_API_KEY
                api_keys['cohere'] = COHERE_API_KEY
            except (ImportError, AttributeError):
                pass
        
        if not api_keys['tesseract_path']:
            try:
                import sys
                sys.path.append(str(cls.INTEGRATION_DIR))
                from keys import TESSERACT_PATH
                api_keys['tesseract_path'] = TESSERACT_PATH
            except (ImportError, AttributeError):
                pass
        
        return api_keys
    
    @classmethod
    def check_dependencies(cls):
        """Check if required dependencies are available"""
        dependencies = {
            'opencv-python': 'cv2',
            'numpy': 'numpy',
            'pillow': 'PIL',
            'easyocr': 'easyocr',
            'pytesseract': 'pytesseract',
            'spacy': 'spacy',
            'fuzzywuzzy': 'fuzzywuzzy',
            'cohere': 'cohere',
            'pandas': 'pandas',
            'fastapi': 'fastapi',
            'uvicorn': 'uvicorn'
        }
        
        missing_deps = []
        available_deps = []
        
        for package, import_name in dependencies.items():
            try:
                __import__(import_name)
                available_deps.append(package)
            except ImportError:
                missing_deps.append(package)
        
        return available_deps, missing_deps
    
    @classmethod
    def get_system_info(cls):
        """Get system information for diagnostics"""
        import platform
        import sys
        
        return {
            'python_version': sys.version,
            'platform': platform.platform(),
            'architecture': platform.architecture()[0],
            'processor': platform.processor(),
            'base_dir': str(cls.BASE_DIR),
            'backend_dir': str(cls.BACKEND_DIR),
            'frontend_dir': str(cls.FRONTEND_DIR)
        }


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    LOG_LEVEL = 'DEBUG'
    ENABLE_CACHING = False
    
    # More verbose logging for development
    LOG_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s'


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    LOG_LEVEL = 'WARNING'
    
    # Use environment variable if set, otherwise fallback to default
    SECRET_KEY = os.environ.get('SECRET_KEY', 'prescription-analyzer-prod-key-change-me')
    
    # Stricter CORS in production
    CORS_ORIGINS = [
        os.environ.get('FRONTEND_URL', 'http://localhost:3000')
    ]
    
    # More conservative file size limits
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB for production
    
    # Performance optimizations
    MAX_CONCURRENT_REQUESTS = 20
    ENABLE_CACHING = True


class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    DEBUG = True
    LOG_LEVEL = 'DEBUG'
    
    # Use smaller limits for testing
    MAX_FILE_SIZE = 1 * 1024 * 1024  # 1MB for testing
    MAX_MEDICINES_PER_PRESCRIPTION = 5
    
    # Disable caching for consistent test results
    ENABLE_CACHING = False


# Configuration mapping
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}


def get_config(config_name=None):
    """Get configuration based on environment"""
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')
    
    return config.get(config_name, config['default'])


# Medical knowledge base for validation
MEDICAL_VALIDATION = {
    'dangerous_combinations': [
        # Examples of dangerous drug combinations (simplified)
        ('warfarin', 'aspirin'),
        ('methotrexate', 'trimethoprim'),
        ('digoxin', 'verapamil')
    ],
    
    'age_restrictions': {
        'aspirin': {'min_age': 16, 'reason': 'Reye\'s syndrome risk'},
        'tetracycline': {'min_age': 8, 'reason': 'Tooth discoloration'},
    },
    
    'pregnancy_categories': {
        'A': 'Safe',
        'B': 'Probably safe',
        'C': 'Use with caution',
        'D': 'Unsafe',
        'X': 'Contraindicated'
    },
    
    'common_side_effects': {
        'antibiotics': ['nausea', 'diarrhea', 'allergic reactions'],
        'pain_relievers': ['stomach upset', 'drowsiness', 'dizziness'],
        'blood_pressure_meds': ['dizziness', 'fatigue', 'cough']
    }
}


# Default medicine database categories
MEDICINE_CATEGORIES = {
    'antibiotic': {
        'description': 'Fights bacterial infections',
        'common_uses': ['bacterial infections', 'pneumonia', 'UTI'],
        'precautions': ['Take full course', 'Avoid alcohol']
    },
    'pain_reliever': {
        'description': 'Reduces pain and inflammation',
        'common_uses': ['headache', 'fever', 'muscle pain'],
        'precautions': ['Take with food', 'Limit duration']
    },
    'antidiabetic': {
        'description': 'Controls blood sugar levels',
        'common_uses': ['diabetes type 2', 'prediabetes'],
        'precautions': ['Monitor blood sugar', 'Regular meals']
    },
    'vitamin': {
        'description': 'Essential nutrients supplement',
        'common_uses': ['deficiency prevention', 'general health'],
        'precautions': ['Follow recommended dosage']
    }
}


if __name__ == "__main__":
    # Test configuration
    config_obj = get_config()
    print(f"Configuration: {config_obj.__name__}")
    print(f"Debug mode: {config_obj.DEBUG}")
    print(f"Base directory: {config_obj.BASE_DIR}")
    
    # Test dependency check
    available, missing = config_obj.check_dependencies()
    print(f"Available dependencies: {len(available)}")
    print(f"Missing dependencies: {missing}")
    
    # Test directory creation
    config_obj.ensure_directories()
    print("Directories ensured")
    
    # Test API keys
    keys = config_obj.get_api_keys()
    print(f"API keys loaded: {list(keys.keys())}")
    
    print("Configuration test completed successfully!")