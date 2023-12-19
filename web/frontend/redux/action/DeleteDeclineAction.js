import { Constants } from "../Constants"

export const DeleteDeclineRequest = (data) => {
    return{
        type: Constants.DELETE_DECLINE_PRO_REQUEST,
        data: data
    }
}

export const DeleteDeclineSuccess = (data) =>{
    return{
        type: Constants.DELETE_DECLINE_PRO_SUCCESS,
        data: data
    }
}

export const MainDeclineError = (data) => {
    return {
        type: Constants.DELETE_DECLINE_PRO_ERROR,
        data
    }
}