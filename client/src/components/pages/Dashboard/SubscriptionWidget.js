import React, { Component } from "react";
import { Link } from "react-router-dom";
import { axios } from "../../../HelperFunctions/axios";

const PLAN_COLORS = {
  free: { bg: "rgba(100,116,139,0.1)", border: "rgba(100,116,139,0.2)", accent: "#64748b" },
  starter: { bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)", accent: "#3b82f6" },
  professional: { bg: "rgba(124,92,252,0.08)", border: "rgba(124,92,252,0.25)", accent: "#7c5cfc" },
  unlimited: { bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.25)", accent: "#10b981" },
};

class SubscriptionWidget extends Component {
  state = { sub: null, loading: true, portalLoading: false };

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
            <Link to="/#pricing" style={{
              fontSize: 12, fontWeight: 600, color: "#a78bfa",
              textDecoration: "none",
            }}>
              Upgrade →
            </Link>
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
                    Paystubs this period
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
                <span style={{ fontWeight: 600, color: colors.accent }}>∞</span> Unlimited paystubs
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

        {isFree && (
          <div style={{ marginTop: 8, fontSize: 12, color: "var(--color-text-tertiary, #475569)" }}>
            Pay-per-stub at $20 each, or subscribe for volume savings.
          </div>
        )}
      </div>
    );
  }
}

export default SubscriptionWidget;
