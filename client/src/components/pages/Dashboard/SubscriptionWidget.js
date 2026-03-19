import React, { Component } from "react";
import { Link } from "react-router-dom";
import { axios } from "../../../HelperFunctions/axios";

const PLAN_COLORS = {
  free: { bg: "rgba(100,116,139,0.1)", border: "rgba(100,116,139,0.2)", accent: "#64748b" },
  starter: { bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)", accent: "#3b82f6" },
  professional: { bg: "rgba(124,92,252,0.08)", border: "rgba(124,92,252,0.25)", accent: "#7c5cfc" },
  unlimited: { bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.25)", accent: "#10b981" },
};

const UPGRADE_PLANS = [
  { key: "starter", name: "Starter", price: 50, desc: "5 payroll docs/mo, 6 pay periods each" },
  { key: "professional", name: "Professional", price: 75, desc: "15 docs/mo, 12 periods, 2 W-2s/mo", popular: true },
  { key: "unlimited", name: "Unlimited", price: 150, desc: "Unlimited documents, W-2s, everything" },
];

class SubscriptionWidget extends Component {
  state = { sub: null, loading: true, portalLoading: false, showUpgrade: false, checkoutLoading: null };

  componentDidMount() {
    this.fetchStatus();
  }

  fetchStatus = async () => {
    try {
      let url = process.env.REACT_APP_BACKEND_URL_LOCAL;
      if (process.env.REACT_APP_MODE === "live") {
        url = process.env.REACT_APP_FRONTEND_URL_LIVE;
      }
      const token = localStorage.getItem("tokens");
      const res = await axios.get(`${url}api/subscription/status`, {
        headers: { Authorization: `bearer ${token}` },
      });
      this.setState({ sub: res.data, loading: false });
    } catch {
      this.setState({ loading: false });
    }
  };

  handleUpgrade = async (planKey) => {
    this.setState({ checkoutLoading: planKey });
    try {
      let url = process.env.REACT_APP_BACKEND_URL_LOCAL;
      if (process.env.REACT_APP_MODE === "live") {
        url = process.env.REACT_APP_FRONTEND_URL_LIVE;
      }
      const token = localStorage.getItem("tokens");
      const res = await axios.post(
        `${url}api/subscription/checkout`,
        { plan: planKey },
        { headers: { Authorization: `bearer ${token}` } }
      );
      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      console.error("Upgrade checkout error:", err);
      this.setState({ checkoutLoading: null });
    }
  };

  openPortal = async () => {
    this.setState({ portalLoading: true });
    try {
      let url = process.env.REACT_APP_BACKEND_URL_LOCAL;
      if (process.env.REACT_APP_MODE === "live") {
        url = process.env.REACT_APP_FRONTEND_URL_LIVE;
      }
      const token = localStorage.getItem("tokens");
      const res = await axios.post(`${url}api/subscription/portal`, {}, {
        headers: { Authorization: `bearer ${token}` },
      });
      if (res.data?.url) window.location.href = res.data.url;
    } catch {
      this.setState({ portalLoading: false });
    }
  };

