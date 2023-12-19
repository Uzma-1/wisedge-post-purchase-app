import { Constants } from "../Constants"

export const DeleteDeclineEditRequest = (data) => {
    return{
        type: Constants.DELETE_DECLINE_EDIT_REQUEST,
        data: data
    }
}

export const DeleteDeclineEditSuccess = (data) =>{
    return{
        type: Constants.DELETE_DECLINE_EDIT_SUCCESS,
        data: data
    }
}

export const DeclineDeleteEditError = (data) => {
    return {
        type: Constants.DELETE_DECLINE_EDIT_ERROR,
        data
    }
}