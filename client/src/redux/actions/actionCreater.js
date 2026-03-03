import AT from "./actionTypes";

const step1 = (payload) => {
  return {
    type: AT.STEP_1,
    payload,
  };
};
const step2 = (payload) => {
  return {
    type: AT.STEP_2,
    payload,
  };
};
const step3 = (payload) => {
  return {
    type: AT.STEP_3,
    payload,
  };
};
const loading = (payload) => {
  return {
    type: AT.LOADING,
    payload,
  };
};
const state = (payload) => {
  return {
    type: AT.STATE,
    payload,
  };
};
const employementStatus = (payload) => {
  return {
    type: AT.EMPLOYEMENT,
    payload,
  };
};
const imageUpload = (payload) => {
  return {
    type: AT.IMAGE_UPLOAD,
    payload,
  };
};
const paid = (payload) => {
  return {
    type: AT.PAID,
    payload,
  };
};
const payFrequency = (payload) => {
  return {
    type: AT.PAY_FREQUENCY,
    payload,
  };
};
const stepOne = (payload) => {
  return {
    type: AT.STEP_ONE,
    payload,
  };
};

const stepTwo = (payload) => {
  return {
    type: AT.STEP_TWO,
    payload,
  };
};

const stepThree = (payload) => {
  return {
    type: AT.STEP_THREE,
    payload,
  };
};
const response = (payload) => {
  return {
    type: AT.RESPONSE,
    payload,
  };
};
const extras = (payload) => {
  return {
    type: AT.EXTRAS,
    payload,
  };
};
const getUserDataSuccess = (userData) => {
  return {
    type: AT.GET_USER_DATA_SUCCESS,
    payload: userData,
  };
};
const getPaystubData = (paystubData) => {
  return {
    type: AT.GET_PAYSTUB_DATA,
    payload: paystubData,
  };
};

export default {
  step1,
  step2,
  step3,
  loading,
  state,
  employementStatus,
  paid,
  imageUpload,
  payFrequency,
  stepOne,
  stepTwo,
  stepThree,
  response,
  extras,
  getUserDataSuccess,
  getPaystubData
};
