#!/usr/bin/env python3
"""
Enhanced Training Script for Handwritten Prescription Analyzer
Optimized for the prescription images you provided
"""

import os
import json
import logging
from typing import List, Dict, Any
from datetime import datetime

# Make sure to import your enhanced analyzer
try:
    from prescription_analyzer import EnhancedPrescriptionAnalyzer
except ImportError as e:
    print(f"Error importing EnhancedPrescriptionAnalyzer: {e}")
    print("Make sure prescription_analyzer.py is in the same directory")
    exit(1)

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class EnhancedPrescriptionTrainer:
    def __init__(self, analyzer: EnhancedPrescriptionAnalyzer):
        self.analyzer = analyzer
        
    def get_sample_image_paths(self) -> List[str]:
        """
        Get paths to sample prescription images
        """
        # Define possible locations for sample images
        possible_dirs = [
            "sample_prescriptions",
            "samples", 
            "test_images",
            "prescriptions",
            "."  # Current directory
        ]
        
        image_extensions = ['.jpg', '.jpeg', '.png', '.tiff', '.bmp', '.webp']
        image_paths = []
        
        for directory in possible_dirs:
            if not os.path.exists(directory):
                continue
                
            for filename in os.listdir(directory):
                if any(filename.lower().endswith(ext) for ext in image_extensions):
                    # Prioritize files with prescription-related names
                    if any(keyword in filename.lower() for keyword in 
                          ['prescription', 'rx', 'medical', 'doctor', 'clinic']):
                        image_paths.insert(0, os.path.join(directory, filename))
                    else:
                        image_paths.append(os.path.join(directory, filename))
        
        # Remove duplicates while preserving order
        unique_paths = []
        for path in image_paths:
            if path not in unique_paths:
                unique_paths.append(path)
        
        logger.info(f"Found {len(unique_paths)} prescription images")
        for i, path in enumerate(unique_paths, 1):
            logger.info(f"  {i}. {path}")
            
        return unique_paths
        
    def analyze_sample_images(self, image_paths: List[str]) -> List[Dict[str, Any]]:
        """
        Analyze sample prescription images with enhanced reporting
        """
        results = []
        
        if not image_paths:
            logger.warning("No image paths provided for analysis")
            return results
        
        for i, image_path in enumerate(image_paths):
            logger.info(f"\n{'='*60}")
            logger.info(f"ANALYZING PRESCRIPTION {i+1}/{len(image_paths)}: {os.path.basename(image_path)}")
            logger.info(f"{'='*60}")
            
            if not os.path.exists(image_path):
                logger.warning(f"❌ Image not found: {image_path}")
                continue
                
            try:
                # Get file size for analysis
                file_size = os.path.getsize(image_path)
                logger.info(f"📁 File size: {file_size / 1024:.1f} KB")
                
                # Analyze the prescription
                result = self.analyzer.prescription_analyzer(image_path)
                
                # Create detailed analysis result
                analysis_result = {
                    "image_path": image_path,
                    "file_name": os.path.basename(image_path),
                    "file_size_kb": file_size / 1024,
                    "success": result.success,
                    "prescription_id": result.prescription_id,
                    "confidence_score": result.confidence_score,
                    "extracted_text_length": len(result.extracted_text),
                    "extracted_text_preview": result.extracted_text[:200] + "..." if len(result.extracted_text) > 200 else result.extracted_text,
                    
                    # Patient information
                    "patient_info": {
                        "name": result.patient.get('name', ''),
                        "age": result.patient.get('age', ''),
                        "gender": result.patient.get('gender', ''),
                        "completeness_score": self._calculate_patient_completeness(result.patient)
                    },
                    
                    # Doctor information  
                    "doctor_info": {
                        "name": result.doctor.get('name', ''),
                        "specialization": result.doctor.get('specialization', ''),
                        "registration_number": result.doctor.get('registration_number', ''),
                        "completeness_score": self._calculate_doctor_completeness(result.doctor)
                    },
                    
                    # Medicine information
                    "medicines": [
                        {
                            "name": med.get('name', ''),
                            "generic": med.get('generic', ''),
                            "category": med.get('category', 'unknown'),
                            "dosage": med.get('dosage', 'As prescribed'),
                            "frequency": med.get('frequency', 'As directed'),
                            "duration": med.get('duration', 'As prescribed'),
                            "confidence": med.get('confidence', 0.0),
                            "extraction_method": med.get('extraction_method', 'unknown'),
                            "database_match": med.get('database_match', ''),
                            "available": med.get('available', True)
                        } for med in result.medicines
                    ],
                    "medicine_count": len(result.medicines),
                    "avg_medicine_confidence": sum(med.get('confidence', 0) for med in result.medicines) / max(len(result.medicines), 1),
                    
                    # Diagnosis
                    "diagnosis": result.diagnosis,
                    "diagnosis_count": len(result.diagnosis),
                    
                    # Quality metrics
                    "quality_metrics": {
                        "text_extraction_quality": self._assess_text_extraction_quality(result.extracted_text),
                        "medicine_extraction_quality": self._assess_medicine_quality(result.medicines),
                        "overall_quality": self._calculate_overall_quality(result),
                    },
                    
                    # Error information
                    "error": result.error if not result.success else None,
                    "analysis_timestamp": datetime.now().isoformat()
                }
                
                results.append(analysis_result)
                
                # Log detailed findings
                self._log_analysis_details(analysis_result, result)
                
            except Exception as e:
                logger.error(f"❌ Error analyzing {image_path}: {e}")
                results.append({
                    "image_path": image_path,
                    "file_name": os.path.basename(image_path),
                    "success": False,
                    "error": str(e),
                    "analysis_timestamp": datetime.now().isoformat()
                })
        
        return results
    
    def _calculate_patient_completeness(self, patient_info: Dict) -> float:
        """Calculate completeness score for patient information"""
        score = 0.0
        if patient_info.get('name') and len(patient_info['name']) > 2:
            score += 0.5
        if patient_info.get('age') and patient_info['age'].isdigit():
            score += 0.3
        if patient_info.get('gender'):
            score += 0.2
        return score
    
    def _calculate_doctor_completeness(self, doctor_info: Dict) -> float:
        """Calculate completeness score for doctor information"""
        score = 0.0
        if doctor_info.get('name') and len(doctor_info['name']) > 2:
            score += 0.5
        if doctor_info.get('specialization'):
            score += 0.3
        if doctor_info.get('registration_number'):
            score += 0.2
        return score
    
    def _assess_text_extraction_quality(self, text: str) -> float:
        """Assess the quality of extracted text"""
        if not text:
            return 0.0
        
        score = 0.0
        
        # Length assessment
        if len(text) > 100:
            score += 0.3
        elif len(text) > 50:
            score += 0.2
        elif len(text) > 20:
            score += 0.1
        
        # Medical keywords
        medical_keywords = ['patient', 'doctor', 'dr', 'prescription', 'medicine', 'tablet', 'mg', 'daily']
        keyword_count = sum(1 for keyword in medical_keywords if keyword.lower() in text.lower())
        score += min(keyword_count / len(medical_keywords), 0.4)
        
        # Character diversity
        if text:
            unique_chars = len(set(text.lower()))
            char_diversity = unique_chars / len(text)
            score += min(char_diversity * 0.3, 0.3)
        
        return min(score, 1.0)
    
    def _assess_medicine_quality(self, medicines: List[Dict]) -> float:
        """Assess the quality of medicine extraction"""
        if not medicines:
            return 0.0
        
        total_score = 0.0
        for med in medicines:
            med_score = 0.0
            
            # Name quality
            if med.get('name') and len(med['name']) > 2:
                med_score += 0.3
            
            # Database match
            if med.get('database_match') or med.get('generic'):
                med_score += 0.2
            
            # Detailed information
            if med.get('dosage', 'As prescribed') != 'As prescribed':
                med_score += 0.2
            if med.get('frequency', 'As directed') != 'As directed':
                med_score += 0.2
            if med.get('duration', 'As prescribed') != 'As prescribed':
                med_score += 0.1
            
            total_score += med_score
        
        return min(total_score / len(medicines), 1.0)
    
    def _calculate_overall_quality(self, result) -> float:
        """Calculate overall analysis quality"""
        components = []
        
        # Text quality (25%)
        text_quality = self._assess_text_extraction_quality(result.extracted_text)
        components.append(text_quality * 0.25)
        
        # Patient info (20%)
        patient_quality = self._calculate_patient_completeness(result.patient)
        components.append(patient_quality * 0.20)
        
        # Doctor info (15%)  
        doctor_quality = self._calculate_doctor_completeness(result.doctor)
        components.append(doctor_quality * 0.15)
        
        # Medicine extraction (40%)
        medicine_quality = self._assess_medicine_quality(result.medicines)
        components.append(medicine_quality * 0.40)
        
        return sum(components)
    
    def _log_analysis_details(self, analysis_result: Dict, result) -> None:
        """Log detailed analysis results"""
        
        # Patient Information
        patient = analysis_result['patient_info']
        if patient['name']:
            logger.info(f"👤 Patient: {patient['name']}")
            if patient['age']:
                logger.info(f"   Age: {patient['age']}")
            if patient['gender']:
                logger.info(f"   Gender: {patient['gender']}")
        else:
            logger.info(f"👤 Patient: Not detected")
        
        # Doctor Information
        doctor = analysis_result['doctor_info']
        if doctor['name']:
            logger.info(f"👨‍⚕️ Doctor: {doctor['name']}")
            if doctor['specialization']:
                logger.info(f"   Specialization: {doctor['specialization']}")
            if doctor['registration_number']:
                logger.info(f"   Registration: {doctor['registration_number']}")
        else:
            logger.info(f"👨‍⚕️ Doctor: Not detected")
        
        # Medicine Information
        medicines = analysis_result['medicines']
        logger.info(f"💊 Medicines Found: {len(medicines)}")
        for i, med in enumerate(medicines[:5], 1):  # Show first 5
            confidence_indicator = "🟢" if med['confidence'] > 0.7 else "🟡" if med['confidence'] > 0.4 else "🔴"
            logger.info(f"   {i}. {confidence_indicator} {med['name']} ({med['confidence']:.2f})")
            if med['dosage'] != 'As prescribed':
                logger.info(f"      Dosage: {med['dosage']}")
            if med['frequency'] != 'As directed':
                logger.info(f"      Frequency: {med['frequency']}")
            if med['database_match']:
                logger.info(f"      🔗 Database match: {med['database_match']}")
        
        if len(medicines) > 5:
            logger.info(f"   ... and {len(medicines) - 5} more medicines")
        
        # Quality Metrics
        metrics = analysis_result['quality_metrics']
        logger.info(f"📊 Quality Scores:")
        logger.info(f"   Text Extraction: {metrics['text_extraction_quality']:.2f}")
        logger.info(f"   Medicine Quality: {metrics['medicine_extraction_quality']:.2f}")
        logger.info(f"   Overall Quality: {metrics['overall_quality']:.2f}")
        logger.info(f"🎯 Final Confidence: {analysis_result['confidence_score']:.2f}")
        
        # Diagnosis
        if analysis_result['diagnosis']:
            logger.info(f"🩺 Diagnosis: {', '.join(analysis_result['diagnosis'])}")

    def generate_comprehensive_report(self, results: List[Dict]) -> Dict:
        """
        Generate comprehensive training report with actionable insights
        """
        if not os.path.exists("outputs"):
            os.makedirs("outputs")
        
        successful_results = [r for r in results if r.get("success", False)]
        
        # Calculate aggregate statistics
        total_medicines = sum(r.get("medicine_count", 0) for r in successful_results)
        avg_confidence = sum(r.get("confidence_score", 0) for r in successful_results) / max(len(successful_results), 1)
        avg_medicine_confidence = sum(r.get("avg_medicine_confidence", 0) for r in successful_results) / max(len(successful_results), 1)
        
        # Analyze patient detection
        patients_detected = sum(1 for r in successful_results if r.get("patient_info", {}).get("name"))
        patient_completeness = sum(r.get("patient_info", {}).get("completeness_score", 0) for r in successful_results) / max(len(successful_results), 1)
        
        # Analyze doctor detection
        doctors_detected = sum(1 for r in successful_results if r.get("doctor_info", {}).get("name"))
        doctor_completeness = sum(r.get("doctor_info", {}).get("completeness_score", 0) for r in successful_results) / max(len(successful_results), 1)
        
        # Quality analysis
        avg_overall_quality = sum(r.get("quality_metrics", {}).get("overall_quality", 0) for r in successful_results) / max(len(successful_results), 1)
        avg_text_quality = sum(r.get("quality_metrics", {}).get("text_extraction_quality", 0) for r in successful_results) / max(len(successful_results), 1)
        
        report = {
            "timestamp": datetime.now().isoformat(),
            "analyzer_version": "Enhanced Prescription Analyzer v2.0",
            "database_info": {
                "medicine_database_size": len(self.analyzer.medicine_database),
                "disease_database_size": len(self.analyzer.disease_symptoms_database),
                "database_integration": "active" if len(self.analyzer.medicine_database) > 100 else "fallback"
            },
            "summary": {
                "total_samples": len(results),
                "successful_analyses": len(successful_results),
                "success_rate": len(successful_results) / max(len(results), 1),
                "average_confidence": avg_confidence,
                "average_medicine_confidence": avg_medicine_confidence,
                "total_medicines_detected": total_medicines,
                "average_medicines_per_prescription": total_medicines / max(len(successful_results), 1),
                "patients_detected": patients_detected,
                "patient_detection_rate": patients_detected / max(len(successful_results), 1),
                "doctors_detected": doctors_detected,
                "doctor_detection_rate": doctors_detected / max(len(successful_results), 1),
                "average_overall_quality": avg_overall_quality,
                "average_text_quality": avg_text_quality,
                "patient_completeness": patient_completeness,
                "doctor_completeness": doctor_completeness
            },
            "detailed_results": results,
            "performance_analysis": self._analyze_performance(results),
            "improvement_recommendations": self._generate_improvement_recommendations(results),
            "system_capabilities": self.analyzer._get_nlp_capabilities() if hasattr(self.analyzer, '_get_nlp_capabilities') else {}
        }
        
        # Save comprehensive report
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        output_file = os.path.join("outputs", f"enhanced_training_report_{timestamp}.json")
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, default=str, ensure_ascii=False)
            
        # Also save a human-readable summary
        self._save_human_readable_report(report, timestamp)
        
        logger.info(f"📄 Comprehensive report saved to: {output_file}")
        return report
    
    def _analyze_performance(self, results: List[Dict]) -> Dict:
        """Analyze performance across different metrics"""
        successful_results = [r for r in results if r.get("success", False)]
        
        # Confidence distribution
        confidence_ranges = {
            "high_confidence (>0.7)": sum(1 for r in successful_results if r.get("confidence_score", 0) > 0.7),
            "medium_confidence (0.4-0.7)": sum(1 for r in successful_results if 0.4 <= r.get("confidence_score", 0) <= 0.7),
            "low_confidence (<0.4)": sum(1 for r in successful_results if r.get("confidence_score", 0) < 0.4)
        }
        
        # Medicine extraction methods analysis
        extraction_methods = {}
        for result in successful_results:
            for med in result.get("medicines", []):
                method = med.get("extraction_method", "unknown")
                if method not in extraction_methods:
                    extraction_methods[method] = {"count": 0, "avg_confidence": 0.0, "confidences": []}
                extraction_methods[method]["count"] += 1
                extraction_methods[method]["confidences"].append(med.get("confidence", 0))
        
        # Calculate average confidence per method
        for method in extraction_methods:
            confidences = extraction_methods[method]["confidences"]
            extraction_methods[method]["avg_confidence"] = sum(confidences) / len(confidences) if confidences else 0
            del extraction_methods[method]["confidences"]  # Remove raw data from report
        
        # File size vs performance correlation
        file_size_performance = []
        for result in successful_results:
            if result.get("file_size_kb"):
                file_size_performance.append({
                    "file_size_kb": result["file_size_kb"],
                    "confidence": result.get("confidence_score", 0),
                    "medicine_count": result.get("medicine_count", 0)
                })
        
        return {
            "confidence_distribution": confidence_ranges,
            "extraction_methods_performance": extraction_methods,
            "file_size_performance": file_size_performance,
            "best_performing_image": max(successful_results, key=lambda x: x.get("confidence_score", 0)) if successful_results else None,
            "worst_performing_image": min(successful_results, key=lambda x: x.get("confidence_score", 1)) if successful_results else None
        }
    
    def _generate_improvement_recommendations(self, results: List[Dict]) -> List[str]:
        """Generate specific improvement recommendations based on analysis"""
        recommendations = []
        successful_results = [r for r in results if r.get("success", False)]
        
        if not successful_results:
            recommendations.extend([
                "❌ No successful analyses found. Check image quality and OCR configuration.",
                "🔧 Verify that OCR engines (EasyOCR/Tesseract) are properly installed.",
                "📸 Ensure prescription images are clear, well-lit, and high resolution."
            ])
            return recommendations
        
        success_rate = len(successful_results) / len(results)
        avg_confidence = sum(r.get("confidence_score", 0) for r in successful_results) / len(successful_results)
        
        # Success rate analysis
        if success_rate < 0.5:
            recommendations.append("🚨 LOW SUCCESS RATE: Focus on improving image preprocessing and OCR accuracy")
        elif success_rate < 0.8:
            recommendations.append("⚠️ MODERATE SUCCESS RATE: Consider enhancing OCR configurations")
        
        # Confidence analysis
        if avg_confidence < 0.4:
            recommendations.append("📉 LOW CONFIDENCE SCORES: Improve pattern matching and database integration")
        elif avg_confidence < 0.6:
            recommendations.append("📈 MODERATE CONFIDENCE: Fine-tune extraction algorithms for better accuracy")
        else:
            recommendations.append("✅ GOOD CONFIDENCE LEVELS: Current system performing well")
        
        # Patient detection analysis
        patient_detection_rate = sum(1 for r in successful_results if r.get("patient_info", {}).get("name")) / len(successful_results)
        if patient_detection_rate < 0.3:
            recommendations.append("👤 PATIENT DETECTION: Enhance patient name extraction patterns for handwritten text")
        
        # Doctor detection analysis
        doctor_detection_rate = sum(1 for r in successful_results if r.get("doctor_info", {}).get("name")) / len(successful_results)
        if doctor_detection_rate < 0.5:
            recommendations.append("👨‍⚕️ DOCTOR DETECTION: Improve doctor name and credential recognition")
        
        # Medicine detection analysis
        avg_medicines = sum(r.get("medicine_count", 0) for r in successful_results) / len(successful_results)
        if avg_medicines < 1:
            recommendations.append("💊 MEDICINE DETECTION: Critical - Enhance medicine name extraction for handwritten prescriptions")
        elif avg_medicines < 2:
            recommendations.append("💊 MEDICINE DETECTION: Improve medicine extraction algorithms")
        
        # Database integration analysis
        db_matches = sum(1 for r in successful_results 
                        for med in r.get("medicines", []) 
                        if med.get("database_match"))
        if db_matches == 0:
            recommendations.append("🗄️ DATABASE INTEGRATION: Medicine database not being utilized effectively")
        
        # Text quality analysis
        avg_text_quality = sum(r.get("quality_metrics", {}).get("text_extraction_quality", 0) for r in successful_results) / len(successful_results)
        if avg_text_quality < 0.5:
            recommendations.extend([
                "📝 TEXT QUALITY: Implement better image preprocessing for handwritten text",
                "🔧 Consider training custom OCR models for medical handwriting"
            ])
        
        # Specific technical recommendations
        high_confidence_count = sum(1 for r in successful_results if r.get("confidence_score", 0) > 0.7)
        if high_confidence_count < len(successful_results) * 0.3:
            recommendations.extend([
                "🎯 CONFIDENCE BOOSTING: Implement weighted scoring for different extraction methods",
                "🔍 FUZZY MATCHING: Increase fuzzy matching thresholds for better medicine recognition",
                "📚 EXPAND DATABASE: Add more medicine variations and brand names to database"
            ])
        
        # Performance optimization
        if len(self.analyzer.medicine_database) < 100:
            recommendations.append("📊 DATABASE: Load comprehensive medicine database for better matching")
        
        if not recommendations:
            recommendations.extend([
                "🎉 EXCELLENT PERFORMANCE: System is working well for your prescription types",
                "💡 OPTIMIZATION: Consider fine-tuning confidence thresholds for your specific use case",
                "📈 SCALING: System ready for production deployment"
            ])
        
        return recommendations
    
    def _save_human_readable_report(self, report: Dict, timestamp: str):
        """Save a human-readable summary report"""
        summary_file = os.path.join("outputs", f"analysis_summary_{timestamp}.txt")
        
        with open(summary_file, 'w', encoding='utf-8') as f:
            f.write("="*80 + "\n")
            f.write("ENHANCED PRESCRIPTION ANALYZER TRAINING REPORT\n")
            f.write("="*80 + "\n\n")
            
            # Executive Summary
            f.write("EXECUTIVE SUMMARY\n")
            f.write("-" * 40 + "\n")
            summary = report["summary"]
            f.write(f"📊 Total Samples: {summary['total_samples']}\n")
            f.write(f"✅ Successful Analyses: {summary['successful_analyses']}\n")
            f.write(f"📈 Success Rate: {summary['success_rate']*100:.1f}%\n")
            f.write(f"🎯 Average Confidence: {summary['average_confidence']*100:.1f}%\n")
            f.write(f"💊 Total Medicines Found: {summary['total_medicines_detected']}\n")
            f.write(f"📋 Avg Medicines per Prescription: {summary['average_medicines_per_prescription']:.1f}\n")
            f.write(f"👤 Patient Detection Rate: {summary['patient_detection_rate']*100:.1f}%\n")
            f.write(f"👨‍⚕️ Doctor Detection Rate: {summary['doctor_detection_rate']*100:.1f}%\n\n")
            
            # Database Info
            f.write("DATABASE INTEGRATION\n")
            f.write("-" * 40 + "\n")
            db_info = report["database_info"]
            f.write(f"🗄️ Medicine Database: {db_info['medicine_database_size']} entries\n")
            f.write(f"🩺 Disease Database: {db_info['disease_database_size']} entries\n")
            f.write(f"🔗 Integration Status: {db_info['database_integration']}\n\n")
            
            # Performance Analysis
            if "performance_analysis" in report:
                f.write("PERFORMANCE BREAKDOWN\n")
                f.write("-" * 40 + "\n")
                perf = report["performance_analysis"]
                
                # Confidence distribution
                conf_dist = perf["confidence_distribution"]
                f.write("Confidence Distribution:\n")
                for level, count in conf_dist.items():
                    f.write(f"  {level}: {count}\n")
                f.write("\n")
                
                # Best and worst performing
                if perf.get("best_performing_image"):
                    best = perf["best_performing_image"]
                    f.write(f"🏆 Best Performance: {best['file_name']} (confidence: {best['confidence_score']:.2f})\n")
                
                if perf.get("worst_performing_image"):
                    worst = perf["worst_performing_image"]
                    f.write(f"📉 Needs Improvement: {worst['file_name']} (confidence: {worst['confidence_score']:.2f})\n")
                f.write("\n")
            
            # Recommendations
            f.write("IMPROVEMENT RECOMMENDATIONS\n")
            f.write("-" * 40 + "\n")
            for i, rec in enumerate(report["improvement_recommendations"], 1):
                f.write(f"{i}. {rec}\n")
            f.write("\n")
            
            # Individual Results Summary
            f.write("INDIVIDUAL RESULTS SUMMARY\n")
            f.write("-" * 40 + "\n")
            for result in report["detailed_results"]:
                if result.get("success"):
                    f.write(f"📁 {result['file_name']}\n")
                    f.write(f"   Confidence: {result['confidence_score']:.2f}\n")
                    f.write(f"   Medicines: {result['medicine_count']}\n")
                    patient = result['patient_info']['name']
                    doctor = result['doctor_info']['name']
                    f.write(f"   Patient: {patient if patient else 'Not detected'}\n")
                    f.write(f"   Doctor: {doctor if doctor else 'Not detected'}\n")
                else:
                    f.write(f"❌ {result['file_name']}: FAILED\n")
                f.write("\n")
        
        logger.info(f"📋 Human-readable summary saved to: {summary_file}")


