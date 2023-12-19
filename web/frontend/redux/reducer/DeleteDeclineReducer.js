import { Constants } from "../Constants";

const initialState = {
    deleteDeclineData : []
}

export const DeleteDeclineReducer = (state = initialState, action) => {
    switch (action.type) {
        case Constants.DELETE_ACCEPT_PRO_REQUEST:
            return{
                ...state,
                deleteDeclineData: action.data
            }
        case Constants.DELETE_ACCEPT_PRO_SUCCESS:
            return{
                ...state,
                deleteDeclineData: action.data
            }
            
        default:
            return state;
    }
}