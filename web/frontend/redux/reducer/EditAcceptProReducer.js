import { Constants } from "../Constants";

const initialState = {
    editAcceptData : []
}

export const EditAcceptProReducer = (state = initialState, action) => {
    switch (action.type) {
        case Constants.EDIT_ACCEPT_PRO_REQUEST:
            return{
                ...state,
                editAcceptData: action.data
            }
        case Constants.EDIT_ACCEPT_PRO_SUCCESS:
            return{
                ...state,
                editAcceptData: action.data
            }
            
        default:
            return state;
    }
}