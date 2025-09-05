import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PriorAuth() {
  const [form, setForm] = useState({ patient_name: '', insurance_id: '', procedure: '' });
  const [eligible, setEligible] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  axios.get(`${backendUrl}/eligibility/eligible`)
      .then(res => setEligible(res.data))
      .catch(() => setEligible([]));
  }, []);

  const handleSelect = e => {
    const idx = e.target.value;
    if (idx !== '') {
      setForm({ ...form, patient_name: eligible[idx].patient_name, insurance_id: eligible[idx].insurance_id });
    } else {
      setForm({ ...form, patient_name: '', insurance_id: '' });
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const res = await axios.post(`${backendUrl}/prior-auth`, form);
      setResult(res.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError(err.message);
      }
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 style={{ color: '#1976d2', fontWeight: 700, marginBottom: 24 }}>Prior Authorization</h2>
      <form className="form-card" onSubmit={handleSubmit}>
        <label>Select Eligible Patient</label>
        <select
          onChange={handleSelect}
          value={eligible.findIndex(e => e.patient_name === form.patient_name && e.insurance_id === form.insurance_id).toString()}
          required
          style={{
            padding: '12px 14px',
            borderRadius: 12,
            border: '2px solid #1976d2',
            fontSize: 17,
            background: '#e3f2fd',
            color: '#1976d2',
            fontWeight: 600,
            marginBottom: 8,
            boxShadow: '0 2px 8px #1976d222',
            outline: 'none',
            transition: 'border 0.2s',
            cursor: 'pointer',
            appearance: 'none',
          }}
        >
          <option value="" style={{ color: '#333', background: '#fff' }}>-- Select --</option>
          {eligible.map((e, idx) => (
            <option key={idx} value={idx} style={{ color: '#1976d2', background: '#fff', fontWeight: 500 }}>
              {e.patient_name} | {e.insurance_id}
            </option>
          ))}
        </select>
        <label>Procedure</label>
        <input name="procedure" value={form.procedure} onChange={handleChange} required />
        <button type="submit" disabled={loading || !form.patient_name || !form.insurance_id}>
          {loading ? 'Submitting...' : 'Submit Prior Auth'}
        </button>
      </form>
      {result && (
        <div className="result-card">
          <strong>Status:</strong> {result.status}<br />
          <strong>AI Result:</strong> {result.ai_result}
        </div>
      )}
      {error && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}
    </div>
  );
}

export default PriorAuth;
