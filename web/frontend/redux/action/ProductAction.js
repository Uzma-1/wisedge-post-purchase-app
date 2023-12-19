import { Constants } from "../Constants";

export const ProductAction = (data) => {
    return {
        type: Constants.PRODUCT_LIST,
        data
    }
}

export const ProductActionDel = () => {
    return{
        type: Constants.PRODUCT_LIST_DEL
    }
}