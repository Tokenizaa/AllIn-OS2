/**
 * Customer Sync Service
 * 
 * Serviço para sync de clientes da API Allin.
 */

import { BaseSyncService } from './base-sync.service';
import { allinService } from '../allin/allin.service';
import { CustomerMapper, LocalCustomer } from './mappers/customer.mapper';
import { SyncResult } from './dto/sync-result.dto';
import { CustomerRepository } from '../../modules/customers/repositories/customer.repository';

export class CustomerSyncService extends BaseSyncService<LocalCustomer> {
  private customerRepository: CustomerRepository;

  constructor(config?: { batchSize?: number; maxRetries?: number; retryDelayMs?: number }) {
    super(config);
    this.customerRepository = new CustomerRepository();
  }

  /**
   * Obtém nome da entidade
   */
  protected getEntityName(): string {
    return 'customers';
  }

  /**
   * Mapeia dados da API Allin para entidade local
   */
  protected mapFromAllin(data: any): LocalCustomer {
    return CustomerMapper.fromAllin(data);
  }

  /**
   * Executa sync de clientes
   */
  public async sync(params?: { incremental?: boolean; since?: Date }): Promise<SyncResult> {
    const result = this.createSyncResult();
    
    try {
      console.log('[CustomerSync] Starting sync...');
      
      // Busca clientes da API Allin
      const allinCustomers = await this.executeWithRetry(
        () => allinService.getClientes(),
        'Fetch customers from AllIn'
      );
      
      console.log(`[CustomerSync] Fetched ${allinCustomers.length} customers from AllIn`);
      
      // Converte para formato local
      const localCustomers = CustomerMapper.fromAllinArray(allinCustomers);
      
      // Processa todos os clientes
      await this.processAllBatches(
        localCustomers,
        async (customer) => await this.processCustomer(customer, params),
        result
      );
      
      console.log(`[CustomerSync] Sync completed: ${result.processedRecords} processed, ${result.failedRecords} failed`);
      
    } catch (error) {
      this.addError(result, undefined, 'Sync failed', error as Error);
      console.error('[CustomerSync] Sync failed:', error);
    }
    
    return this.finalizeSyncResult(result);
  }

  /**
   * Processa um cliente individual
   */
  private async processCustomer(
    customer: LocalCustomer,
    params?: { incremental?: boolean; since?: Date }
  ): Promise<void> {
    try {
      // Verifica se cliente já existe localmente pelo email
      const existing = customer.email ? await this.customerRepository.findByEmail(customer.email) : null;
      
      if (existing) {
        // Atualiza cliente existente
        // Verifica se precisa de sync (para sync incremental)
        if (params?.incremental && params.since) {
          const syncThreshold = 5 * 60 * 1000; // 5 minutos
          const timeSinceLastSync = Date.now() - customer.allin_synced_at.getTime();
          
          if (timeSinceLastSync < syncThreshold) {
            // Não precisa de sync, skip
            return;
          }
        }
        
        await this.customerRepository.update(existing.id, {
          nome: customer.nome || existing.nome,
          email: customer.email || existing.email,
          telefone: customer.telefone || existing.telefone,
          cpf: customer.cpf || existing.cpf,
          cnpj: customer.cnpj || existing.cnpj,
          metadata: {
            ...existing.metadata,
            allin_id: customer.allin_id,
            allin_synced_at: customer.allin_synced_at,
          },
        });
        
        console.log(`[CustomerSync] Updated customer ${customer.allin_id}`);
      } else {
        // Cria novo cliente
        await this.customerRepository.create({
          nome: customer.nome || 'Cliente sem nome',
          email: customer.email,
          telefone: customer.telefone,
          cpf: customer.cpf,
          cnpj: customer.cnpj,
          metadata: {
            allin_id: customer.allin_id,
            allin_synced_at: customer.allin_synced_at,
          },
        });
        console.log(`[CustomerSync] Created customer ${customer.allin_id}`);
      }
    } catch (error) {
      console.error(`[CustomerSync] Failed to process customer ${customer.allin_id}:`, error);
      throw error;
    }
  }

  /**
   * Sync incremental de clientes
   */
  public async syncIncremental(since: Date): Promise<SyncResult> {
    return this.sync({ incremental: true, since });
  }
}
