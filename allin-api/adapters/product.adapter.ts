/**
 * Product Adapter
 * Transforms raw API responses into domain entities
 */

import { ProductDTO } from '../dto/product.dto';

export interface ProductEntity {
  id: number;
  code: string;
  ncm: string;
  price: number;
  isPlan: boolean;
  isUpgradePlan: boolean;
  isRepurchasePlan: boolean;
  isRenewalPlan: boolean;
  isActivation: boolean;
  isVisible: boolean;
  requiresFreight: boolean;
  weight?: number;
  quantity: number;
  minQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export class ProductAdapter {
  static toEntity(dto: ProductDTO): ProductEntity {
    return {
      id: dto.id,
      code: dto.modelo,
      ncm: dto.ncm,
      price: dto.preco,
      isPlan: dto.e_plano,
      isUpgradePlan: dto.upgrade_plano,
      isRepurchasePlan: dto.recompra_plano,
      isRenewalPlan: dto.renovacao_plano,
      isActivation: dto.ativacao,
      isVisible: dto.e_visivel,
      requiresFreight: dto.requer_frete,
      weight: dto.peso,
      quantity: dto.quantidade,
      minQuantity: dto.quantidade_minima,
      createdAt: new Date(dto.data_cadastro),
      updatedAt: new Date(dto.data_atualizacao),
    };
  }

  static toDTO(entity: ProductEntity): ProductDTO {
    return {
      id: entity.id,
      modelo: entity.code,
      ncm: entity.ncm,
      preco: entity.price,
      e_plano: entity.isPlan,
      upgrade_plano: entity.isUpgradePlan,
      recompra_plano: entity.isRepurchasePlan,
      renovacao_plano: entity.isRenewalPlan,
      ativacao: entity.isActivation,
      e_visivel: entity.isVisible,
      requer_frete: entity.requiresFreight,
      peso: entity.weight,
      quantidade: entity.quantity,
      quantidade_minima: entity.minQuantity,
      data_cadastro: entity.createdAt.toISOString(),
      data_atualizacao: entity.updatedAt.toISOString(),
    };
  }
}
