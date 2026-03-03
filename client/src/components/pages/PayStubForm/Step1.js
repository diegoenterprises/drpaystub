import React, { useEffect, useMemo } from "react";
import "./PayStubForm.scss";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import useYupValidationResolver from "../../../HelperFunctions/UseYupValidation";
import { Typography } from "@material-ui/core";
import { connect } from "react-redux";
import AC from "../../../redux/actions/actionCreater";
import { states } from "./states";

function Step1(props) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const validationSchema = useMemo(
    () =>
      yup.object({
        company_name: yup.string().required("Company Name is required"),
        emailAddress: yup
          .string()
          .required("A valid Email Address is required"),
        company_image: yup
          .mixed()
          .nullable()
          .test("fileSize", "File too large", (files) => {
            let valid = true;

            for (let index = 0; index < files.length; index++) {
              const formatedSize = files[index].size / (1024 * 1024);
              console.log(formatedSize);
              if (formatedSize > 1) valid = false;
            }

            return valid;
          }),
      }),
    []
  );
  const resolver = useYupValidationResolver(validationSchema);
  const { handleSubmit, register, errors } = useForm({ resolver });
  const onSubmit = (data) => {
    props.changeStep(2);
    props.step1Fn(data);
  };
  return (
    <div className="PayStubForm formStep mt-5">
      <form onSubmit={handleSubmit(onSubmit)}>
        <span className="badge badge-pill badge-soft-primary">Step 1</span>
        <h2>Company Information</h2>
        <hr />
        <Typography>Note:</Typography>
        <Typography style={{ fontStyle: "italic", fontSize: 13 }}>
          <span style={{ color: "red" }}>*</span> marked fields are mandatory,
          the rest are optional
        </Typography>
        <br />
        <div className="form-group required">
          <label htmlFor="company_name" className="label-input">
            Company Name
          </label>
          <input
            ref={register}
            type="text"
            className={
              "form-control " + (errors.company_name ? "is-invalid" : "")
            }
            placeholder="Ex. Dr. Paystub"
            id="company_name"
            name="company_name"
            defaultValue={props.step1.company_name}
            style={{ width: "100%" }}
          />
          <small id="passwordHelp">
            {errors.company_name && <span>{errors.company_name.message}</span>}
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="company_address">
            Address <span className="text-muted">(Optional)</span>
          </label>
          <input
            type="text"
            ref={register}
            className="form-control"
            placeholder="Ex. 10000 Spice Ln"
            id="company_address"
            defaultValue={props.step1.company_address}
            name="company_address"
            onChange={(e) => props.handleChange(e, 1)}
            value={props.content.company_address}
            style={{ width: "100%" }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="company_address_2">
            Address 2<span className="text-muted">(Optional)</span>
          </label>
          <input
            type="text"
            ref={register}
            className="form-control"
            placeholder="Ex. Unit #713"
            id="company_address_2"
            defaultValue={props.step1?.company_address_2}
            name="company_address_2"
            onChange={(e) => props.handleChange(e, 1)}
            value={props.content.company_address_2}
            style={{ width: "100%" }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="company_city">
            City <span className="text-muted">(Optional)</span>
          </label>
          <input
            type="text"
            ref={register}
            className="form-control"
            placeholder="Ex. Houston"
            id="company_city"
            defaultValue={props.step1?.company_city}
            name="company_city"
            onChange={(e) => props.handleChange(e, 1)}
            value={props.content.company_city}
            style={{ width: "100%" }}
          />
        </div>
        <div className="form-group required" style={{ width: "100%" }}>
          <label htmlFor="company_state" className="label-input">
            State{" "}
          </label>
          <select
            ref={register}
            placeholder="Select State"
            autoComplete="off"
            defaultValue={props.company_state}
            className={
              "form-control " + (errors.company_state ? "is-invalid" : "")
            }
            id="company_state"
            name="company_state"
          >
            <option value="">Select State</option>
            {states.map((state) => {
              return (
                <option value={state.name}>
                  {state.name.substring(0, 1).toUpperCase() +
                    state.name.substring(1).toLowerCase()}
                </option>
              );
            })}
          </select>
          <small id="passwordHelp" className="text-danger">
            {errors.state && <span>{errors.state.message}</span>}
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="companyZipCode">
            Zip Code <span className="text-muted">(Optional)</span>
          </label>
          <input
            ref={register}
            type="number"
            className="form-control"
            placeholder="Ex. 77072"
            defaultValue={props.step1.companyZipCode}
            id="companyZipCode"
            name="companyZipCode"
            min="0"
            max="99999"
            onChange={(e) => props.handleChange(e, 1)}
            value={props.content.companyZipCode}
            style={{ width: "100%" }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="company_phone">
            Company Phone Number <span className="text-muted">(Optional)</span>
          </label>
          <input
            ref={register}
            type="number"
            className="form-control"
            placeholder="Ex. (535) 123-4567"
            defaultValue={props.step1.company_phone}
            id="company_phone"
            name="company_phone"
            onChange={(e) => props.handleChange(e, 1)}
            value={props.content.company_phone}
            style={{ width: "100%" }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="company_ein">
            Company EIN/SSN <span className="text-muted">(Optional)</span>
          </label>
          <input
            ref={register}
            type="text"
            className="form-control"
            defaultValue={props.step1.company_ein}
            placeholder="Ex. 21-5678232"
            id="company_ein"
            name="company_ein"
            pattern="[0-9]{2}-[0-9]{7}"
            onChange={(e) => props.handleChange(e, 1)}
            value={props.content.company_ein}
            title="Enter EIN in format XX-XXXXXXX"
            maxLength="10"
            style={{ width: "100%" }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="company_website">
            Company Website <span className="text-muted">(Optional — generates QR code on paystub)</span>
          </label>
          <input
            ref={register}
            type="url"
            className="form-control"
            placeholder="Ex. https://www.yourcompany.com"
            id="company_website"
            defaultValue={props.step1.company_website}
            name="company_website"
            onChange={(e) => props.handleChange(e, 1)}
            value={props.content.company_website}
            style={{ width: "100%" }}
          />
        </div>
        <div className="form-group required">
          <label htmlFor="emailAddress" className="label-input">
            Your email Address
          </label>
          <input
            type="email"
            className={
              "form-control " + (errors.emailAddress ? "is-invalid" : "")
            }
            placeholder="Your email address"
            id="emailAddress"
            defaultValue={props.step1.emailAddress}
            name="emailAddress"
            // onChange={e => props.handleChange(e, 1)}
            ref={register}
            style={{ width: "100%" }}
          />
          <small id="passwordHelp" className="text-danger">
            {errors.emailAddress && <span>{errors.emailAddress.message}</span>}
          </small>
        </div>
        <div className="form-group required">
          <label htmlFor="bankNumber">Bank Account Number</label>
          <input
            type="number"
            className="form-control"
            placeholder="Bank Account Number"
            id="bankNumber"
            defaultValue={props.step1.bankNumber}
            name="bankNumber"
            ref={register}
            style={{ width: "100%" }}
          />
        </div>
        <div className="form-group required">
          <label htmlFor="routingNumber">Bank Routing Number</label>
          <input
            type="number"
            className="form-control"
            placeholder="Bank Routing Number"
            id="routingNumber"
            defaultValue={props.step1.routingNumber}
            name="routingNumber"
            ref={register}
            style={{ width: "100%" }}
          />
        </div>
        <div className="form-group required">
          <label htmlFor="bank_name">Bank Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Bank Name"
            id="bank_name"
            defaultValue={props.step1.bank_name}
            name="bank_name"
            ref={register}
            style={{ width: "100%" }}
          />
        </div>
        <div className="form-group required">
          <label htmlFor="bank_street_address">Bank Street Address</label>
          <input
            type="text"
            className="form-control"
            placeholder="Bank Street Number"
            id="bank_street_address"
            defaultValue={props.step1.bank_street_address}
            name="bank_street_address"
            ref={register}
            style={{ width: "100%" }}
          />
        </div>
        <div class="row">
          <div class="col-4">
            <div className="form-group required">
              <label htmlFor="bank_city">Bank City</label>
              <input
                type="text"
                className="form-control"
                placeholder="City"
                id="bank_city"
                defaultValue={props.step1.bank_city}
                name="bank_city"
                ref={register}
                style={{ width: "100%" }}
              />
            </div>
          </div>
          <div class="col-4">
            <div className="form-group" style={{ width: "100%" }}>
              <label htmlFor="bank_state" className="label-input">
                Bank State
              </label>
              <select
                ref={register}
                placeholder="Select State"
                autoComplete="off"
                defaultValue={props.bank_state}
                className="form-control"
                id="bank_state"
                name="bank_state"
              >
                <option value="">Select State</option>
                {states.map((state) => {
                  return (
                    <option value={state.name}>
                      {state.name.substring(0, 1).toUpperCase() +
                        state.name.substring(1).toLowerCase()}
                    </option>
                  );
                })}
              </select>
              <small id="passwordHelp" className="text-danger">
                {errors.state && <span>{errors.state.message}</span>}
              </small>
            </div>
          </div>
          <div class="col-4">
            <div className="form-group required">
              <label htmlFor="bank_zip">Bank Zipcode</label>
              <input
                type="number"
                className="form-control"
                placeholder="Bank Zipcode"
                id="bank_zip"
                defaultValue={props.step1.bank_zip}
                name="bank_zip"
                ref={register}
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </div>
        <div className="form-group required">
          <label htmlFor="manager">Manager</label>
          <input
            type="text"
            className="form-control"
            placeholder="Manager"
            id="manager"
            defaultValue={props.step1.manager}
            name="manager"
            ref={register}
            style={{ width: "100%" }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="company_image">Company Logo</label>
          <input
            ref={register}
            type="file"
            className=" form-control-file "
            placeholder="Enter company Logo"
            id="company_image"
            name="company_image"
            accept="image/png"
            onChange={async (e) => {
              let file = e.target.files.item("0");
              props.imageUpload(file);
            }}
            style={{ borderRadius: 3, width: "100%" }}
          />
          <small id="passwordHelp" className="text-danger">
            {errors.company_image && (
              <span>{errors.company_image.message}</span>
            )}
          </small>
        </div>
        <div className=" mt-4">
          <button type="submit" className="btn btn-secondary">
            Employee Information <i className="fa fa-chevron-right"></i>
          </button>
        </div>
      </form>
    </div>
  );
}

export default connect((state) => state, {
  step1Fn: AC.step1,
  imageUpload: AC.imageUpload,
})(Step1);

function convertToUrl(file) {
  return new Promise((res, rej) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      res(reader.result);
    });

    reader.readAsDataURL(file);
  });
}
