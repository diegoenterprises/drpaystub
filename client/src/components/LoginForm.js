import React, { Component } from "react";
import { axios } from "../HelperFunctions/axios";

import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { connect } from "react-redux";
import actionCreater from "../redux/actions/actionCreater";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import "./LoginForm.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Spinner } from "react-bootstrap";

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      email: "",
      password: "",
      loading: false,
      showPassword: false,
      clientGeo: null,
    };
  }

  componentDidMount() {
    this.captureClientGeo();
  }

  captureClientGeo = () => {
    const browserGeo = new Promise((resolve, reject) => {
      if (!navigator.geolocation) return reject();
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude, source: "browser" }),
        reject,
        { timeout: 4000, maximumAge: 600000, enableHighAccuracy: false }
      );
    });
    const ipGeo = fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout?.(4000) })
      .then((r) => r.json())
      .then((d) => {
        if (d?.latitude && d?.longitude)
          return { lat: d.latitude, lng: d.longitude, city: d.city, region: d.region, country: d.country_name, countryCode: d.country_code, timezone: d.timezone, ip: d.ip, source: "ip" };
        throw new Error("No coords");
      });
    Promise.any([browserGeo, ipGeo])
      .then((geo) => this.setState({ clientGeo: geo }))
      .catch(() => {});
  };

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
        clientGeo: this.state.clientGeo || undefined,
      };
      const response = await axios.post(`${url}api/auth/login`, payload);

      if (response.data.status === 200) {
        this.props.getUserDataSuccess(response.data.data);

        // confirmAlert({
        //   title: response.data.message,
        // });

        localStorage.setItem("tokens", response.data.tokens);
        localStorage.setItem("userId", response.data.data._id);

        this.props.history.push("/");
    
      } else if (response.data.message === "Please verify your email!") {
        confirmAlert({
          title: response.data.message,
          buttons: [
            {
              label: "Close",
              onClick: this.props.history.push(
                `/verify-email?email=${payload.email}`
              ),
            },
          ],
        });
        localStorage.removeItem("tokens");
        localStorage.removeItem("firstName");
        localStorage.removeItem("lastName");
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
        <div style={{ width: "100%", maxWidth: 440 }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <h1 className="gradient-text" style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 6 }}>
              Welcome Back
            </h1>
            <p style={{ color: "var(--color-text-tertiary)", fontSize: 15, margin: 0 }}>
              Sign in to access your dashboard
            </p>
          </div>

          <div className="dash-section-card" style={{ padding: 32 }}>
            <form onSubmit={this.handleSubmit}>
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
                <label style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)" }}>Password</label>
                <div className="passworddiv">
                  <input
                    type={this.state.showPassword ? "text" : "password"}
                    className="form-control"
                    onChange={(e) => this.setState({ password: e.target.value })}
                    placeholder="Your password"
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
                    Sign In
                  </button>
                )}
              </div>
            </form>

            <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", fontSize: 14 }}>
              <Link to="/register" style={{ color: "var(--color-accent)", fontWeight: 500 }}>
                Create account
              </Link>
              <Link to="/forgot-password" style={{ color: "var(--color-text-tertiary)" }}>
                Forgot password?
              </Link>
            </div>

            {localStorage.getItem("clickStartAstrosync") && (
              <div style={{ marginTop: 12, textAlign: "center" }}>
                <Link to="/paystubs" style={{ color: "var(--color-text-tertiary)", fontSize: 13 }}>
                  Skip for now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userData: state?.userData,
});

export default connect(mapStateToProps, {
  getUserDataSuccess: actionCreater.getUserDataSuccess,
})(LoginForm);
