import React, { Component } from "react";
import { axios } from "../HelperFunctions/axios";

import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Spinner } from "react-bootstrap";

class RegisterForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
      loading: false,
      showPassword: false,
    };
  }

  handleTogglePassword = () => {
    // Toggle the state to show/hide the password
    this.setState((prevState) => ({
      showPassword: !prevState.showPassword,
    }));
  };

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
        password: this.state.password,
        phoneNumber: this.state.phoneNumber,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
      };
      const response = await axios.post(`${url}api/auth/register`, payload);
      if (response.data.status === 200) {
        this.props.history.push(`/verify-email?email=${payload.email}`);

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
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 16px" }}>
        <div style={{ width: "100%", maxWidth: 480 }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <h1 className="gradient-text" style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 6 }}>
              Create Your Account
            </h1>
            <p style={{ color: "var(--color-text-tertiary)", fontSize: 15, margin: 0 }}>
              Get started with your paystub dashboard
            </p>
          </div>

          <div className="dash-section-card" style={{ padding: 32 }}>
            <form onSubmit={this.handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)" }}>First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={(e) => this.setState({ firstName: e.target.value })}
                      placeholder="First Name"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)" }}>Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={(e) => this.setState({ lastName: e.target.value })}
                      placeholder="Last Name"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)" }}>Email</label>
                <input
                  type="email"
                  className="form-control"
                  onChange={(e) => this.setState({ email: e.target.value })}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)" }}>Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  onChange={(e) => this.setState({ phoneNumber: e.target.value })}
                  placeholder="(555) 000-0000"
                  required
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)" }}>Password</label>
                <div className="passworddiv">
                  <input
                    type={this.state.showPassword ? "text" : "password"}
                    className="form-control"
                    onChange={(e) => this.setState({ password: e.target.value })}
                    placeholder="Create a password"
                    required
                  />
                  <span onClick={this.handleTogglePassword} className="password-toggle-icon">
                    {this.state.showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              <div style={{ marginTop: 20 }}>
                {this.state.loading ? (
                  <div className="text-center"><Spinner animation="border" variant="primary" /></div>
                ) : (
                  <button type="submit" className="btn btn-secondary" style={{ width: "100%" }}>
                    Create Account
                  </button>
                )}
              </div>
            </form>

            <div style={{ marginTop: 20, textAlign: "center", fontSize: 14 }}>
              <span style={{ color: "var(--color-text-tertiary)" }}>Already have an account? </span>
              <a href="/login" style={{ color: "var(--color-accent)", fontWeight: 500 }}>Sign in</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RegisterForm;
