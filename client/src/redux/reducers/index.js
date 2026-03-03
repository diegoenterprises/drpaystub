import AT from "../actions/actionTypes";

const initialState = {
  step1: "",
  step2: "",
  step3: "",
  loading: false,
  state: "Not selected",
  employementStatus: "",
  paid: "",
  company_image: null,
  payFrequency: "",
  stepOne: "",
  stepTwo: "",
  stepThree: "",
  response: "",
  userData: null,
  paystubData: null,
  extras: {},
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case AT.STEP_1:
      return { ...state, step1: payload, loading: false };
    case AT.STEP_2:
      return { ...state, step2: payload, loading: false };
    case AT.STEP_3:
      return { ...state, step3: payload, loading: false };
    case AT.LOADING:
      return { ...state, loading: payload };
    case AT.STATE:
      return { ...state, state: payload };
    case AT.EMPLOYEMENT:
      return { ...state, employementStatus: payload };
    case AT.PAID:
      return { ...state, paid: payload };
    case AT.IMAGE_UPLOAD:
      return { ...state, company_image: payload };
    case AT.PAY_FREQUENCY:
      return { ...state, payFrequency: payload };
    case AT.STEP_ONE:
      return { ...state, stepOne: payload };
    case AT.STEP_TWO:
      return { ...state, stepTwo: payload };
    case AT.STEP_THREE:
      return { ...state, stepThree: payload };
    case AT.RESPONSE:
      return { ...state, response: payload };
    case AT.EXTRAS:
      return { ...state, extras: payload };
    case AT.GET_USER_DATA_SUCCESS:
      return { ...state, userData: payload };
    case AT.GET_PAYSTUB_DATA:
      return { ...state, paystubData: payload };
    default:
      return state;
  }
};
