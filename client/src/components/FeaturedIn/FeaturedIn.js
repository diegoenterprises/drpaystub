import React, { Component } from "react";
import "./FeaturedIn.scss";
import { Slide } from "react-reveal";

class FeaturedIn extends Component {
  render() {
    return (
      <div className="container-fluid featuredIn">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <Slide bottom>
                <h1 className="text-white">Next Generation Technologies Featured In</h1>
              </Slide>
            </div>
          </div>
          <div className="row mt-5 mb-5">
            <div className="col-sm-3 img-item">
              {/* <img src={FeaturedIn1} className="img img-responsive"/> */}
              <Slide left>
                <h2 className="text-center">Forbes</h2>
              </Slide>
            </div>
            <div className="col-sm-3 img-item">
              {/* <img src={FeaturedIn1} className="img img-responsive"/> */}
              <Slide right>
                <h2 className="text-center">USA Today</h2>
              </Slide>
            </div>
            <div className="col-sm-3 img-item">
              {/* <img src={FeaturedIn1} className="img img-responsive"/> */}
              <Slide left>
                <h2 className="text-center">Time </h2>
              </Slide>
            </div>
            <div className="col-sm-3 img-item">
              {/* <img src={FeaturedIn1} className="img img-responsive"/> */}
              <Slide right>
                <h2 className="text-center">Maxim</h2>
              </Slide>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FeaturedIn;
