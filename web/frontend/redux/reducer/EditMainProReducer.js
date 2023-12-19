import { Constants } from "../Constants";

const initialState = {
    editMainData : []
}

export const EditMainProReducer = (state = initialState, action) => {
    switch (action.type) {
        case Constants.EDIT_MAIN_PRO_REQUEST:
            return{
                ...state,
                editMainData: action.data
            }
        case Constants.EDIT_MAIN_PRO_SUCCESS:
            return{
                ...state,
                editMainData: action.data
            }
            
        default:
            return state;
    }
}