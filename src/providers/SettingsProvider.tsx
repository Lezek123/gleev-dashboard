import { createContext, PropsWithChildren, useState } from "react";
import SettingsWidget, { Settings } from "../components/SettingsWidget";

export const SettingsContext = createContext<Settings>({});

export const SettingsProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [gleevOperatorKey, setGleevOperatorKey] = useState<string>();
  return (
    <SettingsContext.Provider value={{ gleevOperatorKey }}>
      <SettingsWidget
        currentSettings={{ gleevOperatorKey: gleevOperatorKey || "" }}
        onSubmit={({ gleevOperatorKey }) =>
          setGleevOperatorKey(gleevOperatorKey)
        }
      />
      {children}
    </SettingsContext.Provider>
  );
};
