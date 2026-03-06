import React, { Component } from "react";
import { Link } from "react-router-dom";

export class Introduction extends Component {
  render() {
    return (
      <div className="introduction">
        <div className="container">
          <div className="intro-header">
            <span className="intro-badge">The platform</span>
            <h2 className="intro-title">
              Payroll documentation,<br />simplified.
            </h2>
            <p className="intro-subtitle">
              Saurellius replaces manual calculations and spreadsheets with
              a precise, professional pay stub generator — no subscriptions,
              no software downloads, no hidden fees.
            </p>
          </div>

          <div className="intro-grid">
            <div className="intro-card">
              <div className="intro-card-icon">
                <i className="fa fa-bolt"></i>
              </div>
              <h3 className="intro-card-title">Instant generation</h3>
              <p className="intro-card-text">
                Enter your details and download professional pay stubs in minutes.
                Accurate federal and state tax calculations built in.
              </p>
            </div>

            <div className="intro-card">
              <div className="intro-card-icon">
                <i className="fa fa-shield"></i>
              </div>
              <h3 className="intro-card-title">Bank-grade accuracy</h3>
              <p className="intro-card-text">
                Every deduction, withholding, and net pay figure is calculated
                with precision approved by professional accountants.
              </p>
            </div>

            <div className="intro-card">
              <div className="intro-card-icon">
                <i className="fa fa-cube"></i>
              </div>
              <h3 className="intro-card-title">Effortless simplicity</h3>
              <p className="intro-card-text">
                Generate professional paystubs in minutes. Our streamlined
                workflow handles the math so you can focus on your business.
              </p>
            </div>
          </div>

          <div className="intro-cta">
            <Link to="/about" className="btn btn-secondary">
              Learn more <i className="fa fa-arrow-right" style={{ marginLeft: '8px', fontSize: '13px' }}></i>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Introduction;
