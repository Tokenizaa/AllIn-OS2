/**
 * Distributor Mapper
 *
 * Mapper para converter dados da API Allin para o formato local.
 */
export class DistributorMapper {
    /**
     * Converte distribuidor da API Allin para formato local
     */
    static fromAllin(allinDistributor) {
        return {
            allin_id: String(allinDistributor.id),
            usuario: allinDistributor.usuario,
            nome: allinDistributor.nome,
            email: allinDistributor.email,
            cpf: allinDistributor.cpf,
            cnpj: allinDistributor.cnpj,
            data_nascimento: allinDistributor.data_nascimento ? new Date(allinDistributor.data_nascimento) : undefined,
            cep: allinDistributor.cep,
            cidade: allinDistributor.cidade,
            bairro: allinDistributor.bairro,
            endereco: allinDistributor.endereco,
            complemento: allinDistributor.complemento,
            numero: allinDistributor.numero,
            ativo: allinDistributor.ativo ?? true,
            status: allinDistributor.status || 'active',
            data_cadastro: new Date(allinDistributor.data_cadastro),
            patrocinador_id: allinDistributor.patrocinador_id ? String(allinDistributor.patrocinador_id) : undefined,
            allin_synced_at: new Date(),
        };
    }
    /**
     * Converte array de distribuidores da API Allin para formato local
     */
    static fromAllinArray(allinDistributors) {
        return allinDistributors.map(distributor => this.fromAllin(distributor));
    }
    /**
     * Verifica se distribuidor precisa de sync
     */
    static needsSync(localDistributor, allinDistributor) {
        const syncThreshold = 5 * 60 * 1000; // 5 minutos
        const timeSinceLastSync = Date.now() - localDistributor.allin_synced_at.getTime();
        // Se o último sync foi há mais de 5 minutos, precisa sync
        if (timeSinceLastSync > syncThreshold) {
            return true;
        }
        // Verificar se dados mudaram (comparação simplificada)
        if (localDistributor.usuario !== allinDistributor.usuario)
            return true;
        if (localDistributor.nome !== allinDistributor.nome)
            return true;
        if (localDistributor.email !== allinDistributor.email)
            return true;
        if (localDistributor.ativo !== (allinDistributor.ativo ?? true))
            return true;
        return false;
    }
}
