/**
 * Withdrawal Validation Domain Service
 * 
 * Domain service contendo lógica pura de validação de saques financeiros.
 * Separado de infraestrutura (database, APIs) para facilitar testes e reuso.
 * 
 * Responsabilidades:
 * - Validação de saldo disponível
 * - Validação de limites de saque (mínimo, máximo, diário, mensal)
 * - Validação de conta bancária
 * - Validação de frequência de saques
 */

export interface WithdrawalValidationRule {
  id: string;
  name: string;
  type: 'min_amount' | 'max_amount' | 'daily_limit' | 'monthly_limit' | 'frequency_limit';
  value: number;
  conditions?: WithdrawalCondition[];
}

export interface WithdrawalCondition {
  type: 'qualification' | 'plan' | 'account_type';
  value: string;
}

export interface WithdrawalValidationResult {
  distributorId: string;
  amount: number;
  isValid: boolean;
  errors: string[];
  warnings: string[];
  conditions?: WithdrawalCondition[];
}

export interface WithdrawalLimits {
  minAmount: number;
  maxAmount: number;
  dailyLimit: number;
  monthlyLimit: number;
  dailyWithdrawals: number;
  monthlyWithdrawals: number;
}

export interface DistributorBalance {
  distributorId: string;
  availableBalance: number;
  blockedBalance: number;
  totalBalance: number;
  pendingWithdrawals: number;
}

export class WithdrawalValidationDomainService {
  private static instance: WithdrawalValidationDomainService;

  private constructor() {}

  static getInstance(): WithdrawalValidationDomainService {
    if (!WithdrawalValidationDomainService.instance) {
      WithdrawalValidationDomainService.instance = new WithdrawalValidationDomainService();
    }
    return WithdrawalValidationDomainService.instance;
  }

  /**
   * Regras de validação de saque por tipo
   * Estas regras podem ser configuradas via database no futuro
   */
  private validationRules: Record<string, WithdrawalValidationRule> = {
    'min_amount_default': {
      id: 'min_amount_default',
      name: 'Valor Mínimo de Saque Padrão',
      type: 'min_amount',
      value: 50,
    },
    'min_amount_bronze': {
      id: 'min_amount_bronze',
      name: 'Valor Mínimo de Saque Bronze',
      type: 'min_amount',
      value: 30,
      conditions: [
        { type: 'qualification', value: 'bronze' },
      ],
    },
    'min_amount_silver': {
      id: 'min_amount_silver',
      name: 'Valor Mínimo de Saque Prata',
      type: 'min_amount',
      value: 20,
      conditions: [
        { type: 'qualification', value: 'silver' },
      ],
    },
    'min_amount_gold': {
      id: 'min_amount_gold',
      name: 'Valor Mínimo de Saque Ouro',
      type: 'min_amount',
      value: 10,
      conditions: [
        { type: 'qualification', value: 'gold' },
      ],
    },
    'max_amount_default': {
      id: 'max_amount_default',
      name: 'Valor Máximo de Saque Padrão',
      type: 'max_amount',
      value: 10000,
    },
    'max_amount_platinum': {
      id: 'max_amount_platinum',
      name: 'Valor Máximo de Saque Platina',
      type: 'max_amount',
      value: 50000,
      conditions: [
        { type: 'qualification', value: 'platinum' },
      ],
    },
    'max_amount_diamond': {
      id: 'max_amount_diamond',
      name: 'Valor Máximo de Saque Diamante',
      type: 'max_amount',
      value: 100000,
      conditions: [
        { type: 'qualification', value: 'diamond' },
      ],
    },
    'daily_limit_default': {
      id: 'daily_limit_default',
      name: 'Limite Diário Padrão',
      type: 'daily_limit',
      value: 5000,
    },
    'daily_limit_platinum': {
      id: 'daily_limit_platinum',
      name: 'Limite Diário Platina',
      type: 'daily_limit',
      value: 20000,
      conditions: [
        { type: 'qualification', value: 'platinum' },
      ],
    },
    'daily_limit_diamond': {
      id: 'daily_limit_diamond',
      name: 'Limite Diário Diamante',
      type: 'daily_limit',
      value: 50000,
      conditions: [
        { type: 'qualification', value: 'diamond' },
      ],
    },
    'monthly_limit_default': {
      id: 'monthly_limit_default',
      name: 'Limite Mensal Padrão',
      type: 'monthly_limit',
      value: 20000,
    },
    'monthly_limit_platinum': {
      id: 'monthly_limit_platinum',
      name: 'Limite Mensal Platina',
      type: 'monthly_limit',
      value: 100000,
      conditions: [
        { type: 'qualification', value: 'platinum' },
      ],
    },
    'monthly_limit_diamond': {
      id: 'monthly_limit_diamond',
      name: 'Limite Mensal Diamante',
      type: 'monthly_limit',
      value: 200000,
      conditions: [
        { type: 'qualification', value: 'diamond' },
      ],
    },
    'frequency_limit_default': {
      id: 'frequency_limit_default',
      name: 'Limite de Frequência Padrão',
      type: 'frequency_limit',
      value: 3, // Máximo 3 saques por dia
    },
    'frequency_limit_platinum': {
      id: 'frequency_limit_platinum',
      name: 'Limite de Frequência Platina',
      type: 'frequency_limit',
      value: 5,
      conditions: [
        { type: 'qualification', value: 'platinum' },
      ],
    },
    'frequency_limit_diamond': {
      id: 'frequency_limit_diamond',
      name: 'Limite de Frequência Diamante',
      type: 'frequency_limit',
      value: 10,
      conditions: [
        { type: 'qualification', value: 'diamond' },
      ],
    },
  };

