import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ClinicalDocumentation() {
  const [form, setForm] = useState({ patient_name: '', insurance_id: '', procedure: '', note: '' });
  const [authorized, setAuthorized] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  axios.get(`${backendUrl}/clinical-documentation/authorized`)
      .then(res => setAuthorized(res.data))
      .catch(() => setAuthorized([]));
  }, []);

  const handleSelect = e => {
    const idx = e.target.value;
    if (idx !== '') {
      setForm({ ...form,
        patient_name: authorized[idx].patient_name,
        insurance_id: authorized[idx].insurance_id,
        procedure: authorized[idx].procedure
      });
    } else {
      setForm({ ...form, patient_name: '', insurance_id: '', procedure: '' });
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
  const res = await axios.post(`${backendUrl}/clinical-documentation`, form);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 style={{ color: '#1976d2', fontWeight: 700, marginBottom: 24 }}>Clinical Documentation</h2>
      <form className="form-card" onSubmit={handleSubmit}>
        <label>Select Prior-Authorized Patient/Procedure</label>
        <select
          onChange={handleSelect}
          value={authorized.findIndex(a => a.patient_name === form.patient_name && a.insurance_id === form.insurance_id && a.procedure === form.procedure).toString()}
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
          {authorized.map((a, idx) => (
            <option key={idx} value={idx} style={{ color: '#1976d2', background: '#fff', fontWeight: 500 }}>
              {a.patient_name} | {a.insurance_id} | {a.procedure}
            </option>
          ))}
        </select>
        <label>Clinical Note</label>
        <textarea name="note" value={form.note} onChange={handleChange} required style={{ minHeight: 80 }} />
        <button type="submit" disabled={loading || !form.patient_name || !form.insurance_id || !form.procedure}>
          {loading ? 'Submitting...' : 'Submit Documentation'}
        </button>
      </form>
      {result && (
        <div className="result-card">
          <strong>Documentation ID:</strong> {result.id}<br />
          <strong>Patient Name:</strong> {result.patient_name}<br />
          <strong>Insurance ID:</strong> {result.insurance_id}<br />
          <strong>Procedure:</strong> {result.procedure}<br />
          <strong>Note:</strong> {result.note}<br />
          <strong>Timestamp:</strong> {result.timestamp}
        </div>
      )}
      {error && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}
    </div>
  );
}

export default ClinicalDocumentation;
