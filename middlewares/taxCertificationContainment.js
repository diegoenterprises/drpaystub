"use strict";

/**
 * Temporary, non-configurable containment for payroll-tax products that have
 * not yet passed the 2026 certification suite. Removing this gate requires a
 * reviewed code change; an environment variable must never silently enable an
 * uncertified calculation or artifact path.
 */

const PROBLEM_TYPE =
  "https://www.drpaystub.net/problems/tax-product-certification-required";
const ERROR_CODE = "TAX_PRODUCT_CERTIFICATION_REQUIRED";

const READ_ONLY_ALLOWLISTS = Object.freeze({
  paystub: Object.freeze([
    Object.freeze({ method: "GET", path: "/ytd-profiles" }),
  ]),
  w2Wizard: Object.freeze([
    Object.freeze({ method: "GET", path: "/my-w2s" }),
  ]),
  legacyW2: Object.freeze([]),
});

function requestPath(req) {
  const candidate = req.path || req.url || req.originalUrl || "/";
  const withoutQuery = String(candidate).split("?", 1)[0] || "/";
  try {
    return decodeURIComponent(withoutQuery);
  } catch (_) {
    return withoutQuery;
  }
}

function sendCertificationProblem(res, capability) {
  res.status(503);
  res.set("Content-Type", "application/problem+json");
  res.set("Cache-Control", "no-store");
  return res.json({
    type: PROBLEM_TYPE,
    title: "Tax product certification required",
    status: 503,
    code: ERROR_CODE,
    detail:
      "This payroll-tax capability is unavailable until its 2026 rules and output format pass certification.",
    capability,
    certificationStatus: "blocked",
  });
}

function createTaxProductGate(surface) {
  const allowlist = READ_ONLY_ALLOWLISTS[surface];
  if (!allowlist) {
    throw new Error(`Unknown tax-product containment surface: ${surface}`);
  }

  return function taxProductCertificationGate(req, res, next) {
    const method = String(req.method || "GET").toUpperCase();
    if (method === "OPTIONS") return next();

    const path = requestPath(req);
    const allowed = allowlist.some(
      (route) => route.method === method && route.path === path
    );
    if (allowed) return next();

    return sendCertificationProblem(res, `${surface}:${method}:${path}`);
  };
}

function blockUncertifiedCapability(capability) {
  return function uncertifiedCapabilityGate(req, res) {
    return sendCertificationProblem(res, capability);
  };
}

// Generated files were historically placed under the public static root.
// Block known payroll/W-2 filename families so a caller cannot bypass the API
// gate by requesting a previously generated, uncertified artifact directly.
const GENERATED_TAX_ARTIFACT =
  /^\/(?:public\/)?(?:W2_(?:PREVIEW_)?[^/]+\.(?:pdf|zip)|paystub-[^/]+\.(?:pdf|png|zip)|[^/]+-payroll-\d{1,2}-\d{4}-\d+(?:-[^/]+)?\.(?:pdf|zip))$/i;

function blockUncertifiedGeneratedArtifact(req, res, next) {
  const method = String(req.method || "GET").toUpperCase();
  if (method === "OPTIONS") return next();
  if ((method === "GET" || method === "HEAD") && GENERATED_TAX_ARTIFACT.test(requestPath(req))) {
    return sendCertificationProblem(res, "generated-tax-artifact-export");
  }
  return next();
}

module.exports = {
  ERROR_CODE,
  PROBLEM_TYPE,
  READ_ONLY_ALLOWLISTS,
  blockUncertifiedCapability,
  blockUncertifiedGeneratedArtifact,
  createTaxProductGate,
  requestPath,
  sendCertificationProblem,
};
