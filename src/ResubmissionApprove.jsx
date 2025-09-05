import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ResubmissionApprove() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        // Fetch all resubmissions with status 'Pending'
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const res = await axios.get(`${backendUrl}/resubmission/pending`);
        setClaims(res.data);
      } catch (err) {
        setError('Failed to fetch claims for approval.');
      }
      setLoading(false);
    };
    fetchClaims();
  }, []);

  const handleApprove = async (claim_id) => {
    try {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  await axios.post(`${backendUrl}/resubmission/approve`, null, { params: { claim_id } });
      setClaims(claims.filter(c => c.claim_id !== claim_id));
    } catch {
      setError('Failed to approve claim.');
    }
  };

  const handleReject = async (claim_id) => {
    try {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  await axios.post(`${backendUrl}/resubmission/reject`, null, { params: { claim_id } });
      setClaims(claims.filter(c => c.claim_id !== claim_id));
    } catch {
      setError('Failed to reject claim.');
    }
  };

  if (loading) return <div>Loading claims for approval...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h2 style={{ color: '#1976d2', fontWeight: 700, marginBottom: 24 }}>Resubmission Approval</h2>
      {claims.length === 0 ? (
        <div>No claims pending approval.</div>
      ) : (
        <table style={{ width: '100%', background: '#fff', borderRadius: 8, boxShadow: '0 2px 12px #1976d233', marginBottom: 24 }}>
          <thead>
            <tr>
              <th>Claim ID</th>
              <th>Reason for Denial</th>
              <th>Resubmission Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {claims.map(claim => (
              <tr key={claim.claim_id}>
                <td>{claim.claim_id}</td>
                <td>{claim.denial_reason || 'N/A'}</td>
                <td>{claim.status}</td>
                <td>
                  <button style={{ marginRight: 8, background: '#388e3c', color: '#fff', borderRadius: 4, padding: '6px 16px', border: 'none' }} onClick={() => handleApprove(claim.claim_id)}>Approve</button>
                  <button style={{ background: '#d32f2f', color: '#fff', borderRadius: 4, padding: '6px 16px', border: 'none' }} onClick={() => handleReject(claim.claim_id)}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ResubmissionApprove;
