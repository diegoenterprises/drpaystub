import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "./PayStubForm.scss";
import Step1Form from "./Step1";
import Step2Form from "./Step2";
import Step3Form from "./Step3";
import Step4Form from "./Step4";
import ProgressBar from "react-bootstrap/ProgressBar";
import moment from "moment";
import { Button } from "react-bootstrap";

export class PayStubForm extends Component {
  // optional configuration

  state = {
    step: 1,
    step1Done: true,
    step2Done: false,
    step3Done: false,
    step4Done: false,
    progress: 25,
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
  }
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
  render() {
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
                    className={this.state.step === i ? "active" : "inactive"}
                    onClick={
                      this.state[`step${i}Done`]
                        ? () => this.changeStep(i)
                        : null
                    }
                  >
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="row progressBar" style={{ borderRadius: 10 }}>
            <div className="col-sm-12">
              {this.state.step !== 4 ? (
                <p className="text-muted">
                  Your reliable paystub is just a few details away
                </p>
              ) : (
                <p className="text-muted">
                  Your reliable paystub is ready
                  <i className="fa fa-check greentick" aria-hidden="true"></i>
                </p>
              )}

              <br />
              <ProgressBar>
                <ProgressBar
                  striped
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
                  Previous
                </Button>
              </div>
            </div>
          )}
          <div className="row">
            <div className="col-sm-12">{this.showForms()}</div>
          </div>
        </div>
      </div>
    );
  }
}

PayStubForm.propTypes = {};

const mapStateToProps = (state) => state;

export default connect(mapStateToProps, {})(PayStubForm);
