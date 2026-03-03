import React from 'react';
import './Loader.css';
import { connect } from 'react-redux';

function Loader(props) {
    return (
        <div className="container-loader">
            <img alt="logo" src="./logo.png" />
        </div>
    );
}
export default connect(state => state, {})(Loader);
