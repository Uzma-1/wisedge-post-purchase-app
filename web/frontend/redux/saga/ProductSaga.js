// import { takeEvery, put, all } from 'redux-saga/effects';
// import { Constants } from '../Constants';
// import GetComponent from '../../components/GetComponent';

// function* getProductList(action){
//     // let data = yield GetComponent();

//     // // let data ='';

//     // yield put({type: Constants.PRODUCT_LIST_REDUCER, data})

//     try {
//         const data = action.data;
//         const response = yield call(apiCall, data);
//         yield put(fetchDataSuccess(response.data));
//       } catch (error) {
//         // Dispatch the failure action if the API call encounters an error
//         yield put(fetchDataFailure(error));
//       }
// }



// function* ProductSaga() {
//     yield takeEvery(Constants.PRODUCT_LIST, getProductList);
// }


// export default ProductSaga;