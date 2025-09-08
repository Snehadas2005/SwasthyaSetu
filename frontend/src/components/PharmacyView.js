import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

function PharmacyView() {
  const [medicines, setMedicines] = useState([
    { id: 1, name: "Paracetamol", stock: 20, threshold: 10 },
    { id: 2, name: "Vitamin D", stock: 5, threshold: 15 },
    { id: 3, name: "Cough Syrup", stock: 2, threshold: 8 },
    { id: 4, name: "Antibiotic", stock: 8, threshold: 12 },
    { id: 5, name: "Aspirin", stock: 25, threshold: 10 },
    { id: 6, name: "Insulin", stock: 3, threshold: 5 }
  ]);

  const [orders] = useState([
    { id: 1, patient: "Raj Kumar", medicine: "Paracetamol", qty: 2, status: "Ready", time: "2 hours ago" },
    { id: 2, patient: "Sita Sharma", medicine: "Vitamin D", qty: 1, status: "Pending", time: "30 mins ago" },
    { id: 3, patient: "Anil Verma", medicine: "Cough Syrup", qty: 1, status: "Delivered", time: "1 hour ago" },
    { id: 4, patient: "Priya Singh", medicine: "Antibiotic", qty: 3, status: "Ready", time: "45 mins ago" }
  ]);

  const handleStockChange = (id, value) => {
    setMedicines((prev) =>
      prev.map((med) => (med.id === id ? { ...med, stock: Number(value) } : med))
    );
  };

  const saveStock = async (id, stock) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      alert("Stock updated successfully");
    } catch (err) {
      alert("Failed to update stock");
    }
  };

  const lowStockMedicines = medicines.filter(m => m.stock < m.threshold);
  const totalOrders = orders.length;
  const pendingDeliveries = orders.filter(o => o.status === "Pending").length;
  const readyOrders = orders.filter(o => o.status === "Ready").length;

  const statusData = [
    { name: 'Ready', value: readyOrders, color: '#22c55e' },
    { name: 'Pending', value: pendingDeliveries, color: '#f59e0b' },
    { name: 'Delivered', value: orders.filter(o => o.status === "Delivered").length, color: '#3b82f6' }
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>SwasthyaSetu – Pharmacy Panel</h1>
          <p style={styles.subtitle}>Telemedicine Access for Rural Healthcare</p>
        </div>
        <div style={styles.logo}>
          <img 
                  src="/logo.png"      // Path to your logo image
                  alt="SwasthyaSetu Logo"
                  style={{ width: '56px', height: '56px', borderRadius: '16px', objectFit: 'cover' }}
          />
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={{...styles.statCard, ...styles.statCard1}}>
          <div style={styles.statIcon}>📦</div>
          <div style={styles.statContent}>
            <h3 style={styles.statNumber}>{totalOrders}</h3>
            <p style={styles.statLabel}>Orders Today</p>
          </div>
        </div>
        <div style={{...styles.statCard, ...styles.statCard2}}>
          <div style={styles.statIcon}>🚚</div>
          <div style={styles.statContent}>
            <h3 style={styles.statNumber}>{pendingDeliveries}</h3>
            <p style={styles.statLabel}>Pending Deliveries</p>
          </div>
        </div>
        <div style={{...styles.statCard, ...styles.statCard3}}>
          <div style={styles.statIcon}>⚠️</div>
          <div style={styles.statContent}>
            <h3 style={styles.statNumber}>{lowStockMedicines.length}</h3>
            <p style={styles.statLabel}>Low Stock Items</p>
          </div>
        </div>
        <div style={{...styles.statCard, ...styles.statCard4}}>
          <div style={styles.statIcon}>🔄</div>
          <div style={styles.statContent}>
            <h3 style={styles.statNumber}>{readyOrders}</h3>
            <p style={styles.statLabel}>Ready for Pickup</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={styles.mainGrid}>
        
        {/* Prescription Orders */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>📋 Prescription Orders</h3>
          </div>
          <div style={styles.ordersContainer}>
            {orders.map((order) => (
              <div key={order.id} style={styles.orderItem}>
                <div style={styles.orderInfo}>
                  <h4 style={styles.patientName}>{order.patient}</h4>
                  <p style={styles.medicineInfo}>{order.medicine} × {order.qty}</p>
                  <span style={styles.orderTime}>{order.time}</span>
                </div>
                <div style={{
                  ...styles.statusBadge,
                  ...(order.status === 'Ready' ? styles.statusReady :
                      order.status === 'Pending' ? styles.statusPending : 
                      styles.statusDelivered)
                }}>
                  {order.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Management */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>📦 Inventory Management</h3>
          </div>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.tableHeader}>Medicine</th>
                  <th style={styles.tableHeader}>Stock</th>
                  <th style={styles.tableHeader}>Threshold</th>
                  <th style={styles.tableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((med) => (
                  <tr key={med.id} style={styles.tableRow}>
                    <td style={styles.tableCell}>
                      <span style={med.stock < med.threshold ? styles.lowStockText : {}}>
                        {med.name}
                      </span>
                    </td>
                    <td style={styles.tableCell}>
                      <input
                        type="number"
                        value={med.stock}
                        min="0"
                        onChange={(e) => handleStockChange(med.id, e.target.value)}
                        style={styles.stockInput}
                      />
                    </td>
                    <td style={styles.tableCell}>{med.threshold}</td>
                    <td style={styles.tableCell}>
                      <button 
                        onClick={() => saveStock(med.id, med.stock)}
                        style={styles.saveButton}
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>🚨 Low Stock Alert</h3>
          </div>
          <div style={styles.alertContainer}>
            {lowStockMedicines.length > 0 ? (
              lowStockMedicines.map((med) => (
                <div key={med.id} style={styles.alertItem}>
                  <div style={styles.alertIcon}>⚠️</div>
                  <div style={styles.alertContent}>
                    <strong>{med.name}</strong>
                    <p>Only {med.stock} left! (Threshold: {med.threshold})</p>
                  </div>
                </div>
              ))
            ) : (
              <div style={styles.noAlert}>
                <div style={styles.successIcon}>✅</div>
                <p>All medicines are adequately stocked!</p>
              </div>
            )}
          </div>
        </div>

        {/* Charts Section */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>📊 Stock Levels</h3>
          </div>
          <div style={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={medicines}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: 'white'
                  }} 
                />
                <Bar 
                  dataKey="stock" 
                  fill="#22c55e" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Pie Chart */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>📈 Order Status</h3>
          </div>
          <div style={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  header: {
    background: 'linear-gradient(135deg, #0f766e 0%, #22c55e 100%)',
    color: 'white',
    padding: '2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: '2rem',
    fontWeight: '800',
    margin: '0 0 0.5rem 0',
  },
  subtitle: {
    fontSize: '1rem',
    opacity: 0.9,
    margin: 0,
  },
  logo: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    padding: '2rem',
    margin: '-1rem 0 0 0',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  statCard1: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    color: 'white',
  },
  statCard2: {
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    color: 'white',
  },
  statCard3: {
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: 'white',
  },
  statCard4: {
    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    color: 'white',
  },
  statIcon: {
    fontSize: '2.5rem',
    opacity: 0.9,
  },
  statContent: {
    flex: 1,
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: '700',
    margin: '0 0 0.25rem 0',
  },
  statLabel: {
    fontSize: '0.9rem',
    margin: 0,
    opacity: 0.9,
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '1.5rem',
    padding: '0 2rem 2rem 2rem',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
  },
  cardHeader: {
    padding: '1.5rem 1.5rem 1rem 1.5rem',
    borderBottom: '1px solid #f3f4f6',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    margin: 0,
    color: '#1f2937',
  },
  ordersContainer: {
    padding: '1rem',
    maxHeight: '400px',
    overflowY: 'auto',
  },
  orderItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    marginBottom: '0.75rem',
    transition: 'all 0.2s ease',
  },
  orderInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: '1rem',
    fontWeight: '600',
    margin: '0 0 0.25rem 0',
    color: '#1f2937',
  },
  medicineInfo: {
    fontSize: '0.9rem',
    color: '#6b7280',
    margin: '0 0 0.25rem 0',
  },
  orderTime: {
    fontSize: '0.8rem',
    color: '#9ca3af',
  },
  statusBadge: {
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
    textAlign: 'center',
  },
  statusReady: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  statusPending: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
  statusDelivered: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
  },
  tableContainer: {
    padding: '1rem',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeaderRow: {
    backgroundColor: '#f8fafc',
  },
  tableHeader: {
    padding: '0.75rem',
    textAlign: 'left',
    fontWeight: '600',
    color: '#374151',
    borderBottom: '1px solid #e5e7eb',
  },
  tableRow: {
    borderBottom: '1px solid #f3f4f6',
    transition: 'background-color 0.2s ease',
  },
  tableCell: {
    padding: '0.75rem',
    color: '#4b5563',
  },
  lowStockText: {
    color: '#dc2626',
    fontWeight: '600',
  },
  stockInput: {
    width: '70px',
    padding: '0.5rem',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '0.9rem',
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#22c55e',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  alertContainer: {
    padding: '1rem',
  },
  alertItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#fef2f2',
    borderRadius: '12px',
    marginBottom: '0.75rem',
    border: '1px solid #fecaca',
  },
  alertIcon: {
    fontSize: '1.5rem',
  },
  alertContent: {
    flex: 1,
  },
  noAlert: {
    textAlign: 'center',
    padding: '2rem',
    color: '#22c55e',
  },
  successIcon: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
  },
  chartContainer: {
    padding: '1rem',
  },
};

export default PharmacyView;