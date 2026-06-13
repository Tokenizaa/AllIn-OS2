// ============================================================================
// API INTEGRATION - ALLIN OS 2.0
// Ponto de entrada para integração com API AllInBrasil
// ============================================================================

import { ApiClient, ApiClientConfig } from './client';
import { IdentityService } from './services/identity.service';
import { LocationService } from './services/location.service';
import { CRMService } from './services/crm.service';
import { MLMService } from './services/mlm.service';
import { CommerceService } from './services/commerce.service';
import { LogisticsService } from './services/logistics.service';
import { FinanceService } from './services/finance.service';
import { SystemService } from './services/system.service';

export class AllInAPI {
  private client: ApiClient;
  
  public readonly identity: IdentityService;
  public readonly location: LocationService;
  public readonly crm: CRMService;
  public readonly mlm: MLMService;
  public readonly commerce: CommerceService;
  public readonly logistics: LogisticsService;
  public readonly finance: FinanceService;
  public readonly system: SystemService;

  constructor(config: ApiClientConfig) {
    this.client = new ApiClient(config);
    
    this.identity = new IdentityService(this.client);
    this.location = new LocationService(this.client);
    this.crm = new CRMService(this.client);
    this.mlm = new MLMService(this.client);
    this.commerce = new CommerceService(this.client);
    this.logistics = new LogisticsService(this.client);
    this.finance = new FinanceService(this.client);
    this.system = new SystemService(this.client);
  }

  /**
   * Inicializa a sessão autenticada
   */
  async initialize(): Promise<void> {
    await this.identity.getTokenWithClientCredentials();
  }

  /**
   * Inicializa uma sessão autenticada com credenciais de usuário
   */
  async initializeWithCredentials(username: string, password: string): Promise<void> {
    await this.identity.getTokenWithPassword(username, password);
  }
}

export * from './client';
export * from './types';
export * from './services/identity.service';
export * from './services/location.service';
export * from './services/crm.service';
export * from './services/mlm.service';
export * from './services/commerce.service';
export * from './services/logistics.service';
export * from './services/finance.service';
export * from './services/system.service';
