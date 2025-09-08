import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

function AuthorityDashboard() {
  const [doctorAllocation] = useState([
    { doctor: "Dr. Singh", patients: 12, status: "Online" },
    { doctor: "Dr. Sharma", patients: 8, status: "Online" },
    { doctor: "Dr. Verma", patients: 15, status: "Offline" },
    { doctor: "Dr. Patel", patients: 6, status: "Online" },
    { doctor: "Dr. Kumar", patients: 10, status: "Online" },
  ]);

  const [patientLoad] = useState([
    { day: "Mon", count: 30 },
    { day: "Tue", count: 25 },
    { day: "Wed", count: 40 },
    { day: "Thu", count: 35 },
    { day: "Fri", count: 50 },
    { day: "Sat", count: 28 },
    { day: "Sun", count: 22 },
  ]);

  const [medicineStock] = useState([
    { name: "Paracetamol", stock: 20, threshold: 15, status: "OK" },
    { name: "Vitamin D", stock: 15, threshold: 20, status: "OK" },
    { name: "Cough Syrup", stock: 5, threshold: 12, status: "Low" },
    { name: "Antibiotic", stock: 8, threshold: 15, status: "Low" },
    { name: "Insulin", stock: 3, threshold: 10, status: "Critical" },
    { name: "Aspirin", stock: 25, threshold: 15, status: "OK" },
  ]);

  const [diseaseTrends] = useState([
    { disease: "Fever", cases: 45, percentage: 35 },
    { disease: "Cough/Cold", cases: 32, percentage: 25 },
    { disease: "Diabetes", cases: 28, percentage: 22 },
    { disease: "Hypertension", cases: 23, percentage: 18 },
  ]);

  const [emergencyCases] = useState([
    { id: 1, patient: "Ramesh Kumar", location: "Village A", condition: "Chest Pain", time: "10 mins ago", priority: "High" },
    { id: 2, patient: "Sita Devi", location: "Village B", condition: "Breathing Issues", time: "25 mins ago", priority: "Critical" },
    { id: 3, patient: "Anil Sharma", location: "Village C", condition: "High Fever", time: "45 mins ago", priority: "Medium" },
  ]);

  const totalDoctors = doctorAllocation.length;
  const onlineDoctors = doctorAllocation.filter(d => d.status === "Online").length;
  const totalPatientsToday = patientLoad.reduce((sum, d) => sum + d.count, 0);
  const lowStockMedicines = medicineStock.filter(m => m.status === "Low" || m.status === "Critical").length;
  const emergencyCount = emergencyCases.length;

  const diseaseData = diseaseTrends.map(d => ({
    name: d.disease,
    value: d.cases,
    color: d.disease === "Fever" ? "#ef4444" : 
           d.disease === "Cough/Cold" ? "#f59e0b" :
           d.disease === "Diabetes" ? "#3b82f6" : "#8b5cf6"
  }));

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>SwasthyaSetu – Health Authority Panel</h1>
          <p style={styles.subtitle}>Rural Healthcare Monitoring & Management</p>
        </div>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>🏥</div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={{...styles.statCard, ...styles.statCard1}}>
          <div style={styles.statIcon}>👩‍⚕️</div>
          <div style={styles.statContent}>
            <h3 style={styles.statNumber}>{onlineDoctors}/{totalDoctors}</h3>
            <p style={styles.statLabel}>Doctors Online</p>
          </div>
        </div>
        <div style={{...styles.statCard, ...styles.statCard2}}>
          <div style={styles.statIcon}>🧑‍🤝‍🧑</div>
          <div style={styles.statContent}>
            <h3 style={styles.statNumber}>{totalPatientsToday}</h3>
            <p style={styles.statLabel}>Patients Served Today</p>
          </div>
        </div>
        <div style={{...styles.statCard, ...styles.statCard3}}>
          <div style={styles.statIcon}>💊</div>
          <div style={styles.statContent}>
            <h3 style={styles.statNumber}>{lowStockMedicines}</h3>
            <p style={styles.statLabel}>Medicines Low in Stock</p>
          </div>
        </div>
        <div style={{...styles.statCard, ...styles.statCard4}}>
          <div style={styles.statIcon}>🚨</div>
          <div style={styles.statContent}>
            <h3 style={styles.statNumber}>{emergencyCount}</h3>
            <p style={styles.statLabel}>Emergency Cases Flagged</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={styles.mainGrid}>
        
        {/* Disease Trends */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>📊 Disease Trends</h3>
            <span style={styles.cardSubtitle}>Top reported conditions this week</span>
          </div>
          <div style={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={diseaseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {diseaseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={styles.trendsList}>
            {diseaseTrends.map((trend, index) => (
              <div key={index} style={styles.trendItem}>
                <div style={styles.trendInfo}>
                  <span style={styles.trendName}>{trend.disease}</span>
                  <span style={styles.trendCases}>{trend.cases} cases</span>
                </div>
                <div style={styles.trendPercentage}>{trend.percentage}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Doctor Availability */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>👨‍⚕️ Doctor Availability</h3>
            <span style={styles.cardSubtitle}>Current online status & patient load</span>
          </div>
          <div style={styles.doctorContainer}>
            {doctorAllocation.map((doctor, index) => (
              <div key={index} style={styles.doctorItem}>
                <div style={styles.doctorInfo}>
                  <div style={styles.doctorAvatar}>
                    {doctor.doctor.charAt(3)}
                  </div>
                  <div style={styles.doctorDetails}>
                    <h4 style={styles.doctorName}>{doctor.doctor}</h4>
                    <p style={styles.patientCount}>{doctor.patients} patients today</p>
                  </div>
                </div>
                <div style={{
                  ...styles.statusBadge,
                  ...(doctor.status === 'Online' ? styles.statusOnline : styles.statusOffline)
                }}>
                  {doctor.status === 'Online' ? '✅' : '❌'} {doctor.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Medicine Monitoring */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>💊 Medicine Monitoring</h3>
            <span style={styles.cardSubtitle}>Stock levels across all pharmacies</span>
          </div>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.tableHeader}>Medicine</th>
                  <th style={styles.tableHeader}>Stock</th>
                  <th style={styles.tableHeader}>Threshold</th>
                  <th style={styles.tableHeader}>Status</th>
                </tr>
              </thead>
              <tbody>
                {medicineStock.map((med, index) => (
                  <tr key={index} style={styles.tableRow}>
                    <td style={styles.tableCell}>{med.name}</td>
                    <td style={styles.tableCell}>{med.stock}</td>
                    <td style={styles.tableCell}>{med.threshold}</td>
                    <td style={styles.tableCell}>
                      <span style={{
                        ...styles.stockStatusBadge,
                        ...(med.status === 'OK' ? styles.stockOK :
                            med.status === 'Low' ? styles.stockLow : styles.stockCritical)
                      }}>
                        {med.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Patient Load Chart */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>📈 Patient Load Over Week</h3>
            <span style={styles.cardSubtitle}>Daily consultation trends</span>
          </div>
          <div style={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={patientLoad}>
                <XAxis dataKey="day" />
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
                  dataKey="count" 
                  fill="#22c55e" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Emergency Cases */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>🚨 Emergency Cases</h3>
            <span style={styles.cardSubtitle}>Flagged cases requiring immediate attention</span>
          </div>
          <div style={styles.emergencyContainer}>
            {emergencyCases.map((emergency) => (
              <div key={emergency.id} style={styles.emergencyItem}>
                <div style={styles.emergencyInfo}>
                  <h4 style={styles.emergencyPatient}>{emergency.patient}</h4>
                  <p style={styles.emergencyCondition}>{emergency.condition}</p>
                  <div style={styles.emergencyMeta}>
                    <span style={styles.emergencyLocation}>📍 {emergency.location}</span>
                    <span style={styles.emergencyTime}>🕐 {emergency.time}</span>
                  </div>
                </div>
                <div style={{
                  ...styles.priorityBadge,
                  ...(emergency.priority === 'Critical' ? styles.priorityCritical :
                      emergency.priority === 'High' ? styles.priorityHigh : styles.priorityMedium)
                }}>
                  {emergency.priority}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reports & Actions */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>📋 Reports & Actions</h3>
            <span style={styles.cardSubtitle}>Generate reports and manage alerts</span>
          </div>
          <div style={styles.actionsContainer}>
            <button style={styles.actionButton}>
              📊 Download Weekly Report
            </button>
            <button style={styles.actionButton}>
              📈 Generate Analytics Report
            </button>
            <button style={styles.actionButton}>
              🚨 Send Stock Alerts
            </button>
            <button style={styles.actionButton}>
              📱 Notify Doctors
            </button>
          </div>
          
          <div style={styles.alertsSection}>
            <h4 style={styles.alertsTitle}>Recent Notifications</h4>
            <div style={styles.alertItem}>
              <span style={styles.alertIcon}>🔔</span>
              <span style={styles.alertText}>Village A reporting fever spike - 12 cases</span>
              <span style={styles.alertTime}>2h ago</span>
            </div>
            <div style={styles.alertItem}>
              <span style={styles.alertIcon}>⚠️</span>
              <span style={styles.alertText}>Insulin stock critically low across 3 pharmacies</span>
              <span style={styles.alertTime}>4h ago</span>
            </div>
            <div style={styles.alertItem}>
              <span style={styles.alertIcon}>✅</span>
              <span style={styles.alertText}>Dr. Verma back online after maintenance break</span>
              <span style={styles.alertTime}>6h ago</span>
            </div>
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
    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    fontSize: '2rem',
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
  },
  statCard1: {
    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    color: 'white',
  },
  statCard2: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    color: 'white',
  },
  statCard3: {
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    color: 'white',
  },
  statCard4: {
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
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
    margin: '0 0 0.25rem 0',
    color: '#1f2937',
  },
  cardSubtitle: {
    fontSize: '0.9rem',
    color: '#6b7280',
  },
  chartContainer: {
    padding: '1rem',
  },
  trendsList: {
    padding: '0 1rem 1rem 1rem',
  },
  trendItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    marginBottom: '0.5rem',
  },
  trendInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  trendName: {
    fontWeight: '600',
    color: '#1f2937',
  },
  trendCases: {
    fontSize: '0.8rem',
    color: '#6b7280',
  },
  trendPercentage: {
    fontWeight: '600',
    color: '#3b82f6',
  },
  doctorContainer: {
    padding: '1rem',
    maxHeight: '400px',
    overflowY: 'auto',
  },
  doctorItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    marginBottom: '0.75rem',
  },
  doctorInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  doctorAvatar: {
    width: '40px',
    height: '40px',
    backgroundColor: '#3b82f6',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: '1rem',
    fontWeight: '600',
    margin: '0 0 0.25rem 0',
    color: '#1f2937',
  },
  patientCount: {
    fontSize: '0.9rem',
    color: '#6b7280',
    margin: 0,
  },
  statusBadge: {
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
  },
  statusOnline: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  statusOffline: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
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
  },
  tableCell: {
    padding: '0.75rem',
    color: '#4b5563',
  },
  stockStatusBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  stockOK: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  stockLow: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
  stockCritical: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
  emergencyContainer: {
    padding: '1rem',
    maxHeight: '400px',
    overflowY: 'auto',
  },
  emergencyItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '1rem',
    backgroundColor: '#fef2f2',
    borderRadius: '12px',
    marginBottom: '0.75rem',
    border: '1px solid #fecaca',
  },
  emergencyInfo: {
    flex: 1,
  },
  emergencyPatient: {
    fontSize: '1rem',
    fontWeight: '600',
    margin: '0 0 0.25rem 0',
    color: '#1f2937',
  },
  emergencyCondition: {
    fontSize: '0.9rem',
    color: '#dc2626',
    margin: '0 0 0.5rem 0',
    fontWeight: '500',
  },
  emergencyMeta: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.8rem',
    color: '#6b7280',
  },
  emergencyLocation: {},
  emergencyTime: {},
  priorityBadge: {
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
    marginLeft: '1rem',
  },
  priorityCritical: {
    backgroundColor: '#fca5a5',
    color: '#991b1b',
  },
  priorityHigh: {
    backgroundColor: '#fed7aa',
    color: '#9a3412',
  },
  priorityMedium: {
    backgroundColor: '#fde68a',
    color: '#92400e',
  },
  actionsContainer: {
    padding: '1rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '0.75rem',
  },
  actionButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '1rem',
    borderRadius: '12px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  alertsSection: {
    padding: '0 1rem 1rem 1rem',
    borderTop: '1px solid #f3f4f6',
    marginTop: '1rem',
    paddingTop: '1rem',
  },
  alertsTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    margin: '0 0 1rem 0',
    color: '#1f2937',
  },
  alertItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    marginBottom: '0.5rem',
  },
  alertIcon: {
    fontSize: '1rem',
  },
  alertText: {
    flex: 1,
    fontSize: '0.9rem',
    color: '#374151',
  },
  alertTime: {
    fontSize: '0.8rem',
    color: '#9ca3af',
  },
};

export default AuthorityDashboard;