// ============================================================================
// IDENTITY SERVICE - ALLIN OS 2.0
// Serviço para gerenciamento de identidade e autenticação
// ============================================================================

import { ApiClient } from '../client';
import { OAuthToken, OAuthAuthorization } from '../types';

export class IdentityService {
  constructor(private client: ApiClient) {}

  /**
   * Gera token de acesso OAuth2 usando Client Credentials
   */
  async getTokenWithClientCredentials(): Promise<OAuthToken> {
    await this.client['authenticate']();
    return {
      access_token: this.client['accessToken'] || '',
      expires_in: this.client['tokenExpiresAt'] 
        ? Math.floor((this.client['tokenExpiresAt'] - Date.now()) / 1000)
        : 0,
      token_type: 'Bearer',
      scope: null,
    };
  }

  /**
   * Gera token de acesso OAuth2 usando Password Grant
   */
  async getTokenWithPassword(username: string, password: string): Promise<OAuthToken> {
    await this.client['authenticateWithPassword'](username, password);
    return {
      access_token: this.client['accessToken'] || '',
      expires_in: this.client['tokenExpiresAt'] 
        ? Math.floor((this.client['tokenExpiresAt'] - Date.now()) / 1000)
        : 0,
      token_type: 'Bearer',
      scope: null,
    };
  }

  /**
   * Inicia fluxo de autorização OAuth2
   */
  async initiateAuthorization(params: OAuthAuthorization): Promise<string> {
    const queryString = new URLSearchParams({
      response_type: params.response_type,
      client_id: params.client_id,
      redirect_uri: params.redirect_uri,
      scope: params.scope,
      state: params.state,
      ...(params.elsl && { elsl: params.elsl }),
    }).toString();

    return `/v1/auth/authorization?${queryString}`;
  }
}
