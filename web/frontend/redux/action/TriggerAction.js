import { Constants } from "../Constants";

export const TriggerAction = (data) => {

    return {
        type: Constants.TRIGGER_PRODUCT_LISTING,
        data
    }
}