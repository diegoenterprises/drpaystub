import React from "react";
import { US_STATES } from "./states";
import AddressAutocomplete from "../../AddressAutocomplete";

const Step2Employee = ({ data, onField, goToStep }) => {
  const handleChange = (e) => onField(e.target.name, e.target.value);

  const handleSSN = (e) => {
    let raw = e.target.value.replace(/[^0-9]/g, "");
    if (raw.length > 9) raw = raw.slice(0, 9);
    // Format as XXX-XX-XXXX
    let formatted = raw;
    if (raw.length > 5) {
      formatted = raw.slice(0, 3) + "-" + raw.slice(3, 5) + "-" + raw.slice(5);
    } else if (raw.length > 3) {
      formatted = raw.slice(0, 3) + "-" + raw.slice(3);
    }
    onField("employeeSSN", formatted);
  };

  const canContinue = data.employeeSSN && data.employeeFirstName && data.employeeLastName;

  return (
    <div className="w2-form-card">
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h3 className="w2-section-title" style={{ marginTop: 0 }}>
          <i className="fa fa-user"></i> Employee Information
        </h3>
        <p className="w2-box-hint" style={{ marginBottom: 24 }}>
          Enter the employee details as they should appear on the W-2.
        </p>

        <div className="row">
          <div className="col-md-6 mb-3">
            <div className="form-group required">
              <label>Social Security Number</label>
              <div className="w2-box-label">Box a</div>
              <input
                type="text"
                className="form-control"
                name="employeeSSN"
                value={data.employeeSSN}
                onChange={handleSSN}
                placeholder="XXX-XX-XXXX"
                maxLength={11}
              />
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="form-group">
              <label>Suffix</label>
              <input
                type="text"
                className="form-control"
                name="employeeSuffix"
                value={data.employeeSuffix}
                onChange={handleChange}
                placeholder="Jr., Sr., III, etc. (optional)"
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <div className="form-group required">
              <label>First Name &amp; Middle Initial</label>
              <div className="w2-box-label">Box e</div>
              <input
                type="text"
                className="form-control"
                name="employeeFirstName"
                value={data.employeeFirstName}
                onChange={handleChange}
                placeholder="First name and middle initial"
              />
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="form-group required">
              <label>Last Name</label>
              <div className="w2-box-label">Box e</div>
              <input
                type="text"
                className="form-control"
                name="employeeLastName"
                value={data.employeeLastName}
                onChange={handleChange}
                placeholder="Last name"
              />
            </div>
          </div>
        </div>

        <h3 className="w2-section-title">
          <i className="fa fa-map-marker"></i> Employee Address
        </h3>

        <div className="row">
          <div className="col-md-6 mb-3">
            <div className="form-group">
              <label>Address Line 1</label>
              <div className="w2-box-label">Box f</div>
              <AddressAutocomplete
                className="form-control"
                name="employeeAddress1"
                value={data.employeeAddress1}
                onChange={(val) => onField("employeeAddress1", val)}
                onSelect={(place) => {
                  onField("employeeAddress1", place.address);
                  if (place.city) onField("employeeCity", place.city);
                  if (place.stateCode) {
                    const matched = US_STATES.find(s => s.abbr === place.stateCode);
                    if (matched) onField("employeeState", matched.abbr);
                  }
                  if (place.zip) onField("employeeZip", place.zip);
                }}
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
                name="employeeAddress2"
                value={data.employeeAddress2}
                onChange={handleChange}
                placeholder="Apt, suite, etc. (optional)"
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
                name="employeeCity"
                value={data.employeeCity}
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
                name="employeeState"
                value={data.employeeState}
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
                name="employeeZip"
                value={data.employeeZip}
                onChange={handleChange}
                placeholder="ZIP"
                maxLength={10}
              />
            </div>
          </div>
        </div>

        <div className="w2-nav-buttons">
          <button className="btn-outline-back" onClick={() => goToStep(1)}>
            <i className="fa fa-chevron-left" style={{ marginRight: 6, fontSize: 12 }}></i>
            Back
          </button>
          <button
            className="btn btn-secondary"
            disabled={!canContinue}
            onClick={() => goToStep(3)}
            style={{ opacity: canContinue ? 1 : 0.5, cursor: canContinue ? "pointer" : "not-allowed" }}
          >
            Continue <i className="fa fa-arrow-right" style={{ marginLeft: 6 }}></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step2Employee;
