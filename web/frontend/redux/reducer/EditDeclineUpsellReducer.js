import { Constants } from "../Constants";

const initialState = {
    editDeclineUpsellData : []
}

export const EditDeclineUpsellReducer = (state = initialState, action) => {
        switch (action.type) {
            case Constants.EDIT_UPSELL_DECLINE_REQUEST:
                return{
                    ...state,
                    editDeclineUpsellData: [action.data]
                }
                case Constants.EDIT_UPSELL_DECLINE_SUCCESS:
                return{
                    ...state,
                    editDeclineUpsellData: [action.data]
                }
        
            default:
                return state;
        }

}