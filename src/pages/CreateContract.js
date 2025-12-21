import React, { useState } from 'react';
import './CreateContract.css';

const CreateContract = () => {
  const [patient, setPatient] = useState('');
  const [checkedSections, setCheckedSections] = useState({
    termsAndConditions: false,
    agreementToParticipate: false,
    termsOfPayment: false,
    disputeResolution: false
  });

  // Sample patient data - in real app, this would come from an API
  const patients = [
    { id: '1', name: 'John Smith', age: 45 },
    { id: '2', name: 'Emma Johnson', age: 32 },
    { id: '3', name: 'Robert Davis', age: 58 },
    { id: '4', name: 'Sarah Williams', age: 29 },
    { id: '5', name: 'Michael Brown', age: 67 }
  ];

  const handleCheckboxChange = (section) => {
    setCheckedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!patient) {
      alert('Please select a patient');
      return;
    }

    const selectedSections = Object.entries(checkedSections)
      .filter(([_, isChecked]) => isChecked)
      .map(([section]) => section);

    if (selectedSections.length === 0) {
      alert('Please select at least one contract section');
      return;
    }

    console.log('Creating contract for:', {
      patient,
      sections: selectedSections
    });

    alert(`Contract created successfully for ${patients.find(p => p.id === patient)?.name}!`);

    // Reset form
    setPatient('');
    setCheckedSections({
      termsAndConditions: false,
      agreementToParticipate: false,
      termsOfPayment: false,
      disputeResolution: false
    });
  };

  const sectionOptions = [
    { id: 'termsAndConditions', label: 'Terms and Conditions' },
    { id: 'agreementToParticipate', label: 'Agreement to Participate' },
    { id: 'termsOfPayment', label: 'Terms of Payment' },
    { id: 'disputeResolution', label: 'Dispute Resolution' }
  ];

  return (
    <div className="create-contract-container">
      <div className="contract-header">
        <h1>Create Legal Contract</h1>
        <p className="subtitle">Select a patient and contract sections to create a new agreement</p>
      </div>

      <form onSubmit={handleSubmit} className="contract-form">
        {/* Patient Selection */}
        <div className="form-section patient-section">
          <label className="section-label">
            <h2>Select Patient</h2>
            <div className="patient-select-container">
              <select
                value={patient}
                onChange={(e) => setPatient(e.target.value)}
                className="patient-select"
                required
              >
                <option value="">-- Choose a patient --</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Age: {p.age})
                  </option>
                ))}
              </select>

              {patient && (
                <div className="patient-info">
                  <span className="patient-name">
                    Selected: <strong>{patients.find(p => p.id === patient)?.name}</strong>
                  </span>
                </div>
              )}
            </div>
          </label>
        </div>

        {/* Contract Sections Checklist */}
        <div className="form-section sections-section">
          <h2>Contract Sections</h2>
          <p className="section-instruction">Select which sections to include in the contract:</p>

          <div className="checklist-container">
            {sectionOptions.map((section) => (
              <div key={section.id} className="checklist-item">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={checkedSections[section.id]}
                    onChange={() => handleCheckboxChange(section.id)}
                    className="section-checkbox"
                  />
                  <span className="custom-checkbox"></span>
                  <span className="checklist-text">{section.label}</span>
                </label>

                {/* Optional: Add description for each section */}
                <div className="section-description">
                  {section.id === 'termsAndConditions' && 'Standard legal terms governing the agreement'}
                  {section.id === 'agreementToParticipate' && 'Patient consent to participate in treatment'}
                  {section.id === 'termsOfPayment' && 'Payment schedule and financial arrangements'}
                  {section.id === 'disputeResolution' && 'Procedures for resolving any disagreements'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Preview */}
        <div className="form-section summary-section">
          <h2>Contract Summary</h2>
          <div className="summary-content">
            {patient ? (
              <>
                <p><strong>Patient:</strong> {patients.find(p => p.id === patient)?.name}</p>
                <p><strong>Sections to include:</strong></p>
                <ul className="selected-sections-list">
                  {sectionOptions
                    .filter(section => checkedSections[section.id])
                    .map(section => (
                      <li key={section.id}>{section.label}</li>
                    ))}
                </ul>
                {Object.values(checkedSections).filter(Boolean).length === 0 && (
                  <p className="no-sections">No sections selected yet</p>
                )}
              </>
            ) : (
              <p className="select-patient-prompt">Select a patient to see contract summary</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button type="submit" className="save-button">
            Save Contract
          </button>

          <button
            type="button"
            className="clear-button"
            onClick={() => {
              setPatient('');
              setCheckedSections({
                termsAndConditions: false,
                agreementToParticipate: false,
                termsOfPayment: false,
                disputeResolution: false
              });
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