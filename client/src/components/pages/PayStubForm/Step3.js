import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import useYupValidationResolver from "../../../HelperFunctions/UseYupValidation";
import "./PayStubForm.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import $ from "jquery";
import AC from "../../../redux/actions/actionCreater";
import NumberFormat from "react-number-format";
import SalariedForm from "./Step3Salaried";
import HourlyForm from "./Step3Hourly";

import { connect } from "react-redux";

import {
  FormControlLabel,
  FormGroup,
  Switch,
  Typography,
} from "@material-ui/core";
import { Col, Row } from "react-bootstrap";
import { axios } from "../../../HelperFunctions/axios";
import DigitalSignature from "./DigitalSignature";

const format1 = "DD /MMM/ YYYY";

function Step3(props) {
  useEffect(() => {
    window.scrollTo(0, 0);
    $('[data-toggle="tooltip"]').tooltip();
  }, []);

  const [reload, setReload] = useState(false);
  const validationSchema = useMemo(
    () =>
      yup.object({
        // annual_salary: yup.string().required('Annual Salary is required'),
        // // hourly_rate: yup.string().required('Hourly Rate is required'),
        employment_status: yup
          .string()
          .nullable()
          .required("Employment status is required"),
        company_notes: yup.string().nullable(),
        // pay_frequency: yup.string().required('Annual Salary is required'),
        // check_number: yup.string().required('Check Number is required'),
      }),
    []
  );
  const resolver = useYupValidationResolver(validationSchema);
  const { handleSubmit, register, errors, getValues } = useForm({
    defaultValues: validationSchema.cast({ employment_status: props.paid }),
    resolver,
  });
  const [state, setState] = React.useState({
    checkedB: false,
  });
  const onSubmit = async (data) => {
    const salary = getValue(data.annual_salary);
    props.step3Fn({
      ...data,
      pay_date: payDate,
      hire_date: hireDate,
      EmployeeHiredIn2021: state.checkedB,
      annual_salary: salary,
    });
    props.changeStep(4);
  };

  let content = props.content;
  const handleCheckChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
  const handleSalariedChange = (event) => {
    setHourly(false);
    setSalaried(true);
  };

  const handleHourlyChange = (event) => {
    setHourly(true);
    setSalaried(false);
  };
  const handleAnnualSalary = (e) => {
    setAnnualSalary(e.target.value);
  };
  const getValue = (value) => {
    var reg = new RegExp("^[0-9]+$");
    return value
      .split("")
      .filter((el) => reg.test(el))
      .join("");
  };
  const [payDate, setPayDate] = useState([new Date()]);
  const [hireDate, setHireDate] = useState();
  const [salaried, setSalaried] = useState(
    props.paid === "Hourly" ? false : true
  );
  const [signature, setSignature] = useState();
  const [hourly, setHourly] = useState(props.paid === "Hourly" ? true : false);
  const [annualSalary, setAnnualSalary] = useState();

  const payFrequency = {
    Daily: 0,
    Weekly: 7,
    "Bi-Weekly": 14,
    Monthly: 30,
    Quaterly: 90,
    "Semi-Anually": 183,
    Annually: 365,
  };
  const getDateByPayFrequency = (e) => {
    const { value } = e.target;
    setPayDate([
      new Date().setDate(new Date().getDate() + payFrequency[value]),
    ]);
  };

  const getNotes = () => {
    const notes = {
      company_notes: getValues("company_notes"),
      sign: signature,
    };
    return notes;
  };

  useEffect(() => {
    setReload(true);
    setTimeout(() => setReload(false), 0);
  }, [props.paid]);

  // const [hourlyCheckbox, sethourlyCheckbox] = useState();
  return (
    <div className="PayStubForm formStep mt-3 formStep3">
      {/* <form onSubmit={handleSubmit(onSubmit)}> */}
      <div
        className="form-group required"
        style={{ width: "100%", paddingLeft: "10%", paddingRight: "10%" }}
      >
        <span className="badge badge-pill badge-soft-primary">Step 3</span>
        <h2>Salary Information</h2>
        <hr />
        <Typography>Note:</Typography>
        <Typography style={{ fontStyle: "italic", fontSize: 13 }}>
          <span style={{ color: "red" }}>*</span> marked fields are mandatory,
          the rest are optional
        </Typography>
        <br />
        <div class="mb-3">
          <label for="exampleFormControlTextarea1" class="form-label">
            Company Notes
          </label>
          <textarea
            ref={register}
            name="company_notes"
            class="form-control"
            id="exampleFormControlTextarea1"
            placeholder="Please enter notes"
            rows="2"
          ></textarea>
        </div>
        <label className="label-input">Employment status</label>
        <div className="position-relative">
          <div className="form-check-inline">
            <label className="form-check-label">
              <input
                ref={register}
                type="radio"
                className={
                  "form-check-input form-radio pl-5" +
                  (errors.employment_status ? "is-invalid" : "")
                }
                name="employment_status"
                value="Hourly"
                // checked={content.employment_status == 'Hourly' ? true : false}
                onChange={handleHourlyChange}
                required
              />
              Hourly
            </label>
          </div>
          <div className="form-check-inline">
            <label className="form-check-label">
              <input
                aaa
                ref={register}
                type="radio"
                className={
                  "form-check-input form-radio pl-5" +
                  (errors.employment_status ? "is-invalid" : "")
                }
                name="employment_status"
                value="Salary"
                // checked={content.employment_status == 'Salaried' ? true : false}
                onChange={handleSalariedChange}
                required
              />
              Salaried
            </label>
          </div>
          <small id="passwordHelp" className="text-danger">
            {errors.employment_status && (
              <span style={{ color: "red" }}>
                {errors.employment_status.message}
              </span>
            )}
          </small>
        </div>
        <br />
        <label className="form-check-label mb-2">Add digital signature</label>

        {signature && <img src={signature} className="signature-preview" />}
        <div className="d-flex justify-content-center">
          <DigitalSignature setSignature={setSignature} />

          <button
            className="btn btn-secondary mt-3 ml-3"
            style={{ marginBottom: "34px" }}
            onClick={() => setSignature(null)}
          >
            Clear
          </button>
        </div>

        {salaried ? (
          <SalariedForm
            content={props.content}
            handleCheckNumber={props.handleCheckNumber}
            changeStep={props.changeStep}
            employment_status={salaried ? "Salary" : "Hourly"}
            addPayDate={props.addPayDate}
            removePayDate={props.removePayDate}
            addDeduction={props.addDeduction}
            addAddition={props.addAddition}
            getNotes={getNotes}
          />
        ) : (
          <HourlyForm
            content={props.content}
            handleCheckNumber={props.handleCheckNumber}
            changeStep={props.changeStep}
            employment_status={salaried ? "Salary" : "Hourly"}
            addPayDate={props.addPayDate}
            removePayDate={props.removePayDate}
            addDeduction={props.addDeduction}
            addAddition={props.addAddition}
            getNotes={getNotes}
          />
        )}
      </div>

      {/* </form> */}
    </div>
  );
}
export default connect((state) => state, {
  step3Fn: AC.step3,
})(Step3);
