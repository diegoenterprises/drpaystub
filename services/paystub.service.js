const numWords = require("num-words");
const STATE_TAX = require("../config/state-tax.json");
const SDI_TAX = require("../config/sdi-tax.json");
const FEDERAL_TAX = require("../config/federal-tax.json");
const OTHER_TAX = require("../config/other-taxes.json");
const moment = require("moment");
const { ToWords } = require('to-words');

const toWords = new ToWords({
    localeCode: 'en-US', // Set the locale to US English
    converterOptions: {
        currency: true,
        ignoreDecimal: false,
        ignoreZeroCurrency: false,
        doNotAddOnly: true,
    }
});

const capitalizeString = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const formatNumber = (number) => {
  return Number(number).toFixed(2);
};

const EMPLOYMENT_STATUS = {
  Hourly: "Hourly",
  Salary: "Salary",
};

const PAY_FREQUENCY = {
  Daily: 1,
  Weekly: 7,
  "Bi-Weekly": 14,
  "Semi-Monthly": 15,
  Monthly: 30.4166666667,
  Quaterly: 91.25,
  "Semi-Anually": 182.5,
  Annually: 365,
};

const MARITAL_STATUS = {
  "Single Taxpayers": "Single Taxpayers",
  "Married Jointly & Surviving Spouses": "Married Jointly & Surviving Spouses",
  "Married Filing Separately": "Married Filing Separately",
  "Head of Household": "Head of Household",
};

const areDatesEqual = (a, b) => {
  return (
    moment(a).isSame(b, "year") &&
    moment(a).isSame(b, "month") &&
    moment(a).isSame(b, "day")
  );
};
const convertDate = (date) => {
  let [day, month, year] = (date || "").split(`/`);
  if (!day || !month || !year) return null;
  return moment()
    .year(parseInt(year))
    .month(parseInt(month) - 1)
    .date(parseInt(day))
    .toDate();
};

const calcSDITax = ({ state, income }) => {
  // check if state imposes tax
  if (SDI_TAX[state] == undefined) {
    return 0;
  }

  // check if state imposes tax based on marital status
  else {
    let tax = SDI_TAX[state].tax;
    return (income * tax) / 100;
  }
};

const calcStateIncomeTax = ({ state, income, maritalStatus }) => {
  // check if state imposes tax
  if (
    STATE_TAX[state].hasTax != undefined &&
    STATE_TAX[state].hasTax == false
  ) {
    return 0;
  }

  // check if state imposes flat tax rate
  else if (
    STATE_TAX[state].hasFlatRate != undefined &&
    STATE_TAX[state].hasFlatRate == true
  ) {
    return (income * STATE_TAX[state].tax) / 100;
  }
  // check if state imposes tax based on marital status
  else {
    let filters = STATE_TAX[state][maritalStatus] || [];
    let rule = filters.find((el) => {
      if (el.min === el.max && el.max <= income) return true;
      if (income >= el.min && income <= el.max) return true;
    });

    return (income * rule.tax) / 100;
  }
};

const calcStateIncomeTaxPercent = ({ state, income, maritalStatus }) => {
  // check if state imposes tax
  if (
    STATE_TAX[state].hasTax != undefined &&
    STATE_TAX[state].hasTax == false
  ) {
    return 0;
  }

  // check if state imposes flat tax rate
  else if (
    STATE_TAX[state].hasFlatRate != undefined &&
    STATE_TAX[state].hasFlatRate == true
  ) {
    return STATE_TAX[state].tax;
  }
  // check if state imposes tax based on marital status
  else {
    let filters = STATE_TAX[state][maritalStatus] || [];
    let rule = filters.find((el) => {
      if (el.min === el.max && el.max <= income) return true;
      if (income >= el.min && income <= el.max) return true;
    });

    return rule.tax;
  }
};

const calculateFederalTax = ({ income, maritalStatus }) => {
  let filters = FEDERAL_TAX[maritalStatus] || [];
  let rule = filters.find((el) => {
    if (el.min === el.max && el.max <= income) return true;
    if (income >= el.min && income <= el.max) return true;
  });

  return (income * rule.tax) / 100;
};

const calculateFederalTaxPercent = ({ income, maritalStatus }) => {
  let filters = FEDERAL_TAX[maritalStatus] || [];
  let rule = filters.find((el) => {
    if (el.min === el.max && el.max <= income) return true;
    if (income >= el.min && income <= el.max) return true;
  });

  return rule.tax;
};

const calcYTD = ({ startingDate, endingDate, days, value }) => {
  // emp date
  let _start = startingDate
    ? moment(startingDate).startOf("day")
    : moment().startOf("year");
  // pay date
  let _end = moment(endingDate || new Date());

  _start.year(_end.year());

  let acc = 0;

  while (_start.isBefore(_end)) {
    acc += value;
    _start.add(days, "days");
  }

  return acc;
};

