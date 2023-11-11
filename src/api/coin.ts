import { AxiosResponse } from "axios";
import { NetworkEnv } from "utils/constant";

import http from "./http";

function getCoinFaucet(networkEnv: NetworkEnv): Promise<AxiosResponse> {
  return http[networkEnv].get("/swap/coins/faucet");
}

function getCoins(
  networkEnv: NetworkEnv,
  {
    searchTerm,
    page = 1,
    pageSize = 20,
    isStToken = false,
  }: {
    searchTerm: string;
    page?: number;
    pageSize?: number;
    isStToken?: boolean;
  },
): Promise<AxiosResponse> {
  return http[networkEnv].get("/swap/coins/search", {
    params: {
      searchTerm,
      page,
      pageSize,
      isStToken,
    },
  });
}

function getCoinInfos(networkEnv: NetworkEnv, coinTypes: string[]): Promise<AxiosResponse> {
  return http[networkEnv].post("/swap/coins", {
    coinTypes,
  });
}

const CoinAPI = {
  getCoinFaucet,
  getCoinInfos,
  getCoins,
};

export default CoinAPI;
