import React, { useState, useEffect } from "react";
import { axios } from "../../../HelperFunctions/axios";
import { US_STATES } from "./states";

const PrefillPicker = ({ onPrefill }) => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [applied, setApplied] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear().toString());

  const fetchProfiles = (yr) => {
    setLoading(true);
    const token = localStorage.getItem("tokens");
    if (!token) { setLoading(false); return; }
    let url = process.env.REACT_APP_BACKEND_URL_LOCAL;
    if (process.env.REACT_APP_MODE === "live") url = process.env.REACT_APP_FRONTEND_URL_LIVE;
    axios.get(`${url}api/w2-wizard/prefill-from-paystubs?year=${yr}`, {
      headers: { Authorization: `bearer ${token}` },
    }).then((res) => {
      setProfiles(res.data?.profiles || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchProfiles(year); }, [year]);

  if (loading) return null;
  if (!profiles.length) return null;

  return (
    <div style={{
      marginBottom: 28, padding: "18px 20px", borderRadius: 14,
      background: "linear-gradient(135deg, rgba(124,92,252,0.06), rgba(59,130,246,0.06))",
      border: "1.5px solid rgba(124,92,252,0.2)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "var(--color-text-primary, #f1f5f9)", marginBottom: 2 }}>
            <i className="fa fa-magic" style={{ marginRight: 8, color: "#a78bfa" }}></i>
            Pre-fill from your paystubs
          </div>
          <div style={{ fontSize: 13, color: "var(--color-text-tertiary, #64748b)" }}>
            We found {profiles.length} employer/employee {profiles.length === 1 ? "combo" : "combos"} from your paystub history.
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            padding: "6px 16px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600,
            background: expanded ? "rgba(255,255,255,0.08)" : "linear-gradient(135deg, #7c5cfc, #6366f1)",
            color: "#fff", cursor: "pointer",
          }}
        >
          {expanded ? "Hide" : "Select"}
        </button>
      </div>

      {expanded && (
        <div style={{ marginTop: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-secondary, #94a3b8)" }}>Tax Year:</label>
            <select
              value={year}
              onChange={(e) => { setYear(e.target.value); setApplied(null); }}
              style={{
                padding: "4px 10px", borderRadius: 6, fontSize: 13, fontWeight: 600,
                background: "var(--color-bg-input, #0f172a)", color: "var(--color-text-primary, #f1f5f9)",
                border: "1px solid var(--color-border-strong, #334155)",
              }}
            >
              {[0, 1, 2, 3].map((offset) => {
                const y = new Date().getFullYear() - offset;
                return <option key={y} value={y}>{y}</option>;
              })}
            </select>
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            {profiles.map((p, idx) => (
              <div
                key={idx}
                onClick={() => { onPrefill(p); setApplied(idx); }}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "14px 16px", borderRadius: 10, cursor: "pointer",
                  background: applied === idx ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.03)",
                  border: applied === idx ? "1.5px solid rgba(16,185,129,0.3)" : "1px solid rgba(100,116,139,0.15)",
                  transition: "all 0.15s ease",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "var(--color-text-primary, #f1f5f9)" }}>
                    {p.employerName}
                    {applied === idx && (
                      <span style={{
                        marginLeft: 8, fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 5,
                        background: "rgba(16,185,129,0.2)", color: "#10b981",
                      }}>APPLIED</span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--color-text-tertiary, #64748b)", marginTop: 2 }}>
                    Employee: {p.employeeFirstName} {p.employeeLastName} &middot; {p.periodCount} pay periods &middot; ${Number(p.totalGross).toLocaleString()}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-primary, #f1f5f9)" }}>
                    ${Number(p.box1).toLocaleString()}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--color-text-tertiary, #64748b)" }}>
                    Box 1 wages
                  </div>
                </div>
              </div>
            ))}
          </div>

          {applied !== null && (
            <div style={{
              marginTop: 12, padding: "10px 14px", borderRadius: 8,
              background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)",
              fontSize: 13, color: "#10b981", fontWeight: 500,
            }}>
              <i className="fa fa-check-circle" style={{ marginRight: 6 }}></i>
              All fields pre-filled from your paystub data. Review and adjust as needed.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Step1Employer = ({ data, onField, goToStep, onPrefill }) => {
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
        {onPrefill && <PrefillPicker onPrefill={onPrefill} />}

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
