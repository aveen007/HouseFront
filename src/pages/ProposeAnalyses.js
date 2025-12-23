import { useParams } from "react-router-dom";
import { fetchPatient, fetchAnalysisTypes } from "../api";
import { useState, useEffect } from "react";
import "./LegalContract.css";
import {
  createPatientAnalysis,
} from "../api";

export default function ProposeAnalyses() {
  const { patientId } = useParams();

  const [patient, setPatient] = useState({});
  const [analysisTypes, setAnalysisTypes] = useState([]);
  const [selectedAnalyses, setSelectedAnalyses] = useState({});
  const [comments, setComments] = useState(
    "Patient showing symptoms of internal bleeding"
  );

  // Fetch patient
  useEffect(() => {
    fetchPatient(patientId)
      .then((response) => setPatient(response.data))
      .catch((error) => console.error("Error fetching patient", error));
  }, [patientId]);

  // Fetch analysis types
  useEffect(() => {
    fetchAnalysisTypes()
      .then((response) => {
        setAnalysisTypes(response.data);

        // Initialize all checkboxes as unchecked
        const initialSelection = {};
        response.data.forEach((item) => {
          initialSelection[item.id] = false;
        });
        setSelectedAnalyses(initialSelection);
      })
      .catch((error) =>
        console.error("Error fetching analysis types", error)
      );
  }, []);

  const handleCheckboxChange = (id) => {
    setSelectedAnalyses((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSubmit = async () => {
    const today = new Date().toISOString().split("T")[0];

    // Get selected analysis IDs
    const selectedAnalysisIds = analysisTypes
      .filter((a) => selectedAnalyses[a.id])
      .map((a) => a.id);

    try {
      await Promise.all(
        selectedAnalysisIds.map((analysisId) =>
          createPatientAnalysis({
            patientId: patientId,
            analysisId: analysisId,
            date: today,
            status: "0",
            betId: "1",
          })
        )
      );

      alert("Analyses submitted for approval successfully ✅");
    } catch (error) {
      console.error("Error submitting analyses", error);
      alert("Failed to submit analyses ❌");
    }
  };


  return (
    <div className="checklist-container">
      <div className="contract-header">
        <h1>Propose Analyses & Treatments</h1>
        <p className="subtitle">
          Patient details and proposed tests/treatments
        </p>
      </div>

      {/* Patient Info */}
      <div className="checklist-items">
        <div className="checklist-item">
          <div className="section-content">
            <span className="section-title">Patient:</span>
            <p className="section-description">
              {patient.firstName} {patient.lastName}
            </p>
          </div>
        </div>
      </div>

      {/* Dynamic Tests */}
      <div className="checklist-items">
        <div className="checklist-item">
          <div className="section-content">
            <span className="section-title">Tests and Treatments:</span>

            {analysisTypes.map((analysis) => (
              <label
                key={analysis.id}
                className="select-all-label"
              >
                <input
                  type="checkbox"
                  className="select-all-checkbox"
                  checked={selectedAnalyses[analysis.id] || false}
                  onChange={() =>
                    handleCheckboxChange(analysis.id)
                  }
                />
                {analysis.title}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="checklist-items">
        <div className="checklist-item">
          <div className="section-content">
            <span className="section-title">Comments:</span>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
              className="section-description"
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="action-section">
        <button
          className="agree-sign-button"
          onClick={handleSubmit}
        >
          Submit for Approval
        </button>
      </div>
    </div>
  );
}
