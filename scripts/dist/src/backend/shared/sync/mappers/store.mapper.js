/**
 * Store Mapper
 *
 * Mapper para converter dados da API Allin para o formato local.
 */
export class StoreMapper {
    /**
     * Converte loja da API Allin para formato local
     */
    static fromAllin(allinStore) {
        return {
            allin_id: String(allinStore.id),
            nome: allinStore.nome,
            documento: allinStore.documento,
            ativo: allinStore.ativo ?? true,
            allin_synced_at: new Date(),
        };
    }
    /**
     * Converte array de lojas da API Allin para formato local
     */
    static fromAllinArray(allinStores) {
        return allinStores.map(store => this.fromAllin(store));
    }
    /**
     * Verifica se loja precisa de sync
     */
    static needsSync(localStore, allinStore) {
        const syncThreshold = 5 * 60 * 1000; // 5 minutos
        const timeSinceLastSync = Date.now() - localStore.allin_synced_at.getTime();
        // Se o último sync foi há mais de 5 minutos, precisa sync
        if (timeSinceLastSync > syncThreshold) {
            return true;
        }
        // Verificar se dados mudaram (comparação simplificada)
        if (localStore.nome !== allinStore.nome)
            return true;
        if (localStore.ativo !== allinStore.ativo)
            return true;
        return false;
    }
}
