import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ClaimScrubbing() {
  const [claims, setClaims] = useState([]);
  const [selectedClaimId, setSelectedClaimId] = useState('');
  const [scrubbingResult, setScrubbingResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  axios.get(`${backendUrl}/claims/all`)
      .then(res => setClaims(res.data))
      .catch(() => setClaims([]));
  }, []);

  const handleScrub = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setScrubbingResult(null);
    try {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const res = await axios.post(`${backendUrl}/claim-scrubbing`, null, {
        params: { claim_id: selectedClaimId }
      });
      setScrubbingResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 520, margin: '32px auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #0002', padding: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ color: '#1976d2', fontWeight: 700, margin: 0 }}>Claim Scrubbing</h2>
      </div>
      <form onSubmit={handleScrub} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <label style={{ fontWeight: 600, color: '#333' }}>Select Claim</label>
        <select name="claim_id" value={selectedClaimId} onChange={e => setSelectedClaimId(e.target.value)} required style={{ padding: 10, borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 16 }}>
          <option value="">-- Select --</option>
          {claims.map(claim => (
            <option key={claim.claim_id} value={claim.claim_id}>
              {claim.patient_name} | {claim.insurance_id} | {claim.procedure} | {claim.claim_id}
            </option>
          ))}
        </select>
        <button type="submit" disabled={loading || !selectedClaimId} style={{ background: '#1976d2', color: '#fff', fontWeight: 600, border: 'none', borderRadius: 8, padding: '12px 0', fontSize: 17, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 2px 8px #388e3c22', transition: 'background 0.2s' }}>
          {loading ? 'Scrubbing...' : 'Scrub Claim'}
        </button>
      </form>
      {scrubbingResult && (
        <div style={{ marginTop: 32, background: '#f5f5f5', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px #0001' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
            <strong style={{ color: '#1976d2', fontSize: 18 }}>Scrubbing Result</strong>
          </div>
          <div style={{ fontSize: 16, color: '#333', marginBottom: 8 }}><strong>Status:</strong> {scrubbingResult.status}</div>
          <div style={{ fontSize: 15, color: '#555' }}><strong>Errors:</strong> {scrubbingResult.errors || 'None'}</div>
          <div style={{ fontSize: 15, color: '#555' }}><strong>Corrections:</strong> {scrubbingResult.corrections || 'None'}</div>
          <div style={{ fontSize: 15, color: '#555' }}><strong>AI Result:</strong> {scrubbingResult.ai_result}</div>
          <div style={{ fontSize: 15, color: '#555' }}><strong>Timestamp:</strong> {scrubbingResult.timestamp}</div>
        </div>
      )}
      {error && <div style={{ color: '#d32f2f', marginTop: 18, fontWeight: 600, textAlign: 'center' }}>{error}</div>}
    </div>
  );
}

export default ClaimScrubbing;
