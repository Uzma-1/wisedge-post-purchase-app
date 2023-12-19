import { Constants } from "../Constants";

export const GetUpsellAction = (data) => {

    return {
        type: Constants.GET_UPSELL_ACTION,
        data
    }
}