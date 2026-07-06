/**
 * Plan Mapper
 *
 * Mapper para converter dados da API Allin para o formato local.
 */
export class PlanMapper {
    /**
     * Converte plano da API Allin para formato local
     */
    static fromAllin(allinPlan) {
        return {
            allin_id: String(allinPlan.id),
            nome: allinPlan.nome,
            valor: allinPlan.valor,
            status: allinPlan.status || 'active',
            tipo: allinPlan.tipo,
            allin_synced_at: new Date(),
        };
    }
    /**
     * Converte array de planos da API Allin para formato local
     */
    static fromAllinArray(allinPlans) {
        return allinPlans.map(plan => this.fromAllin(plan));
    }
    /**
     * Verifica se plano precisa de sync
     */
    static needsSync(localPlan, allinPlan) {
        const syncThreshold = 5 * 60 * 1000; // 5 minutos
        const timeSinceLastSync = Date.now() - localPlan.allin_synced_at.getTime();
        // Se o último sync foi há mais de 5 minutos, precisa sync
        if (timeSinceLastSync > syncThreshold) {
            return true;
        }
        // Verificar se dados mudaram (comparação simplificada)
        if (localPlan.nome !== allinPlan.nome)
            return true;
        if (localPlan.valor !== allinPlan.valor)
            return true;
        if (localPlan.status !== allinPlan.status)
            return true;
        return false;
    }
}
