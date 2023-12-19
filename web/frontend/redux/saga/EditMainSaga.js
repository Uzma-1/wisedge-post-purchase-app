import { put, all, takeEvery } from "redux-saga/effects";
import { Constants } from "../Constants";
import { BASE_URL } from "../../constant/Url";

function* editMainData(){
    let data ='';


    yield put({type: Constants.EDIT_MAIN_PRO_SUCCESS, data})
}

function* EditMainSaga(){
    yield takeEvery(Constants.EDIT_MAIN_PRO_REQUEST, editMainData)
}


export default EditMainSaga;