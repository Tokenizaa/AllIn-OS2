/**
 * Email Validator Tests
 * 
 * Testes unitários para o EmailValidator.
 */

import { EmailValidator } from './email.validator';

describe('EmailValidator', () => {
  describe('validate', () => {
    it('deve validar email válido', () => {
      const result = EmailValidator.validate('user@example.com');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.normalizedEmail).toBe('user@example.com');
    });

    it('deve validar email com letras maiúsculas', () => {
      const result = EmailValidator.validate('User@Example.COM');
      expect(result.isValid).toBe(true);
      expect(result.normalizedEmail).toBe('user@example.com');
    });

    it('deve rejeitar email inválido', () => {
      const result = EmailValidator.validate('invalid-email');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Email inválido: formato incorreto');
    });

    it('deve rejeitar email vazio', () => {
      const result = EmailValidator.validate('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Email não pode estar vazio');
    });

    it('deve rejeitar email muito longo', () => {
      const longEmail = 'a'.repeat(255) + '@example.com';
      const result = EmailValidator.validate(longEmail);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Email inválido: comprimento máximo excedido (254 caracteres)');
    });
  });

  describe('normalizeEmail', () => {
    it('deve normalizar email para minúsculas', () => {
      expect(EmailValidator.normalizeEmail('User@Example.COM')).toBe('user@example.com');
    });

    it('deve remover espaços', () => {
      expect(EmailValidator.normalizeEmail(' user@example.com ')).toBe('user@example.com');
    });
  });

  describe('extractDomain', () => {
    it('deve extrair domínio corretamente', () => {
      expect(EmailValidator.extractDomain('user@example.com')).toBe('example.com');
    });

    it('deve retornar vazio para email inválido', () => {
      expect(EmailValidator.extractDomain('invalid')).toBe('');
    });
  });

  describe('extractUsername', () => {
    it('deve extrair usuário corretamente', () => {
      expect(EmailValidator.extractUsername('user@example.com')).toBe('user');
    });

    it('deve retornar email completo para email inválido', () => {
      expect(EmailValidator.extractUsername('invalid')).toBe('invalid');
    });
  });

  describe('isFromDomain', () => {
    it('deve verificar se email é do domínio', () => {
      expect(EmailValidator.isFromDomain('user@example.com', 'example.com')).toBe(true);
      expect(EmailValidator.isFromDomain('user@example.com', 'other.com')).toBe(false);
    });

    it('deve ser case insensitive', () => {
      expect(EmailValidator.isFromDomain('user@Example.COM', 'example.com')).toBe(true);
    });
  });

  describe('isCorporateEmail', () => {
    it('deve identificar email corporativo', () => {
      expect(EmailValidator.isCorporateEmail('user@company.com')).toBe(true);
    });

    it('deve identificar email pessoal', () => {
      expect(EmailValidator.isCorporateEmail('user@gmail.com')).toBe(false);
      expect(EmailValidator.isCorporateEmail('user@yahoo.com')).toBe(false);
    });
  });

  describe('generateValidEmail', () => {
    it('deve gerar email válido', () => {
      const email = EmailValidator.generateValidEmail();
      const result = EmailValidator.validate(email);
      expect(result.isValid).toBe(true);
    });

    it('deve gerar email com domínio específico', () => {
      const email = EmailValidator.generateValidEmail('custom.com');
      expect(email).toContain('@custom.com');
    });
  });
});
