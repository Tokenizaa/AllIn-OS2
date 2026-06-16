/**
 * Distributor Mapper
 * 
 * Mapper para converter dados da API Allin para o formato local.
 */

import type { AllInDistribuidor } from '../../allin/dto/allin.dto';

export interface LocalDistributor {
  id?: string;
  allin_id: number;
  usuario: string;
  nome: string;
  email: string;
  cpf?: string;
  cnpj?: string;
  data_nascimento?: Date;
  cep?: string;
  cidade?: string;
  bairro?: string;
  endereco?: string;
  complemento?: string;
  numero?: string;
  ativo: boolean;
  status: string;
  data_cadastro: Date;
  patrocinador_id?: string;
  perna_esquerda_id?: string;
  perna_direita_id?: string;
  allin_synced_at: Date;
}

export class DistributorMapper {
  /**
   * Converte distribuidor da API Allin para formato local
   */
  static fromAllin(allinDistributor: AllInDistribuidor): LocalDistributor {
    // Limpar e truncar campos para evitar erro de tamanho
    const cleanCpf = allinDistributor.cpf?.replace(/\D/g, '').substring(0, 20);
    const cleanCnpj = allinDistributor.cnpj?.replace(/\D/g, '').substring(0, 20);
    const cleanCep = allinDistributor.cep?.replace(/\D/g, '').substring(0, 10);

    return {
      allin_id: allinDistributor.id,
      usuario: allinDistributor.usuario,
      nome: allinDistributor.nome,
      email: allinDistributor.email,
      cpf: cleanCpf,
      cnpj: cleanCnpj,
      data_nascimento: allinDistributor.data_nascimento ? new Date(allinDistributor.data_nascimento) : undefined,
      cep: cleanCep,
      cidade: allinDistributor.cidade,
      bairro: allinDistributor.bairro,
      endereco: allinDistributor.endereco,
      complemento: allinDistributor.complemento,
      numero: allinDistributor.numero,
      ativo: allinDistributor.ativo ?? true,
      status: allinDistributor.status || 'active',
      data_cadastro: new Date(allinDistributor.data_cadastro),
      patrocinador_id: allinDistributor.patrocinador_id ? String(allinDistributor.patrocinador_id) : undefined,
      perna_esquerda_id: allinDistributor.perna_esquerda_id ? String(allinDistributor.perna_esquerda_id) : undefined,
      perna_direita_id: allinDistributor.perna_direita_id ? String(allinDistributor.perna_direita_id) : undefined,
      allin_synced_at: new Date(),
    };
  }

  /**
   * Converte array de distribuidores da API Allin para formato local
   */
  static fromAllinArray(allinDistributors: AllInDistribuidor[]): LocalDistributor[] {
    return allinDistributors.map(distributor => this.fromAllin(distributor));
  }

  /**
   * Verifica se distribuidor precisa de sync
   */
  static needsSync(localDistributor: LocalDistributor, allinDistributor: AllInDistribuidor): boolean {
    const syncThreshold = 5 * 60 * 1000; // 5 minutos
    const timeSinceLastSync = Date.now() - localDistributor.allin_synced_at.getTime();
    
    // Se o último sync foi há mais de 5 minutos, precisa sync
    if (timeSinceLastSync > syncThreshold) {
      return true;
    }

    // Verificar se dados mudaram (comparação simplificada)
    if (localDistributor.usuario !== allinDistributor.usuario) return true;
    if (localDistributor.nome !== allinDistributor.nome) return true;
    if (localDistributor.email !== allinDistributor.email) return true;
    if (localDistributor.ativo !== (allinDistributor.ativo ?? true)) return true;

    return false;
  }
}
