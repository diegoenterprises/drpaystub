const express = require('express');
const router = express.Router();
const moment = require('moment');
const numWords = require('num-words');
const { ToWords } = require('to-words');
const STATE_TAX = require('../config/state-tax.json');
const FEDERAL_TAX = require('../config/federal-tax.json');
const OTHER_TAX = require('../config/other-taxes.json');

// Create a new instance of ToWords
const toWords = new ToWords({
    localeCode: 'en-US', // Set the locale to US English
    converterOptions: {
        currency: true,
        ignoreDecimal: false,
        ignoreZeroCurrency: false,
        doNotAddOnly: false,
    }
});

const capitalizeString = string => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const formatNumber = number => {
    return Number(number).toFixed(2);
};

const EMPLOYMENT_STATUS = {
    Hourly: 'Hourly',
    Salary: 'Salary',
};

const PAY_FREQUENCY = {
    Daily: 1,
    Weekly: 7,
    'Bi-Weekly': 14,
    'Semi-Monthly': 15,
    Monthly: 30.4166666667,
    Quaterly: 91.25,
    'Semi-Anually': 182.5,
    Annually: 365,
};

const MARITAL_STATUS = {
    'Single Taxpayers': 'Single Taxpayers',
    'Married Jointly & Surviving Spouses': 'Married Jointly & Surviving Spouses',
    'Married Filing Separately': 'Married Filing Separately',
    'Head of Household': 'Head of Household',
};

const areDatesEqual = (a, b) => {
    return moment(a).isSame(b, 'year') && moment(a).isSame(b, 'month') && moment(a).isSame(b, 'day');
};
const convertDate = date => {
    let [day, month, year] = (date || '').split(`/`);
    if (!day || !month || !year) return null;
    return moment()
        .year(parseInt(year))
        .month(parseInt(month) - 1)
        .date(parseInt(day))
        .toDate();
};

const calcStateIncomeTax = ({ state, income, maritalStatus }) => {
    // check if state imposes tax
    if (STATE_TAX[state].hasTax != undefined && STATE_TAX[state].hasTax == false) {
        return 0;
    }

    // check if state imposes flat tax rate
    else if (STATE_TAX[state].hasFlatRate != undefined && STATE_TAX[state].hasFlatRate == true) {
        return (income * STATE_TAX[state].tax) / 100;
    }
    // check if state imposes tax based on marital status
    else {
        let filters = STATE_TAX[state][maritalStatus] || [];
        let rule = filters.find(el => {
            if (el.min === el.max && el.max <= income) return true;
            if (income >= el.min && income <= el.max) return true;
        });

        console.log(filters, income);

        return (income * rule.tax) / 100;
    }
};

const calculateFederalTax = ({ income, maritalStatus }) => {
    let filters = FEDERAL_TAX[maritalStatus] || [];
    console.log(filters);
    let rule = filters.find(el => {
        if (el.min === el.max && el.max <= income) return true;
        if (income >= el.min && income <= el.max) return true;
    });

    return (income * rule.tax) / 100;
};

const calcYTD = ({ startingDate, endingDate, days, value }) => {
    // emp date
    let _start = startingDate ? moment(startingDate).startOf('day') : moment().startOf('year');
    // pay date
    let _end = moment(endingDate || new Date());

    _start.year(_end.year());

    let acc = 0;

    while (_start.isBefore(_end)) {
        acc += value;
        _start.add(days, 'days');
    }

    return acc;
};

const getPaystubDTO = ({ state, maritial_status, employment_status, employee_name }) => {
    let errors = {};
    if (!Object.keys(STATE_TAX).includes(state)) {
        errors['state'] = 'Invalid State';
    }

    if (!Object.keys(MARITAL_STATUS).includes(maritial_status)) {
        errors['maritial_status'] = 'Invalid Marital Status';
    }
    if (!Object.keys(EMPLOYMENT_STATUS).includes(employment_status)) {
        errors['employment_status'] = 'Invalid Employement Status';
    }
    if (!employee_name) {
        errors['employee_name'] = 'No Employee Name';
    }

    return errors;
};

