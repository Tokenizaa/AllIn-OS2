/**
 * Commission Calculation Domain Service
 * 
 * Domain service contendo lógica pura de cálculo de comissões MLM.
 * Separado de infraestrutura (database, APIs) para facilitar testes e reuso.
 * 
 * Responsabilidades:
 * - Cálculo de comissão direta
 * - Cálculo de comissão indireta
 * - Cálculo de bônus de perna
 * - Cálculo de bônus de liderança
 * - Validação de regras de negócio de comissões
 */

export interface CommissionRule {
  id: string;
  name: string;
  type: 'direct' | 'indirect' | 'leg_bonus' | 'leadership_bonus';
  percentage: number;
  maxLevel?: number;
  conditions?: CommissionCondition[];
}

export interface CommissionCondition {
  type: 'min_volume' | 'min_qualification' | 'min_active_downlines';
  value: number | string;
}

export interface CommissionCalculationResult {
  distributorId: string;
  orderId: string;
  commissionType: string;
  amount: number;
  percentage: number;
  level?: number;
  leg?: 'left' | 'right';
  conditions?: CommissionCondition[];
}

export interface DistributorNetwork {
  id: string;
  sponsorId: string;
  leftLegId: string;
  rightLegId: string;
  qualification: string;
  personalVolume: number;
  leftLegVolume: number;
  rightLegVolume: number;
  activeDownlines: number;
}

export class CommissionCalculationDomainService {
  private static instance: CommissionCalculationDomainService;

  private constructor() {}

  static getInstance(): CommissionCalculationDomainService {
    if (!CommissionCalculationDomainService.instance) {
      CommissionCalculationDomainService.instance = new CommissionCalculationDomainService();
    }
    return CommissionCalculationDomainService.instance;
  }

  /**
   * Regras de comissão por tipo
   * Estas regras podem ser configuradas via database no futuro
   */
  private commissionRules: Record<string, CommissionRule> = {
    'direct_commission': {
      id: 'direct_commission',
      name: 'Comissão Direta',
      type: 'direct',
      percentage: 10,
      conditions: [
        { type: 'min_qualification', value: 'bronze' },
      ],
    },
    'indirect_level_1': {
      id: 'indirect_level_1',
      name: 'Comissão Indireta Nível 1',
      type: 'indirect',
      percentage: 5,
      maxLevel: 1,
    },
    'indirect_level_2': {
      id: 'indirect_level_2',
      name: 'Comissão Indireta Nível 2',
      type: 'indirect',
      percentage: 3,
      maxLevel: 2,
    },
    'indirect_level_3': {
      id: 'indirect_level_3',
      name: 'Comissão Indireta Nível 3',
      type: 'indirect',
      percentage: 2,
      maxLevel: 3,
    },
    'indirect_level_4': {
      id: 'indirect_level_4',
      name: 'Comissão Indireta Nível 4',
      type: 'indirect',
      percentage: 1,
      maxLevel: 4,
    },
    'indirect_level_5': {
      id: 'indirect_level_5',
      name: 'Comissão Indireta Nível 5',
      type: 'indirect',
      percentage: 0.5,
      maxLevel: 5,
    },
    'leg_bonus_bronze': {
      id: 'leg_bonus_bronze',
      name: 'Bônus de Perna Bronze',
      type: 'leg_bonus',
      percentage: 5,
      conditions: [
        { type: 'min_qualification', value: 'bronze' },
      ],
    },
    'leg_bonus_silver': {
      id: 'leg_bonus_silver',
      name: 'Bônus de Perna Prata',
      type: 'leg_bonus',
      percentage: 7,
      conditions: [
        { type: 'min_qualification', value: 'silver' },
      ],
    },
    'leg_bonus_gold': {
      id: 'leg_bonus_gold',
      name: 'Bônus de Perna Ouro',
      type: 'leg_bonus',
      percentage: 10,
      conditions: [
        { type: 'min_qualification', value: 'gold' },
      ],
    },
    'leadership_bonus_platinum': {
      id: 'leadership_bonus_platinum',
      name: 'Bônus de Liderança Platina',
      type: 'leadership_bonus',
      percentage: 2,
      conditions: [
        { type: 'min_qualification', value: 'platinum' },
        { type: 'min_active_downlines', value: 20 },
      ],
    },
    'leadership_bonus_diamond': {
      id: 'leadership_bonus_diamond',
      name: 'Bônus de Liderança Diamante',
      type: 'leadership_bonus',
      percentage: 3,
      conditions: [
        { type: 'min_qualification', value: 'diamond' },
        { type: 'min_active_downlines', value: 30 },
      ],
    },
  };

