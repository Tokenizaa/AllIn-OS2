/**
 * Points Calculation Domain Service
 * 
 * Domain service contendo lógica pura de cálculo de pontos MLM.
 * Separado de infraestrutura (database, APIs) para facilitar testes e reuso.
 * 
 * Responsabilidades:
 * - Cálculo de pontos de ativação
 * - Cálculo de pontos de renovação
 * - Cálculo de pontos de qualificação
 * - Histórico de pontos
 * - Validação de regras de pontos
 */

export interface PointsRule {
  id: string;
  name: string;
  type: 'activation' | 'renewal' | 'qualification' | 'bonus';
  pointsPerUnit: number;
  unitType: 'currency' | 'volume' | 'order';
  multiplier?: number;
  conditions?: PointsCondition[];
}

export interface PointsCondition {
  type: 'min_order_value' | 'min_qualification' | 'period';
  value: number | string;
}

export interface PointsCalculationResult {
  distributorId: string;
  pointsType: string;
  points: number;
  baseValue: number;
  multiplier: number;
  conditions?: PointsCondition[];
}

export interface PointsBalance {
  distributorId: string;
  activationPoints: number;
  renewalPoints: number;
  qualificationPoints: number;
  bonusPoints: number;
  totalPoints: number;
}

export class PointsCalculationDomainService {
  private static instance: PointsCalculationDomainService;

  private constructor() {}

  static getInstance(): PointsCalculationDomainService {
    if (!PointsCalculationDomainService.instance) {
      PointsCalculationDomainService.instance = new PointsCalculationDomainService();
    }
    return PointsCalculationDomainService.instance;
  }

  /**
   * Regras de pontos por tipo
   * Estas regras podem ser configuradas via database no futuro
   */
  private pointsRules: Record<string, PointsRule> = {
    'activation_purchase': {
      id: 'activation_purchase',
      name: 'Pontos de Ativação por Compra',
      type: 'activation',
      pointsPerUnit: 1,
      unitType: 'currency',
      multiplier: 1,
      conditions: [
        { type: 'min_order_value', value: 100 },
      ],
    },
    'activation_plan_bronze': {
      id: 'activation_plan_bronze',
      name: 'Pontos de Ativação Plano Bronze',
      type: 'activation',
      pointsPerUnit: 100,
      unitType: 'volume',
      multiplier: 1,
    },
    'activation_plan_silver': {
      id: 'activation_plan_silver',
      name: 'Pontos de Ativação Plano Prata',
      type: 'activation',
      pointsPerUnit: 500,
      unitType: 'volume',
      multiplier: 1,
    },
    'activation_plan_gold': {
      id: 'activation_plan_gold',
      name: 'Pontos de Ativação Plano Ouro',
      type: 'activation',
      pointsPerUnit: 1000,
      unitType: 'volume',
      multiplier: 1,
    },
    'renewal_monthly': {
      id: 'renewal_monthly',
      name: 'Pontos de Renovação Mensal',
      type: 'renewal',
      pointsPerUnit: 0.1,
      unitType: 'currency',
      multiplier: 1,
      conditions: [
        { type: 'period', value: 'monthly' },
      ],
    },
    'qualification_personal_volume': {
      id: 'qualification_personal_volume',
      name: 'Pontos de Qualificação Volume Pessoal',
      type: 'qualification',
      pointsPerUnit: 0.5,
      unitType: 'volume',
      multiplier: 1,
    },
    'qualification_team_volume': {
      id: 'qualification_team_volume',
      name: 'Pontos de Qualificação Volume da Equipe',
      type: 'qualification',
      pointsPerUnit: 0.1,
      unitType: 'volume',
      multiplier: 1,
    },
    'bonus_sponsor': {
      id: 'bonus_sponsor',
      name: 'Bônus de Pontos por Patrocínio',
      type: 'bonus',
      pointsPerUnit: 10,
      unitType: 'order',
      multiplier: 1,
    },
    'bonus_leadership': {
      id: 'bonus_leadership',
      name: 'Bônus de Pontos de Liderança',
      type: 'bonus',
      pointsPerUnit: 50,
      unitType: 'order',
      multiplier: 2,
      conditions: [
        { type: 'min_qualification', value: 'gold' },
      ],
    },
  };

  /**
   * Calcula pontos de ativação por compra
   * 
   * @param orderValue Valor do pedido
   * @param distributorId ID do distribuidor
   * @returns Pontos de ativação calculados
   */
  calculateActivationPointsByPurchase(
    orderValue: number,
    distributorId: string
  ): PointsCalculationResult {
    const rule = this.pointsRules['activation_purchase'];
    
    // Validar condições
    if (!this.validatePointsConditions(rule.conditions || [], orderValue, 'none')) {
      return {
        distributorId,
        pointsType: 'activation',
        points: 0,
        baseValue: orderValue,
        multiplier: rule.multiplier || 1,
        conditions: rule.conditions,
      };
    }

    const points = orderValue * rule.pointsPerUnit * (rule.multiplier || 1);

    return {
      distributorId,
      pointsType: 'activation',
      points,
      baseValue: orderValue,
      multiplier: rule.multiplier || 1,
      conditions: rule.conditions,
    };
  }

