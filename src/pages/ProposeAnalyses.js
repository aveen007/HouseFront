import { useParams } from "react-router-dom";
import { fetchPatient } from "../api";
import { useState, useEffect } from "react";
import "./LegalContract.css"; // Make sure path is correct

export default function ProposeAnalyses() {
  const [patient, setPatient] = useState({});
  const { patientId } = useParams();

  useEffect(() => {
    fetchPatient(patientId)
      .then((response) => setPatient(response.data))
      .catch((error) => console.error("Error fetching patient", error));
  }, [patientId]);

  const [tests, setTests] = useState({
    mri: true,
    blood: true,
    antibiotic: false,
  });

  const [comments, setComments] = useState(
    "Patient showing symptoms of internal bleeding"
  );

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

      {/* Tests */}
      <div className="checklist-items">
        <div className="checklist-item">
          <div className="section-content">
            <span className="section-title">Tests and Treatments:</span>
            <label className="select-all-label">
              <input
                type="checkbox"
                className="select-all-checkbox"
                checked={tests.mri}
                onChange={(e) =>
                  setTests({ ...tests, mri: e.target.checked })
                }
              />
              MRI
            </label>

            <label className="select-all-label">
              <input
                type="checkbox"
                className="select-all-checkbox"
                checked={tests.blood}
                onChange={(e) =>
                  setTests({ ...tests, blood: e.target.checked })
                }
              />
              Blood Test
            </label>

            <label className="select-all-label">
              <input
                type="checkbox"
                className="select-all-checkbox"
                checked={tests.antibiotic}
                onChange={(e) =>
                  setTests({ ...tests, antibiotic: e.target.checked })
                }
              />
              Antibiotic Therapy
            </label>
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
          onClick={() => console.log({ patient, tests, comments })}
        >
          Submit for Approval
        </button>
      </div>
    </div>
  );
}
