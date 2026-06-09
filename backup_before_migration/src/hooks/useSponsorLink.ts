import { useStoreSettings } from '../contexts/StoreSettingsContext';

export const useSponsorLink = () => {
  const { settings } = useStoreSettings();

  const handleCadastro = () => {
    if (settings.sponsorLink) {
      window.open(settings.sponsorLink, '_blank');
    }
  };

  return { handleCadastro };
};
