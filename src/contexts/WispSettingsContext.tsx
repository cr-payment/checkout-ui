import { createContext, ReactElement, ReactNode, useContext, useMemo } from "react";
import { DEFAULT_SETTINGS, Settings, UpdateSettings, useSettings } from "app/hook/useSettings";

type IWispSettingsContext = {
  settings: Settings;
  updateSettings: UpdateSettings;
};

const DEFAULT_WISP_SETTINGS: IWispSettingsContext = {
  settings: DEFAULT_SETTINGS,
  updateSettings: () => {},
};

const WispSettingsContext = createContext(DEFAULT_WISP_SETTINGS);

export function WispSettingsProvider({ children }: { children: ReactNode }): ReactElement {
  const [settings, updateSettings] = useSettings();

  const contextValue = useMemo<IWispSettingsContext>(() => {
    return {
      settings,
      updateSettings,
    };
  }, [settings, updateSettings]);

  return <WispSettingsContext.Provider value={contextValue}>{children}</WispSettingsContext.Provider>;
}

export function useWispSettings(): IWispSettingsContext {
  return useContext(WispSettingsContext);
}
