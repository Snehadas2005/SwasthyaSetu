import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../utils/api";

function RegisterDoctor() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [license, setLicense] = useState("");
  const [specialty, setSpecialty] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await registerUser("doctor", { name, email, password, license, specialty });
      navigate("/login/doctor");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div>
      <h2>Doctor Registration</h2>
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <input placeholder="License ID" value={license} onChange={e => setLicense(e.target.value)} />
      <input placeholder="Specialty" value={specialty} onChange={e => setSpecialty(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default RegisterDoctor;
