/**
 * CPF Validator
 * 
 * Validador de CPF brasileiro com validação algorítmica.
 */

export interface CPFValidationResult {
  isValid: boolean;
  cpf: string;
  formattedCPF?: string;
  errors: string[];
}

export class CPFValidator {
  /**
   * Valida CPF brasileiro
   * 
   * @param cpf CPF a validar (com ou sem formatação)
   * @returns Resultado da validação
   */
  static validate(cpf: string): CPFValidationResult {
    const errors: string[] = [];
    
    // Remover caracteres não numéricos
    const cleanCPF = this.cleanCPF(cpf);
    
    // Verificar se tem 11 dígitos
    if (cleanCPF.length !== 11) {
      errors.push('CPF deve ter 11 dígitos');
      return {
        isValid: false,
        cpf: cleanCPF,
        errors,
      };
    }
    
    // Verificar se todos os dígitos são iguais
    if (this.allDigitsSame(cleanCPF)) {
      errors.push('CPF inválido: todos os dígitos são iguais');
      return {
        isValid: false,
        cpf: cleanCPF,
        errors,
      };
    }
    
    // Calcular dígitos verificadores
    const calculatedFirstDigit = this.calculateFirstDigit(cleanCPF);
    const calculatedSecondDigit = this.calculateSecondDigit(cleanCPF);
    
    // Verificar dígitos verificadores
    if (parseInt(cleanCPF[9]) !== calculatedFirstDigit) {
      errors.push('CPF inválido: primeiro dígito verificador incorreto');
    }
    
    if (parseInt(cleanCPF[10]) !== calculatedSecondDigit) {
      errors.push('CPF inválido: segundo dígito verificador incorreto');
    }
    
    const isValid = errors.length === 0;
    
    return {
      isValid,
      cpf: cleanCPF,
      formattedCPF: isValid ? this.formatCPF(cleanCPF) : undefined,
      errors,
    };
  }
  
  /**
   * Remove caracteres não numéricos do CPF
   * 
   * @param cpf CPF a limpar
   * @returns CPF limpo
   */
  static cleanCPF(cpf: string): string {
    return cpf.replace(/\D/g, '');
  }
  
  /**
   * Formata CPF no padrão brasileiro (XXX.XXX.XXX-XX)
   * 
   * @param cpf CPF a formatar
   * @returns CPF formatado
   */
  static formatCPF(cpf: string): string {
    const cleanCPF = this.cleanCPF(cpf);
    
    if (cleanCPF.length !== 11) {
      return cpf;
    }
    
    return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  
  /**
   * Verifica se todos os dígitos são iguais
   * 
   * @param cpf CPF a verificar
   * @returns true se todos os dígitos são iguais
   */
  private static allDigitsSame(cpf: string): boolean {
    return /^(\d)\1+$/.test(cpf);
  }
  
  /**
   * Calcula o primeiro dígito verificador do CPF
   * 
   * @param cpf CPF
   * @returns Primeiro dígito verificador
   */
  private static calculateFirstDigit(cpf: string): number {
    let sum = 0;
    
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf[i]) * (10 - i);
    }
    
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  }
  
  /**
   * Calcula o segundo dígito verificador do CPF
   * 
   * @param cpf CPF
   * @returns Segundo dígito verificador
   */
  private static calculateSecondDigit(cpf: string): number {
    let sum = 0;
    
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf[i]) * (11 - i);
    }
    
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  }
  
  /**
   * Gera CPF válido para testes
   * 
   * @returns CPF válido gerado
   */
  static generateValidCPF(): string {
    const digits = [];
    
    // Gerar 9 dígitos aleatórios
    for (let i = 0; i < 9; i++) {
      digits.push(Math.floor(Math.random() * 10));
    }
    
    // Calcular primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += digits[i] * (10 - i);
    }
    const remainder = sum % 11;
    const firstDigit = remainder < 2 ? 0 : 11 - remainder;
    digits.push(firstDigit);
    
    // Calcular segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += digits[i] * (11 - i);
    }
    const remainder2 = sum % 11;
    const secondDigit = remainder2 < 2 ? 0 : 11 - remainder2;
    digits.push(secondDigit);
    
    return this.formatCPF(digits.join(''));
  }
}
