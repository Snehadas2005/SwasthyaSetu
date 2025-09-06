import { Link } from "react-router-dom";
import "./Landing.css";

function Landing() {
  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="landing-title">TeleHealth Rural</h1>
        <p className="landing-text">
          AI-driven telemedicine and medicine tracking platform for rural areas. 
          Access healthcare anytime, anywhere.
        </p>
        <div className="landing-buttons">
          <Link to="/home">
            <button className="btn-start">Start Now</button>
          </Link>
          <Link to="/register">
            <button className="btn-outline">New User</button>
          </Link>
        </div>
      </section>

      {/* About / Mission / Vision */}
      <section className="about-section">
        <h2>About TeleHealth Rural</h2>
        <p className="about-intro">
          AI-powered teleconsultation & healthcare services for rural areas
        </p>

        <div className="about-cards">
          <div className="about-card">
            <img src="https://img.icons8.com/fluency/96/000000/doctor-male.png" alt="Mission" />
            <h3>Our Mission</h3>
            <p>
              To provide accessible healthcare solutions to rural communities,
              leveraging technology for teleconsultation, symptom tracking, and
              medical guidance.
            </p>
          </div>

          <div className="about-card">
            <img src="https://img.icons8.com/fluency/96/000000/eye.png" alt="Vision" />
            <h3>Our Vision</h3>
            <p>
              To ensure that every person, regardless of location, can access
              quality healthcare information and services conveniently and safely.
            </p>
          </div>

          <div className="about-card">
            <img src="https://img.icons8.com/fluency/96/000000/heart-health.png" alt="Values" />
            <h3>Our Values</h3>
            <ul>
              <li>Patient-Centric Care</li>
              <li>Integrity & Transparency</li>
              <li>Innovation & Technology</li>
              <li>Accessibility & Inclusion</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features / Highlights */}
      <section className="features-section">
        <h2>Key Features</h2>
        <div className="features-cards">
          <div className="feature-card">
            <img src="https://img.icons8.com/fluency/96/000000/video-call.png" alt="Teleconsultation" />
            <h3>Teleconsultation</h3>
            <p>Video & voice consultations optimized for low-bandwidth connections.</p>
          </div>
          <div className="feature-card">
            <img src="https://img.icons8.com/fluency/96/000000/ai.png" alt="AI Symptom Checker" />
            <h3>AI Symptom Checker</h3>
            <p>AI-powered triage for faster and accurate diagnosis.</p>
          </div>
          <div className="feature-card">
            <img src="https://img.icons8.com/fluency/96/000000/pills.png" alt="Medicine Tracking" />
            <h3>Medicine Tracking</h3>
            <p>Check availability in local pharmacies to avoid delays in treatment.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;
