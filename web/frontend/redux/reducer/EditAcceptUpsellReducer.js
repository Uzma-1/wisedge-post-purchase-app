import { Constants } from "../Constants";

const initialState = {
    editAcceptUpsellData : []
}

export const EditAcceptUpsellReducer = (state = initialState, action) => {
        switch (action.type) {
            case Constants.EDIT_UPSELL_ACCEPT_REQUEST:
                return{
                    ...state,
                    editAcceptUpsellData: [action.data]
                }
                case Constants.EDIT_UPSELL_ACCEPT_SUCCESS:
                return{
                    ...state,
                    editAcceptUpsellData: [action.data]
                }
        
            default:
                return state;
        }

}