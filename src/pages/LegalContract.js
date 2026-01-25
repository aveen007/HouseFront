import React, { useEffect, useState } from 'react';
import './LegalContract.css';
import {
  fetchContractsByPatient,
  updateContractStatus,
  signContract
} from '../api';


const LegalContract = ({user}) => {
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
   const patientId = user?.patientId;
useEffect(() => {
    if (!patientId) return;

    const loadContract = async () => {
      try {
        const res = await fetchContractsByPatient(patientId);

        if (!res.data || res.data.length === 0) {
          alert('No contract found for this patient');
          return;
        }

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
  }, [patientId]);

  /* ---------------- SIGN FLOW ---------------- */
  const handleAgreeAndSign = async () => {
    if (!contract || !patientId) return;

    try {
      setSigning(true);

      if (contract.status !== 'READY') {
        await updateContractStatus(contract.contractId, 'READY');
        setContract(prev => ({ ...prev, status: 'READY' }));
      }

      await signContract(contract.contractId, {
        patientId,
        signedBy: user.username,
        signature: 'e-signature-hash-12345'
      });

      alert('Contract signed successfully');

      setContract(prev => ({
        ...prev,
        status: 'SIGNED',
        signedAt: new Date().toISOString(),
        signedBy: user.username
      }));
    } catch (error) {
      console.error('Signing failed', error);
      alert('Failed to sign contract');
    } finally {
      setSigning(false);
    }
  };

  /* ---------------- UI ---------------- */
  if (loading) return <div className="loading">Loading contract...</div>;
  if (!contract) return <div className="error">No contract available</div>;

  return (
    <div className="legal-contract-container">
      <div className="contract-header">
        <h1>{contract.termsTitle}</h1>
        <p className="subtitle">
          Contract version {contract.termsVersion}
        </p>
      </div>

      <div className="contract-content">
        <pre className="terms-text">
          {contract.termsSnapshot}
        </pre>
      </div>

      <div className="action-section">
        <button
          className="agree-sign-button"
          data-testid='legal-contract-sign'
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