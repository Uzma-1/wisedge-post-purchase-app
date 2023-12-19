import { Constants } from "../Constants"

export const EditAcceptAction = (data) => {
    return{
        type: Constants.EDIT_ACCEPT_PRO_SUCCESS,
        data: data
    }
}

export const EditAcceptProModal = (data) =>{
    return{
        type: Constants.EDIT_ACCEPT_PRO_REQUEST,
        data: data
    }
}

export const EditAcceptUpsellAction = (data) => {
    return {
        type: Constants.EDIT_UPSELL_ACCEPT_REQUEST,
        data
    }
}