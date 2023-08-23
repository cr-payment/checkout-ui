export interface CreateSessionOptions {
  itemId: string;
  amount: string;

  //TODO: convert to camelCase
  token_address?: string;
  success_url?: string; // ?
  cancel_url?: string; // ?
  shipping_fees?: number;
  discounts?: any;
  custom_data?: any;
  metadata?: {
    [k: string]: unknown;
  };
}

export interface CreateSessionResponse {
  session_id: string;
  payment_url: string;
}

export interface SessionMetadataOptions {
  session_id: string;
}

export interface SessionMetadataResponse {
  session_id: string;
  merchant_id: string;
  merchant_name: string;
  customer: string;
  customer_email: string;
  items: any[]; //TODO
  tokens?: any[]; //TODO
  amount: number;
  network: string;
  shipping_fees?: number;
  discounts?: any; //TODO
  custom_data?: any; //TODO ?
  success_url: string;
  cancel_url: string;
  status: string;
  signature?: string;
  expire_after: string;
  timestamp: string;
  created_at: string;
  is_expired: boolean;
}

export interface PaymentStateOptions {
  session_id: string;
}

export interface PaymentStateResponse {
  session_id: string;
  status: string;
}
export interface CreatePaymentURLOptions {
  session_id: string;
}
