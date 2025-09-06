import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function AuthorityDashboard() {
  // Dummy Data
  const [doctorAllocation] = useState([
    { doctor: "Dr. Singh", patients: 12 },
    { doctor: "Dr. Sharma", patients: 8 },
    { doctor: "Dr. Verma", patients: 15 },
  ]);

  const [patientLoad] = useState([
    { day: "Mon", count: 30 },
    { day: "Tue", count: 25 },
    { day: "Wed", count: 40 },
    { day: "Thu", count: 35 },
    { day: "Fri", count: 50 },
  ]);

  const [medicineStock] = useState([
    { name: "Paracetamol", stock: 20 },
    { name: "Vitamin D", stock: 15 },
    { name: "Cough Syrup", stock: 5 },
    { name: "Antibiotic", stock: 8 },
  ]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Authority Dashboard</h1>

      {/* Doctor Allocation Chart */}
      <div style={{ margin: "20px 0" }}>
        <h3>Doctor Allocation (Patients per Doctor)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={doctorAllocation}>
            <XAxis dataKey="doctor" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="patients" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Patient Load Chart */}
      <div style={{ margin: "20px 0" }}>
        <h3>Patient Load Over the Week</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={patientLoad}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Medicine Stock Overview */}
      <div style={{ margin: "20px 0" }}>
        <h3>Medicine Stock</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ccc", padding: "8px" }}>Medicine</th>
              <th style={{ borderBottom: "1px solid #ccc", padding: "8px" }}>Stock</th>
            </tr>
          </thead>
          <tbody>
            {medicineStock.map((med) => (
              <tr key={med.name}>
                <td style={{ padding: "8px" }}>{med.name}</td>
                <td style={{ padding: "8px" }}>{med.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick Stats */}
      <div style={{ display: "flex", justifyContent: "space-around", margin: "20px 0" }}>
        <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px", width: "30%", textAlign: "center" }}>
          <h3>Total Doctors</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>{doctorAllocation.length}</p>
        </div>
        <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px", width: "30%", textAlign: "center" }}>
          <h3>Total Patients Today</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>{patientLoad.reduce((sum, d) => sum + d.count, 0)}</p>
        </div>
        <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px", width: "30%", textAlign: "center" }}>
          <h3>Medicines Low in Stock</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>
            {medicineStock.filter(m => m.stock < 10).length}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthorityDashboard;
