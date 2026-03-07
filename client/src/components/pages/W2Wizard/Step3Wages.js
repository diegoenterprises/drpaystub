import React from "react";
import { US_STATES, BOX12_CODES } from "./states";

const MoneyInput = ({ label, boxLabel, name, value, onChange, placeholder }) => (
  <div className="form-group">
    <label>{label}</label>
    {boxLabel && <div className="w2-box-label">{boxLabel}</div>}
    <input
      type="text"
      className="form-control"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder || "0.00"}
    />
  </div>
);

const Box12Row = ({ letter, codeVal, amountVal, onField }) => (
  <div className="row mb-3">
    <div className="col-md-4">
      <div className="form-group">
        <label>12{letter} Code</label>
        <select
          className="form-control"
          name={`box12${letter}Code`}
          value={codeVal}
          onChange={(e) => onField(`box12${letter}Code`, e.target.value)}
        >
          <option value="">Select code</option>
          {BOX12_CODES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code} — {c.desc.length > 50 ? c.desc.slice(0, 50) + "..." : c.desc}
            </option>
          ))}
        </select>
      </div>
    </div>
    <div className="col-md-4">
      <div className="form-group">
        <label>12{letter} Amount</label>
        <input
          type="text"
          className="form-control"
          name={`box12${letter}Amount`}
          value={amountVal}
          onChange={(e) => onField(`box12${letter}Amount`, e.target.value)}
          placeholder="0.00"
        />
      </div>
    </div>
  </div>
);

