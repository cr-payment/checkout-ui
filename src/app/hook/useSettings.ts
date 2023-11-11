import React from "react";
import { useLocalStorageValue } from "@react-hookz/web";
import { Percent } from "sdk/entities/percent";
import { CUSTOM_RPC_ENDPOINTS, DEFAULT_RPC, LocalStorageKey, NetworkEnv } from "utils/constant";

type RawSettings = {
  slippageTolerance: number;
  networkEnv: string;
  customRPC: string;
};

export type Settings = {
  slippageTolerance: Percent;
  networkEnv: NetworkEnv;
  customRPC: string;
};

export type UpdateSettings = (s: Partial<Settings>) => void;

export const DEFAULT_SETTINGS: Settings = {
  slippageTolerance: new Percent(50, 10_000),
  networkEnv: NetworkEnv.TESTNET,
  customRPC: DEFAULT_RPC,
};

function serialize(s: Settings): RawSettings {
  return {
    ...s,
    customRPC: CUSTOM_RPC_ENDPOINTS.includes(s.customRPC) ? s.customRPC : DEFAULT_SETTINGS.customRPC,
    slippageTolerance: Number(s.slippageTolerance.numerator) / Number(s.slippageTolerance.denominator),
  };
}

function deserialize(s: RawSettings): Settings {
  return {
    ...DEFAULT_SETTINGS,
    ...s,
    slippageTolerance: new Percent(Math.floor(s.slippageTolerance * 10_000), 10_000),
    customRPC: s.customRPC || DEFAULT_SETTINGS.customRPC,
    networkEnv: DEFAULT_SETTINGS.networkEnv,
    // networkEnv: (s.networkEnv as NetworkEnv) ?? DEFAULT_SETTINGS.networkEnv,
  };
}

export function useSettings(): [Settings, UpdateSettings] {
  const { value: rawSettings, set: setRawSettings } = useLocalStorageValue<RawSettings | undefined>(
    LocalStorageKey.SETTINGS,
    {
      defaultValue: serialize(DEFAULT_SETTINGS),
      initializeWithValue: false,
    },
  );

  const settings: Settings | null = React.useMemo(() => {
    if (!rawSettings) {
      return null;
    }
    return deserialize(rawSettings);
  }, [rawSettings]);

  const updateSetting: UpdateSettings = React.useCallback(
    (s) => {
      setRawSettings((prev: RawSettings | undefined | null) => {
        if (!prev) {
          return serialize(Object.assign(DEFAULT_SETTINGS, s));
        }
        const newSetting = Object.assign(deserialize(prev), s);
        return serialize(newSetting);
      });
    },
    [setRawSettings],
  );

  return [settings ?? DEFAULT_SETTINGS, updateSetting];
}
