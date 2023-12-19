import { Constants } from "../Constants";

export const DeclineUpsellAction = (data) => {

    return {
        type: Constants.DECLINE_UPSELL,
        data
    }
}