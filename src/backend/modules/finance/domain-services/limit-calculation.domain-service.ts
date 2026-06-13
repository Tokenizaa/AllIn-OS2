/**
 * Limit Calculation Domain Service
 * 
 * Domain service contendo lógica pura de cálculo e validação de limites financeiros.
 * Separado de infraestrutura (database, APIs) para facilitar testes e reuso.
 * 
 * Responsabilidades:
 * - Cálculo de limites por plano
 * - Cálculo de limites por qualificação
 * - Validação de limites
 */

export interface LimitRule {
  id: string;
  name: string;
  type: 'withdrawal' | 'transfer' | 'payment';
  scope: 'daily' | 'weekly' | 'monthly';
  value: number;
  conditions?: LimitCondition[];
}

export interface LimitCondition {
  type: 'qualification' | 'plan' | 'account_age';
  value: string | number;
}

export interface LimitCalculationResult {
  distributorId: string;
  limitType: string;
  scope: string;
  limit: number;
  currentUsage: number;
  remaining: number;
  exceeded: boolean;
  conditions?: LimitCondition[];
}

export interface DistributorLimits {
  distributorId: string;
  qualification: string;
  plan: string;
  accountAge: number; // em dias
}

export class LimitCalculationDomainService {
  private static instance: LimitCalculationDomainService;

  private constructor() {}

  static getInstance(): LimitCalculationDomainService {
    if (!LimitCalculationDomainService.instance) {
      LimitCalculationDomainService.instance = new LimitCalculationDomainService();
    }
    return LimitCalculationDomainService.instance;
  }

