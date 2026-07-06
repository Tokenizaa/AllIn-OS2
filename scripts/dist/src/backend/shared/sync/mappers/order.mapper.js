/**
 * Order Mapper
 *
 * Mapper para converter dados da API Allin para o formato local.
 */
export class OrderMapper {
    /**
     * Converte pedido da API Allin para formato local
     */
    static fromAllin(allinOrder) {
        return {
            allin_id: String(allinOrder.id),
            distribuidor_indicador_id: allinOrder.distribuidor_indicador_id,
            distribuidor_comprador_id: allinOrder.distribuidor_comprador_id,
            loja_id: allinOrder.loja_id,
            loja_nome: allinOrder.loja_nome,
            cliente_id: allinOrder.cliente_id,
            cliente_nome: `${allinOrder.cliente_nome} ${allinOrder.cliente_sobrenome}`,
            cliente_email: allinOrder.cliente_email,
            cliente_telefone: allinOrder.cliente_telefone,
            cliente_cpf: allinOrder.cliente_cpf,
            cliente_cnpj: allinOrder.cliente_cnpj,
            pagamento_confirmado: allinOrder.pagamento_confirmado,
            necessita_frete: allinOrder.necessita_frete,
            data_pagamento: allinOrder.data_pagamento ? new Date(allinOrder.data_pagamento) : undefined,
            cliente_logradouro: allinOrder.cliente_logradouro,
            cliente_bairro: allinOrder.cliente_bairro,
            cliente_cep: allinOrder.cliente_cep,
            cliente_cidade: allinOrder.cliente_cidade,
            cliente_uf: allinOrder.cliente_uf,
            entrega_nome: `${allinOrder.entrega_nome} ${allinOrder.entrega_sobrenome}`,
            entrega_logradouro: allinOrder.entrega_logradouro,
            entrega_bairro: allinOrder.entrega_bairro,
            entrega_cep: allinOrder.entrega_cep,
            entrega_cidade: allinOrder.entrega_cidade,
            entrega_uf: allinOrder.entrega_uf,
            comentario: allinOrder.comentario,
            valor_total: allinOrder.valor_total,
            status: allinOrder.status,
            status_descricao: allinOrder.status_descricao,
            data_adicionado: allinOrder.data_adicionado ? new Date(allinOrder.data_adicionado) : undefined,
            data_modificado: allinOrder.data_modificado ? new Date(allinOrder.data_modificado) : undefined,
            cancelado: allinOrder.cancelado,
            data_cancelamento: allinOrder.data_cancelamento ? new Date(allinOrder.data_cancelamento) : undefined,
            campos_personalizados: allinOrder.campos_personalizados,
            market_place: allinOrder.market_place,
            allin_synced_at: new Date(),
        };
    }
    /**
     * Converte array de pedidos da API Allin para formato local
     */
    static fromAllinArray(allinOrders) {
        return allinOrders.map(order => this.fromAllin(order));
    }
    /**
     * Verifica se pedido precisa de sync
     */
    static needsSync(localOrder, allinOrder) {
        const syncThreshold = 5 * 60 * 1000; // 5 minutos
        const timeSinceLastSync = Date.now() - localOrder.allin_synced_at.getTime();
        // Se o último sync foi há mais de 5 minutos, precisa sync
        if (timeSinceLastSync > syncThreshold) {
            return true;
        }
        // Verificar se dados mudaram (comparação simplificada)
        if (localOrder.status !== allinOrder.status)
            return true;
        if (localOrder.pagamento_confirmado !== allinOrder.pagamento_confirmado)
            return true;
        return false;
    }
}
