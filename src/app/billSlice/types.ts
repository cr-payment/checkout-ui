/* --- STATE --- */
export interface Merch {
  name: string;
  price: number;
  quantity: number;
  img: string;
}

export interface BillState {
  loading: boolean;
  billData?: BillData;
  error: boolean;
}

export interface BillData {
  name?: string;
  email?: string;
  phoneNumber?: string;
  countryCode?: string;
  shopId?: string;
  shopName?: string;
  cart: Merch[];
  shipping: number;
  total: number;
  paidIn?: number;
  token?: string;
  sessionId: number;
  merchantAddress: string;
  // transactionHash: string;
}
