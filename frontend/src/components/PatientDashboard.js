import React, { useState, useEffect } from 'react';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie } from 'recharts';
import { User, Calendar, Pill, FileText, Phone, Bell, Heart, Activity, MapPin, Search, Plus, Stethoscope, Home, MessageCircle } from 'lucide-react';

const PatientDashboard = () => {
  const [patientInfo, setPatientInfo] = useState({
    name: "John Doe",
    dob: "1990-05-15",
    gender: "Male",
    bloodGroup: "O+",
    maritalStatus: "Single",
    photo: null,
    mobile: "+91 9876543210",
    email: "john.doe@email.com",
    address: "123 Main Street, Delhi, India",
    emergencyName: "Jane Doe",
    emergencyPhone: "+91 9876543211",
    conditions: "Hypertension",
    allergies: "Pollen",
    medications: "Lisinopril",
    surgeries: "None",
    familyDoctor: "Dr. Smith",
    govId: "AADHAAR123456789",
    insuranceProvider: "Health Plus",
    insuranceNumber: "HP123456789",
    insuranceCard: null,
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [symptoms, setSymptoms] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState('');

  // Load patient info from memory
  useEffect(() => {
    if (window.patientData) {
      setPatientInfo(prev => ({ ...prev, ...window.patientData }));
    }
  }, []);

  // Mock data
  const appointments = [
    { id: 1, doctor: "Dr. Rajesh Singh", specialty: "General Physician", date: "2025-09-10", time: "5:00 PM", status: "Upcoming", type: "Video Call" },
    { id: 2, doctor: "Dr. Priya Sharma", specialty: "Cardiologist", date: "2025-08-25", time: "2:30 PM", status: "Completed", type: "In-person" },
  ];

  const medicines = [
    { name: "Paracetamol 500mg", dosage: "1 tablet twice daily", remaining: 10, refillDate: "2025-09-15", status: "good" },
    { name: "Vitamin D3", dosage: "1 capsule daily", remaining: 5, refillDate: "2025-09-12", status: "medium" },
    { name: "Cough Syrup", dosage: "10ml thrice daily", remaining: 2, refillDate: "2025-09-08", status: "low" },
  ];

  const healthMetrics = [
    { date: 'Jan', bp: 120, weight: 70, sugar: 95 },
    { date: 'Feb', bp: 125, weight: 69, sugar: 98 },
    { date: 'Mar', bp: 118, weight: 71, sugar: 92 },
    { date: 'Apr', bp: 122, weight: 70, sugar: 96 },
  ];

  const symptomData = [
    { symptom: "Fever", frequency: 5, fill: "#FF6B6B" },
    { symptom: "Cough", frequency: 3, fill: "#4ECDC4" },
    { symptom: "Headache", frequency: 4, fill: "#45B7D1" },
    { symptom: "Fatigue", frequency: 2, fill: "#96CEB4" },
  ];

  const handleSymptomCheck = () => {
    if (symptoms.trim()) {
      const analyses = [
        "Based on your symptoms, it appears you might have a common cold. Consider rest and hydration. If symptoms persist for more than 3 days, consult a doctor.",
        "Your symptoms suggest possible seasonal allergies. Avoid known allergens and consider antihistamines. Consult an ENT specialist if symptoms worsen.",
        "These symptoms could indicate viral fever. Monitor your temperature and stay hydrated. Book a consultation if fever exceeds 102°F.",
      ];
      setAiAnalysis(analyses[Math.floor(Math.random() * analyses.length)]);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #f0fdf4 100%)',
      fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: '#1f2937'
    },

    header: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      borderBottom: '4px solid #10b981',
      position: 'sticky',
      top: '0',
      zIndex: '1000'
    },

    headerContent: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },

    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },

    logoIcon: {
      width: '56px',
      height: '56px',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
      transition: 'transform 0.3s ease'
    },

    logoText: {
      fontSize: '32px',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #10b981, #3b82f6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      letterSpacing: '-0.5px'
    },

    logoSubtitle: {
      fontSize: '14px',
      color: '#6b7280',
      fontWeight: '600',
      marginTop: '4px'
    },

    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '24px'
    },

    userInfo: {
      textAlign: 'right'
    },

    userName: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '4px'
    },

    userEmail: {
      fontSize: '14px',
      color: '#6b7280'
    },

    userAvatar: {
      width: '48px',
      height: '48px',
      background: 'linear-gradient(135deg, #3b82f6, #10b981)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
    },

    bellIcon: {
      color: '#6b7280',
      cursor: 'pointer',
      transition: 'color 0.3s ease',
      padding: '8px',
      borderRadius: '8px'
    },

    mainContent: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '32px 20px'
    },

    quickStats: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '24px',
      marginBottom: '32px'
    },

    statCard: {
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      padding: '24px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.5)',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden'
    },

    statCardInner: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    },

    statInfo: {
      flex: '1'
    },

    statHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '12px'
    },

    statTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#6b7280'
    },

    statValue: {
      fontSize: '20px',
      fontWeight: '800',
      color: '#1f2937',
      marginBottom: '8px'
    },

    statButton: {
      padding: '8px 16px',
      fontSize: '12px',
      fontWeight: '600',
      borderRadius: '20px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },

    dashboardCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.5)',
      overflow: 'hidden'
    },

    tabNavigation: {
      borderBottom: '2px solid #f3f4f6',
      background: 'rgba(249, 250, 251, 0.8)'
    },

    tabNav: {
      display: 'flex',
      padding: '0 24px',
      gap: '8px',
      overflowX: 'auto'
    },

    tabButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '16px 20px',
      fontSize: '14px',
      fontWeight: '600',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      borderRadius: '12px 12px 0 0',
      minWidth: 'fit-content',
      whiteSpace: 'nowrap'
    },

    activeTab: {
      color: '#3b82f6',
      background: 'rgba(59, 130, 246, 0.1)',
      borderBottom: '3px solid #3b82f6'
    },

    inactiveTab: {
      color: '#6b7280'
    },

    tabContent: {
      padding: '32px'
    },

    sectionTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },

    sectionIcon: {
      width: '32px',
      height: '32px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },

    overviewGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '32px'
    },

    chartCard: {
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      borderRadius: '20px',
      padding: '32px',
      border: '1px solid rgba(226, 232, 240, 0.8)',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
    },

    chartTitle: {
      fontSize: '18px',
      fontWeight: '700',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#1f2937'
    },

    symptomChecker: {
      background: 'linear-gradient(135deg, #faf5ff 0%, #f0f9ff 100%)',
      borderRadius: '20px',
      padding: '32px',
      border: '1px solid rgba(196, 181, 253, 0.3)'
    },

    symptomInput: {
      display: 'flex',
      gap: '16px',
      marginBottom: '24px',
      flexWrap: 'wrap'
    },

    symptomTextarea: {
      flex: '1',
      minWidth: '300px',
      padding: '16px',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: '16px',
      fontFamily: 'inherit',
      resize: 'vertical',
      minHeight: '60px',
      outline: 'none',
      transition: 'border-color 0.3s ease'
    },

    analyzeButton: {
      padding: '16px 32px',
      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
      minWidth: 'fit-content'
    },

    analysisResult: {
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      borderLeft: '4px solid #3b82f6',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
    },

    analysisTitle: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },

    analysisText: {
      color: '#4b5563',
      lineHeight: '1.6',
      marginBottom: '16px'
    },

    actionButtons: {
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap'
    },

    actionButton: {
      padding: '12px 20px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },

    primaryAction: {
      background: '#10b981',
      color: 'white'
    },

    secondaryAction: {
      background: '#6b7280',
      color: 'white'
    },

    medicineCard: {
      background: 'linear-gradient(135deg, #f0fdf4 0%, #f0f9ff 100%)',
      borderRadius: '16px',
      padding: '24px',
      borderLeft: '4px solid #10b981',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
      transition: 'all 0.3s ease'
    },

    medicineHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      gap: '16px'
    },

    medicineInfo: {
      flex: '1',
      minWidth: '250px'
    },

    medicineName: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '8px'
    },

    medicineDosage: {
      color: '#6b7280',
      marginBottom: '12px',
      fontSize: '14px'
    },

    medicineDetails: {
      display: 'flex',
      gap: '16px',
      flexWrap: 'wrap',
      fontSize: '14px'
    },

    medicineStatus: {
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600'
    },

    statusLow: {
      background: '#fef2f2',
      color: '#dc2626'
    },

    statusMedium: {
      background: '#fefce8',
      color: '#ca8a04'
    },

    statusGood: {
      background: '#f0fdf4',
      color: '#16a34a'
    },

    refillInfo: {
      color: '#6b7280',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },

    refillButton: {
      padding: '12px 24px',
      background: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease'
    },

    appointmentCard: {
      background: 'white',
      border: '2px solid #f3f4f6',
      borderRadius: '16px',
      padding: '24px',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
    },

    appointmentHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      gap: '16px'
    },

    appointmentInfo: {
      flex: '1',
      minWidth: '250px'
    },

    doctorName: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '8px'
    },

    specialty: {
      color: '#6b7280',
      marginBottom: '12px'
    },

    appointmentDetails: {
      display: 'flex',
      gap: '16px',
      fontSize: '14px',
      color: '#6b7280',
      flexWrap: 'wrap'
    },

    appointmentDetail: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },

    statusBadge: {
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600'
    },

    statusUpcoming: {
      background: '#dbeafe',
      color: '#1d4ed8'
    },

    statusCompleted: {
      background: '#dcfce7',
      color: '#16a34a'
    },

    profileGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '32px'
    },

    profileSection: {
      background: '#f9fafb',
      borderRadius: '16px',
      padding: '24px'
    },

    profileSectionTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '16px'
    },

    profileItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '12px',
      fontSize: '14px'
    },

    profileLabel: {
      fontWeight: '600',
      color: '#374151',
      minWidth: '120px'
    },

    profileValue: {
      color: '#1f2937',
      textAlign: 'right',
      wordBreak: 'break-word'
    },

    editButton: {
      padding: '16px 32px',
      background: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <div 
              style={styles.logoIcon}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              <img 
                  src="/logo.png"      // Path to your logo image
                  alt="SwasthyaSetu Logo"
                  style={{ width: '56px', height: '56px', borderRadius: '16px', objectFit: 'cover' }}
              />
            </div>
            <div>
              <div style={styles.logoText}>SwasthyaSetu</div>
              <div style={styles.logoSubtitle}>Patient Dashboard</div>
            </div>
          </div>
          
          <div style={styles.headerRight}>
            <div style={styles.userInfo}>
              <div style={styles.userName}>Welcome, {patientInfo.name}</div>
              <div style={styles.userEmail}>{patientInfo.email}</div>
            </div>
            <div style={styles.userAvatar}>
              <User size={20} color="white" />
            </div>
            <Bell 
              size={24} 
              style={styles.bellIcon}
              onMouseEnter={(e) => {
                e.target.style.color = '#3b82f6';
                e.target.style.background = 'rgba(59, 130, 246, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#6b7280';
                e.target.style.background = 'transparent';
              }}
            />
          </div>
        </div>
      </header>

      <div style={styles.mainContent}>
        {/* Quick Stats */}
        <div style={styles.quickStats}>
          <div 
            style={{...styles.statCard, borderLeft: '4px solid #6366f1'}}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.08)';
            }}
          >
            <div style={styles.statCardInner}>
              <div style={styles.statInfo}>
                <div style={styles.statHeader}>
                  <Calendar size={20} color="#6366f1" />
                  <span style={styles.statTitle}>Next Appointment</span>
                </div>
                <div style={styles.statValue}>Today, 5:00 PM</div>
              </div>
              <button 
                style={{...styles.statButton, background: '#e0e7ff', color: '#6366f1'}}
                onMouseEnter={(e) => {
                  e.target.style.background = '#6366f1';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#e0e7ff';
                  e.target.style.color = '#6366f1';
                }}
              >
                View
              </button>
            </div>
          </div>

          <div 
            style={{...styles.statCard, borderLeft: '4px solid #10b981'}}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.08)';
            }}
          >
            <div style={styles.statCardInner}>
              <div style={styles.statInfo}>
                <div style={styles.statHeader}>
                  <Pill size={20} color="#10b981" />
                  <span style={styles.statTitle}>Active Prescriptions</span>
                </div>
                <div style={styles.statValue}>3 Medicines</div>
              </div>
              <button 
                style={{...styles.statButton, background: '#d1fae5', color: '#10b981'}}
                onMouseEnter={(e) => {
                  e.target.style.background = '#10b981';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#d1fae5';
                  e.target.style.color = '#10b981';
                }}
              >
                Refill
              </button>
            </div>
          </div>

          <div 
            style={{...styles.statCard, borderLeft: '4px solid #ef4444'}}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.08)';
            }}
          >
            <div style={styles.statCardInner}>
              <div style={styles.statInfo}>
                <div style={styles.statHeader}>
                  <FileText size={20} color="#ef4444" />
                  <span style={styles.statTitle}>Reports Available</span>
                </div>
                <div style={styles.statValue}>2 New</div>
              </div>
              <button 
                style={{...styles.statButton, background: '#fee2e2', color: '#ef4444'}}
                onMouseEnter={(e) => {
                  e.target.style.background = '#ef4444';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#fee2e2';
                  e.target.style.color = '#ef4444';
                }}
              >
                Download
              </button>
            </div>
          </div>

          <div 
            style={{...styles.statCard, borderLeft: '4px solid #f59e0b'}}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.08)';
            }}
          >
            <div style={styles.statCardInner}>
              <div style={styles.statInfo}>
                <div style={styles.statHeader}>
                  <Phone size={20} color="#f59e0b" />
                  <span style={styles.statTitle}>Emergency Help</span>
                </div>
                <div style={styles.statValue}>24/7 Available</div>
              </div>
              <button 
                style={{...styles.statButton, background: '#fef3c7', color: '#f59e0b'}}
                onMouseEnter={(e) => {
                  e.target.style.background = '#f59e0b';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#fef3c7';
                  e.target.style.color = '#f59e0b';
                }}
              >
                Call Now
              </button>
            </div>
          </div>
        </div>

        {/* Main Dashboard Card */}
        <div style={styles.dashboardCard}>
          {/* Tab Navigation */}
          <div style={styles.tabNavigation}>
            <nav style={styles.tabNav}>
              {[
                { id: 'overview', name: 'Overview', icon: Activity },
                { id: 'symptoms', name: 'AI Symptom Checker', icon: Heart },
                { id: 'prescriptions', name: 'Prescriptions', icon: Pill },
                { id: 'appointments', name: 'Appointments', icon: Calendar },
                { id: 'profile', name: 'Profile', icon: User },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    ...styles.tabButton,
                    ...(activeTab === tab.id ? styles.activeTab : styles.inactiveTab)
                  }}
                >
                  <tab.icon size={16} />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div style={styles.tabContent}>
            {activeTab === 'overview' && (
              <div>
                <div style={styles.overviewGrid}>
                  <div style={styles.chartCard}>
                    <h3 style={styles.chartTitle}>
                      <Activity size={20} color="#3b82f6" />
                      Health Metrics Trend
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={healthMetrics}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="bp" stroke="#4F46E5" strokeWidth={3} name="Blood Pressure" />
                        <Line type="monotone" dataKey="sugar" stroke="#059669" strokeWidth={3} name="Blood Sugar" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div style={styles.chartCard}>
                    <h3 style={styles.chartTitle}>
                      <Heart size={20} color="#ef4444" />
                      Common Symptoms
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={symptomData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          dataKey="frequency"
                        />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'symptoms' && (
              <div>
                <div style={styles.symptomChecker}>
                  <h3 style={styles.sectionTitle}>
                    <div style={{...styles.sectionIcon, background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)'}}>
                      <Heart size={18} color="white" />
                    </div>
                    AI-Powered Symptom Checker
                  </h3>
                  
                  <div style={styles.symptomInput}>
                    <textarea
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      placeholder="Describe your symptoms in detail (e.g., fever since 2 days, headache, body pain, fatigue)..."
                      style={{
                        ...styles.symptomTextarea,
                        borderColor: symptoms ? '#3b82f6' : '#e5e7eb'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                      onBlur={(e) => e.target.style.borderColor = symptoms ? '#3b82f6' : '#e5e7eb'}
                    />
                    <button
                      onClick={handleSymptomCheck}
                      style={styles.analyzeButton}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3)';
                      }}
                    >
                      <Search size={16} />
                      Analyze Symptoms
                    </button>
                  </div>
                  
                  {aiAnalysis && (
                    <div style={styles.analysisResult}>
                      <h4 style={styles.analysisTitle}>
                        <Activity size={20} color="#3b82f6" />
                        AI Health Analysis
                      </h4>
                      <p style={styles.analysisText}>{aiAnalysis}</p>
                      <div style={styles.actionButtons}>
                        <button 
                          style={{...styles.actionButton, ...styles.primaryAction}}
                          onMouseEnter={(e) => e.target.style.background = '#059669'}
                          onMouseLeave={(e) => e.target.style.background = '#10b981'}
                        >
                          Book Video Consultation
                        </button>
                        <button 
                          style={{...styles.actionButton, ...styles.secondaryAction}}
                          onMouseEnter={(e) => e.target.style.background = '#4b5563'}
                          onMouseLeave={(e) => e.target.style.background = '#6b7280'}
                        >
                          Get Second Opinion
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'prescriptions' && (
              <div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px'}}>
                  <h3 style={styles.sectionTitle}>
                    <div style={{...styles.sectionIcon, background: 'linear-gradient(135deg, #10b981, #059669)'}}>
                      <Pill size={18} color="white" />
                    </div>
                    Active Prescriptions
                  </h3>
                  <button 
                    style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3)';
                    }}
                  >
                    <Plus size={16} />
                    Add Medicine
                  </button>
                </div>
                
                <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                  {medicines.map((medicine, index) => (
                    <div 
                      key={index} 
                      style={styles.medicineCard}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.12)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)';
                      }}
                    >
                      <div style={styles.medicineHeader}>
                        <div style={styles.medicineInfo}>
                          <h4 style={styles.medicineName}>{medicine.name}</h4>
                          <p style={styles.medicineDosage}>{medicine.dosage}</p>
                          <div style={styles.medicineDetails}>
                            <span style={{
                              ...styles.medicineStatus,
                              ...(medicine.status === 'low' ? styles.statusLow : 
                                  medicine.status === 'medium' ? styles.statusMedium : 
                                  styles.statusGood)
                            }}>
                              {medicine.remaining} tablets left
                            </span>
                            <span style={styles.refillInfo}>
                              <Calendar size={16} />
                              Refill by: {medicine.refillDate}
                            </span>
                          </div>
                        </div>
                        <button 
                          style={styles.refillButton}
                          onMouseEnter={(e) => e.target.style.background = '#1d4ed8'}
                          onMouseLeave={(e) => e.target.style.background = '#3b82f6'}
                        >
                          Order Refill
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px'}}>
                  <h3 style={styles.sectionTitle}>
                    <div style={{...styles.sectionIcon, background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'}}>
                      <Calendar size={18} color="white" />
                    </div>
                    My Appointments
                  </h3>
                  <button 
                    style={{
                      padding: '16px 32px',
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
                    }}
                  >
                    Book New Consultation
                  </button>
                </div>
                
                <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                  {appointments.map((appointment) => (
                    <div 
                      key={appointment.id} 
                      style={styles.appointmentCard}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.12)';
                        e.currentTarget.style.borderColor = '#3b82f6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                        e.currentTarget.style.borderColor = '#f3f4f6';
                      }}
                    >
                      <div style={styles.appointmentHeader}>
                        <div style={styles.appointmentInfo}>
                          <h4 style={styles.doctorName}>{appointment.doctor}</h4>
                          <p style={styles.specialty}>{appointment.specialty}</p>
                          <div style={styles.appointmentDetails}>
                            <div style={styles.appointmentDetail}>
                              <Calendar size={16} />
                              <span>{appointment.date} at {appointment.time}</span>
                            </div>
                            <div style={styles.appointmentDetail}>
                              <MapPin size={16} />
                              <span>{appointment.type}</span>
                            </div>
                          </div>
                        </div>
                        <span style={{
                          ...styles.statusBadge,
                          ...(appointment.status === 'Upcoming' ? styles.statusUpcoming : styles.statusCompleted)
                        }}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <h3 style={styles.sectionTitle}>
                  <div style={{...styles.sectionIcon, background: 'linear-gradient(135deg, #6366f1, #4f46e5)'}}>
                    <User size={18} color="white" />
                  </div>
                  Patient Profile
                </h3>
                
                <div style={styles.profileGrid}>
                  <div style={styles.profileSection}>
                    <h4 style={styles.profileSectionTitle}>Personal Information</h4>
                    <div style={styles.profileItem}>
                      <strong style={styles.profileLabel}>Name:</strong>
                      <span style={styles.profileValue}>{patientInfo.name || 'Not provided'}</span>
                    </div>
                    <div style={styles.profileItem}>
                      <strong style={styles.profileLabel}>Email:</strong>
                      <span style={styles.profileValue}>{patientInfo.email || 'Not provided'}</span>
                    </div>
                    <div style={styles.profileItem}>
                      <strong style={styles.profileLabel}>Date of Birth:</strong>
                      <span style={styles.profileValue}>{patientInfo.dob || 'Not provided'}</span>
                    </div>
                    <div style={styles.profileItem}>
                      <strong style={styles.profileLabel}>Gender:</strong>
                      <span style={styles.profileValue}>{patientInfo.gender || 'Not provided'}</span>
                    </div>
                    <div style={styles.profileItem}>
                      <strong style={styles.profileLabel}>Blood Group:</strong>
                      <span style={styles.profileValue}>{patientInfo.bloodGroup || 'Not provided'}</span>
                    </div>
                    <div style={styles.profileItem}>
                      <strong style={styles.profileLabel}>Marital Status:</strong>
                      <span style={styles.profileValue}>{patientInfo.maritalStatus || 'Not provided'}</span>
                    </div>
                  </div>

                  <div style={styles.profileSection}>
                    <h4 style={styles.profileSectionTitle}>Contact & Emergency</h4>
                    <div style={styles.profileItem}>
                      <strong style={styles.profileLabel}>Mobile:</strong>
                      <span style={styles.profileValue}>{patientInfo.mobile || 'Not provided'}</span>
                    </div>
                    <div style={styles.profileItem}>
                      <strong style={styles.profileLabel}>Address:</strong>
                      <span style={styles.profileValue}>{patientInfo.address || 'Not provided'}</span>
                    </div>
                    <div style={styles.profileItem}>
                      <strong style={styles.profileLabel}>Emergency Contact:</strong>
                      <span style={styles.profileValue}>{patientInfo.emergencyName || 'Not provided'}</span>
                    </div>
                    <div style={styles.profileItem}>
                      <strong style={styles.profileLabel}>Emergency Phone:</strong>
                      <span style={styles.profileValue}>{patientInfo.emergencyPhone || 'Not provided'}</span>
                    </div>
                  </div>

                  <div style={styles.profileSection}>
                    <h4 style={styles.profileSectionTitle}>Medical Information</h4>
                    <div style={styles.profileItem}>
                      <strong style={styles.profileLabel}>Conditions:</strong>
                      <span style={styles.profileValue}>{patientInfo.conditions || 'None reported'}</span>
                    </div>
                    <div style={styles.profileItem}>
                      <strong style={styles.profileLabel}>Allergies:</strong>
                      <span style={styles.profileValue}>{patientInfo.allergies || 'None reported'}</span>
                    </div>
                    <div style={styles.profileItem}>
                      <strong style={styles.profileLabel}>Current Medications:</strong>
                      <span style={styles.profileValue}>{patientInfo.medications || 'None reported'}</span>
                    </div>
                    <div style={styles.profileItem}>
                      <strong style={styles.profileLabel}>Past Surgeries:</strong>
                      <span style={styles.profileValue}>{patientInfo.surgeries || 'None'}</span>
                    </div>
                  </div>

                  <div style={styles.profileSection}>
                    <h4 style={styles.profileSectionTitle}>Insurance & Documents</h4>
                    <div style={styles.profileItem}>
                      <strong style={styles.profileLabel}>Family Doctor:</strong>
                      <span style={styles.profileValue}>{patientInfo.familyDoctor || 'Not assigned'}</span>
                    </div>
                    <div style={styles.profileItem}>
                      <strong style={styles.profileLabel}>Government ID:</strong>
                      <span style={styles.profileValue}>{patientInfo.govId || 'Not provided'}</span>
                    </div>
                    <div style={styles.profileItem}>
                      <strong style={styles.profileLabel}>Insurance Provider:</strong>
                      <span style={styles.profileValue}>{patientInfo.insuranceProvider || 'Not provided'}</span>
                    </div>
                    <div style={styles.profileItem}>
                      <strong style={styles.profileLabel}>Insurance Number:</strong>
                      <span style={styles.profileValue}>{patientInfo.insuranceNumber || 'Not provided'}</span>
                    </div>
                  </div>
                </div>
                
                <button 
                  style={styles.editButton}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#1d4ed8';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#3b82f6';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3)';
                  }}
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CSS Animations and Responsive Design */}
      <style jsx>{`
        /* Animations */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .overviewGrid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 768px) {
          .headerContent {
            flex-direction: column !important;
            gap: 16px !important;
            text-align: center !important;
          }
          
          .headerRight {
            flex-direction: column !important;
            gap: 12px !important;
          }
          
          .quickStats {
            grid-template-columns: 1fr !important;
          }
          
          .tabNav {
            flex-wrap: wrap !important;
            gap: 4px !important;
          }
          
          .tabButton {
            font-size: 12px !important;
            padding: 12px 16px !important;
          }
          
          .profileGrid {
            grid-template-columns: 1fr !important;
          }
          
          .symptomInput {
            flex-direction: column !important;
          }
          
          .symptomTextarea {
            min-width: 100% !important;
          }
          
          .medicineHeader,
          .appointmentHeader {
            flex-direction: column !important;
            gap: 16px !important;
          }
          
          .actionButtons {
            flex-direction: column !important;
          }
        }

        @media (max-width: 480px) {
          .mainContent {
            padding: 16px 12px !important;
          }
          
          .tabContent {
            padding: 16px !important;
          }
          
          .logoText {
            font-size: 24px !important;
          }
          
          .statCard {
            padding: 16px !important;
          }
          
          .chartCard,
          .symptomChecker,
          .profileSection {
            padding: 16px !important;
          }
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #10b981, #3b82f6);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #059669, #1d4ed8);
        }

        /* Focus states for accessibility */
        button:focus,
        input:focus,
        textarea:focus,
        select:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        /* Loading states */
        .loading {
          animation: pulse 2s infinite;
        }

        /* Hover effects for interactive elements */
        .interactive {
          transition: all 0.3s ease;
        }

        .interactive:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        /* Chart styling */
        .recharts-cartesian-axis-line,
        .recharts-cartesian-axis-tick-line {
          stroke: #e2e8f0;
        }

        .recharts-cartesian-axis-tick-value {
          fill: #64748b;
          font-size: 12px;
        }

        .recharts-tooltip-wrapper {
          border-radius: 8px !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default PatientDashboard;