const generateParams = ({ income, state, maritial_status, employee_hiring_date, pay_date, days, additions, deductions, check_number }) => {
    let params = {
        check_number,
        pay_date: moment(pay_date).format('MM/DD/YYYY'),
        endDate: moment(pay_date).format('MM/DD/YYYY'),
        startDate: moment(pay_date).subtract(days, 'days').format('MM/DD/YYYY'),
    };

    let stateIncomeTax = formatNumber(
        calcStateIncomeTax({
            income,
            state,
            maritalStatus: maritial_status,
        }),
    );
    let federalTax = formatNumber(
        calculateFederalTax({
            income,
            maritalStatus: maritial_status,
        }),
    );

    params.earnings_labels = ['Regular Earnings', ...additions.map(el => el.description)];

    params.income = [income, ...additions.map(el => formatNumber(el.amount))];
    params.deduction_labels = ['Federal Tax', `${capitalizeString(state)}'s Income Tax`, ...Object.keys(OTHER_TAX), ...deductions.map(el => el.description)];

    params.deductions_current = [
        federalTax,
        stateIncomeTax,
        ...Object.keys(OTHER_TAX).map(el => formatNumber((parseFloat(income) * OTHER_TAX[el]) / 100)),
        ...deductions.map(el => formatNumber(el.amount)),
    ];

    params.deduction_ytd = params.deductions_current.map(el =>
        formatNumber(
            calcYTD({
                startingDate: employee_hiring_date,
                endingDate: pay_date,
                days,
                value: parseFloat(el),
            }),
        ),
    );

    params.ytd_gross = formatNumber(
        calcYTD({
            startingDate: employee_hiring_date,
            endingDate: pay_date,
            days,
            value: params.income.reduce((acc, el) => (acc += parseFloat(el)), 0),
        }),
    );

    params.ytd_deductions = formatNumber(
        calcYTD({
            startingDate: employee_hiring_date,
            endingDate: pay_date,
            days,
            value: params.deductions_current.reduce((acc, el) => (acc += parseFloat(el)), 0),
        }),
    );

    params.ytd_netPay = formatNumber(parseFloat(params.ytd_gross) - parseFloat(params.ytd_deductions));
    params.currentTotal = formatNumber(params.deductions_current.reduce((acc, el) => (acc += parseFloat(el)), 0));
    params.currentDeductions = formatNumber(params.deductions_current.reduce((acc, el) => (acc += parseFloat(el)), 0));
    params.net_pay = formatNumber(parseFloat(income) - parseFloat(params.currentDeductions));
    //params.net_pay_english = `${numWords(parseInt(params.net_pay))} Dollars`;
    params.net_pay_english = toWords.convert( (parseInt(params.net_pay)) );
    return params;
};

router.post('/', async (req, res, next) => {
    console.log(req.body);
    const {
        // first page
        tax_year,
        employer_ein,
        business_name,
        company_address,
        company_ste_no,
        company_zipCode,
        company_city,
        company_state,
        company_control_number,
        company_state_id_number,

        // second page

        employee_name,
        employee_ssn,
        employee_address,
        employee_ste_no,
        employee_zipCode,
        employee_city,
        employee_state,
        no_federal_allowances, // unknown
        annual_salary, // value 800
        additions, // value 100
        federal_filing_status,
        state_filing_status,

        // third page

        employer_email,
        allocated_tips, // value 100 exact
        dependent_cate_benefits, // value 200 exact
        non_qualified_plans, // value 300 exact
        taxCode_12a, // value 10 exact
        taxCode_12b, // value 20 exact
        taxCode_12c, // value 30 exact
        taxCode_12d, // value 40 exact
        extras,
        exemptions,
    } = req.body;

    let _extras = {
        statutory_employee: false,
        retirement_plan: false,
        third_Party_sick_pay: false,
    };
    let _exemptions = {
        federal_income_tax: false,
        federal_income_tax_flag: false,
        social_security: false,
        medicare: false,
    };

    let otherTaxes = Object.keys(OTHER_TAX).reduce((acc, el) => {
        return {
            ...acc,
            [el]: formatNumber((parseFloat(annual_salary || 0) * OTHER_TAX[el]) / 100),
        };
    }, {});

    const params = {
        other_compensation: 0,
        federal_income_tax: 0,
        state_income_tax: 0,
        ...otherTaxes,
        extras: {
            ..._extras,
            ...(extras || {}),
        },
        exemptions: {
            ..._exemptions,
            ...(exemptions || {}),
        },
    };

    params.other_compensation = annual_salary + (additions || []).map(el => parseFloat(el.amount)) - parseFloat(dependent_cate_benefits);

    params.federal_income_tax = calculateFederalTax({
        income: Number(annual_salary || 0),
        maritalStatus: federal_filing_status || MARITAL_STATUS['Single Taxpayers'],
    });

    params.state_income_tax = calcStateIncomeTax({
        income: Number(annual_salary || 0),
        maritalStatus: state_filing_status || MARITAL_STATUS['Single Taxpayers'],
        state: employee_state,
    });

    res.json({
        params,
        success: true,
    });
});

module.exports = router;

let taxes = {
    'Federal Income Tax': 'Federal Income Tax',
    'Social Security': 'Social Security',
    Medicare: 'Medicare',
    'Additional Medicare': 'Additional Medicare',
    'New Mexico State Tax': 'New Mexico State Tax',
    'New Mexico Workers’ Compensation': 'New Mexico Workers’ Compensation',
};

// addition - dependent_cate_benefits
