"""
Enhanced Prescription Analyzer
Advanced OCR and NLP-based prescription analysis system
"""

import cv2
import numpy as np
import re
import json
import uuid
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple, Optional, Any
from dataclasses import dataclass, asdict
import logging

# OCR imports
try:
    import easyocr
    HAS_EASYOCR = True
except ImportError:
    HAS_EASYOCR = False

try:
    import pytesseract
    HAS_TESSERACT = True
except ImportError:
    HAS_TESSERACT = False

# NLP imports
try:
    import spacy
    HAS_SPACY = True
except ImportError:
    HAS_SPACY = False

try:
    from fuzzywuzzy import fuzz, process
    HAS_FUZZYWUZZY = True
except ImportError:
    HAS_FUZZYWUZZY = False

# Cohere API for advanced NLP
try:
    import cohere
    HAS_COHERE = True
except ImportError:
    HAS_COHERE = False

# Image processing
from PIL import Image
import pandas as pd

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class PrescriptionResult:
    """Data structure for prescription analysis results"""
    success: bool = False
    prescription_id: str = ""
    patient: Dict[str, str] = None
    doctor: Dict[str, str] = None
    medicines: List[Dict[str, Any]] = None
    diagnosis: List[str] = None
    confidence_score: float = 0.0
    extracted_text: str = ""
    error: str = ""
    timestamp: str = ""
    
    def __post_init__(self):
        if self.patient is None:
            self.patient = {}
        if self.doctor is None:
            self.doctor = {}
        if self.medicines is None:
            self.medicines = []
        if self.diagnosis is None:
            self.diagnosis = []
        if not self.timestamp:
            self.timestamp = datetime.now().isoformat()
        if not self.prescription_id:
            self.prescription_id = f"RX-{uuid.uuid4().hex[:8].upper()}"

