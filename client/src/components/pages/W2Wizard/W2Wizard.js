import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import ProgressBar from "react-bootstrap/ProgressBar";
import SEO from "../../SEO";
import Step1Employer from "./Step1Employer";
import Step2Employee from "./Step2Employee";
import Step3Wages from "./Step3Wages";
import Step4ReviewPay from "./Step4ReviewPay";
import "./W2Wizard.scss";

const STEP_LABELS = { 1: "Employer", 2: "Employee", 3: "Wages", 4: "Review" };
const TOTAL_STEPS = 4;

class W2Wizard extends Component {
  state = {
    step: 1,
    stepsCompleted: { 1: false, 2: false, 3: false, 4: false },
    termsAccepted: false,
    gateCleared: !!localStorage.getItem("tokens"),

    // Step 1 — Employer
    employerEIN: "",
    employerName: "",
    employerAddress1: "",
    employerAddress2: "",
    employerCity: "",
    employerState: "",
    employerZip: "",
    controlNumber: "",

    // Step 2 — Employee
    employeeSSN: "",
    employeeFirstName: "",
    employeeLastName: "",
    employeeSuffix: "",
    employeeAddress1: "",
    employeeAddress2: "",
    employeeCity: "",
    employeeState: "",
    employeeZip: "",

    // Step 3 — Wages & Tax
    box1: "", box2: "", box3: "", box4: "",
    box5: "", box6: "", box7: "", box8: "",
    box9: "", box10: "", box11: "",
    box12aCode: "", box12aAmount: "",
    box12bCode: "", box12bAmount: "",
    box12cCode: "", box12cAmount: "",
    box12dCode: "", box12dAmount: "",
    statutoryEmployee: false,
    retirementPlan: false,
    thirdPartySickPay: false,
    box14Line1: "", box14Line2: "", box14Line3: "",
    state1: "", employerStateId1: "",
    state2: "", employerStateId2: "",
    stateWages1: "", stateWages2: "",
    stateTax1: "", stateTax2: "",
    localWages1: "", localWages2: "",
    localTax1: "", localTax2: "",
    localityName1: "", localityName2: "",
    taxYear: new Date().getFullYear().toString(),
  };

  handleField = (name, value) => {
    this.setState({ [name]: value });
  };

  handleCheckbox = (name) => {
    this.setState((prev) => ({ [name]: !prev[name] }));
  };

  applyPrefill = (profile) => {
    this.setState({
      employerEIN: profile.employerEIN || "",
      employerName: profile.employerName || "",
      employerAddress1: profile.employerAddress1 || "",
      employerCity: profile.employerCity || "",
      employerState: profile.employerState || "",
      employerZip: profile.employerZip || "",
      employeeSSN: profile.employeeSSN || "",
      employeeFirstName: profile.employeeFirstName || "",
      employeeLastName: profile.employeeLastName || "",
      employeeAddress1: profile.employeeAddress1 || "",
      employeeCity: profile.employeeCity || "",
      employeeState: profile.employeeState || "",
      employeeZip: profile.employeeZip || "",
      box1: profile.box1 || "",
      box2: profile.box2 || "",
      box3: profile.box3 || "",
      box4: profile.box4 || "",
      box5: profile.box5 || "",
      box6: profile.box6 || "",
      state1: profile.state1 || "",
      stateWages1: profile.stateWages1 || "",
      stateTax1: profile.stateTax1 || "",
      taxYear: profile.taxYear || new Date().getFullYear().toString(),
    });
  };

