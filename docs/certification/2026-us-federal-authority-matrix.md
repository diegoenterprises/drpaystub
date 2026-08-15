# 2026 US federal payroll authority matrix and independent conformance vectors

Status as of 2026-08-14: **not certified; runtime containment remains required**.

This package is an independent review artifact. It does not turn the legacy
calculator, paystub generator, W-2 wizard, or EFW2 writer back on. A pass means
only that a candidate reproduces the bounded vectors in this repository. It is
not an IRS or SSA approval, an AccuWage acceptance, or a production release
certificate.

## Frozen review points

- Public safe base reviewed: `5fc39f0` (the hardcoded startup administrator was
  already removed from this base).
- Fail-closed containment commit: `36c5145`.
- Original calculation/artifact base: `e51173f5c9b4cfeb3430b6181b7947d7391e85f7`.
- Golden-vector schema: `tests/fixtures/2026-us-federal-golden-vectors.json`.
- Independent, test-only oracle: `tests/reference/2026FederalOracle.js`.
- Candidate adapter: `scripts/run-2026-federal-certification.js`.

The oracle is deliberately outside runtime code. It uses integer cents and
integer basis points, keeps percentage-method arithmetic rational through the
final division, and rounds only the final component to the nearest cent, half
up. Production code must have a separately reviewed, versioned rule pack and
must emit an auditable calculation receipt; copying the test oracle into the
application is not certification.

## Pinned official authorities

Only primary government sources establish values in this package.

