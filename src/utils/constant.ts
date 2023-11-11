import { FC } from "react";

export const WISP_CONFIG = {
  dex: {
    swapPackage: "0x6c4a21e3e7e6b6d51c4604021633e1d97e24e37a696f8c082cd48f37503e602a",
    swapModulePool: "pool",
    swapModuleRouter: "router",
    swapController: "0xf8fdf7c74d6f084e45092423b937679c2b702b3ce561362dae3494c2826e5862",
    swapSetting: "0x33dad3c4a8ec662326d69d94151ab157e26e621830cce125e97965a0111c37c4",
    functions: {
      createPool: "create_pool_",
      addLiquidity: "add_liquidity_",
      removeLiquidity: "remove_liquidity_",
      zapIn: "zap_in_",
      swapExactInput: "swap_exact_input_",
      swapExactOutput: "swap_exact_output_",
      swapExactInputDoubleHop: "swap_exact_input_doublehop_",
      swapExactOutputDoubleHop: "swap_exact_output_doublehop_",
      setFeeTo: "set_fee_to_",
      mint: "mint_for_testing",
    },
  },
  prediction: {
    // owner: "0x3f3b11a18ffe59368cb935771df277ac531bf60b9a0a201c78e9d1aabe7bc214",
    packageObject: "0xa0d6f9d848a04bdba7f308aaedcfa92bfb3432fa2f81e1166559d83c74bc17f6",
    moduleName: "prediction",
    controller: "0x255f41757ff5d5e25f0bc4cfd9d1b838d4b15ab52ee9ca16a0c0b29c41d9cfaa",
    market: "0x5dc151c5c49fc19411329609d34f62b966bf3cd758582b2d5d2d6c3903ec2b5c",
    coin: "0x92cfde55a8021634e8377b07831d18b624f819f6a88d26dbe16a4a0979aaa1a7::wispSUI::WISPSUI",
    functions: {
      betBull: "bet_bull_",
      betBear: "bet_bear_",
      unBet: "un_bet_",
      claim: "claim_",
    },
  },
  veWisp: {
    package: "0x355c9aca89cf96343fd5ad5e22b40d78c57994d5d36ae06189bb12a052d648a3",
    module: "vewisp",
    name: "VEWISP",
  },
  wisp: {
    package: "0x355c9aca89cf96343fd5ad5e22b40d78c57994d5d36ae06189bb12a052d648a3",
    module: "wisp",
    name: "WISP",
  },
  farm: {
    spNFT: {
      packageObject: "0x185e3de1e4b96fd253d24adc441d97a540500fd3abf5b52954e18843622c484b",
      module: "spnft",
      name: "SpNFT",
    },
    package: "0x185e3de1e4b96fd253d24adc441d97a540500fd3abf5b52954e18843622c484b",
    module: "farm",
    registry: "0xffcb9c61eb15086452dab86a85db067e8b3cd8e67406431c70a5f717f8f2a40b",
    controller: "0x4b8c99923a7c26263f39606a7bcbe0a90397ec92217d0b90c4a1ecb206fd05c3",
    wispPackage: "0x355c9aca89cf96343fd5ad5e22b40d78c57994d5d36ae06189bb12a052d648a3",
    functions: {
      createSpNft: "create_sp_nft",
      stake: "stake",
      unstake: "unstake",
      boost: "boost",
      unboost: "unboost",
      claimReward: "claim_reward",
    },
  },
  vesting: {
    package: "0x6b1f528d5c05f24648b29dee04ef1e54b0256aca6ff5a90cb84d9dc9868e2623",
    module: "vesting",
    registry: "0xe0fe53dbd00898225f5aedb8908023faeb552d3a0644e0e2945e7d175c12f910",
    controller: "0x3ef58dfaf55f18b201d09886da393d0a31571dacd4172bbbb9335579f24915cc",
    functions: {
      wispToVewisp: "wisp_to_vewisp",
      createVestingVeWispNft: "create_vesting_vewisp_nft",
      emergencyWithdrawVeWisp: "emergency_withdraw_vewisp",
      redeemWisp: "redeem_wisp",
    },
    milestones: [
      {
        ms: 60000,
        percent: 30,
      },
      {
        ms: 120000,
        percent: 50,
      },
      {
        ms: 180000,
        percent: 100,
      },
    ],
  },
  lsd: {
    package: "0xcfa8a607c6d99aa3ea8d5474a0443e141cee1cfe5ad6e288a428f52cf441a9de",
    registry: "0x6c56f66099b83416ac77e0f79f9cb66e5c1bb9a9be8a239cdd8786eefd67d8eb",
    adminCap: "0xbed7d5435e15fd48be835c00b0dc4eb559fb2284502454c2f3a82f7f890af9f0",
    wispSuiTreasury: "0xdade077e02da6c74ca161a34dab017b38d061144d622e7a8b1a93efb63e7c3d3",
    aggregatorReg: "0xb1ab5d3bf2a5152fdee275fd6ac4d8734ba06b1301d7075f0ab542c1b6a96b89",
  },
};

