import React, { useState } from "react";
import "./ConsentForm.css";

const ConsentForm = () => {
  const [formData, setFormData] = useState({
    cbc: "",
    bmp: "",
    chestXRay: "",
    mriBrain: "",
    ivFluid: "",
    fluShot: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert("Consent submitted successfully!");
  };

  return (
    <div className="consent-form-container">
      <h1>CONSENT TO PROPOSED TESTS</h1>
      <p>Please review the tests and treatments below. Check “I Agree” or “I Decline” for each item. Your choices will recorded upon submission.</p>
      <form onSubmit={handleSubmit}>
        {/* Laboratory Tests */}
        <div className="section">
          <h2>LABORATORY TESTS</h2>
          <div className="form-item">
            <label>Complete Blood Count (CBC)</label>
            <p>To assess general health and detect various conditions.</p>
            <div className="options">
              <label>
                <input type="radio" name="cbc" value="agree" onChange={handleChange} /> I Agree
              </label>
              <label>
                <input type="radio" name="cbc" value="decline" onChange={handleChange} /> I Decline
              </label>
            </div>
          </div>
        </div>

        {/* Metabolic Panel */}
        <div className="section">
          <h2>METABOLIC PANEL (BMP)</h2>
          <div className="form-item">
            <label>Metabolic Panel (BMP)</label>
            <p>electrolyte, and kidney function.</p>
            <div className="options">
              <label>
                <input type="radio" name="bmp" value="decline" onChange={handleChange} /> I Decline
              </label>
            </div>
          </div>
        </div>

        {/* Imaging Scans */}
        <div className="section">
          <h2>IMAGING SCANS</h2>
          <div className="form-item">
            <label>Chest X-Ray</label>
            <p>To view your heart, lungs, and bones.</p>
            <div className="options">
              <label>
                <input type="radio" name="chestXRay" value="agree" onChange={handleChange} /> I Agree
              </label>
              <label>
                <input type="radio" name="chestXRay" value="decline" onChange={handleChange} /> I Decline
              </label>
            </div>
          </div>

          <div className="form-item">
            <label>MRI Brain</label>
            <p>To produce detailed images of your brain and nervous tissue.</p>
            <div className="options">
              <label>
                <input type="radio" name="mriBrain" value="agree" onChange={handleChange} /> I Agree
              </label>
              <label>
                <input type="radio" name="mriBrain" value="decline" onChange={handleChange} /> I Decline
              </label>
            </div>
          </div>
        </div>

        {/* Procedures/Treatments */}
        <div className="section">
          <h2>PROCEDURES/TREATMENTS</h2>
          <div className="form-item">
            <label>IV Fluid Administration</label>
            <p>To provide hydration and medication.</p>
            <div className="options">
              <label>
                <input type="radio" name="ivFluid" value="agree" onChange={handleChange} /> I Agree
              </label>
              <label>
                <input type="radio" name="ivFluid" value="decline" onChange={handleChange} /> I Decline
              </label>
            </div>
          </div>

          <div className="form-item">
            <label>
              <input type="checkbox" name="fluShot" checked={formData.fluShot} onChange={handleChange} /> Vaccination - Flu Shot
            </label>
            <p>Annual influenza protection.</p>
          </div>
        </div>

        <button type="submit" className="submit-btn">SUBMIT CONSENT</button>
      </form>
    </div>
  );
};

export default ConsentForm;
