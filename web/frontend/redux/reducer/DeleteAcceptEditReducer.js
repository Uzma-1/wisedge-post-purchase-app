import { Constants } from "../Constants";

const initialState = {
    deleteAcceptEditData : []
}

export const DeleteAcceptEditReducer = (state = initialState, action) => {
    switch (action.type) {
        case Constants.DELETE_ACCEPT_EDIT_REQUEST:
            return{
                ...state,
                deleteAcceptEditData: action.data
            }
        case Constants.DELETE_ACCEPT_EDIT_SUCCESS:
            return{
                ...state,
                deleteAcceptEditData: action.data
            }
            
        default:
            return state;
    }
}