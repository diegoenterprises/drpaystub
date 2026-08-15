"use strict";

// Independent reference arithmetic for the bounded 2026 federal fixtures.
// This module is test-only. Runtime payroll must use a separately reviewed,
// versioned rule pack and produce its own auditable calculation receipt.

const PERIODS_PER_YEAR = Object.freeze({
  annual: 1,
  semiannual: 2,
  quarterly: 4,
  monthly: 12,
  semimonthly: 24,
  biweekly: 26,
  weekly: 52,
  daily: 260,
});

const W4_STANDARD_ADJUSTMENT_CENTS = Object.freeze({
  marriedFilingJointly: 1_290_000,
  singleOrMarriedFilingSeparately: 860_000,
  headOfHousehold: 860_000,
});

const NRA_ADJUSTMENT_CENTS = Object.freeze({
  weekly: 30_960,
  biweekly: 61_920,
  semimonthly: 67_080,
  monthly: 134_170,
  quarterly: 402_500,
  semiannual: 805_000,
  annual: 1_610_000,
  daily: 6_190,
});

function row(lowerDollars, upperDollars, baseTaxCents, rateBasisPoints) {
  if (
    !Number.isSafeInteger(lowerDollars) ||
    (upperDollars !== null && !Number.isSafeInteger(upperDollars)) ||
    !Number.isSafeInteger(baseTaxCents) ||
    !Number.isSafeInteger(rateBasisPoints)
  ) {
    throw new TypeError("Withholding schedule constants must be exact integers");
  }
  return Object.freeze({
    lowerCents: lowerDollars * 100,
    upperCents: upperDollars === null ? null : upperDollars * 100,
    baseTaxCents,
    rateBasisPoints,
  });
}

const RATE_SCHEDULES = Object.freeze({
  standard: Object.freeze({
    marriedFilingJointly: Object.freeze([
      row(0, 19_300, 0, 0),
      row(19_300, 44_100, 0, 1_000),
      row(44_100, 120_100, 248_000, 1_200),
      row(120_100, 230_700, 1_160_000, 2_200),
      row(230_700, 422_850, 3_593_200, 2_400),
      row(422_850, 531_750, 8_204_800, 3_200),
      row(531_750, 788_000, 11_689_600, 3_500),
      row(788_000, null, 20_658_350, 3_700),
    ]),
    singleOrMarriedFilingSeparately: Object.freeze([
      row(0, 7_500, 0, 0),
      row(7_500, 19_900, 0, 1_000),
      row(19_900, 57_900, 124_000, 1_200),
      row(57_900, 113_200, 580_000, 2_200),
      row(113_200, 209_275, 1_796_600, 2_400),
      row(209_275, 263_725, 4_102_400, 3_200),
      row(263_725, 648_100, 5_844_800, 3_500),
      row(648_100, null, 19_297_925, 3_700),
    ]),
    headOfHousehold: Object.freeze([
      row(0, 15_550, 0, 0),
      row(15_550, 33_250, 0, 1_000),
      row(33_250, 83_000, 177_000, 1_200),
      row(83_000, 121_250, 774_000, 2_200),
      row(121_250, 217_300, 1_615_500, 2_400),
      row(217_300, 271_750, 3_920_700, 3_200),
      row(271_750, 656_150, 5_663_100, 3_500),
      row(656_150, null, 19_117_100, 3_700),
    ]),
  }),
  step2Checked: Object.freeze({
    marriedFilingJointly: Object.freeze([
      row(0, 16_100, 0, 0),
      row(16_100, 28_500, 0, 1_000),
      row(28_500, 66_500, 124_000, 1_200),
      row(66_500, 121_800, 580_000, 2_200),
      row(121_800, 217_875, 1_796_600, 2_400),
      row(217_875, 272_325, 4_102_400, 3_200),
      row(272_325, 400_450, 5_844_800, 3_500),
      row(400_450, null, 10_329_175, 3_700),
    ]),
    singleOrMarriedFilingSeparately: Object.freeze([
      row(0, 8_050, 0, 0),
      row(8_050, 14_250, 0, 1_000),
      row(14_250, 33_250, 62_000, 1_200),
      row(33_250, 60_900, 290_000, 2_200),
      row(60_900, 108_938, 898_300, 2_400),
      row(108_938, 136_163, 2_051_200, 3_200),
      row(136_163, 328_350, 2_922_400, 3_500),
      row(328_350, null, 9_648_963, 3_700),
    ]),
    headOfHousehold: Object.freeze([
      row(0, 12_075, 0, 0),
      row(12_075, 20_925, 0, 1_000),
      row(20_925, 45_800, 88_500, 1_200),
      row(45_800, 64_925, 387_000, 2_200),
      row(64_925, 112_950, 807_750, 2_400),
      row(112_950, 140_175, 1_960_350, 3_200),
      row(140_175, 332_375, 2_831_550, 3_500),
      row(332_375, null, 9_558_550, 3_700),
    ]),
  }),
});

