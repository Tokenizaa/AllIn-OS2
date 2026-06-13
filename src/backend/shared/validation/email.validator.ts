/**
 * Email Validator
 * 
 * Validador de email com validação de formato.
 */

export interface EmailValidationResult {
  isValid: boolean;
  email: string;
  normalizedEmail?: string;
  errors: string[];
}

export class EmailValidator {
  /**
   * Valida email
   * 
   * @param email Email a validar
   * @returns Resultado da validação
   */
  static validate(email: string): EmailValidationResult {
    const errors: string[] = [];
    
    // Verificar se email está vazio
    if (!email || email.trim() === '') {
      errors.push('Email não pode estar vazio');
      return {
        isValid: false,
        email,
        errors,
      };
    }
    
    const normalizedEmail = this.normalizeEmail(email);
    
    // Validar formato usando regex
    if (!this.isValidFormat(normalizedEmail)) {
      errors.push('Email inválido: formato incorreto');
    }
    
    // Validar comprimento máximo
    if (normalizedEmail.length > 254) {
      errors.push('Email inválido: comprimento máximo excedido (254 caracteres)');
    }
    
    // Validar comprimento mínimo
    if (normalizedEmail.length < 5) {
      errors.push('Email inválido: comprimento mínimo não atingido (5 caracteres)');
    }
    
    const isValid = errors.length === 0;
    
    return {
      isValid,
      email: normalizedEmail,
      normalizedEmail: isValid ? normalizedEmail : undefined,
      errors,
    };
  }
  
  /**
   * Normaliza email (remove espaços e converte para minúsculas)
   * 
   * @param email Email a normalizar
   * @returns Email normalizado
   */
  static normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }
  
  /**
   * Valida formato de email usando regex
   * 
   * @param email Email a validar
   * @returns true se formato é válido
   */
  private static isValidFormat(email: string): boolean {
    // Regex para validação de email (RFC 5322 simplificado)
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    return emailRegex.test(email);
  }
  
  /**
   * Extrai domínio do email
   * 
   * @param email Email
   * @returns Domínio do email
   */
  static extractDomain(email: string): string {
    const normalizedEmail = this.normalizeEmail(email);
    const atIndex = normalizedEmail.indexOf('@');
    
    if (atIndex === -1) {
      return '';
    }
    
    return normalizedEmail.substring(atIndex + 1);
  }
  
  /**
   * Extrai usuário do email
   * 
   * @param email Email
   * @returns Usuário do email
   */
  static extractUsername(email: string): string {
    const normalizedEmail = this.normalizeEmail(email);
    const atIndex = normalizedEmail.indexOf('@');
    
    if (atIndex === -1) {
      return normalizedEmail;
    }
    
    return normalizedEmail.substring(0, atIndex);
  }
  
  /**
   * Verifica se email é de um domínio específico
   * 
   * @param email Email
   * @param domain Domínio a verificar
   * @returns true se email é do domínio
   */
  static isFromDomain(email: string, domain: string): boolean {
    const emailDomain = this.extractDomain(email);
    return emailDomain.toLowerCase() === domain.toLowerCase();
  }
  
  /**
   * Verifica se email é corporativo (não de provedores gratuitos)
   * 
   * @param email Email
   * @returns true se email é corporativo
   */
  static isCorporateEmail(email: string): boolean {
    const freeDomains = [
      'gmail.com',
      'yahoo.com',
      'hotmail.com',
      'outlook.com',
      'live.com',
      'icloud.com',
      'aol.com',
      'mail.com',
      'protonmail.com',
      'tutanota.com',
    ];
    
    const emailDomain = this.extractDomain(email);
    return !freeDomains.includes(emailDomain);
  }
  
  /**
   * Gera email válido para testes
   * 
   * @param domain Domínio do email (opcional)
   * @returns Email válido gerado
   */
  static generateValidEmail(domain: string = 'example.com'): string {
    const username = `user${Date.now()}${Math.floor(Math.random() * 1000)}`;
    return `${username}@${domain}`;
  }
}
