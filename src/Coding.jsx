import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Coding() {
  const [clinicalDocs, setClinicalDocs] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch clinical documentation records for coding dropdown
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  axios.get(`${backendUrl}/clinical-documentation/all`)
      .then(res => setClinicalDocs(res.data))
      .catch(() => setClinicalDocs([]));
  }, []);

  useEffect(() => {
    if (selectedDocId) {
      const doc = clinicalDocs.find(d => String(d.id) === String(selectedDocId));
      setSelectedDoc(doc || null);
    } else {
      setSelectedDoc(null);
    }
  }, [selectedDocId, clinicalDocs]);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const res = await axios.post(`${backendUrl}/coding`, { clinical_documentation_id: selectedDocId });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 520, margin: '32px auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #0002', padding: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ color: '#1976d2', fontWeight: 700, margin: 0 }}>Medical Coding</h2>
      </div>
      <form className="form-card" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <label style={{ fontWeight: 600, color: '#333' }}>Select Clinical Documentation</label>
        <select
          name="clinical_documentation_id"
          value={selectedDocId}
          onChange={e => setSelectedDocId(e.target.value)}
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
          {clinicalDocs.map(doc => (
            <option key={doc.id} value={doc.id} style={{ color: '#1976d2', background: '#fff', fontWeight: 500 }}>
              {doc.patient_name} | {doc.insurance_id} | {doc.procedure} | {doc.timestamp}
            </option>
          ))}
        </select>
        {selectedDoc && (
          <div style={{ marginTop: 8, marginBottom: 8, background: '#e3f2fd', padding: 16, borderRadius: 8, boxShadow: '0 2px 8px #1976d222' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <strong style={{ color: '#1976d2' }}>Clinical Note</strong>
            </div>
            <span style={{ color: '#333', fontSize: 15 }}>{selectedDoc.note}</span>
          </div>
        )}
        <button type="submit" disabled={loading || !selectedDocId} style={{ background: '#1976d2', color: '#fff', fontWeight: 600, border: 'none', borderRadius: 8, padding: '12px 0', fontSize: 17, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 2px 8px #1976d222', transition: 'background 0.2s' }}>
          {loading ? 'Extracting...' : 'Extract Codes'}
        </button>
      </form>
      {result && (
        <div className="result-card" style={{ marginTop: 32, background: '#f5f5f5', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px #0001' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
            <strong style={{ color: '#1976d2', fontSize: 18 }}>Extracted Codes</strong>
          </div>
          <div style={{ fontSize: 16, color: '#333', marginBottom: 8 }}><strong>Codes:</strong> {result.codes}</div>
          <div style={{ fontSize: 15, color: '#555' }}><strong>Patient Name:</strong> {result.patient_name}</div>
          <div style={{ fontSize: 15, color: '#555' }}><strong>Insurance ID:</strong> {result.insurance_id}</div>
          <div style={{ fontSize: 15, color: '#555' }}><strong>Procedure:</strong> {result.procedure}</div>
          <div style={{ fontSize: 15, color: '#555' }}><strong>Documentation:</strong> {result.documentation}</div>
        </div>
      )}
      {error && <div style={{ color: '#d32f2f', marginTop: 18, fontWeight: 600, textAlign: 'center' }}>{error}</div>}
    </div>
  );
}

export default Coding;
