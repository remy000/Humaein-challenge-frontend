import React, { useState } from 'react';


import './App.css';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Eligibility from './Eligibility';
import PriorAuth from './PriorAuth';
import Coding from './Coding';
import Claims from './Claims';
import Remittance from './Remittance';
import Denial from './Denial';
import Resubmission from './Resubmission';
import Reconciliation from './Reconciliation';
import ResubmissionApprove from './ResubmissionApprove';
import ClinicalDocumentation from './ClinicalDocumentation';
import ClaimScrubbing from './ClaimScrubbing';

function App() {
  const [step, setStep] = useState('dashboard');


  let content;
  switch (step) {
    case 'dashboard':
      content = <Dashboard />;
      break;
    case 'eligibility':
      content = <Eligibility />;
      break;
    case 'prior_auth':
      content = <PriorAuth />;
      break;
    case 'clinical_documentation':
      content = <ClinicalDocumentation />;
      break;
    case 'coding':
      content = <Coding />;
      break;
    case 'claims':
      content = <Claims />;
      break;
    case 'claim_scrubbing':
      content = <ClaimScrubbing />;
      break;
    case 'remittance':
      content = <Remittance />;
      break;
    case 'denial':
      content = <Denial />;
      break;
    case 'resubmission':
      content = <Resubmission />;
      break;
    case 'reconciliation':
      content = <Reconciliation />;
      break;
    case 'resubmission_approve':
      content = <ResubmissionApprove />;
      break;
    default:
      content = <Dashboard />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, sans-serif', background: '#f0f4f8' }}>
      <Sidebar currentStep={step} setStep={setStep} />
      <main style={{ flex: 1, padding: 40, background: '#f0f4f8' }}>{content}</main>
    </div>
  );
}

export default App;
