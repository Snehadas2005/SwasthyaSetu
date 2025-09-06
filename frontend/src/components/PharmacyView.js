import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { updateStock } from "../utils/api";

function PharmacyView() {
  // Dummy data
  const [medicines, setMedicines] = useState([
    { id: 1, name: "Paracetamol", stock: 20 },
    { id: 2, name: "Vitamin D", stock: 5 },
    { id: 3, name: "Cough Syrup", stock: 2 },
    { id: 4, name: "Antibiotic", stock: 8 },
  ]);

  const handleStockChange = (id, value) => {
    setMedicines((prev) =>
      prev.map((med) => (med.id === id ? { ...med, stock: Number(value) } : med))
    );
  };

  const saveStock = async (id, stock) => {
    try {
      await updateStock(id, stock);
      alert("Stock updated successfully");
    } catch (err) {
      alert("Failed to update stock");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Welcome, Pharmacy Owner!</h1>

      {/* Medicine Stock Table */}
      <div style={{ margin: "20px 0" }}>
        <h3>Medicine Stock</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ccc", padding: "8px" }}>Medicine</th>
              <th style={{ borderBottom: "1px solid #ccc", padding: "8px" }}>Stock</th>
              <th style={{ borderBottom: "1px solid #ccc", padding: "8px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((med) => (
              <tr key={med.id}>
                <td style={{ padding: "8px" }}>{med.name}</td>
                <td style={{ padding: "8px" }}>
                  <input
                    type="number"
                    value={med.stock}
                    min="0"
                    style={{ width: "60px" }}
                    onChange={(e) => handleStockChange(med.id, e.target.value)}
                  />
                </td>
                <td style={{ padding: "8px" }}>
                  <button onClick={() => saveStock(med.id, med.stock)}>Save</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Low Stock Alert */}
      <div style={{ margin: "20px 0" }}>
        <h3>Low Stock Medicines</h3>
        <ul>
          {medicines.filter((m) => m.stock < 5).map((med) => (
            <li key={med.id}>
              {med.name} - only {med.stock} left!
            </li>
          ))}
        </ul>
      </div>

      {/* Medicine Stock Chart */}
      <div style={{ margin: "20px 0" }}>
        <h3>Medicine Stock Levels</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={medicines}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="stock" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Orders / Prescriptions (dummy) */}
      <div style={{ margin: "20px 0" }}>
        <h3>Recent Orders / Prescriptions</h3>
        <ul>
          <li>Raj Kumar - Paracetamol x2</li>
          <li>Sita Sharma - Vitamin D x1</li>
          <li>Anil Verma - Cough Syrup x1</li>
        </ul>
      </div>
    </div>
  );
}

export default PharmacyView;
