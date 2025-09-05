import { useState } from "react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function PatientDashboard() {
  // Dummy data
  const [appointments] = useState([
    { id: 1, doctor: "Dr. Singh", date: "2025-09-10", status: "Upcoming" },
    { id: 2, doctor: "Dr. Sharma", date: "2025-08-25", status: "Completed" },
  ]);

  const [medicines] = useState([
    { name: "Paracetamol", stock: 10 },
    { name: "Vitamin D", stock: 5 },
    { name: "Cough Syrup", stock: 2 },
  ]);

  const symptomData = [
    { symptom: "Fever", frequency: 5 },
    { symptom: "Cough", frequency: 3 },
    { symptom: "Headache", frequency: 4 },
  ];

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Welcome, Patient!</h1>

      {/* Book Teleconsultation */}
      <div style={{ margin: "20px 0" }}>
        <Link to="/book-appointment">
          <button style={{ padding: "10px 20px", fontSize: "16px" }}>
            Book Teleconsultation
          </button>
        </Link>
      </div>

      {/* AI Symptom Checker */}
      <div style={{ margin: "20px 0", border: "1px solid #ccc", padding: "15px", borderRadius: "8px" }}>
        <h3>AI Symptom Checker</h3>
        <input type="text" placeholder="Describe your symptoms..." style={{ width: "70%", padding: "8px" }} />
        <button style={{ padding: "8px 12px", marginLeft: "10px" }}>Check</button>
      </div>

      {/* Medicine Stock Overview */}
      <div style={{ margin: "20px 0" }}>
        <h3>Medicine Stock</h3>
        <ul>
          {medicines.map((med) => (
            <li key={med.name}>
              {med.name} - {med.stock} available
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Appointments */}
      <div style={{ margin: "20px 0" }}>
        <h3>Recent Appointments</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ccc", padding: "8px" }}>Doctor</th>
              <th style={{ borderBottom: "1px solid #ccc", padding: "8px" }}>Date</th>
              <th style={{ borderBottom: "1px solid #ccc", padding: "8px" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt.id}>
                <td style={{ padding: "8px" }}>{appt.doctor}</td>
                <td style={{ padding: "8px" }}>{appt.date}</td>
                <td style={{ padding: "8px" }}>{appt.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Symptom Frequency Chart */}
      <div style={{ margin: "20px 0" }}>
        <h3>Common Symptoms Overview</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={symptomData}>
            <XAxis dataKey="symptom" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="frequency" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PatientDashboard;
