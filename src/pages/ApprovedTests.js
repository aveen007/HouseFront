// ApprovedTests.js
import React, { useEffect, useState } from "react";
import "./ApprovedTests.css";
import axios from "axios";
import {
  fetchApprovedAnalyses,
  fetchPatients,
  fetchAnalysisTypes,
  updatePatientAnalysisStatus,
} from "../api";

const statusClass = (status) => {
  switch (status) {
    case "Completed":
      return "status-completed";
    case "In Progress":
      return "status-progress";
    case "Accepted":
      return "status-pending";
    default:
      return "";
  }
};

const ApprovedTests = () => {
  const [tests, setTests] = useState([]);
  const [results, setResults] = useState({}); // store textbox values

  useEffect(() => {
    const loadData = async () => {
      try {
        const [approvedRes, patientsRes, analysesRes] = await Promise.all([
          fetchApprovedAnalyses(),
          fetchPatients(),
          fetchAnalysisTypes(),
        ]);

        const patientMap = {};
        patientsRes.data.forEach((p) => {
          patientMap[p.id] = `${p.firstName} ${p.lastName}`;
        });

        const analysisMap = {};
        analysesRes.data.forEach((a) => {
          analysisMap[a.id] = a.title;
        });

        const rows = approvedRes.data.map((a) => ({
          id: a.id, // patientAnalysisId
          patientId: a.patientId,
          name: patientMap[a.patientId] || "Unknown",
          type: analysisMap[a.analysisId] || "Unknown Test",
          date: a.date,
          status: a.status,
        }));

        // init empty results
        const initialResults = {};
        rows.forEach((r) => {
          initialResults[r.id] = "";
        });

        setTests(rows);
        setResults(initialResults);
      } catch (err) {
        console.error("Failed to load approved tests", err);
      }
    };

    loadData();
  }, []);

  const handleResultChange = (id, value) => {
    setResults((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleMarkAllComplete = async () => {
    try {
      await Promise.all(
        tests.map(async (test) => {
          // 1️⃣ Update status to 4 (Finished)
          await updatePatientAnalysisStatus(test.id, 4);

          // 2️⃣ Create analysis result
          await axios.post(
            "http://localhost:9314/api/createAnalysisResult",
            {
              patientAnalysisId: test.id,
              result: results[test.id] || "",
            }
          );
        })
      );

      alert("All analyses marked as completed ✅");

      // Optional: update UI status
      setTests((prev) =>
        prev.map((t) => ({ ...t, status: "Completed" }))
      );
    } catch (err) {
      console.error("Failed to complete analyses", err);
      alert("Failed to mark analyses as complete ❌");
    }
  };

  return (
    <div className="approved-tests-container">
      <h2>Approved Tests</h2>

      <table className="tests-table">
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Test Type</th>
            <th>Date Assigned</th>
            <th>Status</th>
            <th>Result</th>
          </tr>
        </thead>

        <tbody>
          {tests.map((test) => (
            <tr key={test.id}>
              <td>{test.name}</td>
              <td>{test.type}</td>
              <td>{test.date}</td>
              <td>
                <span className={`status-badge ${statusClass(test.status)}`}>
                  {test.status}
                </span>
              </td>
              <td>
                <textarea
                  className="result-textbox"
                  placeholder="Enter analysis result..."
                  value={results[test.id] || ""}
                  onChange={(e) =>
                    handleResultChange(test.id, e.target.value)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="complete-btn" onClick={handleMarkAllComplete}>
        Mark All As Complete
      </button>
    </div>
  );
};

export default ApprovedTests;