  /**
   * Regras de limite por tipo e escopo
   * Estas regras podem ser configuradas via database no futuro
   */
  private limitRules: Record<string, LimitRule> = {
    'withdrawal_daily_default': {
      id: 'withdrawal_daily_default',
      name: 'Limite Diário de Saque Padrão',
      type: 'withdrawal',
      scope: 'daily',
      value: 5000,
    },
    'withdrawal_daily_bronze': {
      id: 'withdrawal_daily_bronze',
      name: 'Limite Diário de Saque Bronze',
      type: 'withdrawal',
      scope: 'daily',
      value: 3000,
      conditions: [
        { type: 'qualification', value: 'bronze' },
      ],
    },
    'withdrawal_daily_silver': {
      id: 'withdrawal_daily_silver',
      name: 'Limite Diário de Saque Prata',
      type: 'withdrawal',
      scope: 'daily',
      value: 7000,
      conditions: [
        { type: 'qualification', value: 'silver' },
      ],
    },
    'withdrawal_daily_gold': {
      id: 'withdrawal_daily_gold',
      name: 'Limite Diário de Saque Ouro',
      type: 'withdrawal',
      scope: 'daily',
      value: 10000,
      conditions: [
        { type: 'qualification', value: 'gold' },
      ],
    },
    'withdrawal_daily_platinum': {
      id: 'withdrawal_daily_platinum',
      name: 'Limite Diário de Saque Platina',
      type: 'withdrawal',
      scope: 'daily',
      value: 20000,
      conditions: [
        { type: 'qualification', value: 'platinum' },
      ],
    },
    'withdrawal_daily_diamond': {
      id: 'withdrawal_daily_diamond',
      name: 'Limite Diário de Saque Diamante',
      type: 'withdrawal',
      scope: 'daily',
      value: 50000,
      conditions: [
        { type: 'qualification', value: 'diamond' },
      ],
    },
    'withdrawal_monthly_default': {
      id: 'withdrawal_monthly_default',
      name: 'Limite Mensal de Saque Padrão',
      type: 'withdrawal',
      scope: 'monthly',
      value: 20000,
    },
    'withdrawal_monthly_silver': {
      id: 'withdrawal_monthly_silver',
      name: 'Limite Mensal de Saque Prata',
      type: 'withdrawal',
      scope: 'monthly',
      value: 30000,
      conditions: [
        { type: 'qualification', value: 'silver' },
      ],
    },
    'withdrawal_monthly_gold': {
      id: 'withdrawal_monthly_gold',
      name: 'Limite Mensal de Saque Ouro',
      type: 'withdrawal',
      scope: 'monthly',
      value: 50000,
      conditions: [
        { type: 'qualification', value: 'gold' },
      ],
    },
    'withdrawal_monthly_platinum': {
      id: 'withdrawal_monthly_platinum',
      name: 'Limite Mensal de Saque Platina',
      type: 'withdrawal',
      scope: 'monthly',
      value: 100000,
      conditions: [
        { type: 'qualification', value: 'platinum' },
      ],
    },
    'withdrawal_monthly_diamond': {
      id: 'withdrawal_monthly_diamond',
      name: 'Limite Mensal de Saque Diamante',
      type: 'withdrawal',
      scope: 'monthly',
      value: 200000,
      conditions: [
        { type: 'qualification', value: 'diamond' },
      ],
    },
    'transfer_daily_default': {
      id: 'transfer_daily_default',
      name: 'Limite Diário de Transferência Padrão',
      type: 'transfer',
      scope: 'daily',
      value: 10000,
    },
    'transfer_daily_platinum': {
      id: 'transfer_daily_platinum',
      name: 'Limite Diário de Transferência Platina',
      type: 'transfer',
      scope: 'daily',
      value: 50000,
      conditions: [
        { type: 'qualification', value: 'platinum' },
      ],
    },
    'transfer_daily_diamond': {
      id: 'transfer_daily_diamond',
      name: 'Limite Diário de Transferência Diamante',
      type: 'transfer',
      scope: 'daily',
      value: 100000,
      conditions: [
        { type: 'qualification', value: 'diamond' },
      ],
    },
    'payment_daily_new_account': {
      id: 'payment_daily_new_account',
      name: 'Limite Diário de Pagamento Conta Nova',
      type: 'payment',
      scope: 'daily',
      value: 1000,
      conditions: [
        { type: 'account_age', value: 30 }, // 30 dias
      ],
    },
    'payment_daily_default': {
      id: 'payment_daily_default',
      name: 'Limite Diário de Pagamento Padrão',
      type: 'payment',
      scope: 'daily',
      value: 5000,
    },
    'payment_daily_platinum': {
      id: 'payment_daily_platinum',
      name: 'Limite Diário de Pagamento Platina',
      type: 'payment',
      scope: 'daily',
      value: 20000,
      conditions: [
        { type: 'qualification', value: 'platinum' },
      ],
    },
    'payment_daily_diamond': {
      id: 'payment_daily_diamond',
      name: 'Limite Diário de Pagamento Diamante',
      type: 'payment',
      scope: 'daily',
      value: 50000,
      conditions: [
        { type: 'qualification', value: 'diamond' },
      ],
    },
  };

  /**
   * Calcula limite para um distribuidor
   * 
   * @param distributorId ID do distribuidor
   * @param limitType Tipo de limite
   * @param scope Escopo do limite
   * @param limits Informações do distribuidor
   * @param currentUsage Uso atual
   * @returns Resultado do cálculo de limite
   */
  calculateLimit(
    distributorId: string,
    limitType: LimitRule['type'],
    scope: LimitRule['scope'],
    limits: DistributorLimits,
    currentUsage: number
  ): LimitCalculationResult {
    const rule = this.getLimitRule(limitType, scope, limits);
    
    if (!rule) {
      return {
        distributorId,
        limitType,
        scope,
        limit: 0,
        currentUsage,
        remaining: 0,
        exceeded: true,
      };
    }

    const remaining = rule.value - currentUsage;
    const exceeded = currentUsage > rule.value;

    return {
      distributorId,
      limitType,
      scope,
      limit: rule.value,
      currentUsage,
      remaining,
      exceeded,
      conditions: rule.conditions,
    };
  }

