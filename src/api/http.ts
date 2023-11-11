import axios from "axios";
import { NetworkEnv } from "utils/constant";

const CONFIGS = {
  TESTNET_BACKEND_URL: process.env.REACT_APP_TESTNET_BACKEND_URL,
  DEVNET_BACKEND_URL: process.env.REACT_APP_DEVNET_BACKEND_URL,
  TESTNET_WISPPOINT_URL: process.env.REACT_APP_WISPPOINT_URL,
};

const httpDevnet = axios.create({
  baseURL: CONFIGS.DEVNET_BACKEND_URL,
});

const httpTestnet = axios.create({
  baseURL: CONFIGS.TESTNET_BACKEND_URL,
});

const http = {
  [NetworkEnv.MAINNET]: httpTestnet,
  [NetworkEnv.DEVNET]: httpDevnet,
  [NetworkEnv.TESTNET]: httpTestnet,
};

export const httpWisppointTestnet = axios.create({
  baseURL: CONFIGS.TESTNET_WISPPOINT_URL,
});

export default http;
