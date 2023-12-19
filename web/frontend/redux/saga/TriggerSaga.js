import {takeEvery, put, all} from 'redux-saga/effects';
import { Constants } from '../Constants';
import { BASE_URL } from '../../constant/Url';


function* getTriggerData(){

    let data ='';


    yield put({type: Constants.TRIGGER_PRODUCT_REDUCER, data})
}

function* TriggerSaga() {
    yield takeEvery(Constants.TRIGGER_PRODUCT_LISTING, getTriggerData);
}


export default TriggerSaga;