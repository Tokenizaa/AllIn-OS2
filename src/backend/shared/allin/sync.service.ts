import { logger } from "../observability/logger.service";
import { allinService } from "./allin.service";
import { allinDataMapper } from "./data.mapper";
import { CustomerRepository } from "../../modules/customers/repositories/customer.repository";
import { DistribuidorRepository } from "../../modules/distributors/repositories/distributor.repository";
import { OrderRepository } from "../../modules/orders/repositories/order.repository";
import { ProductRepository } from "../../modules/products/repositories/product.repository";
import { PlanRepository } from "../../modules/plans/repositories/plan.repository";
import type {
  CustomerDTO,
  DistribuidorDTO,
  ProdutoDTO,
  PedidoDTO,
  PlanoDTO,
} from "./data.mapper";

export interface SyncResult {
  entity: string;
  total: number;
  synced: number;
  errors: number;
  duration: number;
}

export interface SyncOptions {
  entities?: ("clientes" | "distribuidores" | "produtos" | "pedidos" | "planos")[];
  incremental?: boolean;
  batchSize?: number;
}

export class AllInSyncService {
  private static instance: AllInSyncService;

  private constructor() {}

  static getInstance(): AllInSyncService {
    if (!AllInSyncService.instance) {
      AllInSyncService.instance = new AllInSyncService();
    }
    return AllInSyncService.instance;
  }

  /**
   * Sincroniza clientes da API AllIn para Supabase
   */
  async syncClientes(options: SyncOptions = {}): Promise<SyncResult> {
    const startTime = Date.now();
    let synced = 0;
    let errors = 0;

    try {
      logger.info("Starting clientes sync from AllIn", "allin-sync");

      // Buscar clientes da API AllIn
      const clientes = await allinService.getClientes();

      // Mapear para formato do Supabase
      const customerDTOs = allinDataMapper.mapClientesToSupabase(clientes);

      // Inserir/atualizar no Supabase
      const customerRepository = new CustomerRepository();
      const now = new Date().toISOString();

      for (const customerDTO of customerDTOs) {
        try {
          // Verificar se já existe pelo allin_id
          const existing = await customerRepository.getClient()
            .schema("crm")
            .from("customers")
            .select("*")
            .eq("allin_id", customerDTO.allin_id)
            .maybeSingle();

          if (existing.data) {
            // Atualizar registro existente
            await customerRepository.getClient()
              .schema("crm")
              .from("customers")
              .update({
                ...customerDTO,
                allin_synced_at: now,
                updated_at: now,
              })
              .eq("allin_id", customerDTO.allin_id);
            synced++;
          } else {
            // Inserir novo registro
            await customerRepository.getClient()
              .schema("crm")
              .from("customers")
              .insert({
                ...customerDTO,
                allin_synced_at: now,
                created_at: now,
                updated_at: now,
              });
            synced++;
          }
        } catch (error) {
          errors++;
          logger.error("Failed to sync customer", "allin-sync", {
            error,
            allin_id: customerDTO.allin_id,
          });
        }
      }

      logger.info(`Synced ${synced} clientes from AllIn to Supabase`, "allin-sync", {
        total: customerDTOs.length,
        synced,
        errors,
      });

      const duration = Date.now() - startTime;
      logger.info(`Clientes sync completed`, "allin-sync", {
        total: clientes.length,
        synced,
        errors,
        duration,
      });

      return {
        entity: "clientes",
        total: clientes.length,
        synced,
        errors,
        duration,
      };
    } catch (error) {
      errors++;
      const duration = Date.now() - startTime;
      logger.error("Clientes sync failed", "allin-sync", { error, duration });
      throw error;
    }
  }

  /**
   * Sincroniza distribuidores da API AllIn para Supabase
   */
  async syncDistribuidores(options: SyncOptions = {}): Promise<SyncResult> {
    const startTime = Date.now();
    let synced = 0;
    let errors = 0;

    try {
      logger.info("Starting distribuidores sync from AllIn", "allin-sync");

      // Buscar distribuidores da API AllIn
      const distribuidores = await allinService.getDistribuidores();

      // Mapear para formato do Supabase
      const distribuidorDTOs = allinDataMapper.mapDistribuidoresToSupabase(distribuidores);

      // Inserir/atualizar no Supabase
      const distribuidorRepository = new DistribuidorRepository();
      const now = new Date().toISOString();

      for (const distribuidorDTO of distribuidorDTOs) {
        try {
          // Verificar se já existe pelo allin_id
          const existing = await distribuidorRepository.findByAllinId(distribuidorDTO.allin_id!);

          if (existing) {
            // Atualizar registro existente
            await distribuidorRepository.getClient()
              .schema("mlm")
              .from("distribuidores")
              .update({
                ...distribuidorDTO,
                allin_synced_at: now,
                updated_at: now,
              })
              .eq("allin_id", distribuidorDTO.allin_id);
            synced++;
          } else {
            // Inserir novo registro
            await distribuidorRepository.getClient()
              .schema("mlm")
              .from("distribuidores")
              .insert({
                ...distribuidorDTO,
                allin_synced_at: now,
                created_at: now,
                updated_at: now,
              });
            synced++;
          }
        } catch (error) {
          errors++;
          logger.error("Failed to sync distribuidor", "allin-sync", {
            error,
            allin_id: distribuidorDTO.allin_id,
          });
        }
      }

      logger.info(`Synced ${synced} distribuidores from AllIn to Supabase`, "allin-sync", {
        total: distribuidorDTOs.length,
        synced,
        errors,
      });

      const duration = Date.now() - startTime;
      logger.info(`Distribuidores sync completed`, "allin-sync", {
        total: distribuidores.length,
        synced,
        errors,
        duration,
      });

      return {
        entity: "distribuidores",
        total: distribuidores.length,
        synced,
        errors,
        duration,
      };
    } catch (error) {
      errors++;
      const duration = Date.now() - startTime;
      logger.error("Distribuidores sync failed", "allin-sync", { error, duration });
      throw error;
    }
  }

