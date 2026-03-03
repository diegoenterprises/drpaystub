import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

class Error extends Component {

  render() {
    // return <Redirect to="/dashboard" />
    return (
      <React.Fragment>
        <div className="wrapper menu-collapsed">
          <div className="main-panel">
            <section id="error">
              <div className="container-fluid forgot-password-bg overflow-hidden">
                <div className="row full-height-vh">
                  <div className="col-12 d-flex align-items-center justify-content-center">
                    <div className="row">
                      <div className="col-sm-12 text-center">
                        <h1 className="text-white mb-5 mt-n5">
                     Oops :( You landed the wrong page..
                        </h1>

                        <button className="btn btn-danger btn-lg mt-3">
                          <a
                            href="/"
                            className="text-decoration-none text-white"
                          >
                    <i className="ft-external-link"></i> Back to home
                          </a>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, {})(Error);