  /**
   * Calcula comissão direta para o patrocinador
   * 
   * @param orderValue Valor total do pedido
   * @param sponsorId ID do patrocinador
   * @param sponsorQualification Qualificação do patrocinador
   * @returns Resultado do cálculo de comissão
   */
  calculateDirectCommission(
    orderValue: number,
    sponsorId: string,
    sponsorQualification: string
  ): CommissionCalculationResult {
    const rule = this.commissionRules['direct_commission'];
    
    // Validar condições
    if (!this.validateConditions(rule.conditions || [], sponsorQualification, 0, 0)) {
      return {
        distributorId: sponsorId,
        orderId: '',
        commissionType: 'direct',
        amount: 0,
        percentage: 0,
        conditions: rule.conditions,
      };
    }

    const amount = orderValue * (rule.percentage / 100);

    return {
      distributorId: sponsorId,
      orderId: '',
      commissionType: 'direct',
      amount,
      percentage: rule.percentage,
      conditions: rule.conditions,
    };
  }

  /**
   * Calcula comissões indiretas para uplines
   * 
   * @param orderValue Valor total do pedido
   * @param uplines Lista de uplines com suas qualificações
   * @returns Lista de comissões indiretas calculadas
   */
  calculateIndirectCommissions(
    orderValue: number,
    uplines: Array<{ id: string; qualification: string; level: number }>
  ): CommissionCalculationResult[] {
    const commissions: CommissionCalculationResult[] = [];

    for (const upline of uplines) {
      const ruleKey = `indirect_level_${upline.level}`;
      const rule = this.commissionRules[ruleKey];

      if (!rule) continue;

      const amount = orderValue * (rule.percentage / 100);

      commissions.push({
        distributorId: upline.id,
        orderId: '',
        commissionType: 'indirect',
        amount,
        percentage: rule.percentage,
        level: upline.level,
      });
    }

    return commissions;
  }

  /**
   * Calcula bônus de perna (binary tree)
   * 
   * @param distributor Distribuidor com dados da rede binária
   * @returns Bônus de perna calculado
   */
  calculateLegBonus(distributor: DistributorNetwork): CommissionCalculationResult {
    const ruleKey = `leg_bonus_${distributor.qualification.toLowerCase()}`;
    const rule = this.commissionRules[ruleKey];

    if (!rule) {
      return {
        distributorId: distributor.id,
        orderId: '',
        commissionType: 'leg_bonus',
        amount: 0,
        percentage: 0,
      };
    }

    // Validar condições
    if (!this.validateConditions(
      rule.conditions || [],
      distributor.qualification,
      distributor.activeDownlines,
      distributor.personalVolume
    )) {
      return {
        distributorId: distributor.id,
        orderId: '',
        commissionType: 'leg_bonus',
        amount: 0,
        percentage: 0,
        conditions: rule.conditions,
      };
    }

    // Bônus de perna é calculado sobre a perna menor
    const smallerLegVolume = Math.min(distributor.leftLegVolume, distributor.rightLegVolume);
    const amount = smallerLegVolume * (rule.percentage / 100);

    return {
      distributorId: distributor.id,
      orderId: '',
      commissionType: 'leg_bonus',
      amount,
      percentage: rule.percentage,
      conditions: rule.conditions,
    };
  }

  /**
   * Calcula bônus de liderança
   * 
   * @param distributor Distribuidor com dados da rede
   * @param teamVolume Volume total da equipe
   * @returns Bônus de liderança calculado
   */
  calculateLeadershipBonus(
    distributor: DistributorNetwork,
    teamVolume: number
  ): CommissionCalculationResult {
    const ruleKey = `leadership_bonus_${distributor.qualification.toLowerCase()}`;
    const rule = this.commissionRules[ruleKey];

    if (!rule) {
      return {
        distributorId: distributor.id,
        orderId: '',
        commissionType: 'leadership_bonus',
        amount: 0,
        percentage: 0,
      };
    }

    // Validar condições
    if (!this.validateConditions(
      rule.conditions || [],
      distributor.qualification,
      distributor.activeDownlines,
      distributor.personalVolume
    )) {
      return {
        distributorId: distributor.id,
        orderId: '',
        commissionType: 'leadership_bonus',
        amount: 0,
        percentage: 0,
        conditions: rule.conditions,
      };
    }

    // Bônus de liderança é calculado sobre o volume da equipe
    const amount = teamVolume * (rule.percentage / 100);

    return {
      distributorId: distributor.id,
      orderId: '',
      commissionType: 'leadership_bonus',
      amount,
      percentage: rule.percentage,
      conditions: rule.conditions,
    };
  }

