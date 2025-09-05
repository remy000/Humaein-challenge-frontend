import React, { useState } from 'react';
import axios from 'axios';

function Resubmission() {
  const [form, setForm] = useState({ claim_id: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        claim_id: String(form.claim_id)
      };
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const res = await axios.post(`${backendUrl}/resubmission`, payload);
      if (res.data.error) {
        setError(res.data.error);
        setResult(null);
      } else {
        setResult(res.data);
        setError(null);
      }
    } catch (err) {
      setError(err.message);
      setResult(null);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 style={{ color: '#1976d2', fontWeight: 700, marginBottom: 24 }}>Claims Resubmission</h2>
      <form className="form-card" onSubmit={handleSubmit}>
        <label>Claim ID</label>
        <input name="claim_id" value={form.claim_id} onChange={handleChange} required />
        <button type="submit" disabled={loading}>
          {loading ? 'Resubmitting...' : 'Resubmit Claim'}
        </button>
      </form>
      {result && (
        <div className="result-card">
          <strong>Resubmission ID:</strong> {result.id || "N/A"}<br />
          <strong>Claim ID:</strong> {result.claim_id || "N/A"}<br />
          <strong>Status:</strong> {result.status || "N/A"}<br />
          <strong>AI Result:</strong> {result.ai_result || "N/A"}<br />
          <strong>Timestamp:</strong> {result.timestamp || "N/A"}
        </div>
      )}
      {error && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}
    </div>
  );
}

export default Resubmission;
