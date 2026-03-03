import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FaFileAlt, FaUser, FaClock, FaShieldAlt, FaCalendarAlt, FaLock, FaPlus, FaPen, FaEye, FaCheckCircle } from "react-icons/fa";
import { axios } from "../../../HelperFunctions/axios";
import "./dashboard.css";
import actionCreater from "../../../redux/actions/actionCreater";
import DashboardLayout from "./layout/DashboardLayout";
import moment from "moment";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paystubCount: 0,
      totalPeriods: 0,
      recentStubs: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.fetchStats();
  }

  fetchStats = async () => {
    try {
      let url = process.env.REACT_APP_BACKEND_URL_LOCAL;
      if (process.env.REACT_APP_MODE === "live") {
        url = process.env.REACT_APP_FRONTEND_URL_LIVE;
      }
      const token = localStorage.getItem("tokens");
      const response = await axios.get(`${url}api/auth/get-paystubs`, {
        headers: { Authorization: `bearer ${token}` },
      });
      const stubs = Array.isArray(response.data) ? response.data : [];
      const totalPeriods = stubs.reduce((sum, s) => sum + ((s.params?.pay_dates || []).length), 0);
      this.setState({
        paystubCount: stubs.length,
        totalPeriods,
        recentStubs: stubs.slice(0, 3),
        loading: false,
      });
    } catch (e) {
      console.log(e);
      this.setState({ loading: false });
    }
  };

  render() {
    const { userData } = this.props;
    const { paystubCount, totalPeriods, recentStubs } = this.state;
    const userName = userData?.firstName || "there";
    const memberSince = userData?.createdAt
      ? new Date(userData.createdAt).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })
      : "---";

    const profileFields = [
      { label: "First Name", done: !!userData?.firstName },
      { label: "Last Name", done: !!userData?.lastName },
      { label: "Email", done: !!userData?.email },
      { label: "Phone", done: !!userData?.phoneNumber },
      { label: "Photo", done: !!userData?.image },
    ];
    const profileDone = profileFields.filter((f) => f.done).length;
    const profilePct = Math.round((profileDone / profileFields.length) * 100);

    const greeting = (() => {
      const h = new Date().getHours();
      if (h < 12) return "Good morning";
      if (h < 17) return "Good afternoon";
      return "Good evening";
    })();

    return (
      <DashboardLayout>
        <h1 className="dash-page-title">{greeting}, {userName}</h1>
        <p className="dash-page-subtitle">Here's a snapshot of your account</p>

        {/* Stat Cards */}
        <div className="dash-stat-grid">
          <div className="dash-stat-card">
            <div className="dash-stat-icon">
              <FaFileAlt />
            </div>
            <div className="dash-stat-info">
              <h3>{paystubCount}</h3>
              <p>Paystub Groups</p>
            </div>
          </div>

          <div className="dash-stat-card">
            <div className="dash-stat-icon">
              <FaCalendarAlt />
            </div>
            <div className="dash-stat-info">
              <h3>{totalPeriods}</h3>
              <p>Total Pay Periods</p>
            </div>
          </div>

          <div className="dash-stat-card">
            <div className="dash-stat-icon">
              <FaClock />
            </div>
            <div className="dash-stat-info">
              <h3 style={{ fontSize: 18 }}>{memberSince}</h3>
              <p>Member Since</p>
            </div>
          </div>

          <div className="dash-stat-card">
            <div className="dash-stat-icon">
              <FaShieldAlt />
            </div>
            <div className="dash-stat-info">
              <h3>{profilePct}%</h3>
              <p>Profile Complete</p>
            </div>
          </div>
        </div>

        {/* Profile Completion */}
        {profilePct < 100 && (
          <div className="dash-section-card" style={{ marginBottom: 24 }}>
            <h4 style={{ marginBottom: 16 }}>Complete Your Profile</h4>
            <div style={{
              width: "100%", height: 8, borderRadius: 4,
              background: "var(--color-bg)", overflow: "hidden", marginBottom: 14,
            }}>
              <div style={{
                width: `${profilePct}%`, height: "100%", borderRadius: 4,
                background: profilePct === 100 ? "#10b981" : "var(--gradient-brand)",
                transition: "width 0.4s ease",
              }} />
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {profileFields.map((f) => (
                <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                  <FaCheckCircle style={{ color: f.done ? "#10b981" : "var(--color-border)", fontSize: 14 }} />
                  <span style={{ color: f.done ? "var(--color-text-primary)" : "var(--color-text-tertiary)" }}>{f.label}</span>
                </div>
              ))}
            </div>
            {profilePct < 100 && (
              <Link to="/dashboard/profile" className="btn btn-outline-primary" style={{ marginTop: 14, fontSize: 13, padding: "6px 16px" }}>
                <FaPen style={{ marginRight: 5 }} /> Complete Profile
              </Link>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="dash-section-card" style={{ marginBottom: 24 }}>
          <h4>Quick Actions</h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            <Link to="/paystubs" style={{ textDecoration: "none" }}>
              <div style={{
                padding: "20px 18px", borderRadius: "var(--radius-lg)",
                background: "var(--color-bg)", border: "1px solid var(--color-border)",
                display: "flex", alignItems: "center", gap: 14,
                transition: "all 0.15s ease", cursor: "pointer",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--color-accent)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: "var(--radius-md)",
                  background: "var(--gradient-brand)", display: "flex",
                  alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <FaPlus style={{ color: "#fff", fontSize: 16 }} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "var(--color-text-primary)" }}>Create Paystub</div>
                  <div style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Generate new pay documents</div>
                </div>
              </div>
            </Link>
            <Link to="/dashboard/paystub" style={{ textDecoration: "none" }}>
              <div style={{
                padding: "20px 18px", borderRadius: "var(--radius-lg)",
                background: "var(--color-bg)", border: "1px solid var(--color-border)",
                display: "flex", alignItems: "center", gap: 14,
                transition: "all 0.15s ease", cursor: "pointer",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--color-accent)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: "var(--radius-md)",
                  background: "var(--gradient-brand-subtle)", display: "flex",
                  alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <FaEye style={{ color: "var(--color-accent)", fontSize: 16 }} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "var(--color-text-primary)" }}>My Paystubs</div>
                  <div style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>View &amp; download documents</div>
                </div>
              </div>
            </Link>
            <Link to="/dashboard/change-password" style={{ textDecoration: "none" }}>
              <div style={{
                padding: "20px 18px", borderRadius: "var(--radius-lg)",
                background: "var(--color-bg)", border: "1px solid var(--color-border)",
                display: "flex", alignItems: "center", gap: 14,
                transition: "all 0.15s ease", cursor: "pointer",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--color-accent)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: "var(--radius-md)",
                  background: "var(--gradient-brand-subtle)", display: "flex",
                  alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <FaLock style={{ color: "var(--color-accent)", fontSize: 16 }} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "var(--color-text-primary)" }}>Security</div>
                  <div style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Change your password</div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Paystubs */}
        {recentStubs.length > 0 && (
          <div className="dash-section-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid var(--color-border)" }}>
              <h4 style={{ margin: 0, border: "none", paddingBottom: 0 }}>Recent Paystubs</h4>
              <Link to="/dashboard/paystub" style={{ fontSize: 13, fontWeight: 500, color: "var(--color-accent)", textDecoration: "none" }}>
                View All
              </Link>
            </div>
            {recentStubs.map((stub, idx) => {
              const p = stub.params || {};
              return (
                <div key={stub._id || idx} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 0",
                  borderBottom: idx < recentStubs.length - 1 ? "1px solid var(--color-border)" : "none",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: "var(--radius-md)",
                      background: "var(--gradient-brand-subtle)", display: "flex",
                      alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <FaFileAlt style={{ color: "var(--color-accent)", fontSize: 14 }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "var(--color-text-primary)" }}>
                        {p.company_name || "---"}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>
                        {p.employee_name || "---"} &middot; {(p.pay_dates || []).length} period{(p.pay_dates || []).length !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>
                    {stub.createdAt ? moment(stub.createdAt).fromNow() : "---"}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Security Info */}
        <div style={{
          marginTop: 24, padding: "14px 18px", borderRadius: "var(--radius-lg)",
          background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.15)",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <FaLock style={{ color: "#a78bfa", fontSize: 16, flexShrink: 0 }} />
          <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
            All your paystub PDFs are password-protected. View passwords anytime from <Link to="/dashboard/paystub" style={{ color: "#a78bfa", fontWeight: 600, textDecoration: "none" }}>My Paystubs</Link>.
          </div>
        </div>
      </DashboardLayout>
    );
  }
}

const mapStateToProps = (state) => ({
  userData: state?.userData,
});

export default connect(mapStateToProps)(Dashboard);
