export type BigintIsh = bigint | BigInt | string | number;

export enum TradeType {
  EXACT_INPUT,
  EXACT_OUTPUT,
}

export enum Rounding {
  ROUND_DOWN,
  ROUND_HALF_UP,
  ROUND_UP,
}

// SUI
export const SUI_COIN_NAME = "SUI";
export const SUI_COIN_MODULE = "sui";
export const SUI_COIN_PACKAGE = "0x2";
export const SUI_COIN_TREASURY = "0x0";
