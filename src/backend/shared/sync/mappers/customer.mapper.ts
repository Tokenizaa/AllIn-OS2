/**
 * Customer Mapper
 * 
 * Mapper para converter dados da API Allin para o formato local.
 */

import type { AllInCliente } from '../../allin/dto/allin.dto';

export interface LocalCustomer {
  id?: string;
  allin_id: string;
  tipo_cliente?: string;
  nome?: string;
  sobrenome?: string;
  email?: string;
  cpf?: string;
  cnpj?: string;
  data_nascimento?: Date;
  telefone?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  bairro?: string;
  ativo?: boolean;
  usuario?: string;
  distribuidor_id?: string;
  allin_synced_at: Date;
}

export class CustomerMapper {
  /**
   * Converte cliente da API Allin para formato local
   */
  static fromAllin(allinCustomer: AllInCliente): LocalCustomer {
    // Limpar e truncar campos para evitar erro de tamanho
    const cleanCpf = allinCustomer.cpf?.replace(/\D/g, '').substring(0, 20);
    const cleanCnpj = allinCustomer.cnpj?.replace(/\D/g, '').substring(0, 20);
    const cleanTelefone = allinCustomer.telefone?.replace(/\D/g, '').substring(0, 20);
    const cleanCep = allinCustomer.cep?.replace(/\D/g, '').substring(0, 10);

    return {
      allin_id: String(allinCustomer.id),
      tipo_cliente: allinCustomer.tipo_cliente,
      nome: allinCustomer.nome,
      sobrenome: allinCustomer.sobrenome,
      email: allinCustomer.email,
      cpf: cleanCpf,
      cnpj: cleanCnpj,
      data_nascimento: allinCustomer.data_nascimento ? new Date(allinCustomer.data_nascimento) : undefined,
      telefone: cleanTelefone,
      endereco: allinCustomer.logradouro,
      cidade: allinCustomer.cidade_nome,
      estado: allinCustomer.uf_codigo,
      cep: cleanCep,
      bairro: allinCustomer.bairro,
      ativo: allinCustomer.ativo,
      usuario: allinCustomer.usuario,
      distribuidor_id: allinCustomer.distribuidor_id ? String(allinCustomer.distribuidor_id) : undefined,
      allin_synced_at: new Date(),
    };
  }

  /**
   * Converte array de clientes da API Allin para formato local
   */
  static fromAllinArray(allinCustomers: AllInCliente[]): LocalCustomer[] {
    return allinCustomers.map(customer => this.fromAllin(customer));
  }

  /**
   * Verifica se cliente precisa de sync
   */
  static needsSync(localCustomer: LocalCustomer, allinCustomer: AllInCliente): boolean {
    const syncThreshold = 5 * 60 * 1000; // 5 minutos
    const timeSinceLastSync = Date.now() - localCustomer.allin_synced_at.getTime();
    
    // Se o último sync foi há mais de 5 minutos, precisa sync
    if (timeSinceLastSync > syncThreshold) {
      return true;
    }

    // Verificar se dados mudaram (comparação simplificada)
    if (localCustomer.nome !== allinCustomer.nome) return true;
    if (localCustomer.email !== allinCustomer.email) return true;
    if (localCustomer.ativo !== allinCustomer.ativo) return true;

    return false;
  }
}
