import { ReactElement, useMemo } from "react";
import { IWallet, useWallet } from "@suiet/wallet-kit";
import clsx from "clsx";
import { ExternalLinkIcon } from "../components/ExternalLinkIcon";
import { Modal } from "./Modal";
import partition from "lodash/partition";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const RECOMMENDED_WALLETS = ["Sui Wallet", "Martian Sui Wallet"];
const WHITELIST_WALLETS = [...RECOMMENDED_WALLETS, "Suiet", "Ethos Wallet", "Morphis Wallet"];

function WalletItem({
  wallet,
  recommended,
  onSelect,
}: {
  wallet: IWallet;
  recommended: boolean;
  onSelect: (name: string) => void;
}): ReactElement {
  return (
    <div
      className={clsx(
        "p-2 flex items-center justify-between space-x-6 rounded-lg",
        wallet.installed ? "hover:bg-pGreen-500 hover:bg-opacity-10 cursor-pointer" : "",
      )}
      onClick={wallet.installed ? (): void => onSelect(wallet.name) : undefined}
    >
      <div className="flex items-center space-x-4">
        <img alt={wallet.name} className="w-8 h-8 rounded-full shrink-0" src={wallet.iconUrl} />
        <div>
          <div className="text-pNeutral-800 font-medium">{wallet.name}</div>
          {recommended && <div className="text-sm text-pNeutral-500">(Recommended)</div>}
        </div>
      </div>
      {!wallet.installed && (
        <a
          className="bg-pGreen-500 bg-opacity-20 py-0.5 px-2 text-xs rounded-md space-x-1.5 hover:underline cursor-pointer"
          href={(wallet as IWallet).downloadUrl?.browserExtension ?? (wallet.downloadUrl as string)}
          rel="noreferrer noopener"
          target="_blank"
        >
          <span>Not installed</span>
          <ExternalLinkIcon className="h-3 w-3 inline-block align-middle" />
        </a>
      )}
    </div>
  );
}

function comperator(a: IWallet, b: IWallet): number {
  const hasA = RECOMMENDED_WALLETS.includes(a.name);
  const hasB = RECOMMENDED_WALLETS.includes(b.name);
  if (hasA && !hasB) {
    return -1;
  }
  if (hasB && !hasA) {
    return 1;
  }
  return 0;
}

export function SelectWalletModal({ isOpen, onClose }: Props): ReactElement {
  const suietWallets = useWallet();
  console.log(123, suietWallets)
  const handleSelectWallet = (name: string): void => {
    suietWallets.select(name);
    console.log(123)
    onClose();
  };

  const configuredWallets = useMemo(() => {
    const wlWallets = suietWallets.configuredWallets.filter((w) => WHITELIST_WALLETS.includes(w.name));
    const [installed, unInstalled] = partition(wlWallets, (wl) => wl.installed);
    installed.sort(comperator);
    unInstalled.sort(comperator);
    return [...installed, ...unInstalled];
  }, [suietWallets.configuredWallets]);
  console.log(configuredWallets, isOpen)
  return (
    <Modal isOpen={isOpen} title="Select Wallet" onClose={onClose}>
      <div className="space-y-0.5">
        {configuredWallets.map((wl) => (
          <WalletItem
            key={wl.name}
            recommended={RECOMMENDED_WALLETS.includes(wl.name)}
            wallet={wl}
            onSelect={handleSelectWallet}
          />
        ))}
      </div>
    </Modal>
  );
}