export enum PATH {
  TRADE = "/",
  POOL = "/pools",
  YIELD = "/earn/yield-farming",
  VE_WISP = "/earn/vewisp",
  PREDICTION = "/prediction",
  WISPPOINT = "/wisppoint",
  // IDO = "/ido",
  ADD_LIQUIDITY = "/pools/add-liquidity",
  REMOVE_LIQUIDITY = "/pools/remove-liquidity",
  BRIDGE = "/bridge",
  WORMHOLE = "/bridge/wormhole",
  LSDFI = "/lsd-fi",
}

export const LANDING_PAGE = "https://wispswap.io";

export type NavigationItem = {
  title: string;
  path?: PATH;
  children?: NavigationItem[];
  icon?: FC;
};

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { title: "Trade", path: PATH.TRADE },
  { title: "Pools", path: PATH.POOL },
  {
    title: "Earn",
    children: [
      {
        title: "Yield Farming",
        path: PATH.YIELD,
      },
      {
        title: "veWisp",
        path: PATH.VE_WISP,
      },
    ],
  },
  { title: "Prediction", path: PATH.PREDICTION },
  {
    title: "Bridge",
    children: [
      {
        title: "Celer",
        path: PATH.BRIDGE,
      },
      {
        title: "Wormhole",
        path: PATH.WORMHOLE,
      },
    ],
  },
  { title: "LSDfi", path: PATH.LSDFI },
  // { title: "IDO", path: PATH.IDO, icon: FlameIcon },
];

export enum LocalStorageKey {
  SETTINGS = "wisp-settings",
}

export enum NetworkEnv {
  MAINNET = "sui:mainnet",
  TESTNET = "sui:testnet",
  DEVNET = "sui:devnet",
}

export const networkInfo: Record<string, string> = {
  [NetworkEnv.DEVNET]: "Sui Devnet",
  [NetworkEnv.TESTNET]: "Sui Testnet",
  // [NetworkEnv.MAINNET]: "Sui Mainnet",
};

export const OPEN_SUI_WALLET = "OpenSui Wallet";

export const DEFAULT_RPC = "https://fullnode.testnet.sui.io:443/";

export const CUSTOM_RPCS = [
  {
    name: "Public Sui Testnet",
    rpc: DEFAULT_RPC,
  },
  {
    name: "Shinami",
    rpc: "https://node.shinami.com/api/v1/sui_testnet_d26f8937d384856b1a62778a01faf35a",
  },
  {
    name: "BlockVision",
    rpc: "https://sui-testnet.blockvision.org/v1/2PVVjrTJIfPuG6J0YNMNutrvAcW",
  },
];

export const CUSTOM_RPC_ENDPOINTS = CUSTOM_RPCS.map((rpc) => rpc.rpc);
