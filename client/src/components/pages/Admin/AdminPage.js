import React, { Component } from "react";
import {
  FaUsers, FaFileAlt, FaDollarSign, FaChartLine, FaCalendarAlt,
  FaCreditCard, FaCheckCircle, FaTimesCircle, FaArrowUp, FaArrowDown,
  FaUserPlus, FaClock, FaLock, FaSignOutAlt, FaEye, FaEyeSlash,
} from "react-icons/fa";
import { Spinner } from "react-bootstrap";
import moment from "moment";

const { REACT_APP_MODE, REACT_APP_BACKEND_URL_LOCAL, REACT_APP_FRONTEND_URL_LIVE } =
  process.env;
let API_URL = REACT_APP_BACKEND_URL_LOCAL;
if (REACT_APP_MODE === "live") {
  API_URL = REACT_APP_FRONTEND_URL_LIVE;
}

class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Auth
      isAuthenticated: false,
      adminToken: null,
      adminUser: null,
      loginEmail: "",
      loginPassword: "",
      loginError: "",
      loginLoading: false,
      showPassword: false,
      // Dashboard
      loading: true,
      stats: null,
      revenue: null,
      revenueLoading: true,
      activeTab: "overview",
    };
  }

  componentDidMount() {
    const saved = sessionStorage.getItem("adminToken");
    const savedUser = sessionStorage.getItem("adminUser");
    if (saved) {
      this.setState(
        { isAuthenticated: true, adminToken: saved, adminUser: savedUser ? JSON.parse(savedUser) : null },
        () => {
          this.fetchStats();
          this.fetchRevenue();
        }
      );
    }
  }

  handleLogin = async (e) => {
    e.preventDefault();
    const { loginEmail, loginPassword } = this.state;
    this.setState({ loginLoading: true, loginError: "" });
    try {
      const res = await fetch(`${API_URL}api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (data.status === 200 && data.tokens) {
        sessionStorage.setItem("adminToken", data.tokens);
        sessionStorage.setItem("adminUser", JSON.stringify(data.data));
        this.setState(
          { isAuthenticated: true, adminToken: data.tokens, adminUser: data.data, loginLoading: false },
          () => {
            this.fetchStats();
            this.fetchRevenue();
          }
        );
      } else {
        this.setState({ loginError: data.message || "Login failed", loginLoading: false });
      }
    } catch (err) {
      this.setState({ loginError: "Network error. Please try again.", loginLoading: false });
    }
  };

  handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminUser");
    this.setState({
      isAuthenticated: false, adminToken: null, adminUser: null,
      loginEmail: "", loginPassword: "", loginError: "",
      stats: null, revenue: null, loading: true, revenueLoading: true, activeTab: "overview",
    });
  };

  fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}api/admin/stats`, {
        headers: { Authorization: `bearer ${this.state.adminToken}` },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || errData.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      this.setState({ stats: data, loading: false, error: null });
    } catch (e) {
      console.error("Admin stats error:", e);
      this.setState({ loading: false, error: `Stats: ${e.message}` });
    }
  };

  fetchRevenue = async () => {
    try {
      const res = await fetch(`${API_URL}api/admin/stripe-revenue`, {
        headers: { Authorization: `bearer ${this.state.adminToken}` },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || errData.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      this.setState({ revenue: data, revenueLoading: false, revenueError: null });
    } catch (e) {
      console.error("Admin revenue error:", e);
      this.setState({ revenueLoading: false, revenueError: `Revenue: ${e.message}` });
    }
  };

  fmt = (cents) => `$${(cents / 100).toFixed(2)}`;

  pctChange = (current, previous) => {
    if (!previous) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  // ─── LOGIN SCREEN ──────────────────────────────────────────────────────────
  renderLogin() {
    const { loginEmail, loginPassword, loginError, loginLoading, showPassword } = this.state;
    return (
      <div style={styles.loginWrapper}>
        <div style={styles.loginCard}>
          <div style={styles.loginLogoWrap}>
            <div style={styles.loginLogoCircle}>
              <FaLock style={{ fontSize: 28, color: "#a78bfa" }} />
            </div>
          </div>
          <h1 style={styles.loginTitle}>Admin Portal</h1>
          <p style={styles.loginSubtitle}>Saurellius Platform Administration</p>

          {loginError && (
            <div style={styles.loginAlert}>
              <FaTimesCircle style={{ marginRight: 8, flexShrink: 0 }} />
              {loginError}
            </div>
          )}

          <form onSubmit={this.handleLogin} style={{ width: "100%" }}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => this.setState({ loginEmail: e.target.value })}
                placeholder="admin@example.com"
                style={styles.input}
                required
                autoFocus
              />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginPassword}
                  onChange={(e) => this.setState({ loginPassword: e.target.value })}
                  placeholder="Enter password"
                  style={styles.input}
                  required
                />
                <button
                  type="button"
                  onClick={() => this.setState({ showPassword: !showPassword })}
                  style={styles.eyeBtn}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loginLoading}
              style={{
                ...styles.loginBtn,
                opacity: loginLoading ? 0.7 : 1,
              }}
            >
              {loginLoading ? (
                <Spinner animation="border" size="sm" style={{ marginRight: 8 }} />
              ) : null}
              {loginLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p style={styles.loginFooter}>
            &copy; {new Date().getFullYear()} Saurellius by Dr. Paystub
          </p>
        </div>
      </div>
    );
  }

  // ─── DASHBOARD ──────────────────────────────────────────────────────────────
  renderDashboard() {
    const { loading, stats, revenue, revenueLoading, activeTab, adminUser } = this.state;

    if (loading) {
      return (
        <div style={styles.dashWrap}>
          <div style={{ textAlign: "center", padding: 80 }}>
            <Spinner animation="border" style={{ color: "#a78bfa" }} />
            <p style={{ marginTop: 16, color: "var(--color-text-secondary)" }}>Loading admin data...</p>
          </div>
        </div>
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
      { key: "paystubs", label: "Paid Documents" },
    ];

    return (
      <div style={styles.dashWrap}>
        {/* Top bar */}
        <div style={styles.topBar}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={styles.topLogo}>S</div>
            <span style={{ fontSize: 18, fontWeight: 700, color: "var(--color-text-primary)" }}>Saurellius Admin</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{
              fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 980,
              background: stats?.stripeMode === "dev" ? "rgba(251,191,36,0.12)" : "rgba(16,185,129,0.12)",
              color: stats?.stripeMode === "dev" ? "#f59e0b" : "#10b981",
              letterSpacing: "0.04em", textTransform: "uppercase",
            }}>
              Stripe: {stats?.stripeMode || "---"}
            </span>
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{adminUser?.email}</span>
            <button onClick={this.handleLogout} style={styles.logoutBtn} title="Sign Out">
              <FaSignOutAlt />
            </button>
          </div>
        </div>

        <div style={styles.dashContent}>
          {/* Header */}
          <div style={{ marginBottom: 8 }}>
            <h1 style={styles.pageTitle}>Admin Dashboard</h1>
            <p style={styles.pageSubtitle}>Platform monitoring & analytics</p>
          </div>

          {/* Tabs */}
          <div style={styles.tabBar}>
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => this.setState({ activeTab: t.key })}
                style={{
                  ...styles.tabBtn,
                  fontWeight: activeTab === t.key ? 600 : 500,
                  color: activeTab === t.key ? "#a78bfa" : "var(--color-text-secondary)",
                  borderBottom: activeTab === t.key ? "2px solid #a78bfa" : "2px solid transparent",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <>
              <div style={styles.statGrid}>
                <StatCard icon={<FaUsers />} value={u.total || 0} label="Total Users" />
                <StatCard icon={<FaFileAlt />} value={p.paid || 0} label="Paid Documents" />
                <StatCard icon={<FaUserPlus />} value={u.newThisMonth || 0} label="New Users (This Month)" trend={userGrowth} />
                <StatCard icon={<FaChartLine />} value={p.thisMonth || 0} label="Documents (This Month)" trend={stubGrowth} />
              </div>

              {stats?.monthlyData && (
                <div style={styles.sectionCard}>
                  <h4 style={styles.sectionTitle}>Monthly Documents (Last 6 Months)</h4>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120, padding: "0 4px" }}>
                    {stats.monthlyData.map((m, i) => {
                      const max = Math.max(...stats.monthlyData.map((d) => d.count), 1);
                      const h = Math.max((m.count / max) * 100, 4);
                      return (
                        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                          <span style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-primary)" }}>{m.count}</span>
                          <div style={{
                            width: "100%", maxWidth: 60, height: `${h}%`, borderRadius: "8px 8px 0 0",
                            background: "linear-gradient(135deg, #7c3aed, #a78bfa)", transition: "height 0.3s ease",
                          }} />
                          <span style={{ fontSize: 10, color: "var(--color-text-tertiary)", whiteSpace: "nowrap" }}>{m.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                <div style={{ ...styles.sectionCard, marginBottom: 0 }}>
                  <h4 style={styles.sectionTitle}>User Breakdown</h4>
                  <InfoRow label="Verified" value={u.verified || 0} color="#10b981" />
                  <InfoRow label="Unverified" value={u.unverified || 0} color="#f59e0b" />
                  <InfoRow label="Last Month Signups" value={u.newLastMonth || 0} />
                </div>
                <div style={{ ...styles.sectionCard, marginBottom: 0 }}>
                  <h4 style={styles.sectionTitle}>Document Breakdown</h4>
                  <InfoRow label="Total Created" value={p.total || 0} />
                  <InfoRow label="Paid" value={p.paid || 0} color="#10b981" />
                  <InfoRow label="Unpaid / Draft" value={p.unpaid || 0} color="var(--color-text-tertiary)" />
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
                  <Spinner animation="border" style={{ color: "#a78bfa" }} />
                </div>
              ) : (
                <>
                  <div style={styles.statGrid}>
                    <StatCard icon={<FaDollarSign />} value={revenue ? this.fmt(revenue.thisMonthRevenue) : "$0.00"} label="Revenue (This Month)" raw />
                    <StatCard icon={<FaDollarSign />} value={revenue ? this.fmt(revenue.lastMonthRevenue) : "$0.00"} label="Revenue (Last Month)" raw />
                    <StatCard icon={<FaCreditCard />} value={revenue?.totalChargesThisMonth || 0} label="Charges (This Month)" />
                    <StatCard icon={<FaDollarSign />} value={revenue ? this.fmt(revenue.balance?.available || 0) : "$0.00"} label="Stripe Balance" raw />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                    <div style={{ ...styles.sectionCard, marginBottom: 0 }}>
                      <h4 style={styles.sectionTitle}>Stripe Balance</h4>
                      <InfoRow label="Available" value={this.fmt(revenue?.balance?.available || 0)} />
                      <InfoRow label="Pending" value={this.fmt(revenue?.balance?.pending || 0)} />
                      <InfoRow label="Mode" value={revenue?.stripeMode || "---"} />
                    </div>
                    <div style={{ ...styles.sectionCard, marginBottom: 0 }}>
                      <h4 style={styles.sectionTitle}>Revenue Trend</h4>
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

                  {revenue?.recentCharges?.length > 0 && (
                    <div style={styles.sectionCard}>
                      <h4 style={styles.sectionTitle}>Recent Stripe Charges</h4>
                      <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                          <thead>
                            <tr style={{ borderBottom: "1px solid var(--color-border-strong)" }}>
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
              <div style={styles.statGrid}>
                <StatCard icon={<FaUsers />} value={u.total || 0} label="Total Users" />
                <StatCard icon={<FaCheckCircle />} value={u.verified || 0} label="Verified" />
                <StatCard icon={<FaTimesCircle />} value={u.unverified || 0} label="Unverified" />
                <StatCard icon={<FaUserPlus />} value={u.newThisMonth || 0} label="New This Month" />
              </div>

              {stats?.recentUsers?.length > 0 && (
                <div style={styles.sectionCard}>
                  <h4 style={styles.sectionTitle}>Recent Signups</h4>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--color-border-strong)" }}>
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
                                background: user.role === "admin" ? "rgba(167,139,250,0.15)" : "rgba(99,102,241,0.12)",
                                color: user.role === "admin" ? "#a78bfa" : "#818cf8",
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
              <div style={styles.statGrid}>
                <StatCard icon={<FaFileAlt />} value={p.total || 0} label="Total Created" />
                <StatCard icon={<FaCheckCircle />} value={p.paid || 0} label="Paid" />
                <StatCard icon={<FaClock />} value={p.unpaid || 0} label="Unpaid" />
                <StatCard icon={<FaCalendarAlt />} value={p.thisWeek || 0} label="This Week" />
              </div>

              {stats?.recentPaystubs?.length > 0 && (
                <div style={styles.sectionCard}>
                  <h4 style={styles.sectionTitle}>Recent Paid Documents</h4>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--color-border-strong)" }}>
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
                                background: "rgba(99,102,241,0.12)", color: "#818cf8",
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
        </div>
      </div>
    );
  }

  render() {
    return this.state.isAuthenticated ? this.renderDashboard() : this.renderLogin();
  }
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function StatCard({ icon, value, label, trend, raw }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statIcon}>{icon}</div>
      <div>
        <h3 style={{ margin: 0, fontSize: raw ? 22 : 26, fontWeight: 700, color: "var(--color-text-primary)" }}>{value}</h3>
        <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2 }}>{label}</p>
        {trend !== undefined && trend !== 0 && (
          <span style={{
            fontSize: 11, fontWeight: 600,
            color: trend > 0 ? "#10b981" : "#ef4444",
            display: "inline-flex", alignItems: "center", gap: 3, marginTop: 4,
          }}>
            {trend > 0 ? <FaArrowUp style={{ fontSize: 9 }} /> : <FaArrowDown style={{ fontSize: 9 }} />}
            {Math.abs(trend)}% vs last month
          </span>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value, color }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "8px 0", borderBottom: "1px solid var(--color-border)",
    }}>
      <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: color || "var(--color-text-primary)" }}>{value}</span>
    </div>
  );
}

// ─── Table styles ───────────────────────────────────────────────────────────

const thStyle = {
  padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 600,
  textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--color-text-tertiary)",
};
const tdStyle = {
  padding: "10px 12px", color: "var(--color-text-secondary)",
};

// ─── Inline styles ──────────────────────────────────────────────────────────

const styles = {
  // Login
  loginWrapper: {
    minHeight: "100vh",
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "var(--color-bg)",
    backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.12) 0%, transparent 60%)",
    padding: 20,
  },
  loginCard: {
    width: "100%", maxWidth: 420, padding: "48px 36px",
    background: "var(--color-bg-card)",
    border: "1px solid var(--color-border)",
    borderRadius: 16,
    backdropFilter: "blur(16px)",
    display: "flex", flexDirection: "column", alignItems: "center",
  },
  loginLogoWrap: { marginBottom: 20 },
  loginLogoCircle: {
    width: 64, height: 64, borderRadius: "50%",
    background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(167,139,250,0.1))",
    border: "1px solid rgba(167,139,250,0.25)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  loginTitle: { fontSize: 24, fontWeight: 700, color: "var(--color-text-primary)", margin: "0 0 4px" },
  loginSubtitle: { fontSize: 14, color: "var(--color-text-tertiary)", margin: "0 0 28px" },
  loginAlert: {
    width: "100%", padding: "10px 14px", borderRadius: 8, marginBottom: 20,
    background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
    color: "#f87171", fontSize: 13, display: "flex", alignItems: "center",
  },
  fieldGroup: { marginBottom: 20 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 6 },
  input: {
    width: "100%", padding: "12px 14px", fontSize: 14,
    background: "var(--color-bg-input)", border: "1px solid var(--color-border-strong)",
    borderRadius: 10, color: "var(--color-text-primary)", outline: "none",
    transition: "border-color 0.15s",
    boxSizing: "border-box",
  },
  eyeBtn: {
    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
    background: "none", border: "none", color: "var(--color-text-tertiary)", cursor: "pointer", fontSize: 16, padding: 4,
  },
  loginBtn: {
    width: "100%", padding: "14px 0", border: "none", borderRadius: 10,
    background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
    color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer",
    transition: "opacity 0.15s", marginTop: 4,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  loginFooter: { marginTop: 28, fontSize: 12, color: "var(--color-text-tertiary)" },

  // Dashboard
  dashWrap: {
    minHeight: "100vh",
    background: "var(--color-bg)",
    color: "var(--color-text-primary)",
  },
  topBar: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "14px 32px",
    background: "var(--color-bg-glass)",
    borderBottom: "1px solid var(--color-border)",
    backdropFilter: "blur(12px)",
    position: "sticky", top: 0, zIndex: 100,
  },
  topLogo: {
    width: 36, height: 36, borderRadius: 10,
    background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 18, fontWeight: 700, color: "#fff",
  },
  logoutBtn: {
    background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
    borderRadius: 8, padding: "8px 10px", color: "#f87171", cursor: "pointer",
    fontSize: 14, transition: "background 0.15s",
  },
  dashContent: {
    maxWidth: 1200, margin: "0 auto", padding: "32px 32px 64px",
  },
  pageTitle: { fontSize: 28, fontWeight: 700, margin: 0, color: "var(--color-text-primary)" },
  pageSubtitle: { fontSize: 14, color: "var(--color-text-tertiary)", margin: "4px 0 0" },
  tabBar: {
    display: "flex", gap: 4, marginBottom: 28, marginTop: 20,
    borderBottom: "1px solid var(--color-border)", paddingBottom: 0, overflow: "auto",
  },
  tabBtn: {
    padding: "10px 18px", border: "none", background: "transparent",
    cursor: "pointer", fontSize: 14, transition: "all 0.15s ease", whiteSpace: "nowrap",
  },
  statGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 16, marginBottom: 24,
  },
  statCard: {
    padding: "20px 24px",
    background: "var(--color-bg-card)",
    border: "1px solid var(--color-border)",
    borderRadius: 14,
    display: "flex", alignItems: "center", gap: 16,
  },
  statIcon: {
    width: 44, height: 44, borderRadius: 12,
    background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(167,139,250,0.08))",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#a78bfa", fontSize: 18, flexShrink: 0,
  },
  sectionCard: {
    padding: "20px 24px", marginBottom: 24,
    background: "var(--color-bg-card)",
    border: "1px solid var(--color-border)",
    borderRadius: 14,
  },
  sectionTitle: { fontSize: 15, fontWeight: 600, color: "var(--color-text-primary)", margin: "0 0 16px" },
};

export default AdminPage;
