import { Constants } from "../Constants";

const initialState = {
    deleteDeclineEditData : []
}

export const DeleteDeclineEditReducer = (state = initialState, action) => {
    switch (action.type) {
        case Constants.DELETE_DECLINE_EDIT_REQUEST:
            return{
                ...state,
                deleteDeclineEditData: action.data
            }
        case Constants.DELETE_DECLINE_EDIT_SUCCESS:
            return{
                ...state,
                deleteDeclineEditData: action.data
            }
            
        default:
            return state;
    }
}