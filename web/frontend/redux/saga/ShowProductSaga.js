import {takeEvery, put, all} from 'redux-saga/effects';
import { Constants } from '../Constants';
import { BASE_URL } from '../../constant/Url';

function* getShowProductList(){
    let data ='';

    yield put({type: Constants.SHOW_PRODUCT_LIST_REDUCER, data})
}

function* ShowProductSaga() {
    yield takeEvery(Constants.SHOW_PRODUCT_LISTING, getShowProductList);
}


export default ShowProductSaga;