class EnhancedPrescriptionAnalyzer:
    """Enhanced prescription analyzer with multiple OCR engines and NLP"""
    
    def __init__(self, cohere_api_key: str = None, tesseract_path: str = None, force_api: bool = False):
        self.cohere_api_key = cohere_api_key
        self.tesseract_path = tesseract_path
        self.force_api = force_api
        
        # Initialize components
        self._init_ocr_engines()
        self._init_nlp_components()
        self._init_medicine_database()
        self._init_patterns()
        
        logger.info(f"Initialized Enhanced Prescription Analyzer")
        logger.info(f"Available OCR engines: {self._get_available_ocr_engines()}")
        logger.info(f"NLP capabilities: {self._get_nlp_capabilities()}")
    
    def _init_ocr_engines(self):
        """Initialize OCR engines"""
        self.ocr_engines = {}
        
        # EasyOCR
        if HAS_EASYOCR:
            try:
                self.ocr_engines['easyocr'] = easyocr.Reader(['en'])
                logger.info("EasyOCR initialized successfully")
            except Exception as e:
                logger.warning(f"Failed to initialize EasyOCR: {e}")
        
        # Tesseract
        if HAS_TESSERACT:
            try:
                if self.tesseract_path:
                    pytesseract.pytesseract.tesseract_cmd = self.tesseract_path
                
                # Test Tesseract
                test_image = np.ones((100, 100, 3), dtype=np.uint8) * 255
                pytesseract.image_to_string(test_image)
                self.ocr_engines['tesseract'] = True
                logger.info("Tesseract OCR initialized successfully")
            except Exception as e:
                logger.warning(f"Failed to initialize Tesseract: {e}")
    
    def _init_nlp_components(self):
        """Initialize NLP components"""
        self.nlp_models = {}
        
        # Cohere API
        if HAS_COHERE and self.cohere_api_key:
            try:
                self.co = cohere.Client(self.cohere_api_key)
                # Test the API
                test_response = self.co.generate(
                    model='command-light',
                    prompt="Test",
                    max_tokens=1
                )
                self.nlp_models['cohere'] = True
                logger.info("Cohere API initialized successfully")
            except Exception as e:
                logger.warning(f"Failed to initialize Cohere API: {e}")
                self.co = None
        else:
            self.co = None
        
        # spaCy
        if HAS_SPACY:
            try:
                # Try to load English model
                self.nlp_models['spacy'] = spacy.load("en_core_web_sm")
                logger.info("spaCy model loaded successfully")
            except OSError:
                logger.warning("spaCy English model not found. Install with: python -m spacy download en_core_web_sm")
                self.nlp_models['spacy'] = None
            except Exception as e:
                logger.warning(f"Failed to initialize spaCy: {e}")
                self.nlp_models['spacy'] = None
    
    def _init_medicine_database(self):
        """Initialize medicine database"""
        # Comprehensive medicine database
        self.medicine_database = {
            # Antibiotics
            "amoxicillin": {"generic": "amoxicillin", "category": "antibiotic", "available": True},
            "azithromycin": {"generic": "azithromycin", "category": "antibiotic", "available": True},
            "ciprofloxacin": {"generic": "ciprofloxacin", "category": "antibiotic", "available": True},
            "doxycycline": {"generic": "doxycycline", "category": "antibiotic", "available": True},
            "cephalexin": {"generic": "cephalexin", "category": "antibiotic", "available": True},
            
            # Pain relievers
            "ibuprofen": {"generic": "ibuprofen", "category": "pain_reliever", "available": True},
            "acetaminophen": {"generic": "acetaminophen", "category": "pain_reliever", "available": True},
            "paracetamol": {"generic": "acetaminophen", "category": "pain_reliever", "available": True},
            "aspirin": {"generic": "aspirin", "category": "pain_reliever", "available": True},
            "naproxen": {"generic": "naproxen", "category": "pain_reliever", "available": True},
            
            # Diabetes medications
            "metformin": {"generic": "metformin", "category": "antidiabetic", "available": True},
            "insulin": {"generic": "insulin", "category": "antidiabetic", "available": True},
            "glipizide": {"generic": "glipizide", "category": "antidiabetic", "available": True},
            
            # Blood pressure medications
            "lisinopril": {"generic": "lisinopril", "category": "ace_inhibitor", "available": True},
            "amlodipine": {"generic": "amlodipine", "category": "calcium_channel_blocker", "available": True},
            "losartan": {"generic": "losartan", "category": "arb", "available": True},
            "atenolol": {"generic": "atenolol", "category": "beta_blocker", "available": True},
            
            # Stomach medications
            "omeprazole": {"generic": "omeprazole", "category": "ppi", "available": True},
            "ranitidine": {"generic": "ranitidine", "category": "h2_blocker", "available": False},
            "pantoprazole": {"generic": "pantoprazole", "category": "ppi", "available": True},
            
            # Vitamins and supplements
            "vitamin d": {"generic": "cholecalciferol", "category": "vitamin", "available": True},
            "vitamin b12": {"generic": "cyanocobalamin", "category": "vitamin", "available": True},
            "folic acid": {"generic": "folic acid", "category": "vitamin", "available": True},
            "iron": {"generic": "ferrous sulfate", "category": "mineral", "available": True},
            "calcium": {"generic": "calcium carbonate", "category": "mineral", "available": True},
            
            # Common Indian medicines
            "crocin": {"generic": "acetaminophen", "category": "pain_reliever", "available": True},
            "dolo": {"generic": "acetaminophen", "category": "pain_reliever", "available": True},
            "combiflam": {"generic": "ibuprofen + acetaminophen", "category": "pain_reliever", "available": True},
            "calpol": {"generic": "acetaminophen", "category": "pain_reliever", "available": True},
            "disprin": {"generic": "aspirin", "category": "pain_reliever", "available": True},
        }
    
    def _init_patterns(self):
        """Initialize regex patterns for text extraction"""
        self.patterns = {
            'patient_name': [
                r'(?:patient|name|pt\.?)\s*:?\s*([A-Za-z\s]{2,30})',
                r'(?:mr\.?|mrs\.?|ms\.?|dr\.?)\s+([A-Za-z\s]{2,30})',
                r'^([A-Za-z\s]{2,30})\s*(?:\n|$)',
            ],
            'patient_age': [
                r'(?:age|yrs?|years?)\s*:?\s*(\d{1,3})',
                r'(\d{1,3})\s*(?:yrs?|years?|y\.?o\.?)',
                r'age\s*(\d{1,3})',
            ],
            'patient_gender': [
                r'(?:sex|gender)\s*:?\s*(male|female|m|f)',
                r'\b(male|female|m|f)\b',
            ],
            'doctor_name': [
                r'(?:dr\.?|doctor)\s+([A-Za-z\s\.]{2,30})',
                r'signature\s*:?\s*([A-Za-z\s\.]{2,30})',
            ],
            'medicine_pattern': [
                r'(?:tab\.?|cap\.?|syp\.?|inj\.?)\s*([A-Za-z\s\d]{2,30})',
                r'(\d+)\s*(?:mg|ml|gm)\s+([A-Za-z\s]{2,30})',
                r'^([A-Za-z\s]{2,30})\s+\d+(?:mg|ml|gm)',
            ],
            'dosage_pattern': [
                r'(\d+)\s*(?:mg|ml|gm|mcg)',
                r'(\d+)\s*x\s*(\d+)',
                r'(\d+)(?:-\d+)?(?:-\d+)?\s*(?:daily|bid|tid|qid)',
            ],
            'frequency_pattern': [
                r'(\d+)\s*times?\s*(?:a\s*)?day',
                r'(once|twice|thrice)\s*(?:a\s*)?day',
                r'(bid|tid|qid|od)',
                r'every\s*(\d+)\s*hours?',
            ]
        }
    
    def _get_available_ocr_engines(self) -> List[str]:
        """Get list of available OCR engines"""
        return list(self.ocr_engines.keys())
    
    def _get_nlp_capabilities(self) -> Dict[str, bool]:
        """Get available NLP capabilities"""
        return {
            'cohere_api': self.co is not None,
            'spacy': 'spacy' in self.nlp_models and self.nlp_models['spacy'] is not None,
            'fuzzy_matching': HAS_FUZZYWUZZY
        }
    
    def preprocess_image(self, image_path: str) -> np.ndarray:
        """Preprocess image for better OCR results"""
        try:
            # Read image
            image = cv2.imread(image_path)
            if image is None:
                raise ValueError("Could not read image file")
            
            # Convert to grayscale
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # Apply noise reduction
            denoised = cv2.medianBlur(gray, 3)
            
            # Apply adaptive thresholding
            thresh = cv2.adaptiveThreshold(
                denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                cv2.THRESH_BINARY, 11, 2
            )
            
            # Morphological operations to clean up
            kernel = np.ones((1, 1), np.uint8)
            cleaned = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
            
            # Resize if image is too small
            height, width = cleaned.shape
            if width < 800:
                scale_factor = 800 / width
                new_width = int(width * scale_factor)
                new_height = int(height * scale_factor)
                cleaned = cv2.resize(cleaned, (new_width, new_height), interpolation=cv2.INTER_CUBIC)
            
            return cleaned
            
        except Exception as e:
            logger.error(f"Error preprocessing image: {e}")
            # Return original image if preprocessing fails
            return cv2.imread(image_path)
    
    def extract_text_ocr(self, image_path: str) -> Tuple[str, float]:
        """Extract text using available OCR engines"""
        try:
            preprocessed_image = self.preprocess_image(image_path)
            extracted_texts = []
            confidences = []
            
            # Try EasyOCR first (generally more accurate)
            if 'easyocr' in self.ocr_engines:
                try:
                    results = self.ocr_engines['easyocr'].readtext(preprocessed_image)
                    easyocr_text = " ".join([result[1] for result in results if result[2] > 0.3])
                    easyocr_confidence = np.mean([result[2] for result in results if result[2] > 0.3]) if results else 0
                    
                    if easyocr_text.strip():
                        extracted_texts.append(easyocr_text)
                        confidences.append(easyocr_confidence)
                        logger.info(f"EasyOCR extracted {len(easyocr_text)} characters")
                
                except Exception as e:
                    logger.warning(f"EasyOCR failed: {e}")
            
            # Try Tesseract as fallback or additional source
            if 'tesseract' in self.ocr_engines:
                try:
                    tesseract_text = pytesseract.image_to_string(preprocessed_image, lang='eng')
                    tesseract_confidence = 0.7  # Tesseract doesn't provide confidence easily
                    
                    if tesseract_text.strip():
                        extracted_texts.append(tesseract_text)
                        confidences.append(tesseract_confidence)
                        logger.info(f"Tesseract extracted {len(tesseract_text)} characters")
                
                except Exception as e:
                    logger.warning(f"Tesseract failed: {e}")
            
            if not extracted_texts:
                return "", 0.0
            
            # Choose the best text based on length and confidence
            best_idx = 0
            if len(extracted_texts) > 1:
                scores = []
                for i, (text, conf) in enumerate(zip(extracted_texts, confidences)):
                    # Score based on confidence and text length
                    score = conf * 0.7 + min(len(text) / 1000, 1.0) * 0.3
                    scores.append(score)
                best_idx = np.argmax(scores)
            
            return extracted_texts[best_idx], confidences[best_idx]
            
        except Exception as e:
            logger.error(f"OCR extraction failed: {e}")
            return "", 0.0
    
    def extract_patient_info(self, text: str) -> Dict[str, str]:
        """Extract patient information from text"""
        patient_info = {"name": "", "age": "", "gender": ""}
        
        # Clean text for better pattern matching
        cleaned_text = re.sub(r'\s+', ' ', text.strip())
        lines = cleaned_text.split('\n')
        
        # Extract patient name
        for pattern in self.patterns['patient_name']:
            match = re.search(pattern, cleaned_text, re.IGNORECASE | re.MULTILINE)
            if match and not patient_info["name"]:
                name = match.group(1).strip()
                if len(name) > 2 and not re.search(r'\d', name):  # Avoid numbers in names
                    patient_info["name"] = name.title()
                    break
        
        # Extract age
        for pattern in self.patterns['patient_age']:
            match = re.search(pattern, cleaned_text, re.IGNORECASE)
            if match and not patient_info["age"]:
                age = match.group(1)
                if 1 <= int(age) <= 120:  # Reasonable age range
                    patient_info["age"] = age
                    break
        
        # Extract gender
        for pattern in self.patterns['patient_gender']:
            match = re.search(pattern, cleaned_text, re.IGNORECASE)
            if match and not patient_info["gender"]:
                gender = match.group(1).lower()
                if gender in ['m', 'male']:
                    patient_info["gender"] = "Male"
                elif gender in ['f', 'female']:
                    patient_info["gender"] = "Female"
                break
        
        return patient_info
    
    def extract_doctor_info(self, text: str) -> Dict[str, str]:
        """Extract doctor information from text"""
        doctor_info = {"name": "", "specialization": "", "registration_number": ""}
        
        cleaned_text = re.sub(r'\s+', ' ', text.strip())
        
        # Extract doctor name
        for pattern in self.patterns['doctor_name']:
            match = re.search(pattern, cleaned_text, re.IGNORECASE)
            if match and not doctor_info["name"]:
                name = match.group(1).strip()
                if len(name) > 2:
                    doctor_info["name"] = name.title()
                    break
        
        # Extract registration number
        reg_patterns = [
            r'(?:reg\.?|registration)\s*(?:no\.?|number)\s*:?\s*([A-Z0-9]{4,20})',
            r'(?:license|lic)\s*(?:no\.?|number)\s*:?\s*([A-Z0-9]{4,20})',
            r'\b([A-Z]{2,4}\d{4,10})\b'
        ]
        
        for pattern in reg_patterns:
            match = re.search(pattern, cleaned_text, re.IGNORECASE)
            if match and not doctor_info["registration_number"]:
                doctor_info["registration_number"] = match.group(1)
                break
        
        return doctor_info
    
    def extract_medicines_basic(self, text: str) -> List[Dict[str, Any]]:
        """Extract medicines using pattern matching"""
        medicines = []
        lines = text.split('\n')
        
        for line in lines:
            line = line.strip()
            if not line or len(line) < 3:
                continue
            
            # Look for medicine patterns
            medicine_found = False
            
            # Check against known medicines
            if HAS_FUZZYWUZZY:
                for med_name in self.medicine_database.keys():
                    ratio = fuzz.partial_ratio(med_name.lower(), line.lower())
                    if ratio > 70:  # Good match threshold
                        med_info = self.medicine_database[med_name].copy()
                        
                        medicine = {
                            "name": med_name.title(),
                            "generic": med_info.get("generic", ""),
                            "category": med_info.get("category", ""),
                            "available": med_info.get("available", True),
                            "dosage": self._extract_dosage(line),
                            "frequency": self._extract_frequency(line),
                            "duration": self._extract_duration(line),
                            "instructions": line,
                            "confidence": ratio / 100.0
                        }
                        
                        # Avoid duplicates
                        if not any(m["name"].lower() == medicine["name"].lower() for m in medicines):
                            medicines.append(medicine)
                            medicine_found = True
                            break
            
            # Fallback pattern matching
            if not medicine_found:
                for pattern in self.patterns['medicine_pattern']:
                    match = re.search(pattern, line, re.IGNORECASE)
                    if match:
                        med_name = match.group(1).strip()
                        if len(med_name) > 2:
                            medicine = {
                                "name": med_name.title(),
                                "generic": "",
                                "category": "unknown",
                                "available": True,
                                "dosage": self._extract_dosage(line),
                                "frequency": self._extract_frequency(line),
                                "duration": self._extract_duration(line),
                                "instructions": line,
                                "confidence": 0.6
                            }
                            
                            if not any(m["name"].lower() == medicine["name"].lower() for m in medicines):
                                medicines.append(medicine)
                                break
        
        return medicines
    
    def _extract_dosage(self, text: str) -> str:
        """Extract dosage from text"""
        for pattern in self.patterns['dosage_pattern']:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                if len(match.groups()) == 1:
                    return f"{match.group(1)}mg"
                else:
                    return f"{match.group(1)}x{match.group(2)}"
        return "As prescribed"
    
    def _extract_frequency(self, text: str) -> str:
        """Extract frequency from text"""
        frequency_map = {
            "once": "Once daily",
            "twice": "Twice daily", 
            "thrice": "Three times daily",
            "bid": "Twice daily",
            "tid": "Three times daily",
            "qid": "Four times daily",
            "od": "Once daily"
        }
        
        for pattern in self.patterns['frequency_pattern']:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                freq = match.group(1).lower()
                if freq in frequency_map:
                    return frequency_map[freq]
                elif freq.isdigit():
                    return f"{freq} times daily"
        
        return "As directed"
    
    def _extract_duration(self, text: str) -> str:
        """Extract duration from text"""
        duration_patterns = [
            r'for\s+(\d+)\s+days?',
            r'(\d+)\s+days?',
            r'for\s+(\d+)\s+weeks?',
            r'(\d+)\s+weeks?'
        ]
        
        for pattern in duration_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                duration = match.group(1)
                if 'week' in text.lower():
                    return f"{duration} weeks"
                else:
                    return f"{duration} days"
        
        return "As prescribed"
    
    def extract_medicines_ai(self, text: str) -> List[Dict[str, Any]]:
        """Extract medicines using AI/NLP"""
        if not self.co:
            return self.extract_medicines_basic(text)
        
        try:
            prompt = f"""
            Analyze this prescription text and extract medicine information in JSON format.
            For each medicine, provide: name, dosage, frequency, duration, and instructions.
            
            Text: {text}
            
            Return only valid JSON array of medicine objects.
            """
            
            response = self.co.generate(
                model='command-light',
                prompt=prompt,
                max_tokens=500,
                temperature=0.3
            )
            
            result_text = response.generations[0].text.strip()
            
            # Try to parse JSON response
            try:
                import json
                medicines_data = json.loads(result_text)
                
                medicines = []
                for med in medicines_data:
                    if isinstance(med, dict) and 'name' in med:
                        # Enhance with database info
                        med_name = med['name'].lower()
                        med_info = {}
                        
                        if HAS_FUZZYWUZZY:
                            best_match = process.extractOne(med_name, self.medicine_database.keys())
                            if best_match and best_match[1] > 70:
                                med_info = self.medicine_database[best_match[0]]
                        
                        medicine = {
                            "name": med.get('name', '').title(),
                            "generic": med_info.get('generic', ''),
                            "category": med_info.get('category', 'unknown'),
                            "available": med_info.get('available', True),
                            "dosage": med.get('dosage', 'As prescribed'),
                            "frequency": med.get('frequency', 'As directed'),
                            "duration": med.get('duration', 'As prescribed'),
                            "instructions": med.get('instructions', ''),
                            "confidence": 0.8
                        }
                        medicines.append(medicine)
                
                return medicines
                
            except json.JSONDecodeError:
                logger.warning("Failed to parse AI response as JSON, falling back to basic extraction")
                return self.extract_medicines_basic(text)
            
        except Exception as e:
            logger.warning(f"AI medicine extraction failed: {e}")
            return self.extract_medicines_basic(text)
    
    def extract_diagnosis(self, text: str) -> List[str]:
        """Extract diagnosis/conditions from text"""
        diagnosis = []
        
        # Common medical condition patterns
        condition_patterns = [
            r'(?:diagnosis|condition|disease)\s*:?\s*([A-Za-z\s]{3,50})',
            r'(?:suffering from|diagnosed with)\s*([A-Za-z\s]{3,50})',
            r'(?:for|treatment of)\s*([A-Za-z\s]{3,50})'
        ]
        
        for pattern in condition_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                condition = match.strip().title()
                if len(condition) > 3 and condition not in diagnosis:
                    diagnosis.append(condition)
        
        # Common conditions to look for
        common_conditions = [
            'hypertension', 'diabetes', 'fever', 'cold', 'cough', 
            'headache', 'back pain', 'arthritis', 'infection',
            'allergies', 'asthma', 'depression', 'anxiety'
        ]
        
        text_lower = text.lower()
        for condition in common_conditions:
            if condition in text_lower and condition.title() not in diagnosis:
                diagnosis.append(condition.title())
        
        return diagnosis[:5]  # Limit to 5 most relevant
    
    def calculate_confidence(self, result: PrescriptionResult) -> float:
        """Calculate overall confidence score"""
        scores = []
        
        # OCR quality (based on text length and character variety)
        text = result.extracted_text
        if text:
            char_variety = len(set(text.lower())) / len(text) if text else 0
            text_score = min(len(text) / 500, 1.0) * 0.5 + char_variety * 0.5
            scores.append(text_score)
        
        # Patient info completeness
        patient = result.patient
        patient_score = (
            (0.4 if patient.get('name') else 0) +
            (0.3 if patient.get('age') else 0) +
            (0.3 if patient.get('gender') else 0)
        )
        scores.append(patient_score)
        
        # Medicine extraction quality
        medicines = result.medicines
        if medicines:
            med_score = min(len(medicines) / 5, 1.0) * 0.6
            # Add confidence from individual medicines
            if hasattr(medicines[0], 'confidence'):
                avg_med_confidence = np.mean([m.get('confidence', 0.5) for m in medicines])
                med_score += avg_med_confidence * 0.4
            scores.append(med_score)
        
        return np.mean(scores) if scores else 0.1
    
    def analyze_prescription(self, image_path: str) -> PrescriptionResult:
        """Main analysis function"""
        result = PrescriptionResult()
        
        try:
            logger.info(f"Starting prescription analysis for: {image_path}")
            
            # Extract text using OCR
            extracted_text, ocr_confidence = self.extract_text_ocr(image_path)
            
            if not extracted_text.strip():
                result.error = "No readable text found in the image"
                return result
            
            result.extracted_text = extracted_text
            logger.info(f"Extracted {len(extracted_text)} characters with {ocr_confidence:.2f} confidence")
            
            # Extract structured information
            result.patient = self.extract_patient_info(extracted_text)
            result.doctor = self.extract_doctor_info(extracted_text)
            
            # Extract medicines (use AI if available, otherwise patterns)
            if self.force_api or (self.co and len(extracted_text) > 100):
                result.medicines = self.extract_medicines_ai(extracted_text)
            else:
                result.medicines = self.extract_medicines_basic(extracted_text)
            
            result.diagnosis = self.extract_diagnosis(extracted_text)
            
            # Calculate confidence
            result.confidence_score = self.calculate_confidence(result)
            
            result.success = True
            
            logger.info(f"Analysis completed successfully. Found {len(result.medicines)} medicines")
            
            return result
            
        except Exception as e:
            logger.error(f"Analysis failed: {str(e)}")
            result.error = str(e)
            return result
    
    def to_json(self, result: PrescriptionResult) -> Dict[str, Any]:
        """Convert result to JSON-serializable format"""
        return {
            "success": result.success,
            "prescription_id": result.prescription_id,
            "patient": result.patient,
            "doctor": result.doctor,
            "medicines": result.medicines,
            "diagnosis": result.diagnosis,
            "confidence_score": result.confidence_score,
            "extracted_text": result.extracted_text,
            "error": result.error,
            "timestamp": result.timestamp,
            # Legacy fields for compatibility
            "patient_name": result.patient.get("name", ""),
            "patient_age": int(result.patient.get("age", 0)) if result.patient.get("age", "").isdigit() else 0,
            "patient_gender": result.patient.get("gender", ""),
            "doctor_name": result.doctor.get("name", ""),
            "doctor_license": result.doctor.get("registration_number", ""),
            "message": "Analysis completed successfully" if result.success else result.error
        }

