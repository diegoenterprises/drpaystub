import React, { Component } from 'react';
import './HowItWorks.scss';

export class HowItWorks extends Component {
    render() {
        return (
            <div className="howItWorks">
                <div className="container">
                    <div className="hiw-header">
                        <span className="hiw-badge">How it works</span>
                        <h2 className="hiw-title">Three steps. That's it.</h2>
                    </div>

                    <div className="hiw-steps">
                        <div className="hiw-step">
                            <div className="hiw-step-number">01</div>
                            <div className="hiw-step-content">
                                <h3 className="hiw-step-title">Enter your details</h3>
                                <p className="hiw-step-text">
                                    Company info, employee data, salary — fill in the essentials.
                                    Our guided form handles the rest.
                                </p>
                            </div>
                            <div className="hiw-step-icon">
                                <i className="fa fa-pencil"></i>
                            </div>
                        </div>

                        <div className="hiw-step">
                            <div className="hiw-step-number">02</div>
                            <div className="hiw-step-content">
                                <h3 className="hiw-step-title">Preview &amp; customize</h3>
                                <p className="hiw-step-text">
                                    Choose from professional templates. Review every line —
                                    taxes, deductions, net pay — before finalizing.
                                </p>
                            </div>
                            <div className="hiw-step-icon">
                                <i className="fa fa-eye"></i>
                            </div>
                        </div>

                        <div className="hiw-step">
                            <div className="hiw-step-number">03</div>
                            <div className="hiw-step-content">
                                <h3 className="hiw-step-title">Download instantly</h3>
                                <p className="hiw-step-text">
                                    Your professional PDF is ready. Download, print, or share —
                                    it's yours immediately.
                                </p>
                            </div>
                            <div className="hiw-step-icon">
                                <i className="fa fa-download"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default HowItWorks;
