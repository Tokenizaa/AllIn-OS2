/**
 * Qualification Mapper
 *
 * Mapper para converter dados da API Allin para o formato local.
 */
export class QualificationMapper {
    /**
     * Converte qualificação da API Allin para formato local
     */
    static fromAllin(allinQualification) {
        return {
            allin_id: String(allinQualification.id),
            distribuidor_id: String(allinQualification.distribuidor_id),
            qualificacao_id: String(allinQualification.qualificacao_id),
            qualificacao_nome: allinQualification.qualificacao_nome,
            qualificacao_descricao: allinQualification.qualificacao_descricao,
            nivel: allinQualification.nivel,
            data_obtencao: allinQualification.data_obtencao ? new Date(allinQualification.data_obtencao) : undefined,
            allin_synced_at: new Date(),
        };
    }
    /**
     * Converte array de qualificações da API Allin para formato local
     */
    static fromAllinArray(allinQualifications) {
        return allinQualifications.map(qualification => this.fromAllin(qualification));
    }
    /**
     * Verifica se qualificação precisa de sync
     */
    static needsSync(localQualification, allinQualification) {
        const syncThreshold = 5 * 60 * 1000; // 5 minutos
        const timeSinceLastSync = Date.now() - localQualification.allin_synced_at.getTime();
        // Se o último sync foi há mais de 5 minutos, precisa sync
        if (timeSinceLastSync > syncThreshold) {
            return true;
        }
        // Verificar se dados mudaram (comparação simplificada)
        if (localQualification.qualificacao_nome !== allinQualification.qualificacao_nome)
            return true;
        if (localQualification.nivel !== allinQualification.nivel)
            return true;
        return false;
    }
}
