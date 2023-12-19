import { Constants } from "../Constants";

const initialState = {
    deleteData : []
}

export const MainDeleteReducer = (state = initialState, action) => {
        switch (action.type) {
            case Constants.DELETE_REQUEST:
                return{
                    ...state,
                    deleteData: [action.data]
                }
                case Constants.DELETE_SUCCESS:
                return{
                    ...state,
                    deleteData: [action.data]
                }
        
            default:
                return state;
        }

}