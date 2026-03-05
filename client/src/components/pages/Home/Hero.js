import React, { Component } from "react";
import { Zoom, Slide } from "react-reveal";
import { Link } from "react-router-dom";
import ReactRotatingText from "react-rotating-text";
import $ from "jquery";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setHomePageData } from "../../../actions/home";
import { Col, Row } from "react-bootstrap";
import AC from "../../../redux/actions/actionCreater";

import { withRouter } from "react-router";

export class Hero extends Component {
  state = {
    us_states: [
      {
        name: "ALABAMA",
        abbreviation: "AL",
      },
      {
        name: "ALASKA",
        abbreviation: "AK",
      },
      {
        name: "ARIZONA",
        abbreviation: "AZ",
      },
      {
        name: "ARKANSAS",
        abbreviation: "AR",
      },
      {
        name: "CALIFORNIA",
        abbreviation: "CA",
      },
      {
        name: "COLORADO",
        abbreviation: "CO",
      },
      {
        name: "CONNECTICUT",
        abbreviation: "CT",
      },
      {
        name: "District of Columbia",
        abbreviation: "DC",
      },
      {
        name: "DELAWARE",
        abbreviation: "DE",
      },
      {
        name: "FLORIDA",
        abbreviation: "FL",
      },
      {
        name: "GEORGIA",
        abbreviation: "GA",
      },
      {
        name: "HAWAII",
        abbreviation: "HI",
      },
      {
        name: "IDAHO",
        abbreviation: "ID",
      },
      {
        name: "ILLINOIS",
        abbreviation: "IL",
      },
      {
        name: "INDIANA",
        abbreviation: "IN",
      },
      {
        name: "IOWA",
        abbreviation: "IA",
      },
      {
        name: "KANSAS",
        abbreviation: "KS",
      },
      {
        name: "KENTUCKY",
        abbreviation: "KY",
      },
      {
        name: "LOUISIANA",
        abbreviation: "LA",
      },
      {
        name: "MAINE",
        abbreviation: "ME",
      },
      {
        name: "MARYLAND",
        abbreviation: "MD",
      },
      {
        name: "MASSACHUSETTS",
        abbreviation: "MA",
      },
      {
        name: "MICHIGAN",
        abbreviation: "MI",
      },
      {
        name: "MINNESOTA",
        abbreviation: "MN",
      },
      {
        name: "MISSISSIPPI",
        abbreviation: "MS",
      },
      {
        name: "MISSOURI",
        abbreviation: "MO",
      },
      {
        name: "MONTANA",
        abbreviation: "MT",
      },
      {
        name: "NEBRASKA",
        abbreviation: "NE",
      },
      {
        name: "NEVADA",
        abbreviation: "NV",
      },
      {
        name: "NEW HAMPSHIRE",
        abbreviation: "NH",
      },
      {
        name: "NEW JERSEY",
        abbreviation: "NJ",
      },
      {
        name: "NEW MEXICO",
        abbreviation: "NM",
      },
      {
        name: "NEW YORK",
        abbreviation: "NY",
      },
      {
        name: "NORTH CAROLINA",
        abbreviation: "NC",
      },
      {
        name: "NORTH DAKOTA",
        abbreviation: "ND",
      },
      {
        name: "OHIO",
        abbreviation: "OH",
      },
      {
        name: "OKLAHOMA",
        abbreviation: "OK",
      },
      {
        name: "OREGON",
        abbreviation: "OR",
      },
      {
        name: "PENNSYLVANIA",
        abbreviation: "PA",
      },
      {
        name: "RHODE ISLAND",
        abbreviation: "RI",
      },
      {
        name: "SOUTH CAROLINA",
        abbreviation: "SC",
      },
      {
        name: "SOUTH DAKOTA",
        abbreviation: "SD",
      },
      {
        name: "TENNESSEE",
        abbreviation: "TN",
      },
      {
        name: "TEXAS",
        abbreviation: "TX",
      },
      {
        name: "UTAH",
        abbreviation: "UT",
      },
      {
        name: "VERMONT",
        abbreviation: "VT",
      },
      {
        name: "VIRGINIA",
        abbreviation: "VA",
      },
      {
        name: "WASHINGTON",
        abbreviation: "WA",
      },
      {
        name: "WEST VIRGINIA",
        abbreviation: "WV",
      },
      {
        name: "WISCONSIN",
        abbreviation: "WI",
      },
      {
        name: "WYOMING",
        abbreviation: "WY",
      },
    ],
    termsAccepted: false,
  };
  handleTermsChange = (e) => {
    this.setState({ termsAccepted: e.target.checked });
  };
  handleChangeState = (e) => {
    this.props.selectedState(e.target.value);
  };
  handleChangePaid = (e) => {
    this.props.selectedPayment(e.target.value);
  };
  handleChangeStatus = (e) => {
    this.props.selectedEmployementStatus(e.target.value);
  };
  componentDidMount() {
    $('[data-toggle="tooltip"]').tooltip();
  }

