type SupportedSplTokens = 'usdt' | 'eth';
type MerchantEntity = {
  user_id: string;
  email: string;
  username: string;
  wallet_address: string;
  business_name: string;
  support_email: string;
  avatar: string;
  webhooks: WebhooksEntity;
};
type CheckoutItemEntity = {
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
};
type CheckoutConfigEntity = {
  collect_shipping_address: boolean;
};
type DiscountEntity = {
  collection_id: string;
  discount: number;
  name: string;
  image: string;
  marketplace_url?: string;
};
type TokensEntity = {
  tokens?: string[] | null;
};
type WebhooksEntity = {
  endpoint_id: string;
  application_id: string;
  endpoint_url: string;
  name: string;
  description: string;
};
type PricesEntity = {
  token: string;
  price: number;
};
type SessionCustomDataEntity = {
  name: string;
  image: string;
  wallet_address: string;
};

export {
  CheckoutConfigEntity,
  CheckoutItemEntity,
  DiscountEntity,
  MerchantEntity,
  PricesEntity,
  SessionCustomDataEntity,
  SupportedSplTokens,
  TokensEntity,
  WebhooksEntity,
};