  goToStep = (step) => {
    const completed = { ...this.state.stepsCompleted };
    // Mark current step as completed when moving forward
    if (step > this.state.step) {
      completed[this.state.step] = true;
    }
    this.setState({ step, stepsCompleted: completed });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  getStepClass = (i) => {
    if (this.state.step === i) return "active";
    if (this.state.stepsCompleted[i] && i < this.state.step) return "completed";
    return "inactive";
  };

  canGoTo = (i) => {
    if (i <= this.state.step) return true;
    // Can only advance to next uncompleted step
    for (let s = 1; s < i; s++) {
      if (!this.state.stepsCompleted[s]) return false;
    }
    return true;
  };

  getAllFormData = () => {
    const s = this.state;
    return {
      employerEIN: s.employerEIN,
      employerName: s.employerName,
      employerAddress1: s.employerAddress1,
      employerAddress2: s.employerAddress2,
      employerCity: s.employerCity,
      employerState: s.employerState,
      employerZip: s.employerZip,
      controlNumber: s.controlNumber,
      employeeSSN: s.employeeSSN,
      employeeFirstName: s.employeeFirstName,
      employeeLastName: s.employeeLastName,
      employeeSuffix: s.employeeSuffix,
      employeeAddress1: s.employeeAddress1,
      employeeAddress2: s.employeeAddress2,
      employeeCity: s.employeeCity,
      employeeState: s.employeeState,
      employeeZip: s.employeeZip,
      box1: s.box1, box2: s.box2, box3: s.box3, box4: s.box4,
      box5: s.box5, box6: s.box6, box7: s.box7, box8: s.box8,
      box9: s.box9, box10: s.box10, box11: s.box11,
      box12aCode: s.box12aCode, box12aAmount: s.box12aAmount,
      box12bCode: s.box12bCode, box12bAmount: s.box12bAmount,
      box12cCode: s.box12cCode, box12cAmount: s.box12cAmount,
      box12dCode: s.box12dCode, box12dAmount: s.box12dAmount,
      statutoryEmployee: s.statutoryEmployee,
      retirementPlan: s.retirementPlan,
      thirdPartySickPay: s.thirdPartySickPay,
      box14Line1: s.box14Line1, box14Line2: s.box14Line2, box14Line3: s.box14Line3,
      state1: s.state1, employerStateId1: s.employerStateId1,
      state2: s.state2, employerStateId2: s.employerStateId2,
      stateWages1: s.stateWages1, stateWages2: s.stateWages2,
      stateTax1: s.stateTax1, stateTax2: s.stateTax2,
      localWages1: s.localWages1, localWages2: s.localWages2,
      localTax1: s.localTax1, localTax2: s.localTax2,
      localityName1: s.localityName1, localityName2: s.localityName2,
      taxYear: s.taxYear,
    };
  };

  renderStep = () => {
    const common = {
      data: this.state,
      onField: this.handleField,
      onCheckbox: this.handleCheckbox,
      goToStep: this.goToStep,
    };

    switch (this.state.step) {
      case 1:
        return <Step1Employer {...common} onPrefill={this.applyPrefill} />;
      case 2:
        return <Step2Employee {...common} />;
      case 3:
        return <Step3Wages {...common} />;
      case 4:
        return <Step4ReviewPay {...common} formData={this.getAllFormData()} />;
      default:
        return <Step1Employer {...common} />;
    }
  };

  render() {
    const isLoggedIn = !!localStorage.getItem("tokens");

    if (!isLoggedIn && !this.state.gateCleared) {
      return (
        <div className="W2Wizard">
          <SEO
            title="W-2 Wizard — Prepare Official IRS W-2 Forms"
            description="Prepare official IRS W-2 Wage and Tax Statement forms with our easy step-by-step wizard. All 6 copies included. Instant PDF download."
            path="/w2-wizard"
            keywords="W-2 form, W2 preparation, wage tax statement, IRS W-2, W2 wizard"
          />
          <div className="container">
            <div className="w2-auth-gate">
              <div className="w2-auth-gate-card">
                <div className="w2-auth-gate-icon">
                  <i className="fa fa-file-text-o"></i>
                </div>
                <h2 style={{ fontSize: "26px", marginBottom: 12 }}>W-2 Wizard</h2>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--color-text-secondary)", marginBottom: 28 }}>
                  Prepare an official IRS W-2 form with all 6 copies. Please accept our terms to continue.
                </p>

                <label style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "14px 16px", borderRadius: "var(--radius-md)",
                  border: "1.5px solid var(--color-border-strong)",
                  background: this.state.termsAccepted ? "var(--gradient-brand-subtle)" : "var(--color-bg-input)",
                  borderColor: this.state.termsAccepted ? "var(--color-accent)" : undefined,
                  cursor: "pointer", marginBottom: 20, textAlign: "left",
                }}>
                  <input
                    type="checkbox"
                    checked={this.state.termsAccepted}
                    onChange={(e) => this.setState({ termsAccepted: e.target.checked })}
                    style={{ width: 18, height: 18, accentColor: "var(--color-accent)" }}
                  />
                  <span style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)" }}>
                    I accept the{" "}
                    <Link to="/terms-and-conditions" style={{ fontWeight: 600, color: "var(--color-accent)" }}>
                      Terms &amp; Conditions
                    </Link>
                  </span>
                </label>