const SOCIAL_SECURITY_WAGE_BASE_CENTS = 18_450_000;
const SOCIAL_SECURITY_RATE_BPS = 620;
const MAX_SOCIAL_SECURITY_TAX_CENTS = 1_143_900;
const MEDICARE_RATE_BPS = 145;
const ADDITIONAL_MEDICARE_RATE_BPS = 90;
const ADDITIONAL_MEDICARE_THRESHOLD_CENTS = 20_000_000;

function requireNonnegativeSafeInteger(value, name) {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new TypeError(`${name} must be a nonnegative safe integer number of cents`);
  }
  return value;
}

function roundRatioHalfUp(numerator, denominator) {
  const n = BigInt(numerator);
  const d = BigInt(denominator);
  if (n < 0n || d <= 0n) throw new RangeError("roundRatioHalfUp expects n >= 0 and d > 0");
  return Number((2n * n + d) / (2n * d));
}

function rateAmountCents(amountCents, basisPoints) {
  requireNonnegativeSafeInteger(amountCents, "amountCents");
  return roundRatioHalfUp(BigInt(amountCents) * BigInt(basisPoints), 10_000n);
}

function scheduleFor(filingStatus, step2Checked) {
  const family = step2Checked ? RATE_SCHEDULES.step2Checked : RATE_SCHEDULES.standard;
  const schedule = family[filingStatus];
  if (!schedule) throw new RangeError(`Unsupported filing status: ${filingStatus}`);
  return schedule;
}

