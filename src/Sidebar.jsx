import React from 'react';

const steps = [
  { name: 'Dashboard', key: 'dashboard' },
  { name: 'Eligibility', key: 'eligibility' },
  { name: 'Prior Auth', key: 'prior_auth' },
  { name: 'Clinical Documentation', key: 'clinical_documentation' },
  { name: 'Coding', key: 'coding' },
  { name: 'Claims', key: 'claims' },
  { name: 'Claim Scrubbing', key: 'claim_scrubbing' },
  { name: 'Remittance', key: 'remittance' },
  { name: 'Denial', key: 'denial' },
  { name: 'Resubmission', key: 'resubmission' },
  { name: 'Resubmission Approval', key: 'resubmission_approve' },
  { name: 'Reconciliation', key: 'reconciliation' },
];


function Sidebar({ currentStep, setStep }) {
  return (
  <div className="sidebar" style={{ width: 280, minWidth: 220, background: '#1976d2', padding: '18px 18px', borderRadius: 0, boxShadow: '0 2px 8px #0001', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 style={{ fontSize: 20, margin: '10px 0 28px 0', color: '#fff', fontWeight: 700, letterSpacing: 1 }}>RCM Workflow</h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, width: '100%' }}>
        {steps.map((step, idx) => (
          <li key={step.key} style={{ marginBottom: 7, marginTop: idx === 0 ? 10 : 0 }}>
            <button
              className={currentStep === step.key ? 'active' : ''}
              onClick={() => setStep(step.key)}
              style={{
                width: '100%',
                fontSize: 15,
                padding: '11px 6px',
                borderRadius: 8,
                border: 'none',
                background: currentStep === step.key ? '#e3f2fd' : '#1976d2',
                color: currentStep === step.key ? '#1976d2' : '#fff',
                fontWeight: currentStep === step.key ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                margin: 0,
                boxShadow: currentStep === step.key ? '0 2px 8px #1976d222' : 'none',
                minHeight: 36,
                minWidth: 0,
              }}
            >
              {step.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
