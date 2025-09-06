import "./AboutPage.css";

function AboutPage() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <h1>About TeleHealth Rural</h1>
        <p>AI-powered teleconsultation & healthcare services for rural areas</p>
      </div>

      <div className="about-sections">
        <div className="about-card">
          <h2>Our Mission</h2>
          <p>
            To provide accessible healthcare solutions to rural communities,
            leveraging technology for teleconsultation, symptom tracking, and
            medical guidance.
          </p>
        </div>

        <div className="about-card">
          <h2>Our Vision</h2>
          <p>
            To ensure that every person, regardless of location, can access
            quality healthcare information and services conveniently and safely.
          </p>
        </div>

        <div className="about-card">
          <h2>Our Values</h2>
          <ul>
            <li>Patient-Centric Care</li>
            <li>Integrity & Transparency</li>
            <li>Innovation & Technology</li>
            <li>Accessibility & Inclusion</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