                <button
                  className="btn btn-secondary"
                  disabled={!this.state.termsAccepted}
                  onClick={() => this.setState({ gateCleared: true })}
                  style={{
                    width: "100%",
                    opacity: this.state.termsAccepted ? 1 : 0.5,
                    cursor: this.state.termsAccepted ? "pointer" : "not-allowed",
                  }}
                >
                  Continue to W-2 Wizard <i className="fa fa-arrow-right"></i>
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "24px 0" }}>
                  <span style={{ flex: 1, height: 1, background: "var(--color-border-strong)" }} />
                  <span style={{ fontSize: 13, color: "var(--color-text-tertiary)", fontWeight: 500 }}>or</span>
                  <span style={{ flex: 1, height: 1, background: "var(--color-border-strong)" }} />
                </div>

                <Link to="/register" className="btn" style={{
                  width: "100%", padding: "13px 28px", fontSize: 15, fontWeight: 600,
                  borderRadius: "var(--radius-md)", color: "var(--color-text-primary)",
                  background: "var(--color-bg-elevated)", border: "1.5px solid var(--color-border-strong)",
                }}>
                  Create a Free Account <i className="fa fa-user-plus"></i>
                </Link>
                <p style={{ fontSize: 14, color: "var(--color-text-tertiary)", marginTop: 16, marginBottom: 0 }}>
                  Already have an account?{" "}
                  <Link to="/login" style={{ color: "var(--color-accent)", fontWeight: 600 }}
                    onClick={() => localStorage.setItem("clickStartAstrosync", true)}>
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const progress = (this.state.step / TOTAL_STEPS) * 100;

    return (
      <div className="W2Wizard">
        <SEO
          title="W-2 Wizard — Prepare Official IRS W-2 Forms"
          description="Prepare official IRS W-2 forms with our easy step-by-step wizard."
          path="/w2-wizard"
        />
        <div className="container">
          {/* Step indicator */}
          <div className="w2-step-bar">
            <h2>W-2 Wizard</h2>
            <p className="w2-subtitle">Prepare your official IRS W-2 form</p>
            <ul>
              {[1, 2, 3, 4].map((i) => (
                <li
                  key={i}
                  className={this.getStepClass(i)}
                  onClick={this.canGoTo(i) ? () => this.goToStep(i) : undefined}
                  style={{ cursor: this.canGoTo(i) ? "pointer" : "default" }}
                >
                  {this.state.stepsCompleted[i] && i < this.state.step ? (
                    <i className="fa fa-check" style={{ fontSize: 16 }}></i>
                  ) : (
                    i
                  )}
                  <span className="step-label">{STEP_LABELS[i]}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Progress */}
          <div className="w2-progress-card">
            {this.state.step < TOTAL_STEPS ? (
              <p style={{ marginBottom: 4 }}>
                Step {this.state.step} of {TOTAL_STEPS} &mdash; Fill in your W-2 details
              </p>
            ) : (
              <p style={{ marginBottom: 4 }}>
                Review &amp; create your W-2
                <i className="fa fa-check" style={{ color: "var(--color-success)", fontSize: 18, marginLeft: 8 }}></i>
              </p>
            )}
            <ProgressBar>
              <ProgressBar variant="primary" now={progress} key={1} />
            </ProgressBar>
          </div>

          {/* Form step */}
          <div
            key={this.state.step}
            style={{ animation: "w2-card-rise 0.5s cubic-bezier(0.16, 1, 0.3, 1) both" }}
          >
            {this.renderStep()}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({ userData: state?.userData });
export default connect(mapStateToProps)(W2Wizard);
