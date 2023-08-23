import { take, call, put, select, takeLatest } from 'redux-saga/effects'; //
import { billActions as actions } from '.'; //
function* doSomething() {}
// function*
export function* billSaga() {
  //
  yield takeLatest(actions.someAction.type, doSomething);
}
