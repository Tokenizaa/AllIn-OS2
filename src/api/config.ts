// ============================================================================
// API CONFIG - ALLIN OS 2.0
// Configuração para integração com API AllInBrasil
// ============================================================================

import { ApiClientConfig } from './client';

export const apiConfig: ApiClientConfig = {
  baseUrl: process.env.ALLIN_API_BASE_URL || 'https://allinbrasil.com.br/api/v1',
  clientId: process.env.ALLIN_CLIENT_ID || '',
  clientSecret: process.env.ALLIN_CLIENT_SECRET || '',
  timeout: 30000,
};

export default apiConfig;
