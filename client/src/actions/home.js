import * as actions from "./types";

// Set home page data
export const setHomePageData = (dataName, dataValue) => async (dispatch) => {
    if(dataName=="employmentStatus"){
        dispatch({
            type: actions.SET_EMPLOYMENT_STATUS,
            payload: dataValue,
        });
    } else if(dataName=="selectedState"){
        dispatch({
            type: actions.SET_STATE,
            payload: dataValue,
        });
    } else if(dataName=="paidType"){
        dispatch({
            type: actions.SET_PAID_TYPE,
            payload: dataValue,
        });
    }
};