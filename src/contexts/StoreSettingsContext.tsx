import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface StoreSettings {
  whatsapp: string;
  sponsorLink: string;
  storeName?: string;
  storeSlug?: string;
}

interface StoreSettingsContextType {
  settings: StoreSettings;
  updateSettings: (settings: Partial<StoreSettings>) => void;
  whatsapp: string;
  sponsorLink: string;
}

const defaultSettings: StoreSettings = {
  whatsapp: '',
  sponsorLink: '',
  storeName: '',
  storeSlug: '',
};

const StoreSettingsContext = createContext<StoreSettingsContextType | undefined>(undefined);

export const StoreSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
  };

  return (
    <StoreSettingsContext.Provider value={{ settings, updateSettings, whatsapp: settings.whatsapp, sponsorLink: settings.sponsorLink }}>
      {children}
    </StoreSettingsContext.Provider>
  );
};

export const useStoreSettings = () => {
  const context = useContext(StoreSettingsContext);
  if (context === undefined) {
    return {
      settings: defaultSettings,
      updateSettings: () => {},
      whatsapp: defaultSettings.whatsapp,
      sponsorLink: defaultSettings.sponsorLink,
    };
  }
  return context;
};
