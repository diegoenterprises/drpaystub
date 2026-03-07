import React, { Component } from "react";
import { axios } from "../../HelperFunctions/axios";
import "./Pricing.scss";

const PLANS = [
  {
    key: "starter",
    name: "Starter",
    price: 50,
    badge: null,
    features: [
      "5 paystub groups / month",
      "Up to 6 pay periods each",
      "Standard templates",
      "Dashboard access",
      "Email support",
    ],
    cta: "Get Started",
  },
  {
    key: "professional",
    name: "Professional",
    price: 75,
    badge: "Most Popular",
    features: [
      "15 paystub groups / month",
      "Up to 12 pay periods each",
      "All premium templates",
      "2 W-2 forms / month",
      "Priority support",
      "5 saved company profiles",
    ],
    cta: "Go Professional",
  },
  {
    key: "unlimited",
    name: "Unlimited",
    price: 150,
    badge: "Best Value",
    features: [
      "Unlimited paystub groups",
      "Unlimited pay periods",
      "All premium templates",
      "Unlimited W-2 forms",
      "Priority support",
      "Unlimited company profiles",
    ],
    cta: "Go Unlimited",
  },
];

class Pricing extends Component {
  state = { loading: null };

  handleSubscribe = async (planKey) => {
    const token = localStorage.getItem("tokens");
    if (!token) {
      window.location.href = "/register";
      return;
    }

    this.setState({ loading: planKey });
    try {
      let url = process.env.REACT_APP_BACKEND_URL_LOCAL;
      if (process.env.REACT_APP_MODE === "live") {
        url = process.env.REACT_APP_FRONTEND_URL_LIVE;
      }
      const res = await axios.post(
        `${url}api/subscription/checkout`,
        { plan: planKey },
        { headers: { Authorization: `bearer ${token}` } }
      );
      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
    }
    this.setState({ loading: null });
  };

  render() {
    const { loading } = this.state;

    return (
      <section className="pricing-section" id="pricing">
        <div className="pricing-container">
          <div className="pricing-header">
            <span className="pricing-eyebrow">Subscription Plans</span>
            <h2 className="pricing-title">
              Simple, transparent pricing
            </h2>
            <p className="pricing-subtitle">
              Choose a plan that fits your needs. Cancel anytime.
              <br />
              <span className="pricing-free-note">
                Or continue using our pay-per-stub option at $20 each — no subscription required.
              </span>
            </p>
          </div>

          <div className="pricing-grid">
            {PLANS.map((plan) => (
              <div
                key={plan.key}
                className={`pricing-card ${plan.badge ? "pricing-card--featured" : ""}`}
              >
                {plan.badge && (
                  <div className="pricing-badge">{plan.badge}</div>
                )}

                <div className="pricing-card-header">
                  <h3 className="pricing-plan-name">{plan.name}</h3>
                  <div className="pricing-price">
                    <span className="pricing-dollar">$</span>
                    <span className="pricing-amount">{plan.price}</span>
                    <span className="pricing-period">/mo</span>
                  </div>
                </div>

                <ul className="pricing-features">
                  {plan.features.map((f, i) => (
                    <li key={i}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="pricing-check">
                        <path d="M13.5 4.5L6.5 11.5L2.5 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  className={`pricing-cta ${plan.badge ? "pricing-cta--primary" : ""}`}
                  onClick={() => this.handleSubscribe(plan.key)}
                  disabled={loading === plan.key}
                >
                  {loading === plan.key ? "Redirecting..." : plan.cta}
                </button>
              </div>
            ))}
          </div>

          <p className="pricing-disclaimer">
            All plans include full dashboard access. Subscriptions are billed monthly via Stripe.
            You can cancel anytime from your dashboard.
          </p>
        </div>
      </section>
    );
  }
}

export default Pricing;
