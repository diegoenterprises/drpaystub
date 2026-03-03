import { Typography } from "@material-ui/core";
import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import useYupValidationResolver from "../../../HelperFunctions/UseYupValidation";
import InputMask from "react-input-mask";
import { states } from "./states";
import AC from "../../../redux/actions/actionCreater";
import { connect } from "react-redux";

import "./wstub.css";
import { Col, Row } from "react-bootstrap";

function StepOne(props) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const onSubmit = (data) => {
    props.stepOneFn(data);

    props.changeStep(2);
  };
  const validationSchema = useMemo(
    () =>
      yup.object({
        employer_ein: yup
          .string()
          .required("Employer Identification Number (EIN) is required"),
        business_name: yup.string().required("Business Name is required"),
        company_address: yup.string().required("Company Address is required"),
        company_state: yup.string().required("State is required"),
        company_zipCode: yup.string().required("Zip Code is required"),
        company_city: yup.string().required("City Name is required"),
        tax_year: yup.string().required("Tax Year is required"),
      }),
    []
  );
  const resolver = useYupValidationResolver(validationSchema);
  const { handleSubmit, register, errors, control } = useForm({ resolver });

  const [data, setData] = useState(states);

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
  console.log(props.stepOne);
  return (
    <div className="PayStubForm  mt-5 stepOne">
      <div style={{ paddingLeft: "10%", paddingRight: "10%" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <span className="badge badge-pill badge-soft-primary">Step 1</span>
          <h2>Company Information</h2>
          <hr />
          <Typography>Note:</Typography>
          <Typography className="mainTypo">
            <span id="red">*</span> marked fields are mandatory, the rest are
            optional
          </Typography>
          <br />
          <div className="form-group required" style={{ width: "100%" }}>
            <label htmlFor="selectedState" className="label-input">
              Tax Year
            </label>
            <select
              ref={register}
              placeholder="Select Tax Year"
              defaultValue={props.stepOne?.tax_year}
              autoComplete="off"
              className={
                "form-control " + (errors.tax_year ? "is-invalid" : "")
              }
              id="tax_year"
              name="tax_year"
            >
              <option>Select Tax Year</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
            </select>
            <small id="passwordHelp" className="text-danger">
              {errors.tax_year && <span>{errors.tax_year.message}</span>}
            </small>
          </div>
          <div className="form-group required">
            <label htmlFor="company_name" className="label-input">
              Employer Identification Number (EIN)
            </label>

            <Controller
              as={InputMask}
              control={control}
              className={
                "form-control " + (errors.employer_ein ? "is-invalid" : "")
              }
              placeholder="XX-XXXXXX"
              mask="99-9999999"
              defaultValue={props.stepOne?.employer_ein}
              name="employer_ein"
            />
            <small id="passwordHelp" className="text-danger">
              {errors.employer_ein && (
                <span>{errors.employer_ein.message}</span>
              )}
            </small>
          </div>
          <div className="form-group required">
            <label htmlFor="company_name" className="label-input">
              Business Name
            </label>
            <input
              ref={register}
              type="text"
              className={
                "form-control " + (errors.business_name ? "is-invalid" : "")
              }
              placeholder="Enter Business Name"
              defaultValue={props.stepOne?.business_name}
              id="business_name"
              name="business_name"
            />
            <small id="passwordHelp">
              {errors.business_name && (
                <span>{errors.business_name.message}</span>
              )}
            </small>
          </div>
          <div className="form-group required">
            <label htmlFor="company_name" className="label-input">
              Company Address
            </label>
            <input
              ref={register}
              type="text"
              className={
                "form-control " + (errors.company_address ? "is-invalid" : "")
              }
              placeholder="Ex. Dr. Paystub"
              id="company_address"
              defaultValue={props.stepOne?.company_address}
              name="company_address"
            />
            <small id="passwordHelp">
              {errors.company_address && (
                <span>{errors.company_address.message}</span>
              )}
            </small>
          </div>
          <Row>
            <Col>
              <label htmlFor="company_name" className="label-input">
                Apt/Ste No.
              </label>
              <input
                name="company_ste_no"
                defaultValue={props.stepOne?.company_ste_no}
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
                  name="company_zipCode"
                  defaultValue={props.stepOne?.company_zipCode}
                  type="number"
                  ref={register}
                  className={
                    "form-control " +
                    (errors.company_zipCode ? "is-invalid" : "")
                  }
                  placeholder="EX. 98225"
                />
                <small id="passwordHelp" className="text-danger">
                  {errors.company_zipCode && (
                    <span>{errors.company_zipCode.message}</span>
                  )}
                </small>
              </div>
            </Col>
          </Row>

          <Row>
            <Col>
              <label htmlFor="company_name" className="label-input required">
                City
              </label>
              <input
                name="company_city"
                defaultValue={props.stepOne?.company_city}
                type="text"
                ref={register}
                className={
                  "form-control " + (errors.company_city ? "is-invalid" : "")
                }
                placeholder="optional"
              />
              <small id="passwordHelp" className="text-danger">
                {errors.company_city && (
                  <span>{errors.company_city.message}</span>
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
                    "form-control " + (errors.company_state ? "is-invalid" : "")
                  }
                  name="company_state"
                  defaultValue={props.stepOne?.company_state}
                >
                  <option value="">Select State</option>
                  {getAllStates()}
                </select>
                <small id="passwordHelp" className="text-danger">
                  {errors.company_state && (
                    <span>{errors.company_state.message}</span>
                  )}
                </small>
              </div>
            </Col>
          </Row>
          <div className="form-group ">
            <label htmlFor="company_name" className="label-input">
              Control Number<span className="text-muted">(Optional)</span>
            </label>
            <input
              ref={register}
              type="number"
              className="form-control "
              placeholder="Ex. 123456"
              name="company_control_number"
              defaultValue={props.stepOne?.company_control_number}
            />
          </div>
          <div className="form-group ">
            <label htmlFor="company_name" className="label-input">
              State ID Number<span className="text-muted">(Optional)</span>
            </label>
            <input
              ref={register}
              type="number"
              className="form-control "
              placeholder="Ex. 123456"
              id="company_state_id_number"
              name="company_state_id_number"
              defaultValue={props.stepOne?.company_state_id_number}
            />
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
  stepOneFn: AC.stepOne,
})(StepOne);