  /**
   * Calcula pontos de ativação por plano
   * 
   * @param planId ID do plano
   * @param distributorId ID do distribuidor
   * @returns Pontos de ativação calculados
   */
  calculateActivationPointsByPlan(
    planId: string,
    distributorId: string
  ): PointsCalculationResult {
    const rule = this.pointsRules[`activation_plan_${planId}`];
    
    if (!rule) {
      return {
        distributorId,
        pointsType: 'activation',
        points: 0,
        baseValue: 0,
        multiplier: 1,
      };
    }

    const points = rule.pointsPerUnit * (rule.multiplier || 1);

    return {
      distributorId,
      pointsType: 'activation',
      points,
      baseValue: rule.pointsPerUnit,
      multiplier: rule.multiplier || 1,
    };
  }

  /**
   * Calcula pontos de renovação mensal
   * 
   * @param monthlyVolume Volume mensal
   * @param distributorId ID do distribuidor
   * @returns Pontos de renovação calculados
   */
  calculateRenewalPoints(
    monthlyVolume: number,
    distributorId: string
  ): PointsCalculationResult {
    const rule = this.pointsRules['renewal_monthly'];
    const points = monthlyVolume * rule.pointsPerUnit * (rule.multiplier || 1);

    return {
      distributorId,
      pointsType: 'renewal',
      points,
      baseValue: monthlyVolume,
      multiplier: rule.multiplier || 1,
      conditions: rule.conditions,
    };
  }

  /**
   * Calcula pontos de qualificação por volume pessoal
   * 
   * @param personalVolume Volume pessoal
   * @param distributorId ID do distribuidor
   * @returns Pontos de qualificação calculados
   */
  calculateQualificationPointsByPersonalVolume(
    personalVolume: number,
    distributorId: string
  ): PointsCalculationResult {
    const rule = this.pointsRules['qualification_personal_volume'];
    const points = personalVolume * rule.pointsPerUnit * (rule.multiplier || 1);

    return {
      distributorId,
      pointsType: 'qualification',
      points,
      baseValue: personalVolume,
      multiplier: rule.multiplier || 1,
    };
  }

  /**
   * Calcula pontos de qualificação por volume da equipe
   * 
   * @param teamVolume Volume da equipe
   * @param distributorId ID do distribuidor
   * @returns Pontos de qualificação calculados
   */
  calculateQualificationPointsByTeamVolume(
    teamVolume: number,
    distributorId: string
  ): PointsCalculationResult {
    const rule = this.pointsRules['qualification_team_volume'];
    const points = teamVolume * rule.pointsPerUnit * (rule.multiplier || 1);

    return {
      distributorId,
      pointsType: 'qualification',
      points,
      baseValue: teamVolume,
      multiplier: rule.multiplier || 1,
    };
  }

  /**
   * Calcula bônus de pontos por patrocínio
   * 
   * @param ordersCount Número de pedidos da equipe
   * @param distributorId ID do distribrodor
   * @returns Bônus de pontos calculado
   */
  calculateSponsorBonusPoints(
    ordersCount: number,
    distributorId: string
  ): PointsCalculationResult {
    const rule = this.pointsRules['bonus_sponsor'];
    const points = ordersCount * rule.pointsPerUnit * (rule.multiplier || 1);

    return {
      distributorId,
      pointsType: 'bonus',
      points,
      baseValue: ordersCount,
      multiplier: rule.multiplier || 1,
    };
  }

  /**
   * Calcula bônus de pontos de liderança
   * 
   * @param ordersCount Número de pedidos da equipe
   * @param qualification Qualificação do distribuidor
   * @param distributorId ID do distribuidor
   * @returns Bônus de pontos calculado
   */
  calculateLeadershipBonusPoints(
    ordersCount: number,
    qualification: string,
    distributorId: string
  ): PointsCalculationResult {
    const rule = this.pointsRules['bonus_leadership'];
    
    // Validar condições
    if (!this.validatePointsConditions(rule.conditions || [], 0, qualification)) {
      return {
        distributorId,
        pointsType: 'bonus',
        points: 0,
        baseValue: ordersCount,
        multiplier: rule.multiplier || 1,
        conditions: rule.conditions,
      };
    }

    const points = ordersCount * rule.pointsPerUnit * (rule.multiplier || 1);

    return {
      distributorId,
      pointsType: 'bonus',
      points,
      baseValue: ordersCount,
      multiplier: rule.multiplier || 1,
      conditions: rule.conditions,
    };
  }

  /**
   * Calcula saldo total de pontos de um distribuidor
   * 
   * @param activationPoints Pontos de ativação
   * @param renewalPoints Pontos de renovação
   * @param qualificationPoints Pontos de qualificação
   * @param bonusPoints Pontos de bônus
   * @param distributorId ID do distribuidor
   * @returns Saldo de pontos
   */
  calculatePointsBalance(
    activationPoints: number,
    renewalPoints: number,
    qualificationPoints: number,
    bonusPoints: number,
    distributorId: string
  ): PointsBalance {
    const totalPoints = activationPoints + renewalPoints + qualificationPoints + bonusPoints;

    return {
      distributorId,
      activationPoints,
      renewalPoints,
      qualificationPoints,
      bonusPoints,
      totalPoints,
    };
  }

