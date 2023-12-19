import {takeEvery, put, all} from 'redux-saga/effects';
import { Constants } from '../Constants';
import { useAuthenticatedFetch } from '../../hooks';


function* getDeclineList(){
    // const fetch = useAuthenticatedFetch();
    // let data = yield fetch("/api/graphql");
    // data = yield data.json();

    let data ='';


    yield put({type: Constants.DECLINE_OFFER_LIST_REDUCER, data})
}

function* DeclineOfferSaga() {
    yield takeEvery(Constants.DECLINE_OFFER_LIST, getDeclineList);
}


export default DeclineOfferSaga;