  render() {
    const { sub, loading, portalLoading } = this.state;
    if (loading || !sub) return null;

    const colors = PLAN_COLORS[sub.plan] || PLAN_COLORS.free;
    const isActive = sub.status === "active";
    const isFree = sub.plan === "free";
    const isUnlimited = sub.plan === "unlimited";

    const usedPct = isUnlimited || !sub.limits?.paystubs
      ? 0
      : Math.min(100, Math.round((sub.usage.paystubsCreated / sub.limits.paystubs) * 100));

    return (
      <div style={{
        padding: "20px 22px",
        borderRadius: "var(--radius-lg, 16px)",
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        marginBottom: 24,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: isFree ? 0 : 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: isActive ? "#10b981" : (isFree ? "#64748b" : "#f59e0b"),
              boxShadow: isActive ? "0 0 8px rgba(16,185,129,0.5)" : "none",
            }} />
            <span style={{ fontWeight: 700, fontSize: 15, color: "var(--color-text-primary, #f1f5f9)" }}>
              {sub.label} Plan
            </span>
            {isActive && !isFree && (
              <span style={{
                fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
                padding: "2px 8px", borderRadius: 6,
                background: "rgba(16,185,129,0.15)", color: "#10b981",
              }}>
                Active
              </span>
            )}
            {sub.cancelAtPeriodEnd && (
              <span style={{
                fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
                padding: "2px 8px", borderRadius: 6,
                background: "rgba(245,158,11,0.15)", color: "#f59e0b",
              }}>
                Canceling
              </span>
            )}
          </div>

          {isFree ? (
            <button
              onClick={() => this.setState((s) => ({ showUpgrade: !s.showUpgrade }))}
              style={{
                fontSize: 12, fontWeight: 600, color: "#a78bfa",
                background: "none", border: "none", cursor: "pointer", padding: 0,
              }}
            >
              {this.state.showUpgrade ? "Close ✕" : "Upgrade →"}
            </button>
          ) : (
            <button
              onClick={this.openPortal}
              disabled={portalLoading}
              style={{
                fontSize: 12, fontWeight: 600, color: colors.accent,
                background: "none", border: "none", cursor: "pointer", padding: 0,
              }}
            >
              {portalLoading ? "Loading..." : "Manage Billing →"}
            </button>
          )}
        </div>

        {isActive && !isFree && (
          <>
            {!isUnlimited && (
              <div style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: "var(--color-text-tertiary, #64748b)" }}>
                    Documents this period
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-secondary, #94a3b8)" }}>
                    {sub.usage.paystubsCreated} / {sub.limits.paystubs}
                  </span>
                </div>
                <div style={{
                  width: "100%", height: 6, borderRadius: 3,
                  background: "rgba(255,255,255,0.06)", overflow: "hidden",
                }}>
                  <div style={{
                    width: `${usedPct}%`, height: "100%", borderRadius: 3,
                    background: usedPct >= 90 ? "#ef4444" : colors.accent,
                    transition: "width 0.4s ease",
                  }} />
                </div>
              </div>
            )}
            {isUnlimited && (
              <div style={{ fontSize: 13, color: "var(--color-text-secondary, #94a3b8)" }}>
                <span style={{ fontWeight: 600, color: colors.accent }}>∞</span> Unlimited documents
                {sub.usage.paystubsCreated > 0 && (
                  <span style={{ color: "var(--color-text-tertiary, #64748b)", marginLeft: 8 }}>
                    ({sub.usage.paystubsCreated} created this period)
                  </span>
                )}
              </div>
            )}
            {sub.currentPeriodEnd && (
              <div style={{ fontSize: 11, color: "var(--color-text-tertiary, #475569)", marginTop: 6 }}>
                {sub.cancelAtPeriodEnd ? "Access until" : "Renews"}{" "}
                {new Date(sub.currentPeriodEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>
            )}
          </>
        )}

        {isFree && !this.state.showUpgrade && (
          <div style={{ marginTop: 8, fontSize: 12, color: "var(--color-text-tertiary, #475569)" }}>
            Pay-per-document at $20 each, or subscribe for volume savings.
          </div>
        )}

        {isFree && this.state.showUpgrade && (
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(100,116,139,0.2)" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary, #f1f5f9)", marginBottom: 12 }}>
              Choose a plan
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {UPGRADE_PLANS.map((plan) => {
                const isLoading = this.state.checkoutLoading === plan.key;
                return (
                  <div
                    key={plan.key}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "14px 16px", borderRadius: 12,
                      background: plan.popular ? "rgba(124,92,252,0.08)" : "rgba(255,255,255,0.03)",
                      border: plan.popular ? "1.5px solid rgba(124,92,252,0.3)" : "1px solid rgba(100,116,139,0.15)",
                      transition: "all 0.15s ease",
                      cursor: "pointer",
                    }}
                    onClick={() => !isLoading && this.handleUpgrade(plan.key)}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#a78bfa"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = plan.popular ? "rgba(124,92,252,0.3)" : "rgba(100,116,139,0.15)"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontWeight: 700, fontSize: 14, color: "var(--color-text-primary, #f1f5f9)" }}>
                          {plan.name}
                        </span>
                        {plan.popular && (
                          <span style={{
                            fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                            padding: "2px 7px", borderRadius: 5,
                            background: "rgba(124,92,252,0.2)", color: "#a78bfa",
                          }}>Popular</span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--color-text-tertiary, #64748b)", marginTop: 2 }}>
                        {plan.desc}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                      <span style={{ fontWeight: 700, fontSize: 15, color: "var(--color-text-primary, #f1f5f9)" }}>
                        ${plan.price}<span style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-tertiary, #64748b)" }}>/mo</span>
                      </span>
                      <button
                        disabled={isLoading}
                        style={{
                          padding: "6px 14px", borderRadius: 8, border: "none",
                          background: plan.popular ? "linear-gradient(135deg, #7c5cfc, #6366f1)" : "rgba(255,255,255,0.08)",
                          color: "#fff", fontSize: 12, fontWeight: 600, cursor: isLoading ? "wait" : "pointer",
                          transition: "all 0.15s ease", opacity: isLoading ? 0.6 : 1,
                        }}
                      >
                        {isLoading ? "..." : "Select"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: "var(--color-text-tertiary, #475569)", textAlign: "center" }}>
              You'll be redirected to Stripe for secure checkout. Cancel anytime.
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default SubscriptionWidget;
