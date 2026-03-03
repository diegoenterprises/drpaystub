import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FaFileAlt, FaEye, FaEyeSlash, FaChevronDown, FaChevronUp, FaLock, FaCalendarAlt, FaDownload } from "react-icons/fa";
import { axios } from "../../../HelperFunctions/axios";
import DashboardLayout from "./layout/DashboardLayout";
import actionCreater from "../../../redux/actions/actionCreater";
import { connect } from "react-redux";
import "../Dashboard/layout/styles.css";
import { Spinner } from "react-bootstrap";
import moment from "moment";

// Compute per-stub password: LASTNAME + LAST4SSN + MMDDYYYY (pay period start)
function computeStubPassword(employeeName, ssid, startDateStr) {
  const parts = (employeeName || "").trim().split(/\s+/);
  const lastName = (parts[parts.length - 1] || "").toUpperCase();
  const digits = (ssid || "").replace(/\D/g, "");
  const last4 = digits.slice(-4);
  const dateClean = (startDateStr || "").replace(/\//g, "");
  return lastName + last4 + dateClean;
}

// Compute pay period start for each stub index
function getPayPeriodStart(params, index) {
  if (index === 0) {
    return params.startDate || "";
  }
  const prevDate = (params.pay_dates || [])[index - 1];
  if (!prevDate) return "";
  return moment(prevDate, "DD/MM/YYYY").format("MM/DD/YYYY");
}

class PaystubGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      revealedPasswords: {},
    };
  }

  toggleExpand = () => this.setState((s) => ({ expanded: !s.expanded }));

  togglePassword = (idx) => {
    this.setState((s) => ({
      revealedPasswords: { ...s.revealedPasswords, [idx]: !s.revealedPasswords[idx] },
    }));
  };

  render() {
    const { stub } = this.props;
    const { expanded, revealedPasswords } = this.state;
    const params = stub.params || {};
    const companyName = params.company_name || "—";
    const employeeName = params.employee_name || "—";
    const createdDate = stub.createdAt ? moment(stub.createdAt).format("MMM D, YYYY") : "—";
    const payDates = params.pay_dates || [];
    const actualPayDates = params.actual_pay_dates || [];
    const payFreq = params.pay_frequency || "—";
    const empStatus = params.employment_status || "—";
    const isPaid = params.paymentStatus === "success";

    return (
      <div style={{
        background: "var(--color-bg-card)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-xl)",
        overflow: "hidden",
        transition: "box-shadow 0.2s ease",
        boxShadow: expanded ? "var(--shadow-card)" : "none",
      }}>
        {/* Clickable header row */}
        <div
          onClick={this.toggleExpand}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 20px",
            cursor: "pointer",
            userSelect: "none",
            transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-bg-elevated)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
            <div style={{
              width: 42, height: 42, borderRadius: "var(--radius-lg)",
              background: "var(--gradient-brand-subtle)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <FaFileAlt style={{ color: "var(--color-accent)", fontSize: 18 }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <strong style={{ fontSize: 15, color: "var(--color-text-primary)", display: "block" }}>
                {companyName}
              </strong>
              <span style={{ fontSize: 13, color: "var(--color-text-tertiary)" }}>
                {employeeName} &middot; {payDates.length} pay period{payDates.length !== 1 ? "s" : ""} &middot; {createdDate}
              </span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            {isPaid && (
              <span style={{
                fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 980,
                background: "rgba(16,185,129,0.12)", color: "#10b981", letterSpacing: "0.02em",
              }}>PAID</span>
            )}
            <span style={{
              fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 980,
              background: "var(--gradient-brand-subtle)", color: "var(--color-accent)",
            }}>{payDates.length} PDF{payDates.length !== 1 ? "s" : ""}</span>
            {expanded ? (
              <FaChevronUp style={{ color: "var(--color-text-tertiary)", fontSize: 14 }} />
            ) : (
              <FaChevronDown style={{ color: "var(--color-text-tertiary)", fontSize: 14 }} />
            )}
          </div>
        </div>

        {/* Expanded detail */}
        {expanded && (
          <div style={{ borderTop: "1px solid var(--color-border)", padding: "0 20px 20px" }}>
            {/* Summary row */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: 16, padding: "16px 0 12px",
              borderBottom: "1px solid var(--color-border)", marginBottom: 16,
            }}>
              <div>
                <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>Employee</div>
                <div style={{ fontSize: 14, color: "var(--color-text-primary)", fontWeight: 500, marginTop: 2 }}>{employeeName}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>Pay Frequency</div>
                <div style={{ fontSize: 14, color: "var(--color-text-primary)", fontWeight: 500, marginTop: 2 }}>{payFreq}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>Status</div>
                <div style={{ fontSize: 14, color: "var(--color-text-primary)", fontWeight: 500, marginTop: 2, textTransform: "capitalize" }}>{empStatus}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>Created</div>
                <div style={{ fontSize: 14, color: "var(--color-text-primary)", fontWeight: 500, marginTop: 2 }}>{createdDate}</div>
              </div>
            </div>

            {/* Per-stub rows */}
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 10 }}>
              Pay Periods &amp; Passwords
            </div>
            {payDates.map((pd, idx) => {
              const payPeriodStart = getPayPeriodStart(params, idx);
              const payPeriodEnd = moment(pd, "DD/MM/YYYY").format("MM/DD/YYYY");
              const actualPayDate = actualPayDates[idx]
                ? moment(actualPayDates[idx], "DD/MM/YYYY").format("MM/DD/YYYY")
                : "—";
              const password = computeStubPassword(employeeName, params.ssid, payPeriodStart);
              const isRevealed = revealedPasswords[idx];

              return (
                <div key={idx} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 14px", borderRadius: "var(--radius-md)",
                  background: idx % 2 === 0 ? "var(--color-bg)" : "transparent",
                  marginBottom: 4, flexWrap: "wrap", gap: 10,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 200 }}>
                    <FaCalendarAlt style={{ color: "var(--color-accent)", fontSize: 14, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)" }}>
                        Period: {payPeriodStart || "—"} &mdash; {payPeriodEnd}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginTop: 1 }}>
                        Pay Date: {actualPayDate}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <FaLock style={{ color: "var(--color-text-tertiary)", fontSize: 12 }} />
                    <span style={{
                      fontFamily: "monospace", fontSize: 13, fontWeight: 600,
                      color: isRevealed ? "#a78bfa" : "var(--color-text-tertiary)",
                      letterSpacing: isRevealed ? "0.5px" : "2px",
                      minWidth: 130,
                    }}>
                      {isRevealed ? password : "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"}
                    </span>
                    <button
                      onClick={() => this.togglePassword(idx)}
                      title={isRevealed ? "Hide password" : "Reveal password"}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: isRevealed ? "#a78bfa" : "var(--color-text-tertiary)",
                        padding: 4, display: "flex", alignItems: "center",
                        transition: "color 0.15s ease",
                      }}
                    >
                      {isRevealed ? <FaEyeSlash style={{ fontSize: 16 }} /> : <FaEye style={{ fontSize: 16 }} />}
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Password formula hint */}
            <div style={{
              marginTop: 12, padding: "10px 14px", borderRadius: "var(--radius-md)",
              background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.15)",
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#a78bfa", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 4 }}>
                Password Formula
              </div>
              <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
                LAST NAME (uppercase) + Last 4 of SSN + Pay Period Start Date (MMDDYYYY)
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
              <Link to={`/dashboard/paystub/${stub._id}`} className="btn btn-outline-primary" style={{ fontSize: 13, padding: "7px 16px" }}>
                <FaEye style={{ marginRight: 5 }} /> View Full Details
              </Link>
              <Link to={`/dashboard/paystub/${stub._id}`} className="btn btn-secondary" style={{ fontSize: 13, padding: "7px 16px" }}>
                <FaDownload style={{ marginRight: 5 }} /> Download PDFs
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }
}

