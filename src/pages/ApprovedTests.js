// ApprovedTests.js
import React from "react";
import "./ApprovedTests.css";

const tests = [
  { name: "Alice Smith", type: "Blood Panel", date: "2023-10-26", status: "Completed" },
  { name: "Bob Johnson", type: "Genetic Screen", date: "2023-10-27", status: "In Progress" },
  { name: "Charlie Brown", type: "Biopsy", date: "2023-10-27", status: "Pending" },
];

const statusClass = (status) => {
  switch(status) {
    case "Completed":
      return "status-completed";
    case "In Progress":
      return "status-progress";
    case "Pending":
      return "status-pending";
    default:
      return "";
  }
};

const ApprovedTests = () => {
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
          {tests.map((test, idx) => (
            <tr key={idx}>
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
