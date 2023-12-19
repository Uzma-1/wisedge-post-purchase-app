import { Constants } from "../Constants";

const initialState = {
    editDeclinetData : []
}

export const EditDeclineProReducer = (state = initialState, action) => {
    switch (action.type) {
        case Constants.EDIT_DECLINE_PRO_REQUEST:
            return{
                ...state,
                editDeclinetData: action.data
            }
        case Constants.EDIT_DECLINE_PRO_SUCCESS:
            return{
                ...state,
                editDeclinetData: action.data
            }
            
        default:
            return state;
    }
}