const Step3Wages = ({ data, onField, onCheckbox, goToStep }) => {
  const handleChange = (e) => onField(e.target.name, e.target.value);

  return (
    <div className="w2-form-card">
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {/* ── Federal Wages & Tax ── */}
        <h3 className="w2-section-title" style={{ marginTop: 0 }}>
          <i className="fa fa-dollar"></i> Federal Wages &amp; Tax
        </h3>

        <div className="row mb-3">
          <div className="col-md-6">
            <MoneyInput label="Wages, tips, other compensation" boxLabel="Box 1" name="box1" value={data.box1} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <MoneyInput label="Federal income tax withheld" boxLabel="Box 2" name="box2" value={data.box2} onChange={handleChange} />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <MoneyInput label="Social security wages" boxLabel="Box 3" name="box3" value={data.box3} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <MoneyInput label="Social security tax withheld" boxLabel="Box 4" name="box4" value={data.box4} onChange={handleChange} />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <MoneyInput label="Medicare wages and tips" boxLabel="Box 5" name="box5" value={data.box5} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <MoneyInput label="Medicare tax withheld" boxLabel="Box 6" name="box6" value={data.box6} onChange={handleChange} />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <MoneyInput label="Social security tips" boxLabel="Box 7" name="box7" value={data.box7} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <MoneyInput label="Allocated tips" boxLabel="Box 8" name="box8" value={data.box8} onChange={handleChange} />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <MoneyInput label="Verification code" boxLabel="Box 9" name="box9" value={data.box9} onChange={handleChange} placeholder="Optional" />
          </div>
          <div className="col-md-6">
            <MoneyInput label="Dependent care benefits" boxLabel="Box 10" name="box10" value={data.box10} onChange={handleChange} />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <MoneyInput label="Nonqualified plans" boxLabel="Box 11" name="box11" value={data.box11} onChange={handleChange} />
          </div>
        </div>

        {/* ── Box 12 ── */}
        <h3 className="w2-section-title">
          <i className="fa fa-list"></i> Box 12 — Coded Items
        </h3>
        <p className="w2-box-hint" style={{ marginBottom: 16 }}>
          Select a code and enter the amount for each applicable item (up to 4).
        </p>

        <Box12Row letter="a" codeVal={data.box12aCode} amountVal={data.box12aAmount} onField={onField} />
        <Box12Row letter="b" codeVal={data.box12bCode} amountVal={data.box12bAmount} onField={onField} />
        <Box12Row letter="c" codeVal={data.box12cCode} amountVal={data.box12cAmount} onField={onField} />
        <Box12Row letter="d" codeVal={data.box12dCode} amountVal={data.box12dAmount} onField={onField} />

        {/* ── Box 13 Checkboxes ── */}
        <h3 className="w2-section-title">
          <i className="fa fa-check-square-o"></i> Box 13 — Checkboxes
        </h3>
        <div className="w2-checkbox-row">
          <label
            className={`w2-checkbox-item ${data.statutoryEmployee ? "checked" : ""}`}
          >
            <input
              type="checkbox"
              checked={data.statutoryEmployee}
              onChange={() => onCheckbox("statutoryEmployee")}
            />
            Statutory employee
          </label>
          <label
            className={`w2-checkbox-item ${data.retirementPlan ? "checked" : ""}`}
          >
            <input
              type="checkbox"
              checked={data.retirementPlan}
              onChange={() => onCheckbox("retirementPlan")}
            />
            Retirement plan
          </label>
          <label
            className={`w2-checkbox-item ${data.thirdPartySickPay ? "checked" : ""}`}
          >
            <input
              type="checkbox"
              checked={data.thirdPartySickPay}
              onChange={() => onCheckbox("thirdPartySickPay")}
            />
            Third-party sick pay
          </label>
        </div>

        {/* ── Box 14 Other ── */}
        <h3 className="w2-section-title">
          <i className="fa fa-pencil"></i> Box 14 — Other
        </h3>
        <div className="row mb-3">
          <div className="col-md-4">
            <div className="form-group">
              <label>Line 1</label>
              <input type="text" className="form-control" name="box14Line1" value={data.box14Line1} onChange={handleChange} placeholder="Optional" />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label>Line 2</label>
              <input type="text" className="form-control" name="box14Line2" value={data.box14Line2} onChange={handleChange} placeholder="Optional" />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label>Line 3</label>
              <input type="text" className="form-control" name="box14Line3" value={data.box14Line3} onChange={handleChange} placeholder="Optional" />
            </div>
          </div>
        </div>

        {/* ── State & Local (Boxes 15-20) ── */}
        <h3 className="w2-section-title">
          <i className="fa fa-flag"></i> State &amp; Local Tax (Boxes 15–20)
        </h3>
        <p className="w2-box-hint" style={{ marginBottom: 16 }}>
          Two lines are available if you have income in multiple states or localities.
        </p>

        {/* Line 1 */}
        <div style={{ padding: "16px", border: "1.5px solid var(--color-border)", borderRadius: 16, background: "var(--color-bg-elevated)", marginBottom: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "var(--color-accent)", marginBottom: 12 }}>State/Local Line 1</p>
          <div className="row mb-3">
            <div className="col-md-3">
              <div className="form-group">
                <label>State</label>
                <div className="w2-box-label">Box 15</div>
                <select className="form-control" name="state1" value={data.state1} onChange={handleChange}>
                  <option value="">Select</option>
                  {US_STATES.map((s) => (
                    <option key={s.abbr} value={s.abbr}>{s.abbr}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label>Employer State ID</label>
                <div className="w2-box-label">Box 15</div>
                <input type="text" className="form-control" name="employerStateId1" value={data.employerStateId1} onChange={handleChange} />
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label>State wages</label>
                <div className="w2-box-label">Box 16</div>
                <input type="text" className="form-control" name="stateWages1" value={data.stateWages1} onChange={handleChange} placeholder="0.00" />
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label>State income tax</label>
                <div className="w2-box-label">Box 17</div>
                <input type="text" className="form-control" name="stateTax1" value={data.stateTax1} onChange={handleChange} placeholder="0.00" />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label>Local wages</label>
                <div className="w2-box-label">Box 18</div>
                <input type="text" className="form-control" name="localWages1" value={data.localWages1} onChange={handleChange} placeholder="0.00" />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Local income tax</label>
                <div className="w2-box-label">Box 19</div>
                <input type="text" className="form-control" name="localTax1" value={data.localTax1} onChange={handleChange} placeholder="0.00" />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Locality name</label>
                <div className="w2-box-label">Box 20</div>
                <input type="text" className="form-control" name="localityName1" value={data.localityName1} onChange={handleChange} />
              </div>
            </div>
          </div>
        </div>

        {/* Line 2 */}
        <div style={{ padding: "16px", border: "1.5px solid var(--color-border)", borderRadius: 16, background: "var(--color-bg-elevated)", marginBottom: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-tertiary)", marginBottom: 12 }}>State/Local Line 2 (optional)</p>
          <div className="row mb-3">
            <div className="col-md-3">
              <div className="form-group">
                <label>State</label>
                <select className="form-control" name="state2" value={data.state2} onChange={handleChange}>
                  <option value="">Select</option>
                  {US_STATES.map((s) => (
                    <option key={s.abbr} value={s.abbr}>{s.abbr}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label>Employer State ID</label>
                <input type="text" className="form-control" name="employerStateId2" value={data.employerStateId2} onChange={handleChange} />
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label>State wages</label>
                <input type="text" className="form-control" name="stateWages2" value={data.stateWages2} onChange={handleChange} placeholder="0.00" />
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label>State income tax</label>
                <input type="text" className="form-control" name="stateTax2" value={data.stateTax2} onChange={handleChange} placeholder="0.00" />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label>Local wages</label>
                <input type="text" className="form-control" name="localWages2" value={data.localWages2} onChange={handleChange} placeholder="0.00" />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Local income tax</label>
                <input type="text" className="form-control" name="localTax2" value={data.localTax2} onChange={handleChange} placeholder="0.00" />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Locality name</label>
                <input type="text" className="form-control" name="localityName2" value={data.localityName2} onChange={handleChange} />
              </div>
            </div>
          </div>
        </div>

        <div className="w2-nav-buttons">
          <button className="btn-outline-back" onClick={() => goToStep(2)}>
            <i className="fa fa-chevron-left" style={{ marginRight: 6, fontSize: 12 }}></i>
            Back
          </button>
          <button className="btn btn-secondary" onClick={() => goToStep(4)}>
            Review &amp; Pay <i className="fa fa-arrow-right" style={{ marginLeft: 6 }}></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step3Wages;