def main():
    """
    Main enhanced training and evaluation function
    """
    print("\n" + "="*80)
    print("ENHANCED PRESCRIPTION ANALYZER TRAINING v2.0")
    print("Optimized for handwritten prescriptions with database integration")
    print("="*80)
    
    try:
        # Initialize the enhanced analyzer
        logger.info("Initializing Enhanced Prescription Analyzer with database integration...")
        
        # Allow for API key from environment or disable API usage
        cohere_api_key = os.getenv('COHERE_API_KEY')
        if cohere_api_key:
            logger.info("🔑 Cohere API key found - AI analysis enabled")
        else:
            logger.info("⚠️ No Cohere API key - using pattern-based analysis")
        
        analyzer = EnhancedPrescriptionAnalyzer(
            cohere_api_key=cohere_api_key,
            force_api=False  # Allow fallback methods
        )
        
        trainer = EnhancedPrescriptionTrainer(analyzer)
        
        # Display system capabilities
        capabilities = analyzer._get_nlp_capabilities()
        logger.info("🔧 System Capabilities:")
        logger.info(f"   - Medicine Database: {len(analyzer.medicine_database)} entries")
        logger.info(f"   - Disease Database: {len(analyzer.disease_symptoms_database)} entries")
        logger.info(f"   - OCR Engines: {', '.join(analyzer._get_available_ocr_engines())}")
        logger.info(f"   - Cohere API: {'✓' if capabilities.get('cohere_api') else '✗'}")
        logger.info(f"   - Fuzzy Matching: {'✓' if capabilities.get('fuzzy_matching') else '✗'}")
        
        # Get sample image paths
        logger.info("\n🔍 Looking for prescription images...")
        image_paths = trainer.get_sample_image_paths()
        
        if not image_paths:
            print("\n❌ NO PRESCRIPTION IMAGES FOUND!")
            print("\nTo use this enhanced training script:")
            print("1. Create a folder called 'sample_prescriptions' or 'samples'")
            print("2. Add your prescription images to this folder")
            print("3. Supported formats: .jpg, .jpeg, .png, .tiff, .bmp, .webp")
            print("4. For best results, ensure images are clear and well-lit")
            print("\nAlternatively, place images in the current directory.")
            return
        
        print(f"\n✅ Found {len(image_paths)} prescription images for analysis")
        
        # Analyze all prescription images
        logger.info(f"\n🚀 Starting comprehensive analysis of {len(image_paths)} prescriptions...")
        results = trainer.analyze_sample_images(image_paths)
        
        # Generate comprehensive report
        logger.info("\n📊 Generating comprehensive training report...")
        report = trainer.generate_comprehensive_report(results)
        
        # Display executive summary
        print("\n" + "="*80)
        print("TRAINING RESULTS SUMMARY")
        print("="*80)
        
        summary = report["summary"]
        success_indicator = "🟢" if summary['success_rate'] > 0.7 else "🟡" if summary['success_rate'] > 0.4 else "🔴"
        confidence_indicator = "🟢" if summary['average_confidence'] > 0.7 else "🟡" if summary['average_confidence'] > 0.4 else "🔴"
        
        print(f"{success_indicator} Success Rate: {summary['success_rate']*100:.1f}% ({summary['successful_analyses']}/{summary['total_samples']})")
        print(f"{confidence_indicator} Average Confidence: {summary['average_confidence']*100:.1f}%")
        print(f"💊 Total Medicines Detected: {summary['total_medicines_detected']}")
        print(f"📊 Average Medicines per Prescription: {summary['average_medicines_per_prescription']:.1f}")
        print(f"👤 Patient Detection: {summary['patient_detection_rate']*100:.1f}%")
        print(f"👨‍⚕️ Doctor Detection: {summary['doctor_detection_rate']*100:.1f}%")
        print(f"📈 Overall Quality Score: {summary['average_overall_quality']*100:.1f}%")
        
        # Database integration status
        db_info = report["database_info"]
        db_indicator = "🟢" if db_info["database_integration"] == "active" else "🟡"
        print(f"\n{db_indicator} Database Integration: {db_info['database_integration']}")
        print(f"🗄️ Medicine Database: {db_info['medicine_database_size']} entries")
        print(f"🩺 Disease Database: {db_info['disease_database_size']} entries")
        
        # Top recommendations
        print(f"\n🎯 TOP RECOMMENDATIONS:")
        for i, rec in enumerate(report['improvement_recommendations'][:5], 1):
            print(f"{i}. {rec}")
        
        print(f"\n📄 Detailed reports saved in 'outputs/' directory")
        print("="*80)
        
        # Final assessment
        if summary['success_rate'] > 0.8 and summary['average_confidence'] > 0.7:
            print("🎉 EXCELLENT: System is performing very well!")
        elif summary['success_rate'] > 0.6 and summary['average_confidence'] > 0.5:
            print("👍 GOOD: System shows promising results with room for improvement")
        elif summary['success_rate'] > 0.3:
            print("⚠️ MODERATE: System needs optimization for better performance")
        else:
            print("🚨 NEEDS WORK: System requires significant improvements")
            
    except Exception as e:
        logger.error(f"Training failed: {e}", exc_info=True)
        print(f"\n❌ Training failed: {e}")
        print("Please check your setup and try again.")


if __name__ == "__main__":
    main()