  /**
   * Obtém regra de limite baseada no tipo, escopo e qualificação
   * 
   * @param limitType Tipo de limite
   * @param scope Escopo do limite
   * @param limits Informações do distribuidor
   * @returns Regra de limite
   */
  private getLimitRule(
    limitType: LimitRule['type'],
    scope: LimitRule['scope'],
    limits: DistributorLimits
  ): LimitRule | undefined {
    // Tentar encontrar regra específica para qualificação
    const specificRuleKey = `${limitType}_${scope}_${limits.qualification.toLowerCase()}`;
    const specificRule = this.limitRules[specificRuleKey];
    
    if (specificRule && this.validateConditions(specificRule.conditions || [], limits)) {
      return specificRule;
    }

    // Tentar encontrar regra específica para plano
    const planRuleKey = `${limitType}_${scope}_${limits.plan.toLowerCase()}`;
    const planRule = this.limitRules[planRuleKey];
    
    if (planRule && this.validateConditions(planRule.conditions || [], limits)) {
      return planRule;
    }

    // Retornar regra padrão
    const defaultRuleKey = `${limitType}_${scope}_default`;
    return this.limitRules[defaultRuleKey];
  }

  /**
   * Valida condições de uma regra de limite
   * 
   * @param conditions Condições a validar
   * @param limits Informações do distribuidor
   * @returns true se condições são atendidas
   */
  private validateConditions(
    conditions: LimitCondition[],
    limits: DistributorLimits
  ): boolean {
    for (const condition of conditions) {
      switch (condition.type) {
        case 'qualification':
          if (limits.qualification !== condition.value) {
            return false;
          }
          break;
        case 'plan':
          if (limits.plan !== condition.value) {
            return false;
          }
          break;
        case 'account_age':
          if (limits.accountAge > (condition.value as number)) {
            return false;
          }
          break;
      }
    }
    return true;
  }

  /**
   * Valida se uma operação excede o limite
   * 
   * @param distributorId ID do distribuidor
   * @param limitType Tipo de limite
   * @param scope Escopo do limite
   * @param amount Valor da operação
   * @param limits Informações do distribuidor
   * @param currentUsage Uso atual
   * @returns true se excede o limite
   */
  exceedsLimit(
    distributorId: string,
    limitType: LimitRule['type'],
    scope: LimitRule['scope'],
    amount: number,
    limits: DistributorLimits,
    currentUsage: number
  ): boolean {
    const result = this.calculateLimit(distributorId, limitType, scope, limits, currentUsage);
    const newUsage = currentUsage + amount;
    
    return newUsage > result.limit;
  }

  /**
   * Calcula todos os limites para um distribuidor
   * 
   * @param distributorId ID do distribuidor
   * @param limits Informações do distribuidor
   * @param currentUsage Uso atual por tipo e escopo
   * @returns Todos os limites calculados
   */
  calculateAllLimits(
    distributorId: string,
    limits: DistributorLimits,
    currentUsage: Record<string, Record<string, number>>
  ): LimitCalculationResult[] {
    const results: LimitCalculationResult[] = [];

    const types: LimitRule['type'][] = ['withdrawal', 'transfer', 'payment'];
    const scopes: LimitRule['scope'][] = ['daily', 'weekly', 'monthly'];

    for (const type of types) {
      for (const scope of scopes) {
        const usage = currentUsage[type]?.[scope] || 0;
        const result = this.calculateLimit(distributorId, type, scope, limits, usage);
        results.push(result);
      }
    }

    return results;
  }

  /**
   * Obtém regra de limite por ID
   * 
   * @param ruleId ID da regra
   * @returns Regra de limite
   */
  getLimitRuleById(ruleId: string): LimitRule | undefined {
    return this.limitRules[ruleId];
  }

  /**
   * Obtém todas as regras de limite
   * 
   * @returns Todas as regras de limite
   */
  getAllLimitRules(): LimitRule[] {
    return Object.values(this.limitRules);
  }

