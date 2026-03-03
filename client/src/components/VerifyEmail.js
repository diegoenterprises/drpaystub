import React, { Component } from "react";
import { axios } from "../HelperFunctions/axios";

import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

class VerifyEmailForm extends Component {
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

    const searchParams = new URLSearchParams(document.location.search);
    const typeVal = searchParams.get("email");

    try {
      let url = process.env.REACT_APP_BACKEND_URL_LOCAL;
      if (process.env.REACT_APP_MODE === "live") {
        url = process.env.REACT_APP_FRONTEND_URL_LIVE;
      }
      const payload = {
        email: this.state.email ? this.state.email : typeVal,
      };
      const response = await axios.post(
        `${url}api/auth/send-verification-email`,
        payload
      );
      if (response.data.status === 200) {
        this.props.history.push("/verify-email");

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
    const searchParams = new URLSearchParams(document.location.search);
    const typeVal = searchParams.get("email");

    return (
      <div className="contact">
        <div className="container h-100">
          <div className="row align-items-center h-100 justify-content-center">
            <div className="col-md-8 col-lg-8 col-xl-5">
              <form className="contact-form" onSubmit={this.handleSubmit}>
                <h1>We have sent the link to your email address. Please check</h1>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={typeVal}
                    // onChange={(e) =>
                    //   this.setState({
                    //     email: e.target.value ? e.target.value : typeVal,
                    //   })
                    // }
                    readOnly
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
                      Resend
                    </button>
                  )}
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

export default VerifyEmailForm;
