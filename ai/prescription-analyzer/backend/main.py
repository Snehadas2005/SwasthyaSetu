"""
Fixed FastAPI Main Server - Addresses integration issues
"""

import os
import tempfile
import logging
import traceback
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Any

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

# Import the fixed analyzer
from backend.prescription_analyzer import EnhancedPrescriptionAnalyzer

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('api.log')
    ]
)
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI(
    title="MediCheck AI - Fixed Version",
    description="Fixed prescription analysis with enhanced reliability",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global analyzer instance
analyzer: Optional[EnhancedPrescriptionAnalyzer] = None

# Pydantic models
class AnalysisResponse(BaseModel):
    """Standardized response model"""
    success: bool = Field(default=False)
    prescription_id: Optional[str] = Field(default=None)
    message: Optional[str] = Field(default="")
    confidence_score: float = Field(default=0.0)
    error: Optional[str] = Field(default=None)
    patient: Dict[str, Any] = Field(default_factory=dict)
    doctor: Dict[str, Any] = Field(default_factory=dict)
    medicines: List[Dict[str, Any]] = Field(default_factory=list)
    diagnosis: List[str] = Field(default_factory=list)
    
    # Legacy fields for compatibility
    patient_name: str = Field(default="")
    patient_age: int = Field(default=0)
    patient_gender: str = Field(default="")
    doctor_name: str = Field(default="")
    doctor_license: str = Field(default="")

class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    timestamp: str
    analyzer_ready: bool
    ocr_engines: List[str] = Field(default_factory=list)
    nlp_capabilities: Dict[str, bool] = Field(default_factory=dict)
    medicine_database_size: int = 0

# Storage (use database in production)
prescriptions_storage: Dict[str, Any] = {}

def safe_response_data(data: Dict[str, Any]) -> Dict[str, Any]:
    """Ensure response data is safe for Pydantic validation"""
    safe_data = {
        "success": bool(data.get("success", False)),
        "prescription_id": data.get("prescription_id"),
        "message": str(data.get("message", "")),
        "confidence_score": float(data.get("confidence_score", 0.0)),
        "error": data.get("error"),
        "patient": data.get("patient", {}),
        "doctor": data.get("doctor", {}),
        "medicines": data.get("medicines", []),
        "diagnosis": data.get("diagnosis", []),
        "patient_name": str(data.get("patient_name", "")),
        "patient_gender": str(data.get("patient_gender", "")),
        "doctor_name": str(data.get("doctor_name", "")),
        "doctor_license": str(data.get("doctor_license", ""))
    }
    
    # Handle patient_age safely
    try:
        safe_data["patient_age"] = int(data.get("patient_age", 0))
    except (ValueError, TypeError):
        safe_data["patient_age"] = 0
    
    return safe_data

@app.on_event("startup")
async def startup_event():
    """Initialize analyzer with comprehensive error handling"""
    global analyzer
    
    try:
        logger.info("Initializing Enhanced Prescription Analyzer...")
        
        # Get API key from environment or config
        cohere_api_key = os.getenv('COHERE_API_KEY')
        if not cohere_api_key:
            logger.warning("COHERE_API_KEY not found in environment variables")
        
        tesseract_path = os.getenv('TESSERACT_PATH')
        
        # Initialize analyzer
        analyzer = EnhancedPrescriptionAnalyzer(
            cohere_api_key=cohere_api_key,
            tesseract_path=tesseract_path,
            force_api=False  # Don't force API - allow fallbacks
        )
        
        logger.info("✅ Enhanced Prescription Analyzer initialized successfully")
        logger.info(f"📊 Available OCR engines: {analyzer._get_available_ocr_engines()}")
        logger.info(f"🧠 NLP capabilities: {analyzer._get_nlp_capabilities()}")
        logger.info(f"💊 Medicine database: {len(analyzer.medicine_database)} entries")
        
        # Test the analyzer with a minimal operation
        logger.info("🔍 Testing analyzer components...")
        test_text = "Patient: John Doe Age: 30 Dr. Smith Paracetamol 500mg"
        test_patient = analyzer.extract_patient_info(test_text)
        test_medicines = analyzer.extract_medicines_enhanced(test_text)
        
        logger.info(f"✅ Test results - Patient: {test_patient}, Medicines: {len(test_medicines)}")
        
    except Exception as e:
        logger.error(f"❌ Failed to initialize analyzer: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise RuntimeError(f"Analyzer initialization failed: {str(e)}")

@app.get("/", include_in_schema=False)
async def root():
    """Root endpoint"""
    return {
        "message": "MediCheck AI - Fixed Version",
        "status": "running",
        "version": "2.0.0",
        "timestamp": datetime.now().isoformat(),
        "analyzer_ready": analyzer is not None
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Enhanced health check"""
    if not analyzer:
        return HealthResponse(
            status="unhealthy",
            timestamp=datetime.now().isoformat(),
            analyzer_ready=False
        )
    
    return HealthResponse(
        status="healthy",
        timestamp=datetime.now().isoformat(),
        analyzer_ready=True,
        ocr_engines=analyzer._get_available_ocr_engines(),
        nlp_capabilities=analyzer._get_nlp_capabilities(),
        medicine_database_size=len(analyzer.medicine_database)
    )

@app.post("/api/analyze-prescription", response_model=AnalysisResponse)
async def prescription_analyzer(file: UploadFile = File(...)):
    """
    Enhanced prescription analysis with comprehensive error handling
    """
    # Check analyzer
    if not analyzer:
        raise HTTPException(
            status_code=503,
            detail="Analyzer not initialized. Please check server logs."
        )
    
    # Validate file
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Please upload an image file."
        )
    
    temp_file_path = None
    
    try:
        # Create temporary file
        file_extension = Path(file.filename or "image.jpg").suffix or ".jpg"
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp_file:
            temp_file_path = temp_file.name
            
            # Read and validate file content
            content = await file.read()
            file_size = len(content)
            
            logger.info(f"Processing file: {file.filename}, Size: {file_size} bytes")
            
            # Check file size (max 20MB)
            if file_size > 20 * 1024 * 1024:
                raise HTTPException(
                    status_code=413,
                    detail="File too large. Maximum size is 20MB."
                )
            
            if file_size < 1024:  # Less than 1KB
                raise HTTPException(
                    status_code=400,
                    detail="File too small. Please ensure the image is readable."
                )
            
            # Write file
            temp_file.write(content)
            temp_file.flush()
            
            logger.info(f"File saved to temporary location: {temp_file_path}")
        
        # Analyze prescription
        logger.info("Starting prescription analysis...")
        result = analyzer.prescription_analyzer(temp_file_path)
        
        if not result.success:
            logger.warning(f"Analysis failed: {result.error}")
            error_response_data = safe_response_data({
                'success': False,
                'error': result.error,
                'message': 'Analysis failed. Please try with a clearer image.',
                'prescription_id': result.prescription_id
            })
            return AnalysisResponse(**error_response_data)
        
        # Store successful result
        prescriptions_storage[result.prescription_id] = result
        
        # Convert to JSON format
        json_result = analyzer.to_json(result)
        
        # Log success metrics
        logger.info(f"✅ Analysis completed successfully:")
        logger.info(f"   📋 Prescription ID: {result.prescription_id}")
        logger.info(f"   👤 Patient: {result.patient.get('name', 'Not found')}")
        logger.info(f"   👨‍⚕️ Doctor: {result.doctor.get('name', 'Not found')}")
        logger.info(f"   💊 Medicines found: {len(result.medicines)}")
        logger.info(f"   📊 Confidence: {result.confidence_score:.2f}")
        
        # Log medicine details for debugging
        for i, med in enumerate(result.medicines[:3]):
            logger.info(f"   💊 Medicine {i+1}: {med.get('name', 'Unknown')} "
                       f"(confidence: {med.get('confidence', 0):.2f}, "
                       f"method: {med.get('extraction_method', 'unknown')})")
        
        # Prepare safe response data
        safe_data = safe_response_data(json_result)
        
        # Apply confidence adjustments
        original_confidence = safe_data.get('confidence_score', 0)
        
        # Boost confidence if we found meaningful data
        if (safe_data.get('medicines') or 
            safe_data.get('patient', {}).get('name') or 
            safe_data.get('doctor', {}).get('name')):
            boosted_confidence = min(original_confidence + 0.1, 1.0)
            safe_data['confidence_score'] = boosted_confidence
            logger.info(f"   📈 Confidence boosted: {original_confidence:.2f} → {boosted_confidence:.2f}")
        
        return AnalysisResponse(**safe_data)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Unexpected error during analysis: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        
        error_response_data = safe_response_data({
            'success': False,
            'error': f"Analysis failed: {str(e)}",
            'message': 'An unexpected error occurred. Please try again with a different image.',
            'confidence_score': 0.0
        })
        return AnalysisResponse(**error_response_data)
        
    finally:
        # Clean up temporary file
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.unlink(temp_file_path)
                logger.debug(f"🗑️ Cleaned up temporary file: {temp_file_path}")
            except Exception as e:
                logger.warning(f"⚠️ Failed to clean up temp file: {e}")

@app.get("/api/prescription/{prescription_id}")
async def get_prescription(prescription_id: str):
    """Get prescription by ID"""
    if prescription_id not in prescriptions_storage:
        raise HTTPException(status_code=404, detail="Prescription not found")
    
    result = prescriptions_storage[prescription_id]
    return {
        "success": True,
        "prescription": analyzer.to_json(result)
    }

@app.get("/api/stats")
async def get_stats():
    """Get API statistics"""
    if not analyzer:
        return {
            "status": "error",
            "message": "Analyzer not initialized",
            "analyzer_ready": False
        }
    
    return {
        "status": "success",
        "analyzer_ready": True,
        "ocr_engines": analyzer._get_available_ocr_engines(),
        "nlp_capabilities": analyzer._get_nlp_capabilities(),
        "medicine_database_size": len(analyzer.medicine_database),
        "disease_database_size": len(analyzer.disease_symptoms_database),
        "total_prescriptions_analyzed": len(prescriptions_storage),
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/test")
async def test_endpoint():
    """Test endpoint to verify API functionality"""
    return {
        "success": True,
        "message": "MediCheck AI Fixed Version is working properly",
        "analyzer_status": "ready" if analyzer else "not_initialized",
        "timestamp": datetime.now().isoformat(),
        "version": "2.0.0"
    }

# Global exception handlers
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Handle unexpected exceptions"""
    logger.error(f"❌ Unhandled exception in {request.url.path}: {str(exc)}")
    logger.error(f"Traceback: {traceback.format_exc()}")
    
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal server error",
            "message": "An unexpected error occurred. Please try again later.",
            "timestamp": datetime.now().isoformat()
        }
    )

@app.exception_handler(ValueError)
async def value_error_handler(request, exc):
    """Handle value errors gracefully"""
    logger.warning(f"⚠️ Value error in {request.url.path}: {str(exc)}")
    
    return JSONResponse(
        status_code=400,
        content={
            "success": False,
            "error": "Invalid input",
            "message": str(exc),
            "timestamp": datetime.now().isoformat()
        }
    )

if __name__ == "__main__":
    import uvicorn
    
    # Configuration
    HOST = os.getenv('HOST', '127.0.0.1')
    PORT = int(os.getenv('PORT', 8000))
    RELOAD = os.getenv('RELOAD', 'false').lower() == 'true'
    
    logger.info(f"🚀 Starting MediCheck AI Fixed Version")
    logger.info(f"🌐 Server: http://{HOST}:{PORT}")
    logger.info(f"🔄 Reload mode: {RELOAD}")
    logger.info(f"📚 Documentation: http://{HOST}:{PORT}/docs")
    
    uvicorn.run(
        "main:app",
        host=HOST,
        port=PORT,
        reload=RELOAD,
        log_level="info"
    )