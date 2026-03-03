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
    // e.preventDefault()
    axios.post("/footersend", this.state).then((res) => {
      if (res.data.mailSent) {
        this.setState({
          show: !this.state.show,
        });
      }
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
                  <Link to="/paystubs">Create Pay Stub</Link>
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
                  <Link to="">
                    Receive our latest news and
                    <br />
                    promotions in your inbox!
                  </Link>
                </li>
                <li className="list-group-item">
                  <div className="newletter">
                    <input
                      type="text"
                      className="form-control"
                      onChange={(e) => this.setState({ email: e.target.value })}
                      placeholder="Your Email Address"
                    />
                    <Link to="">
                      {" "}
                      <i
                        onClick={() => this.handleSubmit()}
                        className="fa fa-long-arrow-right"
                      ></i>
                    </Link>
                  </div>
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
