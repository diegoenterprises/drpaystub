import React, { useState, useEffect } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { axios } from "../../../HelperFunctions/axios";

const { REACT_APP_MODE, REACT_APP_STRIPE_LIVE_KEY, REACT_APP_STRIPE_TEST_KEY } = process.env;

const stripeKey =
  REACT_APP_MODE === "live" ? REACT_APP_STRIPE_LIVE_KEY : REACT_APP_STRIPE_TEST_KEY;
const stripePromise = loadStripe(stripeKey);

const stripeAppearance = () => ({
  theme: "night",
  variables: {
    colorPrimary: "#6366f1",
    colorBackground: "var(--color-bg-card, #1a1d23)",
    colorText: "var(--color-text-primary, #f1f5f9)",
    borderRadius: "12px",
    fontFamily: "inherit",
  },
});

// ─── Inner Payment Form ──────────────────────────────────────────────────────
const W2PaymentForm = ({ secret, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url: window.location.href,
      },
    });

    if (result.error) {
      setError(result.error.message);
      setProcessing(false);
    } else if (result.paymentIntent?.status === "succeeded") {
      onSuccess(result.paymentIntent);
    } else {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {error && (
        <p style={{ color: "var(--color-error)", fontSize: 13, marginTop: 12 }}>{error}</p>
      )}
      <button
        type="submit"
        className="btn btn-secondary"
        disabled={!stripe || processing}
        style={{ width: "100%", marginTop: 20, opacity: processing ? 0.6 : 1 }}
      >
        {processing ? (
          <>
            <i className="fa fa-spinner fa-spin" style={{ marginRight: 8 }}></i>
            Processing...
          </>
        ) : (
          <>
            <i className="fa fa-lock" style={{ marginRight: 8 }}></i>
            Pay $20.00 &amp; Generate W-2
          </>
        )}
      </button>
    </form>
  );
};

// ─── Review Row ──────────────────────────────────────────────────────────────
const ReviewRow = ({ label, value }) => {
  if (!value && value !== 0) return null;
  return (
    <tr>
      <td className="review-label">{label}</td>
      <td>{value}</td>
    </tr>
  );
};

