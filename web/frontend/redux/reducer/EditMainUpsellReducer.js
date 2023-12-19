import { Constants } from "../Constants";

const initialState = {
    editMainUpsellData : []
}

export const EditMainUpsellReducer = (state = initialState, action) => {
        switch (action.type) {
            case Constants.EDIT_UPSELL_MAIN_REQUEST:
                return{
                    ...state,
                    editMainUpsellData: [action.data]
                }
                case Constants.EDIT_UPSELL_MAIN_SUCCESS:
                return{
                    ...state,
                    editMainUpsellData: [action.data]
                }
        
            default:
                return state;
        }

}