  /**
   * Valida condições de uma regra de pontos
   * 
   * @param conditions Condições a validar
   * @param value Valor a validar
   * @param qualification Qualificação do distribuidor
   * @returns true se condições são atendidas
   */
  private validatePointsConditions(
    conditions: PointsCondition[],
    value: number,
    qualification: string
  ): boolean {
    for (const condition of conditions) {
      switch (condition.type) {
        case 'min_order_value':
          if (value < (condition.value as number)) {
            return false;
          }
          break;
        case 'min_qualification':
          if (!this.isQualificationEqualOrHigher(qualification, condition.value as string)) {
            return false;
          }
          break;
        case 'period':
          // Período é validado externamente
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
   * Processa todos os pontos para um pedido
   * 
   * @param orderValue Valor do pedido
   * @param distributorId ID do distribuidor
   * @param qualification Qualificação do distribuidor
   * @param teamOrdersCount Número de pedidos da equipe
   * @returns Todos os pontos calculados
   */
  processOrderPoints(
    orderValue: number,
    distributorId: string,
    qualification: string,
    teamOrdersCount: number
  ): PointsCalculationResult[] {
    const points: PointsCalculationResult[] = [];

    // Pontos de ativação por compra
    const activationPoints = this.calculateActivationPointsByPurchase(orderValue, distributorId);
    points.push(activationPoints);

    // Pontos de qualificação por volume pessoal
    const qualificationPoints = this.calculateQualificationPointsByPersonalVolume(orderValue, distributorId);
    points.push(qualificationPoints);

    // Bônus de pontos por patrocínio
    const sponsorBonus = this.calculateSponsorBonusPoints(1, distributorId);
    points.push(sponsorBonus);

    // Bônus de pontos de liderança (se qualificado)
    const leadershipBonus = this.calculateLeadershipBonusPoints(teamOrdersCount, qualification, distributorId);
    points.push(leadershipBonus);

    return points;
  }

  /**
   * Obtém regra de pontos por ID
   * 
   * @param ruleId ID da regra
   * @returns Regra de pontos
   */
  getPointsRule(ruleId: string): PointsRule | undefined {
    return this.pointsRules[ruleId];
  }

  /**
   * Obtém todas as regras de pontos
   * 
   * @returns Todas as regras de pontos
   */
  getAllPointsRules(): PointsRule[] {
    return Object.values(this.pointsRules);
  }

  /**
   * Obtém regras de pontos por tipo
   * 
   * @param type Tipo de pontos
   * @returns Regras de pontos do tipo especificado
   */
  getPointsRulesByType(type: PointsRule['type']): PointsRule[] {
    return Object.values(this.pointsRules).filter(rule => rule.type === type);
  }

  /**
   * Atualiza regra de pontos
   * 
   * @param ruleId ID da regra
   * @param rule Nova regra
   */
  updatePointsRule(ruleId: string, rule: Partial<PointsRule>): void {
    const existingRule = this.pointsRules[ruleId];
    if (existingRule) {
      this.pointsRules[ruleId] = { ...existingRule, ...rule };
    }
  }

  /**
   * Calcula pontos necessários para atingir uma qualificação
   * 
   * @param targetQualification Qualificação alvo
   * @param currentPoints Pontos atuais
   * @returns Pontos necessários
   */
  calculatePointsNeededForQualification(
    targetQualification: string,
    currentPoints: number
  ): number {
    const pointsByQualification: Record<string, number> = {
      'none': 0,
      'bronze': 100,
      'silver': 500,
      'gold': 1000,
      'platinum': 2500,
      'diamond': 5000,
    };

    const requiredPoints = pointsByQualification[targetQualification] || 0;
    const neededPoints = Math.max(0, requiredPoints - currentPoints);

    return neededPoints;
  }

  /**
   * Verifica se distribuidor tem pontos suficientes para uma ação
   * 
   * @param distributorId ID do distribuidor
   * @param requiredPoints Pontos necessários
   * @param currentBalance Saldo atual
   * @returns true se tem pontos suficientes
   */
  hasSufficientPoints(
    distributorId: string,
    requiredPoints: number,
    currentBalance: number
  ): boolean {
    return currentBalance >= requiredPoints;
  }

  /**
   * Calcula pontos expirados (baseado em período)
   * 
   * @param points Pontos totais
   * @param monthsSinceLastActivity Meses desde última atividade
   * @param expirationPeriod Período de expiração em meses
   * @returns Pontos expirados
   */
  calculateExpiredPoints(
    points: number,
    monthsSinceLastActivity: number,
    expirationPeriod: number = 12
  ): number {
    if (monthsSinceLastActivity >= expirationPeriod) {
      return points; // Todos os pontos expiram
    }

    // Cálculo proporcional de expiração
    const expirationRate = monthsSinceLastActivity / expirationPeriod;
    const expiredPoints = Math.floor(points * expirationRate);

    return expiredPoints;
  }
}
