import React from "react";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to MediHealth</h1>

      <div className="home-grid">
        <div className="home-card login-card">
          <h2>Login</h2>
          <p>Access your account securely.</p>
        </div>

        <div className="home-card register-card">
          <h2>Register</h2>
          <p>Create a new account in seconds.</p>
        </div>

        <div className="home-card symptom-card">
          <h2>Symptom Checker</h2>
          <p>Check your symptoms easily.</p>
        </div>

        <div className="home-card chatbot-card">
          <h2>Chatbot</h2>
          <p>Get instant medical assistance.</p>
        </div>

        <div className="home-card content-card">
          <h2>Content</h2>
          <p>Read health articles and tips.</p>
        </div>

      </div>
    </div>
  );
};

export default Home;
