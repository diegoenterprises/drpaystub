"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const {
  ERROR_CODE,
  READ_ONLY_ALLOWLISTS,
  blockUncertifiedCapability,
  blockUncertifiedGeneratedArtifact,
  createTaxProductGate,
} = require("../middlewares/taxCertificationContainment");

const REPO_ROOT = path.resolve(__dirname, "..");
const RESULT_FIELDS = [
  "secret",
  "free",
  "success",
  "zipSrc",
  "templates",
  "previewFile",
  "pdfFile",
  "zipFile",
  "filename",
];

function responseRecorder() {
  return {
    body: undefined,
    headers: {},
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    set(name, value) {
      this.headers[name] = value;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

function invoke(middleware, { method, url }) {
  const res = responseRecorder();
  let nextCalls = 0;
  middleware({ method, url, path: url.split("?", 1)[0] }, res, () => {
    nextCalls += 1;
  });
  return { res, nextCalls };
}

function assertBlocked(result) {
  assert.equal(result.nextCalls, 0);
  assert.equal(result.res.statusCode, 503);
  assert.equal(result.res.headers["Content-Type"], "application/problem+json");
  assert.equal(result.res.headers["Cache-Control"], "no-store");
  assert.equal(result.res.body.code, ERROR_CODE);
  assert.equal(result.res.body.certificationStatus, "blocked");
  for (const field of RESULT_FIELDS) {
    assert.equal(
      Object.hasOwn(result.res.body, field),
      false,
      `blocked response must not expose result field ${field}`
    );
  }
}

function declaredRoutes(relativeFile) {
  const source = fs.readFileSync(path.join(REPO_ROOT, relativeFile), "utf8");
  return [...source.matchAll(/router\.(get|post|put|patch|delete)\(\s*["']([^"']+)["']/g)].map(
    ([, method, routePath]) => ({ method: method.toUpperCase(), path: routePath })
  );
}

test("paystub router default-denies every declared route except read-only tenant history", () => {
  const gate = createTaxProductGate("paystub");
  const routes = declaredRoutes("routes/paystub.js");
  assert.ok(routes.length > 0);

  for (const route of routes) {
    const result = invoke(gate, { method: route.method, url: route.path });
    if (route.method === "GET" && route.path === "/ytd-profiles") {
      assert.equal(result.nextCalls, 1);
      assert.equal(result.res.body, undefined);
    } else {
      assertBlocked(result);
    }
  }
});

test("W-2 wizard default-denies purchase, preview, generation, prefill, and EFW2 export", () => {
  const gate = createTaxProductGate("w2Wizard");
  const routes = declaredRoutes("routes/w2-wizard.js");
  assert.ok(routes.length > 0);

  for (const route of routes) {
    const concretePath = route.path.replace(":id", "507f1f77bcf86cd799439011");
    const result = invoke(gate, { method: route.method, url: concretePath });
    if (route.method === "GET" && route.path === "/my-w2s") {
      assert.equal(result.nextCalls, 1);
      assert.equal(result.res.body, undefined);
    } else {
      assertBlocked(result);
    }
  }
});

test("unmounted legacy W-2 calculator remains entirely default-deny", () => {
  const gate = createTaxProductGate("legacyW2");
  const routes = declaredRoutes("routes/w2.js");
  assert.ok(routes.length > 0);
  for (const route of routes) {
    assertBlocked(invoke(gate, { method: route.method, url: route.path }));
  }
});

test("subscription checkout cannot create a product purchase result", () => {
  const gate = blockUncertifiedCapability("tax-product-subscription-checkout");
  assertBlocked(invoke(gate, { method: "POST", url: "/checkout" }));
});

test("direct static export of known generated tax-artifact families is blocked", () => {
  const blocked = [
    "/W2_Smith_1723650000000.pdf",
    "/W2_PREVIEW_Smith_1723650000000.pdf",
    "/public/W2_Smith_1723650000000.zip",
    "/paystub-1723650000000-1.pdf",
    "/paystub-1723650000000-1.png",
    "/acme-payroll-8-2026-12345.zip",
    "/acme-payroll-8-2026-12345-2.pdf",
  ];
  for (const url of blocked) {
    assertBlocked(
      invoke(blockUncertifiedGeneratedArtifact, { method: "GET", url })
    );
  }

  for (const url of ["/logo.png", "/robots.txt", "/assets/payroll-guide.pdf"]) {
    const result = invoke(blockUncertifiedGeneratedArtifact, {
      method: "GET",
      url,
    });
    assert.equal(result.nextCalls, 1, `${url} should remain available`);
  }
});

test("OPTIONS remains available without enabling any calculation or artifact result", () => {
  for (const surface of Object.keys(READ_ONLY_ALLOWLISTS)) {
    const result = invoke(createTaxProductGate(surface), {
      method: "OPTIONS",
      url: "/anything",
    });
    assert.equal(result.nextCalls, 1);
    assert.equal(result.res.body, undefined);
  }
});

test("containment gates are registered before product handlers and public static files", () => {
  for (const relativeFile of [
    "routes/paystub.js",
    "routes/w2-wizard.js",
    "routes/w2.js",
  ]) {
    const source = fs.readFileSync(path.join(REPO_ROOT, relativeFile), "utf8");
    const gateIndex = source.indexOf("router.use(createTaxProductGate(");
    const firstHandlerIndex = source.search(/router\.(?:get|post|put|patch|delete)\(/);
    assert.ok(gateIndex >= 0, `${relativeFile} must register a gate`);
    assert.ok(
      gateIndex < firstHandlerIndex,
      `${relativeFile} gate must run before its first handler`
    );
  }

  const appSource = fs.readFileSync(path.join(REPO_ROOT, "app.js"), "utf8");
  assert.ok(
    appSource.indexOf("app.use(blockUncertifiedGeneratedArtifact)") <
      appSource.indexOf('express.static(path.join(__dirname, "public"))')
  );
});

test("read-only paystub detail requires authentication and tenant ownership", () => {
  const source = fs.readFileSync(path.join(REPO_ROOT, "routes/auth.js"), "utf8");
  assert.match(
    source,
    /router\.get\("\/get-paystub\/:id",\s*auth\(\)/
  );
  assert.match(source, /"params\.userId":\s*req\.user\._id\.toString\(\)/);
});

test("application startup cannot create or reset a hardcoded administrator", () => {
  const source = fs.readFileSync(path.join(REPO_ROOT, "app.js"), "utf8");
  assert.doesNotMatch(source, /const\s+adminPass\s*=/);
  assert.doesNotMatch(source, /\[Seed\]\s+Admin/);
  assert.doesNotMatch(source, /role:\s*["']admin["'][\s\S]{0,200}isEmailVerified:\s*true/);
});

test("new subscription checkout is gated after authentication and before Stripe logic", () => {
  const source = fs.readFileSync(
    path.join(REPO_ROOT, "routes/subscription.js"),
    "utf8"
  );
  assert.match(
    source,
    /"\/checkout",\s*auth,\s*blockUncertifiedCapability\("tax-product-subscription-checkout"\)/
  );
});
