import React, { useEffect, useState } from 'react';
import axios from 'axios';


function Claims() {
  const [clinicalDocs, setClinicalDocs] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [form, setForm] = useState({
    patient_name: '',
    insurance_id: '',
    procedure: '',
    icd10_codes: '',
    cpt_codes: '',
    amount: '',
    details: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  axios.get(`${backendUrl}/clinical-documentation/authorized`)
      .then(res => setClinicalDocs(res.data))
      .catch(() => setClinicalDocs([]));
  }, []);

  useEffect(() => {
    if (selectedDocId) {
      const doc = clinicalDocs.find(d => String(d.id) === String(selectedDocId));
      if (doc) {
        setForm(f => ({
          ...f,
          patient_name: doc.patient_name,
          insurance_id: doc.insurance_id,
          procedure: doc.procedure,
        }));
        // Fetch coding info for this doc using new GET endpoint
  axios.get(`${backendUrl}/coding/by-clinical-doc/${doc.id}`)
          .then(res => {
            if (!res.data.icd10_codes && !res.data.cpt_codes) {
              // If codes missing, auto-trigger coding extraction
              axios.post(`${backendUrl}/coding`, { clinical_documentation_id: doc.id })
                .then(postRes => {
                  setForm(f => ({
                    ...f,
                    icd10_codes: postRes.data.codes?.split('\n')[0]?.replace('ICD-10 Code: ', '') || '',
                    cpt_codes: postRes.data.codes?.split('\n')[1]?.replace('CPT Code: ', '') || ''
                  }));
                })
                .catch(() => {
                  setForm(f => ({ ...f, icd10_codes: '', cpt_codes: '' }));
                });
            } else {
              setForm(f => ({
                ...f,
                icd10_codes: res.data.icd10_codes || '',
                cpt_codes: res.data.cpt_codes || ''
              }));
            }
          })
          .catch(() => {
            setForm(f => ({ ...f, icd10_codes: '', cpt_codes: '' }));
          });
      }
    } else {
      setForm(f => ({ ...f, patient_name: '', insurance_id: '', procedure: '', icd10_codes: '', cpt_codes: '' }));
    }
  }, [selectedDocId, clinicalDocs]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const res = await axios.post(`${backendUrl}/claims`, form);
      setResult(res.data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
  <div style={{ maxWidth: 520, margin: '4px auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #0002', padding: '4px 18px', minHeight: 'unset' }}>
      <h2 style={{ color: '#1976d2', fontWeight: 700, marginBottom: 24 }}>Claims Submission</h2>
  <form className="form-card" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
  {/* Patient Name, Insurance ID, and Procedure are auto-filled and hidden */}
  <label>ICD-10 Codes</label>
  <input name="icd10_codes" value={form.icd10_codes} onChange={handleChange} required style={{ background: '#e3f2fd', color: '#1976d2', fontWeight: 600 }} />
  <label>CPT Codes</label>
  <input name="cpt_codes" value={form.cpt_codes} onChange={handleChange} required style={{ background: '#e3f2fd', color: '#1976d2', fontWeight: 600 }} />
        <label>Amount (optional)</label>
        <input name="amount" value={form.amount} onChange={handleChange} />
        <label>Additional Details (optional)</label>
        <input name="details" value={form.details} onChange={handleChange} />
        <button type="submit" disabled={loading || !selectedDocId} style={{ background: '#1976d2', color: '#fff', fontWeight: 600, border: 'none', borderRadius: 8, padding: '12px 0', fontSize: 17, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 2px 8px #1976d222', transition: 'background 0.2s' }}>
          {loading ? 'Submitting...' : 'Submit Claim'}
        </button>
      </form>
      {result && (
        <div className="result-card" style={{ marginTop: 32, background: '#f5f5f5', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px #0001' }}>
          <strong>Claim ID:</strong> {result.claim_id}<br />
          <strong>Status:</strong> {result.status}<br />
          <strong>Details:</strong>
          <pre>{JSON.stringify(result.details, null, 2)}</pre>
        </div>
      )}
      {error && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}
    </div>
  );
}

export default Claims;
