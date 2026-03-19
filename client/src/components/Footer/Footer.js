import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
import "./Footer.scss";
import SaurelliusLogo from "../SaurelliusLogo";
import PaymentMethods from "../../assets/img/payment-methods.png";
import { axios } from "../../HelperFunctions/axios";

class Footer extends Component {
  constructor() {
    super();
    this.state = {
      show: false,
      email: "",
      newsletterSending: false,
      newsletterSent: false,
      newsletterError: false,
    };
  }
  scrollToTop = () => {
    window.scrollTo(0, 0);
  };
  handelModal() {
    this.setState({
      show: !this.state.show,
    });
  }
  handleSubmit() {
    const { email } = this.state;
    if (!email || !email.includes("@")) return;
    this.setState({ newsletterSending: true, newsletterError: false });
    axios.post("/api/sendmails/newsletter", { email }).then((res) => {
      if (res.data.mailSent) {
        this.setState({
          show: true,
          email: "",
          newsletterSending: false,
          newsletterSent: true,
        });
      } else {
        this.setState({ newsletterSending: false, newsletterError: true });
      }
    }).catch(() => {
      this.setState({ newsletterSending: false, newsletterError: true });
    });
  }
  render() {
    return (
      <footer className="footer">
        <div className="container footer-top">
          <div className="row">
            <div className="col-md-3 col-lg-4">
              <Link to="/" onClick={this.scrollToTop} style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
                <SaurelliusLogo size={36} />
                <span className="gradient-text" style={{ fontSize: "18px", fontWeight: 600, letterSpacing: "-0.02em" }}>Saurellius</span>
              </Link>
            </div>

            <div className="col-md-2">
              <ul className="list-group border-0">
                <li className="list-group-item border-0 menu-heading">
                  <b>More</b>
                </li>

                <li className="list-group-item border-0 menu-value">
                  <Link to="/paystubs">Create Payroll Document</Link>
                </li>
		{/*
                <li className="list-group-item border-0 menu-value">
                  <Link to="/w2form">Create W2 Form</Link>
                </li>*/}
                <li className="list-group-item border-0 menu-value">
                  <Link to="/blogs">Blogs</Link>
                </li>
                <li className="list-group-item border-0 menu-value">
                  <Link to="/about">About</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-2">
              <ul className="list-group border-0">
                <li className="list-group-item border-0 menu-heading">
                  <b>SUPPORT</b>
                </li>
                <li className="list-group-item border-0 menu-value">
                  <Link to="/contact">Contact</Link>
                </li>
                <li className="list-group-item border-0 menu-value">
                  <Link to="/privacyPolicy">Privacy Policy</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-5 col-lg-4">
              <ul className="list-group border-0">
                <li className="list-group-item border-0 menu-heading">
                  <b>SUBSCRIBE TO OUR NEWSLETTER</b>
                </li>
                <li className="list-group-item border-0 menu-value">
                  <span style={{ color: "var(--color-text-secondary, #888)", fontSize: 14 }}>
                    Receive our latest news and
                    <br />
                    promotions in your inbox!
                  </span>
                </li>
                <li className="list-group-item">
                  {this.state.newsletterSent ? (
                    <p style={{ color: "#10b981", fontSize: 13, fontWeight: 600, margin: "8px 0" }}>
                      <i className="fa fa-check-circle" style={{ marginRight: 6 }}></i>
                      You're subscribed!
                    </p>
                  ) : (
                    <div className="newletter">
                      <input
                        type="email"
                        className="form-control"
                        value={this.state.email}
                        onChange={(e) => this.setState({ email: e.target.value, newsletterError: false })}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); this.handleSubmit(); } }}
                        placeholder="Your Email Address"
                        disabled={this.state.newsletterSending}
                      />
                      <span
                        style={{ cursor: this.state.newsletterSending ? "not-allowed" : "pointer" }}
                        onClick={() => this.handleSubmit()}
                      >
                        <i className={this.state.newsletterSending ? "fa fa-spinner fa-spin" : "fa fa-long-arrow-right"}></i>
                      </span>
                    </div>
                  )}
                  {this.state.newsletterError && (
                    <p style={{ color: "#ef4444", fontSize: 12, margin: "4px 0 0" }}>Something went wrong. Try again.</p>
                  )}
                </li>
                <li className="list-group-item border-0 menu-value">
                  <img src={PaymentMethods} className="img img-responsive" />
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom py-3">
          <div className="container">
            <Row style={{ alignItems: "center" }}>
              <Col xs="6" className="p-sm-0">
                <p className="mb-0 bottomText" style={{ fontSize: "1rem" }}>
                  &copy; 2026 Saurellius by Dr. Paystub Corp
                </p>
              </Col>
              {/* <Col xs="6" className="p-sm-0 text-right">
                <p className="mb-0 bottomText" style={{ fontSize: "1rem" }}>
                  Powered by{" "}
                  
                </p>
              </Col> */}
            </Row>
          </div>
        </div>
        <Modal
          show={this.state.show}
          aria-labelledby="contained-modal-title-vcenter"
          centered
          className="loginModal"
        >
          <Modal.Body className="p-5">
            <button
              className="closePopup"
              onClick={() => {
                this.handelModal();
              }}
            >
              <i className="fa fa-times"></i>
            </button>
            <h2>Thank you</h2>
            <br />
            <Link to="/Home">
              <button className="btn btn-theme btn-block">OK</button>
            </Link>
          </Modal.Body>
        </Modal>
      </footer>
    );
  }
}

export default Footer;