  /**
   * Sincroniza produtos da API AllIn para Supabase
   */
  async syncProdutos(options: SyncOptions = {}): Promise<SyncResult> {
    const startTime = Date.now();
    let synced = 0;
    let errors = 0;

    try {
      logger.info("Starting produtos sync from AllIn", "allin-sync");

      // Buscar produtos da API AllIn
      const produtos = await allinService.getProdutos();

      // Mapear para formato do Supabase
      const produtoDTOs = allinDataMapper.mapProdutosToSupabase(produtos);

      // Inserir/atualizar no Supabase
      const productRepository = new ProductRepository();
      const now = new Date().toISOString();

      for (const produtoDTO of produtoDTOs) {
        try {
          // Verificar se já existe pelo allin_id
          const existing = await productRepository.getClient()
            .schema("commerce")
            .from("produtos")
            .select("*")
            .eq("allin_id", produtoDTO.allin_id)
            .maybeSingle();

          if (existing.data) {
            // Atualizar registro existente
            await productRepository.getClient()
              .schema("commerce")
              .from("produtos")
              .update({
                ...produtoDTO,
                allin_synced_at: now,
                updated_at: now,
              })
              .eq("allin_id", produtoDTO.allin_id);
            synced++;
          } else {
            // Inserir novo registro
            await productRepository.getClient()
              .schema("commerce")
              .from("produtos")
              .insert({
                ...produtoDTO,
                allin_synced_at: now,
                created_at: now,
                updated_at: now,
              });
            synced++;
          }
        } catch (error) {
          errors++;
          logger.error("Failed to sync produto", "allin-sync", {
            error,
            allin_id: produtoDTO.allin_id,
          });
        }
      }

      logger.info(`Synced ${synced} produtos from AllIn to Supabase`, "allin-sync", {
        total: produtoDTOs.length,
        synced,
        errors,
      });

      const duration = Date.now() - startTime;
      logger.info(`Produtos sync completed`, "allin-sync", {
        total: produtos.length,
        synced,
        errors,
        duration,
      });

      return {
        entity: "produtos",
        total: produtos.length,
        synced,
        errors,
        duration,
      };
    } catch (error) {
      errors++;
      const duration = Date.now() - startTime;
      logger.error("Produtos sync failed", "allin-sync", { error, duration });
      throw error;
    }
  }

  /**
   * Sincroniza pedidos da API AllIn para Supabase
   */
  async syncPedidos(options: SyncOptions = {}): Promise<SyncResult> {
    const startTime = Date.now();
    let synced = 0;
    let errors = 0;

    try {
      logger.info("Starting pedidos sync from AllIn", "allin-sync");

      // Buscar pedidos da API AllIn
      const pedidos = await allinService.getPedidos();

      // Mapear para formato do Supabase
      const pedidoDTOs = allinDataMapper.mapPedidosToSupabase(pedidos);

      // Inserir/atualizar no Supabase
      const orderRepository = new OrderRepository();
      const now = new Date().toISOString();

      for (const pedidoDTO of pedidoDTOs) {
        try {
          // Verificar se já existe pelo allin_id
          const existing = await orderRepository.getClient()
            .schema("commerce")
            .from("pedidos")
            .select("*")
            .eq("allin_id", pedidoDTO.allin_id)
            .maybeSingle();

          if (existing.data) {
            // Atualizar registro existente
            await orderRepository.getClient()
              .schema("commerce")
              .from("pedidos")
              .update({
                ...pedidoDTO,
                allin_synced_at: now,
                data_modificado: now,
              })
              .eq("allin_id", pedidoDTO.allin_id);
            synced++;
          } else {
            // Inserir novo registro
            await orderRepository.getClient()
              .schema("commerce")
              .from("pedidos")
              .insert({
                ...pedidoDTO,
                allin_synced_at: now,
                data_criacao: pedidoDTO.data_criacao || now,
                data_modificado: now,
              });
            synced++;
          }
        } catch (error) {
          errors++;
          logger.error("Failed to sync pedido", "allin-sync", {
            error,
            allin_id: pedidoDTO.allin_id,
          });
        }
      }

      logger.info(`Synced ${synced} pedidos from AllIn to Supabase`, "allin-sync", {
        total: pedidoDTOs.length,
        synced,
        errors,
      });

      const duration = Date.now() - startTime;
      logger.info(`Pedidos sync completed`, "allin-sync", {
        total: pedidos.length,
        synced,
        errors,
        duration,
      });

      return {
        entity: "pedidos",
        total: pedidos.length,
        synced,
        errors,
        duration,
      };
    } catch (error) {
      errors++;
      const duration = Date.now() - startTime;
      logger.error("Pedidos sync failed", "allin-sync", { error, duration });
      throw error;
    }
  }