| Authority | Retrieved | Pinned evidence | Scope used |
| --- | --- | --- | --- |
| [IRS Publication 15-T (2026)](https://www.irs.gov/publications/p15t) | 2026-08-14 | PDF SHA-256 `31b3e2428628e8d2e40f6266c2c8f1b9b0b6ccd24607895f9b3be3d9d306d3fb` | Worksheet 1A, 2020-or-later Form W-4 fields, exact pay-period counts, standard and Step 2 checkbox schedules, nonresident-alien Table 2 |
| [IRS Publication 15 (2026)](https://www.irs.gov/publications/p15) | 2026-08-14 | PDF SHA-256 `b46c3622439d8521e3a0faca4cd5b5ece3451b526f65f06a5e38d5c9f804c88b` | Social Security, Medicare, Additional Medicare, supplemental wages |
| [SSA Contribution and Benefit Base](https://www.ssa.gov/OACT/cola/cbb.html) | 2026-08-14 | Live official table | 2026 Social Security wage base |
| [IRS General Instructions for Forms W-2 and W-3 (2026)](https://www.irs.gov/instructions/iw2w3) | 2026-08-14 | PDF SHA-256 `d16b9f506f039f5af24f01fad699b0b60d392ac7920fcff528c7d97740c792b6` | Boxes 1 through 7, actual-withheld reporting, maximums, annual reconciliation |
| [SSA EFW2 Tax Year 2026](https://www.ssa.gov/employer/efw/26efw2.pdf) | 2026-08-14 | Publication 42-007, observed revision `7/7/2026` | Required sequencing, 512-byte records, RA/RE required fields, selected RW/RT/RF positions and money encoding |
| [SSA AccuWage Online](https://www.ssa.gov/employer/accuwage/) | 2026-08-14 | Live official service page | External pre-submission validation gate |

The SSA EFW2 PDF is updateable during the filing year. Production rule packs
must store the downloaded bytes, digest, observed revision, retrieval time,
reviewer, effective tax year, and supersession relationship. A URL alone is
not immutable provenance.

## Authority and release matrix

| Capability | Required authoritative behavior | Required state/input | Legacy result | Release gate |
| --- | --- | --- | --- | --- |
| Regular federal income-tax withholding | Publication 15-T Worksheet 1A and the correct standard or Step 2 checkbox schedule | Exact taxable wages, exact pay frequency, effective signed Form W-4, W-4 version, Steps 2-4, NRA status/exception, lock-in state, payment date | **Fail.** `services/paystub.service.js` annualizes with `365 / days`, applies regular income-tax brackets, and has no W-4 Steps 2-4 contract | Every supported W-4/pay-frequency/schedule boundary and adverse input passes independent fixtures; unsupported cases fail closed |
| Electronic Form W-4 intake | Exact required form text/instructions, identity assurance, final e-signature, access/submission log, hard-copy reproduction, retention, exemption certification | Immutable signed submission and effective-date history | **Missing** | Separate legal/control review and exact-form UI conformance; calculation cannot accept an unversioned boolean-only W-4 |
| Social Security tax | 6.2% employee and employer on current taxable wages remaining under the employee's 2026 YTD base of $184,500 | Calendar-year employee wage accumulator and current taxable classification | **Fail.** It caps an annualized current check, not cumulative employee wages (`services/paystub.service.js:361-367`) | Below, exact-cap, crossing, already-capped, predecessor/successor, tips, correction, and rounding/reconciliation suites pass |
| Medicare tax | 1.45% employee and employer, no wage cap | Current Medicare-taxable wages | Partially represented, but not ledger-authoritative | Classification and both shares pass cent/reconciliation fixtures |
| Additional Medicare withholding | 0.9% employee-only on wages an employer pays above $200,000 in the calendar year, beginning in the crossing pay period; no employer share | Employer-specific employee Medicare-wage YTD | **Fail.** Legacy code uses filing-status thresholds and annualized wages (`services/paystub.service.js:58-64,353-358`) | Crossing, post-crossing, corrections, third-party/common-paymaster rules and Form 941/W-2 reconciliation pass |
| Supplemental federal withholding | Eligible optional flat 22%; mandatory 37% on the portion over the aggregate $1 million threshold; all eligibility/aggregation rules enforced | Wage type, regular-wage history, method election, common-control aggregate YTD | **Missing** | Optional-flat, aggregate-method, $1 million crossing, common-control and mixed-payment vectors pass |
| Paystub/YTD artifact | Render only a committed, server-authoritative calculation receipt; never recalculate in a template or browser | Tenant, employee, pay run, immutable ledger entries, rule-pack digest, idempotency key | **Fail.** YTD values are projected by repeatedly adding the current check (`services/paystub.service.js:226-243,408-442`) | Posted ledger, reversal/correction, replay/hash, ownership, idempotency and artifact-binding tests pass |
| Form W-2 | Boxes are ledger sums of actual taxable wages and actual tax withheld, with box-specific classification and caps; never recompute annual tax liability | Closed tax-year ledger, employer/employee identity, correction history | **Fail.** Wizard accepts client-authored box strings (`routes/w2-wizard.js:219-367,374-515`); legacy router recomputes taxes | Full box/code matrix, W-2/W-3 reconciliation, correction flows, identifier validation and official form-version review pass |
| EFW2 | Current Tax Year 2026 specification, exact 512-byte records, required RA/RE/RW/RT/RF order/fields/totals; correct optional records when applicable | Validated W-2 ledger, real BSO submitter ID and contacts, employer classification, jurisdiction | **Fail.** Legacy RA/RE/RW/RF offsets are obsolete; for example Box 1 starts at 171 instead of 188 and RF count starts at 3 instead of 8 (`routes/w2-wizard.js:544-645,679-728`) | Exhaustive field-layout and sequencing suite, multi-employer/employee totals, ASCII/byte tests, negative tests, current-source digest, and AccuWage acceptance evidence pass |
| State/local/territorial/Canada/Mexico | Jurisdiction-specific official rule packs, effective dates and reciprocity/nexus/location resolution | Work/residence locations, locality codes, wage bases, elections, YTD, official source provenance | **Not reviewed or certified here** | Activate one jurisdiction/version at a time only after its own authority matrix, legal review, golden/adverse fixtures and production canary |

## Bounded federal vectors

The checked-in JSON contains explicit expected integer-cent results, source
references, and selected EFW2 positions. It currently covers:

- Publication 15-T regular withholding for all three 2020-or-later filing
  status families represented in the automated percentage schedules;
- Step 2 checkbox, Step 3 credits, Steps 4(a), 4(b), and 4(c);
- one prevalidated current-year exemption case and one Table 2 NRA adjustment;
- eligible 22% supplemental withholding and a pay period crossing the $1
  million 22%/37% boundary;
- ordinary FICA, Social Security cap crossing/already-reached periods, and
  Additional Medicare crossing/already-crossed periods;
- ledger-backed W-2 Boxes 1-7 at the 2026 Social Security maximum; and
- one synthetic regular-employer EFW2 shape with selected required fields,
  Boxes 1-6, totals, record order, 512-byte length, and the RF count at
  positions 8-16.

Example derivation: $2,000 biweekly, Single or Married Filing Separately,
2026 W-4 with Steps 2-4 blank. Annual wages are $52,000. Worksheet 1A subtracts
$8,600, leaving $43,400. The standard schedule gives $1,240 plus 12% of
$23,500, or $4,060 annually. $4,060 / 26 is $156.1538..., so the bounded
policy expects **$156.15**. The inherited implementation produces a materially
different result because it is not Publication 15-T withholding.

## Run the independent checks

Validate the frozen authorities, fixture shape, exact-cent oracle, and explicit
gaps:

```sh
npm run test:2026-federal-fixtures
npm run test:tax-containment
```

Evaluate a candidate CommonJS adapter:

```sh
npm run certify:2026-federal -- /absolute/path/to/candidate-module.js
```

The candidate must export:

- `calculateFederalIncomeTaxWithholding(input)`
- `calculateSupplementalFederalWithholding(input)`
- `calculateFica(input)`
- `aggregateW2(input)`
- `buildEfw2(input)`

Methods may be synchronous or asynchronous. Calculation results must use the
same integer-cent field names as the fixtures. `buildEfw2` must return a Buffer
or ASCII text. Missing adapters, missing methods, mismatches, non-ASCII EFW2,
wrong sequence, wrong record length, or wrong selected positions fail the run.

## Explicit non-coverage

The JSON's `explicitUncertifiedGaps` array is part of the test contract. Major
gaps include old W-4 computational bridges, lock-in letters, full electronic
W-4 controls, NRA exceptions, aggregate supplemental methods, wage-base and
benefit classification, special employment, corrections, every untested W-2
box/code, new 2026 tip/overtime/section 128 reporting, exhaustive EFW2/EFW2C,
territories, state/local rules, Canada, Mexico, and real AccuWage/BSO evidence.
Passing the bounded vectors must never remove these gaps from release status.

## Certification ladder to replace containment

1. Inventory and version every supported input, output, jurisdiction, wage
   type, benefit, tax, artifact, and correction flow. Unknown enum values and
   missing effective state fail closed.
2. Ingest immutable official source artifacts into a signed rule-pack manifest
   with hashes, effective dates, supersession, reviewer approvals and rollback
   metadata. No rate or threshold may exist without provenance.
3. Implement server-authoritative integer/decimal arithmetic, YTD accumulators,
   per-component rounding, immutable receipts, deterministic replay and diff.
4. Expand independent golden fixtures to every bracket boundary, pay frequency,
   cap/threshold crossing, classification, W-4 state, W-2 box/code, EFW2 field,
   correction and negative case in the declared support matrix.
5. Reconcile pay-run liabilities to employee ledgers, Forms 941/940, W-2/W-3,
   deposits and correction ledgers. Artifact generation consumes only the
   exact posted receipt and ledger version.
6. Run security and tenancy gates: authentication, object ownership, API-key
   scope, idempotency, signed webhook replay protection, encryption/redaction,
   immutable audit trail and no secrets/PII in logs or public paths.
7. Obtain two-person tax review, legal/compliance approval, complete CI evidence,
   SSA AccuWage acceptance for every supported EFW2 shape, and an operations
   rollback/drift-monitoring drill.
8. Narrow containment only for the exact certified capability/rule-pack/tax-year
   combination. Canary it, compare shadow receipts, monitor source changes and
   automatically fail closed on expired/superseded/unverified packs.

No purchase, preview, generated paystub, W-2, EFW2, API result, or success
response should be restored merely because the bounded adapter command passes.
