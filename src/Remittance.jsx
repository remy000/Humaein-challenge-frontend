import React, { useState } from 'react';
import axios from 'axios';

function Remittance() {
  const [form, setForm] = useState({ claim_id: '', amount: '' });
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
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const res = await axios.post(`${backendUrl}/remittance`, form);
      setResult(res.data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 style={{ color: '#1976d2', fontWeight: 700, marginBottom: 24 }}>Remittance Tracking</h2>
      <form className="form-card" onSubmit={handleSubmit}>
        <label>Claim ID</label>
        <input name="claim_id" value={form.claim_id} onChange={handleChange} required />
        <label>Amount</label>
        <input name="amount" value={form.amount} onChange={handleChange} required />
        <button type="submit" disabled={loading}>
          {loading ? 'Tracking...' : 'Track Remittance'}
        </button>
      </form>
      {result && (
        <div className="result-card">
          <strong>Status:</strong> {result.status}<br />
          <strong>AI Result:</strong> {result.ai_result}<br />
          <strong>Payer Response:</strong> {result.payer_response}<br />
          <strong>Notes:</strong> {result.notes}
        </div>
      )}
      {error && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}
    </div>
  );
}

export default Remittance;
