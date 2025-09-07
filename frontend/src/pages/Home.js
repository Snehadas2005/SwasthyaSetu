import React from "react";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">
        Welcome to <span>MediHealth</span>
      </h1>
      <p className="home-subtitle">
        Your trusted digital healthcare companion.
      </p>

      {/* First row */}
      <div className="home-grid three-cols">
        <div className="home-card login-card">
          <h2>Login</h2>
          <p>Access your account securely.</p>
        </div>

       
        <div className="home-card content-card">
          <h2>Content</h2>
          <p>Read health articles and tips.</p>
        </div>
      </div>

      {/* Second row */}
      <div className="home-grid two-cols">
        <div className="home-card symptom-card">
          <h2>Symptom Checker</h2>
          <p>Check your symptoms easily.</p>
        </div>

        <div className="home-card chatbot-card">
          <h2>Chatbot</h2>
          <p>Get instant medical assistance.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