  /**
   * Obtém regras de limite por tipo
   * 
   * @param type Tipo de limite
   * @returns Regras de limite do tipo especificado
   */
  getLimitRulesByType(type: LimitRule['type']): LimitRule[] {
    return Object.values(this.limitRules).filter(rule => rule.type === type);
  }

  /**
   * Obtém regras de limite por escopo
   * 
   * @param scope Escopo do limite
   * @returns Regras de limite do escopo especificado
   */
  getLimitRulesByScope(scope: LimitRule['scope']): LimitRule[] {
    return Object.values(this.limitRules).filter(rule => rule.scope === scope);
  }

  /**
   * Atualiza regra de limite
   * 
   * @param ruleId ID da regra
   * @param rule Nova regra
   */
  updateLimitRule(ruleId: string, rule: Partial<LimitRule>): void {
    const existingRule = this.limitRules[ruleId];
    if (existingRule) {
      this.limitRules[ruleId] = { ...existingRule, ...rule };
    }
  }

  /**
   * Calcula percentual de uso do limite
   * 
   * @param currentUsage Uso atual
   * @param limit Limite
   * @returns Percentual de uso (0-100)
   */
  calculateUsagePercentage(currentUsage: number, limit: number): number {
    if (limit === 0) return 100;
    const percentage = (currentUsage / limit) * 100;
    return Math.min(100, Math.max(0, percentage));
  }

  /**
   * Verifica se o uso está próximo do limite (acima de 80%)
   * 
   * @param currentUsage Uso atual
   * @param limit Limite
   * @returns true se está próximo do limite
   */
  isNearLimit(currentUsage: number, limit: number): boolean {
    const percentage = this.calculateUsagePercentage(currentUsage, limit);
    return percentage >= 80;
  }

  /**
   * Calcula tempo até reset do limite
   * 
   * @param scope Escopo do limite
   * @param lastResetData Data do último reset
   * @returns Horas até o reset
   */
  calculateTimeUntilReset(scope: LimitRule['scope'], lastResetDate: Date): number {
    const now = new Date();
    const diff = now.getTime() - lastResetDate.getTime();
    const hours = diff / (1000 * 60 * 60);

    switch (scope) {
      case 'daily':
        return Math.max(0, 24 - hours);
      case 'weekly':
        return Math.max(0, 168 - hours); // 7 dias = 168 horas
      case 'monthly':
        return Math.max(0, 720 - hours); // 30 dias = 720 horas
      default:
        return 0;
    }
  }

  /**
   * Calcula data do próximo reset
   * 
   * @param scope Escopo do limite
   * @returns Data do próximo reset
   */
  calculateNextResetDate(scope: LimitRule['scope']): Date {
    const now = new Date();

    switch (scope) {
      case 'daily':
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return tomorrow;
      case 'weekly':
        const nextWeek = new Date(now);
        nextWeek.setDate(nextWeek.getDate() + 7);
        nextWeek.setHours(0, 0, 0, 0);
        return nextWeek;
      case 'monthly':
        const nextMonth = new Date(now);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        nextMonth.setDate(1);
        nextMonth.setHours(0, 0, 0, 0);
        return nextMonth;
      default:
        return now;
    }
  }

  /**
   * Valida se uma conta é considerada nova (para limites mais restritivos)
   * 
   * @param accountAge Idade da conta em dias
   * @param threshold Limiar em dias (padrão: 30)
   * @returns true se a conta é nova
   */
  isNewAccount(accountAge: number, threshold: number = 30): boolean {
    return accountAge < threshold;
  }

  /**
   * Calcula limite progressivo baseado na idade da conta
   * 
   * @param baseLimit Limite base
   * @param accountAge Idade da conta em dias
   * @param maxAge Idade máxima para atingir limite completo (padrão: 90 dias)
   * @returns Limite calculado
   */
  calculateProgressiveLimit(baseLimit: number, accountAge: number, maxAge: number = 90): number {
    if (accountAge >= maxAge) {
      return baseLimit;
    }

    const progress = accountAge / maxAge;
    return baseLimit * progress;
  }
}
