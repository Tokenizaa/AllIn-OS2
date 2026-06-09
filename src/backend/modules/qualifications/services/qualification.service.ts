import { supabase } from "../../../shared/infrastructure/supabase/client";

export interface QualificationRequirements {
  minPersonalVolume: number;
  minTeamVolume: number;
  minActiveDownlines: number;
  minDownlinesAtLevel: string;
}

export class QualificationService {
  private static instance: QualificationService;

  private constructor() {}

  static getInstance(): QualificationService {
    if (!QualificationService.instance) {
      QualificationService.instance = new QualificationService();
    }
    return QualificationService.instance;
  }

  /**
   * Definição de requisitos por nível de qualificação
   */
  private qualificationLevels: Record<string, QualificationRequirements> = {
    'bronze': {
      minPersonalVolume: 500,
      minTeamVolume: 1000,
      minActiveDownlines: 2,
      minDownlinesAtLevel: 'bronze',
    },
    'silver': {
      minPersonalVolume: 1000,
      minTeamVolume: 5000,
      minActiveDownlines: 5,
      minDownlinesAtLevel: 'bronze',
    },
    'gold': {
      minPersonalVolume: 2000,
      minTeamVolume: 15000,
      minActiveDownlines: 10,
      minDownlinesAtLevel: 'silver',
    },
    'platinum': {
      minPersonalVolume: 5000,
      minTeamVolume: 50000,
      minActiveDownlines: 20,
      minDownlinesAtLevel: 'gold',
    },
    'diamond': {
      minPersonalVolume: 10000,
      minTeamVolume: 100000,
      minActiveDownlines: 30,
      minDownlinesAtLevel: 'platinum',
    },
  };

  /**
   * Verifica se um customer atingiu requisitos para upgrade de qualificação
   */
  async checkQualificationUpgrade(idComprador: string): Promise<void> {
    try {
      // Buscar qualificação atual do customer
      const { data: currentQualification, error: qualError } = await supabase
        .from('customer_qualifications')
        .select('*')
        .eq('id_comprador', idComprador)
        .eq('status', 'active')
        .single();

      if (qualError && qualError.code !== 'PGRST116') throw qualError;

      const currentLevel = currentQualification?.qualification_id || 'none';

      // Buscar métricas do customer
      const { data: metrics, error: metricsError } = await supabase
        .from('customer_metrics')
        .select('*')
        .eq('id_comprador', idComprador)
        .single();

      if (metricsError && metricsError.code !== 'PGRST116') throw metricsError;

      if (!metrics) {
        console.log(`No metrics found for customer ${idComprador}`);
        return;
      }

      // Buscar volume da equipe (downlines)
      const teamVolume = await this.getTeamVolume(idComprador);

      // Buscar número de downlines ativos
      const activeDownlines = await this.getActiveDownlinesCount(idComprador);

      // Buscar número de downlines em nível específico
      const downlinesAtLevel = await this.getDownlinesAtLevelCount(idComprador, currentLevel);

      // Verificar qualificação mais alta que o customer pode atingir
      const levels = Object.keys(this.qualificationLevels);
      let newQualification = currentLevel;

      for (const level of levels) {
        const requirements = this.qualificationLevels[level];
        
        // Pular se já está neste nível ou superior
        if (this.isLevelEqualOrHigher(currentLevel, level)) continue;

        // Verificar requisitos
        if (
          metrics.total_gasto >= requirements.minPersonalVolume &&
          teamVolume >= requirements.minTeamVolume &&
          activeDownlines >= requirements.minActiveDownlines &&
          downlinesAtLevel >= this.getLevelIndex(requirements.minDownlinesAtLevel)
        ) {
          newQualification = level;
        }
      }

      // Se houve upgrade, atualizar qualificação
      if (newQualification !== currentLevel) {
        await this.updateQualification(idComprador, newQualification);
        console.log(`Customer ${idComprador} upgraded from ${currentLevel} to ${newQualification}`);
      } else {
        console.log(`Customer ${idComprador} maintains qualification ${currentLevel}`);
      }
    } catch (error) {
      console.error('Error checking qualification upgrade:', error);
      throw error;
    }
  }

  /**
   * Atualiza qualificação do customer
   */
  async updateQualification(idComprador: string, newQualification: string): Promise<void> {
    try {
      // Desativar qualificação anterior
      const { error: updateError } = await supabase
        .from('customer_qualifications')
        .update({ status: 'inactive', updated_at: new Date().toISOString() })
        .eq('id_comprador', idComprador)
        .eq('status', 'active');

      if (updateError && updateError.code !== 'PGRST116') throw updateError;

      // Criar nova qualificação
      const { error: insertError } = await supabase
        .from('customer_qualifications')
        .insert({
          id_comprador: idComprador,
          qualification_id: newQualification,
          qualification_name: this.getQualificationName(newQualification),
          status: 'active',
          achieved_at: new Date().toISOString(),
          metadata: {
            previous_qualification: await this.getCurrentQualification(idComprador),
          },
        });

      if (insertError) throw insertError;

      console.log(`Qualification updated for customer ${idComprador}: ${newQualification}`);
    } catch (error) {
      console.error('Error updating qualification:', error);
      throw error;
    }
  }