// ─── Main Step4 ──────────────────────────────────────────────────────────────
const Step4ReviewPay = ({ data, formData, goToStep }) => {
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [zipFile, setZipFile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPaymentIntent();
  }, []);

  const fetchPaymentIntent = async () => {
    try {
      let url = process.env.REACT_APP_BACKEND_URL_LOCAL;
      if (process.env.REACT_APP_MODE === "live") {
        url = process.env.REACT_APP_FRONTEND_URL_LIVE;
      }
      const { data: resp } = await axios.get(`${url}api/w2-wizard/payment-intent`);
      setClientSecret(resp.secret);
    } catch (err) {
      console.error("[W2Wizard] Payment intent error:", err);
      setError("Failed to initialize payment. Please try again.");
    }
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    setPaymentComplete(true);
    setGenerating(true);
    setError(null);

    try {
      let url = process.env.REACT_APP_BACKEND_URL_LOCAL;
      if (process.env.REACT_APP_MODE === "live") {
        url = process.env.REACT_APP_FRONTEND_URL_LIVE;
      }
      const { data: resp } = await axios.post(`${url}api/w2-wizard/generate`, formData);
      if (resp.success) {
        setZipFile(resp.zipFile);
      } else {
        setError("PDF generation failed. Please contact support.");
      }
    } catch (err) {
      console.error("[W2Wizard] Generate error:", err);
      setError("PDF generation failed. Please contact support.");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    let link =
      REACT_APP_MODE === "development" || REACT_APP_MODE === "developement"
        ? "http://localhost:5000/"
        : "https://www.drpaystub.net/";
    // zipFile is like "public/W2_...zip", strip the "public/" prefix
    const cleanPath = zipFile.replace(/^public\//, "");
    window.open(link + cleanPath);
  };

  const d = formData;
  const checks = [];
  if (d.statutoryEmployee) checks.push("Statutory employee");
  if (d.retirementPlan) checks.push("Retirement plan");
  if (d.thirdPartySickPay) checks.push("Third-party sick pay");

  return (
    <div className="w2-form-card">
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h3 className="w2-section-title" style={{ marginTop: 0 }}>
          <i className="fa fa-eye"></i> Review Your W-2 Information
        </h3>
        <p className="w2-box-hint" style={{ marginBottom: 16 }}>
          Please verify all information below before paying. All 6 copies of the official IRS W-2 form will be generated.
        </p>

        {/* Employer Info */}
        <table className="w2-review-table">
          <thead>
            <tr><th colSpan={2}>Employer Information</th></tr>
          </thead>
          <tbody>
            <ReviewRow label="EIN (Box b)" value={d.employerEIN} />
            <ReviewRow label="Employer Name (Box c)" value={d.employerName} />
            <ReviewRow label="Address" value={[d.employerAddress1, d.employerAddress2].filter(Boolean).join(", ")} />
            <ReviewRow label="City, State, ZIP" value={[d.employerCity, d.employerState, d.employerZip].filter(Boolean).join(", ")} />
            <ReviewRow label="Control Number (Box d)" value={d.controlNumber} />
          </tbody>
        </table>

        {/* Employee Info */}
        <table className="w2-review-table">
          <thead>
            <tr><th colSpan={2}>Employee Information</th></tr>
          </thead>
          <tbody>
            <ReviewRow label="SSN (Box a)" value={d.employeeSSN} />
            <ReviewRow label="Name (Box e)" value={[d.employeeFirstName, d.employeeLastName, d.employeeSuffix].filter(Boolean).join(" ")} />
            <ReviewRow label="Address (Box f)" value={[d.employeeAddress1, d.employeeAddress2].filter(Boolean).join(", ")} />
            <ReviewRow label="City, State, ZIP" value={[d.employeeCity, d.employeeState, d.employeeZip].filter(Boolean).join(", ")} />
          </tbody>
        </table>

        {/* Wages & Tax */}
        <table className="w2-review-table">
          <thead>
            <tr><th colSpan={2}>Wages &amp; Tax</th></tr>
          </thead>
          <tbody>
            <ReviewRow label="Box 1 — Wages, tips, compensation" value={d.box1} />
            <ReviewRow label="Box 2 — Federal tax withheld" value={d.box2} />
            <ReviewRow label="Box 3 — Social security wages" value={d.box3} />
            <ReviewRow label="Box 4 — Social security tax" value={d.box4} />
            <ReviewRow label="Box 5 — Medicare wages" value={d.box5} />
            <ReviewRow label="Box 6 — Medicare tax" value={d.box6} />
            <ReviewRow label="Box 7 — SS tips" value={d.box7} />
            <ReviewRow label="Box 8 — Allocated tips" value={d.box8} />
            <ReviewRow label="Box 9 — Verification" value={d.box9} />
            <ReviewRow label="Box 10 — Dependent care" value={d.box10} />
            <ReviewRow label="Box 11 — Nonqualified plans" value={d.box11} />
            {d.box12aCode && <ReviewRow label={`Box 12a — ${d.box12aCode}`} value={d.box12aAmount} />}
            {d.box12bCode && <ReviewRow label={`Box 12b — ${d.box12bCode}`} value={d.box12bAmount} />}
            {d.box12cCode && <ReviewRow label={`Box 12c — ${d.box12cCode}`} value={d.box12cAmount} />}
            {d.box12dCode && <ReviewRow label={`Box 12d — ${d.box12dCode}`} value={d.box12dAmount} />}
            {checks.length > 0 && <ReviewRow label="Box 13" value={checks.join(", ")} />}
            <ReviewRow label="Box 14 — Other" value={[d.box14Line1, d.box14Line2, d.box14Line3].filter(Boolean).join("; ")} />
          </tbody>
        </table>

        {/* State & Local */}
        {d.state1 && (
          <table className="w2-review-table">
            <thead>
              <tr><th colSpan={2}>State &amp; Local</th></tr>
            </thead>
            <tbody>
              <ReviewRow label="State 1 (Box 15)" value={`${d.state1} — ${d.employerStateId1 || ""}`} />
              <ReviewRow label="State wages (Box 16)" value={d.stateWages1} />
              <ReviewRow label="State tax (Box 17)" value={d.stateTax1} />
              <ReviewRow label="Local wages (Box 18)" value={d.localWages1} />
              <ReviewRow label="Local tax (Box 19)" value={d.localTax1} />
              <ReviewRow label="Locality (Box 20)" value={d.localityName1} />
              {d.state2 && (
                <>
                  <ReviewRow label="State 2 (Box 15)" value={`${d.state2} — ${d.employerStateId2 || ""}`} />
                  <ReviewRow label="State wages 2 (Box 16)" value={d.stateWages2} />
                  <ReviewRow label="State tax 2 (Box 17)" value={d.stateTax2} />
                  <ReviewRow label="Local wages 2 (Box 18)" value={d.localWages2} />
                  <ReviewRow label="Local tax 2 (Box 19)" value={d.localTax2} />
                  <ReviewRow label="Locality 2 (Box 20)" value={d.localityName2} />
                </>
              )}
            </tbody>
          </table>
        )}

        {/* ── Payment / Download Section ── */}
        <div style={{ marginTop: 32, textAlign: "center" }}>
          {paymentComplete && zipFile ? (
            <div>
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: "linear-gradient(135deg, #10b981, #059669)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 16px",
                boxShadow: "0 4px 16px rgba(16,185,129,0.3)",
              }}>
                <i className="fa fa-check" style={{ fontSize: 28, color: "#fff" }}></i>
              </div>
              <h4 style={{ fontWeight: 700, marginBottom: 8, color: "var(--color-text-primary)" }}>
                W-2 Generated Successfully!
              </h4>
              <p style={{ fontSize: 14, color: "var(--color-text-secondary)", marginBottom: 20 }}>
                Your official IRS W-2 form with all 6 copies is ready for download.
              </p>
              <button className="btn btn-secondary" onClick={handleDownload}>
                <i className="fa fa-download" style={{ marginRight: 8 }}></i>
                Download W-2 (ZIP)
              </button>
            </div>
          ) : paymentComplete && generating ? (
            <div>
              <div className="gen-loading">
                <div className="gen-doc">
                  <div className="gen-doc-header"></div>
                  <div className="gen-doc-line gen-doc-line--1"></div>
                  <div className="gen-doc-line gen-doc-line--2"></div>
                  <div className="gen-doc-line gen-doc-line--3"></div>
                  <div className="gen-doc-line gen-doc-line--4"></div>
                  <div className="gen-doc-line gen-doc-line--5"></div>
                  <div className="gen-doc-scan"></div>
                </div>
                <p className="gen-title">Generating your W-2...</p>
                <div className="gen-progress">
                  <div className="gen-progress-bar"></div>
                </div>
                <p className="gen-subtitle">Filling all 6 copies of the official IRS form</p>
              </div>
            </div>
          ) : error ? (
            <div>
              <p style={{ color: "var(--color-error)", fontWeight: 600 }}>{error}</p>
              <button className="btn btn-secondary" onClick={fetchPaymentIntent} style={{ marginTop: 12 }}>
                Try Again
              </button>
            </div>
          ) : clientSecret ? (
            <div>
              <div style={{
                background: "var(--color-bg-elevated)",
                border: "1.5px solid var(--color-border)",
                borderRadius: 20,
                padding: "28px 24px",
                maxWidth: 440,
                margin: "0 auto",
                textAlign: "left",
              }}>
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "8px 20px", borderRadius: 980,
                    background: "var(--gradient-brand-subtle)",
                    border: "1px solid var(--color-border)",
                    fontSize: 15, fontWeight: 700, color: "var(--color-text-primary)",
                  }}>
                    <i className="fa fa-file-text-o" style={{ color: "var(--color-accent)" }}></i>
                    W-2 Generation — $20.00
                  </div>
                </div>
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: stripeAppearance(),
                  }}
                >
                  <W2PaymentForm
                    secret={clientSecret}
                    onSuccess={handlePaymentSuccess}
                  />
                </Elements>
                <p style={{
                  textAlign: "center", marginTop: 16, marginBottom: 0,
                  fontSize: 12, color: "var(--color-text-tertiary)",
                }}>
                  <i className="fa fa-lock" style={{ marginRight: 4 }}></i>
                  Secured by Stripe &middot; All 6 W-2 copies included
                </p>
              </div>
            </div>
          ) : (
            <div>
              <i className="fa fa-spinner fa-spin" style={{ fontSize: 24, color: "var(--color-accent)" }}></i>
              <p style={{ marginTop: 12, color: "var(--color-text-secondary)" }}>Loading payment form...</p>
            </div>
          )}
        </div>

        {/* Back button (only if not yet paid) */}
        {!paymentComplete && (
          <div className="w2-nav-buttons">
            <button className="btn-outline-back" onClick={() => goToStep(3)}>
              <i className="fa fa-chevron-left" style={{ marginRight: 6, fontSize: 12 }}></i>
              Back
            </button>
            <div></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step4ReviewPay;
