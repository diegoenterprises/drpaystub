import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  FaUsers, FaFileAlt, FaDollarSign, FaChartLine, FaCalendarAlt,
  FaCreditCard, FaCheckCircle, FaTimesCircle, FaArrowUp, FaArrowDown,
  FaUserPlus, FaClock, FaShieldAlt, FaPercent, FaExclamationTriangle,
  FaSync, FaSearch, FaChartBar, FaUserCheck, FaChartArea,
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
      error: null,
      revenueError: null,
      userSearch: "",
      refreshing: false,
    };
  }

  componentDidMount() {
    this.fetchStats();
    this.fetchRevenue();
  }

  fetchStats = async () => {
    try {
      this.setState({ error: null });
      const response = await axios.get("api/admin/stats");
      this.setState({ stats: response.data, loading: false, refreshing: false });
    } catch (e) {
      console.error("Admin stats error:", e);
      const msg = e.response?.data?.message || e.response?.data?.error || e.message || "Failed to load stats";
      this.setState({ loading: false, refreshing: false, error: `Stats API error: ${msg} (${e.response?.status || "network"})` });
    }
  };

  fetchRevenue = async () => {
    try {
      this.setState({ revenueError: null });
      const response = await axios.get("api/admin/stripe-revenue");
      this.setState({ revenue: response.data, revenueLoading: false });
    } catch (e) {
      console.error("Admin revenue error:", e);
      const msg = e.response?.data?.message || e.response?.data?.error || e.message || "Failed to load revenue";
      this.setState({ revenueLoading: false, revenueError: `Revenue API error: ${msg} (${e.response?.status || "network"})` });
    }
  };

  handleRefresh = () => {
    this.setState({ refreshing: true, loading: true, revenueLoading: true });
    this.fetchStats();
    this.fetchRevenue();
  };

  fmt = (cents) => `$${(cents / 100).toFixed(2)}`;

  pctChange = (current, previous) => {
    if (!previous) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  render() {
    const { userData } = this.props;
    const { loading, stats, revenue, revenueLoading, activeTab, error, revenueError, userSearch, refreshing } = this.state;

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
    const trends = stats?.trends || {};
    const userGrowth = this.pctChange(u.newThisMonth, u.newLastMonth);
    const stubGrowth = this.pctChange(p.thisMonth, p.lastMonth);
    const weeklyUserGrowth = this.pctChange(u.newThisWeek, u.newLastWeek);
    const weeklyStubGrowth = this.pctChange(p.thisWeek, p.lastWeek);

    const tabs = [
      { key: "overview", label: "Overview", icon: <FaChartArea style={{ fontSize: 12 }} /> },
      { key: "kpis", label: "KPIs & Intel", icon: <FaChartBar style={{ fontSize: 12 }} /> },
      { key: "revenue", label: "Revenue & Stripe", icon: <FaDollarSign style={{ fontSize: 12 }} /> },
      { key: "users", label: "Users", icon: <FaUsers style={{ fontSize: 12 }} /> },
      { key: "paystubs", label: "Paystubs", icon: <FaFileAlt style={{ fontSize: 12 }} /> },
    ];

    // Filter users for search
    const allUsers = stats?.allUsers || stats?.recentUsers || [];
    const filteredUsers = userSearch
      ? allUsers.filter((u) =>
          `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(userSearch.toLowerCase())
        )
      : allUsers;

    return (
      <DashboardLayout>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 className="dash-page-title">Admin Dashboard</h1>
            <p className="dash-page-subtitle">Platform monitoring, analytics & business intelligence</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={this.handleRefresh}
              disabled={refreshing}
              style={{
                background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)",
                borderRadius: 8, padding: "6px 12px", cursor: "pointer", color: "var(--color-text-secondary)",
                fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6,
              }}
            >
              <FaSync style={{ fontSize: 11, animation: refreshing ? "spin 1s linear infinite" : "none" }} /> Refresh
            </button>
            <div style={{
              fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 980,
              background: stats?.stripeMode === "dev" ? "rgba(251,191,36,0.12)" : "rgba(16,185,129,0.12)",
              color: stats?.stripeMode === "dev" ? "#f59e0b" : "#10b981",
              letterSpacing: "0.04em", textTransform: "uppercase",
            }}>
              Stripe: {stats?.stripeMode || "---"}
            </div>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div style={{
            padding: "12px 16px", marginBottom: 16, borderRadius: 10,
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
            color: "#f87171", fontSize: 13, display: "flex", alignItems: "center", gap: 8,
          }}>
            <FaExclamationTriangle style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

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
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ═══════ OVERVIEW TAB ═══════ */}
        {activeTab === "overview" && (
          <>
            {/* Top-level KPIs */}
            <div className="dash-stat-grid">
              <StatCard icon={<FaUsers />} value={u.total || 0} label="Total Users" />
              <StatCard icon={<FaFileAlt />} value={p.paid || 0} label="Paid Paystubs" />
              <StatCard icon={<FaUserPlus />} value={u.newThisMonth || 0} label="New Users (Month)" trend={userGrowth} />
              <StatCard icon={<FaChartLine />} value={p.thisMonth || 0} label="Paystubs (Month)" trend={stubGrowth} />
            </div>

            {/* Real-time pulse */}
            <div className="dash-section-card" style={{ marginBottom: 24 }}>
              <h4 style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block", animation: "pulse 2s infinite" }} />
                Real-time Pulse
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
                <MiniStat label="Last 24h Users" value={u.newLast24h || 0} />
                <MiniStat label="Last 7d Users" value={u.newLast7d || 0} />
                <MiniStat label="Last 30d Users" value={u.newLast30d || 0} />
                <MiniStat label="Today's Paystubs" value={p.today || 0} />
                <MiniStat label="Yesterday" value={p.yesterday || 0} />
                <MiniStat label="This Week" value={p.thisWeek || 0} />
              </div>
            </div>

            {/* Daily trend chart (14 days) */}
            {trends?.dailySignups && (
              <div className="dash-section-card" style={{ marginBottom: 24 }}>
                <h4>Daily Activity (Last 14 Days)</h4>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 120, padding: "0 4px" }}>
                  {trends.dailySignups.map((d, i) => {
                    const paidCount = trends.dailyPaystubs?.[i]?.count || 0;
                    const maxVal = Math.max(...trends.dailySignups.map((x) => x.count), ...trends.dailyPaystubs.map((x) => x.count), 1);
                    const hU = Math.max((d.count / maxVal) * 100, 2);
                    const hP = Math.max((paidCount / maxVal) * 100, 2);
                    return (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                        <span style={{ fontSize: 9, fontWeight: 600, color: "var(--color-text-primary)" }}>{d.count + paidCount > 0 ? d.count + paidCount : ""}</span>
                        <div style={{ display: "flex", gap: 1, alignItems: "flex-end", height: "100%", width: "100%" }}>
                          <div style={{ flex: 1, height: `${hU}%`, borderRadius: "4px 4px 0 0", background: "var(--color-accent)", opacity: 0.7, minHeight: 2 }} title={`Users: ${d.count}`} />
                          <div style={{ flex: 1, height: `${hP}%`, borderRadius: "4px 4px 0 0", background: "#10b981", opacity: 0.7, minHeight: 2 }} title={`Paystubs: ${paidCount}`} />
                        </div>
                        <span style={{ fontSize: 8, color: "var(--color-text-tertiary)", whiteSpace: "nowrap" }}>{d.label.split(" ")[1]}</span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: "flex", gap: 16, marginTop: 8, justifyContent: "center" }}>
                  <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: "var(--color-accent)", opacity: 0.7 }} /> Signups
                  </span>
                  <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: "#10b981", opacity: 0.7 }} /> Paid Paystubs
                  </span>
                </div>
              </div>
            )}

            {/* Breakdowns */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
              <div className="dash-section-card" style={{ marginBottom: 0 }}>
                <h4>User Breakdown</h4>
                <InfoRow label="Verified" value={u.verified || 0} color="#10b981" />
                <InfoRow label="Unverified" value={u.unverified || 0} color="#f59e0b" />
                <InfoRow label="Admin Accounts" value={u.admins || 0} color="#a78bfa" />
                <InfoRow label="Verification Rate" value={`${u.verificationRate || 0}%`} color={u.verificationRate >= 50 ? "#10b981" : "#f59e0b"} />
                <InfoRow label="Today's Signups" value={u.newToday || 0} />
                <InfoRow label="Yesterday" value={u.newYesterday || 0} />
              </div>
              <div className="dash-section-card" style={{ marginBottom: 0 }}>
                <h4>Paystub Breakdown</h4>
                <InfoRow label="Total Created" value={p.total || 0} />
                <InfoRow label="Paid" value={p.paid || 0} color="#10b981" />
                <InfoRow label="Unpaid / Draft" value={p.unpaid || 0} color="#64748b" />
                <InfoRow label="Conversion Rate" value={`${p.conversionRate || 0}%`} color={p.conversionRate >= 50 ? "#10b981" : "#f59e0b"} />
                <InfoRow label="Avg Per User" value={p.avgPerUser || "0"} />
                <InfoRow label="This Week" value={p.thisWeek || 0} />
              </div>
            </div>

            {/* Monthly trend */}
            {trends?.monthlyPaystubs && (
              <div className="dash-section-card" style={{ marginBottom: 24 }}>
                <h4>Monthly Paid Paystubs (Last 12 Months)</h4>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 130, padding: "0 4px" }}>
                  {trends.monthlyPaid.map((m, i) => {
                    const max = Math.max(...trends.monthlyPaid.map((d) => d.count), 1);
                    const h = Math.max((m.count / max) * 100, 3);
                    return (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                        <span style={{ fontSize: 10, fontWeight: 600, color: "var(--color-text-primary)" }}>{m.count || ""}</span>
                        <div style={{
                          width: "100%", maxWidth: 48, height: `${h}%`, borderRadius: "6px 6px 0 0",
                          background: "var(--gradient-brand)", transition: "height 0.3s ease",
                        }} />
                        <span style={{ fontSize: 9, color: "var(--color-text-tertiary)", whiteSpace: "nowrap" }}>{m.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* ═══════ KPIs & INTEL TAB ═══════ */}
        {activeTab === "kpis" && (
          <>
            <div className="dash-stat-grid">
              <StatCard icon={<FaPercent />} value={`${p.conversionRate || 0}%`} label="Paystub Conversion" raw />
              <StatCard icon={<FaUserCheck />} value={`${u.verificationRate || 0}%`} label="Email Verification" raw />
              <StatCard icon={<FaChartLine />} value={p.avgPerUser || "0"} label="Avg Stubs/User" raw />
              <StatCard icon={<FaShieldAlt />} value={u.admins || 0} label="Admin Accounts" />
            </div>

            {/* Growth comparison */}
            <div className="dash-section-card" style={{ marginBottom: 24 }}>
              <h4>Growth Metrics</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-tertiary)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>User Growth</p>
                  <InfoRow label="Today" value={u.newToday || 0} />
                  <InfoRow label="Yesterday" value={u.newYesterday || 0} />
                  <InfoRow label="This Week" value={u.newThisWeek || 0} />
                  <InfoRow label="Last Week" value={u.newLastWeek || 0} />
                  <InfoRow label="This Month" value={u.newThisMonth || 0} />
                  <InfoRow label="Last Month" value={u.newLastMonth || 0} />
                  <InfoRow label="Week-over-Week" value={`${weeklyUserGrowth >= 0 ? "+" : ""}${weeklyUserGrowth}%`} color={weeklyUserGrowth >= 0 ? "#10b981" : "#ef4444"} />
                  <InfoRow label="Month-over-Month" value={`${userGrowth >= 0 ? "+" : ""}${userGrowth}%`} color={userGrowth >= 0 ? "#10b981" : "#ef4444"} />
                </div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-tertiary)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>Paystub Growth</p>
                  <InfoRow label="Today" value={p.today || 0} />
                  <InfoRow label="Yesterday" value={p.yesterday || 0} />
                  <InfoRow label="This Week" value={p.thisWeek || 0} />
                  <InfoRow label="Last Week" value={p.lastWeek || 0} />
                  <InfoRow label="This Month (Paid)" value={p.paidThisMonth || 0} />
                  <InfoRow label="Last Month (Paid)" value={p.paidLastMonth || 0} />
                  <InfoRow label="Week-over-Week" value={`${weeklyStubGrowth >= 0 ? "+" : ""}${weeklyStubGrowth}%`} color={weeklyStubGrowth >= 0 ? "#10b981" : "#ef4444"} />
                  <InfoRow label="Month-over-Month" value={`${stubGrowth >= 0 ? "+" : ""}${stubGrowth}%`} color={stubGrowth >= 0 ? "#10b981" : "#ef4444"} />
                </div>
              </div>
            </div>

            {/* Monthly user signups trend */}
            {trends?.monthlyUsers && (
              <div className="dash-section-card" style={{ marginBottom: 24 }}>
                <h4>Monthly User Signups (Last 12 Months)</h4>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 120, padding: "0 4px" }}>
                  {trends.monthlyUsers.map((m, i) => {
                    const max = Math.max(...trends.monthlyUsers.map((d) => d.count), 1);
                    const h = Math.max((m.count / max) * 100, 3);
                    return (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                        <span style={{ fontSize: 10, fontWeight: 600, color: "var(--color-text-primary)" }}>{m.count || ""}</span>
                        <div style={{
                          width: "100%", maxWidth: 48, height: `${h}%`, borderRadius: "6px 6px 0 0",
                          background: "linear-gradient(135deg, #6366f1, #818cf8)", transition: "height 0.3s ease",
                        }} />
                        <span style={{ fontSize: 9, color: "var(--color-text-tertiary)", whiteSpace: "nowrap" }}>{m.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Funnel metrics */}
            <div className="dash-section-card" style={{ marginBottom: 24 }}>
              <h4>Conversion Funnel</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <FunnelBar label="Total Users Registered" value={u.total || 0} pct={100} color="var(--color-accent)" />
                <FunnelBar label="Email Verified" value={u.verified || 0} pct={u.total ? Math.round((u.verified / u.total) * 100) : 0} color="#6366f1" />
                <FunnelBar label="Created at Least 1 Paystub" value={p.total > 0 ? Math.min(u.total, p.total) : 0} pct={u.total ? Math.min(100, Math.round(((p.total > 0 ? Math.min(u.total, p.total) : 0) / u.total) * 100)) : 0} color="#8b5cf6" />
                <FunnelBar label="Paid for Paystub" value={p.paid || 0} pct={u.total ? Math.round((p.paid / Math.max(u.total, 1)) * 100) : 0} color="#10b981" />
              </div>
            </div>

            {stats?.serverTime && (
              <p style={{ fontSize: 11, color: "var(--color-text-tertiary)", textAlign: "right" }}>
                Server time: {moment(stats.serverTime).format("MMM D, YYYY h:mm:ss A")}
              </p>
            )}
          </>
        )}

        {/* ═══════ REVENUE TAB ═══════ */}
        {activeTab === "revenue" && (
          <>
            {revenueError && (
              <div style={{
                padding: "12px 16px", marginBottom: 16, borderRadius: 10,
                background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                color: "#f87171", fontSize: 13, display: "flex", alignItems: "center", gap: 8,
              }}>
                <FaExclamationTriangle style={{ flexShrink: 0 }} />
                <span>{revenueError}</span>
              </div>
            )}
            {revenueLoading ? (
              <div style={{ textAlign: "center", padding: 60 }}>
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              <>
                <div className="dash-stat-grid">
                  <StatCard icon={<FaDollarSign />} value={revenue ? this.fmt(revenue.thisMonthRevenue) : "$0.00"} label="Revenue (This Month)" raw />
                  <StatCard icon={<FaDollarSign />} value={revenue ? this.fmt(revenue.lastMonthRevenue) : "$0.00"} label="Revenue (Last Month)" raw />
                  <StatCard icon={<FaCreditCard />} value={revenue?.totalChargesThisMonth || 0} label="Charges (This Month)" />
                  <StatCard icon={<FaDollarSign />} value={revenue ? this.fmt(revenue.balance?.available || 0) : "$0.00"} label="Stripe Balance" raw />
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

        {/* ═══════ USERS TAB ═══════ */}
        {activeTab === "users" && (
          <>
            <div className="dash-stat-grid" style={{ marginBottom: 24 }}>
              <StatCard icon={<FaUsers />} value={u.total || 0} label="Total Users" />
              <StatCard icon={<FaCheckCircle />} value={u.verified || 0} label="Verified" />
              <StatCard icon={<FaTimesCircle />} value={u.unverified || 0} label="Unverified" />
              <StatCard icon={<FaUserPlus />} value={u.newThisMonth || 0} label="New This Month" trend={userGrowth} />
            </div>

            {/* Search */}
            <div style={{ marginBottom: 16, position: "relative" }}>
              <FaSearch style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-tertiary)", fontSize: 13 }} />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={userSearch}
                onChange={(e) => this.setState({ userSearch: e.target.value })}
                style={{
                  width: "100%", padding: "10px 14px 10px 36px", fontSize: 13,
                  background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)",
                  borderRadius: 10, color: "var(--color-text-primary)", outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div className="dash-section-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h4 style={{ margin: 0 }}>All Users ({filteredUsers.length})</h4>
              </div>
              {filteredUsers.length > 0 ? (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                        <th style={thStyle}>#</th>
                        <th style={thStyle}>Name</th>
                        <th style={thStyle}>Email</th>
                        <th style={thStyle}>Role</th>
                        <th style={thStyle}>Verified</th>
                        <th style={thStyle}>Joined</th>
                        <th style={thStyle}>Time Ago</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user, idx) => (
                        <tr key={user._id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                          <td style={{ ...tdStyle, color: "var(--color-text-tertiary)", fontSize: 11 }}>{idx + 1}</td>
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
                              <span style={{ color: "#10b981", fontWeight: 600, fontSize: 12 }}><FaCheckCircle /> Yes</span>
                            ) : (
                              <span style={{ color: "#ef4444", fontWeight: 600, fontSize: 12 }}><FaTimesCircle /> No</span>
                            )}
                          </td>
                          <td style={tdStyle}>{moment(user.createdAt).format("MMM D, YYYY")}</td>
                          <td style={{ ...tdStyle, fontSize: 11, color: "var(--color-text-tertiary)" }}>{moment(user.createdAt).fromNow()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ color: "var(--color-text-tertiary)", fontSize: 13, padding: 20, textAlign: "center" }}>
                  {userSearch ? "No users match your search." : "No users found."}
                </p>
              )}
            </div>
          </>
        )}

        {/* ═══════ PAYSTUBS TAB ═══════ */}
        {activeTab === "paystubs" && (
          <>
            <div className="dash-stat-grid" style={{ marginBottom: 24 }}>
              <StatCard icon={<FaFileAlt />} value={p.total || 0} label="Total Created" />
              <StatCard icon={<FaCheckCircle />} value={p.paid || 0} label="Paid" />
              <StatCard icon={<FaClock />} value={p.unpaid || 0} label="Unpaid" />
              <StatCard icon={<FaCalendarAlt />} value={p.thisWeek || 0} label="This Week" trend={weeklyStubGrowth} />
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
                        <th style={thStyle}>State</th>
                        <th style={thStyle}>Periods</th>
                        <th style={thStyle}>Created</th>
                        <th style={thStyle}>Time Ago</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentPaystubs.map((ps) => (
                        <tr key={ps._id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                          <td style={{ ...tdStyle, fontWeight: 600, color: "var(--color-text-primary)" }}>{ps.company}</td>
                          <td style={tdStyle}>{ps.employee}</td>
                          <td style={tdStyle}>{ps.state || "—"}</td>
                          <td style={tdStyle}>
                            <span style={{
                              fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 980,
                              background: "var(--gradient-brand-subtle)", color: "var(--color-accent)",
                            }}>
                              {ps.periods}
                            </span>
                          </td>
                          <td style={tdStyle}>{moment(ps.createdAt).format("MMM D, YYYY h:mm A")}</td>
                          <td style={{ ...tdStyle, fontSize: 11, color: "var(--color-text-tertiary)" }}>{moment(ps.createdAt).fromNow()}</td>
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

// ─── Sub-components ─────────────────────────────────────────────────────────

const thStyle = {
  padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 600,
  textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--color-text-tertiary)",
};
const tdStyle = {
  padding: "10px 12px", color: "var(--color-text-secondary)",
};

function StatCard({ icon, value, label, trend, raw }) {
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
            {Math.abs(trend)}% vs last period
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
      <span style={{ fontSize: 13, color: "var(--color-text-tertiary)" }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: color || "var(--color-text-primary)" }}>{value}</span>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div style={{
      padding: "10px 14px", borderRadius: 10,
      background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)",
    }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: "var(--color-text-primary)" }}>{value}</div>
      <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 2 }}>{label}</div>
    </div>
  );
}

function FunnelBar({ label, value, pct, color }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-primary)" }}>{value} ({pct}%)</span>
      </div>
      <div style={{ height: 8, borderRadius: 4, background: "var(--color-bg-secondary)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, borderRadius: 4, background: color, transition: "width 0.5s ease" }} />
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  userData: state?.userData,
});

export default connect(mapStateToProps)(AdminDashboard);
