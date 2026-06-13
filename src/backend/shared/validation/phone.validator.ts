/**
 * Phone Validator
 * 
 * Validador de telefone brasileiro com validação de formato e DDD.
 */

export interface PhoneValidationResult {
  isValid: boolean;
  phone: string;
  formattedPhone?: string;
  ddd?: string;
  errors: string[];
}

export class PhoneValidator {
  /**
   * Lista de DDDs válidos no Brasil
   */
  private static readonly VALID_DDDS = [
    '11', '12', '13', '14', '15', '16', '17', '18', '19', // São Paulo
    '21', '22', '24', // Rio de Janeiro
    '27', '28', // Espírito Santo
    '31', '32', '33', '34', '35', '37', '38', // Minas Gerais
    '41', '42', '43', '44', '45', '46', // Paraná
    '47', '48', '49', // Santa Catarina
    '51', '53', '54', '55', // Rio Grande do Sul
    '61', '62', '63', '64', '65', '66', '67', '68', '69', // Centro-Oeste
    '71', '73', '74', '75', '77', '79', // Bahia
    '81', '82', '83', '84', '85', '86', '87', '88', '89', // Nordeste
    '91', '92', '93', '94', '95', '96', '97', '98', '99', // Norte
  ];
  
  /**
   * Valida telefone brasileiro
   * 
   * @param phone Telefone a validar (com ou sem formatação)
   * @returns Resultado da validação
   */
  static validate(phone: string): PhoneValidationResult {
    const errors: string[] = [];
    
    // Remover caracteres não numéricos
    const cleanPhone = this.cleanPhone(phone);
    
    // Verificar comprimento (10 ou 11 dígitos)
    if (cleanPhone.length !== 10 && cleanPhone.length !== 11) {
      errors.push('Telefone deve ter 10 ou 11 dígitos');
      return {
        isValid: false,
        phone: cleanPhone,
        errors,
      };
    }
    
    // Extrair DDD
    const ddd = cleanPhone.substring(0, 2);
    
    // Validar DDD
    if (!this.isValidDDD(ddd)) {
      errors.push(`DDD inválido: ${ddd}`);
    }
    
    // Validar número (não pode começar com 0 ou 1)
    const number = cleanPhone.substring(2);
    if (number[0] === '0' || number[0] === '1') {
      errors.push('Número de telefone inválido: não pode começar com 0 ou 1');
    }
    
    // Verificar se todos os dígitos são iguais
    if (this.allDigitsSame(cleanPhone)) {
      errors.push('Telefone inválido: todos os dígitos são iguais');
    }
    
    const isValid = errors.length === 0;
    
    return {
      isValid,
      phone: cleanPhone,
      formattedPhone: isValid ? this.formatPhone(cleanPhone) : undefined,
      ddd: isValid ? ddd : undefined,
      errors,
    };
  }
  
  /**
   * Remove caracteres não numéricos do telefone
   * 
   * @param phone Telefone a limpar
   * @returns Telefone limpo
   */
  static cleanPhone(phone: string): string {
    return phone.replace(/\D/g, '');
  }
  
