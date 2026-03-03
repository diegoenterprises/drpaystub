import {
  FormControlLabel,
  FormGroup,
  Switch,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import useYupValidationResolver from "../../../HelperFunctions/UseYupValidation";
import HelpIcon from "@material-ui/icons/Help";
import NumberFormat from "react-number-format";
import "./wstub.css";
import { Col, Row } from "react-bootstrap";
import AC from "../../../redux/actions/actionCreater";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

function StepThree(props) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const onSubmit = (data) => {
    console.log("this is step 3", { data });

    props.stepThreeFn({
      ...data,
      allocated_tips: getValue(data.allocated_tips),
      dependent_cate_benefits: getValue(data.dependent_cate_benefits),
      non_qualified_plans: getValue(data.non_qualified_plans),
      taxCode_12a: {
        taxCode: data.taxCode_12a,
        amount: getValue(data.amount_a),
      },
      taxCode_12b: {
        taxCode: data.taxCode_12b,
        amount: getValue(data.amount_b),
      },
      taxCode_12c: {
        taxCode: data.taxCode_12c,
        amount: getValue(data.amount_c),
      },
      taxCode_12d: {
        taxCode: data.taxCode_12d,
        amount: getValue(data.amount_d),
      },
      extras: {
        statutory_employee: data.statutory_employee,
        retirement_plan: data.retirement_plan,
        third_Party_sick_pay: data.third_Party_sick_pay,
      },
      exemptions: {
        federal_income_tax: data.federal_income_tax,
        social_security: data.social_security,
        medicare: data.medicare,
        additional_medicare: data.additional_medicare,
        Kansas_state_tax: data.Kansas_state_tax,
      },
    });

    props.changeStep(4);
  };
  const validationSchema = useMemo(
    () =>
      yup.object({
        employer_email: yup.string().required("Email Address is required"),
      }),
    []
  );

  const resolver = useYupValidationResolver(validationSchema);
  const { handleSubmit, register, errors, control } = useForm({ resolver });
  const getValue = (value) => {
    var reg = new RegExp("^[0-9]+$");
    return value
      .split("")
      .filter((el) => reg.test(el))
      .join("");
  };
  const [state, setState] = React.useState({
    checkedB: false,
  });
  const handleCheckChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
  console.log(props.stepThree);
  return (
    <div className="PayStubForm  mt-5 stepOne">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ paddingLeft: "10%", paddingRight: "10%" }}>
          <span className="badge badge-pill badge-soft-primary">Step 3</span>
          <h2>More Information</h2>
          <hr />
          <Typography>Note:</Typography>
          <Typography className="mainTypo">
            <span id="red">*</span> marked fields are mandatory, the rest are
            optional
          </Typography>
          <br />

          <div className="form-group required">
            <label className="label-input">Email Address</label>
            <input
              ref={register}
              type="text"
              className={
                "form-control " + (errors.employer_email ? "is-invalid" : "")
              }
              placeholder="Enter Email Address"
              id="employer_email"
              name="employer_email"
              defaultValue={props.stepThree?.employer_email}
            />
            <small id="passwordHelp">
              {errors.employer_email && (
                <span>{errors.employer_email.message}</span>
              )}
            </small>
          </div>
          <div className="form-group " style={{ width: "100%" }}>
            <label className="label-input">Allocated Tips</label>
            <span className="text-muted">(Optional)</span>
            <NumberFormat
              customInput="input"
              type="text"
              getInputRef={register}
              className="form-control "
              placeholder="Ex. 60,000"
              id="allocated_tips"
              name="allocated_tips"
              defaultValue={props.stepThree?.allocated_tips}
              maxLength="20"
              thousandSeparator={true}
              prefix={"$"}
            />
          </div>
          <div className="form-group " style={{ width: "100%" }}>
            <label className="label-input">Dependent Cate Benefits</label>
            <span className="text-muted">(Optional)</span>
            <NumberFormat
              customInput="input"
              type="text"
              getInputRef={register}
              className="form-control "
              placeholder="Ex. 60,000"
              id="dependent_cate_benefits"
              name="dependent_cate_benefits"
              defaultValue={props.stepThree?.dependent_cate_benefits}
              maxLength="20"
              thousandSeparator={true}
              prefix={"$"}
            />
          </div>
          <div className="form-group " style={{ width: "100%" }}>
            <label className="label-input">Non-Qualified Plans</label>
            <span className="text-muted">(Optional)</span>
            <NumberFormat
              customInput="input"
              type="text"
              getInputRef={register}
              className="form-control "
              placeholder="Ex. 60,000"
              id="non_qualified_plans"
              name="non_qualified_plans"
              defaultValue={props.stepThree?.non_qualified_plans}
              maxLength="20"
              thousandSeparator={true}
              prefix={"$"}
            />
          </div>
          <label>
            Tax Codes <span className="text-muted">(Optional)</span>
          </label>
          <Row>
            <Col>
              <div className="form-group" style={{ width: "100%" }}>
                <label>Tax Code(12a)</label>
                <select
                  ref={register}
                  placeholder="Number of Dependants"
                  autoComplete="off"
                  className="form-control"
                  name="taxCode_12a"
                  defaultValue={props.stepThree?.taxCode_12a?.taxCode}
                >
                  <option value="">Select</option>
                  <option value="A">
                    {" "}
                    A — Uncollected Social Security or RRTA tax on tips. Include
                    this tax on Form 1040 Schedule 4 line 58.
                  </option>

                  <option value="B">
                    B — Uncollected Medicare tax on tips. Include this tax on
                    Form 1040 Schedule 4 line 58.
                  </option>
                  <option value="C">
                    C — Taxable costs of group-term life insurance over $50,000
                    (included in W-2 boxes 1,3 (up to Social Security wages
                    base), and box 5.
                  </option>
                  <option value="D">
                    D — Elective deferral under a 401(k) cash or arrangement
                    plan. This includes a SIMPLE 401(k) arrangement.
                  </option>
                  <option value="E">
                    E — Elective deferrals under a Section 403(b) salary
                    reduction agreement.
                  </option>
                  <option value="F">
                    F — Elective deferrals under a Section 408(k)(6) salary
                    reduction SEP.
                  </option>
                  <option value="G">5</option>

                  <option value="H">
                    G — Elective deferrals and employer contributions (including
                    non-elective deferrals) to a Section 457(b) deferred
                    compensation plan.
                  </option>

                  <option value="I">
                    H — Elective deferrals to a Section 501(c)(18)(D) tax-exempt
                    organization plan.
                  </option>

                  <option value="J">
                    J — Nontaxable sick pay (information only, not included in
                    W-2 boxes 1, 3, or 5).
                  </option>

                  <option value="K">
                    K — 20% excise tax on excess golden parachute payments.
                  </option>

                  <option value="L">
                    L — Substantiated employee business expense reimbursements
                    (nontaxable).
                  </option>

                  <option value="M">
                    M — Uncollected Social Security or RRTA tax on taxable cost
                    of group-term life insurance over $50,000 (former employees
                    only).
                  </option>

                  <option value="N">
                    N — Uncollected Medicare tax on taxable cost of group-term
                    life insurance over $50,000 (former employees only).
                  </option>

                  <option value="P">
                    P — Excludable moving expense reimbursements paid directly
                    to a member of the U.S. Armed Forces. (not included in Boxes
                    1, 3, or 5)
                  </option>

                  <option value="Q">
                    Q — Nontaxable combat pay. See the instructions for Form
                    1040 or Form 1040A for details on reporting this amount.
                  </option>

                  <option value="R">
                    R — Employer contributions to your Archer medical savings
                    account (MSA). Report on Form 8853:, Archer MSAs and
                    Long-Term Care Insurance Contracts.
                  </option>

                  <option value="S">
                    S — Employee salary reduction contributions under a Section
                    408(p) SIMPLE. (Not included in Box 1)
                  </option>

                  <option value="T">
                    T — Adoption benefits (not included in Box 1). Complete Form
                    8839:, Qualified Adoption Expenses, to compute any taxable
                    and nontaxable amounts.
                  </option>

                  <option value="V">
                    V — Income from exercise of non-statutory stock option(s)
                    (included in Boxes 1, 3 (up to Social Security wage base),
                    and 5). See Publication 525, Taxable and Nontaxable Income,
                    for reporting requirements.
                  </option>

                  <option value="W">
                    W — Employer contributions (including amounts the employee
                    elected to contribute using a Section 125 cafeteria plan) to
                    your health savings account (HSA).
                  </option>

                  <option value="Y">
                    Y — Deferrals under a Section 409A nonqualified deferred
                    compensation plan.
                  </option>
                  <option value="Z">
                    Z — Income under a nonqualified deferred compensation plan
                    that fails to satisfy Section 409A. This amount is also
                    included in Box 1 and is subject to an additional 20% tax
                    plus interest. See Form 1040 instructions for more
                    information.
                  </option>

                  <option value="AA">
                    AA — Designated Roth contribution under a 401(k) plan.{" "}
                  </option>

                  <option value="BB">
                    BB — Designated Roth contributions under a 403(b) plan.
                  </option>

                  <option value="CC">CC — For employer use only.</option>

                  <option value="DD">
                    DD — Cost of employer-sponsored health coverage.
                  </option>

                  <option value="EE">
                    EE — Designated Roth contributions under a governmental
                    457(b) plan. This amount doesn’t apply to contributions
                    under a tax-exempt organization Section 457(b) plan.
                  </option>

                  <option value="FF">
                    FF — Permitted benefits under a qualified small employer
                    health reimbursement arrangement.
                  </option>

                  <option value="GG">
                    GG — Income from qualified equity grants under section
                    83(i).
                  </option>

                  <option value="HH">
                    HH — Aggregate deferrals under section 83(i) elections as of
                    the close of the calendar year.
                  </option>
                </select>
              </div>
            </Col>
            <Col>
              <div className="form-group " style={{ width: "100%" }}>
                <label className="label-input">Amount</label>
                <NumberFormat
                  customInput="input"
                  type="text"
                  getInputRef={register}
                  className="form-control "
                  placeholder="Ex. 60,000"
                  name="amount_a"
                  defaultValue={props.stepThree?.amount_a}
                  maxLength="20"
                  thousandSeparator={true}
                  prefix={"$"}
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="form-group" style={{ width: "100%" }}>
                <label>Tax Code(12b)</label>
                <select
                  ref={register}
                  placeholder="Number of Dependants"
                  autoComplete="off"
                  className="form-control"
                  name="taxCode_12b"
                  defaultValue={props.stepThree?.taxCode_12b?.taxCode}
                >
                  <option value="">Select</option>
                  <option value="A">
                    {" "}
                    A — Uncollected Social Security or RRTA tax on tips. Include
                    this tax on Form 1040 Schedule 4 line 58.
                  </option>

                  <option value="B">
                    B — Uncollected Medicare tax on tips. Include this tax on
                    Form 1040 Schedule 4 line 58.
                  </option>
                  <option value="C">
                    C — Taxable costs of group-term life insurance over $50,000
                    (included in W-2 boxes 1,3 (up to Social Security wages
                    base), and box 5.
                  </option>
                  <option value="D">
                    D — Elective deferral under a 401(k) cash or arrangement
                    plan. This includes a SIMPLE 401(k) arrangement.
                  </option>
                  <option value="E">
                    E — Elective deferrals under a Section 403(b) salary
                    reduction agreement.
                  </option>
                  <option value="F">
                    F — Elective deferrals under a Section 408(k)(6) salary
                    reduction SEP.
                  </option>
                  <option value="G">5</option>

                  <option value="H">
                    G — Elective deferrals and employer contributions (including
                    non-elective deferrals) to a Section 457(b) deferred
                    compensation plan.
                  </option>

                  <option value="I">
                    H — Elective deferrals to a Section 501(c)(18)(D) tax-exempt
                    organization plan.
                  </option>

                  <option value="J">
                    J — Nontaxable sick pay (information only, not included in
                    W-2 boxes 1, 3, or 5).
                  </option>

                  <option value="K">
                    K — 20% excise tax on excess golden parachute payments.
                  </option>

                  <option value="L">
                    L — Substantiated employee business expense reimbursements
                    (nontaxable).
                  </option>

                  <option value="M">
                    M — Uncollected Social Security or RRTA tax on taxable cost
                    of group-term life insurance over $50,000 (former employees
                    only).
                  </option>

                  <option value="N">
                    N — Uncollected Medicare tax on taxable cost of group-term
                    life insurance over $50,000 (former employees only).
                  </option>

                  <option value="P">
                    P — Excludable moving expense reimbursements paid directly
                    to a member of the U.S. Armed Forces. (not included in Boxes
                    1, 3, or 5)
                  </option>

                  <option value="Q">
                    Q — Nontaxable combat pay. See the instructions for Form
                    1040 or Form 1040A for details on reporting this amount.
                  </option>

                  <option value="R">
                    R — Employer contributions to your Archer medical savings
                    account (MSA). Report on Form 8853:, Archer MSAs and
                    Long-Term Care Insurance Contracts.
                  </option>

                  <option value="S">
                    S — Employee salary reduction contributions under a Section
                    408(p) SIMPLE. (Not included in Box 1)
                  </option>

                  <option value="T">
                    T — Adoption benefits (not included in Box 1). Complete Form
                    8839:, Qualified Adoption Expenses, to compute any taxable
                    and nontaxable amounts.
                  </option>

                  <option value="V">
                    V — Income from exercise of non-statutory stock option(s)
                    (included in Boxes 1, 3 (up to Social Security wage base),
                    and 5). See Publication 525, Taxable and Nontaxable Income,
                    for reporting requirements.
                  </option>

                  <option value="W">
                    W — Employer contributions (including amounts the employee
                    elected to contribute using a Section 125 cafeteria plan) to
                    your health savings account (HSA).
                  </option>

                  <option value="Y">
                    Y — Deferrals under a Section 409A nonqualified deferred
                    compensation plan.
                  </option>
                  <option value="Z">
                    Z — Income under a nonqualified deferred compensation plan
                    that fails to satisfy Section 409A. This amount is also
                    included in Box 1 and is subject to an additional 20% tax
                    plus interest. See Form 1040 instructions for more
                    information.
                  </option>

                  <option value="AA">
                    AA — Designated Roth contribution under a 401(k) plan.{" "}
                  </option>

                  <option value="BB">
                    BB — Designated Roth contributions under a 403(b) plan.
                  </option>

                  <option value="CC">CC — For employer use only.</option>

                  <option value="DD">
                    DD — Cost of employer-sponsored health coverage.
                  </option>

                  <option value="EE">
                    EE — Designated Roth contributions under a governmental
                    457(b) plan. This amount doesn’t apply to contributions
                    under a tax-exempt organization Section 457(b) plan.
                  </option>

                  <option value="FF">
                    FF — Permitted benefits under a qualified small employer
                    health reimbursement arrangement.
                  </option>

                  <option value="GG">
                    GG — Income from qualified equity grants under section
                    83(i).
                  </option>

                  <option value="HH">
                    HH — Aggregate deferrals under section 83(i) elections as of
                    the close of the calendar year.
                  </option>
                </select>
              </div>
            </Col>
            <Col>
              <div className="form-group " style={{ width: "100%" }}>
                <label className="label-input">Amount</label>
                <NumberFormat
                  customInput="input"
                  type="text"
                  getInputRef={register}
                  className="form-control "
                  placeholder="Ex. 60,000"
                  id="amount"
                  name="amount_b"
                  defaultValue={props.stepThree?.amount_b}
                  maxLength="20"
                  thousandSeparator={true}
                  prefix={"$"}
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="form-group" style={{ width: "100%" }}>
                <label>Tax Code(12c)</label>
                <select
                  ref={register}
                  placeholder="Number of Dependants"
                  autoComplete="off"
                  className="form-control"
                  name="taxCode_12c"
                  defaultValue={props.stepThree?.taxCode_12c?.taxCode}
                >
                  <option value="">Select</option>
                  <option value="A">
                    {" "}
                    A — Uncollected Social Security or RRTA tax on tips. Include
                    this tax on Form 1040 Schedule 4 line 58.
                  </option>

                  <option value="B">
                    B — Uncollected Medicare tax on tips. Include this tax on
                    Form 1040 Schedule 4 line 58.
                  </option>
                  <option value="C">
                    C — Taxable costs of group-term life insurance over $50,000
                    (included in W-2 boxes 1,3 (up to Social Security wages
                    base), and box 5.
                  </option>
                  <option value="D">
                    D — Elective deferral under a 401(k) cash or arrangement
                    plan. This includes a SIMPLE 401(k) arrangement.
                  </option>
                  <option value="E">
                    E — Elective deferrals under a Section 403(b) salary
                    reduction agreement.
                  </option>
                  <option value="F">
                    F — Elective deferrals under a Section 408(k)(6) salary
                    reduction SEP.
                  </option>
                  <option value="G">5</option>

                  <option value="H">
                    G — Elective deferrals and employer contributions (including
                    non-elective deferrals) to a Section 457(b) deferred
                    compensation plan.
                  </option>

                  <option value="I">
                    H — Elective deferrals to a Section 501(c)(18)(D) tax-exempt
                    organization plan.
                  </option>

                  <option value="J">
                    J — Nontaxable sick pay (information only, not included in
                    W-2 boxes 1, 3, or 5).
                  </option>

                  <option value="K">
                    K — 20% excise tax on excess golden parachute payments.
                  </option>

                  <option value="L">
                    L — Substantiated employee business expense reimbursements
                    (nontaxable).
                  </option>

                  <option value="M">
                    M — Uncollected Social Security or RRTA tax on taxable cost
                    of group-term life insurance over $50,000 (former employees
                    only).
                  </option>

                  <option value="N">
                    N — Uncollected Medicare tax on taxable cost of group-term
                    life insurance over $50,000 (former employees only).
                  </option>

                  <option value="P">
                    P — Excludable moving expense reimbursements paid directly
                    to a member of the U.S. Armed Forces. (not included in Boxes
                    1, 3, or 5)
                  </option>

                  <option value="Q">
                    Q — Nontaxable combat pay. See the instructions for Form
                    1040 or Form 1040A for details on reporting this amount.
                  </option>

                  <option value="R">
                    R — Employer contributions to your Archer medical savings
                    account (MSA). Report on Form 8853:, Archer MSAs and
                    Long-Term Care Insurance Contracts.
                  </option>

                  <option value="S">
                    S — Employee salary reduction contributions under a Section
                    408(p) SIMPLE. (Not included in Box 1)
                  </option>

                  <option value="T">
                    T — Adoption benefits (not included in Box 1). Complete Form
                    8839:, Qualified Adoption Expenses, to compute any taxable
                    and nontaxable amounts.
                  </option>

                  <option value="V">
                    V — Income from exercise of non-statutory stock option(s)
                    (included in Boxes 1, 3 (up to Social Security wage base),
                    and 5). See Publication 525, Taxable and Nontaxable Income,
                    for reporting requirements.
                  </option>

                  <option value="W">
                    W — Employer contributions (including amounts the employee
                    elected to contribute using a Section 125 cafeteria plan) to
                    your health savings account (HSA).
                  </option>

                  <option value="Y">
                    Y — Deferrals under a Section 409A nonqualified deferred
                    compensation plan.
                  </option>
                  <option value="Z">
                    Z — Income under a nonqualified deferred compensation plan
                    that fails to satisfy Section 409A. This amount is also
                    included in Box 1 and is subject to an additional 20% tax
                    plus interest. See Form 1040 instructions for more
                    information.
                  </option>

                  <option value="AA">
                    AA — Designated Roth contribution under a 401(k) plan.{" "}
                  </option>

                  <option value="BB">
                    BB — Designated Roth contributions under a 403(b) plan.
                  </option>

                  <option value="CC">CC — For employer use only.</option>

                  <option value="DD">
                    DD — Cost of employer-sponsored health coverage.
                  </option>

                  <option value="EE">
                    EE — Designated Roth contributions under a governmental
                    457(b) plan. This amount doesn’t apply to contributions
                    under a tax-exempt organization Section 457(b) plan.
                  </option>

                  <option value="FF">
                    FF — Permitted benefits under a qualified small employer
                    health reimbursement arrangement.
                  </option>

                  <option value="GG">
                    GG — Income from qualified equity grants under section
                    83(i).
                  </option>

                  <option value="HH">
                    HH — Aggregate deferrals under section 83(i) elections as of
                    the close of the calendar year.
                  </option>
                </select>
              </div>
            </Col>
            <Col>
              <div className="form-group " style={{ width: "100%" }}>
                <label className="label-input">Amount</label>
                <NumberFormat
                  customInput="input"
                  type="text"
                  getInputRef={register}
                  className="form-control "
                  placeholder="Ex. 60,000"
                  id="amount"
                  name="amount_c"
                  defaultValue={props.stepThree?.amount_c}
                  maxLength="20"
                  thousandSeparator={true}
                  prefix={"$"}
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="form-group" style={{ width: "100%" }}>
                <label>Tax Code(12d)</label>
                <select
                  ref={register}
                  placeholder="Number of Dependants"
                  autoComplete="off"
                  className="form-control"
                  name="taxCode_12d"
                  defaultValue={props.stepThree?.taxCode_12d?.taxCode}
                >
                  <option value="">Select</option>
                  <option value="A">
                    {" "}
                    A — Uncollected Social Security or RRTA tax on tips. Include
                    this tax on Form 1040 Schedule 4 line 58.
                  </option>

                  <option value="B">
                    B — Uncollected Medicare tax on tips. Include this tax on
                    Form 1040 Schedule 4 line 58.
                  </option>
                  <option value="C">
                    C — Taxable costs of group-term life insurance over $50,000
                    (included in W-2 boxes 1,3 (up to Social Security wages
                    base), and box 5.
                  </option>
                  <option value="D">
                    D — Elective deferral under a 401(k) cash or arrangement
                    plan. This includes a SIMPLE 401(k) arrangement.
                  </option>
                  <option value="E">
                    E — Elective deferrals under a Section 403(b) salary
                    reduction agreement.
                  </option>
                  <option value="F">
                    F — Elective deferrals under a Section 408(k)(6) salary
                    reduction SEP.
                  </option>
                  <option value="G">5</option>

                  <option value="H">
                    G — Elective deferrals and employer contributions (including
                    non-elective deferrals) to a Section 457(b) deferred
                    compensation plan.
                  </option>

                  <option value="I">
                    H — Elective deferrals to a Section 501(c)(18)(D) tax-exempt
                    organization plan.
                  </option>

                  <option value="J">
                    J — Nontaxable sick pay (information only, not included in
                    W-2 boxes 1, 3, or 5).
                  </option>

                  <option value="K">
                    K — 20% excise tax on excess golden parachute payments.
                  </option>

                  <option value="L">
                    L — Substantiated employee business expense reimbursements
                    (nontaxable).
                  </option>

                  <option value="M">
                    M — Uncollected Social Security or RRTA tax on taxable cost
                    of group-term life insurance over $50,000 (former employees
                    only).
                  </option>

                  <option value="N">
                    N — Uncollected Medicare tax on taxable cost of group-term
                    life insurance over $50,000 (former employees only).
                  </option>

                  <option value="P">
                    P — Excludable moving expense reimbursements paid directly
                    to a member of the U.S. Armed Forces. (not included in Boxes
                    1, 3, or 5)
                  </option>

                  <option value="Q">
                    Q — Nontaxable combat pay. See the instructions for Form
                    1040 or Form 1040A for details on reporting this amount.
                  </option>

                  <option value="R">
                    R — Employer contributions to your Archer medical savings
                    account (MSA). Report on Form 8853:, Archer MSAs and
                    Long-Term Care Insurance Contracts.
                  </option>

                  <option value="S">
                    S — Employee salary reduction contributions under a Section
                    408(p) SIMPLE. (Not included in Box 1)
                  </option>

                  <option value="T">
                    T — Adoption benefits (not included in Box 1). Complete Form
                    8839:, Qualified Adoption Expenses, to compute any taxable
                    and nontaxable amounts.
                  </option>

                  <option value="V">
                    V — Income from exercise of non-statutory stock option(s)
                    (included in Boxes 1, 3 (up to Social Security wage base),
                    and 5). See Publication 525, Taxable and Nontaxable Income,
                    for reporting requirements.
                  </option>

                  <option value="W">
                    W — Employer contributions (including amounts the employee
                    elected to contribute using a Section 125 cafeteria plan) to
                    your health savings account (HSA).
                  </option>

                  <option value="Y">
                    Y — Deferrals under a Section 409A nonqualified deferred
                    compensation plan.
                  </option>
                  <option value="Z">
                    Z — Income under a nonqualified deferred compensation plan
                    that fails to satisfy Section 409A. This amount is also
                    included in Box 1 and is subject to an additional 20% tax
                    plus interest. See Form 1040 instructions for more
                    information.
                  </option>

                  <option value="AA">
                    AA — Designated Roth contribution under a 401(k) plan.{" "}
                  </option>

                  <option value="BB">
                    BB — Designated Roth contributions under a 403(b) plan.
                  </option>

                  <option value="CC">CC — For employer use only.</option>

                  <option value="DD">
                    DD — Cost of employer-sponsored health coverage.
                  </option>

                  <option value="EE">
                    EE — Designated Roth contributions under a governmental
                    457(b) plan. This amount doesn’t apply to contributions
                    under a tax-exempt organization Section 457(b) plan.
                  </option>

                  <option value="FF">
                    FF — Permitted benefits under a qualified small employer
                    health reimbursement arrangement.
                  </option>

                  <option value="GG">
                    GG — Income from qualified equity grants under section
                    83(i).
                  </option>

                  <option value="HH">
                    HH — Aggregate deferrals under section 83(i) elections as of
                    the close of the calendar year.
                  </option>
                </select>
              </div>
            </Col>
            <Col>
              <div className="form-group " style={{ width: "100%" }}>
                <label className="label-input">Amount</label>
                <NumberFormat
                  customInput="input"
                  type="text"
                  getInputRef={register}
                  className="form-control "
                  placeholder="Ex. 60,000"
                  id="amount"
                  name="amount_d"
                  defaultValue={props.stepThree?.amount_d}
                  maxLength="20"
                  thousandSeparator={true}
                  prefix={"$"}
                />
              </div>
            </Col>
          </Row>
          <label>Do Any Of The Following Apply To This Employee?</label>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                className="mr-auto"
                ref={register}
                name="statutory_employee"
                defaultValue={props.stepThree?.statutory_employee}
                value={true}
              />
              <span style={{ padding: "10px" }}>Statutory Employee</span>
            </label>
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                className="mr-auto"
                ref={register}
                name="retirement_plan"
                defaultValue={props.stepThree?.retirement_plan}
                value={true}
              />
              <span style={{ padding: "10px" }}>Retirement Plan</span>
            </label>
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                className="mr-auto"
                ref={register}
                name="third_Party_sick_pay"
                defaultValue={props.stepThree?.third_Party_sick_pay}
                value={true}
              />
              <span style={{ padding: "10px" }}>Third-Party Sick Pay</span>
            </label>
          </div>
          <hr style={{ color: "black" }} />

          <FormGroup
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
              <label>Special Tax Exemptions </label>
              <HelpIcon style={{ marginLeft: 5, marginBottom: 5 }} />
            </div>
            <Typography style={{ fontSize: 15 }}>
              This employee has tax exemptions
            </Typography>
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
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  className="mr-auto"
                  ref={register}
                  name="federal_income_tax"
                  defaultValue={props.stepThree?.federal_income_tax}
                />
                <span style={{ padding: "10px" }}> Federal Income Tax</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  className="mr-auto"
                  ref={register}
                  name="social_security"
                  defaultValue={props.stepThree?.social_security}
                />
                <span style={{ padding: "10px" }}> Social Security</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  className="mr-auto"
                  ref={register}
                  name="medicare"
                  defaultValue={props.stepThree?.medicare}
                />
                <span style={{ padding: "10px" }}>Medicare</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  className="mr-auto"
                  ref={register}
                  name="additional_medicare"
                  defaultValue={props.stepThree?.additional_medicare}
                />
                <span style={{ padding: "10px" }}>Additional Medicare</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  className="mr-auto"
                  ref={register}
                  name="Kansas_state_tax"
                  defaultValue={props.stepThree?.Kansas_state_tax}
                />
                <span style={{ padding: "10px" }}> Kansas State Tax</span>
              </label>
            </div>
          ) : null}
          <div className="form-group required">
            <label className="custom-control custom-checkbox">
              <input
                required
                type="checkbox"
                className="custom-control-input"
                id="customCheck1"
              />
              <label className="custom-control-label" for="customCheck1">
                I Accept{" "}
                <Link className="text-primary" to="/terms-and-conditions">
                  Terms And Conditions
                </Link>
              </label>
            </label>
          </div>
          <div className=" mt-4">
            <button type="submit" className="btn btn-secondary">
              Review your Ready to file W2{" "}
              <i className="fa fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
export default connect((state) => state, {
  stepThreeFn: AC.stepThree,
})(StepThree);
