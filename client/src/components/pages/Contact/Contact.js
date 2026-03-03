import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import "./Contact.scss";
import { Link } from "react-router-dom";
import { axios } from "../../../HelperFunctions/axios";

export class Contact extends Component {
  state = {
    show: false,
    name: "",
    email: "",
    subject: "",
    message: "",
    emailFailure: false,
  };
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  onchange = (value) => {
    this.setState({ ...this.state });
  };
  handelModal() {
    this.setState({
      show: !this.state.show,
    });
  }
  handelCloseModal() {
    this.setState({
      emailFailure: !this.state.emailFailure,
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    axios.post("/api/sendmails/contact", this.state).then((res) => {
      if (res.data.mailSent === true) {
        this.setState({
          show: !this.state.show,
          emailFailure: false,
        });
      } else {
        this.setState({
          emailFailure: !this.state.emailFailure,
          show: false,
        });
      }
    });
  }
  render() {
    return (
      <div className="contact">
        <div className="container h-100">
          <div className="row align-items-center h-100 justify-content-center">
            <div className="col-md-8 col-lg-8 col-xl-5">
              <form
                className="contact-form"
                onSubmit={(e) => this.handleSubmit(e)}
              >
                <h1>
                  Please, Let Us Know<br></br>What’s Going On
                </h1>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    onChange={(e) => this.setState({ name: e.target.value })}
                    placeholder="Your Name"
                    required="required"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    onChange={(e) => this.setState({ email: e.target.value })}
                    placeholder="Your email"
                    required="required"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    id="subject"
                    name="subject"
                    onChange={(e) => this.setState({ subject: e.target.value })}
                    placeholder="Subject"
                    required="required"
                  />
                </div>
                <div className="form-group">
                  <textarea
                    className="form-control"
                    id=""
                    rows="5"
                    placeholder="Message"
                    name="message"
                    onChange={(e) => this.setState({ message: e.target.value })}
                    placeholder="Message"
                    required="required"
                  ></textarea>
                </div>
                <div className="form-group d-flex justify-content-center"></div>
                <button type="submit" className="btn btn-secondary btn-block">
                  Submit
                </button>
              </form>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: 40,
            }}
          >
            Contact Information
          </div>
          <div
            style={{ display: "flex", justifyContent: "center", fontSize: 20 }}
          >
            Email: diego@drpaystub.net
          </div>
          <div
            style={{ display: "flex", justifyContent: "center", fontSize: 20 }}
          >
            Number: 530-456-6135
          </div>
          <div
            style={{ display: "flex", justifyContent: "center", fontSize: 20 }}
          >
            Address: 221 N Broadstreet,
          </div>
          <div
            style={{ display: "flex", justifyContent: "center", fontSize: 20 }}
          >
            Suite 3A Middletown, DE 19709
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
            <h3>Thanks for your inquiry</h3>
            <h3>We will get back to you shortly</h3>
            <Link to="/">
              <button className="btn btn-secondary btn-block mt-3">OK</button>
            </Link>
          </Modal.Body>
        </Modal>
        <Modal
          show={this.state.emailFailure}
          aria-labelledby="contained-modal-title-vcenter"
          centered
          className="loginModal"
        >
          <Modal.Body className="p-5">
            <button
              className="closePopup"
              onClick={() => {
                this.handelCloseModal();
              }}
            >
              <i className="fa fa-times"></i>
            </button>
            <h3>oops :(</h3>
            <h3>
              We could not deliver your message, Please try after some time
            </h3>
            <Link to="/contact">
              <button className="btn btn-secondary btn-block mt-2">OK</button>
            </Link>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default Contact;
