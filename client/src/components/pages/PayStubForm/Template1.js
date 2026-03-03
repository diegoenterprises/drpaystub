import React, { Component } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Template1 extends Component {
  state = {
    
  };
  
 
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  
  render() {
    return (
      <div className="template1">
        <div className="container">
            
        </div>
      </div>
    );
  }
}

Template1.propTypes = {
};

const mapStateToProps = (state) => ({
  
});

export default connect(mapStateToProps, {})(Template1);