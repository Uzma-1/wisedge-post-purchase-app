import { Constants } from "../Constants";

const initialState = {
    upsellData : []
}

export const AcceptUpsell = (state = initialState, action) => {
        switch (action.type) {
            case Constants.ACCPET_UPSELL:
                return{
                    ...state,
                    upsellData: [action.data]
                }
                case Constants.ACCPET_UPSELL_LIST:
                return{
                    ...state,
                    upsellData: [action.data, ...action.data]
                }
        
            default:
                return state;
        }

}