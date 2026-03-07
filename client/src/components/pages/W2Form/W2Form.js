import React, { useState } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import SEO from '../../SEO';
import StepOneForm from './StepOne';
import StepTwoForm from './StepTwo';
import StepThreeForm from './StepThree';
import StepFourForm from './StepFour';
import './app.scss';
import './wstub.css';

export default function W2Form() {
    const [step, setStep] = useState(1);
    const [step1, setStep1] = useState(true);
    const [step2, setStep2] = useState(false);
    const [step3, setStep3] = useState(false);
    const [step4, setStep4] = useState(false);

    const [progress, setProgress] = useState(25);
    const showForms = () => {
        if (step == 1) {
            return <StepOneForm changeStep={changeStep} />;
        } else if (step == 2) {
            return <StepTwoForm changeStep={changeStep} />;
        } else if (step == 3) {
            return <StepThreeForm changeStep={changeStep} />;
        } else {
            return <StepFourForm changeStep={changeStep} />;
        }
    };
    const changeStep = step => {
        setStep(step);
        setProgress((step / 4) * 100);

        if (step == 2) {
            setStep2(true);
        }
        if (step == 3) {
            setStep3(true);
        }
        if (step == 4) {
            setStep4(true);
        }
    };

    return (
        <div className="PayStubForm">
            <SEO
              title="W2 Form Generator — Create W2 Online"
              description="Generate accurate W2 forms online. Enter employer and employee information, wages, and tax withholdings. Download print-ready W2 forms instantly."
              path="/w2form"
              keywords="W2 form generator, create W2 online, W2 maker, wage and tax statement, W2 form creator, employer W2 form"
            />
            <div className="container">
                <div className="row myProgressBar">
                    <div className="col-sm-12">
                        <h2 className="mb-3">Create Your Ready to File W2</h2>
                        <ul>
                            <li className={step == 1 ? 'active' : 'inactive'} onClick={step1 ? () => changeStep(1) : null}>
                                1
                            </li>
                            <li className={step == 2 ? 'active' : 'inactive'} onClick={step2 ? () => changeStep(2) : null}>
                                2
                            </li>
                            <li className={step == 3 ? 'active' : 'inactive'} onClick={step3 ? () => changeStep(3) : null}>
                                3
                            </li>
                            <li className={step == 4 ? 'active' : 'inactive'} onClick={step4 ? () => changeStep(4) : null}>
                                4
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="row progressBar">
                    <div className="col-sm-12">
                        {step !== 4 ? (
                            <p className="text-muted">Your reliable W2 is just a few details away</p>
                        ) : (
                            <p className="text-muted">
                                Your reliable W2 is ready
                                <i className="fa fa-check greentick" aria-hidden="true"></i>
                            </p>
                        )}

                        <br />
                        <ProgressBar>
                            <ProgressBar striped variant="primary" now={progress} key={1} />
                        </ProgressBar>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">{showForms()}</div>
                </div>
            </div>
        </div>
    );
}
