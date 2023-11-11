import { useMemo } from "react";
import { CoinBalance, Connection, JsonRpcProvider } from "@mysten/sui.js";
import uniqBy from "lodash/uniqBy";
import { useQuery } from "react-query";
import { Amount } from "sdk/entities/amount";
import { Coin } from "sdk/entities/coin";
import { CoinSet } from "sdk/utils/coinMap";
import { SUI } from "utils/coins";
import { NetworkEnv } from "utils/constant";

import { useCoinInfos } from "../../useCoinInfos";

export function useAllBalances(
  rpcEndpoint: string,
  networkEnv: NetworkEnv,
  address?: string,
): {
  fungibleBalance: Amount[];
  lpBalance: Amount[];
  isLoading: boolean;
} {
  const { data, isLoading } = useQuery(
    ["wallet-balances", address, rpcEndpoint],
    async (): Promise<[Amount[], Amount[]]> => {
      const provider = new JsonRpcProvider(
        new Connection({
          fullnode: rpcEndpoint,
        }),
      );
      const resp: CoinBalance[] = await provider.getAllBalances({
        owner: address ?? "",
      });
      let tokens: Amount[] = [];
      const lpTokens: Amount[] = [];
      for (const item of resp) {
        const type: string = item.coinType;
        const balance: bigint = BigInt(item.totalBalance);
        if (balance <= 0) {
          continue;
        }
        if (/0x[a-fA-F0-9]+::.+::.+<0x[a-fA-F0-9]+::.+::.+, 0x[a-fA-F0-9]+::.+::.+>/.test(type)) {
          // LP Token
          const coin = Coin.createLpCoin(type);
          lpTokens.push(Amount.fromRawAmount(coin, balance));
          continue;
        }
        // Normal Coin
        const coin: Coin = type === "0x2::sui:SUI" ? SUI : Coin.fromType(type);
        tokens.push(Amount.fromRawAmount(coin, balance));
      }
      const suiIdx = tokens.findIndex((t) => t.coin.equals(SUI));
      if (suiIdx !== -1) {
        const suiBlc = tokens[suiIdx];
        tokens = tokens.filter((t) => !t.coin.equals(SUI));
        tokens.unshift(suiBlc);
      }
      return [tokens, lpTokens];
    },
    { enabled: !!address },
  );

  const [fungibleBalances, lpBalances] = data ?? [null, null];

  const coins = useMemo(() => {
    const fCoin = (fungibleBalances ?? []).map((f) => f.coin);
    const lpCoin = (lpBalances ?? []).map((f) => [f.coin.coinA, f.coin.coinB] as [Coin, Coin]).flatMap((f) => f);
    return uniqBy([...fCoin, ...lpCoin], (c) => c.type);
  }, [fungibleBalances, lpBalances]);

  const coinInfos = useCoinInfos({ networkEnv, coins: coins });

  const [fBalance, lpBalance] = useMemo(() => {
    const coinSet = CoinSet.fromList(coinInfos);
    const fBlns = (fungibleBalances ?? []).map((f) => {
      const info = f.coin.equals(SUI) ? SUI : coinSet.get2(f.coin);
      return Amount.fromFractionalAmount(info ?? f.coin, f.numerator, f.denominator);
    });
    const lpBlns = (lpBalances ?? []).map((lp) => {
      const coinA = coinSet.get2(lp.coin.coinA as Coin);
      if (coinA) {
        lp.coin.coinA = coinA;
      }
      const coinB = coinSet.get2(lp.coin.coinB as Coin);
      if (coinB) {
        lp.coin.coinB = coinB;
      }
      return lp;
    });
    return [fBlns, lpBlns];
  }, [coinInfos, lpBalances, fungibleBalances]);

  return {
    fungibleBalance: fBalance,
    lpBalance: lpBalance,
    isLoading: isLoading,
  };
}
