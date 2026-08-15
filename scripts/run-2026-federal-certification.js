#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const fixture = JSON.parse(
  fs.readFileSync(
    path.join(
      __dirname,
      "..",
      "tests",
      "fixtures",
      "2026-us-federal-golden-vectors.json"
    ),
    "utf8"
  )
);

const candidateArgument = process.argv[2];
if (!candidateArgument) {
  console.error(
    "Usage: npm run certify:2026-federal -- /absolute/or/relative/path/to/candidate-module.js"
  );
  process.exit(2);
}

const candidatePath = path.resolve(process.cwd(), candidateArgument);
if (!fs.existsSync(candidatePath)) {
  console.error(`Candidate module does not exist: ${candidatePath}`);
  process.exit(2);
}

const candidate = require(candidatePath);

const METHOD_NAMES = Object.freeze({
  federalIncomeTaxWithholding: "calculateFederalIncomeTaxWithholding",
  supplementalFederalWithholding: "calculateSupplementalFederalWithholding",
  fica: "calculateFica",
  w2Aggregation: "aggregateW2",
  efw2Serialization: "buildEfw2",
});

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

function recordsFromEfw2(output) {
  const text = Buffer.isBuffer(output) ? output.toString("ascii") : String(output);
  assert.equal(/[^\x0D\x0A\x20-\x7E]/.test(text), false, "EFW2 must be printable ASCII");
  const records = text.split(/\r?\n/);
  if (records.at(-1) === "") records.pop();
  return records;
}

async function runVector(vector) {
  const methodName = METHOD_NAMES[vector.capability];
  const method = candidate[methodName];
  assert.equal(
    typeof method,
    "function",
    `${vector.id}: candidate must export ${methodName}()`
  );
  const actual = await method(vector.input);

  if (vector.capability !== "efw2Serialization") {
    assertSubset(actual, vector.expected, vector.id);
    return;
  }

  const records = recordsFromEfw2(actual);
  assert.deepEqual(
    records.map((record) => record.slice(0, 2)),
    vector.expected.recordOrder,
    `${vector.id}: record order`
  );
  for (const record of records) {
    assert.equal(
      record.length,
      vector.expected.recordLength,
      `${vector.id}: ${record.slice(0, 2)} record length`
    );
  }
  for (const position of vector.expected.positions) {
    const record = records.find((candidateRecord) => candidateRecord.startsWith(position.record));
    assert.ok(record, `${vector.id}: missing ${position.record}`);
    assert.equal(
      record.slice(position.start - 1, position.end),
      position.value,
      `${vector.id}: ${position.record} positions ${position.start}-${position.end}`
    );
  }
}

(async () => {
  let passed = 0;
  for (const vector of fixture.vectors) {
    await runVector(vector);
    passed += 1;
    console.log(`PASS ${vector.id}`);
  }
  console.log(
    `BOUNDED CONFORMANCE PASS: ${passed}/${fixture.vectors.length} vectors; this is not production certification and explicit gaps remain uncertified.`
  );
})().catch((error) => {
  console.error(`CERTIFICATION FIXTURE FAIL: ${error.message}`);
  process.exitCode = 1;
});
