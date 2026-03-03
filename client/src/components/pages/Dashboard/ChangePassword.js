import React, { Component } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { confirmAlert } from "react-confirm-alert";
import DashboardLayout from "./layout/DashboardLayout";
import { Spinner } from "react-bootstrap";

class ChangePassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggingIn: false,
      showPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      passwordError: "",
      confirmPasswordError: "",
      newPasswordError: "",
    };
  }

  handleTogglePassword = () => {
    this.setState((prevState) => ({ showPassword: !prevState.showPassword }));
  };
  handleToggleNewPassword = () => {
    this.setState((prevState) => ({ showNewPassword: !prevState.showNewPassword }));
  };
  handleToggleConfirmPassword = () => {
    this.setState((prevState) => ({ showConfirmPassword: !prevState.showConfirmPassword }));
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true, passwordError: "", confirmPasswordError: "", newPasswordError: "" });

    if (this.state.newPassword.length < 8) {
      this.setState({ passwordError: "Password must be at least 8 characters long", loading: false });
      return;
    }
    if (this.state.newPassword !== this.state.confirmPassword) {
      this.setState({ confirmPasswordError: "Passwords do not match", loading: false });
      return;
    }

    try {
      let url = process.env.REACT_APP_BACKEND_URL_LOCAL;
      if (process.env.REACT_APP_MODE === "live") {
        url = process.env.REACT_APP_FRONTEND_URL_LIVE;
      }
      const token = localStorage.getItem("tokens");
      const response = await axios.post(
        `${url}api/auth/change-password`,
        { oldPassword: this.state.oldPassword, newPassword: this.state.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.status === 200) {
        confirmAlert({ title: response.data.message, buttons: [{ label: "Close" }] });
      }
    } catch (error) {
      console.error("Error:", error);
    }
    this.setState({ loading: false });
  };

  render() {
    return (
      <DashboardLayout>
        <h1 className="dash-page-title">Security</h1>
        <p className="dash-page-subtitle">Update your password to keep your account secure</p>

        <div className="dash-section-card" style={{ maxWidth: 540 }}>
          <h4>Change Password</h4>
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label>Current Password</label>
              <div className="passworddiv">
                <input
                  type={this.state.showPassword ? "text" : "password"}
                  className="form-control"
                  onChange={(e) => this.setState({ oldPassword: e.target.value })}
                  placeholder="Enter current password"
                  required
                />
                <span onClick={this.handleTogglePassword} className="password-toggle-icon">
                  {this.state.showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label>New Password</label>
              <div className="passworddiv">
                <input
                  type={this.state.showNewPassword ? "text" : "password"}
                  className="form-control"
                  onChange={(e) => this.setState({ newPassword: e.target.value })}
                  placeholder="Enter new password"
                  required
                />
                <span onClick={this.handleToggleNewPassword} className="password-toggle-icon">
                  {this.state.showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {this.state.passwordError && (
                <small className="text-danger">{this.state.passwordError}</small>
              )}
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <div className="passworddiv">
                <input
                  type={this.state.showConfirmPassword ? "text" : "password"}
                  className="form-control"
                  onChange={(e) => this.setState({ confirmPassword: e.target.value })}
                  placeholder="Re-enter new password"
                  required
                />
                <span onClick={this.handleToggleConfirmPassword} className="password-toggle-icon">
                  {this.state.showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {this.state.confirmPasswordError && (
                <small className="text-danger">{this.state.confirmPasswordError}</small>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              {this.state.loading ? (
                <Spinner animation="border" variant="primary" />
              ) : (
                <button type="submit" className="btn btn-secondary">
                  Update Password
                </button>
              )}
            </div>
          </form>
        </div>
      </DashboardLayout>
    );
  }
}

export default ChangePassword;