  /**
   * Valida solicitação de saque
   * 
   * @param distributorId ID do distribuidor
   * @param amount Valor do saque
   * @param balance Saldo do distribuidor
   * @param limits Limites do distribuidor
   * @param qualification Qualificação do distribuidor
   * @returns Resultado da validação
   */
  validateWithdrawal(
    distributorId: string,
    amount: number,
    balance: DistributorBalance,
    limits: WithdrawalLimits,
    qualification: string
  ): WithdrawalValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validar saldo disponível
    if (amount > balance.availableBalance) {
      errors.push(`Saldo insuficiente. Disponível: R$ ${balance.availableBalance.toFixed(2)}, Solicitado: R$ ${amount.toFixed(2)}`);
    }

    // Validar valor mínimo
    const minAmountRule = this.getMinAmountRule(qualification);
    if (amount < minAmountRule.value) {
      errors.push(`Valor mínimo de saque é R$ ${minAmountRule.value.toFixed(2)}`);
    }

    // Validar valor máximo
    const maxAmountRule = this.getMaxAmountRule(qualification);
    if (amount > maxAmountRule.value) {
      errors.push(`Valor máximo de saque é R$ ${maxAmountRule.value.toFixed(2)}`);
    }

    // Validar limite diário
    const dailyLimitRule = this.getDailyLimitRule(qualification);
    const dailyTotal = limits.dailyWithdrawals + amount;
    if (dailyTotal > dailyLimitRule.value) {
      errors.push(`Limite diário excedido. Disponível: R$ ${(dailyLimitRule.value - limits.dailyWithdrawals).toFixed(2)}`);
    }

    // Validar limite mensal
    const monthlyLimitRule = this.getMonthlyLimitRule(qualification);
    const monthlyTotal = limits.monthlyWithdrawals + amount;
    if (monthlyTotal > monthlyLimitRule.value) {
      errors.push(`Limite mensal excedido. Disponível: R$ ${(monthlyLimitRule.value - limits.monthlyWithdrawals).toFixed(2)}`);
    }

    // Validar frequência
    const frequencyRule = this.getFrequencyLimitRule(qualification);
    if (limits.dailyWithdrawals >= frequencyRule.value) {
      errors.push(`Limite de saques diários excedido. Máximo: ${frequencyRule.value} saques por dia`);
    }

    // Avisos
    if (amount === balance.availableBalance) {
      warnings.push('Você está sacando todo o saldo disponível.');
    }

    if (amount > balance.availableBalance * 0.9) {
      warnings.push('Você está sacando mais de 90% do saldo disponível.');
    }

    const isValid = errors.length === 0;

