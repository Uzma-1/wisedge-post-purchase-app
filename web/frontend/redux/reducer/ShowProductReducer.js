import { Constants } from "../Constants";

const initialState = {
    showProdtData : []
}

export const ShowProductReducer = (state = initialState, action) => {
        switch (action.type) {
            case Constants.SHOW_PRODUCT_LISTING:
                return{
                    ...state,
                    showProdtData: action.data
                }
                case Constants.SHOW_PRODUCT_LIST_REDUCER:
                return{
                    ...state,
                    showProdtData: action.data
                }
        
            default:
                return state;
        }

}