  /**
   * Processa qualificações para todos os customers
   */
  async processQualifications(): Promise<void> {
    try {
      console.log('Starting batch qualification processing...');

      // Buscar todos os customers
      const { data: customers, error: customersError } = await supabase
        .from('customers')
        .select('id');

      if (customersError) throw customersError;

      if (!customers || customers.length === 0) {
        console.log('No customers found');
        return;
      }

      // Atualizar cada customer (sequencial para evitar sobrecarga)
      for (const customer of customers) {
        await this.checkQualificationUpgrade(customer.id);
      }

      console.log(`Batch qualification processing completed for ${customers.length} customers`);
    } catch (error) {
      console.error('Error in batch qualification processing:', error);
      throw error;
    }
  }

  /**
   * Busca volume total da equipe (downlines)
   */
  private async getTeamVolume(idComprador: string): Promise<number> {
    try {
      // Buscar todos os downlines
      const { data: downlines, error: downlinesError } = await supabase
        .from('customers')
        .select('id')
        .eq('sponsor_id', idComprador);

      if (downlinesError) throw downlinesError;

      if (!downlines || downlines.length === 0) return 0;

      // Buscar métricas de todos os downlines
      const downlineIds = downlines.map(d => d.id);
      const { data: metrics, error: metricsError } = await supabase
        .from('customer_metrics')
        .select('total_gasto')
        .in('id_comprador', downlineIds);

      if (metricsError) throw metricsError;

      const teamVolume = metrics?.reduce((sum, m) => sum + (parseFloat(m.total_gasto) || 0), 0) || 0;
      return teamVolume;
    } catch (error) {
      console.error('Error getting team volume:', error);
      return 0;
    }
  }

  /**
   * Busca número de downlines ativos
   */
  private async getActiveDownlinesCount(idComprador: string): Promise<number> {
    try {
      const { data: downlines, error: downlinesError } = await supabase
        .from('customers')
        .select('id')
        .eq('sponsor_id', idComprador)
        .eq('status', 'active');

      if (downlinesError) throw downlinesError;

      return downlines?.length || 0;
    } catch (error) {
      console.error('Error getting active downlines count:', error);
      return 0;
    }
  }

  /**
   * Busca número de downlines em um nível específico
   */
  private async getDownlinesAtLevelCount(idComprador: string, minLevel: string): Promise<number> {
    try {
      // Buscar todos os downlines
      const { data: downlines, error: downlinesError } = await supabase
        .from('customers')
        .select('id')
        .eq('sponsor_id', idComprador);

      if (downlinesError) throw downlinesError;

      if (!downlines || downlines.length === 0) return 0;

      // Buscar qualificações dos downlines
      const downlineIds = downlines.map(d => d.id);
      const { data: qualifications, error: qualError } = await supabase
        .from('customer_qualifications')
        .select('qualification_id')
        .in('id_comprador', downlineIds)
        .eq('status', 'active');

      if (qualError) throw qualError;

      // Contar downlines no nível ou superior
      const minLevelIndex = this.getLevelIndex(minLevel);
      const count = qualifications?.filter(q => 
        this.getLevelIndex(q.qualification_id) >= minLevelIndex
      ).length || 0;

      return count;
    } catch (error) {
      console.error('Error getting downlines at level count:', error);
      return 0;
    }
  }

  /**
   * Verifica se um nível é igual ou superior a outro
   */
  private isLevelEqualOrHigher(current: string, target: string): boolean {
    const currentIndex = this.getLevelIndex(current);
    const targetIndex = this.getLevelIndex(target);
    return currentIndex >= targetIndex;
  }

  /**
   * Retorna índice do nível (maior = mais alto)
   */
  private getLevelIndex(level: string): number {
    const levels = ['none', 'bronze', 'silver', 'gold', 'platinum', 'diamond'];
    return levels.indexOf(level);
  }

  /**
   * Retorna nome formatado da qualificação
   */
  private getQualificationName(level: string): string {
    const names: Record<string, string> = {
      'none': 'Sem Qualificação',
      'bronze': 'Bronze',
      'silver': 'Prata',
      'gold': 'Ouro',
      'platinum': 'Platina',
      'diamond': 'Diamante',
    };
    return names[level] || level;
  }

  /**
   * Retorna qualificação atual do customer
   */
  private async getCurrentQualification(idComprador: string): Promise<string> {
    try {
      const { data: qual, error: qualError } = await supabase
        .from('customer_qualifications')
        .select('qualification_id')
        .eq('id_comprador', idComprador)
        .eq('status', 'active')
        .single();

      if (qualError && qualError.code !== 'PGRST116') throw qualError;

      return qual?.qualification_id || 'none';
    } catch (error) {
      console.error('Error getting current qualification:', error);
      return 'none';
    }
  }

  /**
   * Busca qualificação de um customer
   */
  async getCustomerQualification(idComprador: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('customer_qualifications')
        .select('*')
        .eq('id_comprador', idComprador)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return data;
    } catch (error) {
      console.error('Error getting customer qualification:', error);
      throw error;
    }
  }

  /**
   * Busca histórico de qualificações de um customer
   */
  async getQualificationHistory(idComprador: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('customer_qualifications')
        .select('*')
        .eq('id_comprador', idComprador)
        .order('achieved_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error getting qualification history:', error);
      throw error;
    }
  }
}
