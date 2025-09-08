import React, { useState } from "react";
import { Globe, ChevronDown, Menu, X, Play, Award, Users, MapPin, Smartphone, Brain, Shield, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";


const LanguageSelector = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  const changeLanguage = (languageCode) => {
    setCurrentLanguage(languageCode);
    setIsOpen(false);
    // This would integrate with your i18n setup
    console.log('Language changed to:', languageCode);
  };

  return (
    <div className="language-selector">
      <button
        className="language-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Globe size={16} />
        <span>{currentLang.flag}</span>
        <span className="lang-name">{currentLang.name}</span>
        <ChevronDown size={14} className={`chevron ${isOpen ? 'rotate' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="language-dropdown">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`language-option ${currentLanguage === lang.code ? 'active' : ''}`}
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

const StatCard = ({ icon: Icon, number, label, color }) => (
  <div className="stat-card">
    <div className={`stat-icon ${color}`}>
      <Icon size={24} />
    </div>
    <div className="stat-content">
      <div className="stat-number">{number}</div>
      <div className="stat-label">{label}</div>
    </div>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <div className="feature-card" style={{ animationDelay: `${delay}ms` }}>
    <div className="feature-icon">
      <Icon size={32} />
    </div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

const Landing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const handleNavClick = (path) => {
    console.log('Navigate to:', path);
     navigate(path);
  }

  return (
    <div className="landing-container">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .landing-container {
          font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
          line-height: 1.6;
          color: #1a202c;
          overflow-x: hidden;
        }

        /* Navigation */
        .navbar {
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .nav-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 700;
          font-size: 1.5rem;
          color: #16a34a;
        }

        .logo-img {
          width: 45px;
          height: 45px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(22, 163, 74, 0.2);
        }

        .nav-content {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-links {
          display: flex;
          gap: 2rem;
          align-items: center;
        }

        .nav-link {
          background: none;
          border: none;
          color: #4a5568;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          position: relative;
          cursor: pointer;
          font-size: 1rem;
        }

        .nav-link:hover {
          color: #16a34a;
          background: rgba(22, 163, 74, 0.05);
        }

        /* Language Selector */
        .language-selector {
          position: relative;
        }

        .language-trigger {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: transparent;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.875rem;
          color: #4a5568;
          transition: all 0.3s ease;
        }

        .language-trigger:hover {
          border-color: #16a34a;
          background: rgba(22, 163, 74, 0.05);
        }

        .lang-name {
          display: none;
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
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          min-width: 160px;
          z-index: 1000;
        }

        .language-option {
          width: 100%;
          padding: 0.75rem 1rem;
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

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: #4a5568;
        }

        /* Hero Section */
        .hero-section {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          display: flex;
          align-items: center;
          padding: 2rem 0;
          position: relative;
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2316a34a' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }

        .hero-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .hero-content {
          max-width: 600px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(22, 163, 74, 0.1);
          color: #16a34a;
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(22, 163, 74, 0.2);
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          background: linear-gradient(135deg, #1a202c 0%, #16a34a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: #4a5568;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          margin-bottom: 3rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #16a34a, #15803d);
          color: white;
          padding: 1rem 2rem;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(22, 163, 74, 0.3);
          font-size: 1rem;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(22, 163, 74, 0.4);
        }

        .btn-secondary {
          background: transparent;
          color: #16a34a;
          padding: 1rem 2rem;
          border: 2px solid #16a34a;
          border-radius: 12px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
        }

        .btn-secondary:hover {
          background: #16a34a;
          color: white;
          transform: translateY(-2px);
        }

        .hero-stats {
          display: flex;
          gap: 2rem;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon.green {
          background: rgba(22, 163, 74, 0.1);
          color: #16a34a;
        }

        .stat-icon.blue {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        }

        .stat-icon.orange {
          background: rgba(245, 101, 101, 0.1);
          color: #f56565;
        }

        .stat-content {
          display: flex;
          flex-direction: column;
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: 800;
          color: #1a202c;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #4a5568;
        }

        .hero-visual {
          position: relative;
        }

        .hero-image {
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
          display: block;
          border-radius: 20px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
        }

        /* Problems Section */
        .problems-section {
          padding: 6rem 0;
          background: white;
        }

        .section-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1a202c;
          margin-bottom: 1rem;
        }

        .section-subtitle {
          font-size: 1.25rem;
          color: #4a5568;
          max-width: 600px;
          margin: 0 auto;
        }

        .problems-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .problem-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
        }

        .problem-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          border-color: #16a34a;
        }

        .problem-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 1.5rem;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .problem-card h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 1rem;
        }

        .problem-card p {
          color: #4a5568;
          line-height: 1.6;
        }

        /* Features Section */
        .features-section {
          padding: 6rem 0;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 2.5rem;
          text-align: center;
          transition: all 0.4s ease;
          animation: fadeInUp 0.8s ease forwards;
          opacity: 0;
        }

        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
          border-color: #16a34a;
        }

        .feature-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 1.5rem;
          background: linear-gradient(135deg, #16a34a, #15803d);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .feature-card h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 1rem;
        }

        .feature-card p {
          color: #4a5568;
          line-height: 1.7;
        }

        /* Innovation Section */
        .innovation-section {
          padding: 6rem 0;
          background: #1a202c;
          color: white;
        }

        .innovation-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        .innovation-card {
          text-align: center;
          padding: 2rem;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .innovation-card:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-5px);
        }

        .innovation-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .innovation-card h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .innovation-card p {
          color: #a0aec0;
          line-height: 1.6;
        }

        /* CTA Section */
        .cta-section {
          padding: 6rem 0;
          background: linear-gradient(135deg, #16a34a, #15803d);
          color: white;
          text-align: center;
        }

        .cta-content h2 {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }

        .cta-content p {
          font-size: 1.25rem;
          margin-bottom: 2rem;
          opacity: 0.9;
        }

        .cta-actions {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn-white {
          background: white;
          color: #16a34a;
          padding: 1rem 2rem;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
        }

        .btn-white:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
        }

        .btn-outline-white {
          background: transparent;
          color: white;
          padding: 1rem 2rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
        }

        .btn-outline-white:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: white;
        }

        /* Animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Mobile Styles */
        @media (max-width: 1024px) {
          .lang-name {
            display: inline;
          }
        }

        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block;
          }

          .nav-links {
            display: none;
          }

          .hero-container {
            grid-template-columns: 1fr;
            gap: 2rem;
            text-align: center;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .hero-actions {
            flex-direction: column;
            align-items: center;
          }

          .hero-stats {
            justify-content: center;
            flex-wrap: wrap;
            gap: 1rem;
          }

          .section-title {
            font-size: 2rem;
          }

          .cta-content h2 {
            font-size: 2rem;
          }

          .nav-container {
            padding: 1rem;
          }

          .lang-name {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 2rem;
          }

          .hero-subtitle {
            font-size: 1rem;
          }

          .section-container {
            padding: 0 1rem;
          }

          .hero-actions {
            flex-direction: column;
            width: 100%;
          }

          .btn-primary, .btn-secondary {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <img src="/logo.png" alt="SwasthyaSetu Logo" className="logo-img" />
            <span>SwasthyaSetu</span>
          </div>
          <div className="nav-content">
            <div className="nav-links">
              <button onClick={() => handleNavClick('/login')} className="nav-link">
                Login/Register
              </button>
              <button onClick={() => handleNavClick('/contact')} className="nav-link">
                Contact Us
              </button>
            </div>
            <LanguageSelector />
            <button 
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Bridging Healthcare Gaps in <span style={{color: '#16a34a'}}>Rural India</span>
            </h1>
            <p className="hero-subtitle">
              AI-powered telemedicine platform connecting patients, doctors, pharmacies, and authorities 
              for seamless healthcare delivery in remote areas.
            </p>
            <div className="hero-actions">
              <button onClick={() => handleNavClick('/home')} className="btn-primary">
                <Play size={18} />
                Get Started
              </button>
              <button onClick={() => handleNavClick('/register')} className="btn-secondary">
                <Users size={18} />
                Register Now
              </button>
            </div>
            <div className="hero-stats">
              <StatCard 
                icon={Users} 
                number="10K+" 
                label="Target Users" 
                color="green"
              />
              <StatCard 
                icon={MapPin} 
                number="500+" 
                label="Villages to Cover" 
                color="blue"
              />
              <StatCard 
                icon={Shield} 
                number="24/7" 
                label="Support" 
                color="orange"
              />
            </div>
          </div>
          <div className="hero-visual">
            <img src="/mainlogo.png" alt="Telemedicine" className="hero-image" />
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="problems-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Addressing Critical Healthcare Challenges</h2>
            <p className="section-subtitle">
              Understanding the root problems in rural healthcare delivery
            </p>
          </div>
          <div className="problems-grid">
            <div className="problem-card">
              <div className="problem-icon">
                <Users size={32} />
              </div>
              <h3>Limited Healthcare Staff</h3>
              <p>Long delays in treatment due to shortage of doctors and medical staff in rural areas.</p>
            </div>
            <div className="problem-card">
              <div className="problem-icon">
                <MapPin size={32} />
              </div>
              <h3>Poor Infrastructure</h3>
              <p>Travel burden and overcrowded hospitals make healthcare access challenging.</p>
            </div>
            <div className="problem-card">
              <div className="problem-icon">
                <Shield size={32} />
              </div>
              <h3>Medicine Shortages</h3>
              <p>Patients unable to access essential medications when needed most.</p>
            </div>
            <div className="problem-card">
              <div className="problem-icon">
                <Smartphone size={32} />
              </div>
              <h3>Digital Divide</h3>
              <p>Lack of multilingual, offline-ready health solutions for rural communities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Our Comprehensive Solution</h2>
            <p className="section-subtitle">
              Cutting-edge technology meeting rural healthcare needs
            </p>
          </div>
          <div className="features-grid">
            <FeatureCard
              icon={Brain}
              title="AI-Powered Teleconsultation"
              description="Connect with verified doctors via video/voice calls with AI symptom checker and triage system."
              delay={100}
            />
            <FeatureCard
              icon={Zap}
              title="Smart Prescription Management"
              description="AI analyzes handwritten prescriptions and automates medicine orders with pharmacy integration."
              delay={200}
            />
            <FeatureCard
              icon={Shield}
              title="Doorstep Medicine Delivery"
              description="Integrated pharmacy network with real-time stock visibility and automatic order routing."
              delay={300}
            />
            <FeatureCard
              icon={Users}
              title="Authority Dashboards"
              description="Centralized monitoring for patient load, doctor availability, and medicine stock across villages."
              delay={400}
            />
          </div>
        </div>
      </section>

      {/* Innovation Section */}
      <section className="innovation-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title" style={{color: 'white'}}>What Makes Us Unique</h2>
            <p className="section-subtitle" style={{color: '#a0aec0'}}>
              Revolutionary features designed for rural healthcare transformation
            </p>
          </div>
          <div className="innovation-grid">
            <div className="innovation-card">
              <div className="innovation-icon">🤖</div>
              <h3>AI Prescription Analyzer</h3>
              <p>Reads handwritten prescriptions and extracts medicine details automatically</p>
            </div>
            <div className="innovation-card">
              <div className="innovation-icon">🔍</div>
              <h3>Smart Symptom Checker</h3>
              <p>AI-powered triage system that prioritizes emergencies and reduces hospital load</p>
            </div>
            <div className="innovation-card">
              <div className="innovation-icon">✅</div>
              <h3>Doctor Verification</h3>
              <p>Automatic verification ensures only certified doctors can register</p>
            </div>
            <div className="innovation-card">
              <div className="innovation-icon">📱</div>
              <h3>Offline-First Design</h3>
              <p>Core features work with poor connectivity via SMS/IVR support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="section-container">
          <div className="cta-content">
            <h2>Join the Healthcare Revolution</h2>
            <p>Experience the future of rural healthcare with SwasthyaSetu</p>
            <div className="cta-actions">
              <button onClick={() => handleNavClick('/register')} className="btn-white">
                <Users size={18} />
                Start Your Journey
              </button>
              <button onClick={() => handleNavClick('/contact')} className="btn-outline-white">
                <Globe size={18} />
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;