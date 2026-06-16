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

  private async ensureAuthenticated(): Promise<void> {
    try {
      await this.apiClient.authenticate();
    } catch (error) {
      // Se client credentials falhar, tentar com usuário/senha
      this.log('Client credentials failed, trying password authentication...', 'debug');
      const username = process.env.ALLIN_USERNAME || 'juniorind';
      const password = process.env.ALLIN_PASSWORD || 'allin2025';
      await this.apiClient.authenticateWithPassword(username, password);
    }
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
      await this.ensureAuthenticated();
      
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
          const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
          result.errorDetails.push({
            id: allinDist.id,
            error: errorMessage,
          });
          this.log(`Error processing distributor ${allinDist.id}: ${errorMessage}`, 'error');
          // Log full error for debugging
          this.log(`Error object: ${JSON.stringify(error, null, 2)}`, 'debug');
          if (error instanceof Error) {
            this.log(`Error stack: ${error.stack}`, 'debug');
          }
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
    let hasMore = true;

    while (hasMore) {
      try {
        this.log(`Fetching page ${page}...`, 'debug');
        
        const response = await this.apiClient.getWithFilters<any>('/distribuidores', {
          page: page,
        });

        // Extract distributors from the correct location in response
        let distributors: AllinDistributor[] = [];
        
        if (response.data?.distribuidores && Array.isArray(response.data.distribuidores)) {
          distributors = response.data.distribuidores;
        } else if (Array.isArray(response.data)) {
          distributors = response.data;
        }

        if (distributors.length > 0) {
          allDistributors.push(...distributors);
          this.log(`Fetched ${distributors.length} distributors from page ${page}`, 'debug');
          
          // Check if there are more pages based on _infos
          const infos = response.data?._infos;
          if (infos && infos.total_pages && page < infos.total_pages) {
            page++;
          } else {
            hasMore = false;
          }
        } else {
          hasMore = false;
        }
      } catch (error) {
        this.log(`Error fetching distributors page ${page}: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
        hasMore = false;
      }
    }

    this.log(`Total distributors fetched: ${allDistributors.length}`, 'info');
    return allDistributors;
  }

  /**
   * Create a new distributor from AllIn data
   */
  private async createDistributor(allinDist: AllinDistributor): Promise<void> {
    const distributor: Partial<Distribuidor> = {
      allin_id: allinDist.id,
      usuario: allinDist.usuario?.substring(0, 20), // Truncate to 20 chars
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
      usuario: allinDist.usuario?.substring(0, 20), // Truncate to 20 chars
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
      await this.ensureAuthenticated();
      
      const response = await this.apiClient.get<AllinDistributor>(`/distribuidores/${allinId}`);
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
