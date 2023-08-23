import {
  Config,
  CreateSessionOptions,
  CreateSessionResponse,
  PaymentStateOptions,
  PaymentStateResponse,
  SessionMetadataOptions,
  SessionMetadataResponse,
} from '../interfaces';
import axios from 'axios';
import { returnPaymentURL } from '../utils';

const checkoutAPI = 'http://localhost:3001';

export class Session {
  private readonly network: string;
  private readonly options: Config;

  constructor(network: string, options: Config) {
    this.network = network;
    this.options = options;
  }

  async create(options: CreateSessionOptions): Promise<CreateSessionResponse> {
    try {
      //NOTE: call APIs here
      const requestData = {
        ...options,
        network: this.network,
        config: this.options.config,
      };
      console.log('checkoutAPI', checkoutAPI);
      const response = await axios.post(
        `${checkoutAPI}/user/create-session`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${this.options.api_keys.private_api_key}`,
          },
        },
      );

      // const paymentURL = this.generatePaymentURL({session_id: response.data.session_id});
      console.log('response.data', response.data);
      return { ...response.data };
    } catch (error: any) {
      console.log('error', error);
      throw new Error(JSON.stringify(error.response.data, null, 2));
    }
  }

  async metadata(
    options: SessionMetadataOptions,
  ): Promise<SessionMetadataResponse> {
    try {
      //NOTE: call APIs here
      const response = await axios.get(`${checkoutAPI}/session`, {
        params: { session_id: options.session_id },
        headers: {
          Authorization: `Bearer ${this.options.api_keys.public_api_key}`,
        },
      });

      const paymentURL = this.generatePaymentURL({
        session_id: response.data.session_id,
      });
      return { ...response.data, payment_url: paymentURL };
    } catch (error: any) {
      console.log('error', error);
      throw new Error(JSON.stringify(error.response.data, null, 2));
    }
  }

  async getPaymentState(
    options: PaymentStateOptions,
  ): Promise<PaymentStateResponse> {
    try {
      //NOTE: call APIs here
      const response = await axios.get(
        `${checkoutAPI}/user/get-session/${options.session_id}`,
        {
          headers: {
            Authorization: `Bearer ${this.options.api_keys.public_api_key}`,
          },
        },
      );

      // const paymentURL = this.generatePaymentURL({session_id: response.data.session_id});
      return { ...response.data };
    } catch (error: any) {
      console.log('error', error);
      throw new Error(JSON.stringify(error.response.data, null, 2));
    }
  }

  //TODO: what does this use for ?
  generatePaymentURL(options: { session_id: string }): string {
    return returnPaymentURL(
      options.session_id,
      this.options.api_keys.public_api_key,
    );
  }
}
