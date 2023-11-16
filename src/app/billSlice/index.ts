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
    email: 'landlala@gmail.com',
    phoneNumber: '377734044',
    countryCode: '+84',
    shopId: '123',
    shopName: 'BestStyle Shop',
    cart: [
      {name: "Mens Cotton Jacket", price: 55.99, img: "https://5.imimg.com/data5/OT/ET/MY-55314888/mens-cotton-jacket.jpg", quantity: 1},
      {name: "Mens Casual Premium Super Slim Fit T-Shirt", price: 22.3, img: "https://contents.mediadecathlon.com/p2030013/21bc83edba1413f905914292436ad434/p2030013.jpg", quantity: 2},
      {name: "WD 2TB Elements Portable External Hard Drve - USB 3.0", price: 64, img: "https://anphat.com.vn/media/product/14872_wd_elements_portable_2tb_2_5_usb_3_0_1111.jpg", quantity: 1}
    ],
    shipping: 10,
    total: 152.29,
    paidIn: 0,
    // token: 'USDT',
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
