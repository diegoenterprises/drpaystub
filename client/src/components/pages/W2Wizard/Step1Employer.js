import React from "react";
import { US_STATES } from "./states";

const Step1Employer = ({ data, onField, goToStep }) => {
  const handleChange = (e) => onField(e.target.name, e.target.value);

  const handleEIN = (e) => {
    let val = e.target.value.replace(/[^0-9-]/g, "");
    // Auto-insert dash after 2 digits
    if (val.length === 2 && !val.includes("-") && e.nativeEvent.inputType !== "deleteContentBackward") {
      val = val + "-";
    }
    if (val.replace(/-/g, "").length <= 9) {
      onField("employerEIN", val);
    }
  };

  const canContinue = data.employerEIN && data.employerName;

  return (
    <div className="w2-form-card">
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h3 className="w2-section-title" style={{ marginTop: 0 }}>
          <i className="fa fa-building"></i> Employer Information
        </h3>
        <p className="w2-box-hint" style={{ marginBottom: 24 }}>
          Enter the employer details exactly as they should appear on the W-2.
        </p>

        <div className="row">
          <div className="col-md-6 mb-3">
            <div className="form-group required">
              <label>Employer Identification Number (EIN)</label>
              <div className="w2-box-label">Box b</div>
              <input
                type="text"
                className="form-control"
                name="employerEIN"
                value={data.employerEIN}
                onChange={handleEIN}
                placeholder="XX-XXXXXXX"
                maxLength={10}
              />
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="form-group">
              <label>Control Number</label>
              <div className="w2-box-label">Box d</div>
              <input
                type="text"
                className="form-control"
                name="controlNumber"
                value={data.controlNumber}
                onChange={handleChange}
                placeholder="Optional"
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12 mb-3">
            <div className="form-group required">
              <label>Employer Name</label>
              <div className="w2-box-label">Box c</div>
              <input
                type="text"
                className="form-control"
                name="employerName"
                value={data.employerName}
                onChange={handleChange}
                placeholder="Company name"
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <div className="form-group">
              <label>Address Line 1</label>
              <input
                type="text"
                className="form-control"
                name="employerAddress1"
                value={data.employerAddress1}
                onChange={handleChange}
                placeholder="Street address"
              />
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="form-group">
              <label>Address Line 2</label>
              <input
                type="text"
                className="form-control"
                name="employerAddress2"
                value={data.employerAddress2}
                onChange={handleChange}
                placeholder="Suite, apt, etc. (optional)"
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                className="form-control"
                name="employerCity"
                value={data.employerCity}
                onChange={handleChange}
                placeholder="City"
              />
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="form-group">
              <label>State</label>
              <select
                className="form-control"
                name="employerState"
                value={data.employerState}
                onChange={handleChange}
              >
                <option value="">Select state</option>
                {US_STATES.map((s) => (
                  <option key={s.abbr} value={s.abbr}>
                    {s.abbr} — {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="form-group">
              <label>ZIP Code</label>
              <input
                type="text"
                className="form-control"
                name="employerZip"
                value={data.employerZip}
                onChange={handleChange}
                placeholder="ZIP"
                maxLength={10}
              />
            </div>
          </div>
        </div>

        <div className="w2-nav-buttons">
          <div></div>
          <button
            className="btn btn-secondary"
            disabled={!canContinue}
            onClick={() => goToStep(2)}
            style={{ opacity: canContinue ? 1 : 0.5, cursor: canContinue ? "pointer" : "not-allowed" }}
          >
            Continue <i className="fa fa-arrow-right" style={{ marginLeft: 6 }}></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step1Employer;
