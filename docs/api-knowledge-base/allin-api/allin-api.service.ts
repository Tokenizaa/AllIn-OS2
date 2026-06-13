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
}
