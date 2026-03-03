import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import useYupValidationResolver from "../../../HelperFunctions/UseYupValidation";
import "./PayStubForm.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import AC from "../../../redux/actions/actionCreater";
import NumberFormat from "react-number-format";

import { connect } from "react-redux";

import {
  FormControlLabel,
  FormGroup,
  Switch,
  Typography,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import {
  format,
  getHolidays,
  holidays,
} from "../../../HelperFunctions/holiday";
import { isValidObjectId } from "mongoose";

const format1 = "DD /MMM/ YYYY";

const calcDate = (date, payPeriod, unit = "subtract") => {
  let initialDate = date || moment();
  let _date = null;

  if (payPeriod == "onetime") {
    _date = moment();
  } else if (payPeriod == "Daily") {
    _date = moment(initialDate)[unit](1, "days");
  } else if (payPeriod == "Weekly") {
    _date = moment(initialDate)[unit](7, "days");
  } else if (payPeriod == "Bi-Weekly") {
    _date = moment(initialDate)[unit](14, "days");
  } else if (payPeriod == "Monthly") {
    _date = moment(initialDate)[unit](1, "months");
  } else if (payPeriod == "Quaterly") {
    _date = moment(initialDate)[unit](3, "months");
  } else if (payPeriod == "Semi-Anually") {
    _date = moment(initialDate)[unit](0.5, "year");
  } else if (payPeriod == "Annually") {
    _date = moment(initialDate)[unit](1, "year");
  } else {
    _date = moment();
  }
  return _date.toDate();
};

function Step3(props) {
  useEffect(() => {
    if (props.content.payDates.length) {
      setPayDate([
        ...content.payDates.map((el) => moment(el).format("DD/MM/YYYY")),
      ]);
    }
  }, [props.content.payDates.length]);

  const validationSchema = useMemo(
    () =>
      yup.object({
        annual_salary: yup.string().required("Annual Salary is required"),
        // hourly_rate: yup.string().required('Hourly Rate is required'),

        // employment_status: yup.string().nullable().required('Employment status is required'),
        pay_frequency: yup.string().required("Pay Period is required"),
        // check_number: yup.string().required('Check Number is required'),
      }),
    []
  );
  const resolver = useYupValidationResolver(validationSchema);
  const { handleSubmit, register, errors } = useForm({
    defaultValues: validationSchema.cast({ employment_status: props.paid }),
    resolver,
  });
  const [state, setState] = React.useState({
    checkedB: false,
  });

  const getPayDate = (selectDate, displayFormat = "ll") => {
    const momentDate = moment(selectDate).add(5, "days");
    const holidaysOfYear = holidays.find(
      (i) => i.year === momentDate.format("YYYY")
    );
    let holidayDates = [];
    if (holidaysOfYear) {
      holidayDates = holidaysOfYear.holidays;
    } else {
      holidayDates = getHolidays(momentDate.format("YYYY"));
    }
    let isHoliday = holidayDates.includes(momentDate.format(format));
    if (!isHoliday) {
      return momentDate.format(displayFormat);
    }
    while (isHoliday) {
      momentDate.add(1, "day");
      isHoliday = holidayDates.includes(momentDate.format(format));
    }
    return momentDate.format(displayFormat);
  };

  const onSubmit = async (data) => {
    const { company_notes, sign } = props.getNotes();
    const salary = getValue(data.annual_salary);

    const arrAddition = [];
    const arrDeduction = [];
    const arrBenefits = [];

    additions.forEach((el, idx) => {
      if (el.payDate == "apply-to-all") {
        payDate.forEach((i, index) => {
          arrAddition.push({ ...el, payDate: moment(i).format("DD/MM/YYYY") });
        });
      } else {
        arrAddition.push(el);
      }
    });
    deductions.forEach((el, idx) => {
      if (el.payDate == "apply-to-all") {
        payDate.forEach((i, index) => {
          arrDeduction.push({ ...el, payDate: moment(i).format("DD/MM/YYYY") });
        });
      } else {
        arrDeduction.push(el);
      }
    });

    otherBenefits.forEach((el, idx) => {
      if (el.payDate == "apply-to-all") {
        payDate.forEach((i, index) => {
          arrBenefits.push({ ...el, payDate: moment(i).format("DD/MM/YYYY") });
        });
      } else {
        arrBenefits.push(el);
      }
    });

    const actualPayDates = payDate.map((i) => getPayDate(i, "DD/MM/YYYY"));
    props.step3Fn({
      ...data,
      check_numbers: checkNumbers,
      pay_dates: payDate.map((el) => moment(new Date(el)).format("DD/MM/YYYY")),
      actual_pay_dates: actualPayDates,
      hire_date: moment(new Date(HireDate)).format("DD/MM/YYYY"),
      EmployeeHiredIn2021: state.checkedB,
      annual_salary: salary,
      employment_status: props.employment_status,
      additions: arrAddition,
      deductions: arrDeduction,
      otherBenefits: arrBenefits,
      startDate: moment(startDate).format("MM/DD/YYYY"),
      company_notes,
      sign,
    });
    props.changeStep(4);
  };

  const updateAddition = (value, field, idx) => {
    const arr = [...additions];
    if (field == "payDate" && value !== "apply-to-all") {
      const newDate = value;
      value = moment(newDate).format("DD/MM/YYYY");
    }
    if (field == "amount") {
      setadditionAmount(value);
    }
    arr[idx][field] = value;
    setAddition(arr);
  };

  const updateBenefits = (value, field, idx) => {
    const arr = [...otherBenefits];
    if (field == "payDate" && value !== "apply-to-all") {
      const newDate = value;
      value = moment(newDate).format("DD/MM/YYYY");
    }
    arr[idx][field] = value;
    setBenefits(arr);
  };

  const updateDeduction = (value, field, idx) => {
    const arr = [...deductions];
    if (field == "payDate" && value !== "apply-to-all") {
      const newDate = value;
      value = moment(newDate).format("DD/MM/YYYY");
    }
    if (field == "amount") {
      setdeductionAmount(value);
    }
    arr[idx][field] = value;
    setDeduction(arr);
  };
  let content = props.content;
  const handleCheckChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
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
  const [checkNumbers, setCheckNumbers] = useState([new Date()]);
  const [HireDate, setHireDate] = useState(new Date());
  const [additions, setAddition] = useState([]);
  const [deductions, setDeduction] = useState([]);
  const [otherBenefits, setBenefits] = useState([]);
  const [hourlyCheckbox, sethourlyCheckbox] = useState(false);
  const [annualSalary, setAnnualSalary] = useState();
  const [additionAmount, setadditionAmount] = useState();
  const [deductionAmount, setdeductionAmount] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const handlePayFrequency = (e) => {
    props.payFrequencyFn(e.target.value);
  };
  const hourlyCheck = () => {
    if (hourlyCheckbox == true) {
      sethourlyCheckbox(false);
    } else if (hourlyCheckbox == false) {
      sethourlyCheckbox(true);
    }
  };
  const handlePayDates = (dates) => {
    let startingDate = moment(startDate);
    return new Array(dates.length).fill(null).reduce((acc, date, index) => {
      let endingDate = acc[acc.length - 1];
      acc.push(calcDate(endingDate || startingDate, props.payFrequency, "add"));
      return acc;
    }, []);
  };

  useEffect(() => {
    setPayDate(handlePayDates(payDate));
  }, [props.payFrequency, startDate]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group required" style={{ width: "100%" }}>
        <label htmlFor="annual_salary" className="label-input">
          Annual Salary
        </label>
        <NumberFormat
          customInput="input"
          type="text"
          getInputRef={register}
          defaultValue={props.step3.annual_salary}
          className={
            "form-control " + (errors.annual_salary ? "is-invalid" : "")
          }
          placeholder="Ex. 60,000"
          id="annual_salary"
          name="annual_salary"
          value={annualSalary}
          maxLength="20"
          onChange={(e) => handleAnnualSalary(e)}
          thousandSeparator={true}
          prefix={"$"}
        />

        <small id="passwordHelp" className="text-danger">
          {errors.annual_salary && <span>{errors.annual_salary.message}</span>}
        </small>
      </div>

      <div className="form-group required" style={{ width: "100%" }}>
        <label htmlFor="companyAddress" className="label-input">
          Start date
        </label>
        <DatePicker
          dateFormat="dd / MMM / yyyy"
          locale="en"
          selected={startDate}
          onChange={setStartDate}
          className="form-control "
          popperPlacement="top-start"
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          placeholderText="Select Starting Date"
          id="payDate"
          name="payDate"
          autoComplete="off"
          required
        />
      </div>

      <div className="form-group required" style={{ width: "100%" }}>
        <label htmlFor="companyAddress" className="label-input">
          Pay Frequency (Pay Period)
          <span
            data-toggle="tooltip"
            data-placement="right"
            title={`Select the frequency at which the employee is paid`}
            className="help-icon align-self-end"
          >
            ?{" "}
          </span>
        </label>
        <select
          ref={register}
          placeholder="Pay Frequency"
          autocomplete="off"
          defaultValue={props.payFrequency}
          className={
            "form-control " + (errors.pay_frequency ? "is-invalid" : "")
          }
          id="pay_frequency"
          name="pay_frequency"
          // value={content.pay_frequency}
          onChange={handlePayFrequency}
        >
          <option value="">Select Pay Date</option>
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly (Ex: Every Friday)</option>
          <option value="Bi-Weekly">
            Bi-Weekly (ex: every other Wednesday)
          </option>
          <option value="Monthly">Monthly (ex: 1st of month only)</option>
          {/* <option value= 'Semi-Monthly'>Semi-Monthly (ex: 1st of month only)</option> */}

          <option value="Quaterly">Quarterly</option>
          <option value="Semi-Anually">Semi-Annually</option>
          <option value="Annually">Annually</option>
        </select>
        <small id="passwordHelp" className="text-danger">
          {errors.pay_frequency && <span>{errors.pay_frequency.message}</span>}
        </small>
      </div>

      <div className="form-group required" style={{ width: "100%" }}>
        <div className="row">
          <div className="col-sm-12 col-xs-12">
            <label htmlFor="payDates" className="label-input">
              Period Ending(S)
              <span
                data-toggle="tooltip"
                data-placement="right"
                title={`For proof of income, most institutions require paystubs covering a period of the last 3 months. The more pay dates you add the higher your chances become!`}
                className="help-icon align-self-end"
              >
                ?
              </span>
            </label>
            <span
              className="pull-right addPayDate"
              onClick={() => {
                let newDate = calcDate(
                  payDate[payDate.length - 1],
                  props.payFrequency,
                  "add"
                );
                setPayDate((prev) => [...prev, newDate]);
              }}
            >
              <i className="fa fa-plus"></i> Add
              <span className="hide-in-mobile"> Pay Date</span>
            </span>
          </div>
        </div>
        {payDate.map((paydate, idx) => {
          const selectDate = payDate[idx]
            ? payDate[idx]
            : moment(paydate).toDate();
          return (
            <div className="row">
              <div className="col-sm-11 col-xs-8 col-md-11 mt-3">
                <DatePicker
                  dateFormat="dd / MMM / yyyy"
                  locale="en"
                  selected={selectDate}
                  onChange={(newDate) => {
                    let dateArray = [...payDate];
                    dateArray[idx] = newDate;
                    setPayDate(dateArray);
                  }}
                  className="form-control "
                  popperPlacement="top-start"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  placeholderText="Select Pay Dates"
                  id="payDate"
                  name="payDate"
                  autoComplete="off"
                  required
                />

                <span className="paydate-label">
                  Paydate - {getPayDate(selectDate)}
                </span>
              </div>

              <div className="col-sm-1 mt-3 col-xs-4 col-md-1">
                <div className="form-group" style={{ width: "100%" }}>
                  {payDate.length != 1 && (
                    <i
                      className="fa fa-times cross"
                      onClick={(e) => {
                        let _payDate = [...payDate];

                        _payDate.splice(idx, 1);
                        setPayDate(_payDate);
                      }}
                    ></i>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        <br />
      </div>
      <Typography htmlFor="employeeHireDate">
        Employee hire Date <span className="text-muted">(Optional)</span>
      </Typography>
      <br />
      <FormGroup style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography>Was This Employee Hired In 2026?</Typography>
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
          <label htmlFor="employeeHireDate">
            Employee hire Date in {new Date().getFullYear()}{" "}
            <span className="text-muted">(Optional)</span>
          </label>
          <br />
          <DatePicker
            ref={register}
            dateFormat="dd / MMM / yyyy"
            locale="en"
            selected={HireDate}
            className="form-control"
            popperPlacement="top-start"
            onChange={(date) => setHireDate(date)}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            placeholderText="Ex. 12/11/2020"
            id="employeeHireDate"
            name="employeeHireDate"
            autoComplete="off"
          />
        </div>
      ) : null}

      <div className="form-group">
        <label>
          <input type="checkbox" className="mr-auto" onClick={hourlyCheck} />
          <span style={{ padding: "10px" }}>Show Hourly Rate On Paystub</span>
        </label>
      </div>
      {hourlyCheckbox ? (
        <div className="form-group">
          <label>Hours Worked Per Pay Period</label>
          <span className="text-muted">(Optional)</span>
          <input
            ref={register}
            type="text"
            className="form-control "
            placeholder="Ex. 80"
            // id="companyName"
            name="hours_worked"
            // onChange={e => props.handleChange(e, 1)}
            style={{ width: "100%" }}
          />
        </div>
      ) : null}

      <hr />

      <div className="form-group">
        <div className="row">
          <div className="col-sm-12 col-xs-12">
            <label>Additions</label>
            <span
              className="addPayDate"
              onClick={() => {
                let newAddition = {
                  description: "",
                  amount: 0,
                  payDate: new Date(),
                  ytdAmount: 0,
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
              <div className="col-sm-11 col-xs-8 col-md-11 mt-3">
                <div className="row">
                  <div className="col-sm-6">
                    <div className="form-group required">
                      <label className="label-input required">
                        Description
                      </label>
                      <input
                        className="form-control "
                        // value={addition.description}
                        placeholder="enter description here"
                        type="text"
                        name="description"
                        onChange={(e) =>
                          updateAddition(e.target.value, "description", idx)
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group required">
                      <label className="label-input required">Pay Date</label>
                      <select
                        onChange={(e) =>
                          updateAddition(e.target.value, "payDate", idx)
                        }
                        className="form-control"
                        name="payDate2"
                        required
                      >
                        <option value="">Select</option>
                        <option value="apply-to-all">Apply to all</option>
                        {payDate.map((paydate, idx) => {
                          return (
                            <option value={paydate}>
                              {moment(paydate).format(format1)}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="form-group required">
                      <label className="label-input">Current Amount</label>
                      <input
                        className="form-control "
                        name="currentAmount"
                        // value={addition.currentAmount}
                        placeholder="enter amount in USD"
                        type="number"
                        ref={register}
                        // onChange={e => props.handleAdditionsChange(e, idx, 'currentAmount')}

                        onChange={(e) =>
                          updateAddition(e.target.value, "amount", idx)
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group required">
                      <label className="label-input">YTD Amount</label>
                      <input
                        className="form-control "
                        name="ytdAmount"
                        min={additionAmount}
                        ref={register}
                        // value={addition.ytdAmount}
                        placeholder="enter amount in USD"
                        type="number"
                        // onChange={e => props.handleAdditionsChange(e, idx, 'ytdAmount')}

                        onChange={(e) =>
                          updateAddition(e.target.value, "ytdAmount", idx)
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-sm-1 mt-3 col-xs-4 col-md-1">
                <div className="form-group">
                  <i
                    className="fa fa-times cross"
                    onClick={() => {
                      let _addition = [...additions];
                      _addition.splice(idx, 1);
                      setAddition(_addition);
                    }}
                  ></i>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="form-group">
        <div className="row">
          <div className="col-sm-12 col-xs-12">
            <label>Deductions</label>
            <span
              className=" addPayDate"
              onClick={() => {
                let newDeduction = {
                  description: "",
                  amount: 0,
                  payDate: new Date(),
                  ytdAmount: 0,
                };
                setDeduction((prev) => [...prev, newDeduction]);
              }}
              style={{ marginLeft: "5%" }}
            >
              <i className="fa fa-plus"></i> Add
              <span className="hide-in-mobile"> Deductions</span>
            </span>
          </div>
        </div>

        {deductions.map((deduction, idx) => {
          return (
            <div className="row group-border">
              <div className="col-sm-11 col-xs-8 col-md-11 mt-3">
                <div className="row">
                  <div className="col-sm-6">
                    <div className="form-group required">
                      <label className="label-input">Description</label>
                      <input
                        ref={register}
                        className="form-control "
                        // value={addition.description}
                        placeholder="enter description here"
                        type="text"
                        name="description2"
                        // onChange={e => props.handleAdditionsChange(e, idx, 'description')}
                        onChange={(e) =>
                          updateDeduction(e.target.value, "description", idx)
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group required">
                      <label className="label-input">Pay Date</label>
                      <select
                        onChange={(e) =>
                          updateDeduction(e.target.value, "payDate", idx)
                        }
                        className="form-control "
                        name="payDate3"
                        ref={register}
                        required
                      >
                        <option value="">Select</option>
                        <option value="apply-to-all">Apply to all</option>
                        {payDate.map((paydate, idx) => {
                          return (
                            <option value={paydate}>
                              {moment(paydate).format(format1)}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="form-group required">
                      <label className="label-input">Current Amount</label>
                      <input
                        className="form-control "
                        name="currentAmount2"
                        // value={addition.currentAmount}
                        placeholder="enter amount in USD"
                        type="number"
                        // onChange={e => props.handleAdditionsChange(e, idx, 'currentAmount')}
                        onChange={(e) =>
                          updateDeduction(e.target.value, "amount", idx)
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group required">
                      <label className="label-input">YTD Amount</label>
                      <input
                        className="form-control "
                        name="ytdAmount2"
                        ref={register}
                        min={deductionAmount}
                        // value={addition.ytdAmount}
                        placeholder="enter amount in USD"
                        type="number"
                        // onChange={e => props.handleAdditionsChange(e, idx, 'ytdAmount')}
                        onChange={(e) =>
                          updateDeduction(e.target.value, "ytdAmount", idx)
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-sm-1 mt-3 col-xs-4 col-md-1">
                <div className="form-group">
                  <i
                    className="fa fa-times cross"
                    onClick={() => {
                      let _deduction = [...deductions];
                      _deduction.splice(idx, 1);
                      setDeduction(_deduction);
                    }}
                  ></i>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="form-group">
        <div className="row">
          <div className="col-sm-12 col-xs-12">
            <label>Other Benefits</label>
            <span
              className="addPayDate"
              onClick={() => {
                let newBenefit = {
                  title: "",
                  amount: 0,
                  payDate: new Date(),
                };
                setBenefits((prev) => [...prev, newBenefit]);
              }}
              style={{ marginLeft: "5%" }}
            >
              <i className="fa fa-plus"></i> Add
              <span className="hide-in-mobile"> Benefit</span>
            </span>
          </div>
        </div>

        {otherBenefits.map((addition, idx) => {
          return (
            <div className="row group-border">
              <div className="col-sm-11 col-xs-8 col-md-11 mt-3">
                <div className="row">
                  <div className="col-sm-12">
                    <div className="form-group required">
                      <label className="label-input required">Title</label>
                      <input
                        className="form-control "
                        // value={addition.description}
                        placeholder="enter title here"
                        type="text"
                        name="title"
                        onChange={(e) =>
                          updateBenefits(e.target.value, "title", idx)
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group required">
                      <label className="label-input required">Pay Date</label>
                      <select
                        onChange={(e) =>
                          updateBenefits(e.target.value, "payDate", idx)
                        }
                        className="form-control"
                        name="payDate2"
                        required
                      >
                        <option value="">Select</option>
                        <option value="apply-to-all">Apply to all</option>
                        {payDate.map((paydate, idx) => {
                          return (
                            <option value={paydate}>
                              {moment(paydate).format(format1)}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group required">
                      <label className="label-input">Amount</label>
                      <input
                        className="form-control "
                        name="amount"
                        // value={addition.currentAmount}
                        placeholder="enter amount in USD"
                        type="number"
                        ref={register}
                        // onChange={e => props.handleAdditionsChange(e, idx, 'currentAmount')}
                        onChange={(e) =>
                          updateBenefits(e.target.value, "amount", idx)
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-1 mt-3 col-xs-4 col-md-1">
                <div className="form-group">
                  <i
                    className="fa fa-times cross"
                    onClick={() => {
                      let _addition = [...otherBenefits];
                      _addition.splice(idx, 1);
                      setBenefits(_addition);
                    }}
                  ></i>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="form-group ">
        <label htmlFor="checkNumbers" className="label-input">
          Check Numbers
        </label>
        <br />
        {payDate.map((date, idx) => {
          return (
            <div className="row mt-2 group-border">
              <div className="col-sm-6">
                <div className="form-group">
                  <label className="">Date</label>
                  <DatePicker
                    ref={register}
                    name="checkNumberDate"
                    dateFormat="dd / MMM / yyyy"
                    locale="en"
                    selected={date}
                    className="form-control"
                    popperPlacement="top-start"
                    // peekNextMonth
                    //showTimeSelect
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    placeholderText="Select Pay Dates"
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group required">
                  <label htmlFor="check_number" className="label-input">
                    Check Number
                  </label>
                  <input
                    ref={register}
                    type="text"
                    className="form-control "
                    placeholder="Enter check number"
                    name="check_number"
                    // value={content.checkNumbers[idx]}
                    onChange={(e) =>
                      setCheckNumbers((prev) => {
                        prev[idx] = e.target.value;
                        return prev;
                      })
                    }
                    required
                    // onInvalid="Check numbers are required"
                  />
                </div>
                {/* <small id="passwordHelp" className="text-danger">
                                    {errors.check_number && <span>{errors.check_number.message}</span>}
                                </small> */}
              </div>
            </div>
          );
        })}
      </div>
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
      <div className="text-center mt-4">
        <button type="submit" className="btn btn-secondary">
          Review Your Stub <i className="fa fa-chevron-right"></i>
        </button>
        <p className="text-muted mt-3">
          <small>
            You can always go back to the previous step to edit your
            information!
          </small>
        </p>
      </div>
    </form>
  );
}
export default connect((state) => state, {
  step3Fn: AC.step3,
  payFrequencyFn: AC.payFrequency,
})(Step3);