    return {
      distributorId,
      amount,
      isValid,
      errors,
      warnings,
      conditions: minAmountRule.conditions,
    };
  }

  /**
   * Obtém regra de valor mínimo baseada na qualificação
   * 
   * @param qualification Qualificação do distribuidor
   * @returns Regra de valor mínimo
   */
  private getMinAmountRule(qualification: string): WithdrawalValidationRule {
    const ruleKey = `min_amount_${qualification.toLowerCase()}`;
    return this.validationRules[ruleKey] || this.validationRules['min_amount_default'];
  }

  /**
   * Obtém regra de valor máximo baseada na qualificação
   * 
   * @param qualification Qualificação do distribuidor
   * @returns Regra de valor máximo
   */
  private getMaxAmountRule(qualification: string): WithdrawalValidationRule {
    const ruleKey = `max_amount_${qualification.toLowerCase()}`;
    return this.validationRules[ruleKey] || this.validationRules['max_amount_default'];
  }

  /**
   * Obtém regra de limite diário baseada na qualificação
   * 
   * @param qualification Qualificação do distribuidor
   * @returns Regra de limite diário
   */
  private getDailyLimitRule(qualification: string): WithdrawalValidationRule {
    const ruleKey = `daily_limit_${qualification.toLowerCase()}`;
    return this.validationRules[ruleKey] || this.validationRules['daily_limit_default'];
  }

  /**
   * Obtém regra de limite mensal baseada na qualificação
   * 
   * @param qualification Qualificação do distribuidor
   * @returns Regra de limite mensal
   */
  private getMonthlyLimitRule(qualification: string): WithdrawalValidationRule {
    const ruleKey = `monthly_limit_${qualification.toLowerCase()}`;
    return this.validationRules[ruleKey] || this.validationRules['monthly_limit_default'];
  }

  /**
   * Obtém regra de limite de frequência baseada na qualificação
   * 
   * @param qualification Qualificação do distribuidor
   * @returns Regra de limite de frequência
   */
  private getFrequencyLimitRule(qualification: string): WithdrawalValidationRule {
    const ruleKey = `frequency_limit_${qualification.toLowerCase()}`;
    return this.validationRules[ruleKey] || this.validationRules['frequency_limit_default'];
  }

  /**
   * Obtém limites de saque para um distribuidor
   * 
   * @param qualification Qualificação do distribuidor
   * @returns Limites de saque
   */
  getWithdrawalLimits(qualification: string): WithdrawalLimits {
    const minAmountRule = this.getMinAmountRule(qualification);
    const maxAmountRule = this.getMaxAmountRule(qualification);
    const dailyLimitRule = this.getDailyLimitRule(qualification);
    const monthlyLimitRule = this.getMonthlyLimitRule(qualification);
    const frequencyRule = this.getFrequencyLimitRule(qualification);

    return {
      minAmount: minAmountRule.value,
      maxAmount: maxAmountRule.value,
      dailyLimit: dailyLimitRule.value,
      monthlyLimit: monthlyLimitRule.value,
      dailyWithdrawals: 0,
      monthlyWithdrawals: 0,
    };
  }

  /**
   * Valida conta bancária
   * 
   * @param bankCode Código do banco
   * @param accountNumber Número da conta
   * @param accountType Tipo de conta
   * @returns true se a conta é válida
   */
  validateBankAccount(
    bankCode: string,
    accountNumber: string,
    accountType: string
  ): boolean {
    // Validação básica de conta bancária
    if (!bankCode || bankCode.length !== 3) {
      return false;
    }

    if (!accountNumber || accountNumber.length < 5) {
      return false;
    }

    const validAccountTypes = ['checking', 'savings'];
    if (!validAccountTypes.includes(accountType.toLowerCase())) {
      return false;
    }

    return true;
  }

  /**
   * Valida se o distribuidor pode fazer saque
   * 
   * @param distributorId ID do distribuidor
   * @param balance Saldo do distribuidor
   * @param qualification Qualificação do distribuidor
   * @returns true se pode fazer saque
   */
  canWithdraw(
    distributorId: string,
    balance: DistributorBalance,
    qualification: string
  ): boolean {
    // Verificar se tem saldo disponível
    if (balance.availableBalance <= 0) {
      return false;
    }

    // Verificar se atingiu valor mínimo
    const minAmountRule = this.getMinAmountRule(qualification);
    if (balance.availableBalance < minAmountRule.value) {
      return false;
    }

    return true;
  }

  /**
   * Obtém regra de validação por ID
   * 
   * @param ruleId ID da regra
   * @returns Regra de validação
   */
  getValidationRule(ruleId: string): WithdrawalValidationRule | undefined {
    return this.validationRules[ruleId];
  }

  /**
   * Obtém todas as regras de validação
   * 
   * @returns Todas as regras de validação
   */
  getAllValidationRules(): WithdrawalValidationRule[] {
    return Object.values(this.validationRules);
  }

  /**
   * Atualiza regra de validação
   * 
   * @param ruleId ID da regra
   * @param rule Nova regra
   */
  updateValidationRule(ruleId: string, rule: Partial<WithdrawalValidationRule>): void {
    const existingRule = this.validationRules[ruleId];
    if (existingRule) {
      this.validationRules[ruleId] = { ...existingRule, ...rule };
    }
  }

  /**
   * Calcula taxa de saque
   * 
   * @param amount Valor do saque
   * @param qualification Qualificação do distribuidor
   * @returns Taxa de saque
   */
  calculateWithdrawalFee(amount: number, qualification: string): number {
    // Taxas podem ser configuradas por qualificação
    const feeRates: Record<string, number> = {
      'none': 0.05, // 5%
      'bronze': 0.04, // 4%
      'silver': 0.03, // 3%
      'gold': 0.02, // 2%
      'platinum': 0.01, // 1%
      'diamond': 0.00, // 0%
    };

    const rate = feeRates[qualification.toLowerCase()] || feeRates['none'];
    const fee = amount * rate;

    return fee;
  }

  /**
   * Calcula valor líquido do saque (após taxas)
   * 
   * @param amount Valor bruto do saque
   * @param qualification Qualificação do distribuidor
   * @returns Valor líquido
   */
  calculateNetWithdrawal(amount: number, qualification: string): number {
    const fee = this.calculateWithdrawalFee(amount, qualification);
    const netAmount = amount - fee;

    return netAmount;
  }
}