function calculateFederalIncomeTaxWithholding(input) {
  const wagesCents = requireNonnegativeSafeInteger(
    input.taxableWagesCents,
    "taxableWagesCents"
  );
  const w4 = input.w4 || {};
  if (w4.exempt === true) {
    if (w4.exemptCertificationValidForPaymentDate !== true) {
      throw new RangeError(
        "Exempt withholding requires a validated current-year certification for the payment date"
      );
    }
    return { employeeFederalIncomeTaxWithheldCents: 0 };
  }

  const periods = PERIODS_PER_YEAR[input.payFrequency];
  if (!periods) throw new RangeError(`Unsupported pay frequency: ${input.payFrequency}`);

  const filingStatus = w4.filingStatus;
  const step2Checked = w4.step2Checked === true;
  const step3CreditsCents = requireNonnegativeSafeInteger(
    w4.step3CreditsCents ?? 0,
    "step3CreditsCents"
  );
  const step4OtherIncomeCents = requireNonnegativeSafeInteger(
    w4.step4OtherIncomeCents ?? 0,
    "step4OtherIncomeCents"
  );
  const step4DeductionsCents = requireNonnegativeSafeInteger(
    w4.step4DeductionsCents ?? 0,
    "step4DeductionsCents"
  );
  const step4AdditionalWithholdingCents = requireNonnegativeSafeInteger(
    w4.step4AdditionalWithholdingCents ?? 0,
    "step4AdditionalWithholdingCents"
  );

  const nraAdjustmentCents = input.nonresidentAlienAdjustment
    ? NRA_ADJUSTMENT_CENTS[input.payFrequency]
    : 0;
  if (input.nonresidentAlienAdjustment && nraAdjustmentCents === undefined) {
    throw new RangeError(`No NRA adjustment for frequency: ${input.payFrequency}`);
  }

  const annualizedWagesCents = (wagesCents + nraAdjustmentCents) * periods;
  const standardAdjustmentCents = step2Checked
    ? 0
    : W4_STANDARD_ADJUSTMENT_CENTS[filingStatus];
  if (standardAdjustmentCents === undefined) {
    throw new RangeError(`Unsupported filing status: ${filingStatus}`);
  }
  const adjustedAnnualWageCents = Math.max(
    0,
    annualizedWagesCents +
      step4OtherIncomeCents -
      step4DeductionsCents -
      standardAdjustmentCents
  );

  const bracket = scheduleFor(filingStatus, step2Checked).find(
    (candidate) =>
      adjustedAnnualWageCents >= candidate.lowerCents &&
      (candidate.upperCents === null || adjustedAnnualWageCents < candidate.upperCents)
  );
  if (!bracket) throw new RangeError("No withholding schedule bracket found");

  // Keep the annual percentage calculation rational through the final
  // per-period result. Round only the final withholding to the nearest cent.
  const excessCents = adjustedAnnualWageCents - bracket.lowerCents;
  const annualTaxNumerator =
    BigInt(bracket.baseTaxCents) * 10_000n +
    BigInt(excessCents) * BigInt(bracket.rateBasisPoints);
  const afterCreditsNumerator =
    annualTaxNumerator - BigInt(step3CreditsCents) * 10_000n;
  const nonnegativeAfterCredits =
    afterCreditsNumerator > 0n ? afterCreditsNumerator : 0n;
  const finalNumerator =
    nonnegativeAfterCredits +
    BigInt(step4AdditionalWithholdingCents) * 10_000n * BigInt(periods);
  const finalDenominator = 10_000n * BigInt(periods);

  return {
    employeeFederalIncomeTaxWithheldCents: roundRatioHalfUp(
      finalNumerator,
      finalDenominator
    ),
  };
}

function calculateFica(input) {
  const currentSocialSecurityWagesCents = requireNonnegativeSafeInteger(
    input.currentSocialSecurityWagesCents,
    "currentSocialSecurityWagesCents"
  );
  const priorYtdSocialSecurityWagesCents = requireNonnegativeSafeInteger(
    input.priorYtdSocialSecurityWagesCents,
    "priorYtdSocialSecurityWagesCents"
  );
  const currentMedicareWagesCents = requireNonnegativeSafeInteger(
    input.currentMedicareWagesCents,
    "currentMedicareWagesCents"
  );
  const priorYtdMedicareWagesCents = requireNonnegativeSafeInteger(
    input.priorYtdMedicareWagesCents,
    "priorYtdMedicareWagesCents"
  );

  const remainingSocialSecurityBaseCents = Math.max(
    0,
    SOCIAL_SECURITY_WAGE_BASE_CENTS - priorYtdSocialSecurityWagesCents
  );
  const currentSocialSecurityTaxableWagesCents = Math.min(
    currentSocialSecurityWagesCents,
    remainingSocialSecurityBaseCents
  );
  const employeeSocialSecurityTaxCents = rateAmountCents(
    currentSocialSecurityTaxableWagesCents,
    SOCIAL_SECURITY_RATE_BPS
  );

  const priorExcessMedicareWagesCents = Math.max(
    0,
    priorYtdMedicareWagesCents - ADDITIONAL_MEDICARE_THRESHOLD_CENTS
  );
  const endingExcessMedicareWagesCents = Math.max(
    0,
    priorYtdMedicareWagesCents +
      currentMedicareWagesCents -
      ADDITIONAL_MEDICARE_THRESHOLD_CENTS
  );
  const currentAdditionalMedicareTaxableWagesCents =
    endingExcessMedicareWagesCents - priorExcessMedicareWagesCents;
  const employeeRegularMedicareTaxCents = rateAmountCents(
    currentMedicareWagesCents,
    MEDICARE_RATE_BPS
  );
  const employeeAdditionalMedicareTaxCents = rateAmountCents(
    currentAdditionalMedicareTaxableWagesCents,
    ADDITIONAL_MEDICARE_RATE_BPS
  );

  return {
    currentSocialSecurityTaxableWagesCents,
    employeeSocialSecurityTaxCents,
    employerSocialSecurityTaxCents: employeeSocialSecurityTaxCents,
    currentAdditionalMedicareTaxableWagesCents,
    employeeRegularMedicareTaxCents,
    employeeAdditionalMedicareTaxCents,
    employeeMedicareTaxCents:
      employeeRegularMedicareTaxCents + employeeAdditionalMedicareTaxCents,
    employerMedicareTaxCents: employeeRegularMedicareTaxCents,
  };
}

