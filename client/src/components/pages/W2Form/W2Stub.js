import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import CheckBoxRoundedIcon from '@material-ui/icons/CheckBoxRounded';
import W2Form from './w2form.jpg';

const W2Stub = React.memo(
    React.forwardRef((props, ref) => {
        const state = useSelector(state => state);

        return (
            <div ref={ref} id="w2-form">
                <img src={W2Form} />
                <div class="ssn">
                    <input disabled defaultValue={state.stepTwo?.employee_ssn} />
                </div>
                <div class="ein">
                    <input disabled defaultValue={state.stepOne?.employer_ein} />
                </div>
                <div class="e-name">
                    <input disabled defaultValue={state.stepTwo?.employee_name} />
                </div>
                <div class="e-address">
                    <input disabled defaultValue={state.stepTwo?.employee_address} />
                </div>
                <div class="e-zip-code">
                    <input disabled defaultValue={state.stepTwo?.employee_zipCode} />
                </div>
                <div class="control-number">
                    <input disabled defaultValue={state.stepOne?.company_control_number} />
                </div>
                <div class="e-name2">
                    <input disabled defaultValue={state.stepTwo?.employee_name} />
                </div>
                <div class="e-address2">
                    <input disabled defaultValue={state.stepTwo?.employee_address} />
                </div>
                <div class="e-zip-code2">
                    <input disabled defaultValue={state.stepTwo?.employee_zipCode} />
                </div>
                <div class="state">
                    <input disabled defaultValue={state.stepTwo?.employee_state} />
                </div>
                <div class="wages">
                    <input disabled defaultValue={state?.response?.other_compensation} />
                </div>

                <div class="federel-tax">
                    <input disabled defaultValue={state?.response?.federal_income_tax} />
                </div>
                <div class="social-wages">
                    <input disabled defaultValue={state?.response?.other_compensation} />
                </div>
                <div class="social-tax">
                    <input disabled defaultValue={state?.response?.social_security} />
                </div>
                <div class="medicare-wages">
                    <input disabled defaultValue={state?.response?.other_compensation} />
                </div>
                <div class="madicare-tax">
                    <input disabled defaultValue={state?.response?.medicare} />
                </div>
                <div class="social-tips">
                    <input disabled defaultValue={state?.response?.other_compensation} />
                </div>
                <div class="allocated-tips">
                    <input disabled defaultValue={state.stepThree?.allocated_tips} />
                </div>
                <div class="care-benefits">
                    <input disabled defaultValue={state.stepThree?.dependent_cate_benefits} />
                </div>
                <div class="e-id-number">
                    <input disabled defaultValue={state.stepOne?.company_state_id_number} />
                </div>
                <div class="state-wages-tips">
                    <input disabled defaultValue={state?.response?.social_security} />
                </div>
                <div class="income-tax">
                    <input disabled defaultValue={state?.response?.state_income_tax} />
                </div>
                <div class="local-wages">
                    <input disabled defaultValue={state.extras.local_wages} />
                </div>
                <div class="local-income-tax">
                    <input disabled defaultValue={state.extras.local_income_tax} />
                </div>
                <div class="locality-name">
                    <input disabled defaultValue={state.extras.local_name} />
                </div>
                <div class="other">
                    <input disabled defaultValue={state.extras.other} />
                </div>
                <div class="non-qualified-plans">
                    <input disabled defaultValue={state.stepThree?.non_qualified_plans} />
                </div>
                <div class="suff">
                    <input disabled defaultValue={state?.extras?.suff} value={state?.extras?.suff} />
                </div>
                <div class="tax-code-amount-a">
                    <input disabled defaultValue={state.stepThree?.taxCode_12a?.amount} />
                </div>
                <div class="tax-code-a">
                    <input disabled defaultValue={state.stepThree?.taxCode_12a?.taxCode} />
                </div>
                <div class="tax-code-amount-b">
                    <input disabled defaultValue={state.stepThree?.taxCode_12b?.amount} />
                </div>
                <div class="tax-code-b">
                    <input disabled defaultValue={state.stepThree?.taxCode_12b?.taxCode} />
                </div>
                <div class="tax-code-amount-c">
                    <input disabled defaultValue={state.stepThree?.taxCode_12c?.amount} />
                </div>
                <div class="tax-code-c">
                    <input disabled defaultValue={state.stepThree?.taxCode_12c?.taxCode} />
                </div>
                <div class="tax-code-amount-d">
                    <input disabled defaultValue={state.stepThree?.taxCode_12d?.amount} />
                </div>
                <div class="tax-code-d">
                    <input disabled defaultValue={state.stepThree?.taxCode_12d?.taxCode} />
                </div>

                <div class="checkbox-1">{state?.stepThree?.extras?.statutory_employee ? <CheckBoxRoundedIcon /> : null}</div>
                <div class="checkbox-2">{state?.stepThree?.extras?.retirement_plan ? <CheckBoxRoundedIcon /> : null}</div>
                <div class="checkbox-3">{state?.stepThree?.extras?.third_Party_sick_pay ? <CheckBoxRoundedIcon /> : null}</div>
            </div>
        );
    }),
);
export default W2Stub;
