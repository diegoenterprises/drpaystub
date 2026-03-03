import { Typography } from '@material-ui/core';
import React, { Component, useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { connect } from 'react-redux';
import * as yup from 'yup';
import InputMask from 'react-input-mask';

import useYupValidationResolver from '../../../HelperFunctions/UseYupValidation';
import './PayStubForm.scss';
import AC from '../../../redux/actions/actionCreater';
import { states } from './states';

function Step2(props) {
    const [data, setData] = useState(states);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const validationSchema = useMemo(
        () =>
            yup.object({
                employee_state: yup.string().required('State is required'),
                employment_status: yup.string().nullable().required('Employment status is required'),
                employee_name: yup.string().required('Employment Name is required'),
                ssid: yup.string().required('Employmee SSN is required'),
            }),
        [],
    );
    const resolver = useYupValidationResolver(validationSchema);
    const { handleSubmit, register, errors, control } = useForm({
        defaultValues: validationSchema.cast({
            employment_status: props.employementStatus,
        }),
        resolver,
    });
    const onSubmit = data => {
        props.selectedState(data.state);
        props.step2Fn(data);
        props.changeStep(3);
    };

    const getAllStates = () => {
        let us_state_options;
        if (data && data.length > 0) {
            us_state_options = data.map(state => {
                return <option value={state.name}>{state.name.substring(0, 1).toUpperCase() + state.name.substring(1).toLowerCase()}</option>;
            });
        }
        return us_state_options;
    };
    let content = props.content;

    return (
        <div className="PayStubForm formStep mt-3">
            <form onSubmit={handleSubmit(onSubmit)}>
                <span className="badge badge-pill badge-soft-primary">Step 2</span>
                <h2>{props.employementStatus == 'Employee' ? 'Employee' : 'Contractor'} Information</h2>
                <hr />
                <Typography>Note:</Typography>
                <Typography style={{ fontStyle: 'italic', fontSize: 13 }}>
                    <span style={{ color: 'red' }}>*</span> marked fields are mandatory, the rest are optional
                </Typography>
                <br />

                <div className="form-group required" style={{ width: '100%' }}>
                    <label className="label-input">Employment status</label>
                    <div className="position-relative">
                        <div className="form-check-inline">
                            <label className="form-check-label">
                                <input
                                    type="radio"
                                    ref={register}
                                    className={'form-check-input form-radio pl-5' + (errors.employment_status ? 'is-invalid' : '')}
                                    name="employment_status"
                                    onChange={e => props.employementStatusFn(e.target.value)}
                                    // checked={content.employmentStatus == 'Employee' ? true : false}
                                    value="Employee"
                                    // required
                                />
                                Employee
                            </label>
                        </div>
                        <div className="form-check-inline">
                            <label className="form-check-label">
                                <input
                                    ref={register}
                                    type="radio"
                                    className={'form-check-input form-radio pl-5' + (errors.employment_status ? 'is-invalid' : '')}
                                    name="employment_status"
                                    onChange={e => props.employementStatusFn(e.target.value)}
                                    // checked={content.employmentStatus == 'Contractor' ? true : false}
                                    value="Contractor"
                                    // required
                                />
                                Contractor
                            </label>
                        </div>
                        <small id="passwordHelp" className="text-danger">
                            {errors.employment_status && <span>{errors.employment_status.message}</span>}
                        </small>
                    </div>
                </div>
                <div className="form-group required" style={{ width: '100%' }}>
                    <label htmlFor="employee_name" className="label-input">
                        {props.employementStatus == 'Employee' ? 'Employee' : 'Contractor'} Name
                    </label>
                    <input
                        ref={register}
                        type="text"
                        className={'form-control ' + (errors.employee_name ? 'is-invalid' : '')}
                        defaultValue={props.step2.employee_name}
                        placeholder="Diego Usoro"
                        id="employee_name"
                        name="employee_name"
                        // value={content.employee_name}
                        // onChange={e => props.handleChange(e, 2)}
                        // required
                    />
                    <small id="passwordHelp" className="text-danger">
                        {errors.employee_name && <span>{errors.employee_name.message}</span>}
                    </small>
                </div>
                <div className="form-group required" style={{ width: '100%' }}>
                    <label htmlFor="empoyeeSSN" className="label-input">
                        {props.employementStatus == 'Employee' ? 'Employee' : 'Contractor'} SSN (Last 4 Digits)
                    </label>
                    {/* <input
                        type="text"
                        ref={register}
                        className={'form-control ' + (errors.ssid ? 'is-invalid' : '')}
                        placeholder="XXX-XX-____"
                        id="ssid"
                        name="ssid"
                        // value={content.ssid}
                        // onChange={e => props.handleChange(e, 2)}
                        maxLength="11"
                        //onBlur={this.validateEmployeeSSN}
                        // required
                    /> */}
                    <Controller
                        as={InputMask}
                        control={control}
                        className={'form-control ' + (errors.ssid ? 'is-invalid' : '')}
                        defaultValue={props.step2.ssid}
                        placeholder="XXX-XX-____"
                        mask="XXX-XX-9999"
                        name="ssid"
                        //   defaultValue={user.cpf}
                    />
                    <small id="passwordHelp" className="text-danger">
                        {errors.ssid && <span>{errors.ssid.message}</span>}
                    </small>
                </div>
                <div className="form-group" style={{ width: '100%' }}>
                    <label htmlFor="employee_address">
                        Address <span className="text-muted">(Optional)</span>
                    </label>
                    <input
                        ref={register}
                        type="text"
                        defaultValue={props.step2.employee_address}
                        className="form-control"
                        placeholder="Ex. 10000 Spice Ln"
                        id="employee_address"
                        name="employee_address"
                        // value={content.employee_address}
                        onChange={e => props.handleChange(e, 2)}
                    />
                </div>
                <div className="form-group" style={{ width: '100%' }}>
                    <label htmlFor="employee_address">
                        Address 2 <span className="text-muted">(Optional)</span>
                    </label>
                    <input
                        ref={register}
                        type="text"
                        defaultValue={props.step2.employee_address_2}
                        className="form-control"
                        placeholder="Ex. Unit #713"
                        id="employee_address_2"
                        name="employee_address_2"
                        // value={content.employee_address}
                        onChange={e => props.handleChange(e, 2)}
                    />
                </div>
                <div className="form-group" style={{ width: '100%' }}>
                    <label htmlFor="employee_city">
                        City <span className="text-muted">(Optional)</span>
                    </label>
                    <input
                        ref={register}
                        type="text"
                        defaultValue={props.step2.employee_city}
                        className="form-control"
                        placeholder="Houston"
                        id="employee_city"
                        name="employee_city"
                        // value={content.employee_address}
                        onChange={e => props.handleChange(e, 2)}
                    />
                </div>
                <div className="form-group required" style={{ width: '100%' }}>
                    <label htmlFor="employee_state" className="label-input">
                        Select your state{' '}
                    </label>
                    <select
                        ref={register}
                        placeholder="Select State"
                        autoComplete="off"
                        defaultValue={props.state}
                        className={'form-control ' + (errors.state ? 'is-invalid' : '')}
                        id="employee_state"
                        name="employee_state"
                        // onChange={(e) => {props.handleChange(e, 2)}}
                        // value={content.state}
                    >
                        <option value="">Select State</option>
                        {getAllStates()}
                    </select>
                    <small id="passwordHelp" className="text-danger">
                        {errors.state && <span>{errors.state.message}</span>}
                    </small>
                </div>
                <div className="form-group" style={{ width: '100%' }}>
                    <label htmlFor="employeeZipCode">
                        Zip code <span className="text-muted">(Optional)</span>
                    </label>
                    <input
                        ref={register}
                        type="number"
                        className="form-control"
                        placeholder="Ex. 77072"
                        id="employeeZipCode"
                        defaultValue={props.step2.employeeZipCode}
                        name="employeeZipCode"
                        value={content.employeeZipCode}
                        onChange={e => props.handleChange(e, 2)}
                        max="99999"
                        min="10000"
                    />
                </div>
                <div className="form-group" style={{ width: '100%' }}>
                    <label htmlFor="employee_Id">
                        {props.employementStatus == 'Employee' ? 'Employee' : 'Contractor'} ID <span className="text-muted">(Optional)</span>
                    </label>
                    <input
                        ref={register}
                        type="number"
                        className="form-control"
                        defaultValue={props.step2.employee_Id}
                        placeholder="Ex. 123457"
                        id="employee_Id"
                        name="employee_Id"
                        value={content.employee_Id}
                        onChange={e => props.handleChange(e, 2)}
                    />
                </div>
                <div className="form-group" style={{ width: '100%' }}>
                    <label htmlFor="martialStatus">
                        Martial Status <span className="text-muted">(Optional)</span>
                    </label>
                    <select
                        ref={register}
                        placeholder="State"
                        autoComplete="off"
                        defaultValue={props.step2.maritial_status}
                        className="form-control"
                        id="maritial_status"
                        name="maritial_status"
                        // value={content.martialStatus}
                        // onChange={e => props.handleChange(e, 2)}
                    >
                        <option value="Single Taxpayers">Single</option>
                        <option value="Married Jointly & Surviving Spouses">Married</option>
                        <option value="Married Filing Separately">Married and living separately</option>
                        <option value="Head of Household">Head on Household</option>
                    </select>
                </div>
                <div className="form-group" style={{ width: '100%' }}>
                    <label htmlFor="noOfDependants">
                        Number Of Dependants <span className="text-muted">(Optional)</span>
                    </label>
                    <select
                        ref={register}
                        placeholder="Number of Dependants"
                        autoComplete="off"
                        defaultValue={props.step2.noOfDependants}
                        className="form-control"
                        id="noOfDependants"
                        name="noOfDependants"
                        value={content.noOfDependants}
                        onChange={e => props.handleChange(e, 2)}
                    >
                        <option value="">Select Dependants</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9+">9+</option>
                    </select>
                </div>
                <div className="form-group" style={{ width: '100%' }}>
                    <label htmlFor="blindExemptions">
                        Age 65+ / Blind Exemptions <span className="text-muted">(Optional)</span>
                    </label>
                    <select
                        ref={register}
                        placeholder="Blind exemptions if any"
                        defaultValue={props.step2.blindExemptions}
                        autoComplete="off"
                        className="form-control"
                        id="blindExemptions"
                        name="blindExemptions"
                        value={content.blindExemptions}
                        onChange={e => props.handleChange(e, 2)}
                    >
                        <option value="">Select Exemptions</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9+">9+</option>
                    </select>
                </div>

                <div className="text-center mt-4">
                    <button type="submit" className="btn btn-secondary">
                        Salary Information <i className="fa fa-chevron-right"></i>
                    </button>
                    <p className="text-muted mt-3">
                        <small>You can always go back to the previous step to edit your information!</small>
                    </p>
                </div>
            </form>
        </div>
    );
}
export default connect(state => state, {
    step2Fn: AC.step2,
    selectedState: AC.state,
    employementStatusFn: AC.employementStatus,
})(Step2);
