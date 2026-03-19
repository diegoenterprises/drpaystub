import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Testimonials.scss";

export class Testimonials extends Component {
  render() {
    return (
      <div className="testimonials">
        <div className="container">
          <div className="test-header">
            <span className="test-badge">Testimonials</span>
            <h2 className="test-title">Trusted by thousands.</h2>
          </div>

          <div className="test-grid">
            <div className="test-card">
              <div className="test-quote">"</div>
              <p className="test-body">
                I can guarantee you the satisfaction my company and I felt when
                we realized we didn't have to shell out exponential amounts for
                software. This website does it all for us.
              </p>
              <div className="test-author">
                <div className="test-author-avatar">AW</div>
                <div>
                  <div className="test-author-name">Abraham Weitsman</div>
                  <div className="test-author-loc">New York</div>
                </div>
              </div>
            </div>

            <div className="test-card">
              <div className="test-quote">"</div>
              <p className="test-body">
                Sign me up! Fastest payroll platform ever. What used to take
                me hours now takes minutes. The accuracy is incredible.
              </p>
              <div className="test-author">
                <div className="test-author-avatar">RD</div>
                <div>
                  <div className="test-author-name">Raphael Dominguez</div>
                  <div className="test-author-loc">Houston</div>
                </div>
              </div>
            </div>

            <div className="test-card">
              <div className="test-quote">"</div>
              <p className="test-body">
                I was able to issue out paychecks and paystubs for my entire
                team within minutes. And the calculations were perfectly
                accurate. This changed everything for us.
              </p>
              <div className="test-author">
                <div className="test-author-avatar">EP</div>
                <div>
                  <div className="test-author-name">Evan Price</div>
                  <div className="test-author-loc">Los Angeles</div>
                </div>
              </div>
            </div>
          </div>

          <div className="test-cta">
            <Link to="/reviews" className="btn btn-secondary">
              All reviews <i className="fa fa-arrow-right" style={{ marginLeft: '8px', fontSize: '13px' }}></i>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Testimonials;
