import React, { useEffect, useState } from "react";
import "./ConsentForm.css";
import {
  fetchPatientAnalysesByPatient,
  fetchAnalysisTypes,
  updatePatientAnalysisStatus,
} from "../api";

const ConsentForm = ({ user }) => {
  const [formData, setFormData] = useState({});
  const [analyses, setAnalyses] = useState([]);
  const [analysisTypesMap, setAnalysisTypesMap] = useState({});
const patientId = user?.patientId;
console.log(patientId)
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch analysis types
        const typesRes = await fetchAnalysisTypes();
        const typesMap = {};
        typesRes.data.forEach((a) => {
          typesMap[a.id] = a.title;
        });
        setAnalysisTypesMap(typesMap);

        // Fetch patient analyses
        const paRes = await fetchPatientAnalysesByPatient(patientId);

        // 🔹 Only keep AwaitingPat analyses
        const awaitingPatAnalyses = paRes.data.filter(
          (pa) => pa.status === "AwaitingPat"
        );

        const patientAnalyses = awaitingPatAnalyses.map((pa) => ({
          ...pa,
          name: typesMap[pa.analysisId] || "Unknown Test",
        }));

        // Initialize form data
        const initialForm = {};
        patientAnalyses.forEach((pa) => {
          initialForm[pa.id] = "";
        });

        setAnalyses(patientAnalyses);
        setFormData(initialForm);
      } catch (err) {
        console.error("Failed to load analyses", err);
      }
    };

    loadData();
  }, [patientId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await Promise.all(
        analyses.map((pa) => {
          const choice = formData[pa.id];
          let status;

          if (choice === "agree") status = "3"; // accepted
          else if (choice === "decline") status = "2"; // rejected
          else return null;

          return updatePatientAnalysisStatus(pa.id, status);
        })
      );

      alert("Consent submitted successfully ✅");
    } catch (err) {
      console.error("Failed to submit consent", err);
      alert("Failed to submit consent ❌");
    }
  };

  if (analyses.length === 0) {
    return (
      <div className="consent-form-container">
        <h2>No analyses awaiting your consent.</h2>
      </div>
    );
  }

  return (
    <div className="consent-form-container">
      <h1>CONSENT TO PROPOSED TESTS</h1>
      <p>Please review the tests below. Check “I Agree” or “I Decline” for each item.</p>

      <form onSubmit={handleSubmit}>
        {analyses.map((pa) => (
          <div className="form-item" key={pa.id}>
            <label>{pa.name}</label>
            <div className="options">
              <label>
                <input
                  type="radio"
                  name={pa.id}
                  value="agree"
                  checked={formData[pa.id] === "agree"}
                  onChange={handleChange}
                />
                {" "}I Agree
              </label>

              <label>
                <input
                  type="radio"
                  name={pa.id}
                  value="decline"
                  checked={formData[pa.id] === "decline"}
                  onChange={handleChange}
                />
                {" "}I Decline
              </label>
            </div>
          </div>
        ))}

        <button type="submit" className="submit-btn">
          SUBMIT CONSENT
        </button>
      </form>
    </div>
  );
};

export default ConsentForm;