  /**
   * Formata telefone no padrão brasileiro (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
   * 
   * @param phone Telefone a formatar
   * @returns Telefone formatado
   */
  static formatPhone(phone: string): string {
    const cleanPhone = this.cleanPhone(phone);
    
    if (cleanPhone.length === 10) {
      // Formato fixo: (XX) XXXX-XXXX
      return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (cleanPhone.length === 11) {
      // Formato móvel: (XX) XXXXX-XXXX
      return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    
    return phone;
  }
  
  /**
   * Valida DDD brasileiro
   * 
   * @param ddd DDD a validar
   * @returns true se DDD é válido
   */
  static isValidDDD(ddd: string): boolean {
    return this.VALID_DDDS.includes(ddd);
  }
  
  /**
   * Verifica se todos os dígitos são iguais
   * 
   * @param phone Telefone a verificar
   * @returns true se todos os dígitos são iguais
   */
  private static allDigitsSame(phone: string): boolean {
    return /^(\d)\1+$/.test(phone);
  }
  
  /**
   * Extrai DDD do telefone
   * 
   * @param phone Telefone
   * @returns DDD do telefone
   */
  static extractDDD(phone: string): string {
    const cleanPhone = this.cleanPhone(phone);
    return cleanPhone.substring(0, 2);
  }
  
  /**
   * Extrai número do telefone (sem DDD)
   * 
   * @param phone Telefone
   * @returns Número do telefone
   */
  static extractNumber(phone: string): string {
    const cleanPhone = this.cleanPhone(phone);
    return cleanPhone.substring(2);
  }
  
  /**
   * Verifica se telefone é móvel (11 dígitos)
   * 
   * @param phone Telefone
   * @returns true se é móvel
   */
  static isMobile(phone: string): boolean {
    const cleanPhone = this.cleanPhone(phone);
    return cleanPhone.length === 11;
  }
  
  /**
   * Verifica se telefone é fixo (10 dígitos)
   * 
   * @param phone Telefone
   * @returns true se é fixo
   */
  static isLandline(phone: string): boolean {
    const cleanPhone = this.cleanPhone(phone);
    return cleanPhone.length === 10;
  }
  
  /**
   * Obtém nome do estado pelo DDD
   * 
   * @param ddd DDD
   * @returns Nome do estado
   */
  static getStateByDDD(ddd: string): string | null {
    const stateMap: Record<string, string> = {
      '11': 'São Paulo',
      '12': 'São Paulo',
      '13': 'São Paulo',
      '14': 'São Paulo',
      '15': 'São Paulo',
      '16': 'São Paulo',
      '17': 'São Paulo',
      '18': 'São Paulo',
      '19': 'São Paulo',
      '21': 'Rio de Janeiro',
      '22': 'Rio de Janeiro',
      '24': 'Rio de Janeiro',
      '27': 'Espírito Santo',
      '28': 'Espírito Santo',
      '31': 'Minas Gerais',
      '32': 'Minas Gerais',
      '33': 'Minas Gerais',
      '34': 'Minas Gerais',
      '35': 'Minas Gerais',
      '37': 'Minas Gerais',
      '38': 'Minas Gerais',
      '41': 'Paraná',
      '42': 'Paraná',
      '43': 'Paraná',
      '44': 'Paraná',
      '45': 'Paraná',
      '46': 'Paraná',
      '47': 'Santa Catarina',
      '48': 'Santa Catarina',
      '49': 'Santa Catarina',
      '51': 'Rio Grande do Sul',
      '53': 'Rio Grande do Sul',
      '54': 'Rio Grande do Sul',
      '55': 'Rio Grande do Sul',
      '61': 'Distrito Federal',
      '62': 'Goiás',
      '63': 'Tocantins',
      '64': 'Goiás',
      '65': 'Mato Grosso',
      '66': 'Mato Grosso',
      '67': 'Mato Grosso do Sul',
      '68': 'Acre',
      '69': 'Rondônia',
      '71': 'Bahia',
      '73': 'Bahia',
      '74': 'Bahia',
      '75': 'Bahia',
      '77': 'Bahia',
      '79': 'Bahia',
      '81': 'Pernambuco',
      '82': 'Alagoas',
      '83': 'Paraíba',
      '84': 'Rio Grande do Norte',
      '85': 'Ceará',
      '86': 'Piauí',
      '87': 'Pernambuco',
      '88': 'Ceará',
      '89': 'Piauí',
      '91': 'Pará',
      '92': 'Amazonas',
      '93': 'Pará',
      '94': 'Pará',
      '95': 'Amazonas',
      '96': 'Amapá',
      '97': 'Amazonas',
      '98': 'Pará',
      '99': 'Roraima',
    };
    
    return stateMap[ddd] || null;
  }
  
  /**
   * Gera telefone válido para testes
   * 
   * @param ddd DDD (opcional, padrão: 11)
   * @param isMobile Se é móvel (opcional, padrão: true)
   * @returns Telefone válido gerado
   */
  static generateValidPhone(ddd: string = '11', isMobile: boolean = true): string {
    const length = isMobile ? 11 : 10;
    const digits = [ddd];
    
    // Primeiro dígito do número (não pode ser 0 ou 1)
    digits.push(Math.floor(Math.random() * 8) + 2);
    
    // Restante dos dígitos
    for (let i = 2; i < length; i++) {
      digits.push(Math.floor(Math.random() * 10));
    }
    
    return this.formatPhone(digits.join(''));
  }
}
