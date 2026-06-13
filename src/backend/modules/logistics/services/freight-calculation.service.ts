/**
 * Freight Calculation Service
 * 
 * Service responsável pelo cálculo de frete baseado em CEP de origem/destino,
 * peso/volume do pedido e valor do pedido.
 */

export interface FreightCalculationRequest {
  originCep: string;
  destinationCep: string;
  weight: number; // em kg
  volume?: number; // em m³
  orderValue: number;
  carrierId?: string;
}

export interface FreightCalculationResult {
  carrierId: string;
  carrierName: string;
  deliveryTime: number; // em dias úteis
  price: number;
  priceWithoutDiscount: number;
  discount: number;
  discountPercentage: number;
  estimatedDeliveryDate: Date;
}

export interface Carrier {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  baseRate: number;
  ratePerKg: number;
  ratePerKm: number;
  freeShippingThreshold: number;
  minDeliveryTime: number;
  maxDeliveryTime: number;
}

export class FreightCalculationService {
  private static instance: FreightCalculationService;

  private constructor() {}

  static getInstance(): FreightCalculationService {
    if (!FreightCalculationService.instance) {
      FreightCalculationService.instance = new FreightCalculationService();
    }
    return FreightCalculationService.instance;
  }

  /**
   * Transportadoras disponíveis
   * Em produção, isso viria do database
   */
  private carriers: Carrier[] = [
    {
      id: 'correios',
      name: 'Correios PAC',
      code: 'correios_pac',
      isActive: true,
      baseRate: 15.00,
      ratePerKg: 1.50,
      ratePerKm: 0.01,
      freeShippingThreshold: 299.00,
      minDeliveryTime: 5,
      maxDeliveryTime: 10,
    },
    {
      id: 'correios_sedex',
      name: 'Correios SEDEX',
      code: 'correios_sedex',
      isActive: true,
      baseRate: 25.00,
      ratePerKg: 2.00,
      ratePerKm: 0.02,
      freeShippingThreshold: 399.00,
      minDeliveryTime: 2,
      maxDeliveryTime: 4,
    },
    {
      id: 'jadlog',
      name: 'Jadlog',
      code: 'jadlog',
      isActive: true,
      baseRate: 20.00,
      ratePerKg: 1.80,
      ratePerKm: 0.015,
      freeShippingThreshold: 349.00,
      minDeliveryTime: 3,
      maxDeliveryTime: 7,
    },
  ];

  /**
   * Calcula distância aproximada entre dois CEPs
   * Em produção, isso usaria uma API de geolocalização
   * 
   * @param originCep CEP de origem
   * @param destinationCep CEP de destino
   * @returns Distância em km
   */
  private calculateDistance(originCep: string, destinationCep: string): number {
    // Simplificação: distância baseada nos primeiros dígitos do CEP
    // Em produção, usar API real (Google Maps, ViaCEP, etc)
    const originPrefix = parseInt(originCep.substring(0, 3));
    const destPrefix = parseInt(destinationCep.substring(0, 3));
    
    const diff = Math.abs(originPrefix - destPrefix);
    const distance = diff * 50; // 50km por diferença de prefixo
    
    return Math.max(50, distance); // Mínimo 50km
  }

  /**
   * Calcula frete para uma transportadora específica
   * 
   * @param request Dados do cálculo de frete
   * @param carrier Transportadora
   * @returns Resultado do cálculo
   */
  private calculateFreightForCarrier(
    request: FreightCalculationRequest,
    carrier: Carrier
  ): FreightCalculationResult {
    const distance = this.calculateDistance(request.originCep, request.destinationCep);
    
    // Cálculo base do frete
    let price = carrier.baseRate;
    price += request.weight * carrier.ratePerKg;
    price += distance * carrier.ratePerKm;
    
    // Adicionar volume se especificado
    if (request.volume) {
      price += request.volume * 10; // R$ 10 por m³
    }
    
    const priceWithoutDiscount = price;
    
    // Aplicar desconto por valor do pedido
    let discount = 0;
    let discountPercentage = 0;
    
    if (request.orderValue >= carrier.freeShippingThreshold) {
      discount = price;
      discountPercentage = 100;
    } else if (request.orderValue >= carrier.freeShippingThreshold * 0.8) {
      discount = price * 0.5; // 50% de desconto
      discountPercentage = 50;
    } else if (request.orderValue >= carrier.freeShippingThreshold * 0.5) {
      discount = price * 0.25; // 25% de desconto
      discountPercentage = 25;
    }
    
    price -= discount;
    price = Math.max(0, price);
    
    // Calcular tempo de entrega
    const deliveryTime = Math.floor(
      carrier.minDeliveryTime + Math.random() * (carrier.maxDeliveryTime - carrier.minDeliveryTime)
    );
    
    // Calcular data estimada de entrega
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + deliveryTime);
    
