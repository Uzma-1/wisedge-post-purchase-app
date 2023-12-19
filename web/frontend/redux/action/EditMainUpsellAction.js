import { Constants } from "../Constants";

export const EditMainUpsellAction = (data) => {

    return {
        type: Constants.EDIT_UPSELL_MAIN_REQUEST,
        data
    }
}