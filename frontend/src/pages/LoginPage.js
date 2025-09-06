import { useNavigate, Link } from "react-router-dom";
import "./LoginPage.css"; // We'll style it here

function LoginPage() {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    switch (role) {
      case "patient":
        navigate("/login/patient");
        break;
      case "doctor":
        navigate("/login/doctor");
        break;
      case "authority":
        navigate("/login/authority");
        break;
      default:
        break;
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Welcome to TeleHealth Rural</h1>
        <p className="login-subtitle">Login as your role</p>

        <div className="role-buttons">
          <button onClick={() => handleRoleSelect("patient")} className="btn-primary">
            Patient
          </button>
          <button onClick={() => handleRoleSelect("doctor")} className="btn-primary">
            Doctor
          </button>
          <button onClick={() => handleRoleSelect("authority")} className="btn-primary">
            Authority
          </button>
        </div>

        <p className="register-text">
          New here?{" "}
          <Link to="/register" className="register-link">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
