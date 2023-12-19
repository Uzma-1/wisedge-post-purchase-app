import { Constants } from "../Constants";

export const AcceptOfferAction = (data) => {

    return {
        type: Constants.ACCEPT_OFFER_LIST,
        data
    }
}