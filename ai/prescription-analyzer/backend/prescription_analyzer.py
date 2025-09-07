"""
Fixed Enhanced Prescription Analyzer - Robust Version
Addresses integration issues and improves reliability
"""

import cv2
import numpy as np
import re
import json
import uuid
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple, Optional, Any
from dataclasses import dataclass
import logging
import os
import tempfile

# OCR imports with better error handling
try:
    import easyocr
    HAS_EASYOCR = True
except ImportError:
    HAS_EASYOCR = False
    print("EasyOCR not available")

try:
    import pytesseract
    HAS_TESSERACT = True
except ImportError:
    HAS_TESSERACT = False
    print("Tesseract not available")

# NLP imports
try:
    from fuzzywuzzy import fuzz, process
    HAS_FUZZYWUZZY = True
except ImportError:
    HAS_FUZZYWUZZY = False
    print("FuzzyWuzzy not available")

# Cohere API
try:
    import cohere
    HAS_COHERE = True
except ImportError:
    HAS_COHERE = False
    print("Cohere not available")

# Image processing
from PIL import Image

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class AnalysisResult:
    """Standardized result structure"""
    success: bool = False
    prescription_id: str = ""
    patient: Dict[str, str] = None
    doctor: Dict[str, str] = None
    medicines: List[Dict[str, Any]] = None
    diagnosis: List[str] = None
    confidence_score: float = 0.0
    raw_text: str = ""
    error: str = ""
    
    def __post_init__(self):
        if self.patient is None:
            self.patient = {"name": "", "age": "", "gender": ""}
        if self.doctor is None:
            self.doctor = {"name": "", "specialization": "", "registration_number": ""}
        if self.medicines is None:
            self.medicines = []
        if self.diagnosis is None:
            self.diagnosis = []
        if not self.prescription_id:
            self.prescription_id = f"RX-{uuid.uuid4().hex[:8].upper()}"

