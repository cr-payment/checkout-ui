import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { billSaga } from './saga';
import { BillData, BillState } from './types';
import { stat } from 'fs';

// state này cho các trạng thái loading, error, success
// BillData mới chứa dữ liệu
export const initialState: BillState = {
  loading: false,
  billData: {
    name: 'Lala Land',
    email: ' @gmail.com',
    number: '0987654321',
    shopId: '123',
    shopName: 'BestStyle Shop',
    cart: [],
    shipping: 0,
    total: 0,
    paidIn: 0,
    token: 'USDT',
    merchantAddress: '0x6aFA060280D8ee3ca242A65993d3deCF0Bdef27b',
    sessionId: 0,
  },
  error: false,
};

const slice = createSlice({
  name: 'bill',
  initialState,
  reducers: {
    someAction(state, action: PayloadAction<any>) {},
    billRequest(state, action: PayloadAction<any>) {
      state.loading = true;
    },
    billRequestSuccess(state, action: PayloadAction<BillData>) {
      state.loading = false;
      //
      state.billData = action.payload;
      // calculate total
      // let total = state.billData.shipping;
      // state.billData.cart.forEach(item => {
      //   total += item.price * item.quantity;
      // });
      // state.billData.total = total;
    },
    billRequestError(state) {
      state.loading = false;
      state.error = true;
    },
  },
});

export const { actions: billActions } = slice;

export const useBillSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: billSaga });
  return { actions: slice.actions };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useBillSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
