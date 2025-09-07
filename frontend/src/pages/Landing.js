import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Landing.css";

function Landing() {
  const { t } = useTranslation();

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="landing-title">{t('landing.title')}</h1>
        <p className="landing-text">
          {t('landing.subtitle')}
        </p>
        <div className="landing-buttons">
          <Link to="/home">
            <button className="btn-start">{t('landing.startNow')}</button>
          </Link>
          <Link to="/register">
            <button className="btn-outline">{t('landing.newUser')}</button>
          </Link>
        </div>
      </section>

      {/* About / Mission / Vision */}
      <section className="about-section">
        <h2>{t('landing.aboutTitle')}</h2>
        <p className="about-intro">
          {t('landing.aboutIntro')}
        </p>

        <div className="about-cards">
          <div className="about-card">
            <img src="https://img.icons8.com/fluency/96/000000/doctor-male.png" alt="Mission" />
            <h3>{t('landing.mission.title')}</h3>
            <p>
              {t('landing.mission.description')}
            </p>
          </div>

          <div className="about-card">
            <img src="https://img.icons8.com/fluency/96/000000/eye.png" alt="Vision" />
            <h3>{t('landing.vision.title')}</h3>
            <p>
              {t('landing.vision.description')}
            </p>
          </div>

          <div className="about-card">
            <img src="https://img.icons8.com/fluency/96/000000/heart-health.png" alt="Values" />
            <h3>{t('landing.values.title')}</h3>
            <ul>
              <li>{t('landing.values.patientCare')}</li>
              <li>{t('landing.values.integrity')}</li>
              <li>{t('landing.values.innovation')}</li>
              <li>{t('landing.values.accessibility')}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features / Highlights */}
      <section className="features-section">
        <h2>{t('landing.features.title')}</h2>
        <div className="features-cards">
          <div className="feature-card">
            <img src="https://img.icons8.com/fluency/96/000000/video-call.png" alt="Teleconsultation" />
            <h3>{t('landing.features.teleconsultation.title')}</h3>
            <p>{t('landing.features.teleconsultation.description')}</p>
          </div>
          <div className="feature-card">
            <img src="https://img.icons8.com/fluency/96/000000/ai.png" alt="AI Symptom Checker" />
            <h3>{t('landing.features.aiSymptom.title')}</h3>
            <p>{t('landing.features.aiSymptom.description')}</p>
          </div>
          <div className="feature-card">
            <img src="https://img.icons8.com/fluency/96/000000/pills.png" alt="Medicine Tracking" />
            <h3>{t('landing.features.medicineTracking.title')}</h3>
            <p>{t('landing.features.medicineTracking.description')}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;