import {takeEvery, put, all} from 'redux-saga/effects';
import { Constants } from '../Constants';


function* getAcceptList(){
    let data ='';


    yield put({type: Constants.ACCEPT_OFFER_LIST_REDUCER, data})
}

function* AcceptOfferSaga() {
    yield takeEvery(Constants.ACCEPT_OFFER_LIST, getAcceptList);
}


export default AcceptOfferSaga;