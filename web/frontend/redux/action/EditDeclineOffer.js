import { Constants } from "../Constants"

export const EditDeclineAction = (data) => {
    return{
        type: Constants.EDIT_DECLINE_PRO_SUCCESS,
        data: data
    }
}

export const EditDeclineProModal = (data) =>{
    return{
        type: Constants.EDIT_DECLINE_PRO_REQUEST,
        data: data
    }
}

export const EditDeclineUpsellAction = (data) => {
    return {
        type: Constants.EDIT_UPSELL_DECLINE_REQUEST,
        data
    }
}