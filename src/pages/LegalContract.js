import React, { useState } from 'react';
import './LegalContract.css';

const LegalContract = () => {
  const [checkedItems, setCheckedItems] = useState({});
  const [allChecked, setAllChecked] = useState(false);

  const contractSections = [
    {
      id: 'terms',
      title: 'Terms and Conditions',
      description: 'Standard terms governing the use and conditions of this agreement.'
    },
    {
      id: 'agreement',
      title: 'Agreement to Participate',
      description: 'Mutual consent to participate under the specified terms.'
    },
    {
      id: 'payment',
      title: 'Terms of Payment',
      description: 'Payment schedule, amounts, methods, and deadlines.'
    },
    {
      id: 'dispute',
      title: 'Dispute Resolution',
      description: 'Procedures for resolving disagreements and disputes.'
    }
  ];

  const handleCheck = (id) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSelectAll = () => {
    const newState = !allChecked;
    const newCheckedItems = {};
    contractSections.forEach(section => {
      newCheckedItems[section.id] = newState;
    });
    setCheckedItems(newCheckedItems);
    setAllChecked(newState);
  };

  const handleAgreeAndSign = () => {
    const allSectionsChecked = contractSections.every(section => checkedItems[section.id]);

    if (!allSectionsChecked) {
      alert('Please review and check all sections before signing.');
      return;
    }

    alert('Contract signed successfully! Redirecting to confirmation...');
    // Here you would typically:
    // 1. Send signature to backend
    // 2. Redirect to confirmation page
    // 3. Store signed contract data
  };

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalSections = contractSections.length;

  return (
    <div className="checklist-container">
      {/* Header */}
      <div className="contract-header">
        <h1>Sign Legal Contract</h1>
        <p className="subtitle">Review and agree to all sections below</p>
      </div>

      {/* Select All Option */}
      <div className="select-all-container">
        <label className="select-all-label">
          <input
            type="checkbox"
            checked={allChecked}
            onChange={handleSelectAll}
            className="select-all-checkbox"
          />
          <span className="select-all-text">Select All Sections</span>
        </label>
        <div className="progress-indicator">
          {checkedCount} of {totalSections} sections reviewed
        </div>
      </div>

      {/* Checklist Items */}
      <div className="checklist-items">
        {contractSections.map((section) => (
          <div
            key={section.id}
            className={`checklist-item ${checkedItems[section.id] ? 'checked' : ''}`}
            onClick={() => handleCheck(section.id)}
          >
            <div className="checkbox-container">
              <input
                type="checkbox"
                id={section.id}
                checked={checkedItems[section.id] || false}
                onChange={() => handleCheck(section.id)}
                className="section-checkbox"
              />
              <span className="custom-checkbox"></span>
            </div>

            <div className="section-content">
              <label htmlFor={section.id} className="section-title">
                {section.title}
              </label>
              <p className="section-description">{section.description}</p>
            </div>

            <div className="review-action">
              <button
                className="review-button"
                onClick={(e) => {
                  e.stopPropagation();
                  alert(`Opening ${section.title} for review...`);
                  // Here you would open the full section text
                }}
              >
                Review
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Action Button */}
      <div className="action-section">
        <button
          className="agree-sign-button"
          onClick={handleAgreeAndSign}
          disabled={checkedCount !== totalSections}
        >
          Agree and Sign
        </button>
        <p className="signature-note">
          By clicking "Agree and Sign", you acknowledge that you have read and agree to all sections above.
        </p>
      </div>
    </div>
  );
};

export default LegalContract;