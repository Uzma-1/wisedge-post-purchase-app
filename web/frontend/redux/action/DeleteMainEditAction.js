import { Constants } from "../Constants"

export const DeleteMainEditRequest = (data) => {
    return{
        type: Constants.DELETE_MAIN_EDIT_REQUEST,
        data: data
    }
}

export const DeleteMainEditSuccess = (data) =>{
    return{
        type: Constants.DELETE_MAIN_EDIT_SUCCESS,
        data: data
    }
}

export const MainDeleteEditError = (data) => {
    return {
        type: Constants.DELETE_MAIN_EDIT_ERROR,
        data
    }
}