import React, { Component } from "react";
import { axios } from "../../../HelperFunctions/axios";
import { Spinner } from "react-bootstrap";
import {
  FaTimes,
  FaBuilding,
  FaUser,
  FaCalendarAlt,
  FaArrowRight,
  FaPlus,
  FaBriefcase,
  FaClock,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import moment from "moment";

class YTDContinueModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      profiles: [],
      error: null,
      expandedProfile: null,
    };
  }

  componentDidMount() {
    this.fetchProfiles();
    document.body.style.overflow = "hidden";
  }

  componentWillUnmount() {
    document.body.style.overflow = "";
  }

  fetchProfiles = async () => {
    try {
      let url = process.env.REACT_APP_BACKEND_URL_LOCAL;
      if (process.env.REACT_APP_MODE === "live") {
        url = process.env.REACT_APP_FRONTEND_URL_LIVE;
      }
      const token = localStorage.getItem("tokens");
      const response = await axios.get(`${url}api/paystub/ytd-profiles`, {
        headers: { Authorization: `bearer ${token}` },
      });
      this.setState({
        profiles: response.data.profiles || [],
        loading: false,
      });
    } catch (e) {
      console.error("[YTD Modal] fetch error:", e);
      const msg = e.response
        ? `Server error ${e.response.status}: ${e.response.data?.error || e.response.statusText}`
        : e.message || "Network error";
      this.setState({ error: msg, loading: false });
    }
  };

  handleContinueFrom = (profile) => {
    // Keys match HTML input name attributes in Step1/Step2/Step3 components
    const prefill = {
      step1: {
        company_name: profile.company_name,
        company_address: profile.company_address,
        company_address_2: profile.company_address_2,
        company_city: profile.company_city,
        company_state: profile.company_state,
        companyZipCode: profile.companyZipCode,
        company_phone: profile.company_phone,
        company_ein: profile.company_ein,
        company_website: profile.company_website || "",
        emailAddress: profile.emailAddress,
        bankNumber: profile.bankNumber,
        routingNumber: profile.routingNumber,
        manager: profile.manager,
        bank_name: profile.bank_name,
        bank_street_address: profile.bank_street_address,
        bank_city: profile.bank_city,
        bank_state: profile.bank_state,
        bank_zip: profile.bank_zip,
      },
      step2: {
        employee_name: profile.employee_name,
        ssid: profile.ssid || "XXX-XX-",
        employee_address: profile.employee_address,
        employee_address_2: profile.employee_address_2 || "",
        employee_city: profile.employee_city || "",
        employee_state: profile.employee_state,
        employeeZipCode: profile.employeeZipCode,
        employee_Id: profile.employee_Id,
        maritial_status: profile.maritial_status,
        noOfDependants: profile.noOfDependants,
        blindExemptions: profile.blindExemptions,
        employment_status: profile.employment_status,
      },
      step3: {
        annualSalary: profile.annual_salary || "",
        hourly_rate: profile.hourly_rate || "",
        startDate: profile.nextStartDate || "",
        employeeHireDate: profile.hire_date || "",
        payDates: [new Date()],
        actual_pay_dates: [],
        checkNumbers: [""],
        additions: [],
        deductions: [],
        otherBenefits: [],
        company_notes: "",
        sign: "",
      },
      meta: {
        profileKey: profile.profileKey,
        totalPriorPeriods: profile.totalPeriods,
        lastPayDate: profile.lastPayDate,
        nextStartDate: profile.nextStartDate,
        pay_frequency: profile.pay_frequency,
        employment_status: profile.employment_status,
      },
    };

    localStorage.setItem("ytd_prefill", JSON.stringify(prefill));
    this.props.onContinue();
  };

  handleStartFresh = () => {
    localStorage.removeItem("ytd_prefill");
    this.props.onStartFresh();
  };

  handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      this.props.onClose();
    }
  };

  toggleProfileExpand = (key) => {
    this.setState((s) => ({
      expandedProfile: s.expandedProfile === key ? null : key,
    }));
  };

  formatPayFreq = (freq) => {
    const map = {
      Weekly: "Weekly",
      "Bi-Weekly": "Bi-Weekly",
      Monthly: "Monthly",
      "Semi-Anually": "Semi-Annually",
      Annually: "Annually",
      Daily: "Daily",
      Quaterly: "Quarterly",
      onetime: "One-Time",
    };
    return map[freq] || freq || "—";
  };

  render() {
    const { loading, profiles, error, expandedProfile } = this.state;

    return (
      <div className="ytd-modal-overlay" onClick={this.handleOverlayClick}>
        <div className="ytd-modal-container">
          {/* Header */}
          <div className="ytd-modal-header">
            <div>
              <h2 className="ytd-modal-title">Create New Paystub</h2>
              <p className="ytd-modal-subtitle">
                Continue from a previous paystub or start fresh
              </p>
            </div>
            <button
              className="ytd-modal-close"
              onClick={this.props.onClose}
              aria-label="Close modal"
            >
              <FaTimes />
            </button>
          </div>

          {/* Body */}
          <div className="ytd-modal-body">
            {loading ? (
              <div className="ytd-modal-loading">
                <Spinner animation="border" variant="primary" />
                <p>Loading your paystub history...</p>
              </div>
            ) : error ? (
              <div className="ytd-modal-error">
                <p>{error}</p>
                <button className="btn btn-outline-primary" onClick={this.fetchProfiles}>
                  Retry
                </button>
              </div>
            ) : (
              <>
                {/* Start Fresh Card */}
                <div
                  className="ytd-profile-card ytd-start-fresh"
                  onClick={this.handleStartFresh}
                >
                  <div className="ytd-profile-card-icon ytd-fresh-icon">
                    <FaPlus />
                  </div>
                  <div className="ytd-profile-card-info">
                    <strong>Start Fresh</strong>
                    <span>New company, new employee, blank form</span>
                  </div>
                  <FaArrowRight className="ytd-profile-card-arrow" />
                </div>

                {/* Existing Profiles */}
                {profiles.length > 0 && (
                  <>
                    <div className="ytd-section-label">
                      <FaClock style={{ marginRight: 6 }} />
                      Continue from a previous paystub
                    </div>
                    {profiles.map((profile) => {
                      const isExpanded = expandedProfile === profile.profileKey;
                      const lastDateFormatted = profile.lastPayDate
                        ? moment(profile.lastPayDate, "DD/MM/YYYY").format("MMM D, YYYY")
                        : "—";
                      const nextDateFormatted = profile.nextStartDate || "—";

                      return (
                        <div
                          key={profile.profileKey}
                          className={`ytd-profile-card ytd-continue-card ${isExpanded ? "expanded" : ""}`}
                        >
                          <div
                            className="ytd-profile-card-main"
                            onClick={() => this.toggleProfileExpand(profile.profileKey)}
                          >
                            <div className="ytd-profile-card-icon">
                              <FaBuilding />
                            </div>
                            <div className="ytd-profile-card-info">
                              <strong>{profile.company_name || "—"}</strong>
                              <span>
                                <FaUser style={{ fontSize: 10, marginRight: 4 }} />
                                {profile.employee_name || "—"}
                              </span>
                            </div>
                            <div className="ytd-profile-card-meta">
                              <div className="ytd-badge">
                                {profile.totalPeriods} period{profile.totalPeriods !== 1 ? "s" : ""}
                              </div>
                              <div className="ytd-badge ytd-badge-freq">
                                {this.formatPayFreq(profile.pay_frequency)}
                              </div>
                              {isExpanded ? (
                                <FaChevronUp style={{ color: "var(--color-text-tertiary)", fontSize: 12 }} />
                              ) : (
                                <FaChevronDown style={{ color: "var(--color-text-tertiary)", fontSize: 12 }} />
                              )}
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="ytd-profile-expanded">
                              <div className="ytd-detail-grid">
                                <div className="ytd-detail-item">
                                  <label>Employment Type</label>
                                  <span>{profile.employment_status || "—"}</span>
                                </div>
                                <div className="ytd-detail-item">
                                  <label>
                                    {profile.employment_status === "Hourly" ? "Hourly Rate" : "Annual Salary"}
                                  </label>
                                  <span>
                                    {profile.employment_status === "Hourly"
                                      ? `$${profile.hourly_rate || "—"}/hr`
                                      : `$${profile.annual_salary || "—"}`}
                                  </span>
                                </div>
                                <div className="ytd-detail-item">
                                  <label>Last Pay Period End</label>
                                  <span>{lastDateFormatted}</span>
                                </div>
                                <div className="ytd-detail-item">
                                  <label>Next Start Date</label>
                                  <span className="ytd-next-date">{nextDateFormatted}</span>
                                </div>
                                <div className="ytd-detail-item">
                                  <label>Batches Created</label>
                                  <span>{profile.batchCount}</span>
                                </div>
                                <div className="ytd-detail-item">
                                  <label>State</label>
                                  <span>{profile.employee_state || "—"}</span>
                                </div>
                              </div>

                              {/* Timeline of pay dates */}
                              {profile.payDates && profile.payDates.length > 0 && (
                                <div className="ytd-timeline">
                                  <label className="ytd-timeline-label">Pay Period Timeline</label>
                                  <div className="ytd-timeline-track">
                                    {profile.payDates.slice(-8).map((pd, idx) => (
                                      <div key={idx} className="ytd-timeline-dot">
                                        <div className="ytd-dot" />
                                        <span>{pd.date}</span>
                                      </div>
                                    ))}
                                    {profile.payDates.length > 8 && (
                                      <div className="ytd-timeline-more">
                                        +{profile.payDates.length - 8} more
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              <button
                                className="ytd-continue-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  this.handleContinueFrom(profile);
                                }}
                              >
                                <FaBriefcase style={{ marginRight: 8 }} />
                                Continue from {lastDateFormatted}
                                <FaArrowRight style={{ marginLeft: 8 }} />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </>
                )}

                {profiles.length === 0 && (
                  <div className="ytd-empty-hint">
                    <FaCalendarAlt style={{ fontSize: 24, marginBottom: 8, opacity: 0.4 }} />
                    <p>No previous paystubs found. Start fresh to create your first one!</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default YTDContinueModal;
