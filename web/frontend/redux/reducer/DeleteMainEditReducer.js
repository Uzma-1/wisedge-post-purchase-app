import { Constants } from "../Constants";

const initialState = {
    deleteMainEditData : []
}

export const DeleteMainEditReducer = (state = initialState, action) => {
    switch (action.type) {
        case Constants.DELETE_MAIN_EDIT_REQUEST:
            return{
                ...state,
                deleteMainEditData: action.data
            }
        case Constants.DELETE_MAIN_EDIT_SUCCESS:
            return{
                ...state,
                deleteMainEditData: action.data
            }
            
        default:
            return state;
    }
}