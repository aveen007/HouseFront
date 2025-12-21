import React from "react";
import "./ReviewProposals.css";

const proposals = [
  {
    name: "Alice Smith",
    tests: "Blood Panel, MRI",
    proposedBy: "2023-10-26",
    reasoning:
      "Detailed explanation for proposed tests: Ruling out differential diagnoses, identifying specific genetic markers, assessing abnormality, etc. Based the initial patient presentation and history.",
  },
  {
    name: "Bob Johnson",
    tests: "Genetic Screen",
    proposedBy: "Dr Lee 25",
    reasoning:
      "Detailed explanation for proposed tests: Ruling out differential diagnoses, identifying specific genetic markers, assessing abnormality, etc. Based the initial patient presentation and history.",
  },
  {
    name: "Charlie Brown",
    tests: "Biopsy, CT Scan",
    proposedBy: "2023-10-24",
    reasoning:
      "Detailed explanation for proposed tests: Ruling out differential diagnoses, identifying specific genetic markers, assessing abnormality, etc. Based the initial patient presentation and history.",
  },
  {
    name: "Diana Prince",
    tests: "Ultrasound",
    proposedBy: "2023-10-23",
    reasoning:
      "Detailed explanation for proposed tests: Ruling out differential diagnoses, identifying specific genetic markers, assessing abnormality, etc. Based the initial patient presentation and history.",
  },
];

export default function ReviewProposals() {
  return (
    <div className="review-container">
      <h2 className="review-title">Review & Approve Proposals</h2>
      <div className="review-content">
        <table className="proposals-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Proposed Tests</th>
              <th>Proposed By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {proposals.map((p, idx) => (
              <tr key={idx}>
                <td>{p.name}</td>
                <td>{p.tests}</td>
                <td>{p.proposedBy}</td>
                <td className="actions">
                  <button className="approve">Approve</button>
                  <button className="reject">Reject</button>
                  <button className="changes">Request Changes</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="reasoning-panel">
          <h4>Reasoning from Diagnostician</h4>
          <p>{proposals[0].reasoning}</p>
        </div>
      </div>
    </div>
  );
}
