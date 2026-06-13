/**
 * Allin API Service Unit Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { AllinApiService } from '../allin-api.service';
import { CacheUtil } from '../utils/cache.util';

describe('AllinApiService', () => {
  let service: AllinApiService;
  let httpService: HttpService;
  let cacheUtil: CacheUtil;

  const mockConfigService = {
    get: jest.fn((key: string, defaultValue?: any) => {
      const config = {
        ALLIN_API_BASE_URL: 'https://test-api.example.com/api',
        ALLIN_CLIENT_ID: 'test-client-id',
        ALLIN_CLIENT_SECRET: 'test-client-secret',
        ALLIN_ACCESS_TOKEN: 'test-access-token',
        ALLIN_TIMEOUT: 30000,
        ALLIN_RETRY_ATTEMPTS: 3,
      };
      return config[key] || defaultValue;
    }),
  };

  const mockHttpService = {
    request: jest.fn(),
  };

  const mockCacheUtil = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    delPattern: jest.fn(),
    invalidateDistributorCache: jest.fn(),
    disconnect: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AllinApiService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: CacheUtil,
          useValue: mockCacheUtil,
        },
      ],
    }).compile();

    service = module.get<AllinApiService>(AllinApiService);
    httpService = module.get<HttpService>(HttpService);
    cacheUtil = module.get<CacheUtil>(CacheUtil);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDistributors', () => {
    it('should return distributors from cache if available', async () => {
      const cachedDistributors = [
        { id: 1, codigo: 'D001', nome: 'Test Distributor' },
      ];
      mockCacheUtil.get.mockResolvedValue(cachedDistributors);

      const result = await service.getDistributors({ limit: 10 });

      expect(result).toEqual(cachedDistributors);
      expect(cacheUtil.get).toHaveBeenCalledWith(
        expect.stringContaining('distributors:')
      );
      expect(httpService.request).not.toHaveBeenCalled();
    });

    it('should fetch distributors from API if not cached', async () => {
      const apiResponse = [
        { id: 1, codigo: 'D001', nome: 'Test Distributor' },
      ];
      mockCacheUtil.get.mockResolvedValue(null);
      mockHttpService.request.mockReturnValue(of({ data: apiResponse }));

      const result = await service.getDistributors({ limit: 10 });

      expect(result).toEqual(apiResponse);
      expect(httpService.request).toHaveBeenCalled();
      expect(cacheUtil.set).toHaveBeenCalled();
    });

    it('should retry on failure', async () => {
      mockCacheUtil.get.mockResolvedValue(null);
      mockHttpService.request
        .mockReturnValueOnce(throwError({ code: 'ECONNRESET' }))
        .mockReturnValueOnce(of({ data: [] }));

      await service.getDistributors({ limit: 10 });

      expect(httpService.request).toHaveBeenCalledTimes(2);
    });
  });

  describe('getDistributorById', () => {
    it('should return a single distributor', async () => {
      const distributor = { id: 1, codigo: 'D001', nome: 'Test' };
      mockCacheUtil.get.mockResolvedValue(null);
      mockHttpService.request.mockReturnValue(of({ data: distributor }));

      const result = await service.getDistributorById('1');

      expect(result).toEqual(distributor);
    });
  });

  describe('getOrders', () => {
    it('should return orders for a distributor', async () => {
      const orders = [{ id: 1, numero_pedido: 'ORD001', valor_total: 100 }];
      mockCacheUtil.get.mockResolvedValue(null);
      mockHttpService.request.mockReturnValue(of({ data: orders }));

      const result = await service.getOrders({ distribuidor_id: 1 });

      expect(result).toEqual(orders);
    });
  });

  describe('getWallet', () => {
    it('should return wallet information', async () => {
      const wallet = { id: 1, saldo: 1000, saldo_disponivel: 800 };
      mockCacheUtil.get.mockResolvedValue(null);
      mockHttpService.request.mockReturnValue(of({ data: wallet }));

      const result = await service.getWallet('1');

      expect(result).toEqual(wallet);
    });
  });

  describe('invalidateDistributorCache', () => {
    it('should invalidate all distributor-related cache', async () => {
      await service.invalidateDistributorCache(1);

      expect(cacheUtil.invalidateDistributorCache).toHaveBeenCalledWith(1);
    });
  });
});
