import React from 'react';
import useStats from './useStats';

function StatCard({ label, value, color }) {
  return (
    <div style={{
      background: color,
      color: '#fff',
      borderRadius: 12,
      padding: 24,
      minWidth: 180,
      marginRight: 24,
      boxShadow: '0 2px 12px #1976d233',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      transition: 'background 0.3s',
    }}>
      <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: 1 }}>{value}</div>
      <div style={{ fontSize: 17, marginTop: 8, fontWeight: 500 }}>{label}</div>
    </div>
  );
}

function Dashboard() {
  const stats = useStats();
  const statList = [
    { label: 'Total Claims', value: stats.totalClaims, color: '#1976d2' },
    { label: 'Pending Denials (not resubmitted)', value: stats.pendingDenials, color: '#d32f2f' },
    { label: 'Remittances', value: stats.remittances, color: '#388e3c' },
    { label: 'Reconciled', value: stats.reconciled, color: '#fbc02d' },
    { label: 'Resubmitted Claims', value: stats.resubmissions, color: '#7b1fa2' },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: 32, fontWeight: 800, color: '#1976d2', letterSpacing: 1 }}>Dashboard Analytics</h1>
      <div style={{ display: 'flex', marginBottom: 32 }}>
        {statList.map(stat => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
      <div style={{ background: '#fff', borderRadius: 16, padding: 36, boxShadow: '0 2px 12px #1976d233' }}>
        <h2 style={{ marginBottom: 16, color: '#1976d2', fontWeight: 700 }}>Welcome to your AI-Native RCM Platform</h2>
        <p style={{ fontSize: 18, color: '#555', lineHeight: 1.7 }}>
          Use the sidebar to navigate through the RCM workflow. Each step is powered by AI for automation and insights.<br />
          Dashboard stats update in real-time every 5 seconds.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
