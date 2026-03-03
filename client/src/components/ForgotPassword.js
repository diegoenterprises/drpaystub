import React, { Component } from "react";
import { axios } from "../HelperFunctions/axios";

import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { Spinner } from "react-bootstrap";
import './LoginForm.css'

class ForgotPasswordForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      email: "",
      loading: false,
    };
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true });

    try {
      let url = process.env.REACT_APP_BACKEND_URL_LOCAL;
      if (process.env.REACT_APP_MODE === "live") {
        url = process.env.REACT_APP_FRONTEND_URL_LIVE;
      }
      const payload = {
        email: this.state.email,
      };
      const response = await axios.post(
        `${url}api/auth/forgot-password`,
        payload
      );
      if (response.data.status === 200) {
        // this.props.history.push("/login");

        confirmAlert({
          title: response.data.message,
          buttons: [
            {
              label: "Close",
            },
          ],
        });
      } else {
        confirmAlert({
          title: response.data.message,
          buttons: [
            {
              label: "Close",
            },
          ],
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <div className="contact">
        <div className="container h-100">
          <div className="row align-items-center h-100 justify-content-center">
            <div className="col-md-8 col-lg-8 col-xl-5">
              <form className="contact-form" onSubmit={this.handleSubmit}>
                <h1>Enter your email</h1>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    onChange={(e) => this.setState({ email: e.target.value })}
                    placeholder="Email"
                    required
                  />
                </div>

                <div className="text-center">
                  {this.state.loading ? (
                    <Spinner animation="border" variant="primary" />
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-secondary btn-block"
                    >
                      Send reset link
                    </button>
                  )}
                  <br />
                  <span className="d-flex justify-content-center align-items-center gap-3">
                    <Link
                      to="/login"
                      className="text-decoration-none login-back"
                    >
                      Back to login
                    </Link>
                  </span>
                </div>
                <br />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ForgotPasswordForm;
