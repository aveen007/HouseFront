import React, { useEffect, useState } from 'react';
import './CreateContract.css';
import { fetchPatients, createContract, fetchContractTerms, fetchPatientContracts } from '../api';

const CreateContract = () => {
  const [patients, setPatients] = useState([]);
  const [terms, setTerms] = useState([]);
  const [patient, setPatient] = useState('');
  const [selectedTermId, setSelectedTermId] = useState(null);
  const [loading, setLoading] = useState(true);

  /* -------------------- LOAD DATA -------------------- */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [patientsRes, termsRes] = await Promise.all([
          fetchPatients(),
          fetchContractTerms()
        ]);

        const allPatients = patientsRes.data;

        // 🔍 Keep ONLY patients with NO contracts at all
        const patientsWithoutContracts = await Promise.all(
          allPatients.map(async (p) => {
            const contractsRes = await fetchPatientContracts(p.id);
            const contracts = contractsRes.data;

            // ✅ include only if patient has ZERO contracts
            return contracts.length === 0 ? p : null;
          })
        );

        setPatients(patientsWithoutContracts.filter(Boolean));
        setTerms(termsRes.data.filter(t => t.isActive));
      } catch (error) {
        console.error('Failed to load data', error);
        alert('Failed to load contract data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!patient || !selectedTermId) {
    alert('Patient and term are required');
    return;
  }

  const payload = {
    patientId: Number(patient),
    termsId: Number(selectedTermId)
  };

  try {
    await createContract(payload);
    alert('Contract created successfully');

    setPatient('');
    setSelectedTermId(null);
  } catch (error) {
    console.error('Create contract failed', error);
    alert('Failed to create contract');
  }
};
  /* -------------------- UI -------------------- */
  if (loading) {
    return <div className="loading">Loading contract data...</div>;
  }

  return (
    <div className="create-contract-container">
      <div className="contract-header">
        <h1>Create Legal Contract</h1>
        <p className="subtitle">
          Select a patient and one contract term to create a new agreement
        </p>
      </div>

      <form onSubmit={handleSubmit} className="contract-form">
        {/* ---------------- Patient ---------------- */}
        <div className="form-section patient-section">
          <h2>Select Patient</h2>

          <select
            value={patient}
            onChange={(e) => setPatient(e.target.value)}
            className="patient-select"
            required
            data-testid="create-contract-patient"
          >
            <option value="">-- Choose a patient --</option>
            {patients.map(p => (
              <option key={p.id} value={p.id} data-testid={`create-contract-patient-option-${p.id}`}>
                {p.firstName} {p.lastName}
              </option>
            ))}
          </select>
        </div>

        {/* ---------------- Terms (SINGLE) ---------------- */}
        <div className="form-section sections-section">
          <h2>Contract Term</h2>
          <p className="section-instruction">
            Select exactly one term for this contract:
          </p>

          <div className="checklist-container">
            {terms.map(term => (
              <div key={term.termsId} className="checklist-item">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="contractTerm"
                    value={term.termsId}
                    data-testid={`create-contract-term-${term.termsId}`}
                    checked={selectedTermId === term.termsId}
                    onChange={() => setSelectedTermId(term.termsId)}
                  />
                  <span className="checklist-text">{term.title}</span>
                </label>

                <div className="section-description">
                  {term.content.length > 200
                    ? `${term.content.substring(0, 200)}...`
                    : term.content}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------- Actions ---------------- */}
        <div className="form-actions">
          <button type="submit" className="save-button" data-testid="create-contract-save">
            Save Contract
          </button>

          <button
            type="button"
            className="clear-button"
            onClick={() => {
              setPatient('');
              setSelectedTermId(null);
            }}
          >
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateContract;
