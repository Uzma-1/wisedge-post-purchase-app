import { Constants } from "../Constants";

const initialState = {
    productData : []
}

export const ProductReducer = (state = initialState, action) => {
        switch (action.type) {
            case Constants.PRODUCT_LIST:
                return{
                    ...state,
                    productData: action.data
                }
                case Constants.PRODUCT_LIST_REDUCER:
                return{
                    ...state,
                    productData: action.data
                }
        
            default:
                return state;
        }

}