  /**
   * Sincroniza planos da API AllIn para Supabase
   */
  async syncPlanos(options: SyncOptions = {}): Promise<SyncResult> {
    const startTime = Date.now();
    let synced = 0;
    let errors = 0;

    try {
      logger.info("Starting planos sync from AllIn", "allin-sync");

      // Buscar planos da API AllIn
      const planos = await allinService.getPlanosAtivos();

      // Mapear para formato do Supabase
      const planoDTOs = allinDataMapper.mapPlanosToSupabase(planos);

      // Inserir/atualizar no Supabase
      const planRepository = new PlanRepository();
      const now = new Date().toISOString();

      for (const planoDTO of planoDTOs) {
        try {
          // Verificar se já existe pelo allin_id
          const existing = await planRepository.getClient()
            .schema("mlm")
            .from("planos")
            .select("*")
            .eq("allin_id", planoDTO.allin_id)
            .maybeSingle();

          if (existing.data) {
            // Atualizar registro existente
            await planRepository.getClient()
              .schema("mlm")
              .from("planos")
              .update({
                ...planoDTO,
                allin_synced_at: now,
                updated_at: now,
              })
              .eq("allin_id", planoDTO.allin_id);
            synced++;
          } else {
            // Inserir novo registro
            await planRepository.getClient()
              .schema("mlm")
              .from("planos")
              .insert({
                ...planoDTO,
                allin_synced_at: now,
                created_at: now,
                updated_at: now,
              });
            synced++;
          }
        } catch (error) {
          errors++;
          logger.error("Failed to sync plano", "allin-sync", {
            error,
            allin_id: planoDTO.allin_id,
          });
        }
      }

      logger.info(`Synced ${synced} planos from AllIn to Supabase`, "allin-sync", {
        total: planoDTOs.length,
        synced,
        errors,
      });

      const duration = Date.now() - startTime;
      logger.info(`Planos sync completed`, "allin-sync", {
        total: planos.length,
        synced,
        errors,
        duration,
      });

      return {
        entity: "planos",
        total: planos.length,
        synced,
        errors,
        duration,
      };
    } catch (error) {
      errors++;
      const duration = Date.now() - startTime;
      logger.error("Planos sync failed", "allin-sync", { error, duration });
      throw error;
    }
  }

  /**
   * Sincroniza todas as entidades
   */
  async syncAll(options: SyncOptions = {}): Promise<SyncResult[]> {
    const entities = options.entities || ["clientes", "distribuidores", "produtos", "pedidos", "planos"];
    const results: SyncResult[] = [];

    logger.info("Starting full sync from AllIn", "allin-sync", { entities });

    for (const entity of entities) {
      try {
        switch (entity) {
          case "clientes":
            results.push(await this.syncClientes(options));
            break;
          case "distribuidores":
            results.push(await this.syncDistribuidores(options));
            break;
          case "produtos":
            results.push(await this.syncProdutos(options));
            break;
          case "pedidos":
            results.push(await this.syncPedidos(options));
            break;
          case "planos":
            results.push(await this.syncPlanos(options));
            break;
        }
      } catch (error) {
        logger.error(`Failed to sync ${entity}`, "allin-sync", { error });
        results.push({
          entity,
          total: 0,
          synced: 0,
          errors: 1,
          duration: 0,
        });
      }
    }

    const totalSynced = results.reduce((sum, r) => sum + r.synced, 0);
    const totalErrors = results.reduce((sum, r) => sum + r.errors, 0);

    logger.info("Full sync from AllIn completed", "allin-sync", {
      results,
      totalSynced,
      totalErrors,
    });

    return results;
  }

  /**
   * Sincronização incremental (apenas dados modificados após um timestamp)
   */
  async syncIncremental(options: SyncOptions = {}): Promise<SyncResult[]> {
    // TODO: Implementar sincronização incremental
    // Isso requer:
    // 1. Armazenar timestamp da última sincronização
    // 2. Filtrar dados modificados após o timestamp
    // 3. Sincronizar apenas os dados modificados

    logger.warn("Incremental sync not yet implemented, falling back to full sync", "allin-sync");
    return this.syncAll(options);
  }
}

export const allinSyncService = AllInSyncService.getInstance();
