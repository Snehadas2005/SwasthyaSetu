const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  // Unique Identifiers
  appointmentId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // References
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
    index: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
    index: true
  },
  
  // Appointment Details
  appointmentDate: {
    type: Date,
    required: true,
    index: true
  },
  appointmentTime: {
    start: {
      type: String,
      required: true // "14:30"
    },
    end: {
      type: String,
      required: true // "15:00"
    },
    duration: {
      type: Number,
      default: 30 // minutes
    }
  },
  
  // Consultation Information
  consultationType: {
    type: String,
    enum: ['scheduled', 'emergency', 'follow_up', 'second_opinion'],
    default: 'scheduled'
  },
  consultationMode: {
    type: String,
    enum: ['video', 'voice', 'chat'],
    required: true,
    default: 'voice'
  },
  specialty: {
    type: String,
    required: true
  },
  
  // Appointment Status
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show', 'rescheduled'],
    default: 'scheduled',
    index: true
  },
  
  // Patient Information at Booking
  patientInfo: {
    name: String,
    age: Number,
    gender: String,
    phone: String,
    location: {
      district: String,
      state: String
    }
  },
  
  // Symptoms and Reason
  consultationReason: {
    chiefComplaint: {
      type: String,
      required: true
    },
    symptoms: [String],
    duration: String, // "2 days", "1 week"
    severity: {
      type: String,
      enum: ['Mild', 'Moderate', 'Severe'],
      default: 'Mild'
    },
    previousTreatment: String,
    urgencyLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Emergency'],
      default: 'Medium'
    }
  },
  
  // AI Triage Results
  aiTriage: {
    triageScore: {
      type: Number,
      min: 0,
      max: 10
    },
    recommendedSpecialty: String,
    priorityLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical']
    },
    suggestedDuration: Number, // minutes
    aiConfidence: {
      type: Number,
      min: 0,
      max: 1
    },
    triageNotes: String,
    processedAt: Date
  },
  
  // Payment Information
  payment: {
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'INR'
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded', 'waived'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: ['online', 'cash', 'insurance', 'government_scheme', 'free']
    },
    transactionId: String,
    paidAt: Date
  },
  
  // Consultation Session Details
  session: {
    sessionId: String,
    startTime: Date,
    endTime: Date,
    actualDuration: Number, // minutes
    connectionQuality: {
      type: String,
      enum: ['poor', 'fair', 'good', 'excellent']
    },
    technicalIssues: [String],
    sessionNotes: String
  },
  
  // Medical Records from Consultation
  consultation: {
    diagnosis: {
      primary: String,
      secondary: [String],
      icdCodes: [String]
    },
    symptoms: [String],
    examination: {
      findings: String,
      vitalSigns: {
        bloodPressure: String,
        temperature: String,
        heartRate: String,
        respiratoryRate: String
      }
    },
    prescription: [{
      medicineName: String,
      dosage: String,
      frequency: String,
      duration: String,
      instructions: String,
      genericName: String
    }],
    labTests: [{
      testName: String,
      urgency: String,
      instructions: String
    }],
    referrals: [{
      specialistType: String,
      reason: String,
      urgency: String
    }],
    followUp: {
      required: {
        type: Boolean,
        default: false
      },
      recommendedDate: Date,
      instructions: String
    },
    doctorNotes: String,
    patientEducation: String
  },
  
  // Post-Consultation
  feedback: {
    patientRating: {
      type: Number,
      min: 1,
      max: 5
    },
    patientReview: String,
    doctorRating: {
      type: Number,
      min: 1,
      max: 5
    },
    doctorNotes: String,
    technicalRating: {
      type: Number,
      min: 1,
      max: 5
    },
    overallExperience: String
  },
  
  // Scheduling and Management
  scheduling: {
    bookedAt: {
      type: Date,
      default: Date.now
    },
    bookedBy: {
      type: String,
      enum: ['patient', 'doctor', 'admin', 'ai_system'],
      default: 'patient'
    },
    timeZone: {
      type: String,
      default: 'Asia/Kolkata'
    },
    rescheduledFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment'
    },
    rescheduledTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment'
    },
    cancellationReason: String,
    cancellationTime: Date,
    lastModified: {
      type: Date,
      default: Date.now
    }
  },
  
  // Rural Healthcare Specific
  ruralHealthcare: {
    distanceFromPatient: Number, // km
    localHealthWorker: {
      name: String,
      phone: String,
      role: String
    },
    internetConnectivity: {
      type: String,
      enum: ['poor', 'fair', 'good', 'excellent']
    },
    languageUsed: String,
    assistanceRequired: {
      type: Boolean,
      default: false
    },
    assistantDetails: String
  },
  
  // Analytics and Tracking
  analytics: {
    waitTime: Number, // minutes from booking to consultation
    responseTime: Number, // doctor's response time
    patientSatisfaction: Number,
    treatmentEffectiveness: String,
    followUpCompliance: {
      type: Boolean,
      default: null
    }
  },
  
  // System Information
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  // Emergency Flags
  isEmergency: {
    type: Boolean,
    default: false
  },
  priorityScore: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Compound Indexes for efficient queries
appointmentSchema.index({ doctorId: 1, appointmentDate: 1, status: 1 });
appointmentSchema.index({ patientId: 1, appointmentDate: -1 });
appointmentSchema.index({ status: 1, appointmentDate: 1 });
appointmentSchema.index({ 'consultationReason.urgencyLevel': 1, appointmentDate: 1 });
appointmentSchema.index({ specialty: 1, status: 1 });
appointmentSchema.index({ 'patientInfo.location.district': 1, appointmentDate: 1 });

// Pre-save middleware to update timestamps
appointmentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  this.scheduling.lastModified = new Date();
  next();
});

// Virtual for appointment duration in human readable format
appointmentSchema.virtual('formattedDuration').get(function() {
  const duration = this.appointmentTime.duration;
  if (duration >= 60) {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  return `${duration}m`;
});

// Virtual for appointment status description
appointmentSchema.virtual('statusDescription').get(function() {
  const statusMap = {
    'scheduled': 'Appointment Scheduled',
    'confirmed': 'Appointment Confirmed',
    'in_progress': 'Consultation in Progress',
    'completed': 'Consultation Completed',
    'cancelled': 'Appointment Cancelled',
    'no_show': 'Patient No Show',
    'rescheduled': 'Appointment Rescheduled'
  };
  return statusMap[this.status] || this.status;
});

// Method to calculate wait time
appointmentSchema.methods.calculateWaitTime = function() {
  if (this.session.startTime && this.scheduling.bookedAt) {
    const waitTime = Math.floor((this.session.startTime - this.scheduling.bookedAt) / (1000 * 60));
    this.analytics.waitTime = waitTime;
    return waitTime;
  }
  return null;
};

// Method to update appointment status
appointmentSchema.methods.updateStatus = function(newStatus, reason = '') {
  const ol
