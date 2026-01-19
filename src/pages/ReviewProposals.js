import React, { useEffect, useState } from "react";
import "./ReviewProposals.css";
import {
  fetchPatients,
  fetchAnalysisTypes,
  updatePatientAnalysisStatus,
  getAwaitingHDAnalyses,
} from "../api";

export default function ReviewProposals() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    console.log("🚀 Loading Awaiting HD analyses...");
    setLoading(true);

    try {
      const [awaitingRes, patientsRes, analysesRes] = await Promise.all([
        getAwaitingHDAnalyses(),
        fetchPatients(),
        fetchAnalysisTypes(),
      ]);

      console.log("✅ Awaiting HD Analyses:", awaitingRes?.data);
      console.log("✅ Patients:", patientsRes?.data);
      console.log("✅ Analysis Types:", analysesRes?.data);

      if (!awaitingRes?.data || awaitingRes.data.length === 0) {
        console.warn("⚠️ No Awaiting HD analyses found");
        setRows([]);
        setLoading(false);
        return;
      }

      // Patient map
      const patientMap = {};
      patientsRes.data.forEach((p) => {
        patientMap[p.id] = `${p.firstName} ${p.lastName}`;
      });

      // Analysis map
      const analysisMap = {};
      analysesRes.data.forEach((a) => {
        analysisMap[a.id] = a.title;
      });

      // Group AwaitingHD analyses by patient
      const grouped = {};

      awaitingRes.data.forEach((pa) => {
        if (!grouped[pa.patientId]) {
          grouped[pa.patientId] = [];
        }

        grouped[pa.patientId].push({
          patientAnalysisId: pa.id,
          name: analysisMap[pa.analysisId] || "Unknown Analysis",
        });
      });

      const tableRows = Object.keys(grouped).map((patientId) => ({
        patientId,
        patientName: patientMap[patientId] || "Unknown Patient",
        analyses: grouped[patientId],
      }));

      console.log("📊 Final Table Rows:", tableRows);
      setRows(tableRows);
    } catch (err) {
      console.error("❌ Failed to load proposals", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (analyses) => {
    try {
      await Promise.all(
        analyses.map((a) =>
          updatePatientAnalysisStatus(a.patientAnalysisId, "1")
        )
      );
      alert("Approved ✅");
      loadData();
    } catch (err) {
      console.error("❌ Approve failed", err);
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
      console.error("❌ Reject failed", err);
    }
  };

  return (
    <div className="review-container">
      <h2 className="review-title">Review & Approve Proposals</h2>

      {loading && <p>Loading proposals...</p>}

      {!loading && rows.length === 0 && (
        <p className="empty">No analyses awaiting HD approval 🎉</p>
      )}

      {!loading && rows.length > 0 && (
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
      )}
    </div>
  );
}
