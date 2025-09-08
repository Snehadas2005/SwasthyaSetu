import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  User,
  Mail,
  Lock,
  Calendar,
  MapPin,
  Phone,
  Heart,
  Shield,
  CheckCircle2,
  AlertCircle,
  HeartPulse,
  Home,
  MessageCircle,
  Stethoscope,
  Users,
  Award,
  Globe,
} from "lucide-react";

function RegisterPatient() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    address: "",
    phone: "",
    emergencyContact: "",
    emergencyPhone: "",
    bloodGroup: "",
    allergies: "",
    conditions: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (
      !formData.email ||
      !formData.password ||
      !formData.name ||
      !formData.dateOfBirth ||
      !formData.gender ||
      !formData.maritalStatus ||
      !formData.address ||
      !formData.phone
    ) {
      return t(
        "validation.requiredFields",
        "Please fill in all required fields."
      );
    }

    if (formData.password !== formData.confirmPassword) {
      return t("validation.passwordMismatch", "Passwords do not match.");
    }

    if (formData.password.length < 6) {
      return t(
        "validation.passwordLength",
        "Password must be at least 6 characters long."
      );
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      return t(
        "validation.invalidEmail",
        "Please enter a valid email address."
      );
    }

    const phonePattern = /^[+]?[\d\s\-()]{10,}$/;
    if (!phonePattern.test(formData.phone)) {
      return t("validation.invalidPhone", "Please enter a valid phone number.");
    }

    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create patient profile with complete data structure
      const patientProfile = {
        name: formData.name,
        email: formData.email,
        dob: formData.dateOfBirth,
        gender: formData.gender,
        maritalStatus: formData.maritalStatus,
        address: formData.address,
        mobile: formData.phone,
        emergencyName:
          formData.emergencyContact || t("profile.notProvided", "Not provided"),
        emergencyPhone:
          formData.emergencyPhone || t("profile.notProvided", "Not provided"),
        bloodGroup:
          formData.bloodGroup || t("profile.notProvided", "Not provided"),
        allergies:
          formData.allergies || t("profile.noneReported", "None reported"),
        conditions:
          formData.conditions || t("profile.noneReported", "None reported"),
        medications: t("profile.noneReported", "None reported"),
        surgeries: t("profile.none", "None"),
        familyDoctor: t("profile.notAssigned", "Not assigned"),
        govId: t("profile.notProvided", "Not provided"),
        insuranceProvider: t("profile.notProvided", "Not provided"),
        insuranceNumber: t("profile.notProvided", "Not provided"),
        photo: null,
        insuranceCard: null,
      };

      // Store patient profile data in memory
      window.patientData = patientProfile;

      setSuccess(
        t(
          "registration.success",
          "Registration successful! Redirecting to dashboard..."
        )
      );

      setTimeout(() => {
        navigate("/patient-dashboard");
      }, 2000);
    } catch (err) {
      setError(
        t("registration.failed", "Registration failed. Please try again.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background:
        "linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #f0fdf4 100%)",
      fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      position: "relative",
      overflow: "hidden",
    },

    backgroundPattern: {
      position: "absolute",
      inset: "0",
      opacity: "0.05",
      pointerEvents: "none",
      zIndex: "1",
    },

    patternCircle1: {
      position: "absolute",
      top: "10%",
      left: "10%",
      width: "120px",
      height: "120px",
      background: "linear-gradient(45deg, #10b981, #059669)",
      borderRadius: "50%",
      filter: "blur(60px)",
      animation: "float 6s ease-in-out infinite",
    },

    patternCircle2: {
      position: "absolute",
      top: "20%",
      right: "15%",
      width: "180px",
      height: "180px",
      background: "linear-gradient(45deg, #3b82f6, #1d4ed8)",
      borderRadius: "50%",
      filter: "blur(80px)",
      animation: "float 8s ease-in-out infinite reverse",
    },

    patternCircle3: {
      position: "absolute",
      bottom: "15%",
      left: "20%",
      width: "140px",
      height: "140px",
      background: "linear-gradient(45deg, #f59e0b, #d97706)",
      borderRadius: "50%",
      filter: "blur(70px)",
      animation: "float 7s ease-in-out infinite",
    },

    header: {
      position: "sticky",
      top: "0",
      zIndex: "1000",
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(229, 231, 235, 0.8)",
      padding: "16px 0",
      marginBottom: "32px",
    },

    headerContent: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 24px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },

    logo: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      textDecoration: "none",
    },

    logoIcon: {
      width: "48px",
      height: "48px",
      background: "linear-gradient(135deg, #10b981, #3b82f6)",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)",
      transition: "transform 0.3s ease",
    },

    logoText: {
      fontSize: "28px",
      fontWeight: "800",
      background: "linear-gradient(135deg, #10b981, #3b82f6, #059669)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      letterSpacing: "-0.5px",
    },

    logoSubtitle: {
      fontSize: "12px",
      color: "#6b7280",
      fontWeight: "600",
      marginTop: "-4px",
    },

    nav: {
      display: "flex",
      alignItems: "center",
      gap: "24px",
    },

    navButton: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "12px 20px",
      borderRadius: "12px",
      textDecoration: "none",
      fontWeight: "600",
      fontSize: "14px",
      transition: "all 0.3s ease",
      border: "none",
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
    },

    homeButton: {
      background: "linear-gradient(135deg, #10b981, #059669)",
      color: "white",
      boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)",
    },

    chatbotButton: {
      background: "rgba(59, 130, 246, 0.1)",
      color: "#3b82f6",
      border: "2px solid rgba(59, 130, 246, 0.2)",
    },

    mainContent: {
      position: "relative",
      zIndex: "10",
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 24px",
    },

    heroSection: {
      textAlign: "center",
      marginBottom: "48px",
    },

    heroTitle: {
      fontSize: "48px",
      fontWeight: "800",
      background: "linear-gradient(135deg, #1f2937, #374151)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginBottom: "16px",
      letterSpacing: "-1px",
      lineHeight: "1.2",
    },

    heroSubtitle: {
      fontSize: "20px",
      color: "#6b7280",
      fontWeight: "500",
      marginBottom: "32px",
      lineHeight: "1.6",
    },

    featureGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "24px",
      marginBottom: "48px",
    },

    featureCard: {
      background: "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(20px)",
      borderRadius: "20px",
      padding: "24px",
      border: "1px solid rgba(229, 231, 235, 0.5)",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)",
      textAlign: "center",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
    },

    featureIcon: {
      width: "60px",
      height: "60px",
      margin: "0 auto 16px",
      borderRadius: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "24px",
    },

    registrationCard: {
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      borderRadius: "24px",
      boxShadow: "0 25px 50px rgba(0, 0, 0, 0.1)",
      border: "1px solid rgba(255, 255, 255, 0.5)",
      padding: "48px",
      position: "relative",
      overflow: "hidden",
    },

    cardHeader: {
      position: "absolute",
      top: "0",
      left: "0",
      right: "0",
      height: "4px",
      background: "linear-gradient(90deg, #10b981, #3b82f6, #059669)",
      borderTopLeftRadius: "24px",
      borderTopRightRadius: "24px",
    },

    sectionTitle: {
      fontSize: "24px",
      fontWeight: "700",
      color: "#1f2937",
      marginBottom: "24px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },

    sectionIcon: {
      width: "40px",
      height: "40px",
      borderRadius: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
    },

    formSection: {
      background: "linear-gradient(135deg, #f9fafb, #f3f4f6)",
      borderRadius: "20px",
      padding: "32px",
      marginBottom: "32px",
      border: "1px solid rgba(229, 231, 235, 0.5)",
    },

    formGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "24px",
    },

    inputGroup: {
      marginBottom: "24px",
    },

    label: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "14px",
      fontWeight: "600",
      color: "#374151",
      marginBottom: "8px",
    },

    input: {
      width: "100%",
      padding: "16px",
      border: "2px solid #e5e7eb",
      borderRadius: "12px",
      fontSize: "16px",
      color: "#1f2937",
      backgroundColor: "#ffffff",
      transition: "all 0.3s ease",
      boxSizing: "border-box",
      outline: "none",
    },

    select: {
      width: "100%",
      padding: "16px",
      border: "2px solid #e5e7eb",
      borderRadius: "12px",
      fontSize: "16px",
      color: "#1f2937",
      backgroundColor: "#ffffff",
      transition: "all 0.3s ease",
      boxSizing: "border-box",
      outline: "none",
    },

    submitButton: {
      width: "100%",
      background: "linear-gradient(135deg, #10b981, #3b82f6)",
      color: "white",
      border: "none",
      padding: "20px",
      borderRadius: "16px",
      fontSize: "18px",
      fontWeight: "700",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "12px",
      boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)",
      position: "relative",
      overflow: "hidden",
    },

    loadingSpinner: {
      width: "24px",
      height: "24px",
      border: "3px solid rgba(255, 255, 255, 0.3)",
      borderTop: "3px solid white",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },

    alertSuccess: {
      background: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
      border: "2px solid #10b981",
      borderRadius: "16px",
      padding: "20px",
      marginBottom: "32px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      animation: "slideIn 0.5s ease",
    },

    alertError: {
      background: "linear-gradient(135deg, #fee2e2, #fecaca)",
      border: "2px solid #ef4444",
      borderRadius: "16px",
      padding: "20px",
      marginBottom: "32px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      animation: "shake 0.5s ease",
    },

    loginLink: {
      textAlign: "center",
      marginTop: "32px",
      padding: "24px",
      background: "linear-gradient(135deg, #f9fafb, #f3f4f6)",
      borderRadius: "16px",
      fontSize: "16px",
      color: "#6b7280",
    },

    trustIndicators: {
      marginTop: "48px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "32px",
      flexWrap: "wrap",
      background: "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(20px)",
      borderRadius: "20px",
      padding: "24px",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)",
    },

    trustItem: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "14px",
      color: "#6b7280",
      fontWeight: "600",
      transition: "transform 0.3s ease",
    },
  };

  return (
    <div style={styles.container}>
      {/* Background Pattern */}
      <div style={styles.backgroundPattern}>
        <div style={styles.patternCircle1}></div>
        <div style={styles.patternCircle2}></div>
        <div style={styles.patternCircle3}></div>
      </div>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Link to="/" style={styles.logo}>
            <div style={styles.logoIcon}>
              <img
                src="/logo.png"
                alt="SwasthyaSetu Logo"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "8px",
                  objectFit: "cover",
                }}
              />
            </div>
            <div>
              <div style={styles.logoText}>SwasthyaSetu</div>
              <div style={styles.logoSubtitle}>
                Telemedicine Access for Rural Healthcare
              </div>
            </div>
          </Link>

          <nav style={styles.nav}>
            <Link
              to="/"
              style={{ ...styles.navButton, ...styles.homeButton }}
              onMouseEnter={(e) =>
                (e.target.style.transform = "translateY(-2px)")
              }
              onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
            >
              <Home size={18} />
              Home
            </Link>
            <Link
              to="/chatbot"
              style={{ ...styles.navButton, ...styles.chatbotButton }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(59, 130, 246, 0.15)";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(59, 130, 246, 0.1)";
                e.target.style.transform = "translateY(0)";
              }}
            >
              <MessageCircle size={18} />
              AI Chatbot
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Hero Section */}
        <div style={styles.heroSection}>
          <h1 style={styles.heroTitle}>
            Join SwasthyaSetu Healthcare Platform
          </h1>
          <p style={styles.heroSubtitle}>
            Empowering rural communities with accessible, quality healthcare
            through innovative telemedicine solutions
          </p>

          {/* Feature Grid */}
          <div style={styles.featureGrid}>
            <div
              style={styles.featureCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 20px 40px rgba(0, 0, 0, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 10px 25px rgba(0, 0, 0, 0.05)";
              }}
            >
              <div
                style={{
                  ...styles.featureIcon,
                  background: "linear-gradient(135deg, #10b981, #059669)",
                }}
              >
                <Stethoscope size={28} color="white" />
              </div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#1f2937",
                  marginBottom: "8px",
                }}
              >
                Expert Consultations
              </h3>
              <p
                style={{
                  color: "#6b7280",
                  fontSize: "14px",
                  lineHeight: "1.6",
                }}
              >
                Connect with certified doctors and specialists from top
                hospitals across India
              </p>
            </div>

            <div
              style={styles.featureCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 20px 40px rgba(0, 0, 0, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 10px 25px rgba(0, 0, 0, 0.05)";
              }}
            >
              <div
                style={{
                  ...styles.featureIcon,
                  background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                }}
              >
                <Globe size={28} color="white" />
              </div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#1f2937",
                  marginBottom: "8px",
                }}
              >
                Rural Accessibility
              </h3>
              <p
                style={{
                  color: "#6b7280",
                  fontSize: "14px",
                  lineHeight: "1.6",
                }}
              >
                Breaking geographical barriers to bring quality healthcare to
                remote areas
              </p>
            </div>

            <div
              style={styles.featureCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 20px 40px rgba(0, 0, 0, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 10px 25px rgba(0, 0, 0, 0.05)";
              }}
            >
              <div
                style={{
                  ...styles.featureIcon,
                  background: "linear-gradient(135deg, #f59e0b, #d97706)",
                }}
              >
                <Award size={28} color="white" />
              </div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#1f2937",
                  marginBottom: "8px",
                }}
              >
                Smart India Hackathon
              </h3>
              <p
                style={{
                  color: "#6b7280",
                  fontSize: "14px",
                  lineHeight: "1.6",
                }}
              >
                Innovative solution addressing healthcare challenges in rural
                India
              </p>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div style={styles.registrationCard}>
          <div style={styles.cardHeader}></div>

          {error && (
            <div style={styles.alertError}>
              <AlertCircle size={20} color="#ef4444" />
              <p style={{ color: "#dc2626", fontWeight: "600", margin: "0" }}>
                {error}
              </p>
            </div>
          )}

          {success && (
            <div style={styles.alertSuccess}>
              <CheckCircle2 size={20} color="#10b981" />
              <p style={{ color: "#059669", fontWeight: "600", margin: "0" }}>
                {success}
              </p>
            </div>
          )}

          <form onSubmit={handleRegister}>
            {/* Personal Information Section */}
            <div style={styles.formSection}>
              <h3 style={styles.sectionTitle}>
                <div
                  style={{
                    ...styles.sectionIcon,
                    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                  }}
                >
                  <User size={20} />
                </div>
                Personal Information
              </h3>

              <div style={styles.formGrid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <Lock size={16} color="#6b7280" />
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    style={styles.input}
                    onFocus={(e) => (e.target.style.borderColor = "#10b981")}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                    required
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <Lock size={16} color="#6b7280" />
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    style={styles.input}
                    onFocus={(e) => (e.target.style.borderColor = "#10b981")}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact & Medical Info */}
            <div style={styles.formSection}>
              <h3 style={styles.sectionTitle}>
                <div
                  style={{
                    ...styles.sectionIcon,
                    background: "linear-gradient(135deg, #ef4444, #dc2626)",
                  }}
                >
                  <Heart size={20} />
                </div>
                Emergency Contact & Medical Information
              </h3>

              <div style={styles.formGrid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <Users size={16} color="#6b7280" />
                    Emergency Contact Name
                  </label>
                  <input
                    type="text"
                    name="emergencyContact"
                    placeholder="Emergency contact name"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    style={styles.input}
                    onFocus={(e) => (e.target.style.borderColor = "#ef4444")}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <Phone size={16} color="#6b7280" />
                    Emergency Phone
                  </label>
                  <input
                    type="tel"
                    name="emergencyPhone"
                    placeholder="Emergency contact phone"
                    value={formData.emergencyPhone}
                    onChange={handleChange}
                    style={styles.input}
                    onFocus={(e) => (e.target.style.borderColor = "#ef4444")}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <HeartPulse size={16} color="#6b7280" />
                    Blood Group
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    style={styles.select}
                    onFocus={(e) => (e.target.style.borderColor = "#ef4444")}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  >
                    <option value="">Select blood group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <AlertCircle size={16} color="#6b7280" />
                    Known Allergies
                  </label>
                  <input
                    type="text"
                    name="allergies"
                    placeholder="List any known allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    style={styles.input}
                    onFocus={(e) => (e.target.style.borderColor = "#ef4444")}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <Heart size={16} color="#6b7280" />
                  Medical Conditions
                </label>
                <input
                  type="text"
                  name="conditions"
                  placeholder="List any existing medical conditions"
                  value={formData.conditions}
                  onChange={handleChange}
                  style={styles.input}
                  onFocus={(e) => (e.target.style.borderColor = "#ef4444")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                ...styles.submitButton,
                opacity: isLoading ? "0.7" : "1",
                cursor: isLoading ? "not-allowed" : "pointer",
                transform: isLoading ? "none" : "scale(1)",
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 15px 35px rgba(16, 185, 129, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow =
                    "0 10px 25px rgba(16, 185, 129, 0.3)";
                }
              }}
            >
              {isLoading ? (
                <>
                  <div style={styles.loadingSpinner}></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={24} />
                  <span>Register for SwasthyaSetu</span>
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div style={styles.loginLink}>
            <p style={{ margin: "0", fontSize: "16px" }}>
              Already have an account?{" "}
              <Link
                to="/login/patient"
                style={{
                  color: "#3b82f6",
                  fontWeight: "700",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.textDecoration = "underline")
                }
                onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div style={styles.trustIndicators}>
          <div
            style={styles.trustItem}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Shield size={20} color="#10b981" />
            <span>256-bit SSL Encrypted</span>
          </div>
          <div
            style={styles.trustItem}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Heart size={20} color="#ef4444" />
            <span>HIPAA Compliant</span>
          </div>
          <div
            style={styles.trustItem}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <CheckCircle2 size={20} color="#3b82f6" />
            <span>Trusted by Rural Communities</span>
          </div>
          <div
            style={styles.trustItem}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Award size={20} color="#f59e0b" />
            <span>SIH 2024 Innovation</span>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .formGrid {
            grid-template-columns: 1fr !important;
          }

          .heroTitle {
            font-size: 32px !important;
          }

          .heroSubtitle {
            font-size: 16px !important;
          }

          .registrationCard {
            padding: 24px !important;
            margin: 16px !important;
          }

          .headerContent {
            padding: 0 16px !important;
          }

          .nav {
            gap: 12px !important;
          }

          .navButton {
            padding: 8px 12px !important;
            font-size: 12px !important;
          }

          .logoText {
            font-size: 20px !important;
          }

          .featureGrid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
        }

        @media (max-width: 480px) {
          .mainContent {
            padding: 0 16px !important;
          }

          .trustIndicators {
            flex-direction: column !important;
            gap: 16px !important;
          }

          .headerContent {
            flex-direction: column !important;
            gap: 16px !important;
          }
        }

        /* Focus states for better accessibility */
        button:focus,
        input:focus,
        select:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #10b981, #3b82f6);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #059669, #1d4ed8);
        }
      `}</style>
    </div>
  );
}

export default RegisterPatient;
