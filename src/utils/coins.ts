import { Coin } from "sdk/entities/coin";

import { SUI_COIN_MODULE, SUI_COIN_NAME, SUI_COIN_PACKAGE } from "./../sdk/constants";
import { WISP_CONFIG } from "./constant";

export const SUI = new Coin(SUI_COIN_PACKAGE, SUI_COIN_MODULE, SUI_COIN_NAME, 9, "", {
  imageUrl: "/images/coins/sui.png",
});

export const WISP = new Coin(WISP_CONFIG.wisp.package, WISP_CONFIG.wisp.module, WISP_CONFIG.wisp.name, 9, "", {
  imageUrl: "/images/coins/wisp.png",
});

export const VeWISP = new Coin(WISP_CONFIG.veWisp.package, WISP_CONFIG.veWisp.module, WISP_CONFIG.veWisp.name, 9, "", {
  imageUrl: "/images/coins/wisp.png",
});

export const WISP_SUI = new Coin(
  "0x92cfde55a8021634e8377b07831d18b624f819f6a88d26dbe16a4a0979aaa1a7",
  "wispSUI",
  "WISPSUI",
  9,
  "",
  {
    imageUrl: "/images/coins/sui.png",
  },
);
