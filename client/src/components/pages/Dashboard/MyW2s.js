import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FaFileAlt, FaDownload, FaBuilding, FaCalendarAlt } from "react-icons/fa";
import { axios } from "../../../HelperFunctions/axios";
import DashboardLayout from "./layout/DashboardLayout";
import { Spinner } from "react-bootstrap";
import moment from "moment";

class MyW2s extends Component {
  state = { records: [], loading: true };

  componentDidMount() {
    this.fetchW2s();
  }

  fetchW2s = async () => {
    try {
      let url = process.env.REACT_APP_BACKEND_URL_LOCAL;
      if (process.env.REACT_APP_MODE === "live") {
        url = process.env.REACT_APP_FRONTEND_URL_LIVE;
      }
      const token = localStorage.getItem("tokens");
      const { data } = await axios.get(`${url}api/w2-wizard/my-w2s`, {
        headers: { Authorization: `bearer ${token}` },
      });
      this.setState({ records: Array.isArray(data) ? data : [], loading: false });
    } catch (e) {
      console.error("[MyW2s] fetch error:", e);
      this.setState({ loading: false });
    }
  };

  handleDownload = (zipFile) => {
    const base =
      process.env.REACT_APP_MODE === "development" || process.env.REACT_APP_MODE === "developement"
        ? "http://localhost:5000/"
        : "https://www.drpaystub.net/";
    const cleanPath = (zipFile || "").replace(/^public\//, "");
    window.open(base + cleanPath);
  };

  maskSSN = (ssn) => {
    if (!ssn || ssn.length < 4) return "***-**-****";
    return "***-**-" + ssn.replace(/\D/g, "").slice(-4);
  };

  render() {
    const { records, loading } = this.state;

    return (
      <DashboardLayout>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 className="dash-page-title">My W-2 Forms</h1>
            <p className="dash-page-subtitle">
              {records.length} W-2{records.length !== 1 ? "s" : ""} generated
            </p>
          </div>
          <Link to="/w2-wizard" className="btn btn-secondary" style={{ flexShrink: 0 }}>
            + New W-2
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 60 }}>
            <Spinner animation="border" variant="primary" />
          </div>
        ) : records.length === 0 ? (
          <div className="dash-section-card" style={{ textAlign: "center", padding: "60px 20px" }}>
            <FaFileAlt style={{ fontSize: 48, color: "var(--color-text-tertiary)", marginBottom: 16 }} />
            <h4 style={{ color: "var(--color-text-secondary)", marginBottom: 8 }}>No W-2 forms yet</h4>
            <p style={{ color: "var(--color-text-tertiary)", marginBottom: 20 }}>
              Generate your first W-2 to see it here
            </p>
            <Link to="/w2-wizard" className="btn btn-secondary">
              Create W-2
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
            {records.map((rec, idx) => (
              <div
                key={rec._id || idx}
                style={{
                  background: "var(--color-bg-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-xl)",
                  padding: "20px 22px",
                  transition: "box-shadow 0.2s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                  {/* Left side — info */}
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
                        {rec.employerName || "—"}
                      </strong>
                      <span style={{ fontSize: 13, color: "var(--color-text-tertiary)" }}>
                        {rec.employeeFirstName} {rec.employeeLastName} &middot; SSN {this.maskSSN(rec.employeeSSN)}
                      </span>
                    </div>
                  </div>

                  {/* Right side — badges + download */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0, flexWrap: "wrap" }}>
                    {rec.taxYear && (
                      <span style={{
                        fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 980,
                        background: "var(--gradient-brand-subtle)", color: "var(--color-accent)",
                        display: "inline-flex", alignItems: "center", gap: 4,
                      }}>
                        <FaCalendarAlt style={{ fontSize: 10 }} /> {rec.taxYear}
                      </span>
                    )}
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 980,
                      background: "rgba(16,185,129,0.12)", color: "#10b981",
                    }}>PAID</span>
                    <button
                      onClick={() => this.handleDownload(rec.zipFile)}
                      style={{
                        background: "var(--gradient-brand)", border: "none", borderRadius: "var(--radius-md)",
                        color: "#fff", fontSize: 13, fontWeight: 600, padding: "8px 16px",
                        cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
                        transition: "transform 0.15s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                    >
                      <FaDownload style={{ fontSize: 12 }} /> Download
                    </button>
                  </div>
                </div>

                {/* Detail row */}
                <div style={{
                  display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                  gap: 14, marginTop: 14, paddingTop: 14,
                  borderTop: "1px solid var(--color-border)",
                }}>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>EIN</div>
                    <div style={{ fontSize: 14, color: "var(--color-text-primary)", fontWeight: 500, marginTop: 2 }}>{rec.employerEIN || "—"}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>Wages (Box 1)</div>
                    <div style={{ fontSize: 14, color: "var(--color-text-primary)", fontWeight: 500, marginTop: 2 }}>{rec.box1 ? `$${rec.box1}` : "—"}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>Fed Tax (Box 2)</div>
                    <div style={{ fontSize: 14, color: "var(--color-text-primary)", fontWeight: 500, marginTop: 2 }}>{rec.box2 ? `$${rec.box2}` : "—"}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>Created</div>
                    <div style={{ fontSize: 14, color: "var(--color-text-primary)", fontWeight: 500, marginTop: 2 }}>{rec.createdAt ? moment(rec.createdAt).format("MMM D, YYYY") : "—"}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DashboardLayout>
    );
  }
}

export default MyW2s;
