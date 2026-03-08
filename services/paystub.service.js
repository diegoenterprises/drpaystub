const numWords = require("num-words");
const STATE_TAX = require("../config/state-tax.json");
const SDI_TAX = require("../config/sdi-tax.json");
const FEDERAL_TAX = require("../config/federal-tax.json");
const OTHER_TAX = require("../config/other-taxes.json");
const LOCAL_TAX = require("../config/local-tax.json");
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
  return string
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
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

// 2026 Social Security wage base cap
const SS_WAGE_BASE = 184500;

// Additional Medicare Tax thresholds (0.9% on annualized excess)
const ADDITIONAL_MEDICARE_THRESHOLDS = {
  "Single Taxpayers": 200000,
  "Married Jointly & Surviving Spouses": 250000,
  "Married Filing Separately": 125000,
  "Head of Household": 200000,
};

// Progressive (marginal) tax calculation through brackets
const calcProgressiveTax = (income, brackets) => {
  if (!brackets || brackets.length === 0) return 0;
  let totalTax = 0;
  let prevMax = 0;
  for (const bracket of brackets) {
    if (income <= prevMax) break;
    const isTopBracket = bracket.min === bracket.max;
    const taxableAmount = isTopBracket
      ? income - prevMax
      : Math.min(income, bracket.max) - prevMax;
    if (taxableAmount > 0) {
      totalTax += (taxableAmount * bracket.tax) / 100;
    }
    if (!isTopBracket) prevMax = bracket.max;
  }
  return totalTax;
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

// ─── Local / Municipality Tax ────────────────────────────────────────────────
// Calculates local income tax based on work city (employer) and residence city (employee).
// Rules: work-city tax applies if nonResident > 0, residence-city tax applies minus credit.
const calcLocalTax = ({ state, workCity, residentCity, income, days }) => {
  const stateEntry = LOCAL_TAX[state];
  if (!stateEntry) return { workCityTax: 0, residentCityTax: 0, totalLocalTax: 0, workCityName: "", residentCityName: "", workCityRate: 0, residentCityRate: 0 };

  const normalize = (c) => (c || "").trim();
  const workNorm = normalize(workCity);
  const resNorm = normalize(residentCity);

  // Look up work city rate
  let workEntry = stateEntry[workNorm] || stateEntry._default || null;
  let resEntry = stateEntry[resNorm] || stateEntry._default || null;

  // Colorado flat amounts (per-month, not percentage)
  if (workEntry && workEntry.flat) {
    const periodsPerYear = days ? 365 / days : 1;
    const monthlyFlat = workEntry.flatAmount || 0;
    const perPeriod = (monthlyFlat * 12) / periodsPerYear;
    return { workCityTax: perPeriod, residentCityTax: 0, totalLocalTax: perPeriod, workCityName: workNorm, residentCityName: resNorm, workCityRate: 0, residentCityRate: 0 };
  }

  let workCityTax = 0;
  let residentCityTax = 0;
  let workRate = 0;
  let resRate = 0;

  // Work city: if employee is non-resident, use nonResident rate; if same city, use resident rate
  if (workEntry) {
    const sameCity = workNorm && resNorm && workNorm.toLowerCase() === resNorm.toLowerCase();
    workRate = sameCity ? (workEntry.resident || 0) : (workEntry.nonResident || 0);
    workCityTax = (income * workRate) / 100;
  }

  // Resident city: tax on residents, minus credit for work-city tax paid
  if (resEntry && resNorm) {
    const sameCity = workNorm && resNorm && workNorm.toLowerCase() === resNorm.toLowerCase();
    if (!sameCity) {
      resRate = resEntry.resident || 0;
      const credit = Math.min(workCityTax, (income * (resEntry.credit || workRate || 0)) / 100);
      residentCityTax = Math.max(0, (income * resRate) / 100 - credit);
    }
  }

  return {
    workCityTax: parseFloat(formatNumber(workCityTax)),
    residentCityTax: parseFloat(formatNumber(residentCityTax)),
    totalLocalTax: parseFloat(formatNumber(workCityTax + residentCityTax)),
    workCityName: workNorm,
    residentCityName: resNorm,
    workCityRate: workRate,
    residentCityRate: resRate,
  };
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

const calcStateIncomeTax = ({ state, income, maritalStatus, days }) => {
  if (
    STATE_TAX[state].hasTax != undefined &&
    STATE_TAX[state].hasTax == false
  ) {
    return 0;
  }

  if (
    STATE_TAX[state].hasFlatRate != undefined &&
    STATE_TAX[state].hasFlatRate == true
  ) {
    return (income * STATE_TAX[state].tax) / 100;
  }

  // Progressive calculation with annualization
  const periodsPerYear = days ? 365 / days : 1;
  const annualIncome = income * periodsPerYear;
  const brackets = STATE_TAX[state][maritalStatus] || [];
  const annualTax = calcProgressiveTax(annualIncome, brackets);
  return annualTax / periodsPerYear;
};

const calcStateIncomeTaxPercent = ({ state, income, maritalStatus, days }) => {
  if (
    STATE_TAX[state].hasTax != undefined &&
    STATE_TAX[state].hasTax == false
  ) {
    return 0;
  }

  if (
    STATE_TAX[state].hasFlatRate != undefined &&
    STATE_TAX[state].hasFlatRate == true
  ) {
    return STATE_TAX[state].tax;
  }

  const tax = calcStateIncomeTax({ state, income, maritalStatus, days });
  return income > 0 ? (tax / income) * 100 : 0;
};

const calculateFederalTax = ({ income, maritalStatus, days }) => {
  const periodsPerYear = days ? 365 / days : 1;
  const annualIncome = income * periodsPerYear;
  const brackets = FEDERAL_TAX[maritalStatus] || [];
  const annualTax = calcProgressiveTax(annualIncome, brackets);
  return annualTax / periodsPerYear;
};

const calculateFederalTaxPercent = ({ income, maritalStatus, days }) => {
  const tax = calculateFederalTax({ income, maritalStatus, days });
  return income > 0 ? (tax / income) * 100 : 0;
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
  company_city,
  employee_city,
}) => {
  let params = {
    check_number,
    pay_date: moment(pay_date).format("MM/DD/YYYY"),
    endDate: moment(pay_date).format("MM/DD/YYYY"),
  };

  // Compute gross income FIRST (base pay + additions)
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

  const grossIncome = params.gross_income;
  const periodsPerYear = days ? 365 / days : 1;
  const annualGross = grossIncome * periodsPerYear;

  // Federal tax (progressive, annualized)
  let federalTax = formatNumber(
    calculateFederalTax({
      income: grossIncome,
      maritalStatus: maritial_status,
      days,
    })
  );

  params.federalTaxPercent = formatNumber(
    calculateFederalTaxPercent({
      income: grossIncome,
      maritalStatus: maritial_status,
      days,
    })
  );

  // State income tax (progressive, annualized)
  let stateIncomeTax = formatNumber(
    calcStateIncomeTax({
      income: grossIncome,
      state,
      maritalStatus: maritial_status,
      days,
    })
  );

  params.stateIncomeTaxPercent = formatNumber(
    calcStateIncomeTaxPercent({
      income: grossIncome,
      state,
      maritalStatus: maritial_status,
      days,
    })
  );

  // SDI tax on gross
  let sdiTax = formatNumber(
    calcSDITax({
      income: grossIncome,
      state,
    })
  );

  // Medicare on gross (1.45% + 0.9% additional on annualized excess)
  let medicareTax = (grossIncome * OTHER_TAX.Medicare) / 100;
  const medicareThreshold = ADDITIONAL_MEDICARE_THRESHOLDS[maritial_status] || 200000;
  if (annualGross > medicareThreshold) {
    medicareTax += ((annualGross - medicareThreshold) * 0.9) / 100 / periodsPerYear;
  }
  medicareTax = formatNumber(medicareTax);

  // Social Security on gross with wage base cap
  let ssTax;
  if (annualGross > SS_WAGE_BASE) {
    ssTax = formatNumber((SS_WAGE_BASE * OTHER_TAX["Social Security"]) / 100 / periodsPerYear);
  } else {
    ssTax = formatNumber((grossIncome * OTHER_TAX["Social Security"]) / 100);
  }

  params.medicarePercent = formatNumber(OTHER_TAX.Medicare);

  // Local / municipality tax (work city vs residence city)
  const localTaxResult = calcLocalTax({
    state,
    workCity: company_city || "",
    residentCity: employee_city || "",
    income: grossIncome,
    days,
  });
  let localTax = formatNumber(localTaxResult.totalLocalTax);
  params.localTaxBreakdown = localTaxResult;

  // Build deduction arrays
  const localTaxLabel = localTaxResult.workCityName
    ? `Local Tax (${localTaxResult.workCityName})`
    : "Local Tax";
  const hasLocalTax = parseFloat(localTax) > 0;

  params.deduction_labels = [
    "Federal Tax",
    `${capitalizeString(state)}'s Income Tax`,
    "SUI/SDI Tax",
    "Medicare",
    "Social Security",
    ...(hasLocalTax ? [localTaxLabel] : []),
    ...deductions.map((el) => el.description),
  ];

  params.deductions_current = [
    federalTax,
    stateIncomeTax,
    sdiTax,
    medicareTax,
    ssTax,
    ...(hasLocalTax ? [localTax] : []),
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
