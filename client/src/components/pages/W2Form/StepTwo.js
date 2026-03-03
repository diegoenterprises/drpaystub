import {
  FormControlLabel,
  FormGroup,
  Switch,
  Typography,
} from "@material-ui/core";

import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import useYupValidationResolver from "../../../HelperFunctions/UseYupValidation";
import InputMask from "react-input-mask";
import { states } from "./states";
import NumberFormat from "react-number-format";
import AC from "../../../redux/actions/actionCreater";
import { connect } from "react-redux";

import "./wstub.css";
import { Col, Row } from "react-bootstrap";

function StepTwo(props) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const onSubmit = (data) => {
    props.stepTwoFn({
      ...data,
      additions: additions,
      annual_salary: annualSalary,
    });

    props.changeStep(3);
  };
  console.log(props.stepTwo);
  const validationSchema = useMemo(
    () =>
      yup.object({
        employee_name: yup.string().required("Full Name is required"),
        employee_ssn: yup
          .string()
          .required("Social Security Number (SSN) is required"),
        employee_address: yup.string().required("Employee Address is required"),
        employee_state: yup.string().required("State is required"),
        employee_zipCode: yup.string().required("Zip Code is required"),
        employee_city: yup.string().required("City Name is required"),
        annual_salary: yup.string().required("Annual Salary is required"),
      }),
    []
  );
  const resolver = useYupValidationResolver(validationSchema);
  const { handleSubmit, register, errors, control } = useForm({ resolver });

  const [data, setData] = useState(states);
  const [additions, setAddition] = useState([]);
  const [annualSalary, setAnnualSalary] = useState();
  console.log(props.stepTwo);
  const [state, setState] = React.useState({
    checkedB: false,
  });

  const getAllStates = () => {
    let us_state_options;
    if (data && data.length > 0) {
      us_state_options = data.map((state) => {
        return (
          <option value={state.name}>
            {state.name.substring(0, 1).toUpperCase() +
              state.name.substring(1).toLowerCase()}
          </option>
        );
      });
    }
    return us_state_options;
  };
  const handleCheckChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
  const handleAnnualSalary = (e) => {
    setAnnualSalary(getValue(e.target.value));
  };
  const updateAddition = (value, field, idx) => {
    if (field == "amount") {
      value = getValue(value);
    }
    const arr = [...additions];

    arr[idx][field] = value;
    setAddition(arr);
  };
  const getValue = (value) => {
    var reg = new RegExp("^[0-9]+$");
    return value
      .split("")
      .filter((el) => reg.test(el))
      .join("");
  };
  return (
    <div className="PayStubForm  mt-5 stepOne">
      <div style={{ paddingLeft: "10%", paddingRight: "10%" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <span className="badge badge-pill badge-soft-primary">Step 2</span>
          <h2>Employee Information</h2>
          <hr />
          <Typography>Note:</Typography>
          <Typography style={{ fontStyle: "italic", fontSize: 13 }}>
            <span style={{ color: "red" }}>*</span> marked fields are mandatory,
            the rest are optional
          </Typography>
          <br />
          <div className="form-group required">
            <label htmlFor="company_name" className="label-input">
              Full Name
            </label>
            <input
              ref={register}
              type="text"
              className={
                "form-control " + (errors.employee_name ? "is-invalid" : "")
              }
              placeholder="Enter Business Name"
              id="employee_name"
              name="employee_name"
              defaultValue={props.stepTwo?.employee_name}
            />
            <small id="passwordHelp">
              {errors.employee_name && (
                <span>{errors.employee_name.message}</span>
              )}
            </small>
          </div>
          <div className="form-group required">
            <label htmlFor="company_name" className="label-input">
              Social Security Number (SSN)
            </label>

            <Controller
              as={InputMask}
              control={control}
              className={"form-control " + (errors.ssn ? "is-invalid" : "")}
              placeholder="XXX-XX-XXXX"
              mask="999-99-9999"
              name="employee_ssn"
              defaultValue={props.stepTwo?.employee_ssn}
            />
            <small id="passwordHelp" className="text-danger">
              {errors.employee_ssn && (
                <span>{errors.employee_ssn.message}</span>
              )}
            </small>
          </div>
          <div className="form-group required">
            <label htmlFor="company_name" className="label-input">
              Employee Address
            </label>
            <input
              ref={register}
              type="text"
              className={
                "form-control " + (errors.employee_address ? "is-invalid" : "")
              }
              placeholder="Ex. Dr. Paystub"
              id="employee_address"
              name="employee_address"
              defaultValue={props.stepTwo?.employee_address}
            />
            <small id="passwordHelp">
              {errors.employee_address && (
                <span>{errors.employee_address.message}</span>
              )}
            </small>
          </div>
          <Row>
            <Col>
              <label htmlFor="company_name" className="label-input">
                Apt/Ste No.
              </label>
              <input
                name="employee_ste_no"
                defaultValue={props.stepTwo?.employee_ste_no}
                type="text"
                ref={register}
                className="form-control"
                placeholder="optional"
              />
            </Col>
            <Col>
              <div className="form-group required">
                <label htmlFor="company_name" className="label-input">
                  Zip Code
                </label>
                <input
                  name="employee_zipCode"
                  defaultValue={props.stepTwo?.employee_zipCode}
                  type="number"
                  ref={register}
                  className={
                    "form-control " +
                    (errors.employee_zipCode ? "is-invalid" : "")
                  }
                  placeholder="EX. 98225"
                />
                <small id="passwordHelp" className="text-danger">
                  {errors.employee_zipCode && (
                    <span>{errors.employee_zipCode.message}</span>
                  )}
                </small>
              </div>
            </Col>
          </Row>

          <Row>
            <Col>
              <label htmlFor="company_name" className="label-input">
                City
              </label>
              <input
                name="employee_city"
                defaultValue={props.stepTwo?.employee_city}
                type="text"
                ref={register}
                className={
                  "form-control " + (errors.employee_city ? "is-invalid" : "")
                }
                placeholder="optional"
              />
              <small id="passwordHelp" className="text-danger">
                {errors.employee_city && (
                  <span>{errors.employee_city.message}</span>
                )}
              </small>
            </Col>
            <Col>
              <div className="form-group required">
                <label htmlFor="selectedState" className="label-input">
                  Select your state{" "}
                </label>
                <select
                  ref={register}
                  placeholder="Select State"
                  autoComplete="off"
                  className={
                    "form-control " +
                    (errors.employee_state ? "is-invalid" : "")
                  }
                  id="employee_state"
                  name="employee_state"
                  defaultValue={props.stepTwo?.employee_state}
                >
                  <option value="">Select State</option>
                  {getAllStates()}
                </select>
                <small id="passwordHelp" className="text-danger">
                  {errors.employee_state && (
                    <span>{errors.employee_state.message}</span>
                  )}
                </small>
              </div>
            </Col>
          </Row>

          <FormGroup
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Typography>Using a W4 From 2020 or later?</Typography>
            <FormControlLabel
              control={
                <Switch
                  name="checkedB"
                  color="primary"
                  checked={state.checkedB}
                  onChange={handleCheckChange}
                />
              }
              label={state.checkedB ? "Yes" : "No"}
            />
          </FormGroup>

          {state.checkedB ? (
            <div className="form-group" style={{ width: "100%" }}>
              <div>
                <label htmlFor="annual_salary" className="label-input">
                  Dependant Total <span className="text-muted">(Optional)</span>
                </label>
                <NumberFormat
                  customInput="input"
                  type="text"
                  getInputRef={register}
                  className="form-control "
                  placeholder="Ex. 60,000"
                  id="dependant_total"
                  name="dependant_total"
                  maxLength="20"
                  onChange={(e) => handleAnnualSalary(e)}
                  thousandSeparator={true}
                  prefix={"$"}
                />
                <label htmlFor="annual_salary" className="label-input">
                  Other Income Amount{" "}
                  <span className="text-muted">(Optional)</span>
                </label>
                <NumberFormat
                  customInput="input"
                  type="text"
                  getInputRef={register}
                  className="form-control "
                  placeholder="Ex. 60,000"
                  id="other_income_amount"
                  name="dependant_total"
                  maxLength="20"
                  onChange={(e) => handleAnnualSalary(e)}
                  thousandSeparator={true}
                  prefix={"$"}
                />
                <label htmlFor="annual_salary" className="label-input">
                  Deductions Amount{" "}
                  <span className="text-muted">(Optional)</span>
                </label>
                <NumberFormat
                  customInput="input"
                  type="text"
                  getInputRef={register}
                  className="form-control "
                  placeholder="Ex. 60,000"
                  id="deductions_amount"
                  name="deductions_amount"
                  maxLength="20"
                  onChange={(e) => handleAnnualSalary(e)}
                  thousandSeparator={true}
                  prefix={"$"}
                />
              </div>
            </div>
          ) : (
            <div className="form-group ">
              <label htmlFor="company_name" className="label-input">
                Number Of Federal Allowances{" "}
                <span className="text-muted">(Optional)</span>
              </label>
              <input
                ref={register}
                type="text"
                className="form-control "
                placeholder="total number of allowances"
                id="no_federal_allowances"
                name="no_federal_allowances"
                defaultValue={props.stepTwo?.no_federal_allowances}
              />
            </div>
          )}
          <div className="form-group required" style={{ width: "100%" }}>
            <label htmlFor="annual_salary" className="label-input">
              Annual Salary
            </label>
            <NumberFormat
              customInput="input"
              type="text"
              getInputRef={register}
              className={
                "form-control " + (errors.annual_salary ? "is-invalid" : "")
              }
              placeholder="Ex. 60,000"
              id="annual_salary"
              name="annual_salary"
              defaultValue={props.stepTwo?.annual_salary}
              maxLength="20"
              onChange={(e) => handleAnnualSalary(e)}
              thousandSeparator={true}
              prefix={"$"}
            />

            <small id="passwordHelp" className="text-danger">
              {errors.annual_salary && (
                <span>{errors.annual_salary.message}</span>
              )}
            </small>
          </div>
          <div className="row">
            <div className="col-sm-12 col-xs-12">
              <label>Additions</label>
              <span
                className="addPayDate"
                onClick={() => {
                  let newAddition = {
                    description: "",
                    amount: 0,
                  };
                  setAddition((prev) => [...prev, newAddition]);
                }}
                style={{ marginLeft: "5%" }}
              >
                <i className="fa fa-plus"></i> Add
                <span className="hide-in-mobile"> Additions</span>
              </span>
            </div>
          </div>

          {additions.map((addition, idx) => {
            return (
              <div className="row group-border">
                <Row>
                  <Col>
                    <div className="form-group required">
                      <label className="label-input required">
                        Description
                      </label>
                      <input
                        className="form-control "
                        placeholder="Enter Description here"
                        // defaultValue={props.stepTwo?.additions[idx].description}
                        type="text"
                        name="description"
                        onChange={(e) =>
                          updateAddition(e.target.value, "description", idx)
                        }
                        required
                      />
                    </div>
                  </Col>
                  <Col>
                    <div>
                      <label htmlFor="annual_salary" className="label-input">
                        Amount <span className="text-muted">(Optional)</span>
                      </label>
                      <NumberFormat
                        customInput="input"
                        type="text"
                        className="form-control "
                        placeholder="Ex. 60,000"
                        maxLength="20"
                        // defaultValue={props.stepTwo?.additions[idx].amount}
                        onChange={(e) =>
                          updateAddition(e.target.value, "amount", idx)
                        }
                        thousandSeparator={true}
                        prefix={"$"}
                      />
                    </div>
                  </Col>
                  <i
                    className="fa fa-times cross"
                    onClick={() => {
                      let _addition = [...additions];
                      _addition.splice(idx, 1);
                      setAddition(_addition);
                    }}
                  ></i>
                </Row>
              </div>
            );
          })}
          <div className="form-group" style={{ width: "100%" }}>
            <label>
              Federal Filing Status{" "}
              <span className="text-muted">(Optional)</span>
            </label>
            <select
              ref={register}
              placeholder="Federal Filing Status"
              autoComplete="off"
              className="form-control"
              name="federal_filing_status"
              defaultValue={props.stepTwo?.federal_filing_status}
            >
              <option value="">Select Dependants</option>
              <option value={MARITAL_STATUS["Single Taxpayers"]}>
                Single filing seperately
              </option>
              <option value={MARITAL_STATUS["Married Filing Separately"]}>
                Married filing seperately
              </option>
              <option
                value={MARITAL_STATUS["Married Jointly & Surviving Spouses"]}
              >
                Married filing jointly
              </option>
              <option value={MARITAL_STATUS["Head of Household"]}>
                Head of Household
              </option>
            </select>
          </div>
          <div className="form-group" style={{ width: "100%" }}>
            <label>
              State Filing Status <span className="text-muted">(Optional)</span>
            </label>
            <select
              ref={register}
              placeholder="State Filing Status"
              defaultValue={props.stepTwo?.state_filing_status}
              autoComplete="off"
              className="form-control"
              name="state_filing_status"
            >
              <option value="">Select Dependants</option>
              <option value={MARITAL_STATUS["Single Taxpayers"]}>
                Single filing seperately
              </option>
              <option value={MARITAL_STATUS["Married Filing Separately"]}>
                Married filing seperately
              </option>
              <option
                value={MARITAL_STATUS["Married Jointly & Surviving Spouses"]}
              >
                Married filing jointly
              </option>
              <option value={MARITAL_STATUS["Head of Household"]}>
                Head of Household
              </option>
            </select>
          </div>
          <div className="form-group" style={{ width: "100%" }}>
            <label>
              Employee Withholding Rate{" "}
              <span className="text-muted">(Optional)</span>
            </label>
            <select
              ref={register}
              placeholder="Number of Dependants"
              autoComplete="off"
              className="form-control"
              name="employee_withholding_rate"
            >
              <option value="">Select Dependants</option>
              <option value="0">0</option>

              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
          <div className=" mt-4">
            <button type="submit" className="btn btn-secondary">
              Employee Information <i className="fa fa-chevron-right"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default connect((state) => state, {
  stepTwoFn: AC.stepTwo,
})(StepTwo);

const MARITAL_STATUS = {
  "Single Taxpayers": "Single Taxpayers",
  "Married Jointly & Surviving Spouses": "Married Jointly & Surviving Spouses",
  "Married Filing Separately": "Married Filing Separately",
  "Head of Household": "Head of Household",
};
