import { Constants } from "../Constants";

const initialState = {
    declineData : []
}

export const DeclineOfferReducer = (state = initialState, action) => {
        switch (action.type) {
            case Constants.DECLINE_OFFER_LIST:
                return{
                    ...state,
                    declineData: action.data
                }
                case Constants.DECLINE_OFFER_LIST_REDUCER:
                return{
                    ...state,
                    declineData: action.data
                }
        
            default:
                return state;
        }

}