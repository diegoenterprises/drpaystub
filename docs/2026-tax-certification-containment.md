# 2026 payroll-tax certification containment

Status: **blocked**. This is a temporary safety boundary, not the target product.

The payroll, paystub, W-2, and EFW2 implementation inherited at commit
`e51173f5c9b4cfeb3430b6181b7947d7391e85f7` has not passed the 2026 IRS/SSA
certification suite. Until a reviewed server-authoritative implementation
passes official-source golden vectors, no caller may create, buy, preview,
download, or export a newly calculated tax result or tax artifact.

## Runtime policy

The policy is deliberately not controlled by an environment variable. A code
review is required to remove or narrow it.

Allowed product routes:

- `GET /api/paystub/ytd-profiles` — authenticated tenant history metadata.
- `GET /api/w2-wizard/my-w2s` — authenticated tenant W-2 history inventory.
- `OPTIONS` — transport preflight only.

Blocked paystub routes:

- `POST /api/paystub/getZip`
- `GET /api/paystub/test-email`
- `POST /api/paystub/save-stub`
- `POST /api/paystub/templates`
- `GET /api/paystub/payment-intent`
- `GET /api/paystub/new`
- Any future route under `/api/paystub` unless explicitly reviewed and
  allowlisted.

Blocked W-2 routes:

- `GET /api/w2-wizard/payment-intent`
- `POST /api/w2-wizard/preview`
- `POST /api/w2-wizard/generate`
- `GET /api/w2-wizard/efile/:id`
- `GET /api/w2-wizard/prefill-from-paystubs`
- Any future route under `/api/w2-wizard` unless explicitly reviewed and
  allowlisted.
- Every route in the currently unmounted legacy `routes/w2.js` router.

Blocked sales/export paths:

- `POST /api/subscription/checkout` (billing portal access and cancellation
  remain available to existing customers).
- Direct static requests for known generated W-2, paystub, PDF, ZIP, and
  preview filename families.

All blocked API responses use HTTP 503 and
`application/problem+json` with code
`TAX_PRODUCT_CERTIFICATION_REQUIRED`. They contain no success flag, payment
secret, calculation, preview, file path, or artifact result.

`GET /api/auth/get-paystub/:id` was changed from unauthenticated lookup by
object ID to an authenticated, tenant-owned lookup. This is required before
calling existing history “read-only and tenant-safe.”

The application startup's hardcoded administrator creation/password-reset
block was removed. Administrative identity bootstrap and recovery must use a
separately reviewed, auditable control-plane procedure; application boot must
never create or reset a privileged credential.

## Removal criteria

Do not remove this containment until all of the following are evidenced:

1. Federal income-tax withholding implements the applicable 2026 Publication
   15-T method, all supported Form W-4 inputs, pay frequencies, and a declared
   rounding policy.
2. Social Security and Medicare calculations use authoritative taxable wage
   bases and calendar-year-to-date wage accumulators, including cap/threshold
   crossing periods and employer/employee shares.
3. W-2 boxes report ledger-backed actual wages and amounts withheld rather
   than recomputing annual liability.
4. W-2 validation enforces identifier, money, tax-year, cross-box, and maximum
   constraints before preview or generation.
5. EFW2 output matches every Tax Year 2026 field position, required field,
   record sequence, record total, and formatting rule, and passes SSA
   AccuWage Online.
6. Purchase and generation are server-authoritative, idempotent, auditable,
   replayable, and tied to the same certified calculation receipt.
7. Independent official-source golden and adversarial vectors pass in CI.

## Regression command

```sh
npm run test:tax-containment
```
