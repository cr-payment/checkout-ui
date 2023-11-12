import { createContext, ReactElement, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { TransactionBlock } from "@mysten/sui.js";
import { useWallet } from "@suiet/wallet-kit";
import { SelectWalletModal } from "../app/components/SelectWalletModal";
import { useAllBalances } from "../app/hook/useAllBalances";
import { toast } from "react-toastify";
import { Amount } from "sdk/entities/amount";

import { useWispSettings } from "./WispSettingsContext";

type WalletContextValue = {
  fungibleBalances: Amount[] | null;
  lpBalances: Amount[] | null;
  isLoading: boolean;
  isBalanceLoading: boolean;
  setOpenSelectWallet: (_: boolean) => void;
  signAndExecuteTransaction: (tx: TransactionBlock) => Promise<void>;
};

type Props = {
  children: ReactNode;
};

const DEFAULT_WALLET_HELPER_VALUE: WalletContextValue = {
  fungibleBalances: null,
  lpBalances: null,
  isLoading: false,
  isBalanceLoading: false,
  setOpenSelectWallet: () => {},
  signAndExecuteTransaction: () => Promise.resolve(undefined),
};

const WalletHelperContextProvider = createContext<WalletContextValue>(DEFAULT_WALLET_HELPER_VALUE);

export function WalletHelperContext({ children }: Props): ReactElement {
  const suietWallet = useWallet();
  const { settings } = useWispSettings();

  const {
    fungibleBalance: fBalances,
    lpBalance: lpBls,
    isLoading: isBalanceLoading,
  } = useAllBalances(settings.customRPC, settings.networkEnv, suietWallet.address);

  const [isLoading, setIsLoading] = useState(false);
  const [openSelectWallet, setOpenSelectWallet] = useState(false);
  console.log("here",openSelectWallet);
  const signAndExecuteTransaction = useCallback(
    async (tx: TransactionBlock) => {
      if (!tx || isLoading) {
        return;
      }
      try {
        setIsLoading(true);
        const resp = await suietWallet.signAndExecuteTransactionBlock({ transactionBlock: tx });
        console.info("[Tx Success]: ", resp);
        if (resp) {
          const txId = resp?.digest ?? null;
          toast.success(
            txId ? (
              <div className="space-y-2">
                <p>Your transaction is submitted successfully!</p>
                <div className="flex justify-end">
                  <a
                    className="text-pGreen-400 hover:underline ml-auto"
                    href={`https://explorer.sui.io/transaction/${txId}?network=${settings.networkEnv.substring(4)}`}
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    View in explorer
                  </a>
                </div>
              </div>
            ) : (
              "Your transaction is submitted successfully!"
            ),
          );
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        console.error("[Tx Failed]: ", e);
        toast.error(e.message ?? "Unknown error");
        throw new Error(e.message ?? "Unknown error");
      } finally {
        setIsLoading(false);
      }
    },
    [suietWallet],
  );

  const contextValue: WalletContextValue = useMemo(() => {
    return {
      fungibleBalances: fBalances,
      lpBalances: lpBls,
      isLoading,
      isBalanceLoading,
      setOpenSelectWallet,
      signAndExecuteTransaction,
    };
  }, [signAndExecuteTransaction, setOpenSelectWallet, fBalances, lpBls, isBalanceLoading]);

  return (
    <WalletHelperContextProvider.Provider value={contextValue}>
      {children}
      <SelectWalletModal isOpen={openSelectWallet} onClose={(): void => setOpenSelectWallet(false)} />
    </WalletHelperContextProvider.Provider>
  );
}

export function useWalletHelper(): WalletContextValue {
  return useContext<WalletContextValue>(WalletHelperContextProvider);
}
