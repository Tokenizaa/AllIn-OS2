/**
 * Activation Mapper
 *
 * Mapper para converter dados da API Allin para o formato local.
 */
export class ActivationMapper {
    /**
     * Converte ativação da API Allin para formato local
     */
    static fromAllin(allinActivation) {
        return {
            allin_id: String(allinActivation.id),
            distribuidor_id: String(allinActivation.distribuidor_id),
            mes: allinActivation.mes,
            ano: allinActivation.ano,
            quantidade_ativacoes: allinActivation.quantidade_ativacoes,
            valor_total: allinActivation.valor_total,
            allin_synced_at: new Date(),
        };
    }
    /**
     * Converte array de ativações da API Allin para formato local
     */
    static fromAllinArray(allinActivations) {
        return allinActivations.map(activation => this.fromAllin(activation));
    }
    /**
     * Verifica se ativação precisa de sync
     */
    static needsSync(localActivation, allinActivation) {
        const syncThreshold = 5 * 60 * 1000; // 5 minutos
        const timeSinceLastSync = Date.now() - localActivation.allin_synced_at.getTime();
        // Se o último sync foi há mais de 5 minutos, precisa sync
        if (timeSinceLastSync > syncThreshold) {
            return true;
        }
        // Verificar se dados mudaram (comparação simplificada)
        if (localActivation.quantidade_ativacoes !== allinActivation.quantidade_ativacoes)
            return true;
        if (localActivation.valor_total !== allinActivation.valor_total)
            return true;
        return false;
    }
}
