global.fetch = require("node-fetch");
process.setMaxListeners(Infinity);
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const express = require("express");
const path = require("path");
const app = express();
const connectDB = require("./db");
const cors = require("cors");
const fs = require("fs");
const { logo: watermark } = require("./config/logo");
const moment = require("moment");

app.use(logger("dev"));
app.set("view engine", "ejs");

app.use(cors());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(
  express.json({
    extended: false,
    limit: "50mb",
    verify: function (req, res, buf) {
      req.rawBody = buf;
    },
  })
);

app.use(cookieParser());

// ─── SEO + Security + E-E-A-T Headers Middleware ────────────────────────────
app.use((req, res, next) => {
  // Security headers (Trust signals — Section 9.4 of enterprise strategy)
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "geolocation=(self), camera=(), microphone=(), payment=(self)");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  res.setHeader("Content-Security-Policy", "upgrade-insecure-requests");
  // Cache static assets aggressively for Core Web Vitals (Section 2.3)
  if (req.url.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|webp)$/)) {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.setHeader("Vary", "Accept-Encoding");
  }
  // HTML pages: short cache for freshness + maximum SERP real estate
  if (req.url === "/" || !req.url.match(/\./)) {
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=600");
    res.setHeader("X-Robots-Tag", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
  }
  // Sitemap and SEO files: medium cache
  if (req.url.match(/\.(xml|txt)$/) || req.url === "/sitemap.xml" || req.url === "/robots.txt") {
    res.setHeader("Cache-Control", "public, max-age=3600");
  }
  next();
});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "assets")));

app.use(express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/blogs", require("./routes/blogs"));
app.use("/api/sendmails", require("./routes/sendmails"));
app.use("/api/reviews", require("./routes/review"));
app.use("/api/paystub", require("./routes/paystub"));
app.use("/api/states", require("./routes/states"));
app.use("/api/w2-wizard", require("./routes/w2-wizard"));
app.use("/api/stripe/webhook", require("./routes/stripe-webhook"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/subscription", require("./routes/subscription"));
app.use("/api/admin", require("./routes/admin"));

app.use(express.static("client/build"));

// ─── SEO: Explicit routes for critical SEO files ────────────────────────────
// Guarantee these files are served correctly regardless of catch-all routing
app.get("/sitemap.xml", (req, res) => {
  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.sendFile(path.join(__dirname, "client", "build", "sitemap.xml"));
});
app.get("/robots.txt", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.sendFile(path.join(__dirname, "client", "build", "robots.txt"));
});
app.get("/llms.txt", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.sendFile(path.join(__dirname, "client", "build", "llms.txt"));
});
app.get("/manifest.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.sendFile(path.join(__dirname, "client", "build", "manifest.json"));
});
app.get("/google18a9dbc061e1396f.html", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "google18a9dbc061e1396f.html"));
});
app.get("/BingSiteAuth.xml", (req, res) => {
  res.setHeader("Content-Type", "application/xml");
  res.sendFile(path.join(__dirname, "client", "build", "BingSiteAuth.xml"));
});
app.get("/yandex_f77cdc8c504c6a2d.html", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "yandex_f77cdc8c504c6a2d.html"));
});
app.get("/saurellius-indexnow-key.txt", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.sendFile(path.join(__dirname, "client", "build", "saurellius-indexnow-key.txt"));
});

// ─── IndexNow API: Instant indexing for Bing, Yandex, Seznam, Naver ────────
app.post("/api/indexnow", (req, res) => {
  const { urls } = req.body;
  if (!urls || !Array.isArray(urls)) return res.status(400).json({ error: "urls array required" });
  const payload = {
    host: "www.drpaystub.net",
    key: "saurellius-indexnow-key",
    keyLocation: "https://www.drpaystub.net/saurellius-indexnow-key.txt",
    urlList: urls.map(u => u.startsWith("http") ? u : `https://www.drpaystub.net${u}`)
  };
  const https = require("https");
  const data = JSON.stringify(payload);
  const req2 = https.request({
    hostname: "api.indexnow.org",
    path: "/indexnow",
    method: "POST",
    headers: { "Content-Type": "application/json", "Content-Length": data.length }
  }, (resp) => {
    let body = "";
    resp.on("data", c => body += c);
    resp.on("end", () => res.json({ status: resp.statusCode, response: body }));
  });
  req2.on("error", (e) => res.status(500).json({ error: e.message }));
  req2.write(data);
  req2.end();
});

