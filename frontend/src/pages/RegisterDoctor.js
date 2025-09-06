import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../utils/api";
import "./RegisterDoctor.css"; // Add styling

function RegisterDoctor() {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    contact: "",
    email: "",
    address: "",
    qualification: "",
    specialization: "",
    experience: "",
    designation: "",
    hospital: "",
    regNumber: "",
    regAuthority: "",
    regYear: "",
    licenseFile: null,
    workingDays: [],
    workingHours: "",
    onCall: "No",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCheckbox = (day) => {
    const updatedDays = formData.workingDays.includes(day)
      ? formData.workingDays.filter((d) => d !== day)
      : [...formData.workingDays, day];
    setFormData({ ...formData, workingDays: updatedDays });
  };

  const handleRegister = async () => {
    try {
      await registerUser("doctor", formData);
      navigate("/login/doctor");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="doctor-register-container">
      <div className="register-card">
        <h2>🧑‍⚕️ Doctor Registration</h2>

        {/* Personal Info */}
        <h3>Personal Information</h3>
        <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />
        <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        <input name="contact" placeholder="Contact Number" value={formData.contact} onChange={handleChange} />
        <input name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} />
        <textarea name="address" placeholder="Permanent Address" value={formData.address} onChange={handleChange} />
        <input type="file" name="photo" accept="image/*" onChange={handleChange} />

        {/* Professional Info */}
        <h3>🎓 Professional Information</h3>
        <input name="qualification" placeholder="Qualification (MBBS, MD...)" value={formData.qualification} onChange={handleChange} />
        <input name="specialization" placeholder="Specialization" value={formData.specialization} onChange={handleChange} />
        <input type="number" name="experience" placeholder="Years of Experience" value={formData.experience} onChange={handleChange} />
        <input name="designation" placeholder="Current Designation" value={formData.designation} onChange={handleChange} />
        <input name="hospital" placeholder="Hospital/Clinic Affiliation" value={formData.hospital} onChange={handleChange} />

        {/* Registration */}
        <h3>🏥 Registration & Verification</h3>
        <input name="regNumber" placeholder="Medical Council Registration Number" value={formData.regNumber} onChange={handleChange} />
        <input name="regAuthority" placeholder="Issuing Authority" value={formData.regAuthority} onChange={handleChange} />
        <input type="number" name="regYear" placeholder="Year of Registration" value={formData.regYear} onChange={handleChange} />
        <input type="file" name="licenseFile" accept=".pdf,.jpg,.png" onChange={handleChange} />

        {/* Availability */}
        <h3>⏰ Availability</h3>
        <div className="days-checkbox">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <label key={day}>
              <input type="checkbox" checked={formData.workingDays.includes(day)} onChange={() => handleCheckbox(day)} />
              {day}
            </label>
          ))}
        </div>
        <input name="workingHours" placeholder="Working Hours (e.g. 10 AM - 6 PM)" value={formData.workingHours} onChange={handleChange} />
        <select name="onCall" value={formData.onCall} onChange={handleChange}>
          <option value="No">On-call Availability: No</option>
          <option value="Yes">On-call Availability: Yes</option>
        </select>

        {/* Security */}
        <h3>🔒 Account Security</h3>
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />

        <button className="btn-primary" onClick={handleRegister}>Register</button>
      </div>
    </div>
  );
}

export default RegisterDoctor;
