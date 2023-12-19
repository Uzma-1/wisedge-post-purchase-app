import { Constants } from "../Constants"

export const EditMainAction = (data) => {
    return{
        type: Constants.EDIT_MAIN_PRO_SUCCESS,
        data: data
    }
}