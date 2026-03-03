import React, { Component } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { axios } from "../../../HelperFunctions/axios";
import DashboardLayout from "./layout/DashboardLayout";
import actionCreater from "../../../redux/actions/actionCreater";
import { connect } from "react-redux";
import "../Dashboard/layout/styles.css";
import { Spinner } from "react-bootstrap";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

class UserProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: this.props.userData?.phoneNumber || "",
      loading: false,
      file: null,
    };
  }

  handleImageClick = () => {
    this.fileInput.click();
  };

  handleFileChange = (e) => {
    this.setState({ file: e.target.files[0] });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true });

    try {
      let url = process.env.REACT_APP_BACKEND_URL_LOCAL;
      if (process.env.REACT_APP_MODE === "live") {
        url = process.env.REACT_APP_FRONTEND_URL_LIVE;
      }
      const formData = new FormData();
      formData.append("file", this.state.file);

      let image = this.props?.image ?? "";
      if (this.state.file) {
        const response = await axios.post(`${url}api/auth/upload`, formData);
        image = response.data.url;
      } else {
        image = this.props?.image ?? "";
      }
      const payload = {
        phoneNumber: this.state.phoneNumber || this.props.userData?.phoneNumber,
        firstName: this.state.firstName || this.props.userData?.firstName,
        lastName: this.state.lastName || this.props.userData?.lastName,
        image: image,
      };
      const token = localStorage.getItem("tokens");
      const response = await axios.put(`${url}api/auth/update-user`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 200 && response.data.data) {
        this.props.getUserDataSuccess(response.data.data);
        this.props.history.push("/dashboard/profile");
        confirmAlert({
          title: response.data.message,
          buttons: [{ label: "Close" }],
        });
      } else {
        confirmAlert({
          title: response.data.message,
          buttons: [{ label: "Close" }],
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }

    this.setState({ loading: false });
  };

  render() {
    const { userData } = this.props;
    const { file, phoneNumber } = this.state;
    const userInitial = userData?.firstName
      ? userData.firstName.charAt(0).toUpperCase()
      : "U";
    const avatarSrc = file
      ? URL.createObjectURL(file)
      : userData?.image || null;

    return (
      <DashboardLayout>
        <h1 className="dash-page-title">My Profile</h1>
        <p className="dash-page-subtitle">Manage your personal information</p>

        <form onSubmit={this.handleSubmit}>
          {/* Avatar Section */}
          <div className="dash-section-card" style={{ textAlign: "center" }}>
            <div
              className="profile-avatar-lg"
              onClick={this.handleImageClick}
              style={{ margin: "0 auto 12px" }}
            >
              {avatarSrc ? (
                <img src={avatarSrc} alt="Profile" />
              ) : (
                <span>{userInitial}</span>
              )}
            </div>
            <p style={{ fontSize: 13, color: "var(--color-text-tertiary)", margin: 0 }}>
              Click avatar to change photo
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={this.handleFileChange}
              ref={(input) => (this.fileInput = input)}
              style={{ display: "none" }}
            />
          </div>

          {/* Personal Info */}
          <div className="dash-section-card">
            <h4>Personal Information</h4>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={userData?.firstName}
                    onChange={(e) => this.setState({ firstName: e.target.value })}
                    placeholder="First Name"
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={userData?.lastName}
                    onChange={(e) => this.setState({ lastName: e.target.value })}
                    placeholder="Last Name"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="dash-section-card">
            <h4>Contact Information</h4>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    defaultValue={userData?.email}
                    disabled={true}
                    placeholder="Email"
                    style={{ opacity: 0.6 }}
                  />
                  <small style={{ color: "var(--color-text-tertiary)" }}>
                    Email cannot be changed
                  </small>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Phone Number</label>
                  <PhoneInput
                    placeholder="Enter phone number"
                    value={userData?.phoneNumber || phoneNumber}
                    limitMaxLength={12}
                    min={10}
                    required
                    onChange={(value) => this.setState({ phoneNumber: value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="dash-section-card">
            <h4>Account Details</h4>
            <div className="row">
              <div className="col-md-4">
                <p style={{ fontSize: 13, color: "var(--color-text-tertiary)", marginBottom: 4 }}>Role</p>
                <span className="badge-gradient">{userData?.role || "user"}</span>
              </div>
              <div className="col-md-4">
                <p style={{ fontSize: 13, color: "var(--color-text-tertiary)", marginBottom: 4 }}>Email Verified</p>
                <span style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: userData?.isEmailVerified ? "#22c55e" : "#ef4444"
                }}>
                  {userData?.isEmailVerified ? "Verified" : "Not Verified"}
                </span>
              </div>
              <div className="col-md-4">
                <p style={{ fontSize: 13, color: "var(--color-text-tertiary)", marginBottom: 4 }}>Member Since</p>
                <span style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)" }}>
                  {userData?.createdAt
                    ? new Date(userData.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—"}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            {this.state.loading ? (
              <Spinner animation="border" variant="primary" />
            ) : (
              <button type="submit" className="btn btn-secondary">
                Save Changes
              </button>
            )}
          </div>
        </form>
      </DashboardLayout>
    );
  }
}

const mapStateToProps = (state) => ({
  userData: state?.userData,
});

export default connect(mapStateToProps, {
  getUserDataSuccess: actionCreater.getUserDataSuccess,
})(UserProfile);
