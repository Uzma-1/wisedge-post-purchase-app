import { Constants } from "../Constants"

export const DeleteMainRequest = (data) => {
    return{
        type: Constants.DELETE_MAIN_PRO_REQUEST,
        data: data
    }
}

export const DeleteMainSuccess = (data) =>{
    return{
        type: Constants.DELETE_MAIN_PRO_SUCCESS,
        data: data
    }
}

export const MainDeleteError = (data) => {
    return {
        type: Constants.DELETE_MAIN_PRO_ERROR,
        data
    }
}