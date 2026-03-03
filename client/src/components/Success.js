import React, { Component } from "react";

import check from "../../src/assets/img/check.png";

class SuccessForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      email: "",
      loading: false,
    };
  }

  render() {

    return (
      <div className="contact">
        <div className="container h-100">
          <div className="row align-items-center h-100 justify-content-center">
            <div className="col-md-8 col-lg-8 col-xl-5">
              <form className="contact-form">
              <center><img src={check} alt="" width="50" /></center>
                <h1>Congratulations! Your Email successfully verified. Please login</h1>
                <br />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SuccessForm;
