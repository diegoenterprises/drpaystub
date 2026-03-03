import React, { useEffect, useState } from 'react';
import './Template2.css';
import { connect } from 'react-redux';
import { axios } from '../../../HelperFunctions/axios';

function Template(props) {
    const [logo, setLogo] = useState('');

    useEffect(() => {
        let [file] = props.step1.companyLogo;
        if (file) {
            (async () => {
                let imageLink = await convertToUrl(file);
                setLogo(imageLink);
            })();
        }
    }, []);

    console.log(props.step1.companyLogo);
    return (
        <div className="App">
            <div className="watermark">Dr.Paystub</div>
            <div className="d-flex align-items-start w-100  justify-content-between">
                <div>
                    <span className="text">{props.step1.companyName}</span>
                    <img style={{ width: 60, height: 60, display: 'flex', justifyContent: 'flex-start' }} src={logo} alt="Company Logo" />
                </div>
                <text className="text1"> Earning Statement</text>
            </div>
            <hr />
            <div className="Table">
                <table className="h">
                    <thead className="TableHeading">
                        <th>Employee Name</th>
                        <th>Social Sec. ID</th>
                        <th>Employee ID</th>
                        <th>Check No.</th>
                        <th>Pay Reacord</th>
                        <th>Pay Date</th>
                    </thead>
                    <tbody className="TableData">
                        <tr>
                            <td>{props.Table1[0]?.value}</td>
                            <td>{props.Table1[1]?.value}</td>
                            <td>{props.Table1[2]?.value}</td>
                            <td>{props.Table1[3]?.value}</td>
                            <td>{props.Table1[4]?.value}</td>
                            <td>{props.Table1[5]?.value}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <br />
            <hr />
            <div className="Table2">
                <table className="h">
                    <thead className="TableHeading">
                        <th>Earning</th>
                        <th>Rate</th>
                        <th>Hours</th>
                        <th>Current</th>
                        <th>Deductions</th>
                        <th>Current</th>
                        <th>Year to Date</th>
                    </thead>

                    <tbody className="TableData">
                        <tr>
                            <td className="td">{props.Table2[0]?.value}</td>
                            <td>{props.Table2[1]?.value}</td>
                            <td className="td">{props.Table2[2]?.value}</td>
                            <td>{props.Table2[3]?.value.toFixed(2)}</td>
                            <td>
                                <tr>{props.Table2[4]?.value[0]}</tr>
                                <tr>{props.Table2[4]?.value[1].substring(0, 1).toUpperCase() + props.Table2[4]?.value[1].substring(1).toLowerCase()}</tr>
                                <tr>{props.Table2[4]?.value[2]}</tr>
                                <tr>{props.Table2[4]?.value[3]}</tr>
                            </td>
                            <td>
                                <tr>{props.Table2[5]?.value[0].toFixed(2)}</tr>
                                <tr>{props.Table2[5]?.value[1].toFixed(2)}</tr>
                                <tr>{props.Table2[5]?.value[2].toFixed(2)}</tr>
                                <tr>{props.Table2[5]?.value[3].toFixed(2)}</tr>
                            </td>
                            <td>
                                <tr>{props.Table2[6]?.value[0].toFixed(2)}</tr>
                                <tr>{props.Table2[6]?.value[1].toFixed(2)}</tr>
                                <tr>{props.Table2[6]?.value[2].toFixed(2)}</tr>
                                <tr>{props.Table2[6]?.value[3].toFixed(2)}</tr>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <br />
            <hr />
            <div className="Table">
                <table className="h">
                    <thead className="TableHeading">
                        <th>YTD Gross</th>
                        <th>YTD Deductions</th>
                        <th>YTD Net Pay</th>
                        <th>Current Total</th>
                        <th>Current Deductions</th>
                        <th>Net Pay</th>
                    </thead>
                    <tbody className="TableData">
                        <tr>
                            <td>{props.Table3[0]?.value.toFixed(2)}</td>
                            <td>{props.Table3[1]?.value.toFixed(2)}</td>
                            <td>{props.Table3[2]?.value.toFixed(2)}</td>
                            <td>{props.Table3[3]?.value.toFixed(2)}</td>
                            <td>{props.Table3[4]?.value.toFixed(2)}</td>
                            <td>{props.Table3[5]?.value.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <hr />
        </div>
    );
}
export default connect(state => state, {})(Template);
