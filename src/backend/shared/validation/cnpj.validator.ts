/**
 * CNPJ Validator
 * 
 * Validador de CNPJ brasileiro com validação algorítmica.
 */

export interface CNPJValidationResult {
  isValid: boolean;
  cnpj: string;
  formattedCNPJ?: string;
  errors: string[];
}

export class CNPJValidator {
  /**
   * Valida CNPJ brasileiro
   * 
   * @param cnpj CNPJ a validar (com ou sem formatação)
   * @returns Resultado da validação
   */
  static validate(cnpj: string): CNPJValidationResult {
    const errors: string[] = [];
    
    // Remover caracteres não numéricos
    const cleanCNPJ = this.cleanCNPJ(cnpj);
    
    // Verificar se tem 14 dígitos
    if (cleanCNPJ.length !== 14) {
      errors.push('CNPJ deve ter 14 dígitos');
      return {
        isValid: false,
        cnpj: cleanCNPJ,
        errors,
      };
    }
    
    // Verificar se todos os dígitos são iguais
    if (this.allDigitsSame(cleanCNPJ)) {
      errors.push('CNPJ inválido: todos os dígitos são iguais');
      return {
        isValid: false,
        cnpj: cleanCNPJ,
        errors,
      };
    }
    
    // Calcular dígitos verificadores
    const calculatedFirstDigit = this.calculateFirstDigit(cleanCNPJ);
    const calculatedSecondDigit = this.calculateSecondDigit(cleanCNPJ);
    
    // Verificar dígitos verificadores
    if (parseInt(cleanCNPJ[12]) !== calculatedFirstDigit) {
      errors.push('CNPJ inválido: primeiro dígito verificador incorreto');
    }
    
    if (parseInt(cleanCNPJ[13]) !== calculatedSecondDigit) {
      errors.push('CNPJ inválido: segundo dígito verificador incorreto');
    }
    
    const isValid = errors.length === 0;
    
    return {
      isValid,
      cnpj: cleanCNPJ,
      formattedCNPJ: isValid ? this.formatCNPJ(cleanCNPJ) : undefined,
      errors,
    };
  }
  
  /**
   * Remove caracteres não numéricos do CNPJ
   * 
   * @param cnpj CNPJ a limpar
   * @returns CNPJ limpo
   */
  static cleanCNPJ(cnpj: string): string {
    return cnpj.replace(/\D/g, '');
  }
  
  /**
   * Formata CNPJ no padrão brasileiro (XX.XXX.XXX/XXXX-XX)
   * 
   * @param cnpj CNPJ a formatar
   * @returns CNPJ formatado
   */
  static formatCNPJ(cnpj: string): string {
    const cleanCNPJ = this.cleanCNPJ(cnpj);
    
    if (cleanCNPJ.length !== 14) {
      return cnpj;
    }
    
    return cleanCNPJ.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  
  /**
   * Verifica se todos os dígitos são iguais
   * 
   * @param cnpj CNPJ a verificar
   * @returns true se todos os dígitos são iguais
   */
  private static allDigitsSame(cnpj: string): boolean {
    return /^(\d)\1+$/.test(cnpj);
  }
  
  /**
   * Calcula o primeiro dígito verificador do CNPJ
   * 
   * @param cnpj CNPJ
   * @returns Primeiro dígito verificador
   */
  private static calculateFirstDigit(cnpj: string): number {
    const weights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cnpj[i]) * weights[i];
    }
    
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  }
  
  /**
   * Calcula o segundo dígito verificador do CNPJ
   * 
   * @param cnpj CNPJ
   * @returns Segundo dígito verificador
   */
  private static calculateSecondDigit(cnpj: string): number {
    const weights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    
    for (let i = 0; i < 13; i++) {
      sum += parseInt(cnpj[i]) * weights[i];
    }
    
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  }
  
  /**
   * Gera CNPJ válido para testes
   * 
   * @returns CNPJ válido gerado
   */
  static generateValidCNPJ(): string {
    const digits = [];
    
    // Gerar 12 dígitos aleatórios
    for (let i = 0; i < 12; i++) {
      digits.push(Math.floor(Math.random() * 10));
    }
    
    // Calcular primeiro dígito verificador
    const weights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += digits[i] * weights[i];
    }
    const remainder = sum % 11;
    const firstDigit = remainder < 2 ? 0 : 11 - remainder;
    digits.push(firstDigit);
    
    // Calcular segundo dígito verificador
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    sum = 0;
    for (let i = 0; i < 13; i++) {
      sum += digits[i] * weights2[i];
    }
    const remainder2 = sum % 11;
    const secondDigit = remainder2 < 2 ? 0 : 11 - remainder2;
    digits.push(secondDigit);
    
    return this.formatCNPJ(digits.join(''));
  }
}
