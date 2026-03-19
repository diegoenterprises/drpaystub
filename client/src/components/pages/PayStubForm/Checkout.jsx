import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { axios } from "../../../HelperFunctions/axios";
import CheckoutForm from "./CheckoutForm";
const {
  REACT_APP_STRIPE_LIVE_KEY,
  REACT_APP_STRIPE_TEST_KEY,
  REACT_APP_STRIPE_MODE,
} = process.env;
const stripeKey =
  REACT_APP_STRIPE_MODE === "dev"
    ? REACT_APP_STRIPE_TEST_KEY
    : REACT_APP_STRIPE_LIVE_KEY;

const stripePromise = loadStripe(stripeKey);

const isDark = () =>
  document.documentElement.getAttribute("data-theme") === "dark" ||
  window.matchMedia("(prefers-color-scheme: dark)").matches;

export const Checkout = ({
  amount,
  paystubId,
  template,
  setPaymentStatus,
  paydates,
}) => {
  const [secret, setSecret] = useState(null);
  const [coupon, setCoupon] = useState("");
  const [couponError, setCouponError] = useState(false);
  const [isFree, setIsFree] = useState(false);
  const [payError, setPayError] = useState(null);

  const loadApp = async () => {
    try {
      const { data } = await axios.get(
        `/api/paystub/payment-intent?amount=${amount}`
      );
      if (data.error) {
        console.error("[Checkout] Payment intent error:", data.error);
        setPayError("Payment service temporarily unavailable. Please try again.");
        return;
      }
      if (data.free) {
        setIsFree(true);
        setPaymentStatus("completed");
      } else {
        setSecret(data.secret);
      }
    } catch (err) {
      console.error("[Checkout] Payment intent request failed:", err);
      setPayError("Unable to connect to payment service. Please refresh and try again.");
    }
  };

  const handleCoupon = async () => {
    if (coupon === "DIEGOX1911") {
      setIsFree(true);
      setPaymentStatus("completed");
    } else {
      setCoupon("");
      setCouponError(true);
      setTimeout(() => setCouponError(false), 3000);
    }
  };

  useEffect(() => {
    if (amount) {
      loadApp();
    }
  }, [amount]);

  if (isFree) {
    return (
      <div className="checkout-free">
        <div className="checkout-free-icon">
          <i className="fa fa-check-circle"></i>
        </div>
        <h4>Discount applied</h4>
        <p>Your payroll document is being prepared — no charge.</p>
      </div>
    );
  }

  const dark = isDark();
  const stripeAppearance = {
    theme: dark ? "night" : "stripe",
    variables: {
      colorPrimary: "#7c5cfc",
      colorBackground: dark ? "#1a1a2e" : "#ffffff",
      colorText: dark ? "#e0e0e0" : "#1a1a2e",
      colorDanger: "#ff5252",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      borderRadius: "10px",
      spacingUnit: "4px",
    },
    rules: {
      ".Input": {
        border: dark ? "1px solid rgba(255,255,255,0.12)" : "1px solid #e0e0e0",
        boxShadow: "none",
        padding: "12px 14px",
        fontSize: "15px",
      },
      ".Input:focus": {
        border: "1.5px solid #7c5cfc",
        boxShadow: "0 0 0 3px rgba(124,92,252,0.15)",
      },
      ".Label": {
        fontSize: "13px",
        fontWeight: "600",
        letterSpacing: "0.02em",
        marginBottom: "6px",
      },
    },
  };

  return (
    <div className="checkout-container">
      {/* ─── Order Summary ─── */}
      <div className="checkout-summary">
        <div className="checkout-summary-header">
          <span className="checkout-badge">Order summary</span>
        </div>

        <div className="checkout-line-item">
          <div className="checkout-line-info">
            <span className="checkout-line-name">Saurellius Pay Stub</span>
            <span className="checkout-line-meta">
              {paydates} {paydates === 1 ? "period" : "periods"}
            </span>
          </div>
          <span className="checkout-line-price">${amount}</span>
        </div>

        <div className="checkout-divider"></div>

        <div className="checkout-total-row">
          <span className="checkout-total-label">Total</span>
          <span className="checkout-total-amount">${amount}</span>
        </div>

        <div className="checkout-promo">
          <input
            value={coupon}
            onChange={(e) => {
              setCoupon(e.target.value);
              setCouponError(false);
            }}
            type="text"
            className="checkout-promo-input"
            placeholder="Promo code"
            onKeyDown={(e) => e.key === "Enter" && handleCoupon()}
          />
          <button
            type="button"
            className="checkout-promo-btn"
            onClick={handleCoupon}
            disabled={!coupon.trim()}
          >
            Apply
          </button>
        </div>
        {couponError && (
          <p className="checkout-promo-error">Invalid promo code</p>
        )}
      </div>

      {/* ─── Payment Form ─── */}
      <div className="checkout-payment">
        <div className="checkout-payment-header">
          <span className="checkout-badge">Payment</span>
          <div className="checkout-secure">
            <i className="fa fa-lock"></i>
            <span>Secured by Stripe</span>
          </div>
        </div>

        {payError && (
          <div style={{ padding: "20px", textAlign: "center" }}>
            <p style={{ color: "#ff5252", fontSize: "14px", marginBottom: "12px" }}>{payError}</p>
            <button type="button" className="checkout-promo-btn" onClick={() => { setPayError(null); loadApp(); }}>
              Retry
            </button>
          </div>
        )}
        {!payError && !secret && (
          <div style={{ padding: "30px", textAlign: "center", color: "#888", fontSize: "14px" }}>
            Loading payment form...
          </div>
        )}
        {secret && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret: secret,
              appearance: stripeAppearance,
            }}
          >
            <CheckoutForm
              paystubId={paystubId}
              template={template}
              secret={secret}
              amount={amount}
            />
          </Elements>
        )}
      </div>
    </div>
  );
};
