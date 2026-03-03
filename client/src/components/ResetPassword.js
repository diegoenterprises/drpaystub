import React, { Component } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { confirmAlert } from "react-confirm-alert";

class ResetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggingIn: false,
      showPassword: false,
      showConfirmPassword: false,
      password: "",
      confirmPassword: "",
      passwordError: "",
      confirmPasswordError: "",
    };
  }

  handleTogglePassword = () => {
    this.setState((prevState) => ({
      showPassword: !prevState.showPassword,
    }));
  };
  handleToggleConfirmPassword = () => {
    this.setState((prevState) => ({
      showConfirmPassword: !prevState.showConfirmPassword,
    }));
  };
  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({
      loading: true,
      passwordError: "",
      confirmPasswordError: "",
    });
    const { email } = this.props.match.params;

    // Validate password
    if (this.state.password.length < 8) {
      this.setState({
        passwordError: "Password must be at least 8 characters long",
      });
      this.setState({ loading: false });
      return;
    }

    // Validate confirmPassword
    if (this.state.password !== this.state.confirmPassword) {
      this.setState({ confirmPasswordError: "Passwords do not match" });
      this.setState({ loading: false });
      return;
    }

    try {
      let url = process.env.REACT_APP_BACKEND_URL_LOCAL;
      if (process.env.REACT_APP_MODE === "live") {
        url = process.env.REACT_APP_FRONTEND_URL_LIVE;
      }
      const payload = {
        password: this.state.password,
      };
      const response = await axios.post(
        `${url}api/auth/reset-password?email=${email}`,
        payload
      );
      if (response.data.status === 200) {
        this.props.history.push("/login");
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
                <h1>Reset Password</h1>
                <div className="form-group">
                  <div className="passworddiv">
                    <input
                      type={this.state.showPassword ? "text" : "password"}
                      className="form-control"
                      id="password"
                      name="password"
                      onChange={(e) =>
                        this.setState({ password: e.target.value })
                      }
                      placeholder="New Password"
                      required
                    />
                    <span
                      onClick={this.handleTogglePassword}
                      className="password-toggle-icon"
                    >
                      {this.state.showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  {this.state.passwordError && (
                    <div className="text-danger">
                      {this.state.passwordError}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <div className="passworddiv">
                    <input
                      type={
                        this.state.showConfirmPassword ? "text" : "password"
                      }
                      className="form-control"
                      id="confirmPassword"
                      name="confirmPassword"
                      onChange={(e) =>
                        this.setState({ confirmPassword: e.target.value })
                      }
                      placeholder="Confirm Password"
                      required
                    />
                    <span
                      onClick={this.handleToggleConfirmPassword}
                      className="password-toggle-icon"
                    >
                      {this.state.showConfirmPassword ? (
                        <FaEyeSlash />
                      ) : (
                        <FaEye />
                      )}
                    </span>
                  </div>
                  {this.state.confirmPasswordError && (
                    <div className="text-danger">
                      {this.state.confirmPasswordError}
                    </div>
                  )}
                </div>

                <div>
                  <button type="submit" className="btn btn-secondary btn-block">
                    Reset Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ResetPassword;