class Paystub extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    this.handleGetPaystubs();
  }

  handleGetPaystubs = async () => {
    let url = process.env.REACT_APP_BACKEND_URL_LOCAL;
    if (process.env.REACT_APP_MODE === "live") {
      url = process.env.REACT_APP_FRONTEND_URL_LIVE;
    }
    const token = localStorage.getItem("tokens");
    try {
      const response = await axios.get(`${url}api/auth/get-paystubs`, {
        headers: { Authorization: `bearer ${token}` },
      });
      this.props.getPaystubData(response.data);
    } catch (e) {
      console.log(e);
    }
    this.setState({ loading: false });
  };

  render() {
    const { paystubData } = this.props;
    const stubs = paystubData ?? [];
    const totalPeriods = stubs.reduce((sum, s) => sum + ((s.params?.pay_dates || []).length), 0);

    return (
      <DashboardLayout>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 className="dash-page-title">My Paystubs</h1>
            <p className="dash-page-subtitle">
              {stubs.length} paystub group{stubs.length !== 1 ? "s" : ""} &middot; {totalPeriods} total pay period{totalPeriods !== 1 ? "s" : ""}
            </p>
          </div>
          <Link to="/paystubs" className="btn btn-secondary" style={{ flexShrink: 0 }}>
            + New Paystub
          </Link>
        </div>

        {this.state.loading ? (
          <div style={{ textAlign: "center", padding: 60 }}>
            <Spinner animation="border" variant="primary" />
          </div>
        ) : stubs.length === 0 ? (
          <div className="dash-section-card" style={{ textAlign: "center", padding: "60px 20px" }}>
            <FaFileAlt style={{ fontSize: 48, color: "var(--color-text-tertiary)", marginBottom: 16 }} />
            <h4 style={{ color: "var(--color-text-secondary)", marginBottom: 8 }}>No paystubs yet</h4>
            <p style={{ color: "var(--color-text-tertiary)", marginBottom: 20 }}>
              Create your first paystub to see it here
            </p>
            <Link to="/paystubs" className="btn btn-secondary">
              Create Paystub
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
            {stubs.map((stub, index) => (
              <PaystubGroup key={stub._id || index} stub={stub} />
            ))}
          </div>
        )}
      </DashboardLayout>
    );
  }
}

const mapStateToProps = (state) => ({
  paystubData: state?.paystubData,
});

export default connect(mapStateToProps, {
  getPaystubData: actionCreater.getPaystubData,
})(Paystub);
