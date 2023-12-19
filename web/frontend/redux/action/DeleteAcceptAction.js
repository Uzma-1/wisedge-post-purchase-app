import { Constants } from "../Constants"

export const DeleteAcceptRequest = (data) => {
    return{
        type: Constants.DELETE_ACCEPT_PRO_REQUEST,
        data: data
    }
}

export const DeleteAcceptSuccess = (data) =>{
    return{
        type: Constants.DELETE_ACCEPT_PRO_SUCCESS,
        data: data
    }
}

export const MainAcceptError = (data) => {
    return {
        type: Constants.DELETE_ACCEPT_PRO_ERROR,
        data
    }
}