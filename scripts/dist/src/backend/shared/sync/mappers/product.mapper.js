/**
 * Product Mapper
 *
 * Mapper para converter dados da API Allin para o formato local.
 */
export class ProductMapper {
    /**
     * Converte produto da API Allin para formato local
     */
    static fromAllin(allinProduct) {
        return {
            allin_id: String(allinProduct.id),
            modelo: allinProduct.modelo,
            ncm: allinProduct.ncm,
            preco: allinProduct.preco,
            e_plano: allinProduct.e_plano,
            e_upgrade_plano: allinProduct.e_upgrade_plano,
            e_recompra_plano: allinProduct.e_recompra_plano,
            e_renovacao_plano: allinProduct.e_renovacao_plano,
            e_ativacao: allinProduct.e_ativacao,
            e_visivel: allinProduct.e_visivel,
            quantidade: allinProduct.quantidade,
            status: allinProduct.status,
            estoque_status_id: allinProduct.estoque_status_id,
            necessita_frete: allinProduct.necessita_frete,
            peso: allinProduct.peso,
            dimensoes: allinProduct.dimensoes,
            sku: allinProduct.sku,
            upc: allinProduct.upc,
            ean: allinProduct.ean,
            nome: allinProduct.nome,
            descricao: allinProduct.descricao,
            categoria_id: allinProduct.categoria_id ? String(allinProduct.categoria_id) : undefined,
            allin_synced_at: new Date(),
        };
    }
    /**
     * Converte array de produtos da API Allin para formato local
     */
    static fromAllinArray(allinProducts) {
        return allinProducts.map(product => this.fromAllin(product));
    }
    /**
     * Verifica se produto precisa de sync
     */
    static needsSync(localProduct, allinProduct) {
        const syncThreshold = 5 * 60 * 1000; // 5 minutos
        const timeSinceLastSync = Date.now() - localProduct.allin_synced_at.getTime();
        // Se o último sync foi há mais de 5 minutos, precisa sync
        if (timeSinceLastSync > syncThreshold) {
            return true;
        }
        // Verificar se dados mudaram (comparação simplificada)
        if (localProduct.modelo !== allinProduct.modelo)
            return true;
        if (localProduct.preco !== allinProduct.preco)
            return true;
        if (localProduct.quantidade !== allinProduct.quantidade)
            return true;
        if (localProduct.status !== allinProduct.status)
            return true;
        return false;
    }
}