# Example usage and testing
if __name__ == "__main__":
    # Test the analyzer
    analyzer = EnhancedPrescriptionAnalyzer()
    
    print("Enhanced Prescription Analyzer Test")
    print("==================================")
    print(f"Available OCR engines: {analyzer._get_available_ocr_engines()}")
    print(f"NLP capabilities: {analyzer._get_nlp_capabilities()}")
    print(f"Medicine database size: {len(analyzer.medicine_database)}")
    
    # Test text extraction patterns
    sample_text = """
    Patient Name: John Doe
    Age: 45 years
    Gender: Male
    
    Dr. Smith
    Registration No: MED123456
    
    Medications:
    1. Paracetamol 500mg - twice daily for 5 days
    2. Amoxicillin 250mg - three times daily for 7 days
    3. Omeprazole 20mg - once daily before meals
    
    Diagnosis: Fever and throat infection
    """
    
    print("\nTesting pattern extraction:")
    result = PrescriptionResult()
    result.extracted_text = sample_text
    
    patient = analyzer.extract_patient_info(sample_text)
    doctor = analyzer.extract_doctor_info(sample_text)
    medicines = analyzer.extract_medicines_basic(sample_text)
    diagnosis = analyzer.extract_diagnosis(sample_text)
    
    print(f"Patient: {patient}")
    print(f"Doctor: {doctor}")
    print(f"Medicines: {len(medicines)} found")
    print(f"Diagnosis: {diagnosis}")
    
    print("\nAnalyzer ready for use!")