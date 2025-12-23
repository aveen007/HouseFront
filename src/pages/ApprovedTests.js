// ApprovedTests.js
import React, { useEffect, useState } from "react";
import "./ApprovedTests.css";
import {
  fetchApprovedAnalyses,
  fetchPatients,
  fetchAnalysisTypes,
} from "../api";

const statusClass = (status) => {
  switch (status) {
    case "Completed":
      return "status-completed";
    case "In Progress":
      return "status-progress";
    case "Accepted":
      return "status-pending"; // reuse style or rename if you want
    default:
      return "";
  }
};

const ApprovedTests = () => {
  const [tests, setTests] = useState([]);

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
          analysisMap[a.id] = a.title; // same as last time
        });

        const rows = approvedRes.data.map((a) => ({
          id: a.id,
          name: patientMap[a.patientId] || "Unknown",
          type: analysisMap[a.analysisId] || "Unknown Test",
          date: a.date,
          status: a.status, // "Accepted"
        }));

        setTests(rows);
      } catch (err) {
        console.error("Failed to load approved tests", err);
      }
    };

    loadData();
  }, []);

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
            </tr>
          ))}
        </tbody>
      </table>

      <div className="upload-section">
        <div className="upload-box">
          <input type="file" id="fileUpload" className="file-input" />
          <label htmlFor="fileUpload">Browse Files</label>
        </div>
        <button className="complete-btn">Mark All As Complete</button>
      </div>
    </div>
  );
};

export default ApprovedTests;
