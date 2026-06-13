/**
 * CPF Validator Tests
 * 
 * Testes unitários para o CPFValidator.
 */

import { CPFValidator } from './cpf.validator';

describe('CPFValidator', () => {
  describe('validate', () => {
    it('deve validar CPF válido', () => {
      const result = CPFValidator.validate('529.982.247-25');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.formattedCPF).toBe('529.982.247-25');
    });

    it('deve validar CPF válido sem formatação', () => {
      const result = CPFValidator.validate('52998224725');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('deve rejeitar CPF inválido', () => {
      const result = CPFValidator.validate('111.111.111-11');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('CPF inválido: todos os dígitos são iguais');
    });

    it('deve rejeitar CPF com tamanho incorreto', () => {
      const result = CPFValidator.validate('123.456.789');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('CPF deve ter 11 dígitos');
    });

    it('deve rejeitar CPF vazio', () => {
      const result = CPFValidator.validate('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('CPF deve ter 11 dígitos');
    });
  });

  describe('cleanCPF', () => {
    it('deve remover caracteres não numéricos', () => {
      expect(CPFValidator.cleanCPF('529.982.247-25')).toBe('52998224725');
      expect(CPFValidator.cleanCPF('529-982-247-25')).toBe('52998224725');
      expect(CPFValidator.cleanCPF('abc529.982.247-25')).toBe('52998224725');
    });
  });

  describe('formatCPF', () => {
    it('deve formatar CPF corretamente', () => {
      expect(CPFValidator.formatCPF('52998224725')).toBe('529.982.247-25');
    });

    it('deve retornar CPF original se tamanho incorreto', () => {
      expect(CPFValidator.formatCPF('123')).toBe('123');
    });
  });

  describe('generateValidCPF', () => {
    it('deve gerar CPF válido', () => {
      const cpf = CPFValidator.generateValidCPF();
      const result = CPFValidator.validate(cpf);
      expect(result.isValid).toBe(true);
    });

    it('deve gerar CPFs diferentes', () => {
      const cpf1 = CPFValidator.generateValidCPF();
      const cpf2 = CPFValidator.generateValidCPF();
      expect(cpf1).not.toBe(cpf2);
    });
  });
});
