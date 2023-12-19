import { Constants } from "../Constants";

const initialState = {
    upsellData : []
}

export const GetUpsellReducer = (state = initialState, action) => {
        switch (action.type) {
            case Constants.GET_UPSELL_ACTION:
                return{
                    ...state,
                    upsellData: [action.data]
                }
                case Constants.GET_UPSELL_REDUCER:
                return{
                    ...state,
                    upsellData: [action.data, ...action.data]
                }
        
            default:
                return state;
        }

}