const getPaystubDTO = ({
  employee_state,
  maritial_status,
  employment_status,
  employee_name,
}) => {
  calcSDITax;
  let errors = {};
  if (!Object.keys(STATE_TAX).includes(employee_state)) {
    return "Invalid State";
  }

  if (!Object.keys(MARITAL_STATUS).includes(maritial_status)) {
    return "Invalid Marital Status";
  }
  if (!Object.keys(EMPLOYMENT_STATUS).includes(employment_status)) {
    return "Invalid Employement Status";
  }
  if (!employee_name) {
    return "No Employee Name";
  }

  return errors;
};

const generateParams = ({
  income,
  state,
  maritial_status,
  employee_hiring_date,
  pay_date,
  days,
  additions,
  deductions,
  otherBenefits,
  check_number,
}) => {
  let params = {
    check_number,
    pay_date: moment(pay_date).format("MM/DD/YYYY"),
    endDate: moment(pay_date).format("MM/DD/YYYY"),
  };

  let stateIncomeTax = formatNumber(
    calcStateIncomeTax({
      income,
      state,
      maritalStatus: maritial_status,
    })
  );

  params.stateIncomeTaxPercent = formatNumber(
    calcStateIncomeTaxPercent({
      income,
      state,
      maritalStatus: maritial_status,
    })
  );

  params.medicarePercent = formatNumber(OTHER_TAX.Medicare);

  let sdiTax = formatNumber(
    calcSDITax({
      income,
      state,
      maritalStatus: maritial_status,
    })
  );

  let federalTax = formatNumber(
    calculateFederalTax({
      income,
      maritalStatus: maritial_status,
    })
  );

  params.federalTaxPercent = formatNumber(
    calculateFederalTaxPercent({
      income,
      maritalStatus: maritial_status,
    })
  );

  params.earnings_labels = [
    "Regular Earnings",
    ...additions.map((el) => el.description),
  ];
  params.benefits_labels = [...otherBenefits.map((el) => el.title)];
  params.benefits_amount = [...otherBenefits.map((el) => el.amount)];
  const incomes = [income, ...additions.map((el) => formatNumber(el.amount))];
  params.income = incomes;
  params.gross_income = incomes.reduce(
    (prev, curr) => parseFloat(prev) + parseFloat(curr),
    0
  );
  params.deduction_labels = [
    "Federal Tax",
    `${capitalizeString(state)}'s Income Tax`,
    "SUI/SDI Tax",
    ...Object.keys(OTHER_TAX),
    ...deductions.map((el) => el.description),
  ];

  params.deductions_current = [
    federalTax,
    stateIncomeTax,
    sdiTax,
    ...Object.keys(OTHER_TAX).map((el) =>
      formatNumber((parseFloat(income) * OTHER_TAX[el]) / 100)
    ),
    ...deductions.map((el) => formatNumber(el.amount)),
  ];

  params.deduction_ytd = params.deductions_current.map((el) =>
    formatNumber(
      calcYTD({
        startingDate: employee_hiring_date,
        endingDate: pay_date,
        days,
        value: parseFloat(el),
      })
    )
  );

  params.ytd_gross = formatNumber(
    calcYTD({
      startingDate: employee_hiring_date,
      endingDate: pay_date,
      days,
      value: params.income.reduce((acc, el) => (acc += parseFloat(el)), 0),
    })
  );

  params.ytd_deductions = formatNumber(
    calcYTD({
      startingDate: employee_hiring_date,
      endingDate: pay_date,
      days,
      value: params.deductions_current.reduce(
        (acc, el) => (acc += parseFloat(el)),
        0
      ),
    })
  );

  params.ytd_netPay = formatNumber(
    parseFloat(params.ytd_gross) - parseFloat(params.ytd_deductions)
  );
  params.currentTotal = formatNumber(
    params.deductions_current.reduce((acc, el) => (acc += parseFloat(el)), 0)
  );
  params.currentDeductions = formatNumber(
    params.deductions_current.reduce((acc, el) => (acc += parseFloat(el)), 0)
  );
  params.net_pay = formatNumber(
    parseFloat(params.gross_income) - parseFloat(params.currentDeductions)
  );

  const [dollars, cents] = params.net_pay.toString().split(".");

  if (dollars < 0) {
    throw new Error("The final amount is less than zero! Please choose a higher amount!");
  }
  params.net_pay_english = `${numWords(parseInt(dollars)).replace(
    " and",
    ""
  )} Dollars ${cents ? `and ${numWords(parseInt(cents))} Cents` : ""}`;

  params.net_pay_english = toWords.convert(params.net_pay);
  params.maritial_status = maritial_status;
  params.random_number = `${Math.floor(100000 + Math.random() * 900000)}`;
  return params;
};

const getComputedString = ({ address, address2, city, state, zipCode }) => {
  let string = "";
  if (address) string += address + " ";
  if (address2) string += address2 + " ";
  if (city) {
    string += city + ", ";
  }
  if (state) string += STATE_TAX[state].stateCode + " ";
  if (zipCode) string += zipCode;

  return string.trim();
};

module.exports = {
  getComputedString,
  generateParams,
  convertDate,
  areDatesEqual,
  PAY_FREQUENCY,
  getPaystubDTO,
  EMPLOYMENT_STATUS,
  formatNumber,
};
