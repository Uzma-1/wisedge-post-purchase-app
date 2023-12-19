import { Constants } from "../Constants"

export const DeleteAcceptEditRequest = (data) => {
    return{
        type: Constants.DELETE_ACCEPT_EDIT_REQUEST,
        data: data
    }
}

export const DeleteAcceptEditSuccess = (data) =>{
    return{
        type: Constants.DELETE_ACCEPT_EDIT_SUCCESS,
        data: data
    }
}

export const AcceptDeleteEditError = (data) => {
    return {
        type: Constants.DELETE_ACCEPT_EDIT_ERROR,
        data
    }
}