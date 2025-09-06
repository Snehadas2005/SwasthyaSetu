import { useNavigate, Link } from "react-router-dom";
import { User, Stethoscope, Shield } from "lucide-react"; // role icons
import "./RegisterPage.css";

function RegisterPage() {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    switch (role) {
      case "patient":
        navigate("/register/patient");
        break;
      case "doctor":
        navigate("/register/doctor");
        break;
      case "authority":
        navigate("/register/authority");
        break;
      default:
        break;
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-title">Create Your Account</h1>
        <p className="register-subtitle">Choose your role to continue</p>

        <div className="role-options">
          <button
            className="role-btn"
            onClick={() => handleRoleSelect("patient")}
          >
            <User size={24} className="role-icon" />
            <span>Register as Patient</span>
          </button>

          <button
            className="role-btn"
            onClick={() => handleRoleSelect("doctor")}
          >
            <Stethoscope size={24} className="role-icon" />
            <span>Register as Doctor</span>
          </button>

          <button
            className="role-btn"
            onClick={() => handleRoleSelect("authority")}
          >
            <Shield size={24} className="role-icon" />
            <span>Register as Authority</span>
          </button>
        </div>

        <p className="login-text">
          Already have an account?{" "}
          <Link to="/login" className="login-link">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
