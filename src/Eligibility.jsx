import React, { useState } from 'react';
import axios from 'axios';


function Eligibility() {
  const [form, setForm] = useState({ patient_name: '', insurance_id: '' });
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
  const res = await axios.post(`${backendUrl}/eligibility`, form);
      setResult(res.data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 style={{ color: '#1976d2', fontWeight: 700, marginBottom: 24 }}>Eligibility Check</h2>
      <form className="form-card" onSubmit={handleSubmit}>
        <label>Patient Name</label>
        <input name="patient_name" value={form.patient_name} onChange={handleChange} required />
        <label>Insurance ID</label>
        <input name="insurance_id" value={form.insurance_id} onChange={handleChange} required />
        <button type="submit" disabled={loading}>
          {loading ? 'Checking...' : 'Check Eligibility'}
        </button>
      </form>
      {result && (
        <div className="result-card">
          <strong>Status:</strong> {result.status}<br />
          <strong>AI Response:</strong> {result.ai_response}
        </div>
      )}
      {error && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}
    </div>
  );
}

export default Eligibility;