// ─── SEO: Programmatic state law pages + calculator routes ──────────────────
const US_STATES = ["alabama","alaska","arizona","arkansas","california","colorado","connecticut","delaware","florida","georgia","hawaii","idaho","illinois","indiana","iowa","kansas","kentucky","louisiana","maine","maryland","massachusetts","michigan","minnesota","mississippi","missouri","montana","nebraska","nevada","new-hampshire","new-jersey","new-mexico","new-york","north-carolina","north-dakota","ohio","oklahoma","oregon","pennsylvania","rhode-island","south-carolina","south-dakota","tennessee","texas","utah","vermont","virginia","washington","west-virginia","wisconsin","wyoming"];

const STATE_NAMES = {"alabama":"Alabama","alaska":"Alaska","arizona":"Arizona","arkansas":"Arkansas","california":"California","colorado":"Colorado","connecticut":"Connecticut","delaware":"Delaware","florida":"Florida","georgia":"Georgia","hawaii":"Hawaii","idaho":"Idaho","illinois":"Illinois","indiana":"Indiana","iowa":"Iowa","kansas":"Kansas","kentucky":"Kentucky","louisiana":"Louisiana","maine":"Maine","maryland":"Maryland","massachusetts":"Massachusetts","michigan":"Michigan","minnesota":"Minnesota","mississippi":"Mississippi","missouri":"Missouri","montana":"Montana","nebraska":"Nebraska","nevada":"Nevada","new-hampshire":"New Hampshire","new-jersey":"New Jersey","new-mexico":"New Mexico","new-york":"New York","north-carolina":"North Carolina","north-dakota":"North Dakota","ohio":"Ohio","oklahoma":"Oklahoma","oregon":"Oregon","pennsylvania":"Pennsylvania","rhode-island":"Rhode Island","south-carolina":"South Carolina","south-dakota":"South Dakota","tennessee":"Tennessee","texas":"Texas","utah":"Utah","vermont":"Vermont","virginia":"Virginia","washington":"Washington","west-virginia":"West Virginia","wisconsin":"Wisconsin","wyoming":"Wyoming"};

// ─── SEO: Per-route meta injection for crawlers ─────────────────────────────
// Search engine crawlers get page-specific titles/descriptions injected server-side
// This is critical for SPA SEO since React renders client-side
const SEO_ROUTES = {
  "/": { title: "Saurellius — #1 Professional Paystub & W-2 Generator | Instant PDF | FICA Compliant", desc: "Create professional, secure payroll check stubs and W-2 forms online in minutes. Automatic federal, state, and local tax calculations. FICA compliant. 6 premium templates. Starting at $7.99." },
  "/paystubs": { title: "Create Pay Stub Online — Automatic Tax Calculator | Saurellius", desc: "Generate professional pay stubs with automatic federal, state, local tax, Social Security, and Medicare calculations. Hourly or salaried. 6 premium templates. Instant PDF download. Starting at $7.99." },
  "/w2form": { title: "W-2 Form Generator Online — IRS Compliant | Saurellius", desc: "Generate IRS-compliant W-2 forms online. Automatic calculation of all W-2 boxes including federal tax, Social Security, Medicare, and state taxes. Instant PDF download." },
  "/w2-wizard": { title: "W-2 Wizard — Auto-Fill W-2 from Pay Stubs | Saurellius", desc: "Smart W-2 wizard that auto-fills all boxes from your existing paystub data. Calculates total wages, taxes withheld, Social Security, and Medicare automatically." },
  "/w2forms": { title: "W-2 Forms — Generate Tax Documents Online | Saurellius", desc: "Create W-2 tax forms online with automatic calculations. IRS compliant, instant PDF download, auto-fill from paystub history." },
  "/templates": { title: "Pay Stub Templates — 6 Professional Designs | Saurellius", desc: "Choose from 6 professional paystub templates designed to match real-world payroll software. Clean layouts, all tax fields, digital signatures, and print-ready PDFs." },
  "/blogs": { title: "Payroll Blog — Tax Tips, Guides & Resources | Saurellius", desc: "Expert payroll articles, tax calculation guides, FICA explanations, state tax breakdowns, and small business payroll tips. Stay updated on tax law changes." },
  "/reviews": { title: "Customer Reviews — 4.8★ Rating | Saurellius Paystub Generator", desc: "Read what 2,800+ customers say about Saurellius. Rated 4.8/5 stars for accuracy, ease of use, and professional quality pay stubs." },
  "/about": { title: "About Saurellius — Professional Payroll Solutions | Dr. Paystub Corp", desc: "Learn about Saurellius by Dr. Paystub Corp. We provide professional payroll document generation with bank-grade accuracy and FICA compliance for businesses of all sizes." },
  "/contact": { title: "Contact Us — Customer Support | Saurellius", desc: "Get help with pay stubs, W-2 forms, tax calculations, or account questions. Our support team is here to help you with your payroll document needs." },
  "/register": { title: "Sign Up Free — Create Pay Stubs in Minutes | Saurellius", desc: "Create your free Saurellius account and start generating professional pay stubs and W-2 forms in minutes. No credit card required to sign up." },
  "/login": { title: "Log In to Your Account | Saurellius", desc: "Access your Saurellius dashboard to create pay stubs, generate W-2 forms, and manage your payroll documents." },
  "/privacyPolicy": { title: "Privacy Policy | Saurellius by Dr. Paystub Corp", desc: "Read the Saurellius privacy policy. We protect your personal and financial data with bank-grade security. Your information is never shared with third parties." },
  "/terms-and-conditions": { title: "Terms & Conditions | Saurellius by Dr. Paystub Corp", desc: "Read the terms and conditions for using Saurellius pay stub and W-2 generation services." },
};

