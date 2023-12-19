import { Constants } from "../Constants"


export const EditMainProModal = (data) =>{
    return{
        type: Constants.EDIT_MAIN_PRO_REQUEST,
        data: data
    }
}