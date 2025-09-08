import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Home,
  Calendar,
  MessageSquare,
  Globe,
  ChevronDown,
  Bell,
  Settings,
  User,
  Clock,
  Users,
  FileText,
  Activity,
  Phone,
  Video,
  Send,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle,
  Heart,
  Thermometer,
  Pill,
  Brain,
  Stethoscope,
  UserCheck,
} from "lucide-react";

const LanguageSelector = () => {
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "hi", name: "हिंदी", flag: "🇮🇳" },
    { code: "mr", name: "मराठी", flag: "🇮🇳" },
    { code: "te", name: "తెలుగు", flag: "🇮🇳" },
    { code: "bn", name: "বাংলা", flag: "🇧🇩" },
  ];

  const currentLang =
    languages.find((lang) => lang.code === currentLanguage) || languages[0];

  return (
    <div className="language-selector">
      <button className="language-trigger" onClick={() => setIsOpen(!isOpen)}>
        <Globe size={16} />
        <span>{currentLang.flag}</span>
        <ChevronDown
          size={14}
          className={`chevron ${isOpen ? "rotate" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="language-dropdown">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setCurrentLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`language-option ${
                currentLanguage === lang.code ? "active" : ""
              }`}
            >
              <span className="flag">{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value, change, color, bgColor }) => (
  <div className={`stat-card ${bgColor}`}>
    <div className="stat-header">
      <div className={`stat-icon ${color}`}>
        <Icon size={24} />
      </div>
      <div className="stat-trend">
        {change > 0 ? (
          <span className="trend-up">+{change}%</span>
        ) : (
          <span className="trend-down">{change}%</span>
        )}
      </div>
    </div>
    <div className="stat-content">
      <h3 className="stat-value">{value}</h3>
      <p className="stat-title">{title}</p>
    </div>
  </div>
);

const PatientCard = ({ patient, onSelect }) => (
  <div className="patient-card" onClick={() => onSelect(patient)}>
    <div className="patient-header">
      <div className="patient-avatar">
        <User size={20} />
      </div>
      <div className="patient-info">
        <h4>{patient.name}</h4>
        <p className="patient-meta">
          {patient.age} years • {patient.gender}
        </p>
      </div>
      <div className={`priority-badge ${patient.priority}`}>
        {patient.priority}
      </div>
    </div>
    <div className="patient-symptoms">
      <p>{patient.symptoms}</p>
    </div>
    <div className="patient-footer">
      <span className="appointment-time">
        <Clock size={14} />
        {patient.time}
      </span>
      <div className="patient-actions">
        <button className="action-btn video">
          <Video size={14} />
        </button>
        <button className="action-btn call">
          <Phone size={14} />
        </button>
        <button className="action-btn message">
          <MessageSquare size={14} />
        </button>
      </div>
    </div>
  </div>
);

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState("queue");
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Sample Data
  const stats = [
    {
      icon: Users,
      title: "Patients Today",
      value: "28",
      change: 12,
      color: "blue",
      bgColor: "bg-blue",
    },
    {
      icon: Clock,
      title: "Pending Consultations",
      value: "6",
      change: -5,
      color: "orange",
      bgColor: "bg-orange",
    },
    {
      icon: FileText,
      title: "Prescriptions Given",
      value: "22",
      change: 8,
      color: "green",
      bgColor: "bg-green",
    },
    {
      icon: Calendar,
      title: "Follow-ups Scheduled",
      value: "5",
      change: 3,
      color: "purple",
      bgColor: "bg-purple",
    },
  ];

  const patientQueue = [
    {
      id: 1,
      name: "Rajesh Kumar",
      age: 45,
      gender: "Male",
      symptoms: "Fever, headache, body aches since 3 days",
      time: "10:00 AM",
      priority: "high",
      status: "waiting",
      aiSuggestion: "Possible viral fever - Medium Priority",
      vitals: { temp: "101.2°F", bp: "130/85", pulse: "92" },
    },
    {
      id: 2,
      name: "Sunita Sharma",
      age: 32,
      gender: "Female",
      symptoms: "Persistent cough, chest discomfort",
      time: "10:30 AM",
      priority: "medium",
      status: "waiting",
      aiSuggestion: "Respiratory infection likely - Monitor closely",
      vitals: { temp: "99.8°F", bp: "120/75", pulse: "88" },
    },
    {
      id: 3,
      name: "Amit Verma",
      age: 28,
      gender: "Male",
      symptoms: "Stomach pain, nausea after eating",
      time: "11:00 AM",
      priority: "low",
      status: "waiting",
      aiSuggestion: "Gastric issue - Low Priority",
      vitals: { temp: "98.6°F", bp: "115/70", pulse: "76" },
    },
  ];

  const recentConsultations = [
    {
      name: "Priya Singh",
      condition: "Hypertension",
      date: "Today",
      time: "9:00 AM",
      status: "completed",
    },
    {
      name: "Mohammad Ali",
      condition: "Diabetes Check",
      date: "Today",
      time: "8:30 AM",
      status: "completed",
    },
    {
      name: "Lakshmi Devi",
      condition: "Joint Pain",
      date: "Yesterday",
      time: "4:30 PM",
      status: "completed",
    },
  ];

  const conditionData = [
    { condition: "Fever", count: 8, color: "#ef4444" },
    { condition: "Respiratory", count: 6, color: "#f59e0b" },
    { condition: "Gastric", count: 4, color: "#10b981" },
    { condition: "Hypertension", count: 3, color: "#6366f1" },
    { condition: "Others", count: 7, color: "#8b5cf6" },
  ];

  const weeklyStats = [
    { day: "Mon", patients: 24 },
    { day: "Tue", patients: 28 },
    { day: "Wed", patients: 32 },
    { day: "Thu", patients: 26 },
    { day: "Fri", patients: 30 },
    { day: "Sat", patients: 20 },
    { day: "Sun", patients: 15 },
  ];

  const handleNavClick = (section) => {
    console.log(`Navigate to: ${section}`);
  };

  return (
    <div className="dashboard-container">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .dashboard-container {
          min-height: 100vh;
          background: #f8fafc;
          font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
        }

        /* Header Styles */
        .header {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 1rem 2rem;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logo {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #16a34a, #15803d);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
        }

        .logo-text {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a202c;
        }

        .logo-subtitle {
          font-size: 0.875rem;
          color: #16a34a;
          font-weight: 500;
        }

        .nav-buttons {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .nav-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: transparent;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.875rem;
          color: #4a5568;
          font-weight: 500;
        }

        .nav-btn:hover {
          background: #f7fafc;
          border-color: #16a34a;
          color: #16a34a;
        }

        .nav-btn.active {
          background: #16a34a;
          color: white;
          border-color: #16a34a;
        }

        .nav-btn.primary {
          background: linear-gradient(135deg, #16a34a, #15803d);
          color: white;
          border-color: #16a34a;
        }

        .nav-btn.primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
        }

        .user-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .notification-btn {
          position: relative;
          padding: 0.5rem;
          background: transparent;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          color: #4a5568;
          transition: all 0.3s ease;
        }

        .notification-btn:hover {
          background: #f7fafc;
          color: #16a34a;
        }

        .notification-badge {
          position: absolute;
          top: 0;
          right: 0;
          width: 8px;
          height: 8px;
          background: #ef4444;
          border-radius: 50%;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 1rem;
          border-radius: 12px;
          background: #f7fafc;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .user-info:hover {
          background: #e2e8f0;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #16a34a, #15803d);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .user-details h4 {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1a202c;
        }

        .user-details p {
          font-size: 0.75rem;
          color: #6b7280;
        }

        /* Language Selector */
        .language-selector {
          position: relative;
        }

        .language-trigger {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          background: transparent;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          color: #4a5568;
          transition: all 0.3s ease;
        }

        .language-trigger:hover {
          border-color: #16a34a;
          background: rgba(22, 163, 74, 0.05);
        }

        .chevron {
          transition: transform 0.3s ease;
        }

        .chevron.rotate {
          transform: rotate(180deg);
        }

        .language-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.5rem;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          min-width: 140px;
          z-index: 1000;
        }

        .language-option {
          width: 100%;
          padding: 0.75rem;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.875rem;
          color: #4a5568;
          transition: all 0.2s ease;
        }

        .language-option:hover {
          background: #f7fafc;
        }

        .language-option.active {
          background: #16a34a;
          color: white;
        }

        /* Main Content */
        .main-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
        }

        .welcome-section {
          margin-bottom: 2rem;
        }

        .welcome-section h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 0.5rem;
        }

        .welcome-section p {
          color: #6b7280;
          font-size: 1rem;
        }

        /* Stats Cards */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .bg-blue { border-left: 4px solid #3b82f6; }
        .bg-orange { border-left: 4px solid #f59e0b; }
        .bg-green { border-left: 4px solid #10b981; }
        .bg-purple { border-left: 4px solid #8b5cf6; }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .stat-icon.blue { background: #3b82f6; }
        .stat-icon.orange { background: #f59e0b; }
        .stat-icon.green { background: #10b981; }
        .stat-icon.purple { background: #8b5cf6; }

        .trend-up {
          color: #10b981;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .trend-down {
          color: #ef4444;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 800;
          color: #1a202c;
          margin-bottom: 0.25rem;
        }

        .stat-title {
          color: #6b7280;
          font-size: 0.875rem;
          font-weight: 500;
        }

        /* Tabs */
        .tabs-container {
          margin-bottom: 2rem;
        }

        .tabs-header {
          display: flex;
          gap: 1rem;
          border-bottom: 1px solid #e2e8f0;
          margin-bottom: 2rem;
        }

        .tab-btn {
          padding: 1rem 1.5rem;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          font-weight: 600;
          color: #6b7280;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .tab-btn.active {
          color: #16a34a;
          border-bottom-color: #16a34a;
        }

        .tab-btn:hover {
          color: #16a34a;
        }

        /* Patient Queue */
        .patients-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .patient-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid #e2e8f0;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .patient-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          border-color: #16a34a;
        }

        .patient-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .patient-avatar {
          width: 48px;
          height: 48px;
          background: #e2e8f0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
        }

        .patient-info h4 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 0.25rem;
        }

        .patient-meta {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .priority-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .priority-badge.high {
          background: #fee2e2;
          color: #dc2626;
        }

        .priority-badge.medium {
          background: #fef3c7;
          color: #d97706;
        }

        .priority-badge.low {
          background: #d1fae5;
          color: #059669;
        }

        .patient-symptoms {
          margin-bottom: 1rem;
        }

        .patient-symptoms p {
          color: #4b5563;
          line-height: 1.5;
        }

        .patient-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .appointment-time {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .patient-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          width: 36px;
          height: 36px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .action-btn.video {
          color: #3b82f6;
          border-color: #3b82f6;
        }

        .action-btn.call {
          color: #10b981;
          border-color: #10b981;
        }

        .action-btn.message {
          color: #f59e0b;
          border-color: #f59e0b;
        }

        /* Charts Section */
        .charts-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .chart-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid #e2e8f0;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .chart-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1a202c;
        }

        .chart-filters {
          display: flex;
          gap: 0.5rem;
        }

        .filter-btn {
          padding: 0.5rem 1rem;
          background: #f7fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.875rem;
          color: #6b7280;
          transition: all 0.3s ease;
        }

        .filter-btn.active {
          background: #16a34a;
          color: white;
          border-color: #16a34a;
        }

        /* Recent Activity */
        .activity-list {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid #e2e8f0;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 0.5rem;
          transition: all 0.3s ease;
        }

        .activity-item:hover {
          background: #f7fafc;
        }

        .activity-status {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #10b981;
        }

        .activity-content h4 {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 0.25rem;
        }

        .activity-content p {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .activity-time {
          font-size: 0.75rem;
          color: #9ca3af;
          margin-left: auto;
        }

        .condition-legend {
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #4b5563;
        }

        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .ai-recommendations {
          margin-top: 2rem;
        }

        .recommendations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .recommendation-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }

        .recommendation-card.urgent {
          border-color: #f59e0b;
          background: #fffbeb;
        }

        .recommendation-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .recommendation-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
          color: #16a34a;
          font-weight: 600;
        }

        .recommendation-card.urgent .recommendation-header {
          color: #d97706;
        }

        .recommendation-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .btn-sm {
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-sm.primary {
          background: #16a34a;
          color: white;
        }

        .btn-sm.primary:hover {
          background: #15803d;
          transform: translateY(-1px);
        }

        .btn-sm.secondary {
          background: #f7fafc;
          color: #4a5568;
          border: 1px solid #e2e8f0;
        }

        .btn-sm.secondary:hover {
          background: #e2e8f0;
        }

        .prescription-section {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }

        .prescription-tools {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .tool-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 1.5rem;
        }

        .tool-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          color: #16a34a;
        }

        .tool-header h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1a202c;
        }

        .prescription-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-select,
        .form-input,
        .form-textarea {
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }

        .form-select:focus,
        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #16a34a;
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
        }

        .medicine-input {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr auto;
          gap: 0.75rem;
          align-items: center;
        }

        .form-input.short {
          max-width: 100px;
        }

        .btn-icon {
          width: 40px;
          height: 40px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: white;
          display: flex;
          align-items
          .btn-icon:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }  
    /* Charts inside prescription or AI recommendations */  
    .chart-container { width: 100%; height: 250px; }  

  `}</style>

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo">
              <img
                src="/logo.png"
                alt="SwasthyaSetu Logo"
                style={{ width: "40px", height: "40px", borderRadius: "8px" }}
              />
            </div>
            <div>
              <div className="logo-text">SwasthyaSetu</div>
              <div className="logo-subtitle">
                Telemedicine Access for Rural Healthcare
              </div>
            </div>
          </div>

          <div className="nav-buttons">
            <button
              className="nav-btn active"
              onClick={() => handleNavClick("home")}
            >
              <Home size={16} /> Home
            </button>
            <button
              className="nav-btn"
              onClick={() => handleNavClick("chatbot")}
            >
              <MessageSquare size={16} /> AI Chatbot
            </button>
          </div>

          <div className="user-section">
            <LanguageSelector />
            <button className="notification-btn">
              <Bell size={20} />
              <span className="notification-badge"></span>
            </button>
            <div className="user-info">
              <div className="user-avatar">
                <User size={20} />
              </div>
              <div className="user-details">
                <h4>Dr. Sharma</h4>
                <p>Cardiologist</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        {/* Welcome Section */}
        <section className="welcome-section">
          <h1>Welcome back, Dr. Sharma</h1>
          <p>Here’s your patient overview and today's stats.</p>
        </section>

        {/* Stats Cards */}
        <div className="stats-grid">
          {stats.map((s, idx) => (
            <StatCard key={idx} {...s} />
          ))}
        </div>

        {/* Tabs and Patient Queue */}
        <div className="tabs-container">
          <div className="tabs-header">
            <button
              className={`tab-btn ${activeTab === "queue" ? "active" : ""}`}
              onClick={() => setActiveTab("queue")}
            >
              Queue
            </button>
            <button
              className={`tab-btn ${activeTab === "recent" ? "active" : ""}`}
              onClick={() => setActiveTab("recent")}
            >
              Recent Consultations
            </button>
          </div>

          {activeTab === "queue" && (
            <div className="patients-grid">
              {patientQueue.map((p) => (
                <PatientCard
                  key={p.id}
                  patient={p}
                  onSelect={setSelectedPatient}
                />
              ))}
            </div>
          )}

          {activeTab === "recent" && (
            <div className="activity-list">
              {recentConsultations.map((r, i) => (
                <div key={i} className="activity-item">
                  <div className="activity-status"></div>
                  <div className="activity-content">
                    <h4>{r.name}</h4>
                    <p>{r.condition}</p>
                  </div>
                  <span className="activity-time">{r.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Charts Section */}
        <div className="charts-grid">
          <div className="chart-card">
            <div className="chart-header">
              <span className="chart-title">Weekly Patients</span>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyStats}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="patients" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <span className="chart-title">Condition Distribution</span>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={conditionData}
                  dataKey="count"
                  nameKey="condition"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                >
                  {conditionData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="condition-legend">
              {conditionData.map((c, i) => (
                <div key={i} className="legend-item">
                  <span
                    className="legend-color"
                    style={{ background: c.color }}
                  ></span>
                  {c.condition}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        {selectedPatient && (
          <div className="ai-recommendations">
            <h2 className="section-title">
              AI Recommendations for {selectedPatient.name}
            </h2>
            <div className="recommendations-grid">
              <div
                className={`recommendation-card ${
                  selectedPatient.priority === "high" ? "urgent" : ""
                }`}
              >
                <div className="recommendation-header">
                  <Stethoscope size={16} /> {selectedPatient.aiSuggestion}
                </div>
                <p>
                  Vitals: Temp: {selectedPatient.vitals.temp}, BP:{" "}
                  {selectedPatient.vitals.bp}, Pulse:{" "}
                  {selectedPatient.vitals.pulse}
                </p>
                <div className="recommendation-actions">
                  <button className="btn-sm primary">View Details</button>
                  <button className="btn-sm secondary">Dismiss</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DoctorDashboard;
