import React, { useEffect, useState } from "react";
import "./ReviewProposals.css";
import {
  fetchPatientAnalyses,
  fetchPatients,
  fetchAnalysisTypes,
  updatePatientAnalysisStatus,
} from "../api";

export default function ReviewProposals() {
  const [rows, setRows] = useState([]);

  const loadData = async () => {
    try {
      const [paRes, patientsRes, analysesRes] = await Promise.all([
        fetchPatientAnalyses(),
        fetchPatients(),
        fetchAnalysisTypes(),
      ]);

      console.log("✅ Patient Analyses:", paRes.data);
      console.log("✅ Patients:", patientsRes.data);
      console.log("✅ Analysis Types:", analysesRes.data);

      const patientMap = {};
      patientsRes.data.forEach((p) => {
        patientMap[p.id] = `${p.firstName} ${p.lastName}`;
      });

      const analysisMap = {};
      analysesRes.data.forEach((a) => {
        analysisMap[a.id] = a.title; // adjust if backend uses different field
      });

      const grouped = {};

      paRes.data.forEach((pa) => {
        if (!grouped[pa.patientId]) {
          grouped[pa.patientId] = [];
        }

        grouped[pa.patientId].push({
          patientAnalysisId: pa.id,
          name: analysisMap[pa.analysisId],
        });
      });

      const tableRows = Object.keys(grouped).map((patientId) => ({
        patientId,
        patientName: patientMap[patientId] || "Unknown",
        analyses: grouped[patientId],
      }));

      setRows(tableRows);
    } catch (err) {
      console.error("❌ Failed to load proposals", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (analyses) => {
    try {
      await Promise.all(
        analyses.map((a) =>
          updatePatientAnalysisStatus(a.patientAnalysisId, "3")
        )
      );
      alert("Approved ✅");
      loadData();
    } catch (err) {
      console.error("Approve failed", err);
    }
  };

  const handleReject = async (analyses) => {
    try {
      await Promise.all(
        analyses.map((a) =>
          updatePatientAnalysisStatus(a.patientAnalysisId, "2")
        )
      );
      alert("Rejected ❌");
      loadData();
    } catch (err) {
      console.error("Reject failed", err);
    }
  };

  return (
    <div className="review-container">
      <h2 className="review-title">Review & Approve Proposals</h2>

      <table className="proposals-table">
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Proposed Tests</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.patientId}>
              <td>{row.patientName}</td>

              <td>
                {row.analyses.map((a, i) => (
                  <span key={a.patientAnalysisId}>
                    {a.name}
                    {i < row.analyses.length - 1 && ", "}
                  </span>
                ))}
              </td>

              <td className="actions">
                <button
                  className="approve"
                  onClick={() => handleApprove(row.analyses)}
                >
                  Approve
                </button>

                <button
                  className="reject"
                  onClick={() => handleReject(row.analyses)}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