class EnhancedPrescriptionAnalyzer:
    """Fixed and robust prescription analyzer"""
    
    def __init__(self, cohere_api_key: str = None, tesseract_path: str = None, force_api: bool = False):
        """Initialize with robust error handling"""
        self.cohere_api_key = cohere_api_key or os.getenv('COHERE_API_KEY')
        self.tesseract_path = tesseract_path
        self.force_api = force_api
        
        # Initialize components in order
        self._init_medicine_database()
        self._init_ocr_engines()
        self._init_cohere()
        self._init_patterns()
        
        logger.info("Enhanced Prescription Analyzer initialized successfully")
        logger.info(f"OCR Engines Available: {self._get_available_ocr_engines()}")
        logger.info(f"Medicine Database: {len(self.medicine_database)} entries")
    
    def _init_medicine_database(self):
        """Initialize comprehensive medicine database"""
        self.medicine_database = {
            # Analgesics & Antipyretics
            "paracetamol": {"generic": "acetaminophen", "category": "analgesic", "available": True},
            "acetaminophen": {"generic": "acetaminophen", "category": "analgesic", "available": True},
            "ibuprofen": {"generic": "ibuprofen", "category": "nsaid", "available": True},
            "aspirin": {"generic": "aspirin", "category": "nsaid", "available": True},
            "diclofenac": {"generic": "diclofenac", "category": "nsaid", "available": True},
            "tramadol": {"generic": "tramadol", "category": "analgesic", "available": True},
            
            # Antibiotics
            "amoxicillin": {"generic": "amoxicillin", "category": "antibiotic", "available": True},
            "azithromycin": {"generic": "azithromycin", "category": "antibiotic", "available": True},
            "ciprofloxacin": {"generic": "ciprofloxacin", "category": "antibiotic", "available": True},
            "doxycycline": {"generic": "doxycycline", "category": "antibiotic", "available": True},
            "cephalexin": {"generic": "cephalexin", "category": "antibiotic", "available": True},
            "levofloxacin": {"generic": "levofloxacin", "category": "antibiotic", "available": True},
            "erythromycin": {"generic": "erythromycin", "category": "antibiotic", "available": True},
            "augmentin": {"generic": "amoxicillin + clavulanic acid", "category": "antibiotic", "available": True},
            
            # Gastrointestinal
            "omeprazole": {"generic": "omeprazole", "category": "ppi", "available": True},
            "pantoprazole": {"generic": "pantoprazole", "category": "ppi", "available": True},
            "esomeprazole": {"generic": "esomeprazole", "category": "ppi", "available": True},
            "lansoprazole": {"generic": "lansoprazole", "category": "ppi", "available": True},
            "ranitidine": {"generic": "ranitidine", "category": "h2_blocker", "available": True},
            "domperidone": {"generic": "domperidone", "category": "prokinetic", "available": True},
            
            # Cardiovascular
            "amlodipine": {"generic": "amlodipine", "category": "calcium_channel_blocker", "available": True},
            "lisinopril": {"generic": "lisinopril", "category": "ace_inhibitor", "available": True},
            "atenolol": {"generic": "atenolol", "category": "beta_blocker", "available": True},
            "metoprolol": {"generic": "metoprolol", "category": "beta_blocker", "available": True},
            "losartan": {"generic": "losartan", "category": "arb", "available": True},
            "telmisartan": {"generic": "telmisartan", "category": "arb", "available": True},
            
            # Antidiabetic
            "metformin": {"generic": "metformin", "category": "antidiabetic", "available": True},
            "glimepiride": {"generic": "glimepiride", "category": "sulfonylurea", "available": True},
            "gliclazide": {"generic": "gliclazide", "category": "sulfonylurea", "available": True},
            "insulin": {"generic": "insulin", "category": "hormone", "available": True},
            
            # Respiratory & Allergy
            "cetirizine": {"generic": "cetirizine", "category": "antihistamine", "available": True},
            "loratadine": {"generic": "loratadine", "category": "antihistamine", "available": True},
            "fexofenadine": {"generic": "fexofenadine", "category": "antihistamine", "available": True},
            "salbutamol": {"generic": "salbutamol", "category": "bronchodilator", "available": True},
            "montelukast": {"generic": "montelukast", "category": "leukotriene_receptor_antagonist", "available": True},
            
            # Indian Brand Names
            "crocin": {"generic": "paracetamol", "category": "analgesic", "available": True},
            "dolo": {"generic": "paracetamol", "category": "analgesic", "available": True},
            "calpol": {"generic": "paracetamol", "category": "analgesic", "available": True},
            "combiflam": {"generic": "ibuprofen + paracetamol", "category": "analgesic", "available": True},
            "brufen": {"generic": "ibuprofen", "category": "nsaid", "available": True},
            "voveran": {"generic": "diclofenac", "category": "nsaid", "available": True},
            "zerodol": {"generic": "aceclofenac", "category": "nsaid", "available": True},
            "disprin": {"generic": "aspirin", "category": "nsaid", "available": True},
            "volini": {"generic": "diclofenac", "category": "topical_analgesic", "available": True},
            
            # Vitamins & Supplements
            "vitamin d": {"generic": "cholecalciferol", "category": "vitamin", "available": True},
            "vitamin d3": {"generic": "cholecalciferol", "category": "vitamin", "available": True},
            "vitamin b12": {"generic": "cyanocobalamin", "category": "vitamin", "available": True},
            "folic acid": {"generic": "folic acid", "category": "vitamin", "available": True},
            "iron": {"generic": "ferrous sulfate", "category": "mineral", "available": True},
            "calcium": {"generic": "calcium carbonate", "category": "mineral", "available": True},
            
            # Antacids
            "eno": {"generic": "sodium bicarbonate", "category": "antacid", "available": True},
            "gelusil": {"generic": "aluminum hydroxide + magnesium hydroxide", "category": "antacid", "available": True},
            "digene": {"generic": "aluminum hydroxide + magnesium hydroxide", "category": "antacid", "available": True},
        }
        
        self.disease_symptoms_database = {
            "fever": ["high temperature", "body ache", "headache", "chills", "sweating"],
            "cold": ["runny nose", "sneezing", "cough", "sore throat", "nasal congestion"],
            "flu": ["fever", "body ache", "fatigue", "cough", "headache"],
            "hypertension": ["high blood pressure", "headache", "dizziness", "chest pain"],
            "diabetes": ["high blood sugar", "frequent urination", "excessive thirst", "fatigue"],
            "gastritis": ["stomach pain", "acidity", "heartburn", "nausea", "bloating"],
            "migraine": ["severe headache", "nausea", "light sensitivity", "visual disturbance"],
            "asthma": ["difficulty breathing", "wheezing", "chest tightness", "cough"],
            "arthritis": ["joint pain", "stiffness", "swelling", "reduced mobility"],
            "infection": ["fever", "pain", "swelling", "redness", "discharge"],
            "acidity": ["heartburn", "chest burning", "sour taste", "nausea"],
            "backache": ["lower back pain", "stiffness", "muscle spasm", "difficulty moving"]
        }
    
    def _init_ocr_engines(self):
        """Initialize OCR engines with robust error handling"""
        self.ocr_engines = {}
        
        # Initialize EasyOCR with multiple fallback strategies
        if HAS_EASYOCR:
            try:
                # Try with minimal configuration first
                self.easyocr_reader = easyocr.Reader(['en'], gpu=False, verbose=False)
                self.ocr_engines['easyocr'] = True
                logger.info("EasyOCR initialized successfully")
            except Exception as e:
                logger.warning(f"EasyOCR initialization failed: {e}")
                self.easyocr_reader = None
        else:
            self.easyocr_reader = None
        
        # Initialize Tesseract
        if HAS_TESSERACT:
            try:
                if self.tesseract_path:
                    pytesseract.pytesseract.tesseract_cmd = self.tesseract_path
                
                # Test Tesseract
                test_image = np.ones((50, 200, 3), dtype=np.uint8) * 255
                cv2.putText(test_image, "TEST", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 0), 2)
                test_result = pytesseract.image_to_string(test_image, config='--oem 3 --psm 8')
                
                self.ocr_engines['tesseract'] = True
                logger.info("Tesseract initialized successfully")
            except Exception as e:
                logger.warning(f"Tesseract initialization failed: {e}")
        
        if not self.ocr_engines:
            logger.error("No OCR engines available!")
            raise RuntimeError("No OCR engines could be initialized")
    
    def _init_cohere(self):
        """Initialize Cohere API with proper error handling"""
        self.co = None
        
        if HAS_COHERE and self.cohere_api_key:
            try:
                self.co = cohere.Client(self.cohere_api_key)
                # Test with a minimal request
                test_response = self.co.chat(
                    model="command-r",
                    message="Test"
                )
                logger.info("Cohere API initialized successfully")
            except Exception as e:
                logger.warning(f"Cohere API initialization failed: {e}")
                self.co = None
    
    def _init_patterns(self):
        """Initialize regex patterns for extraction"""
        self.patterns = {
            'patient_name': [
                r'(?:patient|pt\.?\s*name|name)\s*:?\s*([A-Za-z][A-Za-z\s]{2,40})',
                r'(?:mr\.?|mrs\.?|ms\.?|miss)\s+([A-Za-z][A-Za-z\s]{2,40})',
                r'^\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,3})\s*$'
            ],
            'patient_age': [
                r'(?:age|yrs?|years?)\s*:?\s*(\d{1,3})',
                r'(\d{1,3})\s*(?:yrs?|years?|y\.?o\.?)',
                r'age\s*[-:]?\s*(\d{1,3})'
            ],
            'patient_gender': [
                r'(?:sex|gender)\s*:?\s*(male|female|m|f)\b',
                r'\b(male|female|m|f)\b',
                r'(\d+)\s*/\s*([mf])'
            ],
            'doctor_name': [
                r'(?:dr\.?|doctor)\s+([A-Za-z][A-Za-z\s\.]{2,40})',
                r'signature\s*:?\s*dr\.?\s*([A-Za-z][A-Za-z\s\.]{2,40})',
                r'consultant\s*:?\s*([A-Za-z][A-Za-z\s\.]{2,40})'
            ],
            'medicines': [
                r'(?:tab\.?|tablet)\s+([A-Za-z][A-Za-z0-9\s\-]{2,25})',
                r'(?:cap\.?|capsule)\s+([A-Za-z][A-Za-z0-9\s\-]{2,25})',
                r'(?:syp\.?|syrup)\s+([A-Za-z][A-Za-z0-9\s\-]{2,25})',
                r'^\s*\d+[\.\)]\s*([A-Za-z][A-Za-z0-9\s\-]{2,25})',
                r'^\s*[-•*]\s*([A-Za-z][A-Za-z0-9\s\-]{2,25})'
            ]
        }
    
    def _get_available_ocr_engines(self) -> List[str]:
        """Get list of available OCR engines"""
        return list(self.ocr_engines.keys())
    
    def _get_nlp_capabilities(self) -> Dict[str, bool]:
        """Get NLP capabilities"""
        return {
            'cohere_api': self.co is not None,
            'fuzzy_matching': HAS_FUZZYWUZZY,
            'medicine_database': len(self.medicine_database) > 0
        }
    
    def preprocess_image(self, image_path: str) -> List[np.ndarray]:
        """Robust image preprocessing"""
        try:
            # Read image with multiple fallback methods
            image = None
            try:
                image = cv2.imread(image_path)
            except Exception:
                try:
                    pil_image = Image.open(image_path).convert('RGB')
                    image = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
                except Exception as e:
                    logger.error(f"Failed to read image: {e}")
                    return []
            
            if image is None:
                logger.error("Could not read image")
                return []
            
            # Convert to grayscale
            if len(image.shape) == 3:
                gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            else:
                gray = image
            
            processed_images = []
            
            # Method 1: Basic adaptive threshold
            try:
                denoised = cv2.medianBlur(gray, 3)
                thresh1 = cv2.adaptiveThreshold(
                    denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                    cv2.THRESH_BINARY, 11, 2
                )
                processed_images.append(thresh1)
            except Exception as e:
                logger.warning(f"Preprocessing method 1 failed: {e}")
            
            # Method 2: OTSU thresholding
            try:
                blurred = cv2.GaussianBlur(gray, (5, 5), 0)
                _, thresh2 = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
                processed_images.append(thresh2)
            except Exception as e:
                logger.warning(f"Preprocessing method 2 failed: {e}")
            
            # Method 3: Enhanced contrast
            try:
                clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
                enhanced = clahe.apply(gray)
                processed_images.append(enhanced)
            except Exception as e:
                logger.warning(f"Preprocessing method 3 failed: {e}")
            
            # Fallback: return original grayscale if all methods failed
            if not processed_images:
                processed_images.append(gray)
            
            return processed_images
            
        except Exception as e:
            logger.error(f"Image preprocessing failed: {e}")
            return []
    
    def extract_text_ocr(self, image_path: str) -> Tuple[str, float]:
        """Enhanced OCR text extraction with fallback methods"""
        try:
            processed_images = self.preprocess_image(image_path)
            if not processed_images:
                return "", 0.0
            
            all_texts = []
            all_confidences = []
            
            for i, img in enumerate(processed_images[:3]):  # Limit to 3 methods
                # Try EasyOCR
                if self.easyocr_reader:
                    try:
                        results = self.easyocr_reader.readtext(img, detail=1, paragraph=True)
                        if results:
                            valid_results = [r for r in results if len(r) >= 3 and r[2] > 0.3]
                            if valid_results:
                                text = " ".join([r[1] for r in valid_results])
                                confidence = np.mean([r[2] for r in valid_results])
                                all_texts.append(text)
                                all_confidences.append(confidence)
                                logger.debug(f"EasyOCR {i}: {len(text)} chars, conf: {confidence:.2f}")
                    except Exception as e:
                        logger.debug(f"EasyOCR method {i} failed: {e}")
                
                # Try Tesseract
                if 'tesseract' in self.ocr_engines:
                    configs = [
                        '--oem 3 --psm 6',   # Uniform text block
                        '--oem 3 --psm 3',   # Fully automatic
                        '--oem 3 --psm 4'    # Single column
                    ]
                    
                    for j, config in enumerate(configs):
                        try:
                            text = pytesseract.image_to_string(img, config=config)
                            if text.strip() and len(text.strip()) > 10:
                                # Estimate confidence based on text quality
                                confidence = self._estimate_text_confidence(text)
                                all_texts.append(text)
                                all_confidences.append(confidence)
                                logger.debug(f"Tesseract {i}-{j}: {len(text)} chars, conf: {confidence:.2f}")
                                break
                        except Exception as e:
                            logger.debug(f"Tesseract config {j} failed: {e}")
            
            if not all_texts:
                logger.warning("No text extracted from any OCR method")
                return "", 0.0
            
            # Select best text based on length and quality
            best_idx = 0
            best_score = 0
            
            for i, (text, conf) in enumerate(zip(all_texts, all_confidences)):
                length_score = min(len(text.strip()) / 100, 1.0)
                quality_score = self._assess_text_quality(text)
                total_score = conf * 0.4 + length_score * 0.3 + quality_score * 0.3
                
                if total_score > best_score:
                    best_score = total_score
                    best_idx = i
            
            final_text = all_texts[best_idx].strip()
            final_confidence = min(best_score, 1.0)
            
            logger.info(f"OCR completed: {len(final_text)} chars, confidence: {final_confidence:.2f}")
            return final_text, final_confidence
            
        except Exception as e:
            logger.error(f"OCR extraction failed: {e}")
            return "", 0.0
    
    def _estimate_text_confidence(self, text: str) -> float:
        """Estimate confidence for text without explicit confidence scores"""
        if not text.strip():
            return 0.0
        
        # Check for reasonable character distribution
        alpha_count = sum(c.isalpha() for c in text)
        digit_count = sum(c.isdigit() for c in text)
        space_count = sum(c.isspace() for c in text)
        total_chars = len(text)
        
        if total_chars == 0:
            return 0.0
        
        alpha_ratio = alpha_count / total_chars
        digit_ratio = digit_count / total_chars
        
        confidence = 0.5  # Base confidence
        
        # Good alpha ratio (40-80%)
        if 0.4 <= alpha_ratio <= 0.8:
            confidence += 0.2
        
        # Reasonable digit ratio (< 30%)
        if digit_ratio <= 0.3:
            confidence += 0.1
        
        # Contains medical keywords
        medical_terms = ['patient', 'doctor', 'dr', 'tablet', 'mg', 'daily', 'medicine']
        text_lower = text.lower()
        if any(term in text_lower for term in medical_terms):
            confidence += 0.2
        
        return min(confidence, 1.0)
    
    def _assess_text_quality(self, text: str) -> float:
        """Assess overall text quality"""
        if not text.strip():
            return 0.0
        
        score = 0.5  # Base score
        
        # Check for medical keywords
        medical_keywords = [
            'patient', 'doctor', 'dr', 'prescription', 'medicine', 'tablet',
            'mg', 'ml', 'daily', 'twice', 'morning', 'evening', 'tab', 'cap'
        ]
        
        text_lower = text.lower()
        keyword_matches = sum(1 for keyword in medical_keywords if keyword in text_lower)
        score += min(keyword_matches / 5.0, 0.3)
        
        # Check for structure (lines, punctuation)
        if '\n' in text or ':' in text or '.' in text:
            score += 0.2
        
        return min(score, 1.0)
    
    def extract_patient_info(self, text: str) -> Dict[str, str]:
        """Extract patient information with improved patterns"""
        patient_info = {"name": "", "age": "", "gender": ""}
        
        text_clean = re.sub(r'\s+', ' ', text)
        lines = text.split('\n')
        
        # Extract patient name
        for pattern in self.patterns['patient_name']:
            match = re.search(pattern, text_clean, re.IGNORECASE | re.MULTILINE)
            if match and not patient_info["name"]:
                name = match.group(1).strip()
                # Validate name
                if (len(name) >= 3 and len(name) <= 40 and 
                    not re.search(r'\d', name) and
                    len(name.split()) <= 4):
                    patient_info["name"] = name.title()
                    break
        
        # Extract age
        for pattern in self.patterns['patient_age']:
            match = re.search(pattern, text_clean, re.IGNORECASE)
            if match and not patient_info["age"]:
                age = match.group(1)
                if age.isdigit() and 1 <= int(age) <= 120:
                    patient_info["age"] = age
                    break
        
        # Extract gender
        for pattern in self.patterns['patient_gender']:
            match = re.search(pattern, text_clean, re.IGNORECASE)
            if match and not patient_info["gender"]:
                for group in match.groups():
                    if group:
                        gender_lower = group.lower()
                        if gender_lower in ['m', 'male']:
                            patient_info["gender"] = "Male"
                            break
                        elif gender_lower in ['f', 'female']:
                            patient_info["gender"] = "Female"
                            break
                if patient_info["gender"]:
                    break
        
        return patient_info
    
    def extract_doctor_info(self, text: str) -> Dict[str, str]:
        """Extract doctor information"""
        doctor_info = {"name": "", "specialization": "", "registration_number": ""}
        
        text_clean = re.sub(r'\s+', ' ', text)
        
        # Extract doctor name
        for pattern in self.patterns['doctor_name']:
            match = re.search(pattern, text_clean, re.IGNORECASE)
            if match and not doctor_info["name"]:
                name = match.group(1).strip()
                if len(name) >= 3 and len(name) <= 50:
                    doctor_info["name"] = name.title()
                    break
        
        return doctor_info
    
    def extract_medicines_enhanced(self, text: str) -> List[Dict[str, Any]]:
        """Enhanced medicine extraction with multiple strategies"""
        medicines = []
        
        # Strategy 1: Direct database matching
        medicines.extend(self._extract_medicines_database_match(text))
        
        # Strategy 2: Pattern-based extraction
        medicines.extend(self._extract_medicines_patterns(text))
        
        # Strategy 3: Line-by-line analysis
        medicines.extend(self._extract_medicines_line_analysis(text))
        
        # Deduplicate and enhance
        unique_medicines = self._deduplicate_medicines(medicines)
        enhanced_medicines = self._enhance_with_database(unique_medicines)
        
        # Sort by confidence and return top results
        enhanced_medicines.sort(key=lambda x: x.get('confidence', 0), reverse=True)
        return enhanced_medicines[:8]  # Limit to 8 medicines
    
    def _extract_medicines_database_match(self, text: str) -> List[Dict[str, Any]]:
        """Extract medicines by matching against database"""
        medicines = []
        text_lower = text.lower()
        
        for med_name, med_info in self.medicine_database.items():
            if med_name in text_lower:
                context_line = self._find_medicine_context(med_name, text)
                
                medicine = {
                    "name": med_name.title(),
                    "generic": med_info.get("generic", ""),
                    "category": med_info.get("category", "unknown"),
                    "available": med_info.get("available", True),
                    "dosage": self._extract_dosage(context_line),
                    "frequency": self._extract_frequency(context_line),
                    "duration": self._extract_duration(context_line),
                    "instructions": context_line[:100],
                    "confidence": 0.85,
                    "extraction_method": "database_match"
                }
                medicines.append(medicine)
        
        return medicines
    
    def _extract_medicines_patterns(self, text: str) -> List[Dict[str, Any]]:
        """Extract medicines using patterns"""
        medicines = []
        lines = text.split('\n')
        
        for line in lines:
            line = line.strip()
            if len(line) < 3:
                continue
            
            for pattern in self.patterns['medicines']:
                match = re.search(pattern, line, re.IGNORECASE)
                if match:
                    med_name = match.group(1).strip()
                    med_name = re.sub(r'[^\w\s]', '', med_name)
                    
                    if len(med_name) >= 3 and not med_name.isdigit():
                        medicine = {
                            "name": med_name.title(),
                            "generic": "",
                            "category": "unknown", 
                            "available": True,
                            "dosage": self._extract_dosage(line),
                            "frequency": self._extract_frequency(line),
                            "duration": self._extract_duration(line),
                            "instructions": line[:100],
                            "confidence": 0.7,
                            "extraction_method": "pattern"
                        }
                        medicines.append(medicine)
                        break
        
        return medicines
    
    def _extract_medicines_line_analysis(self, text: str) -> List[Dict[str, Any]]:
        """Extract medicines by analyzing each line for medicine-like content"""
        medicines = []
        lines = text.split('\n')
        
        for line in lines:
            line = line.strip()
            if len(line) < 5:
                continue
            
            # Skip obvious non-medicine lines
            if any(skip in line.lower() for skip in ['patient', 'doctor', 'dr.', 'hospital', 'clinic']):
                continue
            
            # Look for medicine indicators
            indicators = [
                r'\d+\s*mg\b',
                r'\d+\s*ml\b',
                r'\btab\b|\btablet\b',
                r'\bcap\b|\bcapsule\b',
                r'\bsyp\b|\bsyrup\b',
                r'\bonce\b|\btwice\b|\bdaily\b',
                r'\bb\.?d\.?\b|\bo\.?d\.?\b'
            ]
            
            indicator_count = sum(1 for pattern in indicators if re.search(pattern, line, re.IGNORECASE))
            
            if indicator_count >= 1:
                # Extract potential medicine name (first 1-3 words)
                words = re.findall(r'\b[A-Za-z]+\b', line)
                if words:
                    med_name = ' '.join(words[:2])  # Take first 2 words
                    if len(med_name) >= 3:
                        medicine = {
                            "name": med_name.title(),
                            "generic": "",
                            "category": "unknown",
                            "available": True,
                            "dosage": self._extract_dosage(line),
                            "frequency": self._extract_frequency(line),
                            "duration": self._extract_duration(line),
                            "instructions": line[:100],
                            "confidence": 0.5 + (indicator_count * 0.1),
                            "extraction_method": "line_analysis"
                        }
                        medicines.append(medicine)
        
        return medicines
    
    def _find_medicine_context(self, medicine_name: str, text: str) -> str:
        """Find the line containing medicine for context"""
        lines = text.split('\n')
        for line in lines:
            if medicine_name.lower() in line.lower():
                return line.strip()
        return ""
    
    def _extract_dosage(self, text: str) -> str:
        """Extract dosage information"""
        patterns = [
            r'(\d+\.?\d*)\s*(mg|ml|gm|g|mcg)\b',
            r'(\d+)\s*x\s*(\d+)',
            r'(\d+)/(\d+)'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                if 'x' in pattern:
                    return f"{match.group(1)}x{match.group(2)}"
                elif '/' in pattern:
                    return f"{match.group(1)}/{match.group(2)}"
                else:
                    return f"{match.group(1)}{match.group(2)}"
        
        return "As prescribed"
    
    def _extract_frequency(self, text: str) -> str:
        """Extract frequency information"""
        frequency_map = {
            r'\bonce\s*daily\b': "Once daily",
            r'\btwice\s*daily\b': "Twice daily", 
            r'\bthrice\s*daily\b': "Three times daily",
            r'\bod\b': "Once daily",
            r'\bb\.?d\.?\b': "Twice daily",
            r'\bt\.?i\.?d\.?\b': "Three times daily",
            r'\bq\.?i\.?d\.?\b': "Four times daily",
            r'\bevery\s*(\d+)\s*hours?\b': "Every {} hours",
            r'(\d+)\s*times?\s*daily?\b': "{} times daily"
        }
        
        text_lower = text.lower()
        for pattern, freq in frequency_map.items():
            match = re.search(pattern, text_lower)
            if match:
                if '{}' in freq:
                    return freq.format(match.group(1))
                return freq
        
        return "As directed"
    
    def _extract_duration(self, text: str) -> str:
        """Extract duration information"""
        duration_patterns = [
            (r'(\d+)\s*days?\b', "{} days"),
            (r'(\d+)\s*weeks?\b', "{} weeks"),
            (r'(\d+)\s*months?\b', "{} months"),
            (r'\bcourse\b', "Complete course")
        ]
        
        for pattern, format_str in duration_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                if '{}' in format_str:
                    return format_str.format(match.group(1))
                return format_str
        
        return "As prescribed"
    
    def _deduplicate_medicines(self, medicines: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Remove duplicate medicines"""
        if not medicines:
            return []
        
        unique_medicines = []
        seen_names = set()
        
        for med in medicines:
            name_lower = med["name"].lower()
            
            # Check for exact duplicates
            if name_lower in seen_names:
                continue
            
            # Check for similar names using fuzzy matching
            is_duplicate = False
            if HAS_FUZZYWUZZY:
                for seen_name in seen_names:
                    if fuzz.ratio(name_lower, seen_name) > 85:
                        is_duplicate = True
                        break
            
            if not is_duplicate:
                unique_medicines.append(med)
                seen_names.add(name_lower)
        
        return unique_medicines
    
    def _enhance_with_database(self, medicines: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Enhance medicines with database information"""
        for medicine in medicines:
            med_name = medicine["name"].lower()
            
            # Try exact match first
            if med_name in self.medicine_database:
                db_info = self.medicine_database[med_name]
                medicine["generic"] = db_info.get("generic", "")
                medicine["category"] = db_info.get("category", "unknown")
                medicine["available"] = db_info.get("available", True)
                medicine["confidence"] = min(medicine["confidence"] + 0.15, 1.0)
            
            # Try fuzzy matching
            elif HAS_FUZZYWUZZY:
                best_match = process.extractOne(
                    med_name, 
                    self.medicine_database.keys(),
                    score_cutoff=80
                )
                if best_match:
                    db_info = self.medicine_database[best_match[0]]
                    medicine["generic"] = db_info.get("generic", "")
                    medicine["category"] = db_info.get("category", "unknown")
                    medicine["available"] = db_info.get("available", True)
                    medicine["confidence"] = min(medicine["confidence"] + 0.1, 1.0)
                    medicine["database_match"] = best_match[0]
                    medicine["match_score"] = best_match[1]
        
        return medicines
    
    def prescription_analyzer(self, image_path: str) -> AnalysisResult:
        """Main analysis method with comprehensive error handling"""
        result = AnalysisResult()
        
        try:
            logger.info(f"Starting prescription analysis for: {image_path}")
            
            # Validate input
            if not os.path.exists(image_path):
                result.error = f"Image file not found: {image_path}"
                return result
            
            # Extract text
            extracted_text, ocr_confidence = self.extract_text_ocr(image_path)
            
            if not extracted_text.strip():
                result.error = "No readable text found. Please ensure image is clear and contains readable text."
                return result
            
            result.raw_text = extracted_text
            logger.info(f"Extracted {len(extracted_text)} characters")
            
            # Extract structured information
            result.patient = self.extract_patient_info(extracted_text)
            result.doctor = self.extract_doctor_info(extracted_text)
            
            # Extract medicines
            result.medicines = self.extract_medicines_enhanced(extracted_text)
            
            # Extract diagnosis
            result.diagnosis = self._extract_diagnosis_simple(extracted_text)
            
            # Calculate confidence
            result.confidence_score = self._calculate_overall_confidence(
                result, ocr_confidence
            )
            
            result.success = True
            
            logger.info(f"Analysis completed successfully:")
            logger.info(f"  Patient: {result.patient.get('name', 'Not found')}")
            logger.info(f"  Doctor: {result.doctor.get('name', 'Not found')}")
            logger.info(f"  Medicines: {len(result.medicines)}")
            logger.info(f"  Confidence: {result.confidence_score:.2f}")
            
            return result
            
        except Exception as e:
            logger.error(f"Analysis failed: {str(e)}")
            result.error = f"Analysis failed: {str(e)}"
            result.success = False
            return result
    
    def _extract_diagnosis_simple(self, text: str) -> List[str]:
        """Simple diagnosis extraction"""
        diagnosis = []
        text_lower = text.lower()
        
        # Common conditions
        conditions = [
            "fever", "cold", "cough", "headache", "pain", "infection",
            "hypertension", "diabetes", "asthma", "allergies", "gastritis",
            "arthritis", "back pain", "neck pain", "migraine"
        ]
        
        for condition in conditions:
            if condition in text_lower:
                diagnosis.append(condition.title())
        
        return diagnosis[:3]
    
    def _calculate_overall_confidence(self, result: AnalysisResult, ocr_confidence: float) -> float:
        """Calculate overall confidence score"""
        scores = [ocr_confidence * 0.3]  # OCR confidence
        
        # Patient info score
        patient_score = 0
        if result.patient.get('name'):
            patient_score += 0.4
        if result.patient.get('age'):
            patient_score += 0.3
        if result.patient.get('gender'):
            patient_score += 0.3
        scores.append(patient_score * 0.2)
        
        # Doctor info score
        doctor_score = 0
        if result.doctor.get('name'):
            doctor_score += 0.6
        if result.doctor.get('specialization'):
            doctor_score += 0.4
        scores.append(doctor_score * 0.15)
        
        # Medicine score (most important)
        if result.medicines:
            med_confidences = [med.get('confidence', 0.5) for med in result.medicines]
            avg_med_confidence = np.mean(med_confidences)
            medicine_count_factor = min(len(result.medicines) / 3.0, 1.0)
            medicine_score = avg_med_confidence * 0.8 + medicine_count_factor * 0.2
            scores.append(medicine_score * 0.35)
        else:
            scores.append(0.1)
        
        final_confidence = np.mean(scores)
        
        # Minimum confidence boost if we found something useful
        if result.patient.get('name') or result.doctor.get('name') or result.medicines:
            final_confidence = max(final_confidence, 0.4)
        
        return min(final_confidence, 1.0)
    
    def to_json(self, result: AnalysisResult) -> Dict[str, Any]:
        """Convert result to JSON format for API response"""
        return {
            "success": result.success,
            "prescription_id": result.prescription_id,
            "patient": result.patient,
            "doctor": result.doctor,
            "medicines": result.medicines,
            "diagnosis": result.diagnosis,
            "confidence_score": result.confidence_score,
            "message": "Analysis completed successfully" if result.success else result.error,
            "error": result.error if not result.success else "",
            
            # Legacy fields for compatibility
            "patient_name": result.patient.get("name", ""),
            "patient_age": int(result.patient.get("age", 0)) if result.patient.get("age", "").isdigit() else 0,
            "patient_gender": result.patient.get("gender", ""),
            "doctor_name": result.doctor.get("name", ""),
            "doctor_license": result.doctor.get("registration_number", ""),
            
            "raw_text": result.raw_text[:500] + "..." if len(result.raw_text) > 500 else result.raw_text
        }