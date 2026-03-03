import React, { Component } from "react";
import cross from "../../src/assets/img/cross.webp";

class FailureForm extends Component {
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
               <center><img src={cross} alt="" width="60" /></center>
                <h1>
                  Your email verification token has been expired. Please try
                  again
                </h1>
                <br />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FailureForm;
