/**
 * Allin API Service
 * Provides typed SDK for interacting with the external MLM API
 * Includes retry logic, caching, and error handling
 */

import { Injectable, Logger, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
// Temporarily disable CacheUtil to prevent Redis connection errors
import { CacheUtil } from './utils/cache.util';
import { RetryUtil } from './utils/retry.util';
import { ErrorHandlerUtil } from './utils/error-handler.util';
import { AllinApiConfig, ApiRequestOptions } from './interfaces/allin-api.interface';
import {
  DistributorDTO,
  DistributorFilterDTO,
} from './dto/distributor.dto';
import {
  OrderDTO,
  OrderFilterDTO,
} from './dto/order.dto';
import {
  WalletDTO,
  TransactionDTO,
  WalletFilterDTO,
} from './dto/wallet.dto';
import {
  NetworkDTO,
  NetworkNodeDTO,
  LinearNetworkNodeDTO,
  NetworkFilterDTO,
  LinearNetworkFilterDTO,
} from './dto/network.dto';
import {
  BonusDTO,
  BonusFilterDTO,
} from './dto/bonus.dto';
import {
  ProductDTO,
  ProductFilterDTO,
} from './dto/product.dto';
import {
  CustomerPhoneDTO,
  CustomerPhoneFilterDTO,
  CustomerAddressDTO,
  CustomerAddressFilterDTO,
  CustomerAccountDTO,
  CustomerAccountFilterDTO,
} from './dto/customer-subresources.dto';
import {
  DistributorPhoneDTO,
  DistributorPhoneFilterDTO,
  DistributorActivacaoMensalDTO,
  DistribuidorAtivacaoMensalFilterDTO,
} from './dto/distributor-subresources.dto';
import {
  ProductStockDTO,
  ProductStockFilterDTO,
  ProductStockTotalDTO,
  ProductOptionValueDTO,
  ProductOptionValueFilterDTO,
} from './dto/product-subresources.dto';
import {
  OrderHistoryDTO,
  OrderHistoryFilterDTO,
  OrderKitItemDTO,
  OrderKitItemFilterDTO,
  OrderBillingItemDTO,
  OrderBillingItemFilterDTO,
  OrderTransportDTO,
  OrderTransportFilterDTO,
} from './dto/order-subresources.dto';

@Injectable()
export class AllinApiService {
  private readonly logger = new Logger(AllinApiService.name);
  private readonly config: AllinApiConfig;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    @Optional() private readonly cacheUtil?: CacheUtil,
  ) {
    this.config = {
      baseUrl: this.configService.get('ALLIN_API_BASE_URL', 'https://localhost:8080/api'),
      clientId: this.configService.get('ALLIN_CLIENT_ID'),
      clientSecret: this.configService.get('ALLIN_CLIENT_SECRET'),
      accessToken: this.configService.get('ALLIN_ACCESS_TOKEN'),
      timeout: this.configService.get('ALLIN_TIMEOUT', 30000),
      retryAttempts: this.configService.get('ALLIN_RETRY_ATTEMPTS', 3),
    };
  }

  private async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const {
      method = 'GET',
      params,
      data,
      cacheKey,
      cacheTTL = 300,
    } = options;

    // Check cache first for GET requests
    if (cacheKey && method === 'GET') {
      // Temporarily disable cache
      // const cached = await this.cacheUtil.get<T>(cacheKey);
      // if (cached) {
      //   this.logger.debug(`Cache hit for key: ${cacheKey}`);
      //   return cached;
      // }
    }

    const url = `${this.config.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.config.accessToken}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await RetryUtil.withRetry(
        async () => {
          const response = await firstValueFrom(
            this.httpService.request<T>({
              method,
              url,
              headers,
              params,
              data,
              timeout: this.config.timeout,
            })
          );
          return response.data;
        },
        {
          maxRetries: this.config.retryAttempts,
          onRetry: (attempt, error) => {
            this.logger.warn(`Retry attempt ${attempt} for ${url}`, error.message);
          },
        }
      );

      // Cache successful GET requests
      if (cacheKey && method === 'GET') {
        // Temporarily disable cache
        // await this.cacheUtil.set(cacheKey, response, cacheTTL);
      }

      return response;
    } catch (error) {
      ErrorHandlerUtil.logError('AllinApiService.request', error, this.logger);
      ErrorHandlerUtil.handleError(error);
    }
  }

  // Distributor endpoints
  async getDistributors(params: DistributorFilterDTO = {}): Promise<DistributorDTO[]> {
    return this.request<DistributorDTO[]>('/v1/distribuidores', {
      params: {
        limit: params.limit || 100,
        page: params.page || 1,
        id: params.id,
        nome__contem: params.nome__contem,
        usuario__contem: params.usuario__contem,
        status: params.status,
      },
      cacheKey: `distributors:${JSON.stringify(params)}`,
      cacheTTL: 600,
    });
  }

  async getDistributorById(id: string): Promise<DistributorDTO> {
    return this.request<DistributorDTO>(`/v1/distribuidores/${id}`, {
      cacheKey: `distributor:${id}`,
      cacheTTL: 300,
    });
  }

  // Order endpoints
  async getOrders(params: OrderFilterDTO = {}): Promise<OrderDTO[]> {
    return this.request<OrderDTO[]>('/v1/pedidos', {
      params: {
        limit: params.limit || 100,
        page: params.page || 1,
        distribuidor_id: params.distribuidor_id,
        status: params.status,
        data_pedido__maior_igual: params.data_pedido__maior_igual,
        data_pedido__menor_igual: params.data_pedido__menor_igual,
      },
      cacheKey: `orders:${JSON.stringify(params)}`,
      cacheTTL: 300,
    });
  }

  async getOrderById(id: string): Promise<OrderDTO> {
    return this.request<OrderDTO>(`/v1/pedidos/${id}`, {
      cacheKey: `order:${id}`,
      cacheTTL: 600,
    });
  }

  // Wallet endpoints
  async getWallet(distributorId: string): Promise<WalletDTO> {
    return this.request<WalletDTO>(`/v1/carteiras/${distributorId}`, {
      cacheKey: `wallet:${distributorId}`,
      cacheTTL: 60,
    });
  }

  async getWalletTransactions(params: WalletFilterDTO = {}): Promise<TransactionDTO[]> {
    return this.request<TransactionDTO[]>('/v1/transacoes', {
      params: {
        limit: params.limit || 100,
        page: params.page || 1,
        distribuidor_id: params.distribuidor_id,
        tipo: params.tipo,
        status: params.status,
      },
      cacheKey: `transactions:${JSON.stringify(params)}`,
      cacheTTL: 120,
    });
  }

  // Network endpoints
  async getNetwork(distributorId: string): Promise<NetworkDTO> {
    return this.request<NetworkDTO>(`/v1/rede-binaria/${distributorId}`, {
      cacheKey: `network:${distributorId}`,
      cacheTTL: 300,
    });
  }

  async getDownlines(distributorId: string, params: NetworkFilterDTO = {}): Promise<NetworkNodeDTO[]> {
    return this.request<NetworkNodeDTO[]>(`/v1/rede-binaria/${distributorId}/downlines`, {
      params: {
        limit: params.limit || 100,
        page: params.page || 1,
        leg: params.leg,
      },
      cacheKey: `downlines:${distributorId}:${JSON.stringify(params)}`,
      cacheTTL: 300,
    });
  }

  async getLinearNetwork(params: LinearNetworkFilterDTO = {}): Promise<LinearNetworkNodeDTO[]> {
    return this.request<LinearNetworkNodeDTO[]>('/v1/rede-linear-nos', {
      params: {
        limit: params.limit || 100,
        page: params.page || 1,
        linha: params.linha,
        posicao_relativa: params.posicao_relativa,
        id_distribuidor: params.id_distribuidor,
        id_patrocinador: params.id_patrocinador,
        usuario_distribuidor: params.usuario_distribuidor,
        usuario_patrocinador: params.usuario_patrocinador,
      },
      cacheKey: `linear-network:${JSON.stringify(params)}`,
      cacheTTL: 300,
    });
  }

  // Bonus endpoints
  async getBonus(params: BonusFilterDTO = {}): Promise<BonusDTO[]> {
    return this.request<BonusDTO[]>('/v1/bonus', {
      params: {
        limit: params.limit || 100,
        page: params.page || 1,
        distribuidor_id: params.distribuidor_id,
        tipo: params.tipo,
        status: params.status,
        periodo: params.periodo,
        data_cadastro__maior_igual: params.data_cadastro__maior_igual,
        data_cadastro__menor_igual: params.data_cadastro__menor_igual,
      },
      cacheKey: `bonus:${JSON.stringify(params)}`,
      cacheTTL: 600,
    });
  }

  // Product endpoints
  async getProducts(params: ProductFilterDTO = {}): Promise<ProductDTO[]> {
    return this.request<ProductDTO[]>('/v1/produtos', {
      params: {
        limit: params.limit || 100,
        page: params.page || 1,
        e_plano: params.e_plano,
        e_visivel: params.e_visivel,
        modelo__contem: params.modelo__contem,
        order_by: params.order_by,
      },
      cacheKey: `products:${JSON.stringify(params)}`,
      cacheTTL: 1800,
    });
  }

  async getProductById(id: string): Promise<ProductDTO> {
    return this.request<ProductDTO>(`/v1/produtos/${id}`, {
      cacheKey: `product:${id}`,
      cacheTTL: 3600,
    });
  }

  // Cache invalidation
  async invalidateDistributorCache(distributorId: number): Promise<void> {
    if (!this.cacheUtil) {
      this.logger.warn('CacheUtil not available; skipping distributor cache invalidation');
      return;
    }
    await this.cacheUtil.invalidateDistributorCache(distributorId);
    this.logger.log(`Invalidated cache for distributor ${distributorId}`);
  }

  // ============================================================================
  // CUSTOMER SUB-RESOURCES
  // ============================================================================

  async getCustomerPhones(params: CustomerPhoneFilterDTO = {}): Promise<CustomerPhoneDTO[]> {
    return this.request<CustomerPhoneDTO[]>('/v1/clientes/Telefones', {
      params: {
        limit: params.limit || 100,
        page: params.page || 1,
        cliente_id: params.cliente_id,
        telefone__contem: params.telefone__contem,
      },
      cacheKey: `customer-phones:${JSON.stringify(params)}`,
      cacheTTL: 300,
    });
  }

  async getCustomerAddresses(params: CustomerAddressFilterDTO = {}): Promise<CustomerAddressDTO[]> {
    return this.request<CustomerAddressDTO[]>('/v1/clientes/Enderecos', {
      params: {
        limit: params.limit || 100,
        page: params.page || 1,
        cliente_id: params.cliente_id,
        tipo: params.tipo,
        cep__contem: params.cep__contem,
      },
      cacheKey: `customer-addresses:${JSON.stringify(params)}`,
      cacheTTL: 300,
    });
  }

  async getCustomerAccounts(params: CustomerAccountFilterDTO = {}): Promise<CustomerAccountDTO[]> {
    return this.request<CustomerAccountDTO[]>('/v1/clientes/Contas', {
      params: {
        limit: params.limit || 100,
        page: params.page || 1,
        cliente_id: params.cliente_id,
        tipo: params.tipo,
        banco_id: params.banco_id,
      },
      cacheKey: `customer-accounts:${JSON.stringify(params)}`,
      cacheTTL: 300,
    });
  }

  async getCustomerTokenLogin(email: string, password: string): Promise<{ access_token: string; expires_in: number; token_type: string }> {
    return this.request<{ access_token: string; expires_in: number; token_type: string }>('/v1/clientes/TokenLogin', {
      method: 'POST',
      data: { email, password },
      cacheKey: null,
      cacheTTL: 0,
    });
  }

  // ============================================================================
  // DISTRIBUTOR SUB-RESOURCES
  // ============================================================================

  async getDistributorPhones(params: DistributorPhoneFilterDTO = {}): Promise<DistributorPhoneDTO[]> {
    return this.request<DistributorPhoneDTO[]>('/v1/distribuidores/Telefones', {
      params: {
        limit: params.limit || 100,
        page: params.page || 1,
        distribuidor_id: params.distribuidor_id,
        telefone__contem: params.telefone__contem,
      },
      cacheKey: `distributor-phones:${JSON.stringify(params)}`,
      cacheTTL: 300,
    });
  }

  async getDistributorAtivacoesMensais(params: DistribuidorAtivacaoMensalFilterDTO = {}): Promise<DistributorActivacaoMensalDTO[]> {
    return this.request<DistributorActivacaoMensalDTO[]>('/v1/distribuidores/AtivacoesMensais', {
      params: {
        limit: params.limit || 100,
        page: params.page || 1,
        distribuidor_id: params.distribuidor_id,
        ano: params.ano,
        mes: params.mes,
      },
      cacheKey: `distributor-ativacoes:${JSON.stringify(params)}`,
      cacheTTL: 600,
    });
  }

  async getDistributorPlanoAtual(distribuidorId: string): Promise<any> {
    return this.request<any>(`/v1/distribuidores/PlanoAtual`, {
      params: { distribuidor_id: distribuidorId },
      cacheKey: `distributor-plano-atual:${distribuidorId}`,
      cacheTTL: 300,
    });
  }

  async getDistributorQualificacaoAtual(distribuidorId: string): Promise<any> {
    return this.request<any>(`/v1/distribuidores/QualificacaoAtual`, {
      params: { distribuidor_id: distribuidorId },
      cacheKey: `distributor-qualificacao-atual:${distribuidorId}`,
      cacheTTL: 300,
    });
  }

  // ============================================================================
  // PRODUCT SUB-RESOURCES
  // ============================================================================

  async getProductStock(params: ProductStockFilterDTO = {}): Promise<ProductStockDTO[]> {
    return this.request<ProductStockDTO[]>('/v1/produtos/Estoque', {
      params: {
        limit: params.limit || 100,
        page: params.page || 1,
        produto_id: params.produto_id,
        loja_id: params.loja_id,
        deposito_id: params.deposito_id,
      },
      cacheKey: `product-stock:${JSON.stringify(params)}`,
      cacheTTL: 300,
    });
  }

  async getProductStockTotals(params: ProductStockFilterDTO = {}): Promise<ProductStockTotalDTO[]> {
    return this.request<ProductStockTotalDTO[]>('/v1/produtos/EstoqueTotais', {
      params: {
        limit: params.limit || 100,
        page: params.page || 1,
        produto_id: params.produto_id,
        produto_opcao_valor_id: params.produto_opcao_valor_id,
        id_loja: params.id_loja,
      },
      cacheKey: `product-stock-totals:${JSON.stringify(params)}`,
      cacheTTL: 300,
    });
  }

  async getProductOptionValues(params: ProductOptionValueFilterDTO = {}): Promise<ProductOptionValueDTO[]> {
    return this.request<ProductOptionValueDTO[]>('/v1/produtos/OpcoesValores', {
      params: {
        limit: params.limit || 100,
        page: params.page || 1,
        produto_id: params.produto_id,
        campo_opcao_id: params.campo_opcao_id,
        opcao_id: params.opcao_id,
      },
      cacheKey: `product-option-values:${JSON.stringify(params)}`,
      cacheTTL: 1800,
    });
  }

  // ============================================================================
  // ORDER SUB-RESOURCES
  // ============================================================================

  async getOrderHistory(params: OrderHistoryFilterDTO = {}): Promise<OrderHistoryDTO[]> {
    return this.request<OrderHistoryDTO[]>('/v1/pedidos/Historico', {
      params: {
        limit: params.limit || 100,
        page: params.page || 1,
        pedido_id: params.pedido_id,
        status_novo: params.status_novo,
        data_inicio: params.data_inicio,
        data_fim: params.data_fim,
      },
      cacheKey: `order-history:${JSON.stringify(params)}`,
      cacheTTL: 300,
    });
  }

  async getOrderKitItems(params: OrderKitItemFilterDTO = {}): Promise<OrderKitItemDTO[]> {
    return this.request<OrderKitItemDTO[]>('/v1/pedidos/Itens/KitItens', {
      params: {
        limit: params.limit || 100,
        page: params.page || 1,
        pedido_id: params.pedido_id,
        produto_id: params.produto_id,
      },
      cacheKey: `order-kit-items:${JSON.stringify(params)}`,
      cacheTTL: 300,
    });
  }

  async getOrderBillingItems(params: OrderBillingItemFilterDTO = {}): Promise<OrderBillingItemDTO[]> {
    return this.request<OrderBillingItemDTO[]>('/v1/pedidos/ItensFaturamento', {
      params: {
        limit: params.limit || 100,
        page: params.page || 1,
        pedido_id: params.pedido_id,
        produto_id: params.produto_id,
      },
      cacheKey: `order-billing-items:${JSON.stringify(params)}`,
      cacheTTL: 300,
    });
  }

  async getOrderTransports(params: OrderTransportFilterDTO = {}): Promise<OrderTransportDTO[]> {
    return this.request<OrderTransportDTO[]>('/v1/pedidos/Transportes', {
      params: {
        limit: params.limit || 100,
        page: params.page || 1,
        pedido_id: params.pedido_id,
        transportadora_id: params.transportadora_id,
        status: params.status,
        codigo_rastreamento: params.codigo_rastreamento,
      },
      cacheKey: `order-transports:${JSON.stringify(params)}`,
      cacheTTL: 300,
    });
  }

  async getOrderTotals(): Promise<any[]> {
    return this.request<any[]>('/v1/pedidos/Totais', {
      cacheKey: 'order-totals',
      cacheTTL: 600,
    });
  }
}
