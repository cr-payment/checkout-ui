import CoinAPI from "api/coin";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { Coin } from "sdk/entities/coin";
import { NetworkEnv } from "utils/constant";

type Props = {
  networkEnv: NetworkEnv;
  coins: Coin[];
};

export function useCoinInfos({ networkEnv, coins }: Props): Coin[] {
  const { data } = useQuery<Coin[]>(
    ["get-coin-infos", networkEnv],
    async () => {
      try {
        const resp = await CoinAPI.getCoinInfos(
          networkEnv,
          coins.map((c) => c.type),
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (resp.data ?? []).map((piece: any) => {
          return new Coin(piece.package_addr, piece.module, piece.type, piece.decimal ?? 0, piece.treasury_addr, {
            imageUrl: piece.icon_url,
            ticker: piece.symbol,
            projectName: piece.symbol,
            description: piece.description,
          });
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error(err);
        toast.error(err.message ?? "Fetching pools error");
      }
    },
    {
      enabled: coins.length > 0,
    },
  );

  return data ?? [];
}
