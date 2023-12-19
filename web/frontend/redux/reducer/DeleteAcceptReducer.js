import { Constants } from "../Constants";

const initialState = {
    deleteAcceptData : []
}

export const DeleteAcceptReducer = (state = initialState, action) => {
    switch (action.type) {
        case Constants.DELETE_ACCEPT_PRO_REQUEST:
            return{
                ...state,
                deleteAcceptData: action.data
            }
        case Constants.DELETE_ACCEPT_PRO_SUCCESS:
            return{
                ...state,
                deleteAcceptData: action.data
            }
            
        default:
            return state;
    }
}