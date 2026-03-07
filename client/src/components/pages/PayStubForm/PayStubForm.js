import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import SEO from "../../SEO";
import "./PayStubForm.scss";
import Step1Form from "./Step1";
import Step2Form from "./Step2";
import Step3Form from "./Step3";
import Step4Form from "./Step4";
import ProgressBar from "react-bootstrap/ProgressBar";
import moment from "moment";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export class PayStubForm extends Component {
  // optional configuration

  state = {
    step: 1,
    step1Done: true,
    step2Done: false,
    step3Done: false,
    step4Done: false,
    progress: 25,
    termsAccepted: false,
    gateCleared: !!localStorage.getItem("tokens"),
    step1Content: {
      companyName: "",
      companyLogo: "",
      companyLogoSrc: "",
      companyAddress: "",
      companyZipCode: "",
      companyPhoneNumber: "",
      companyEIN: "",
      emailAddress: "",
      bankNumber: "",
      routingNumber: "",
      manager: "",
      bank_name: "",
      bank_street_address: "",
      bank_city: "",
      bank_state: "",
      bank_zip: "",
    },
    step2Content: {
      state: this.props.selectedState ? this.props.selectedState : "",
      employmentStatus: this.props.employmentStatus
        ? this.props.employmentStatus
        : "",
      employeeName: "",
      employeeSSN: "XXX-XX-",
      employeeAddress: "",
      employeeZIPCode: "",
      employeeID: "",
      martialStatus: "",
      noOfDependants: "",
      blindExemptions: "",
    },
    step3Content: {
      employmentStatusSalary: this.props.paidType ? this.props.paidType : "", //hourly or salary
      annualSalary: "",
      payPeriod: "",
      payDate: "",
      employeeHireDate: "",
      payDates: [new Date()],
      actual_pay_dates: [],
      checkNumbers: [""],
      additions: [],
      deductions: [],
      otherBenefits: [],
      company_notes: "",
      sign: "",
      startDate: "",
    },
    step4Content: {
      selectedTemplate: "",
    },
  };
  //this functions handle change for the Steps Content depending upon the stepNo

  handleChange = (e, stepNo) => {
    if (stepNo == 1) {
      let obj = { ...this.state.step1Content };
      if (e.target.name == "companyEIN") {
        if (e.nativeEvent.inputType == "insertText") {
          if (
            e.target.value[e.target.value.length - 1] >= 0 &&
            e.target.value[e.target.value.length - 1] <= 9
          ) {
            let value = e.target.value;
            if (value.length == 2) {
              value = value + "-";
            }
            obj[e.target.name] = value;
          }
        } else if (e.nativeEvent.inputType == "deleteContentBackward") {
          obj[e.target.name] = e.target.value;
        }
      } else {
        obj[e.target.name] = e.target.value;
      }
      this.setState({ step1Content: obj });
    } else if (stepNo == 2) {
      let obj = { ...this.state.step2Content };
      if (e.target.name == "employeeSSN") {
        if (
          (e.target.value[e.target.value.length - 1] >= 0 &&
            e.target.value[e.target.value.length - 1] <= 9) ||
          e.target.value.length == 7
        ) {
          obj[e.target.name] = e.target.value;
        }
      } else {
        obj[e.target.name] = e.target.value;
      }

      this.setState({ step2Content: obj });
    } else if (stepNo == 3) {
      let obj = { ...this.state.step3Content };
      let value = e.target.value;
      if (e.target.name == "annualSalary") {
        if (
          e.nativeEvent.inputType == "deleteContentBackward" &&
          e.target.value.length == 0
        ) {
          obj[e.target.name] = value;
        } else if (
          e.target.value[e.target.value.length - 1] >= 0 &&
          e.target.value[e.target.value.length - 1] <= 9
        ) {
          value = Number(value.split(",").join(""));
          value = value.toLocaleString();
          obj[e.target.name] = value;
        }
      } else {
        obj[e.target.name] = value;
      }
      this.setState({ step3Content: obj });
    } else {
      let obj = { ...this.state.step4Content };
      obj[e.target.name] = e.target.value;
      this.setState({ step4Content: obj });
    }
  };

  //this function updated adds a pay date depending upon the payPeriod for step3
  addPayDate = () => {
    let obj = {
      ...this.state.step3Content,
      payDates: [...this.state.step3Content.payDates],
      checkNumbers: [...this.state.step3Content.checkNumbers],
    };
    //get next date depending upon the pay period
    let newdate = null;
    let payPeriod = this.props.payFrequency;

    if (payPeriod == "onetime") {
      newdate = moment(new Date());
    } else if (payPeriod == "Daily") {
      newdate = moment(obj.payDates[obj.payDates.length - 1]).subtract(
        1,
        "days"
      );
    } else if (payPeriod == "Weekly") {
      newdate = moment(obj.payDates[obj.payDates.length - 1]).subtract(
        7,
        "days"
      );
    } else if (payPeriod == "Bi-Weekly") {
      newdate = moment(obj.payDates[obj.payDates.length - 1]).subtract(
        14,
        "days"
      );
    } else if (payPeriod == "Monthly") {
      newdate = moment(obj.payDates[obj.payDates.length - 1]).subtract(
        1,
        "months"
      );
    } else if (payPeriod == "Quaterly") {
      newdate = moment(obj.payDates[obj.payDates.length - 1]).subtract(
        3,
        "months"
      );
    } else if (payPeriod == "Semi-Anually") {
      newdate = moment(obj.payDates[obj.payDates.length - 1]).subtract(
        0.5,
        "year"
      );
    } else if (payPeriod == "Annually") {
      newdate = moment(obj.payDates[obj.payDates.length - 1]).subtract(
        1,
        "year"
      );
    } else {
      newdate = new Date();
    }
    obj.payDates.push(newdate);
    obj.checkNumbers.push("");
    this.setState({ step3Content: obj });
  };
  //this function removes the pay date
  removePayDate = (idx) => {
    let obj = {
      ...this.state.step3Content,
      payDates: [...this.state.step3Content.payDates],
      checkNumbers: [...this.state.step3Content.checkNumbers],
    };
    if (obj.payDates.length > 1) {
      obj.payDates.splice(idx, 1);
      obj.checkNumbers.splice(idx, 1);
      this.setState({ step3Content: obj });
    } else {
      //throw alert for atleast one paycheck
    }
  };
  handleCheckNumber = (e, idx) => {
    let obj = {
      ...this.state.step3Content,
      checkNumbers: [...this.state.step3Content.checkNumbers],
    };
    obj.checkNumbers[idx] = e.target.value;
    this.setState({ step3Content: obj });
  };
  handlePayDateChange = (date, idx) => {
    let obj = {
      ...this.state.step3Content,
      payDates: [...this.state.step3Content.payDates],
      checkNumbers: [...this.state.step3Content.checkNumbers],
    };
    obj.payDates[idx] = date;
    this.setState({ step3Content: obj });
  };
  addAdditions = () => {
    let obj = {
      ...this.state.step3Content,
      additions: [...this.state.step3Content.additions],
    };
    obj.additions.push({
      description: "",
      payDate: "",
      currentAmount: "",
      ytdAmount: "",
    });
    this.setState({ step3Content: obj });
  };
  removeAdditions = (idx) => {
    let obj = {
      ...this.state.step3Content,
      additions: [...this.state.step3Content.additions],
    };
    obj.additions.splice(idx, 1);
    this.setState({ step3Content: obj });
  };
  removeDeductions = (idx) => {
    let obj = {
      ...this.state.step3Content,
      deductions: [...this.state.step3Content.deductions],
    };
    obj.deductions.splice(idx, 1);
    this.setState({ step3Content: obj });
  };
  handleAdditionsChange = (e, idx, inputName) => {
    let obj = {
      ...this.state.step3Content,
      additions: [...this.state.step3Content.additions],
    };
    obj.additions[idx][inputName] = e.target.value;
    this.setState({ step3Content: obj });
  };
  handleDeductionsChange = (e, idx, inputName) => {
    let obj = {
      ...this.state.step3Content,
      deductions: [...this.state.step3Content.deductions],
    };
    obj.deductions[idx][inputName] = e.target.value;
    this.setState({ step3Content: obj });
  };
  addDeductions = () => {
    let obj = {
      ...this.state.step3Content,
      deductions: [...this.state.step3Content.deductions],
    };
    obj.deductions.push({
      description: "",
      payDate: "",
      currentAmount: "",
      ytdAmount: "",
    });
    this.setState({ step3Content: obj });
  };
  componentDidMount() {
    window.scrollTo(0, 0);
    this.applyYTDPrefill();
  }

  applyYTDPrefill = () => {
    try {
      const raw = localStorage.getItem("ytd_prefill");
      if (!raw) return;
      const prefill = JSON.parse(raw);
      localStorage.removeItem("ytd_prefill");

      // Gate: prevent form rendering until Redux is populated
      this.setState({ ytdPrefilling: true });

      // Prefill keys already match HTML input name attributes (set in YTDContinueModal)
      // Dispatch directly into Redux so Step component defaultValues pick them up
      if (prefill.step1) {
        this.props.dispatch({ type: "STEP_1", payload: prefill.step1 });
      }
      if (prefill.step2) {
        this.props.dispatch({ type: "STEP_2", payload: prefill.step2 });
      }
      if (prefill.step3) {
        // Merge startDate and hire_date into step3 Redux so Step3Salaried/Step3Hourly can read them
        const step3Redux = { ...prefill.step3 };
        if (prefill.meta?.pay_frequency) step3Redux.pay_frequency = prefill.meta.pay_frequency;
        this.props.dispatch({ type: "STEP_3", payload: step3Redux });
      }

      // Dispatch individual Redux fields Step components read directly
      const meta = prefill.meta || {};
      const s2 = prefill.step2 || {};
      if (s2.employee_state) {
        this.props.dispatch({ type: "STATE", payload: s2.employee_state });
      }
      if (meta.employment_status) {
        this.props.dispatch({ type: "EMPLOYEMENT", payload: meta.employment_status });
      }
      if (meta.pay_frequency) {
        this.props.dispatch({ type: "PAY_FREQUENCY", payload: meta.pay_frequency });
      }

      // Also update local state for controlled value= inputs in Step components
      this.setState({
        step1Content: { ...this.state.step1Content, ...prefill.step1 },
        step2Content: { ...this.state.step2Content, ...prefill.step2 },
        step3Content: { ...this.state.step3Content, ...(prefill.step3 || {}) },
      });

      // Ungate after a tick so Redux propagates before Step1 mounts
      setTimeout(() => {
        this.setState({ ytdPrefilling: false });
      }, 50);

      console.log("[YTD] Prefill applied from profile:", meta.profileKey);
    } catch (e) {
      console.error("[YTD] Failed to apply prefill:", e);
      this.setState({ ytdPrefilling: false });
    }
  };
  onImageUpload = (e, stepNo) => {
    if (stepNo == 1) {
      let obj = { ...this.state.step1Content };
      obj[e.target.name] = e.target.files[0];
      obj["companyLogoSrc"] = URL.createObjectURL(e.target.files[0]);
      this.setState({ step1Content: obj });
    }
  };
  changeStep = (step) => {
    if (step == 1) {
      this.setState({ step1Done: true });
    } else if (step == 2) {
      this.setState({ step2Done: true });
    } else if (step == 3) {
      this.setState({ step3Done: true });
    } else if (step == 4) {
      this.setState({ step4Done: true });
    }
    this.setState({ step: step, progress: (step / 4) * 100 });
  };
  handleDateChange = (date, dateType, stepNo) => {
    if (stepNo == 1) {
      let obj = { ...this.state.step1Content };
      obj[dateType] = date;
      this.setState({ step1Content: obj });
    } else if (stepNo == 2) {
      let obj = { ...this.state.step2Content };
      obj[dateType] = date;
      this.setState({ step2Content: obj });
    } else if (stepNo == 3) {
      let obj = { ...this.state.step3Content };
      obj[dateType] = date;
      this.setState({ step3Content: obj });
    } else {
      let obj = { ...this.state.step4Content };
      obj[dateType] = date;
      this.setState({ step4Content: obj });
    }
  };
  showForms = () => {
    if (this.state.step == 1) {
      return (
        <Step1Form
          content={this.state.step1Content}
          changeStep={this.changeStep}
          handleChange={this.handleChange}
          step={this.state.step}
          onImageUpload={this.onImageUpload}
        />
      );
    } else if (this.state.step == 2) {
      return (
        <Step2Form
          content={this.state.step2Content}
          changeStep={this.changeStep}
          handleChange={this.handleChange}
          step={this.state.step}
        />
      );
    } else if (this.state.step == 3) {
      return (
        <Step3Form
          content={this.state.step3Content}
          changeStep={this.changeStep}
          handleChange={this.handleChange}
          step={this.state.step}
          handleDateChange={this.handleDateChange}
          addPayDate={this.addPayDate}
          handlePayDateChange={this.handlePayDateChange}
          removePayDate={this.removePayDate}
          handleCheckNumber={this.handleCheckNumber}
          addAdditions={this.addAdditions}
          addDeductions={this.addDeductions}
          removeAdditions={this.removeAdditions}
          removeDeductions={this.removeDeductions}
          handleAdditionsChange={this.handleAdditionsChange}
          handleDeductionsChange={this.handleDeductionsChange}
        />
      );
    } else {
      return (
        <Step4Form
          content={this.state.step4Content}
          changeStep={this.changeStep}
          handleChange={this.handleChange}
          step={this.state.step}
        />
      );
    }
  };
  getStepLabel = (i) => {
    const labels = { 1: "Company", 2: "Employee", 3: "Salary", 4: "Preview" };
    return labels[i] || "";
  };

  getStepClass = (i) => {
    if (this.state.step === i) return "active";
    if (this.state[`step${i}Done`] && i < this.state.step) return "completed";
    return "inactive";
  };

  render() {
    // YTD prefill gate: wait for Redux to be populated before rendering form
    if (this.state.ytdPrefilling) {
      return (
        <div className="PayStubForm">
          <div className="container" style={{ textAlign: "center", padding: "80px 20px" }}>
            <div className="spinner-border text-primary" role="status" />
            <p style={{ marginTop: 16, color: "#888", fontSize: 14 }}>Loading your paystub data...</p>
          </div>
        </div>
      );
    }

    const isLoggedIn = !!localStorage.getItem("tokens");

    if (!isLoggedIn && !this.state.gateCleared) {
      return (
        <div className="PayStubForm">
          <SEO
            title="Create Pay Stub — Accurate Tax Calculations"
            description="Generate professional pay stubs with accurate federal and state tax withholdings, Social Security, Medicare, and custom deductions. Choose from 6 premium templates. Instant PDF download."
            path="/paystubs"
            keywords="create pay stub, generate paystub online, pay stub maker, paycheck generator, salary calculator, hourly pay stub, payroll stub creator"
          />
          <div className="container">
            <div className="auth-gate">
              <div className="auth-gate-card">
                <div className="auth-gate-icon">
                  <i className="fa fa-file-text-o"></i>
                </div>
                <h2 className="auth-gate-title">Before we begin</h2>
                <p className="auth-gate-subtitle">
                  To generate your pay stub, please accept our terms of service.
                  Creating an account lets you save and manage your stubs.
                </p>

                <label className="terms-checkbox-label">
                  <input
                    type="checkbox"
                    checked={this.state.termsAccepted}
                    onChange={(e) => this.setState({ termsAccepted: e.target.checked })}
                  />
                  <span>
                    I accept the{" "}
                    <Link to="/terms-and-conditions">Terms &amp; Conditions</Link>
                  </span>
                </label>

                <button
                  className="btn btn-secondary auth-gate-cta"
                  disabled={!this.state.termsAccepted}
                  onClick={() => this.setState({ gateCleared: true })}
                  style={{
                    opacity: this.state.termsAccepted ? 1 : 0.5,
                    cursor: this.state.termsAccepted ? "pointer" : "not-allowed",
                  }}
                >
                  Continue to Pay Stub Generator <i className="fa fa-arrow-right"></i>
                </button>

                <div className="auth-gate-divider">
                  <span>or</span>
                </div>

                <div className="auth-gate-auth-links">
                  <Link to="/register" className="btn auth-gate-register">
                    Create a Free Account <i className="fa fa-user-plus"></i>
                  </Link>
                  <p className="auth-gate-login-text">
                    Already have an account?{" "}
                    <Link to="/login" onClick={() => localStorage.setItem("clickStartAstrosync", true)}>Sign in</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="PayStubForm">
        <div className="container">
          <div className="row myProgressBar">
            <div className="col-sm-12">
              <h2 className="mb-3">Create your payroll stub now</h2>
              <ul>
                {[1, 2, 3, 4].map((i) => (
                  <li
                    key={i}
                    className={this.getStepClass(i)}
                    onClick={
                      this.state[`step${i}Done`]
                        ? () => this.changeStep(i)
                        : null
                    }
                  >
                    {this.state[`step${i}Done`] && i < this.state.step ? (
                      <i className="fa fa-check" style={{ fontSize: 16 }}></i>
                    ) : (
                      i
                    )}
                    <span className="step-label">{this.getStepLabel(i)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="row progressBar">
            <div className="col-sm-12">
              {this.state.step !== 4 ? (
                <p className="text-muted" style={{ marginBottom: 4 }}>
                  Step {this.state.step} of 4 &mdash; Your reliable paystub is just a few details away
                </p>
              ) : (
                <p className="text-muted" style={{ marginBottom: 4 }}>
                  Your reliable paystub is ready
                  <i className="fa fa-check greentick" aria-hidden="true"></i>
                </p>
              )}

              <br />
              <ProgressBar>
                <ProgressBar
                  variant="primary"
                  now={this.state.progress}
                  key={1}
                />
              </ProgressBar>
            </div>
          </div>
          {this.state.step > 1 && this.state.step <= 4 && (
            <div className="row previous-button">
              <div className="col-sm-3 offset-3 mt-3">
                <Button
                  className="mx-3"
                  variant="outline-primary"
                  onClick={() => {
                    const prevStep = this.state.step - 1;
                    if (this.state[`step${prevStep}Done`]) {
                      this.changeStep(prevStep);
                    }
                  }}
                >
                  <i className="fa fa-chevron-left" style={{ marginRight: 6, fontSize: 12 }}></i>
                  Previous
                </Button>
              </div>
            </div>
          )}
          <div className="row">
            <div
              className="col-sm-12"
              key={this.state.step}
              style={{
                animation: "ive-card-rise 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
              }}
            >
              {this.showForms()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PayStubForm.propTypes = {};

const mapStateToProps = (state) => state;

export default connect(mapStateToProps, {})(PayStubForm);
