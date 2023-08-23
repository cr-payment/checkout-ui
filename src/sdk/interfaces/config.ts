import { CheckoutConfigEntity } from '../types';

export interface Config {
  api_keys: {
    public_api_key: string;
    private_api_key: string;
  };
  network: 'mainnet' | 'testnet';
  webhook_url?: string;
  config?: CheckoutConfigEntity;
}
