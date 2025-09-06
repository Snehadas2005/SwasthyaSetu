import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../utils/api";

function RegisterAuthority() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await registerUser("authority", { name, email, password, department });
      navigate("/login/authority");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div>
      <h2>Authority Registration</h2>
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <input placeholder="Department" value={department} onChange={e => setDepartment(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default RegisterAuthority;
