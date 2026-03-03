import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import {
  FaUsers, FaFileAlt, FaDollarSign, FaChartLine, FaCalendarAlt,
  FaCreditCard, FaCheckCircle, FaTimesCircle, FaArrowUp, FaArrowDown,
  FaStripe, FaUserPlus, FaClock, FaShieldAlt,
} from "react-icons/fa";
import { axios } from "../../../HelperFunctions/axios";
import DashboardLayout from "./layout/DashboardLayout";
import { Spinner } from "react-bootstrap";
import moment from "moment";

class AdminDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      stats: null,
      revenue: null,
      revenueLoading: true,
      activeTab: "overview",
    };
  }

  componentDidMount() {
    this.fetchStats();
    this.fetchRevenue();
  }

  getApiUrl = () => {
    let url = process.env.REACT_APP_BACKEND_URL_LOCAL;
    if (process.env.REACT_APP_MODE === "live") {
      url = process.env.REACT_APP_FRONTEND_URL_LIVE;
    }
    return url;
  };

  fetchStats = async () => {
    try {
      const url = this.getApiUrl();
      const token = localStorage.getItem("tokens");
      const response = await axios.get(`${url}api/admin/stats`, {
        headers: { Authorization: `bearer ${token}` },
      });
      this.setState({ stats: response.data, loading: false });
    } catch (e) {
      console.error("Admin stats error:", e);
      this.setState({ loading: false });
    }
  };

  fetchRevenue = async () => {
    try {
      const url = this.getApiUrl();
      const token = localStorage.getItem("tokens");
      const response = await axios.get(`${url}api/admin/stripe-revenue`, {
        headers: { Authorization: `bearer ${token}` },
      });
      this.setState({ revenue: response.data, revenueLoading: false });
    } catch (e) {
      console.error("Admin revenue error:", e);
      this.setState({ revenueLoading: false });
    }
  };

  fmt = (cents) => `$${(cents / 100).toFixed(2)}`;

  pctChange = (current, previous) => {
    if (!previous) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  render() {
    const { userData } = this.props;
    const { loading, stats, revenue, revenueLoading, activeTab } = this.state;

    if (userData && userData.role !== "admin") {
      return <Redirect to="/dashboard" />;
    }

    if (loading) {
      return (
        <DashboardLayout>
          <div style={{ textAlign: "center", padding: 80 }}>
            <Spinner animation="border" variant="primary" />
            <p style={{ marginTop: 16, color: "var(--color-text-tertiary)" }}>Loading admin data...</p>
          </div>
        </DashboardLayout>
      );
    }

    const u = stats?.users || {};
    const p = stats?.paystubs || {};
    const userGrowth = this.pctChange(u.newThisMonth, u.newLastMonth);
    const stubGrowth = this.pctChange(p.thisMonth, p.lastMonth);

    const tabs = [
      { key: "overview", label: "Overview" },
      { key: "revenue", label: "Revenue & Stripe" },
      { key: "users", label: "Users" },
      { key: "paystubs", label: "Paystubs" },
    ];

    return (
      <DashboardLayout>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 className="dash-page-title">Admin Dashboard</h1>
            <p className="dash-page-subtitle">Platform monitoring & analytics</p>
          </div>
          <div style={{
            fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 980,
            background: stats?.stripeMode === "dev" ? "rgba(251,191,36,0.12)" : "rgba(16,185,129,0.12)",
            color: stats?.stripeMode === "dev" ? "#f59e0b" : "#10b981",
            letterSpacing: "0.04em", textTransform: "uppercase",
          }}>
            Stripe: {stats?.stripeMode || "---"}
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", gap: 4, marginBottom: 24, borderBottom: "1px solid var(--color-border)",
          paddingBottom: 0, overflow: "auto",
        }}>
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => this.setState({ activeTab: t.key })}
              style={{
                padding: "10px 18px", border: "none", background: "transparent",
                cursor: "pointer", fontSize: 14, fontWeight: activeTab === t.key ? 600 : 500,
                color: activeTab === t.key ? "var(--color-accent)" : "var(--color-text-tertiary)",
                borderBottom: activeTab === t.key ? "2px solid var(--color-accent)" : "2px solid transparent",
                transition: "all 0.15s ease", whiteSpace: "nowrap",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <>
            <div className="dash-stat-grid">
              <StatCard icon={<FaUsers />} value={u.total || 0} label="Total Users" />
              <StatCard icon={<FaFileAlt />} value={p.paid || 0} label="Paid Paystubs" />
              <StatCard
                icon={<FaUserPlus />}
                value={u.newThisMonth || 0}
                label="New Users (This Month)"
                trend={userGrowth}
              />
              <StatCard
                icon={<FaChartLine />}
                value={p.thisMonth || 0}
                label="Paystubs (This Month)"
                trend={stubGrowth}
              />
            </div>

            {/* Mini bar chart */}
            {stats?.monthlyData && (
              <div className="dash-section-card" style={{ marginBottom: 24 }}>
                <h4>Monthly Paystubs (Last 6 Months)</h4>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120, padding: "0 4px" }}>
                  {stats.monthlyData.map((m, i) => {
                    const max = Math.max(...stats.monthlyData.map((d) => d.count), 1);
                    const h = Math.max((m.count / max) * 100, 4);
                    return (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-primary)" }}>{m.count}</span>
                        <div style={{
                          width: "100%", maxWidth: 60, height: `${h}%`, borderRadius: "var(--radius-md) var(--radius-md) 0 0",
                          background: "var(--gradient-brand)", transition: "height 0.3s ease",
                        }} />
                        <span style={{ fontSize: 10, color: "var(--color-text-tertiary)", whiteSpace: "nowrap" }}>{m.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick stats grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
              <div className="dash-section-card" style={{ marginBottom: 0 }}>
                <h4>User Breakdown</h4>
                <InfoRow label="Verified" value={u.verified || 0} color="#10b981" />
                <InfoRow label="Unverified" value={u.unverified || 0} color="#f59e0b" />
                <InfoRow label="Last Month Signups" value={u.newLastMonth || 0} />
              </div>
              <div className="dash-section-card" style={{ marginBottom: 0 }}>
                <h4>Paystub Breakdown</h4>
                <InfoRow label="Total Created" value={p.total || 0} />
                <InfoRow label="Paid" value={p.paid || 0} color="#10b981" />
                <InfoRow label="Unpaid / Draft" value={p.unpaid || 0} color="#64748b" />
                <InfoRow label="This Week" value={p.thisWeek || 0} />
              </div>
            </div>
          </>
        )}

        {/* REVENUE TAB */}
        {activeTab === "revenue" && (
          <>
            {revenueLoading ? (
              <div style={{ textAlign: "center", padding: 60 }}>
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              <>
                <div className="dash-stat-grid">
                  <StatCard
                    icon={<FaDollarSign />}
                    value={revenue ? this.fmt(revenue.thisMonthRevenue) : "$0.00"}
                    label="Revenue (This Month)"
                    raw
                  />
                  <StatCard
                    icon={<FaDollarSign />}
                    value={revenue ? this.fmt(revenue.lastMonthRevenue) : "$0.00"}
                    label="Revenue (Last Month)"
                    raw
                  />
                  <StatCard
                    icon={<FaCreditCard />}
                    value={revenue?.totalChargesThisMonth || 0}
                    label="Charges (This Month)"
                  />
                  <StatCard
                    icon={<FaDollarSign />}
                    value={revenue ? this.fmt(revenue.balance?.available || 0) : "$0.00"}
                    label="Stripe Balance (Available)"
                    raw
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                  <div className="dash-section-card" style={{ marginBottom: 0 }}>
                    <h4>Stripe Balance</h4>
                    <InfoRow label="Available" value={this.fmt(revenue?.balance?.available || 0)} />
                    <InfoRow label="Pending" value={this.fmt(revenue?.balance?.pending || 0)} />
                    <InfoRow label="Mode" value={revenue?.stripeMode || "---"} />
                  </div>
                  <div className="dash-section-card" style={{ marginBottom: 0 }}>
                    <h4>Revenue Trend</h4>
                    {revenue && revenue.thisMonthRevenue !== undefined && (
                      <>
                        <InfoRow label="This Month" value={this.fmt(revenue.thisMonthRevenue)} color="#10b981" />
                        <InfoRow label="Last Month" value={this.fmt(revenue.lastMonthRevenue)} />
                        <InfoRow
                          label="Change"
                          value={`${this.pctChange(revenue.thisMonthRevenue, revenue.lastMonthRevenue)}%`}
                          color={revenue.thisMonthRevenue >= revenue.lastMonthRevenue ? "#10b981" : "#ef4444"}
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Recent Charges */}
                {revenue?.recentCharges?.length > 0 && (
                  <div className="dash-section-card">
                    <h4>Recent Stripe Charges</h4>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                        <thead>
                          <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                            <th style={thStyle}>Date</th>
                            <th style={thStyle}>Amount</th>
                            <th style={thStyle}>Email</th>
                            <th style={thStyle}>Status</th>
                            <th style={thStyle}>ID</th>
                          </tr>
                        </thead>
                        <tbody>
                          {revenue.recentCharges.map((c) => (
                            <tr key={c.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                              <td style={tdStyle}>{moment(c.created).format("MMM D, h:mm A")}</td>
                              <td style={{ ...tdStyle, fontWeight: 600, color: "var(--color-text-primary)" }}>
                                ${(c.amount / 100).toFixed(2)} {c.currency?.toUpperCase()}
                              </td>
                              <td style={tdStyle}>{c.email}</td>
                              <td style={tdStyle}>
                                {c.paid && !c.refunded ? (
                                  <span style={{ color: "#10b981", fontWeight: 600 }}>
                                    <FaCheckCircle style={{ marginRight: 4, fontSize: 12 }} />Paid
                                  </span>
                                ) : c.refunded ? (
                                  <span style={{ color: "#f59e0b", fontWeight: 600 }}>Refunded</span>
                                ) : (
                                  <span style={{ color: "#ef4444", fontWeight: 600 }}>
                                    <FaTimesCircle style={{ marginRight: 4, fontSize: 12 }} />Failed
                                  </span>
                                )}
                              </td>
                              <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: 11, color: "var(--color-text-tertiary)" }}>
                                {c.id.slice(0, 20)}...
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* USERS TAB */}
        {activeTab === "users" && (
          <>
            <div className="dash-stat-grid" style={{ marginBottom: 24 }}>
              <StatCard icon={<FaUsers />} value={u.total || 0} label="Total Users" />
              <StatCard icon={<FaCheckCircle />} value={u.verified || 0} label="Verified" />
              <StatCard icon={<FaTimesCircle />} value={u.unverified || 0} label="Unverified" />
              <StatCard icon={<FaUserPlus />} value={u.newThisMonth || 0} label="New This Month" />
            </div>

            {stats?.recentUsers?.length > 0 && (
              <div className="dash-section-card">
                <h4>Recent Signups</h4>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                        <th style={thStyle}>Name</th>
                        <th style={thStyle}>Email</th>
                        <th style={thStyle}>Role</th>
                        <th style={thStyle}>Verified</th>
                        <th style={thStyle}>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentUsers.map((user) => (
                        <tr key={user._id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                          <td style={{ ...tdStyle, fontWeight: 600, color: "var(--color-text-primary)" }}>
                            {user.firstName || "---"} {user.lastName || ""}
                          </td>
                          <td style={tdStyle}>{user.email || "---"}</td>
                          <td style={tdStyle}>
                            <span style={{
                              fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 980,
                              background: user.role === "admin" ? "rgba(167,139,250,0.12)" : "var(--gradient-brand-subtle)",
                              color: user.role === "admin" ? "#a78bfa" : "var(--color-accent)",
                              textTransform: "capitalize",
                            }}>
                              {user.role || "user"}
                            </span>
                          </td>
                          <td style={tdStyle}>
                            {user.isEmailVerified ? (
                              <FaCheckCircle style={{ color: "#10b981", fontSize: 14 }} />
                            ) : (
                              <FaTimesCircle style={{ color: "#ef4444", fontSize: 14 }} />
                            )}
                          </td>
                          <td style={tdStyle}>{moment(user.createdAt).format("MMM D, YYYY")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* PAYSTUBS TAB */}
        {activeTab === "paystubs" && (
          <>
            <div className="dash-stat-grid" style={{ marginBottom: 24 }}>
              <StatCard icon={<FaFileAlt />} value={p.total || 0} label="Total Created" />
              <StatCard icon={<FaCheckCircle />} value={p.paid || 0} label="Paid" />
              <StatCard icon={<FaClock />} value={p.unpaid || 0} label="Unpaid" />
              <StatCard icon={<FaCalendarAlt />} value={p.thisWeek || 0} label="This Week" />
            </div>

            {stats?.recentPaystubs?.length > 0 && (
              <div className="dash-section-card">
                <h4>Recent Paid Paystubs</h4>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                        <th style={thStyle}>Company</th>
                        <th style={thStyle}>Employee</th>
                        <th style={thStyle}>Periods</th>
                        <th style={thStyle}>Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentPaystubs.map((ps) => (
                        <tr key={ps._id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                          <td style={{ ...tdStyle, fontWeight: 600, color: "var(--color-text-primary)" }}>{ps.company}</td>
                          <td style={tdStyle}>{ps.employee}</td>
                          <td style={tdStyle}>
                            <span style={{
                              fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 980,
                              background: "var(--gradient-brand-subtle)", color: "var(--color-accent)",
                            }}>
                              {ps.periods}
                            </span>
                          </td>
                          <td style={tdStyle}>{moment(ps.createdAt).format("MMM D, YYYY h:mm A")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </DashboardLayout>
    );
  }
}

// Shared table styles
const thStyle = {
  padding: "10px 12px",
  textAlign: "left",
  fontSize: 11,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  color: "var(--color-text-tertiary)",
};
const tdStyle = {
  padding: "10px 12px",
  color: "var(--color-text-secondary)",
};

// Stat card mini-component
function StatCard({ icon, value, label, trend, raw, color }) {
  return (
    <div className="dash-stat-card">
      <div className="dash-stat-icon">{icon}</div>
      <div className="dash-stat-info">
        <h3 style={raw ? { fontSize: 22 } : undefined}>{value}</h3>
        <p>{label}</p>
        {trend !== undefined && trend !== 0 && (
          <span style={{
            fontSize: 11, fontWeight: 600,
            color: trend > 0 ? "#10b981" : "#ef4444",
            display: "inline-flex", alignItems: "center", gap: 3, marginTop: 2,
          }}>
            {trend > 0 ? <FaArrowUp style={{ fontSize: 9 }} /> : <FaArrowDown style={{ fontSize: 9 }} />}
            {Math.abs(trend)}% vs last month
          </span>
        )}
      </div>
    </div>
  );
}

// Info row mini-component
function InfoRow({ label, value, color }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "8px 0", borderBottom: "1px solid var(--color-border)",
    }}>
      <span style={{ fontSize: 13, color: "var(--color-text-tertiary)" }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: color || "var(--color-text-primary)" }}>{value}</span>
    </div>
  );
}

const mapStateToProps = (state) => ({
  userData: state?.userData,
});

export default connect(mapStateToProps)(AdminDashboard);
