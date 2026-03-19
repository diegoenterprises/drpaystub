import React, { Component } from "react";
import { Slide } from "react-reveal";
import { Link } from "react-router-dom";
import ReactRotatingText from "react-rotating-text";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import AC from "../../../redux/actions/actionCreater";
import actionCreater from "../../../redux/actions/actionCreater";

import { withRouter } from "react-router";

export class Hero extends Component {
  render() {
    const { userData } = this.props;
    const isLoggedIn = !!localStorage.getItem("tokens");

    return (
      <div className="container hero pt-5">
        <div className="hero-content text-center mt-5">
          <div className="title-heading">
            <h4 className="heading my-3">
              Professional Payroll,
              <br />
              In Minutes
            </h4>
            <p className="para-desc text-muted mx-auto">
              <Slide right>
                <ReactRotatingText
                  items={[
                    "Accurate federal & state tax calculations",
                    "21 professional templates to choose from",
                    "Fill, submit, download and print instantly",
                  ]}
                />
              </Slide>
            </p>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-number">50+</span>
              <span className="hero-stat-label">States Supported</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat">
              <span className="hero-stat-number">21</span>
              <span className="hero-stat-label">Templates</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat">
              <span className="hero-stat-number">2026</span>
              <span className="hero-stat-label">Tax Rates</span>
            </div>
          </div>

          <div className="hero-actions mt-4 pt-2">
            <Link
              to={isLoggedIn ? "/paystubs" : "/paystubs"}
              className="btn btn-secondary hero-cta-primary m-1"
              onClick={() => {
                if (!isLoggedIn) {
                  localStorage.setItem("clickStartAstrosync", true);
                }
              }}
            >
              Start Saurellius <i className="fa fa-arrow-right"></i>
            </Link>
            <Link to="/templates" className="btn hero-cta-secondary m-1">
              Explore Templates <i className="fa fa-chevron-right"></i>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userData: state?.userData,
});

export default connect(mapStateToProps, {
  getUserDataSuccess: actionCreater.getUserDataSuccess,
})(withRouter(Hero));
