/**
 * Withdrawal Mapper
 * 
 * Mapper para converter dados da API Allin para o formato local.
 */

import type { AllinPedidoSaldo } from '../../allin/dto/allin.dto';

export interface LocalWithdrawal {
  id?: string;
  allin_id: string;
  cliente_id: string;
  pedido_id?: string;
  pacote_id?: string;
  valor: number;
  data: Date;
  tipo_saldo_id?: string;
  descricao?: string;
  tipo_componente?: string;
  mostrar_cliente?: boolean;
  pacote_comprado_chave?: string;
  pacote_descricao?: string;
  allin_synced_at: Date;
}

export class WithdrawalMapper {
  /**
   * Converte saque da API Allin para formato local
   */
  static fromAllin(allinWithdrawal: AllinPedidoSaldo): LocalWithdrawal {
    return {
      allin_id: String(allinWithdrawal.id),
      cliente_id: String(allinWithdrawal.cliente_id),
      pedido_id: allinWithdrawal.pedido_id ? String(allinWithdrawal.pedido_id) : undefined,
      pacote_id: allinWithdrawal.pacote_id ? String(allinWithdrawal.pacote_id) : undefined,
      valor: allinWithdrawal.valor,
      data: new Date(allinWithdrawal.data),
      tipo_saldo_id: allinWithdrawal.tipo_saldo_id ? String(allinWithdrawal.tipo_saldo_id) : undefined,
      descricao: allinWithdrawal.descricao,
      tipo_componente: allinWithdrawal.tipo_componente,
      mostrar_cliente: allinWithdrawal.mostrar_cliente,
      pacote_comprado_chave: allinWithdrawal.pacote_comprado_chave,
      pacote_descricao: allinWithdrawal.pacote_descricao,
      allin_synced_at: new Date(),
    };
  }

  /**
   * Converte array de saques da API Allin para formato local
   */
  static fromAllinArray(allinWithdrawals: AllinPedidoSaldo[]): LocalWithdrawal[] {
    return allinWithdrawals.map(withdrawal => this.fromAllin(withdrawal));
  }

  /**
   * Verifica se saque precisa de sync
   */
  static needsSync(localWithdrawal: LocalWithdrawal, allinWithdrawal: AllinPedidoSaldo): boolean {
    const syncThreshold = 5 * 60 * 1000; // 5 minutos
    const timeSinceLastSync = Date.now() - localWithdrawal.allin_synced_at.getTime();
    
    // Se o último sync foi há mais de 5 minutos, precisa sync
    if (timeSinceLastSync > syncThreshold) {
      return true;
    }

    // Verificar se dados mudaram (comparação simplificada)
    if (localWithdrawal.valor !== allinWithdrawal.valor) return true;
    if (localWithdrawal.descricao !== allinWithdrawal.descricao) return true;

    return false;
  }
}
