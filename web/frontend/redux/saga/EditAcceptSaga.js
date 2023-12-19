import { put, all, takeEvery } from "redux-saga/effects";
import { Constants } from "../Constants";

function* editAceptData(){
    let data ='';


    yield put({type: Constants.EDIT_ACCEPT_PRO_SUCCESS, data})

}

function* EditAcceptSaga(){
    yield takeEvery(Constants.EDIT_ACCEPT_PRO_REQUEST, editAceptData)
}


export default EditAcceptSaga;