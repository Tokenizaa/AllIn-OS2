import { useState } from 'react';

export interface StoreSettings {
  whatsapp: string;
  sponsorLink: string;
  storeName?: string;
  storeSlug?: string;
}

const defaultSettings: StoreSettings = {
  whatsapp: '',
  sponsorLink: '',
  storeName: '',
  storeSlug: '',
};

// Sprint 2: Migrar StoreSettingsProvider para hook simples
// Este é um estado de UI local, não dados do banco
export function useStoreSettings() {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
  };

  return {
    settings,
    updateSettings,
    whatsapp: settings.whatsapp,
    sponsorLink: settings.sponsorLink,
  };
}