// Dynamically generate SEO routes for all 50 state paystub law pages + state tax calculators
US_STATES.forEach(slug => {
  const name = STATE_NAMES[slug];
  SEO_ROUTES[`/paystub-laws/${slug}`] = {
    title: `${name} Paystub Laws & Requirements 2026 | Saurellius`,
    desc: `Complete guide to ${name} paystub laws, employer requirements, pay stub format rules, and penalties for non-compliance. Updated for 2026. Free ${name} paystub generator.`
  };
  SEO_ROUTES[`/calculators/${slug}-payroll-tax`] = {
    title: `${name} Payroll Tax Calculator 2026 | Saurellius`,
    desc: `Calculate ${name} state payroll taxes, federal withholding, FICA, Social Security, and Medicare. Free ${name} paycheck calculator with instant results.`
  };
});

// Competitor comparison pages
["123paystubs", "thepaystubs", "securepaystubs", "paystubs-net", "shopify", "adp", "gusto", "paychex"].forEach(comp => {
  const name = comp.replace(/-/g, ".").replace(/^./, c => c.toUpperCase());
  SEO_ROUTES[`/compare/saurellius-vs-${comp}`] = {
    title: `Saurellius vs ${name} — Paystub Generator Comparison 2026`,
    desc: `Compare Saurellius and ${name} pay stub generators side-by-side. Features, pricing, tax accuracy, templates, and user reviews. See why businesses choose Saurellius.`
  };
});

// Calculator and tool pages
const TOOL_ROUTES = {
  "/calculators/fica-tax": { title: "FICA Tax Calculator 2026 — Social Security & Medicare | Saurellius", desc: "Calculate FICA taxes including Social Security (6.2%) and Medicare (1.45%) withholding. Employer and employee shares. Updated for 2026 wage base limits." },
  "/calculators/federal-withholding": { title: "Federal Tax Withholding Calculator 2026 | Saurellius", desc: "Calculate federal income tax withholding based on W-4, filing status, pay frequency, and gross wages. Updated 2026 tax brackets." },
  "/calculators/salary-to-hourly": { title: "Salary to Hourly Converter — Wage Calculator | Saurellius", desc: "Convert annual salary to hourly rate and vice versa. Factor in overtime, PTO, and benefits. Free salary to hourly wage calculator." },
  "/calculators/overtime": { title: "Overtime Pay Calculator — FLSA Compliant | Saurellius", desc: "Calculate overtime pay at 1.5x and 2x rates. FLSA compliant. Weekly, bi-weekly, and semi-monthly pay periods supported." },
  "/calculators/net-to-gross": { title: "Net-to-Gross Pay Calculator — Reverse Tax Calc | Saurellius", desc: "Calculate gross pay from desired net pay. Reverse-engineers federal, state, FICA taxes. Perfect for guaranteed net pay arrangements." },
  "/calculators/1099-tax": { title: "1099 Self-Employment Tax Estimator 2026 | Saurellius", desc: "Estimate self-employment taxes for 1099 contractors and freelancers. Includes Social Security, Medicare, and quarterly estimated tax payments." },
  "/calculators/payroll-cost": { title: "Employer Payroll Cost Calculator 2026 | Saurellius", desc: "Calculate total employer payroll costs including wages, FICA employer share, FUTA, SUTA, workers comp, and benefits. Per-employee and total." },
  "/glossary": { title: "Payroll Glossary — 500+ Terms Defined | Saurellius", desc: "Comprehensive payroll glossary with 500+ definitions. FICA, gross pay, net pay, withholding, W-2, 1099, garnishment, direct deposit, and more." },
};
Object.assign(SEO_ROUTES, TOOL_ROUTES);

