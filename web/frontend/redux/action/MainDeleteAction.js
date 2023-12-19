import { Constants } from "../Constants"

export const MainDeleteAction = (data) => {
    return{
        type: Constants.MAIN_DELETE_SUCCESS,
        data: data
    }
}

export const MainDeleteProModal = (data) =>{
    return{
        type: Constants.MAIN_DELETE_REQUEST,
        data: data
    }
}

export const DeleteMainAction = (data) => {
    return {
        type: Constants.MAIN_DELETE_ERROR,
        data
    }
}