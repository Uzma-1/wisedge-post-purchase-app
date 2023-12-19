import { put, all, takeEvery } from "redux-saga/effects";
import { Constants } from "../Constants";
import { BASE_URL } from "../../constant/Url";

function* editDeclineData(){
    // let data = yield fetch('/api/products/count');
    // data = yield data.json();

    let data ='';

    yield put({type: Constants.EDIT_DECLINE_PRO_SUCCESS, data})

}

function* EditDeclineSaga(){
    yield takeEvery(Constants.EDIT_DECLINE_PRO_REQUEST, editDeclineData)
}


export default EditDeclineSaga;