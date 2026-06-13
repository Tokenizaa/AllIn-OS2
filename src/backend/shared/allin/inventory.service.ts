import { logger } from "../observability/logger.service";
import { allinService } from "./allin.service";
import type {
  AllInProdutoEstoque,
  AllInProdutoEstoqueTotal,
} from "./dto/allin.dto";

export class InventoryService {
  /**
   * Busca estoque de um produto específico
   */
  async getProdutoEstoque(produtoId: number): Promise<AllInProdutoEstoque | null> {
    try {
      const response = await allinService.request<{ estoque: AllInProdutoEstoque }>(
        `/produtos/${produtoId}/Estoque`
      );
      logger.info(`Fetched estoque for produto ${produtoId} from AllIn`, "inventory");
      return response.estoque;
    } catch (error) {
      logger.error(`Failed to fetch estoque for produto ${produtoId} from AllIn`, "inventory", { error });
      return null;
    }
  }

  /**
   * Atualiza estoque de um produto
   */
  async updateProdutoEstoque(
    produtoId: number,
    quantidade: number,
    quantidadeReservada?: number
  ): Promise<void> {
    try {
      await allinService.request<void>("/produtos/Estoque", {
        method: "POST",
        body: JSON.stringify({
          produto_id: produtoId,
          quantidade,
          quantidade_reservada: quantidadeReservada || 0,
        }),
      });
      logger.info(`Updated estoque for produto ${produtoId} in AllIn`, "inventory");
    } catch (error) {
      logger.error(`Failed to update estoque for produto ${produtoId} in AllIn`, "inventory", { error });
      throw error;
    }
  }

  /**
   * Busca estoque total de todos os produtos
   */
  async getEstoqueTotais(): Promise<AllInProdutoEstoqueTotal[]> {
    try {
      const response = await allinService.request<{ estoques: AllInProdutoEstoqueTotal[] }>(
        "/produtos/EstoqueTotais"
      );
      logger.info(`Fetched ${response.estoques.length} estoques totais from AllIn`, "inventory");
      return response.estoques;
    } catch (error) {
      logger.error("Failed to fetch estoques totais from AllIn", "inventory", { error });
      throw error;
    }
  }

  /**
   * Sincroniza estoque de um produto da API AllIn para Supabase
   */
  async syncProdutoEstoque(produtoId: number): Promise<void> {
    try {
      const estoque = await this.getProdutoEstoque(produtoId);
      if (!estoque) {
        logger.warn(`No estoque found for produto ${produtoId} in AllIn`, "inventory");
        return;
      }

      // TODO: Implementar persistência no Supabase
      // Isso será implementado após criar a tabela de estoque
      logger.info(`Synced estoque for produto ${produtoId} from AllIn to Supabase`, "inventory");
    } catch (error) {
      logger.error(`Failed to sync estoque for produto ${produtoId} from AllIn`, "inventory", { error });
      throw error;
    }
  }

  /**
   * Sincroniza estoque de todos os produtos da API AllIn para Supabase
   */
  async syncAllEstoque(): Promise<{ synced: number; errors: number }> {
    const estoques = await this.getEstoqueTotais();
    let synced = 0;
    let errors = 0;

    for (const estoque of estoques) {
      try {
        await this.syncProdutoEstoque(estoque.produto_id);
        synced++;
      } catch (error) {
        errors++;
        logger.error(`Failed to sync estoque for produto ${estoque.produto_id}`, "inventory", { error });
      }
    }

    logger.info(`Synced ${synced} estoques from AllIn to Supabase`, "inventory", {
      total: estoques.length,
      synced,
      errors,
    });

    return { synced, errors };
  }
}

export const inventoryService = new InventoryService();
