import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useStats() {
  const [stats, setStats] = useState({
  eligibility: 0,
  denial: 0,
  remittance: 0,
  resubmission: 0,
  reconciliation: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
  // Fetch from backend dashboard-stats endpoint
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const res = await axios.get(`${backendUrl}/dashboard-stats`);
  setStats(res.data);
      } catch {
        // fallback demo data (only for UI demo, not real claims)
        setStats({
          eligibility: 0, // No hardcoded claims, show 0 if backend fails
          denial: 0,
          remittance: 0,
          resubmission: 0,
          reconciliation: 0,
        });
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 5000); // update every 5s
    return () => clearInterval(interval);
  }, []);

  return {
    totalClaims: stats.eligibility,
    pendingDenials: stats.denial,
    remittances: stats.remittance,
    reconciled: stats.reconciliation,
    resubmissions: stats.resubmission,
  };
}
