"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const oracle = require("./reference/2026FederalOracle");

const FIXTURE_PATH = path.join(
  __dirname,
  "fixtures",
  "2026-us-federal-golden-vectors.json"
);
const fixture = JSON.parse(fs.readFileSync(FIXTURE_PATH, "utf8"));

function assertSubset(actual, expected, context) {
  assert.ok(actual && typeof actual === "object", `${context}: result must be an object`);
  for (const [key, expectedValue] of Object.entries(expected)) {
    if (
      expectedValue &&
      typeof expectedValue === "object" &&
      !Array.isArray(expectedValue)
    ) {
      assertSubset(actual[key], expectedValue, `${context}.${key}`);
    } else {
      assert.deepEqual(actual[key], expectedValue, `${context}.${key}`);
    }
  }
}

const ORACLE_METHODS = Object.freeze({
  federalIncomeTaxWithholding: oracle.calculateFederalIncomeTaxWithholding,
  supplementalFederalWithholding:
    oracle.calculateSupplementalFederalWithholding,
  fica: oracle.calculateFica,
  w2Aggregation: oracle.aggregateW2,
});

test("fixture identifies only official primary authorities and immutable IRS PDF hashes", () => {
  assert.equal(fixture.schemaVersion, "1.0.0");
  assert.equal(fixture.taxYear, 2026);
  assert.equal(fixture.jurisdiction, "US-FED");
  assert.match(fixture.roundingPolicy, /integer|rational|nearest cent/i);

  const authorityIds = new Set();
  for (const authority of fixture.authorities) {
    assert.match(authority.url, /^https:\/\/(?:www\.)?(?:irs|ssa)\.gov\//);
    assert.equal(authorityIds.has(authority.id), false, `duplicate authority ${authority.id}`);
    authorityIds.add(authority.id);
    if (authority.sha256) assert.match(authority.sha256, /^[a-f0-9]{64}$/);
  }

  for (const vector of fixture.vectors) {
    assert.ok(vector.authorityRefs.length > 0, `${vector.id} requires authority refs`);
    for (const authorityRef of vector.authorityRefs) {
      assert.ok(authorityIds.has(authorityRef), `${vector.id}: unknown authority ${authorityRef}`);
    }
  }
});

test("independent exact-cent oracle reproduces every bounded calculation vector", () => {
  const calculationVectors = fixture.vectors.filter(
    (vector) => vector.capability !== "efw2Serialization"
  );
  assert.ok(calculationVectors.length >= 16);

  for (const vector of calculationVectors) {
    const method = ORACLE_METHODS[vector.capability];
    assert.equal(typeof method, "function", `${vector.id}: missing oracle method`);
    const actual = method(vector.input);
    assertSubset(actual, vector.expected, vector.id);
  }
});

test("all fixture money inputs and expected outputs are integer cents", () => {
  function visit(value, keyPath = "fixture") {
    if (Array.isArray(value)) {
      value.forEach((entry, index) => visit(entry, `${keyPath}[${index}]`));
      return;
    }
    if (!value || typeof value !== "object") return;
    for (const [key, child] of Object.entries(value)) {
      const nextPath = `${keyPath}.${key}`;
      if (key.endsWith("Cents")) {
        assert.ok(Number.isSafeInteger(child), `${nextPath} must be a safe integer`);
        assert.ok(child >= 0, `${nextPath} must be nonnegative`);
      } else {
        visit(child, nextPath);
      }
    }
  }
  visit(fixture.vectors);
});

test("EFW2 vector encodes its selected Tax Year 2026 fixed-width invariants exactly", () => {
  const vector = fixture.vectors.find(
    (candidate) => candidate.capability === "efw2Serialization"
  );
  assert.ok(vector);
  assert.deepEqual(vector.expected.recordOrder, ["RA", "RE", "RW", "RT", "RF"]);
  assert.equal(vector.expected.recordLength, 512);

  for (const assertion of vector.expected.positions) {
    assert.match(assertion.record, /^(?:RA|RE|RW|RT|RF)$/);
    assert.ok(assertion.start >= 1);
    assert.ok(assertion.end <= 512);
    assert.ok(assertion.end >= assertion.start);
    assert.equal(
      assertion.value.length,
      assertion.end - assertion.start + 1,
      `${assertion.record} ${assertion.start}-${assertion.end}`
    );
    if (assertion.record === "RW" && assertion.start >= 188 && assertion.end <= 253) {
      assert.match(assertion.value, /^\d+$/);
    }
  }
});

test("oracle rejects floating-point, negative, or unsupported payroll inputs", () => {
  assert.throws(
    () =>
      oracle.calculateFica({
        currentSocialSecurityWagesCents: 1000.5,
        priorYtdSocialSecurityWagesCents: 0,
        currentMedicareWagesCents: 1000,
        priorYtdMedicareWagesCents: 0,
      }),
    /safe integer/
  );
  assert.throws(
    () =>
      oracle.calculateFederalIncomeTaxWithholding({
        taxableWagesCents: -1,
        payFrequency: "biweekly",
        w4: {},
      }),
    /nonnegative/
  );
  assert.throws(
    () =>
      oracle.calculateFederalIncomeTaxWithholding({
        taxableWagesCents: 100000,
        payFrequency: "every-fortnight-ish",
        w4: {},
      }),
    /Unsupported pay frequency/
  );
  assert.throws(
    () =>
      oracle.calculateFederalIncomeTaxWithholding({
        taxableWagesCents: 100000,
        payFrequency: "biweekly",
        w4: {
          filingStatus: "singleOrMarriedFilingSeparately",
          exempt: true,
        },
      }),
    /validated current-year certification/
  );
});

test("uncertified scope is explicit rather than implied by a passing bounded fixture", () => {
  assert.ok(Array.isArray(fixture.explicitUncertifiedGaps));
  assert.ok(fixture.explicitUncertifiedGaps.length >= 10);
  assert.ok(fixture.explicitUncertifiedGaps.some((gap) => /state/i.test(gap)));
  assert.ok(fixture.explicitUncertifiedGaps.some((gap) => /AccuWage/i.test(gap)));
  assert.ok(fixture.explicitUncertifiedGaps.some((gap) => /W-2c/i.test(gap)));
});
