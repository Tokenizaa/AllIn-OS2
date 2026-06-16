import { DistribuidorRepository, Distribuidor } from '../repositories/distributor.repository';
import { ApiClient } from '../../../../../src/api/client';
import { apiConfig } from '../../../../../src/api/config';

interface AllinDistributor {
  id: number;
  codigo: string;
  nome: string;
  usuario: string;
  email: string;
  telefone?: string;
  cpf: string;
  status: string;
  data_ativacao?: string;
  id_patrocinador?: number;
  codigo_patrocinador?: string;
  id_plano?: number;
  nome_plano?: string;
  nivel_qualificacao?: string;
  data_cadastro: string;
  data_atualizacao: string;
}

interface SyncResult {
  total: number;
  created: number;
  updated: number;
  errors: number;
  errorDetails: Array<{ id: number; error: string }>;
}

export class DistributorSyncService {
  private readonly distributorRepository = new DistribuidorRepository();
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient(apiConfig);
  }

  private log(message: string, level: 'info' | 'error' | 'debug' = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = `[DistributorSyncService]`;
    switch (level) {
      case 'error':
        console.error(`${timestamp} ${prefix} ${message}`);
        break;
      case 'debug':
        console.debug(`${timestamp} ${prefix} ${message}`);
        break;
      default:
        console.log(`${timestamp} ${prefix} ${message}`);
    }
  }

  /**
   * Synchronize all distributors from AllIn API
   */
  async syncAllDistributors(): Promise<SyncResult> {
    this.log('Starting distributor synchronization...');
    
    const result: SyncResult = {
      total: 0,
      created: 0,
      updated: 0,
      errors: 0,
      errorDetails: [],
    };

    try {
      // Authenticate with AllIn API
      await this.apiClient.authenticate();
      
      // Fetch all distributors from AllIn API
      const allinDistributors = await this.fetchAllDistributors();
      result.total = allinDistributors.length;
      
      this.log(`Fetched ${allinDistributors.length} distributors from AllIn API`);

      // Process each distributor
      for (const allinDist of allinDistributors) {
        try {
          const existingDist = await this.distributorRepository.findByAllinId(allinDist.id);
          
          if (existingDist) {
            // Update existing distributor
            await this.updateDistributor(existingDist, allinDist);
            result.updated++;
            this.log(`Updated distributor: ${allinDist.id} - ${allinDist.nome}`, 'debug');
          } else {
            // Create new distributor
            await this.createDistributor(allinDist);
            result.created++;
            this.log(`Created distributor: ${allinDist.id} - ${allinDist.nome}`, 'debug');
          }
        } catch (error) {
          result.errors++;
          result.errorDetails.push({
            id: allinDist.id,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
          this.log(`Error processing distributor ${allinDist.id}: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
        }
      }

      this.log(`Synchronization completed. Total: ${result.total}, Created: ${result.created}, Updated: ${result.updated}, Errors: ${result.errors}`);
      return result;
    } catch (error) {
      this.log(`Error during distributor synchronization: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      throw error;
    }
  }

  /**
   * Fetch all distributors from AllIn API with pagination
   */
  private async fetchAllDistributors(): Promise<AllinDistributor[]> {
    const allDistributors: AllinDistributor[] = [];
    let page = 1;
    const pageSize = 100;
    let hasMore = true;

    while (hasMore) {
      try {
        const response = await this.apiClient.getWithFilters<any>('/v1/distribuidores', {
          limit: pageSize,
          page: page,
        });

        this.log(`API Response page ${page}: ${JSON.stringify(response.data).substring(0, 200)}...`, 'debug');

        if (response.data && response.data.length > 0) {
          allDistributors.push(...response.data);
          hasMore = response.data.length === pageSize;
          page++;
        } else {
          hasMore = false;
        }
      } catch (error) {
        this.log(`Error fetching distributors page ${page}: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
        hasMore = false;
      }
    }

    return allDistributors;
  }

  /**
   * Create a new distributor from AllIn data
   */
  private async createDistributor(allinDist: AllinDistributor): Promise<void> {
    const distributor: Partial<Distribuidor> = {
      allin_id: allinDist.id,
      usuario: allinDist.usuario,
      nome: allinDist.nome,
      email: allinDist.email,
      cpf: allinDist.cpf,
      telefone: allinDist.telefone,
      status: allinDist.status,
      data_cadastro: allinDist.data_cadastro,
      patrocinador_id: allinDist.id_patrocinador ? String(allinDist.id_patrocinador) : undefined,
      ativo: allinDist.status === 'ativo',
      allin_synced_at: new Date().toISOString(),
    };

    await this.distributorRepository.create(distributor);
  }

  /**
   * Update an existing distributor with AllIn data
   */
  private async updateDistributor(existing: Distribuidor, allinDist: AllinDistributor): Promise<void> {
    const updateData: Partial<Distribuidor> = {
      usuario: allinDist.usuario,
      nome: allinDist.nome,
      email: allinDist.email,
      cpf: allinDist.cpf,
      telefone: allinDist.telefone,
      status: allinDist.status,
      patrocinador_id: allinDist.id_patrocinador ? String(allinDist.id_patrocinador) : existing.patrocinador_id,
      ativo: allinDist.status === 'ativo',
      allin_synced_at: new Date().toISOString(),
    };

    await this.distributorRepository.update(existing.id, updateData);
  }

  /**
   * Synchronize a single distributor by AllIn ID
   */
  async syncDistributorById(allinId: number): Promise<Distribuidor | null> {
    this.log(`Syncing distributor with AllIn ID: ${allinId}`);
    
    try {
      await this.apiClient.authenticate();
      
      const response = await this.apiClient.get<AllinDistributor>(`/v1/distribuidores/${allinId}`);
      const allinDist = response.data;
      
      const existingDist = await this.distributorRepository.findByAllinId(allinId);
      
      if (existingDist) {
        await this.updateDistributor(existingDist, allinDist);
        return await this.distributorRepository.findById(existingDist.id);
      } else {
        await this.createDistributor(allinDist);
        return await this.distributorRepository.findByAllinId(allinId);
      }
    } catch (error) {
      this.log(`Error syncing distributor ${allinId}: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      throw error;
    }
  }

  /**
   * Get synchronization status
   */
  async getSyncStatus(): Promise<{
    total: number;
    synced: number;
    notSynced: number;
    lastSyncAt: string | null;
  }> {
    const allDistributors = await this.distributorRepository.findAll();
    
    const synced = allDistributors.filter(d => d.allin_synced_at).length;
    const notSynced = allDistributors.filter(d => !d.allin_synced_at).length;
    
    // Get the most recent sync timestamp
    const lastSync = allDistributors
      .filter(d => d.allin_synced_at)
      .sort((a, b) => new Date(b.allin_synced_at!).getTime() - new Date(a.allin_synced_at!).getTime())[0];
    
    return {
      total: allDistributors.length,
      synced,
      notSynced,
      lastSyncAt: lastSync?.allin_synced_at || null,
    };
  }
}
