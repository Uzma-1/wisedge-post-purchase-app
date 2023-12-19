import { put, all, takeEvery } from "redux-saga/effects";
import { Constants } from "../Constants";

function* deleteData(){

    let data ='';

    yield put({type: Constants.MAIN_DELETE_SUCCESS, data})

}

function* MainDeleteSaga(){
    yield takeEvery(Constants.MAIN_DELETE_REQUEST, deleteData)
}


export default MainDeleteSaga;