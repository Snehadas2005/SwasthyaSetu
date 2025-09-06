import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";

// Pages
import Home from "./pages/Home";
import LoginPatient from "./pages/LoginPatient";
import LoginDoctor from "./pages/LoginDoctor";
import LoginAuthority from "./pages/LoginAuthority";

import RegisterPatient from "./pages/RegisterPatient";
import RegisterDoctor from "./pages/RegisterDoctor";
import RegisterAuthority from "./pages/RegisterAuthority";

// Dashboards
import PatientDashboard from "./components/PatientDashboard";
import DoctorDashboard from "./components/DoctorDashboard";
import AuthorityDashboard from "./components/AuthorityDashboard";
import PharmacyView from "./components/PharmacyView";

function App() {
  return (
    <Router>
      <div className="App">
        {/* Header */}
        <header className="App-header">
          <h1>TeleHealth Rural</h1>
          <nav style={{ marginTop: "10px" }}>
            <Link
              to="/"
              style={{ margin: "0 10px", color: "#2e7d32", textDecoration: "none" }}
            >
              Home
            </Link>
            <Link
              to="/login/patient"
              style={{ margin: "0 10px", color: "#2e7d32", textDecoration: "none" }}
            >
              Patient Login
            </Link>
            <Link
              to="/login/doctor"
              style={{ margin: "0 10px", color: "#2e7d32", textDecoration: "none" }}
            >
              Doctor Login
            </Link>
            <Link
              to="/login/authority"
              style={{ margin: "0 10px", color: "#2e7d32", textDecoration: "none" }}
            >
              Authority Login
            </Link>
          </nav>
        </header>

        {/* Routes */}
        <main style={{ padding: "20px" }}>
          <Routes>
            {/* Landing */}
            <Route path="/" element={<Home />} />

            {/* Logins */}
            <Route path="/login/patient" element={<LoginPatient />} />
            <Route path="/login/doctor" element={<LoginDoctor />} />
            <Route path="/login/authority" element={<LoginAuthority />} />

            {/* Registrations */}
            <Route path="/register/patient" element={<RegisterPatient />} />
            <Route path="/register/doctor" element={<RegisterDoctor />} />
            <Route path="/register/authority" element={<RegisterAuthority />} />

            {/* Dashboards */}
            <Route path="/patient-dashboard" element={<PatientDashboard />} />
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/authority-dashboard" element={<AuthorityDashboard />} />
            <Route path="/pharmacy-dashboard" element={<PharmacyView />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
