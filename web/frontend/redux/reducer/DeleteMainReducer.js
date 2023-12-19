import { Constants } from "../Constants";

const initialState = {
    deleteMainData : []
}

export const DeleteMainReducer = (state = initialState, action) => {
    switch (action.type) {
        case Constants.DELETE_MAIN_PRO_REQUEST:
            return{
                ...state,
                deleteMainData: action.data
            }
        case Constants.DELETE_MAIN_PRO_SUCCESS:
            return{
                ...state,
                deleteMainData: action.data
            }
            
        default:
            return state;
    }
}