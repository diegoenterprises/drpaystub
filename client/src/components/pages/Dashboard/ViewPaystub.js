import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaDownload } from "react-icons/fa";
import { axios } from "../../../HelperFunctions/axios";
import DashboardLayout from "./layout/DashboardLayout";
import actionCreater from "../../../redux/actions/actionCreater";
import { connect } from "react-redux";
import "../Dashboard/layout/styles.css";
import moment from "moment";
import { Spinner } from "react-bootstrap";

const DetailField = ({ label, value }) => (
  <div className="col-12 col-md-3 mb-4">
    <p style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-tertiary)", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.04em" }}>
      {label}
    </p>
    <p style={{ fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)", margin: 0 }}>
      {value || "—"}
    </p>
  </div>
);

class ViewPaystub extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        company_name: "", company_address: "", company_address_2: "", company_city: "",
        company_state: "", companyZipCode: "", company_phone: "", company_ein: "",
        emailAddress: "", employment_status: "", employee_name: "", employee_address: "",
        employee_address_2: "", employee_city: "", employee_state: "", employeeZipCode: "",
        employee_Id: "", maritial_status: "", noOfDependants: "", blindExemptions: "",
        ssid: "", hourly_rate: "", pay_frequency: "", hours_worked_per_payPeriod: "",
        check_number: "", startDate: "", pay_dates: [], actual_pay_dates: [],
        hire_date: "", template: "", EmployeeHiredIn2021: false, additions: [],
        deductions: [], check_numbers: [], hours_worked: [],
      },
      createdAt: "",
      isLoading: false,
      downloading: false,
    };
  }

  formatAndJoinDates = (dates) => {
    return dates.map((date) => moment(date, "DD-MM-YYYY").format("DD-MMM-YYYY")).join(", ");
  };

  componentDidMount() {
    this.handleGetSinglePaystub();
  }

  handleGetSinglePaystub = async () => {
    this.setState({ isLoading: true });
    let url = process.env.REACT_APP_BACKEND_URL_LOCAL;
    if (process.env.REACT_APP_MODE === "live") url = process.env.REACT_APP_FRONTEND_URL_LIVE;
    const paystubId = this.props.match.params.id;
    try {
      const response = await axios.get(`${url}api/auth/get-paystub/${paystubId}`);
      this.setState({
        data: response.data.params,
        createdAt: moment(response.data.createdAt).format("DD-MMM-YYYY"),
      });
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  downloadZip = async () => {
    this.setState({ downloading: true });
    try {
      let url = process.env.REACT_APP_BACKEND_URL_LOCAL;
      if (process.env.REACT_APP_MODE === "live") url = process.env.REACT_APP_FRONTEND_URL_LIVE;
      const { data } = await axios.post(`${url}api/paystub/getZip`, {
        paystubId: this.props.match.params.id,
        template: this.state.data.template,
      });
      const [_, ziplink] = data.zipSrc.split("/");
      let link = process.env.REACT_APP_MODE === "developement"
        ? process.env.REACT_APP_BACKEND_URL_LOCAL
        : "https://www.drpaystub.net/";
      window.open(link + ziplink);
    } catch (e) {
      console.log(e);
    }
    this.setState({ downloading: false });
  };

  render() {
    const d = this.state.data;

    if (this.state.isLoading) {
      return (
        <DashboardLayout>
          <div style={{ textAlign: "center", padding: 80 }}>
            <Spinner animation="border" variant="primary" />
          </div>
        </DashboardLayout>
      );
    }

    return (
      <DashboardLayout>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, flexWrap: "wrap", gap: 12 }}>
          <div>
            <Link to="/dashboard/paystub" style={{ fontSize: 13, color: "var(--color-accent)", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <FaArrowLeft /> Back to Paystubs
            </Link>
            <h1 className="dash-page-title">{d.company_name || "Paystub Details"}</h1>
            <p className="dash-page-subtitle">Created {this.state.createdAt}</p>
          </div>
          {this.state.downloading ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <button onClick={() => this.downloadZip()} className="btn btn-secondary" style={{ flexShrink: 0 }}>
              <FaDownload style={{ marginRight: 6 }} /> Download
            </button>
          )}
        </div>

        {/* Company Details */}
        <div className="dash-section-card">
          <h4>Company Details</h4>
          <div className="row">
            <DetailField label="Name" value={d.company_name} />
            <DetailField label="Address" value={d.company_address} />
            <DetailField label="Address 2" value={d.company_address_2} />
            <DetailField label="City" value={d.company_city} />
            <DetailField label="State" value={d.company_state} />
            <DetailField label="Zip Code" value={d.companyZipCode} />
            <DetailField label="EIN" value={d.company_ein} />
            <DetailField label="Email" value={d.emailAddress} />
            <DetailField label="Pay Dates" value={this.formatAndJoinDates(d.pay_dates || [])} />
            <DetailField label="Start Date" value={d.startDate ? moment(d.startDate, "MM-DD-YYYY").format("DD-MMM-YYYY") : ""} />
            <DetailField label="Created" value={this.state.createdAt} />
          </div>
        </div>

        {/* Employee Details */}
        <div className="dash-section-card">
          <h4>Employee Details</h4>
          <div className="row">
            <DetailField label="Name" value={d.employee_name} />
            <DetailField label="Address" value={d.employee_address} />
            <DetailField label="Address 2" value={d.employee_address_2} />
            <DetailField label="City" value={d.employee_city} />
            <DetailField label="State" value={d.employee_state} />
            <DetailField label="Zip Code" value={d.employeeZipCode} />
            <DetailField label="Status" value={d.employment_status} />
            <DetailField label="Marital Status" value={d.maritial_status} />
            <DetailField label="Hire Date" value={d.hire_date} />
            <DetailField label="Dependants" value={d.noOfDependants} />
            <DetailField label="SSID" value={d.ssid} />
            <DetailField label="Annual Salary" value={d.annual_salary} />
            <DetailField label="Pay Frequency" value={d.pay_frequency} />
            <DetailField label="Check Number" value={d.check_number} />
          </div>
        </div>

        {/* Bank Details */}
        <div className="dash-section-card">
          <h4>Bank Details</h4>
          <div className="row">
            <DetailField label="Bank Name" value={d.bank_name} />
            <DetailField label="Street Address" value={d.bank_street_address} />
            <DetailField label="City" value={d.bank_city} />
            <DetailField label="State" value={d.bank_state} />
            <DetailField label="Zip Code" value={d.bank_zip} />
            <DetailField label="Manager" value={d.manager} />
          </div>
        </div>
      </DashboardLayout>
    );
  }
}

const mapStateToProps = (state) => ({
  paystubData: state?.paystubData,
});

export default connect(mapStateToProps, {
  getPaystubData: actionCreater.getPaystubData,
})(ViewPaystub);