function calculateSupplementalFederalWithholding(input) {
  const currentSupplementalWagesCents = requireNonnegativeSafeInteger(
    input.currentSupplementalWagesCents,
    "currentSupplementalWagesCents"
  );
  const priorYtdSupplementalWagesCents = requireNonnegativeSafeInteger(
    input.priorYtdSupplementalWagesCents,
    "priorYtdSupplementalWagesCents"
  );
  if (input.method !== "optionalFlatRate" || input.flatRateEligible !== true) {
    throw new RangeError("Fixture oracle supports only an eligible optional-flat-rate election");
  }

  const thresholdCents = 100_000_000;
  const belowThresholdCents = Math.min(
    currentSupplementalWagesCents,
    Math.max(0, thresholdCents - priorYtdSupplementalWagesCents)
  );
  const aboveThresholdCents = currentSupplementalWagesCents - belowThresholdCents;
  return {
    employeeFederalIncomeTaxWithheldCents:
      rateAmountCents(belowThresholdCents, 2_200) +
      rateAmountCents(aboveThresholdCents, 3_700),
  };
}

function aggregateW2(input) {
  if (!Array.isArray(input.ledgerEntries) || input.ledgerEntries.length === 0) {
    throw new TypeError("ledgerEntries must be a non-empty array");
  }
  const sum = (field) =>
    input.ledgerEntries.reduce(
      (total, entry) => total + requireNonnegativeSafeInteger(entry[field] ?? 0, field),
      0
    );

  const box7SocialSecurityTipsCents = sum("socialSecurityTipsCents");
  const result = {
    box1WagesTipsCompensationCents: sum("federalIncomeTaxWagesCents"),
    box2FederalIncomeTaxWithheldCents: sum("federalIncomeTaxWithheldCents"),
    box3SocialSecurityWagesCents: Math.min(
      sum("socialSecurityWagesCents"),
      Math.max(0, SOCIAL_SECURITY_WAGE_BASE_CENTS - box7SocialSecurityTipsCents)
    ),
    box4SocialSecurityTaxWithheldCents: sum("socialSecurityTaxWithheldCents"),
    box5MedicareWagesTipsCents: sum("medicareWagesTipsCents"),
    box6MedicareTaxWithheldCents: sum("medicareTaxWithheldCents"),
    box7SocialSecurityTipsCents,
  };
  if (result.box4SocialSecurityTaxWithheldCents > MAX_SOCIAL_SECURITY_TAX_CENTS) {
    throw new RangeError("Box 4 exceeds the 2026 employee Social Security maximum");
  }
  return result;
}

module.exports = {
  ADDITIONAL_MEDICARE_THRESHOLD_CENTS,
  MAX_SOCIAL_SECURITY_TAX_CENTS,
  NRA_ADJUSTMENT_CENTS,
  PERIODS_PER_YEAR,
  RATE_SCHEDULES,
  SOCIAL_SECURITY_WAGE_BASE_CENTS,
  aggregateW2,
  calculateFederalIncomeTaxWithholding,
  calculateFica,
  calculateSupplementalFederalWithholding,
  rateAmountCents,
  roundRatioHalfUp,
};
