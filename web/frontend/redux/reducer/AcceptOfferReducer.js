import { Constants } from "../Constants";

const initialState = {
    dataShow : []
}

export const AcceptOfferReducer = (state = initialState, action) => {
        switch (action.type) {
            case Constants.ACCEPT_OFFER_LIST:
                return{
                    ...state,
                    dataShow: action.data
                }
                case Constants.ACCEPT_OFFER_LIST_REDUCER:
                return{
                    ...state,
                    dataShow: action.data
                }
        
            default:
                return state;
        }

}