  /**
   * Valida condições de uma regra de comissão
   * 
   * @param conditions Condições a validar
   * @param qualification Qualificação do distribuidor
   * @param activeDownlines Número de downlines ativos
   * @param personalVolume Volume pessoal
   * @returns true se condições são atendidas
   */
  private validateConditions(
    conditions: CommissionCondition[],
    qualification: string,
    activeDownlines: number,
    personalVolume: number
  ): boolean {
    for (const condition of conditions) {
      switch (condition.type) {
        case 'min_qualification':
          if (!this.isQualificationEqualOrHigher(qualification, condition.value as string)) {
            return false;
          }
          break;
        case 'min_active_downlines':
          if (activeDownlines < (condition.value as number)) {
            return false;
          }
          break;
        case 'min_volume':
          if (personalVolume < (condition.value as number)) {
            return false;
          }
          break;
      }
    }
    return true;
  }

  /**
   * Verifica se uma qualificação é igual ou superior a outra
   * 
   * @param current Qualificação atual
   * @param target Qualificação alvo
   * @returns true se current >= target
   */
  private isQualificationEqualOrHigher(current: string, target: string): boolean {
    const levels = ['none', 'bronze', 'silver', 'gold', 'platinum', 'diamond'];
    const currentIndex = levels.indexOf(current.toLowerCase());
    const targetIndex = levels.indexOf(target.toLowerCase());
    return currentIndex >= targetIndex;
  }

  /**
   * Processa todas as comissões para um pedido
   * 
   * @param orderValue Valor do pedido
   * @param sponsorId ID do patrocinador
   * @param sponsorQualification Qualificação do patrocinador
   * @param uplines Lista de uplines
   * @param distributor Distribuidor para bônus de perna/liderança
   * @param teamVolume Volume da equipe
   * @returns Todas as comissões calculadas
   */
  processOrderCommissions(
    orderValue: number,
    sponsorId: string,
    sponsorQualification: string,
    uplines: Array<{ id: string; qualification: string; level: number }>,
    distributor: DistributorNetwork,
    teamVolume: number
  ): CommissionCalculationResult[] {
    const commissions: CommissionCalculationResult[] = [];

    // Comissão direta
    const directCommission = this.calculateDirectCommission(
      orderValue,
      sponsorId,
      sponsorQualification
    );
    commissions.push(directCommission);

    // Comissões indiretas
    const indirectCommissions = this.calculateIndirectCommissions(orderValue, uplines);
    commissions.push(...indirectCommissions);

    // Bônus de perna
    const legBonus = this.calculateLegBonus(distributor);
    commissions.push(legBonus);

    // Bônus de liderança
    const leadershipBonus = this.calculateLeadershipBonus(distributor, teamVolume);
    commissions.push(leadershipBonus);

    return commissions;
  }

  /**
   * Obtém regra de comissão por ID
   * 
   * @param ruleId ID da regra
   * @returns Regra de comissão
   */
  getCommissionRule(ruleId: string): CommissionRule | undefined {
    return this.commissionRules[ruleId];
  }

  /**
   * Obtém todas as regras de comissão
   * 
   * @returns Todas as regras de comissão
   */
  getAllCommissionRules(): CommissionRule[] {
    return Object.values(this.commissionRules);
  }

  /**
   * Atualiza regra de comissão
   * 
   * @param ruleId ID da regra
   * @param rule Nova regra
   */
  updateCommissionRule(ruleId: string, rule: Partial<CommissionRule>): void {
    const existingRule = this.commissionRules[ruleId];
    if (existingRule) {
      this.commissionRules[ruleId] = { ...existingRule, ...rule };
    }
  }
}
