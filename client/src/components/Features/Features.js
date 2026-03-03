import React, { Component } from "react";
import "./Features.scss";

export class Features extends Component {
  render() {
    return (
      <div className="features">
        <div className="container">
          <div className="feat-header">
            <span className="feat-badge">Why Saurellius</span>
            <h2 className="feat-title">Built different.</h2>
          </div>

          <div className="feat-grid">
            <div className="feat-card">
              <div className="feat-icon">
                <i className="fa fa-lock"></i>
              </div>
              <h3 className="feat-card-title">Secure payments</h3>
              <p className="feat-card-text">
                256-bit encryption on every transaction. Your data never touches
                our servers after processing.
              </p>
            </div>

            <div className="feat-card">
              <div className="feat-icon">
                <i className="fa fa-check-circle"></i>
              </div>
              <h3 className="feat-card-title">Accountant approved</h3>
              <p className="feat-card-text">
                Every calculation verified against IRS guidelines. Trusted by
                CPAs and business owners nationwide.
              </p>
            </div>

            <div className="feat-card">
              <div className="feat-icon">
                <i className="fa fa-clock-o"></i>
              </div>
              <h3 className="feat-card-title">Always available</h3>
              <p className="feat-card-text">
                Generate stubs 24/7 from any device. No downloads, no
                installations, no waiting.
              </p>
            </div>

            <div className="feat-card">
              <div className="feat-icon">
                <i className="fa fa-dollar"></i>
              </div>
              <h3 className="feat-card-title">Transparent pricing</h3>
              <p className="feat-card-text">
                Pay per stub. No subscriptions, no hidden fees, no recurring
                charges. Ever.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Features;
