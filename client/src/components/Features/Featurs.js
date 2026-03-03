import React, { Component } from "react";
import "./Features.scss";
import { Zoom, Reveal, Slide } from "react-reveal";

export class Features extends Component {
  render() {
    return (
      <div className="container features">
        <div className="row">
          <div className="col-sm-12">
            <Slide bottom>
              <hr/>
              <h1 className="text-center">Why us?</h1>
            </Slide>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-sm-4">
            <h3 className="text-center">
              <i className="fa fa-undo" />
            </h3>
            <p className="text-secondary text-center">
             Our software service does not offer refunds
            </p>
          </div>
          <div className="col-sm-4">
            <h3 className="text-center">
              <i className="fa fa-lock" />
            </h3>
            <p className="text-secondary text-center">
              100% security secure payment method
            </p>
          </div>
          <div className="col-sm-4">
            <h3 className="text-center">
              <i className="fa fa-smile-o" />
            </h3>
            <p className="text-secondary text-center">
              100% satisfaction we care about your satisfaction
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Features;