  getAllStates = () => {
    let us_state_options;
    if (this.state.us_states && this.state.us_states.length > 0) {
      us_state_options = this.state.us_states.map((us_state) => {
        return (
          <option value={us_state.name}>
            {us_state.name.substring(0, 1).toUpperCase() +
              us_state.name.substring(1).toLowerCase()}
          </option>
        );
      });
    }
    return us_state_options;
  };
  onSubmitForm = (e) => {
    e.preventDefault();
    if (!this.state.termsAccepted) {
      alert("You must accept the Terms and Conditions before continuing.");
      return;
    }
    this.props.history.push("/paystubs");
  };
  render() {
    // console.log(this.props.state);
    // console.log(this.props.paid);

    // console.log(this.props.employementStatus);

    return (
      <div className="container hero pt-5">
        <div className="align-items-center mt-5 row">
          <div className="col-md-6 col-lg-7">
            <div className="title-heading">
              <h4 className="heading my-3">
                Experience, <br />
                Saurellius Payroll Tax Assistant
              </h4>
              <p className="para-desc text-muted">
                <Slide right>
                  {/* Fill, submit, download and print instantly. No software
                  needed! */}
                  <ReactRotatingText
                    items={[
                      "Fastest pay stub generator",
                      "Fill, Submit, Download, and Print",
                      "No Software Needed",
                    ]}
                  />
                </Slide>
              </p>
              <div className="mt-4 pt-2">
                <Link to="/templates" className="btn btn-secondary m-1">
                  Explore Stub templates{" "}
                  <i className="fa fa-chevron-right"></i>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-2 mt-sm-0 pt-sm-0 col-md-6 col-lg-5">
            <div className="shadow rounded border-0 ml-lg-4 card">
              <div className="card-body">
                <h5 className="card-title text-center">Get your stub, Now!</h5>
                <form onSubmit={this.onSubmitForm} className="login-form mt-4">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label className="">
                          How are you paid?
                          <span
                            data-toggle="tooltip"
                            data-placement="right"
                            title={`Select "Salaried" if you earn a fixed salary over a specific time period. Select "Hourly" if you get paid based on the hours worked.`}
                            className="help-icon align-self-end"
                          >
                            ?
                          </span>
                        </label>

                        <div className="position-relative">
                          <div className="form-check-inline">
                            <label className="form-check-label">
                              <input
                                type="radio"
                                className="form-check-input form-radio pl-5"
                                name="paidType"
                                value="Salary"
                                onChange={this.handleChangePaid}
                                required
                              />
                              Salaried
                            </label>
                          </div>
                          <div className="form-check-inline">
                            <label className="form-check-label">
                              <input
                                type="radio"
                                className="form-check-input form-radio pl-5"
                                name="paidType"
                                value="Hourly"
                                onChange={this.handleChangePaid}
                                required
                              />
                              Hourly
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label className="">
                          Employment status
                          <span
                            data-toggle="tooltip"
                            data-placement="right"
                            title={`Select "Employee" if you work within a business and the company covers your taxes. Select "Contractor" if you work independently and you are responsible of paying your taxes.`}
                            className="help-icon align-self-end"
                          >
                            ?
                          </span>
                        </label>
                        <div className="position-relative">
                          <div className="form-check-inline">
                            <label className="form-check-label">
                              <input
                                type="radio"
                                className="form-check-input form-radio pl-5"
                                name="employmentStatus"
                                value="Employee"
                                required
                                onChange={this.handleChangeStatus}
                              />
                              Employee
                            </label>
                          </div>
                          <div className="form-check-inline">
                            <label className="form-check-label">
                              <input
                                type="radio"
                                className="form-check-input form-radio pl-5"
                                name="employmentStatus"
                                value="Contractor"
                                required
                                onChange={this.handleChangeStatus}
                              />
                              Contractor
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div class="form-group">
                        <label htmlFor="selectedState">
                          Select your state{" "}
                        </label>
                        <select
                          placeholder="State"
                          autocomplete="off"
                          className="form-control"
                          id="selectedState"
                          name="selectedState"
                          value={this.props.state}
                          required
                          onChange={this.handleChangeState}
                        >
                          <option value="">Select State</option>
                          {this.getAllStates()}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <label className="terms-checkbox-label">
                        <input
                          type="checkbox"
                          checked={this.state.termsAccepted}
                          onChange={this.handleTermsChange}
                        />
                        <span>
                          I Accept the{" "}
                          <Link to="/terms-and-conditions">
                            Terms &amp; Conditions
                          </Link>
                        </span>
                      </label>
                    </div>
                    {localStorage.getItem("tokens") ? (
                      <div className="col-md-12">
                        <button
                          type="submit"
                          className="btn btn-block btn-secondary"
                          disabled={!this.state.termsAccepted}
                          style={{
                            opacity: this.state.termsAccepted ? 1 : 0.5,
                            cursor: this.state.termsAccepted ? 'pointer' : 'not-allowed',
                            pointerEvents: this.state.termsAccepted ? 'auto' : 'none',
                          }}
                        >
                          Start Saurellius{" "}
                          <i className="fa fa-chevron-right"></i>
                        </button>
                      </div>
                    ) : (
                      <div className="col-md-12">
                        <Link to="/login">
                          <button
                            type="button"
                            disabled={!this.state.termsAccepted}
                            onClick={() =>
                              this.state.termsAccepted &&
                              localStorage.setItem("clickStartAstrosync", true)
                            }
                            className="btn btn-block btn-secondary"
                            style={{
                              opacity: this.state.termsAccepted ? 1 : 0.5,
                              cursor: this.state.termsAccepted ? 'pointer' : 'not-allowed',
                              pointerEvents: this.state.termsAccepted ? 'auto' : 'none',
                            }}
                          >
                            Start Saurellius{" "}
                            <i className="fa fa-chevron-right"></i>
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// const mapStateToProps = state => state;

export default connect((state) => state, {
  selectedState: AC.state,
  selectedPayment: AC.paid,
  selectedEmployementStatus: AC.employementStatus,
})(withRouter(Hero));
