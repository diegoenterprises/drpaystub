import React, { useState } from 'react';
import { Modal, Button, Container, Row, Col } from 'react-bootstrap';
import { Typography } from '@material-ui/core';
import { states } from './states';
import { connect } from 'react-redux';
import AC from '../../../redux/actions/actionCreater';

import './modalW2.scss';

function ModalW2(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        props.onClose();
    };
    const handleShow = () => setShow(true);
    const [data, setData] = useState(states);
    const [disable, setDisable] = useState(false);

    const getAllStates = () => {
        let us_state_options;
        if (data && data.length > 0) {
            us_state_options = data.map(state => {
                return <option value={state.name}>{state.name.substring(0, 1).toUpperCase() + state.name.substring(1).toLowerCase()}</option>;
            });
        }
        return us_state_options;
    };
    return (
        <>
            <Button disabled={props.disable} variant="success" onClick={handleShow}>
                Edit Ready to file W2
            </Button>
            <Typography style={{ fontSize: 10 }}>
                <span style={{ color: 'red' }}>*</span>Note: You cannot edit after payment
            </Typography>

            <Modal className={'w2-stub'} size="lg" show={show}>
                <Modal.Header>
                    <Modal.Title>Edit Ready to file W2</Modal.Title>
                </Modal.Header>
                <Modal.Body className={'w2-modal-body'}>
                    <>
                        <Row>
                            <Col className="block-example border border-dark" xs={2} style={{ fontFamily: 'fantasy' }}>
                                22222
                            </Col>
                            <Col className="block-example border border-dark" xs={4}>
                                <Typography style={{ fontSize: 10, fontWeight: 'bold' }}>a. Employee's Social Security Number:</Typography>
                                <input
                                    placeholder="0.00"
                                    defaultValue={props?.stepTwo?.employee_ssn}
                                    onChange={e =>
                                        props.stepTwoFn({
                                            ...props?.stepTwo,
                                            employee_ssn: e.target.value,
                                        })
                                    }
                                />
                            </Col>
                            <Col className="block-example border border-dark" xs={6}>
                                <Typography style={{ fontSize: 13, fontWeight: 'bold' }}>OBM No. 21313-132</Typography>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="block-example border border-dark" xs={6}>
                                <Typography style={{ fontSize: 10, fontWeight: 'bold' }}>b. Employee's Identification Number:</Typography>
                                <input
                                    placeholder="0.00"
                                    defaultValue={props?.stepOne?.employer_ein}
                                    onChange={e =>
                                        props.stepOneFn({
                                            ...props?.stepOne,
                                            employer_ein: e.target.value,
                                        })
                                    }
                                />
                            </Col>
                            <Col className="block-example border border-dark" xs={3}>
                                <Typography style={{ fontSize: 10, fontWeight: 'bold' }}>1.Wages,tips,other compensations</Typography>
                                <input
                                    placeholder="0.00"
                                    defaultValue={props?.response?.other_compensation}
                                    onChange={e =>
                                        props.responseFn({
                                            ...props?.response,
                                            other_compensation: e.target.value,
                                        })
                                    }
                                />
                            </Col>
                            <Col className="block-example border border-dark" xs={3}>
                                <Typography style={{ fontSize: 10, fontWeight: 'bold' }}>2.Federel Income tax withheld</Typography>

                                <input
                                    placeholder="0.00"
                                    defaultValue={props?.response?.federal_income_tax}
                                    onChange={e =>
                                        props.responseFn({
                                            ...props?.response,
                                            federal_income_tax: e.target.value,
                                        })
                                    }
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col className="block-example border border-dark" xs={6}>
                                <Typography style={{ fontSize: 10, fontWeight: 'bold' }}>c. Employee's name,address and Zip Code:</Typography>
                                <input
                                    placeholder="0.00"
                                    style={{ fontSize: 10 }}
                                    defaultValue={props?.stepTwo?.employee_name}
                                    onChange={e =>
                                        props.stepTwoFn({
                                            ...props?.stepTwo,
                                            employee_name: e.target.value,
                                        })
                                    }
                                ></input>
                                <br />
                                <textarea
                                    placeholder="0.00"
                                    style={{ fontSize: 10 }}
                                    defaultValue={props?.stepTwo?.employee_address}
                                    onChange={e =>
                                        props.stepTwoFn({
                                            ...props?.stepTwo,
                                            employee_address: e.target.value,
                                        })
                                    }
                                ></textarea>
                                <br />
                                <input
                                    placeholder="0.00"
                                    style={{ fontSize: 10 }}
                                    defaultValue={props?.stepTwo?.employee_zipCode}
                                    onChange={e =>
                                        props.stepTwoFn({
                                            ...props?.stepTwo,
                                            employee_zipCode: e.target.value,
                                        })
                                    }
                                ></input>
                            </Col>
                            <Col className="block-example border border-dark" xs={3}>
                                <Row className="block-example border " style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Typography style={{ fontSize: 10, fontWeight: 'bold' }}>3.Social Security Wages</Typography>
                                    <input
                                        placeholder="0.00"
                                        defaultValue={props?.response?.other_compensation}
                                        onChange={e =>
                                            props.responseFn({
                                                ...props?.response,
                                                other_compensation: e.target.value,
                                            })
                                        }
                                    />
                                </Row>
                                <Row className="block-example border border-dark" style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Typography style={{ fontSize: 10, fontWeight: 'bold' }}>5.Medicare wages and tips</Typography>
                                    <input
                                        placeholder="0.00"
                                        defaultValue={props?.response?.other_compensation}
                                        onChange={e =>
                                            props.responseFn({
                                                ...props?.response,
                                                other_compensation: e.target.value,
                                            })
                                        }
                                    />
                                </Row>
                                <Row className="block-example border " style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Typography style={{ fontSize: 10, fontWeight: 'bold' }}>7.Social Security tips</Typography>
                                    <input
                                        placeholder="0.00"
                                        defaultValue={props?.response?.other_compensation}
                                        onChange={e =>
                                            props.responseFn({
                                                ...props?.response,
                                                other_compensation: e.target.value,
                                            })
                                        }
                                    />
                                </Row>
                            </Col>
                            <Col className="block-example border border-dark" xs={3}>
                                <Row className="block-example border " style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Typography style={{ fontSize: 10, fontWeight: 'bold' }}>4.Social Security Tax withheld</Typography>

                                    <input
                                        placeholder="0.00"
                                        defaultValue={props?.response?.social_security}
                                        onChange={e =>
                                            props.responseFn({
                                                ...props?.response,
                                                social_security: e.target.value,
                                            })
                                        }
                                    />
                                </Row>
                                <Row className="block-example border border-dark" style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Typography style={{ fontSize: 10, fontWeight: 'bold' }}>6.Medicare Tax withheld</Typography>

                                    <input
                                        placeholder="0.00"
                                        defaultValue={props?.response?.medicare}
                                        onChange={e =>
                                            props.responseFn({
                                                ...props?.response,
                                                medicare: e.target.value,
                                            })
                                        }
                                    />
                                </Row>
                                <Row className="block-example border " style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Typography style={{ fontSize: 10, fontWeight: 'bold' }}>8.Allocated tips</Typography>
                                    <input
                                        placeholder="0.00"
                                        defaultValue={props?.stepThree?.allocated_tips}
                                        onChange={e =>
                                            props.stepThreeFn({
                                                ...props?.stepThree,
                                                allocated_tips: e.target.value,
                                            })
                                        }
                                    />
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6} className="block-example border border-dark">
                                <Typography style={{ fontSize: 10, fontWeight: 'bold' }}>d. Control Number</Typography>
                                <input
                                    placeholder="0.00"
                                    defaultValue={props?.stepOne?.company_control_number}
                                    onChange={e =>
                                        props.stepOneFn({
                                            ...props?.stepOne,
                                            company_control_number: e.target.value,
                                        })
                                    }
                                />
                            </Col>
                            <Col xs={3} className="block-example border border-dark ">
                                <Typography style={{ fontSize: 10, fontWeight: 'bold' }}>9.</Typography>
                            </Col>
                            <Col xs={3} className="block-example border border-dark">
                                <Typography style={{ fontSize: 10, fontWeight: 'bold' }}>10.Dependant care benefits</Typography>
                                <input
                                    placeholder="0.00"
                                    defaultValue={props?.stepThree?.dependent_cate_benefits}
                                    onChange={e =>
                                        props.stepThreeFn({
                                            ...props?.stepThree,
                                            dependent_cate_benefits: e.target.value,
                                        })
                                    }
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col className="block-example border border-dark" xs={6}>
                                <Typography style={{ fontSize: 8, fontWeight: 'bold' }}>Suff.</Typography>
                                <input
                                    placeholder="0.00"
                                    style={{ width: 40 }}
                                    defaultValue={props?.extras?.suff}
                                    onChange={e =>
                                        props.extrasFn({
                                            ...props?.suff,
                                            suff: e.target.value,
                                        })
                                    }
                                />
                                <Typography style={{ fontSize: 10, fontWeight: 'bold' }}>e. Employee's First Name and initials/Last Name</Typography>
                                <input
                                    style={{ fontSize: 10 }}
                                    defaultValue={props?.stepTwo?.employee_name}
                                    onChange={e =>
                                        props.stepTwoFn({
                                            ...props?.stepTwo,
                                            employee_name: e.target.value,
                                        })
                                    }
                                ></input>
                                <Typography style={{ fontSize: 10, fontWeight: 'bold' }}>f. Employee's Address and Zip Code</Typography>

                                <textarea
                                    style={{ fontSize: 10 }}
                                    defaultValue={props?.stepTwo?.employee_address}
                                    onChange={e =>
                                        props.stepTwoFn({
                                            ...props?.stepTwo,
                                            employee_address: e.target.value,
                                        })
                                    }
                                ></textarea>
                                <br />
                                <input
                                    style={{ fontSize: 10 }}
                                    defaultValue={props?.stepTwo?.employee_zipCode}
                                    onChange={e =>
                                        props.stepTwoFn({
                                            ...props?.stepTwo,
                                            employee_zipCode: e.target.value,
                                        })
                                    }
                                ></input>
                            </Col>
                            <Col className="block-example border border-dark" xs={3}>
                                <Row className="block-example border ">
                                    <Typography style={{ fontSize: 10, fontWeight: 'bold' }}>11.Non Qualified Plans:</Typography>
                                    <input
                                        placeholder="0.00"
                                        defaultValue={props?.stepThree?.non_qualified_plans}
                                        onChange={e =>
                                            props.stepThreeFn({
                                                ...props?.stepThree,
                                                non_qualified_plans: e.target.value,
                                            })
                                        }
                                    />
                                </Row>
                                <Row className="block-example border border-dark">
                                    <Typography style={{ fontSize: 10, fontWeight: 'bold' }}>13.</Typography>
                                    <div>
                                        <div className="inline-border-example">
                                            <label style={{ fontSize: 10 }}> Statutory Employee:</label>
                                            <input
                                                checked={!!props?.stepThree?.extras?.statutory_employee}
                                                defaultValue={!!props?.stepThree?.extras?.statutory_employee}
                                                onChange={e =>
                                                    props.stepThreeFn({
                                                        ...props?.stepThree,
                                                        extras: {
                                                            ...props?.stepThree?.extras,

                                                            statutory_employee: !Boolean(props?.stepThree?.extras?.statutory_employee),
                                                        },
                                                    })
                                                }
                                                value={true}
                                                type="checkbox"
                                            />
                                        </div>
                                        <div className="inline-border-example">
                                            <label style={{ fontSize: 10 }}>Retirement Plans</label>
                                            <input
                                                checked={!!props?.stepThree?.extras?.retirement_plan}
                                                defaultValue={!!props?.stepThree?.extras?.retirement_plan}
                                                onChange={e =>
                                                    props.stepThreeFn({
                                                        ...props?.stepThree,
                                                        extras: {
                                                            ...props?.stepThree?.extras,

                                                            retirement_plan: !Boolean(props?.stepThree?.extras?.retirement_plan),
                                                        },
                                                    })
                                                }
                                                type="checkbox"
                                            />
                                        </div>
                                        <div className="inline-border-example">
                                            <label style={{ fontSize: 10 }}> third-Party sick pay</label>
                                            <input
                                                checked={!!props?.stepThree?.extras?.third_Party_sick_pay}
                                                defaultValue={!!props?.stepThree?.extras?.third_Party_sick_pay}
                                                onChange={e =>
                                                    props.stepThreeFn({
                                                        ...props?.stepThree,
                                                        extras: {
                                                            ...props?.stepThree?.extras,

                                                            third_Party_sick_pay: !Boolean(props?.stepThree?.extras?.third_Party_sick_pay),
                                                        },
                                                    })
                                                }
                                                value={true}
                                                type="checkbox"
                                            />
                                        </div>
                                    </div>
                                </Row>
                                <Row>
                                    <Typography style={{ fontSize: 10, fontWeight: 'bold' }}>14.other:</Typography>
                                    <br />
                                    <textarea
                                        style={{}}
                                        defaultValue={props?.extras?.other}
                                        onChange={e =>
                                            props.extrasFn({
                                                ...props?.extras,
                                                other: e.target.value,
                                            })
                                        }
                                    />
                                </Row>
                            </Col>
                            <Col className="block-example border border-dark" xs={3}>
                                <Row className="block-example border ">
                                    <Typography style={{ fontSize: 10, fontWeight: 'bold' }}>12.a</Typography>

                                    <select
                                        placeholder="Number of Dependants"
                                        autoComplete="off"
                                        className="form-control"
                                        name="taxCode_12c"
                                        onChange={e =>
                                            props.stepThreeFn({
                                                ...props?.stepThree,
                                                taxCode_12a: {
                                                    ...props?.stepThree.taxCode_12a,
                                                    taxCode: e.target.value,
                                                },
                                                // taxCode_12a.amount: e.target.value,
                                            })
                                        }
                                        defaultValue={props?.stepThree?.taxCode_12a.taxCode}
                                    >
                                        <option value="">Select</option>
                                        <option value="A"> A — Uncollected Social Security or RRTA tax on tips. Include this tax on Form 1040 Schedule 4 line 58.</option>

                                        <option value="B">B — Uncollected Medicare tax on tips. Include this tax on Form 1040 Schedule 4 line 58.</option>
                                        <option value="C">
                                            C — Taxable costs of group-term life insurance over $50,000 (included in W-2 boxes 1,3 (up to Social Security wages base), and box 5.
                                        </option>
                                        <option value="D">D — Elective deferral under a 401(k) cash or arrangement plan. This includes a SIMPLE 401(k) arrangement.</option>
                                        <option value="E">E — Elective deferrals under a Section 403(b) salary reduction agreement.</option>
                                        <option value="F">F — Elective deferrals under a Section 408(k)(6) salary reduction SEP.</option>
                                        <option value="G">5</option>

                                        <option value="H">
                                            G — Elective deferrals and employer contributions (including non-elective deferrals) to a Section 457(b) deferred compensation plan.
                                        </option>

                                        <option value="I">H — Elective deferrals to a Section 501(c)(18)(D) tax-exempt organization plan.</option>

                                        <option value="J">J — Nontaxable sick pay (information only, not included in W-2 boxes 1, 3, or 5).</option>

                                        <option value="K">K — 20% excise tax on excess golden parachute payments.</option>

                                        <option value="L">L — Substantiated employee business expense reimbursements (nontaxable).</option>

                                        <option value="M">
                                            M — Uncollected Social Security or RRTA tax on taxable cost of group-term life insurance over $50,000 (former employees only).
                                        </option>

                                        <option value="N">N — Uncollected Medicare tax on taxable cost of group-term life insurance over $50,000 (former employees only).</option>

                                        <option value="P">
                                            P — Excludable moving expense reimbursements paid directly to a member of the U.S. Armed Forces. (not included in Boxes 1, 3, or 5)
                                        </option>

                                        <option value="Q">Q — Nontaxable combat pay. See the instructions for Form 1040 or Form 1040A for details on reporting this amount.</option>

                                        <option value="R">
                                            R — Employer contributions to your Archer medical savings account (MSA). Report on Form 8853:, Archer MSAs and Long-Term Care Insurance
                                            Contracts.
                                        </option>

                                        <option value="S">S — Employee salary reduction contributions under a Section 408(p) SIMPLE. (Not included in Box 1)</option>

                                        <option value="T">
                                            T — Adoption benefits (not included in Box 1). Complete Form 8839:, Qualified Adoption Expenses, to compute any taxable and nontaxable
                                            amounts.
                                        </option>

                                        <option value="V">
                                            V — Income from exercise of non-statutory stock option(s) (included in Boxes 1, 3 (up to Social Security wage base), and 5). See
                                            Publication 525, Taxable and Nontaxable Income, for reporting requirements.
                                        </option>

                                        <option value="W">
                                            W — Employer contributions (including amounts the employee elected to contribute using a Section 125 cafeteria plan) to your health
                                            savings account (HSA).
                                        </option>

                                        <option value="Y">Y — Deferrals under a Section 409A nonqualified deferred compensation plan.</option>
                                        <option value="Z">
                                            Z — Income under a nonqualified deferred compensation plan that fails to satisfy Section 409A. This amount is also included in Box 1 and
                                            is subject to an additional 20% tax plus interest. See Form 1040 instructions for more information.
                                        </option>

                                        <option value="AA">AA — Designated Roth contribution under a 401(k) plan. </option>

                                        <option value="BB">BB — Designated Roth contributions under a 403(b) plan.</option>

                                        <option value="CC">CC — For employer use only.</option>

                                        <option value="DD">DD — Cost of employer-sponsored health coverage.</option>

                                        <option value="EE">
                                            EE — Designated Roth contributions under a governmental 457(b) plan. This amount doesn’t apply to contributions under a tax-exempt
                                            organization Section 457(b) plan.
                                        </option>

                                        <option value="FF">FF — Permitted benefits under a qualified small employer health reimbursement arrangement.</option>

                                        <option value="GG">GG — Income from qualified equity grants under section 83(i).</option>

                                        <option value="HH">HH — Aggregate deferrals under section 83(i) elections as of the close of the calendar year.</option>
                                    </select>

                                    <input
                                        defaultValue={props?.stepThree?.taxCode_12a.amount}
                                        placeholder="0.00"
                                        onChange={e =>
                                            props.stepThreeFn({
                                                ...props?.stepThree,
                                                taxCode_12a: {
                                                    ...props?.stepThree.taxCode_12a,
                                                    amount: e.target.value,
                                                },
                                                // taxCode_12a.amount: e.target.value,
                                            })
                                        }
                                    />
                                </Row>
                                <Row className="block-example border border-dark">
                                    <Typography style={{ fontSize: 10, fontWeight: 'bold' }}>12.b</Typography>
                                    <select
                                        placeholder="Number of Dependants"
                                        autoComplete="off"
                                        className="form-control"
                                        name="taxCode_12b"
                                        onChange={e =>
                                            props.stepThreeFn({
                                                ...props?.stepThree,
                                                taxCode_12b: {
                                                    ...props?.stepThree.taxCode_12b,
                                                    taxCode: e.target.value,
                                                },
                                                // taxCode_12a.amount: e.target.value,
                                            })
                                        }
                                        defaultValue={props?.stepThree?.taxCode_12b.taxCode}
                                    >
                                        <option value="">Select</option>
                                        <option value="A"> A — Uncollected Social Security or RRTA tax on tips. Include this tax on Form 1040 Schedule 4 line 58.</option>

                                        <option value="B">B — Uncollected Medicare tax on tips. Include this tax on Form 1040 Schedule 4 line 58.</option>
                                        <option value="C">
                                            C — Taxable costs of group-term life insurance over $50,000 (included in W-2 boxes 1,3 (up to Social Security wages base), and box 5.
                                        </option>
                                        <option value="D">D — Elective deferral under a 401(k) cash or arrangement plan. This includes a SIMPLE 401(k) arrangement.</option>
                                        <option value="E">E — Elective deferrals under a Section 403(b) salary reduction agreement.</option>
                                        <option value="F">F — Elective deferrals under a Section 408(k)(6) salary reduction SEP.</option>
                                        <option value="G">5</option>

                                        <option value="H">
                                            G — Elective deferrals and employer contributions (including non-elective deferrals) to a Section 457(b) deferred compensation plan.
                                        </option>

                                        <option value="I">H — Elective deferrals to a Section 501(c)(18)(D) tax-exempt organization plan.</option>

                                        <option value="J">J — Nontaxable sick pay (information only, not included in W-2 boxes 1, 3, or 5).</option>

                                        <option value="K">K — 20% excise tax on excess golden parachute payments.</option>

                                        <option value="L">L — Substantiated employee business expense reimbursements (nontaxable).</option>

                                        <option value="M">
                                            M — Uncollected Social Security or RRTA tax on taxable cost of group-term life insurance over $50,000 (former employees only).
                                        </option>

                                        <option value="N">N — Uncollected Medicare tax on taxable cost of group-term life insurance over $50,000 (former employees only).</option>

                                        <option value="P">
                                            P — Excludable moving expense reimbursements paid directly to a member of the U.S. Armed Forces. (not included in Boxes 1, 3, or 5)
                                        </option>

                                        <option value="Q">Q — Nontaxable combat pay. See the instructions for Form 1040 or Form 1040A for details on reporting this amount.</option>

                                        <option value="R">
                                            R — Employer contributions to your Archer medical savings account (MSA). Report on Form 8853:, Archer MSAs and Long-Term Care Insurance
                                            Contracts.
                                        </option>

                                        <option value="S">S — Employee salary reduction contributions under a Section 408(p) SIMPLE. (Not included in Box 1)</option>

                                        <option value="T">
                                            T — Adoption benefits (not included in Box 1). Complete Form 8839:, Qualified Adoption Expenses, to compute any taxable and nontaxable
                                            amounts.
                                        </option>

                                        <option value="V">
                                            V — Income from exercise of non-statutory stock option(s) (included in Boxes 1, 3 (up to Social Security wage base), and 5). See
                                            Publication 525, Taxable and Nontaxable Income, for reporting requirements.
                                        </option>

                                        <option value="W">
                                            W — Employer contributions (including amounts the employee elected to contribute using a Section 125 cafeteria plan) to your health
                                            savings account (HSA).
                                        </option>

                                        <option value="Y">Y — Deferrals under a Section 409A nonqualified deferred compensation plan.</option>
                                        <option value="Z">
                                            Z — Income under a nonqualified deferred compensation plan that fails to satisfy Section 409A. This amount is also included in Box 1 and
                                            is subject to an additional 20% tax plus interest. See Form 1040 instructions for more information.
                                        </option>

                                        <option value="AA">AA — Designated Roth contribution under a 401(k) plan. </option>

                                        <option value="BB">BB — Designated Roth contributions under a 403(b) plan.</option>

                                        <option value="CC">CC — For employer use only.</option>

                                        <option value="DD">DD — Cost of employer-sponsored health coverage.</option>

                                        <option value="EE">
                                            EE — Designated Roth contributions under a governmental 457(b) plan. This amount doesn’t apply to contributions under a tax-exempt
                                            organization Section 457(b) plan.
                                        </option>

                                        <option value="FF">FF — Permitted benefits under a qualified small employer health reimbursement arrangement.</option>

                                        <option value="GG">GG — Income from qualified equity grants under section 83(i).</option>

                                        <option value="HH">HH — Aggregate deferrals under section 83(i) elections as of the close of the calendar year.</option>
                                    </select>

                                    <input
                                        defaultValue={props?.stepThree?.taxCode_12b.amount}
                                        placeholder="0.00"
                                        onChange={e =>
                                            props.stepThreeFn({
                                                ...props?.stepThree,
                                                taxCode_12b: {
                                                    ...props?.stepThree.taxCode_12b,
                                                    amount: e.target.value,
                                                },
                                                // taxCode_12a.amount: e.target.value,
                                            })
                                        }
                                    />
                                </Row>
                                <Row className="block-example border ">
                                    <Typography style={{ fontSize: 10, fontWeight: 'bold' }}>12.c</Typography>
                                    <select
                                        placeholder="Number of Dependants"
                                        autoComplete="off"
                                        className="form-control"
                                        name="taxCode_12c"
                                        onChange={e =>
                                            props.stepThreeFn({
                                                ...props?.stepThree,
                                                taxCode_12c: {
                                                    ...props?.stepThree.taxCode_12c,
                                                    taxCode: e.target.value,
                                                },
                                                // taxCode_12a.amount: e.target.value,
                                            })
                                        }
                                        defaultValue={props?.stepThree?.taxCode_12c.taxCode}
                                    >
                                        <option value="">Select</option>
                                        <option value="A"> A — Uncollected Social Security or RRTA tax on tips. Include this tax on Form 1040 Schedule 4 line 58.</option>

                                        <option value="B">B — Uncollected Medicare tax on tips. Include this tax on Form 1040 Schedule 4 line 58.</option>
                                        <option value="C">
                                            C — Taxable costs of group-term life insurance over $50,000 (included in W-2 boxes 1,3 (up to Social Security wages base), and box 5.
                                        </option>
                                        <option value="D">D — Elective deferral under a 401(k) cash or arrangement plan. This includes a SIMPLE 401(k) arrangement.</option>
                                        <option value="E">E — Elective deferrals under a Section 403(b) salary reduction agreement.</option>
                                        <option value="F">F — Elective deferrals under a Section 408(k)(6) salary reduction SEP.</option>
                                        <option value="G">5</option>

                                        <option value="H">
                                            G — Elective deferrals and employer contributions (including non-elective deferrals) to a Section 457(b) deferred compensation plan.
                                        </option>

                                        <option value="I">H — Elective deferrals to a Section 501(c)(18)(D) tax-exempt organization plan.</option>

                                        <option value="J">J — Nontaxable sick pay (information only, not included in W-2 boxes 1, 3, or 5).</option>

                                        <option value="K">K — 20% excise tax on excess golden parachute payments.</option>

                                        <option value="L">L — Substantiated employee business expense reimbursements (nontaxable).</option>

                                        <option value="M">
                                            M — Uncollected Social Security or RRTA tax on taxable cost of group-term life insurance over $50,000 (former employees only).
                                        </option>

                                        <option value="N">N — Uncollected Medicare tax on taxable cost of group-term life insurance over $50,000 (former employees only).</option>

                                        <option value="P">
                                            P — Excludable moving expense reimbursements paid directly to a member of the U.S. Armed Forces. (not included in Boxes 1, 3, or 5)
                                        </option>

                                        <option value="Q">Q — Nontaxable combat pay. See the instructions for Form 1040 or Form 1040A for details on reporting this amount.</option>

                                        <option value="R">
                                            R — Employer contributions to your Archer medical savings account (MSA). Report on Form 8853:, Archer MSAs and Long-Term Care Insurance
                                            Contracts.
                                        </option>

                                        <option value="S">S — Employee salary reduction contributions under a Section 408(p) SIMPLE. (Not included in Box 1)</option>

                                        <option value="T">
                                            T — Adoption benefits (not included in Box 1). Complete Form 8839:, Qualified Adoption Expenses, to compute any taxable and nontaxable
                                            amounts.
                                        </option>

                                        <option value="V">
                                            V — Income from exercise of non-statutory stock option(s) (included in Boxes 1, 3 (up to Social Security wage base), and 5). See
                                            Publication 525, Taxable and Nontaxable Income, for reporting requirements.
                                        </option>

                                        <option value="W">
                                            W — Employer contributions (including amounts the employee elected to contribute using a Section 125 cafeteria plan) to your health
                                            savings account (HSA).
                                        </option>

                                        <option value="Y">Y — Deferrals under a Section 409A nonqualified deferred compensation plan.</option>
                                        <option value="Z">
                                            Z — Income under a nonqualified deferred compensation plan that fails to satisfy Section 409A. This amount is also included in Box 1 and
                                            is subject to an additional 20% tax plus interest. See Form 1040 instructions for more information.
                                        </option>

                                        <option value="AA">AA — Designated Roth contribution under a 401(k) plan. </option>

                                        <option value="BB">BB — Designated Roth contributions under a 403(b) plan.</option>

                                        <option value="CC">CC — For employer use only.</option>

                                        <option value="DD">DD — Cost of employer-sponsored health coverage.</option>

                                        <option value="EE">
                                            EE — Designated Roth contributions under a governmental 457(b) plan. This amount doesn’t apply to contributions under a tax-exempt
                                            organization Section 457(b) plan.
                                        </option>

                                        <option value="FF">FF — Permitted benefits under a qualified small employer health reimbursement arrangement.</option>

                                        <option value="GG">GG — Income from qualified equity grants under section 83(i).</option>

                                        <option value="HH">HH — Aggregate deferrals under section 83(i) elections as of the close of the calendar year.</option>
                                    </select>

                                    <input
                                        defaultValue={props?.stepThree?.taxCode_12c.amount}
                                        placeholder="0.00"
                                        onChange={e =>
                                            props.stepThreeFn({
                                                ...props?.stepThree,
                                                taxCode_12c: {
                                                    ...props?.stepThree.taxCode_12c,
                                                    amount: e.target.value,
                                                },
                                                // taxCode_12a.amount: e.target.value,
                                            })
                                        }
                                    />
                                </Row>
                                <Row className="block-example border border-dark">
                                    <Typography style={{ fontSize: 10, fontWeight: 'bold' }}>12.d</Typography>
                                    <select
                                        placeholder="Number of Dependants"
                                        autoComplete="off"
                                        className="form-control"
                                        name="taxCode_12d"
                                        onChange={e =>
                                            props.stepThreeFn({
                                                ...props?.stepThree,
                                                taxCode_12d: {
                                                    ...props?.stepThree.taxCode_12d,
                                                    taxCode: e.target.value,
                                                },
                                                // taxCode_12a.amount: e.target.value,
                                            })
                                        }
                                        defaultValue={props?.stepThree?.taxCode_12d.taxCode}
                                    >
                                        <option value="">Select</option>
                                        <option value="A"> A — Uncollected Social Security or RRTA tax on tips. Include this tax on Form 1040 Schedule 4 line 58.</option>

                                        <option value="B">B — Uncollected Medicare tax on tips. Include this tax on Form 1040 Schedule 4 line 58.</option>
                                        <option value="C">
                                            C — Taxable costs of group-term life insurance over $50,000 (included in W-2 boxes 1,3 (up to Social Security wages base), and box 5.
                                        </option>
                                        <option value="D">D — Elective deferral under a 401(k) cash or arrangement plan. This includes a SIMPLE 401(k) arrangement.</option>
                                        <option value="E">E — Elective deferrals under a Section 403(b) salary reduction agreement.</option>
                                        <option value="F">F — Elective deferrals under a Section 408(k)(6) salary reduction SEP.</option>
                                        <option value="G">5</option>

                                        <option value="H">
                                            G — Elective deferrals and employer contributions (including non-elective deferrals) to a Section 457(b) deferred compensation plan.
                                        </option>

                                        <option value="I">H — Elective deferrals to a Section 501(c)(18)(D) tax-exempt organization plan.</option>

                                        <option value="J">J — Nontaxable sick pay (information only, not included in W-2 boxes 1, 3, or 5).</option>

                                        <option value="K">K — 20% excise tax on excess golden parachute payments.</option>

                                        <option value="L">L — Substantiated employee business expense reimbursements (nontaxable).</option>

                                        <option value="M">
                                            M — Uncollected Social Security or RRTA tax on taxable cost of group-term life insurance over $50,000 (former employees only).
                                        </option>

                                        <option value="N">N — Uncollected Medicare tax on taxable cost of group-term life insurance over $50,000 (former employees only).</option>

                                        <option value="P">
                                            P — Excludable moving expense reimbursements paid directly to a member of the U.S. Armed Forces. (not included in Boxes 1, 3, or 5)
                                        </option>

                                        <option value="Q">Q — Nontaxable combat pay. See the instructions for Form 1040 or Form 1040A for details on reporting this amount.</option>

                                        <option value="R">
                                            R — Employer contributions to your Archer medical savings account (MSA). Report on Form 8853:, Archer MSAs and Long-Term Care Insurance
                                            Contracts.
                                        </option>

                                        <option value="S">S — Employee salary reduction contributions under a Section 408(p) SIMPLE. (Not included in Box 1)</option>

                                        <option value="T">
                                            T — Adoption benefits (not included in Box 1). Complete Form 8839:, Qualified Adoption Expenses, to compute any taxable and nontaxable
                                            amounts.
                                        </option>

                                        <option value="V">
                                            V — Income from exercise of non-statutory stock option(s) (included in Boxes 1, 3 (up to Social Security wage base), and 5). See
                                            Publication 525, Taxable and Nontaxable Income, for reporting requirements.
                                        </option>

                                        <option value="W">
                                            W — Employer contributions (including amounts the employee elected to contribute using a Section 125 cafeteria plan) to your health
                                            savings account (HSA).
                                        </option>

                                        <option value="Y">Y — Deferrals under a Section 409A nonqualified deferred compensation plan.</option>
                                        <option value="Z">
                                            Z — Income under a nonqualified deferred compensation plan that fails to satisfy Section 409A. This amount is also included in Box 1 and
                                            is subject to an additional 20% tax plus interest. See Form 1040 instructions for more information.
                                        </option>

                                        <option value="AA">AA — Designated Roth contribution under a 401(k) plan. </option>

                                        <option value="BB">BB — Designated Roth contributions under a 403(b) plan.</option>

                                        <option value="CC">CC — For employer use only.</option>

                                        <option value="DD">DD — Cost of employer-sponsored health coverage.</option>

                                        <option value="EE">
                                            EE — Designated Roth contributions under a governmental 457(b) plan. This amount doesn’t apply to contributions under a tax-exempt
                                            organization Section 457(b) plan.
                                        </option>

                                        <option value="FF">FF — Permitted benefits under a qualified small employer health reimbursement arrangement.</option>

                                        <option value="GG">GG — Income from qualified equity grants under section 83(i).</option>

                                        <option value="HH">HH — Aggregate deferrals under section 83(i) elections as of the close of the calendar year.</option>
                                    </select>

                                    <Typography style={{ fontSize: 10, fontWeight: 'bold' }}></Typography>
                                    <input
                                        placeholder="0.00"
                                        defaultValue={props?.stepThree?.taxCode_12d.amount}
                                        onChange={e =>
                                            props.stepThreeFn({
                                                ...props?.stepThree,
                                                taxCode_12d: {
                                                    ...props?.stepThree.taxCode_12d,
                                                    amount: e.target.value,
                                                },
                                                // taxCode_12a.amount: e.target.value,
                                            })
                                        }
                                    />
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="block-example border border-dark" md={1} xs={4}>
                                <Typography style={{ fontSize: 8, fontWeight: 'bold' }}>15. State</Typography>
                                <select
                                    style={{ width: 40 }}
                                    placeholder="Select State"
                                    autoComplete="off"
                                    className="form-control "
                                    id="employee_state"
                                    name="employee_state"
                                    defaultValue={props?.stepTwo?.employee_state}
                                    onChange={e =>
                                        props.stepTwoFn({
                                            ...props?.stepTwo,
                                            employee_state: e.target.value,
                                        })
                                    }
                                >
                                    <option value="">Select State</option>
                                    {getAllStates()}
                                </select>
                            </Col>
                            <Col className="block-example border border-dark" md={2} xs={4}>
                                <Typography style={{ fontSize: 10, fontWeight: 'bold' }}>Employer's State ID Number:</Typography>
                                <input
                                    defaultValue={props?.stepOne?.company_state_id_number}
                                    onChange={e =>
                                        props.stepOneFn({
                                            ...props?.stepOne,
                                            company_state_id_number: e.target.value,
                                        })
                                    }
                                    style={{ width: 100 }}
                                />
                            </Col>
                            <Col className="block-example border border-dark" md={2} xs={4}>
                                <Typography style={{ fontSize: 9, fontWeight: 'bold' }}>16.States,Wages,etc</Typography>

                                <input
                                    placeholder="0.00"
                                    style={{ width: 80 }}
                                    defaultValue={props?.response?.social_security}
                                    onChange={e =>
                                        props.responseFn({
                                            ...props?.response,
                                            social_security: e.target.value,
                                        })
                                    }
                                />
                            </Col>
                            <Col className="block-example border border-dark" md={2} xs={4}>
                                <Typography style={{ fontSize: 9, fontWeight: 'bold' }}>17.State Income tax</Typography>

                                <input
                                    placeholder="0.00"
                                    style={{ width: 80 }}
                                    defaultValue={props?.response?.state_income_tax}
                                    onChange={e =>
                                        props.responseFn({
                                            ...props?.response,
                                            state_income_tax: e.target.value,
                                        })
                                    }
                                />
                            </Col>
                            <Col className="block-example border border-dark" md={2} xs={4}>
                                <Typography style={{ fontSize: 9, fontWeight: 'bold' }}>18.Local wages,tips,etc</Typography>
                                <input
                                    placeholder="0.00"
                                    style={{ width: 100 }}
                                    defaultValue={props?.extras?.local_wages}
                                    onChange={e =>
                                        props.extrasFn({
                                            ...props?.extras,
                                            local_wages: e.target.value,
                                        })
                                    }
                                />
                            </Col>
                            <Col className="block-example border border-dark" md={2} xs={4}>
                                <Typography style={{ fontSize: 9, fontWeight: 'bold' }}>19.Local Income tax</Typography>
                                <input
                                    placeholder="0.00"
                                    style={{ width: 100 }}
                                    defaultValue={props?.extras?.local_income_tax}
                                    onChange={e =>
                                        props.extrasFn({
                                            ...props?.extras,
                                            local_income_tax: e.target.value,
                                        })
                                    }
                                />
                            </Col>
                            <Col className="block-example border border-dark" md={1} xs={4}>
                                <Typography style={{ fontSize: 8, fontWeight: 'bold' }}>20. Loaclity Name</Typography>
                                <input
                                    placeholder="0.00"
                                    defaultValue={props?.extras?.local_name}
                                    onChange={e =>
                                        props.extrasFn({
                                            ...props?.extras,
                                            local_name: e.target.value,
                                        })
                                    }
                                />
                            </Col>
                        </Row>
                    </>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default connect(state => state, {
    stepOneFn: AC.stepOne,
    stepTwoFn: AC.stepTwo,
    stepThreeFn: AC.stepThree,
    responseFn: AC.response,
    extrasFn: AC.extras,
})(ModalW2);
