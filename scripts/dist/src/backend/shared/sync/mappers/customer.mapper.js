/**
 * Customer Mapper
 *
 * Mapper para converter dados da API Allin para o formato local.
 */
export class CustomerMapper {
    /**
     * Converte cliente da API Allin para formato local
     */
    static fromAllin(allinCustomer) {
        return {
            allin_id: String(allinCustomer.id),
            tipo_cliente: allinCustomer.tipo_cliente,
            nome: allinCustomer.nome,
            sobrenome: allinCustomer.sobrenome,
            email: allinCustomer.email,
            cpf: allinCustomer.cpf,
            cnpj: allinCustomer.cnpj,
            data_nascimento: allinCustomer.data_nascimento ? new Date(allinCustomer.data_nascimento) : undefined,
            telefone: allinCustomer.telefone,
            endereco: allinCustomer.logradouro,
            cidade: allinCustomer.cidade_nome,
            estado: allinCustomer.uf_codigo,
            cep: allinCustomer.cep,
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
    static fromAllinArray(allinCustomers) {
        return allinCustomers.map(customer => this.fromAllin(customer));
    }
    /**
     * Verifica se cliente precisa de sync
     */
    static needsSync(localCustomer, allinCustomer) {
        const syncThreshold = 5 * 60 * 1000; // 5 minutos
        const timeSinceLastSync = Date.now() - localCustomer.allin_synced_at.getTime();
        // Se o último sync foi há mais de 5 minutos, precisa sync
        if (timeSinceLastSync > syncThreshold) {
            return true;
        }
        // Verificar se dados mudaram (comparação simplificada)
        if (localCustomer.nome !== allinCustomer.nome)
            return true;
        if (localCustomer.email !== allinCustomer.email)
            return true;
        if (localCustomer.ativo !== allinCustomer.ativo)
            return true;
        return false;
    }
}
