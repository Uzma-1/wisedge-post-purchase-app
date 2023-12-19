import { Constants } from "../Constants";

const initialState = {
    declineUpsellData : []
}

export const DeclineUpsell = (state = initialState, action) => {
        switch (action.type) {
            case Constants.DECLINE_UPSELL:
                return{
                    ...state,
                    declineUpsellData: [action.data]
                }
                case Constants.DECLINE_UPSELL_LIST:
                return{
                    ...state,
                    declineUpsellData: [action.data, ...action.data]
                }
        
            default:
                return state;
        }

}