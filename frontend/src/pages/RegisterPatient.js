import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../utils/api";
import "./RegisterPatient.css"; // We'll style it separately

function RegisterPatient() {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    maritalStatus: "",
    photo: null,
    mobile: "",
    email: "",
    address: "",
    emergencyName: "",
    emergencyPhone: "",
    conditions: "",
    allergies: "",
    medications: "",
    surgeries: "",
    familyDoctor: "",
    govId: "",
    insuranceProvider: "",
    insuranceNumber: "",
    insuranceCard: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleRegister = async () => {
    try {
      await registerUser("patient", formData);
      navigate("/login/patient");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="patient-register-container">
      <div className="register-card">
        <h2>🧑‍⚕️ Patient Registration</h2>

        {/* Personal Information */}
        <h3>Personal Information</h3>
        <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />
        <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
          <option value="">Select Blood Group</option>
          <option>A+</option>
          <option>A-</option>
          <option>B+</option>
          <option>B-</option>
          <option>O+</option>
          <option>O-</option>
          <option>AB+</option>
          <option>AB-</option>
        </select>
        <input name="maritalStatus" placeholder="Marital Status (optional)" value={formData.maritalStatus} onChange={handleChange} />
        <label>Profile Photo (optional): <input type="file" name="photo" onChange={handleChange} /></label>

        {/* Contact Information */}
        <h3>📞 Contact Information</h3>
        <input name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleChange} />
        <input name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} />
        <textarea name="address" placeholder="Permanent Address" value={formData.address} onChange={handleChange}></textarea>
        <input name="emergencyName" placeholder="Emergency Contact Name" value={formData.emergencyName} onChange={handleChange} />
        <input name="emergencyPhone" placeholder="Emergency Contact Phone" value={formData.emergencyPhone} onChange={handleChange} />

        {/* Medical Information */}
        <h3>🏥 Medical Information</h3>
        <textarea name="conditions" placeholder="Existing Medical Conditions" value={formData.conditions} onChange={handleChange}></textarea>
        <textarea name="allergies" placeholder="Allergies (if any)" value={formData.allergies} onChange={handleChange}></textarea>
        <textarea name="medications" placeholder="Current Medications" value={formData.medications} onChange={handleChange}></textarea>
        <textarea name="surgeries" placeholder="Past Surgeries / Hospitalizations" value={formData.surgeries} onChange={handleChange}></textarea>
        <input name="familyDoctor" placeholder="Family Doctor / Reference" value={formData.familyDoctor} onChange={handleChange} />

        {/* ID & Insurance */}
        <h3>🪪 Identification & Insurance</h3>
        <input name="govId" placeholder="Aadhaar / National ID / Passport" value={formData.govId} onChange={handleChange} />
        <input name="insuranceProvider" placeholder="Health Insurance Provider" value={formData.insuranceProvider} onChange={handleChange} />
        <input name="insuranceNumber" placeholder="Insurance Policy Number" value={formData.insuranceNumber} onChange={handleChange} />
        <label>Upload Insurance Card: <input type="file" name="insuranceCard" onChange={handleChange} /></label>

        <button className="btn-primary" onClick={handleRegister}>Register</button>
      </div>
    </div>
  );
}

export default RegisterPatient;
