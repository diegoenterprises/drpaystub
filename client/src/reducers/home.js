import * as actions from "../actions/types";
const initialState = {
  employmentStatus: "",
  selectedState: "",
  paidType: "",
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case actions.SET_STATE:
      return {
        ...state,
        selectedState: payload,
      };
    case actions.SET_EMPLOYMENT_STATUS:
      return {
        ...state,
        employmentStatus: payload,
      };
    case actions.SET_PAID_TYPE:
      return {
        ...state,
        paidType: payload,
      };
    default:
      return state;
  }
}
