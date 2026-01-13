import React, { useEffect, useState } from 'react';
import './LegalContract.css';
import {
  fetchContractsByPatient,
  updateContractStatus,
  signContract
} from '../api';

const PATIENT_ID = 6;

const LegalContract = () => {
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);

  /* ---------------- LOAD CONTRACT ---------------- */
  useEffect(() => {
    const loadContract = async () => {
      try {
        const res = await fetchContractsByPatient(PATIENT_ID);

        if (!res.data || res.data.length === 0) {
          alert('No contract found for this patient');
          return;
        }

        // pick latest contract (simple strategy)
        const latest = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )[0];

        setContract(latest);
      } catch (error) {
        console.error('Failed to load contract', error);
        alert('Failed to load contract');
      } finally {
        setLoading(false);
      }
    };

    loadContract();
  }, []);

  /* ---------------- SIGN FLOW ---------------- */
  const handleAgreeAndSign = async () => {
    if (!contract) return;

    try {
      setSigning(true);

      // 1️⃣ Ensure status is READY
      if (contract.status !== 'READY') {
        await updateContractStatus(contract.contractId, 'READY');

        setContract(prev => ({
          ...prev,
          status: 'READY'
        }));
      }

      // 2️⃣ Sign contract
      await signContract(contract.contractId, {
        patientId: PATIENT_ID,
        signedBy: 'Иван Иванов',
        signature: 'e-signature-hash-12345'
      });

      alert('Contract signed successfully');

      setContract(prev => ({
        ...prev,
        status: 'SIGNED',
        signedAt: new Date().toISOString(),
        signedBy: 'Иван Иванов'
      }));
    } catch (error) {
      console.error('Signing failed', error);
      alert('Failed to sign contract');
    } finally {
      setSigning(false);
    }
  };

  /* ---------------- UI ---------------- */
  if (loading) {
    return <div className="loading">Loading contract...</div>;
  }

  if (!contract) {
    return <div className="error">No contract available</div>;
  }

  return (
    <div className="legal-contract-container">
      {/* Header */}
      <div className="contract-header">
        <h1>{contract.termsTitle}</h1>
        <p className="subtitle">
          Contract version {contract.termsVersion}
        </p>
      </div>

      {/* Contract Content */}
      <div className="contract-content">
        <pre className="terms-text">
          {contract.termsSnapshot}
        </pre>
      </div>

      {/* Action */}
      <div className="action-section">
        <button
          className="agree-sign-button"
          onClick={handleAgreeAndSign}
          disabled={signing || contract.status === 'SIGNED'}
        >
          {contract.status === 'SIGNED'
            ? 'Contract Signed'
            : signing
              ? 'Signing...'
              : 'Agree and Sign'}
        </button>

        <p className="signature-note">
          By clicking "Agree and Sign", you confirm that you have read and agree
          to the terms of this contract.
        </p>
      </div>
    </div>
  );
};

export default LegalContract;
