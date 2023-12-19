import { Constants } from "../Constants";

export const DeclineOfferAction = (data) => {

    return {
        type: Constants.DECLINE_OFFER_LIST,
        data
    }
}