import { Link } from "react-router-dom";

function Landing() {
  return (
    <div>
      <h1>Welcome to Rural Healthcare Telemedicine</h1>
      <p>AI-driven teleconsultation & medicine tracking for rural areas</p>
      <Link to="/home">
        <button>Go to Home</button>
      </Link>
    </div>
  );
}

export default Landing;