    return {
      carrierId: carrier.id,
      carrierName: carrier.name,
      deliveryTime,
      price,
      priceWithoutDiscount,
      discount,
      discountPercentage,
      estimatedDeliveryDate,
    };
  }

  /**
   * Calcula frete para todas as transportadoras disponíveis
   * 
   * @param request Dados do cálculo de frete
   * @returns Lista de resultados de frete
   */
  calculateFreight(request: FreightCalculationRequest): FreightCalculationResult[] {
    const results: FreightCalculationResult[] = [];
    
    const activeCarriers = this.carriers.filter(c => c.isActive);
    
    for (const carrier of activeCarriers) {
      const result = this.calculateFreightForCarrier(request, carrier);
      results.push(result);
    }
    
    // Ordenar por preço
    results.sort((a, b) => a.price - b.price);
    
    return results;
  }

  /**
   * Calcula frete para uma transportadora específica
   * 
   * @param request Dados do cálculo de frete
   * @param carrierId ID da transportadora
   * @returns Resultado do cálculo ou null se não encontrar
   */
  calculateFreightForCarrierId(
    request: FreightCalculationRequest,
    carrierId: string
  ): FreightCalculationResult | null {
    const carrier = this.carriers.find(c => c.id === carrierId);
    
    if (!carrier || !carrier.isActive) {
      return null;
    }
    
    return this.calculateFreightForCarrier(request, carrier);
  }

  /**
   * Obtém transportadora mais barata
   * 
   * @param request Dados do cálculo de frete
   * @returns Transportadora mais barata ou null
   */
  getCheapestCarrier(request: FreightCalculationRequest): FreightCalculationResult | null {
    const results = this.calculateFreight(request);
    
    if (results.length === 0) {
      return null;
    }
    
    return results[0]; // Já ordenado por preço
  }

  /**
   * Obtém transportadora mais rápida
   * 
   * @param request Dados do cálculo de frete
   * @returns Transportadora mais rápida ou null
   */
  getFastestCarrier(request: FreightCalculationRequest): FreightCalculationResult | null {
    const results = this.calculateFreight(request);
    
    if (results.length === 0) {
      return null;
    }
    
    // Ordenar por tempo de entrega
    results.sort((a, b) => a.deliveryTime - b.deliveryTime);
    
    return results[0];
  }

  /**
   * Obtém todas as transportadoras
   * 
   * @returns Lista de transportadoras
   */
  getAllCarriers(): Carrier[] {
    return this.carriers;
  }

  /**
   * Obtém transportadoras ativas
   * 
   * @returns Lista de transportadoras ativas
   */
  getActiveCarriers(): Carrier[] {
    return this.carriers.filter(c => c.isActive);
  }

  /**
   * Obtém transportadora por ID
   * 
   * @param carrierId ID da transportadora
   * @returns Transportadora ou null
   */
  getCarrierById(carrierId: string): Carrier | null {
    return this.carriers.find(c => c.id === carrierId) || null;
  }

  /**
   * Adiciona nova transportadora
   * 
   * @param carrier Dados da transportadora
   */
  addCarrier(carrier: Omit<Carrier, 'id'>): Carrier {
    const newCarrier: Carrier = {
      ...carrier,
      id: `carrier_${Date.now()}`,
    };
    
    this.carriers.push(newCarrier);
    
    return newCarrier;
  }

  /**
   * Atualiza transportadora
   * 
   * @param carrierId ID da transportadora
   * @param updates Atualizações
   * @returns true se atualizou com sucesso
   */
  updateCarrier(carrierId: string, updates: Partial<Carrier>): boolean {
    const index = this.carriers.findIndex(c => c.id === carrierId);
    
    if (index === -1) {
      return false;
    }
    
    this.carriers[index] = { ...this.carriers[index], ...updates };
    
    return true;
  }

  /**
   * Remove transportadora
   * 
   * @param carrierId ID da transportadora
   * @returns true se removeu com sucesso
   */
  removeCarrier(carrierId: string): boolean {
    const index = this.carriers.findIndex(c => c.id === carrierId);
    
    if (index === -1) {
      return false;
    }
    
    this.carriers.splice(index, 1);
    
    return true;
  }

  /**
   * Ativa ou desativa transportadora
   * 
   * @param carrierId ID da transportadora
   * @param isActive Status de ativação
   * @returns true se atualizou com sucesso
   */
  setCarrierActive(carrierId: string, isActive: boolean): boolean {
    return this.updateCarrier(carrierId, { isActive });
  }

  /**
   * Valida CEP
   * 
   * @param cep CEP a validar
   * @returns true se CEP é válido
   */
  validateCep(cep: string): boolean {
    // Remove caracteres não numéricos
    const cleanCep = cep.replace(/\D/g, '');
    
    // Verifica se tem 8 dígitos
    if (cleanCep.length !== 8) {
      return false;
    }
    
    // Verifica se todos os dígitos são iguais (CEPs inválidos)
    if (/^(\d)\1+$/.test(cleanCep)) {
      return false;
    }
    
    return true;
  }

  /**
   * Formata CEP
   * 
   * @param cep CEP a formatar
   * @returns CEP formatado (XXXXX-XXX)
   */
  formatCep(cep: string): string {
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) {
      return cep;
    }
    
    return `${cleanCep.substring(0, 5)}-${cleanCep.substring(5)}`;
  }

  /**
   * Calcula frete com desconto adicional
   * 
   * @param request Dados do cálculo de frete
   * @param additionalDiscountPercentage Percentual de desconto adicional
   * @returns Lista de resultados de frete com desconto adicional
   */
  calculateFreightWithAdditionalDiscount(
    request: FreightCalculationRequest,
    additionalDiscountPercentage: number
  ): FreightCalculationResult[] {
    const results = this.calculateFreight(request);
    
    return results.map(result => {
      const additionalDiscount = result.priceWithoutDiscount * (additionalDiscountPercentage / 100);
      const newPrice = Math.max(0, result.price - additionalDiscount);
      const newDiscountPercentage = Math.min(100, result.discountPercentage + additionalDiscountPercentage);
      
      return {
        ...result,
        price: newPrice,
        discount: result.discount + additionalDiscount,
        discountPercentage: newDiscountPercentage,
      };
    });
  }
}
