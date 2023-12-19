import { Constants } from "../Constants";

const initialState = {
    triggerData : []
}

export const TriggerReducer = (state = initialState, action) => {
        switch (action.type) {
            case Constants.TRIGGER_PRODUCT_LISTING:
                return{
                    ...state,
                    triggerData: action.data
                }
                case Constants.TRIGGER_PRODUCT_REDUCER:
                return{
                    ...state,
                    triggerData: action.data
                }
        
            default:
                return state;
        }

}