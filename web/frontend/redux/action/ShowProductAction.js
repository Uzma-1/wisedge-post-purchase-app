import { Constants } from "../Constants";

export const ShowProductAction = (data) => {

    return {
        type: Constants.SHOW_PRODUCT_LISTING,
        data
    }
}