app.get("*", (req, res) => {
  const indexPath = path.join(__dirname, "client", "build", "index.html");
  const route = SEO_ROUTES[req.path];

  // If no route-specific SEO or not a crawler, serve normally
  if (!route) {
    return res.sendFile(indexPath);
  }

  // Inject route-specific meta tags for ALL requests (helps crawlers AND prerender services)
  fs.readFile(indexPath, "utf8", (err, html) => {
    if (err) return res.sendFile(indexPath);

    // Replace default title
    html = html.replace(
      /<title>[^<]*<\/title>/,
      `<title>${route.title}</title>`
    );
    // Replace default description
    html = html.replace(
      /<meta name="description"[^>]*\/?>/, 
      `<meta name="description" content="${route.desc}" />`
    );
    // Replace OG title and description
    html = html.replace(
      /<meta property="og:title"[^>]*\/?>/, 
      `<meta property="og:title" content="${route.title}" />`
    );
    html = html.replace(
      /<meta property="og:description"[^>]*\/?>/,
      `<meta property="og:description" content="${route.desc}" />`
    );
    // Replace canonical URL
    html = html.replace(
      /<link rel="canonical"[^>]*\/?>/, 
      `<link rel="canonical" href="https://www.drpaystub.net${req.path === '/' ? '/' : req.path}" />`
    );
    // Replace OG URL
    html = html.replace(
      /<meta property="og:url"[^>]*\/?>/, 
      `<meta property="og:url" content="https://www.drpaystub.net${req.path === '/' ? '/' : req.path}" />`
    );

    res.send(html);
  });
});

const port = process.env.PORT || 5000;

var dir = "./public";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

(async () => {
  await connectDB();

  // ─── Seed admin user ────────────────────────────────────────────────────────
  try {
    const { User } = require("./models/user");
    const bcrypt = require("bcryptjs");
    const adminEmail = "diegousoro@gmail.com";
    const adminPass = "EsangVision2027!";
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      const hashed = await bcrypt.hash(adminPass, 8);
      admin = await User.create({
        firstName: "Diego",
        lastName: "Usoro",
        email: adminEmail,
        password: hashed,
        role: "admin",
        isEmailVerified: true,
      });
      console.log("[Seed] Admin user created");
    } else {
      const needsUpdate = {};
      if (admin.role !== "admin") needsUpdate.role = "admin";
      if (!admin.isEmailVerified) needsUpdate.isEmailVerified = true;
      const passMatch = await bcrypt.compare(adminPass, admin.password);
      if (!passMatch) needsUpdate.password = await bcrypt.hash(adminPass, 8);
      if (Object.keys(needsUpdate).length > 0) {
        await User.findByIdAndUpdate(admin._id, needsUpdate);
        console.log("[Seed] Admin user updated:", Object.keys(needsUpdate).join(", "));
      }
    }
  } catch (seedErr) {
    console.error("[Seed] Admin seed error:", seedErr.message);
  }

  // Initialize monthly tax data auditor
  try {
    const { initTaxDataFetcher } = require("./services/tax-data-fetcher");
    initTaxDataFetcher();
  } catch (fetcherErr) {
    console.error("[TaxDataFetcher] Init error:", fetcherErr.message);
  }

  app.listen(port, async () => {
    console.log(`Server Running on port: ${port}`);
  });
})();
