/**
 * Distributor Normalizer Unit Tests
 */

import { DistributorNormalizer } from '../normalizers/distributor.normalizer';

describe('DistributorNormalizer', () => {
  describe('normalize', () => {
    it('should normalize valid distributor data', () => {
      const rawData = {
        id: '1',
        codigo: '  D001  ',
        nome: '  John Doe  ',
        usuario: '  JohnDoe  ',
        email: '  JOHN@EXAMPLE.COM  ',
        telefone: '  11999999999  ',
        cpf: '  123.456.789-01  ',
        status: 'Ativo',
        data_ativacao: '2024-01-01T00:00:00Z',
        id_patrocinador: '2',
        codigo_patrocinador: '  D002  ',
        id_plano: '1',
        nome_plano: '  Gold Plan  ',
        nivel_qualificacao: '  Diamond  ',
        data_cadastro: '2024-01-01T00:00:00Z',
        data_atualizacao: '2024-01-15T00:00:00Z',
      };

      const normalized = DistributorNormalizer.normalize(rawData);

      expect(normalized.id).toBe(1);
      expect(normalized.codigo).toBe('D001');
      expect(normalized.nome).toBe('John Doe');
      expect(normalized.usuario).toBe('johndoe');
      expect(normalized.email).toBe('john@example.com');
      expect(normalized.cpf).toBe('12345678901');
      expect(normalized.id_patrocinador).toBe(2);
      expect(normalized.id_plano).toBe(1);
    });

    it('should add computed fields', () => {
      const rawData = {
        id: 1,
        codigo: 'D001',
        nome: 'John Doe',
        usuario: 'johndoe',
        email: 'john@example.com',
        cpf: '12345678901',
        status: 'Ativo',
        data_cadastro: '2024-01-01T00:00:00Z',
        data_atualizacao: '2024-01-15T00:00:00Z',
      };

      const normalized = DistributorNormalizer.normalize(rawData);

      expect(normalized.fullName).toBe('John Doe');
      expect(normalized.initials).toBe('JD');
      expect(normalized.isQualified).toBe(false);
    });

    it('should handle qualified distributors', () => {
      const rawData = {
        id: 1,
        codigo: 'D001',
        nome: 'John Doe',
        usuario: 'johndoe',
        email: 'john@example.com',
        cpf: '12345678901',
        status: 'Ativo',
        nivel_qualificacao: 'Diamond',
        data_cadastro: '2024-01-01T00:00:00Z',
        data_atualizacao: '2024-01-15T00:00:00Z',
      };

      const normalized = DistributorNormalizer.normalize(rawData);

      expect(normalized.isQualified).toBe(true);
    });

    it('should throw error for invalid data', () => {
      const rawData = {
        id: 'invalid',
        codigo: '',
        nome: '',
        usuario: '',
        email: 'invalid-email',
        cpf: 'invalid-cpf',
        status: 'Ativo',
        data_cadastro: '2024-01-01T00:00:00Z',
        data_atualizacao: '2024-01-15T00:00:00Z',
      };

      expect(() => DistributorNormalizer.normalize(rawData)).toThrow();
    });

    it('should sanitize CPF correctly', () => {
      const rawData = {
        id: 1,
        codigo: 'D001',
        nome: 'John Doe',
        usuario: 'johndoe',
        email: 'john@example.com',
        cpf: '123.456.789-01',
        status: 'Ativo',
        data_cadastro: '2024-01-01T00:00:00Z',
        data_atualizacao: '2024-01-15T00:00:00Z',
      };

      const normalized = DistributorNormalizer.normalize(rawData);

      expect(normalized.cpf).toBe('12345678901');
    });

    it('should handle optional fields', () => {
      const rawData = {
        id: 1,
        codigo: 'D001',
        nome: 'John Doe',
        usuario: 'johndoe',
        email: 'john@example.com',
        cpf: '12345678901',
        status: 'Ativo',
        data_cadastro: '2024-01-01T00:00:00Z',
        data_atualizacao: '2024-01-15T00:00:00Z',
      };

      const normalized = DistributorNormalizer.normalize(rawData);

      expect(normalized.telefone).toBeUndefined();
      expect(normalized.data_ativacao).toBeNull();
      expect(normalized.id_patrocinador).toBeUndefined();
      expect(normalized.codigo_patrocinador).toBeUndefined();
      expect(normalized.id_plano).toBeUndefined();
      expect(normalized.nome_plano).toBeUndefined();
      expect(normalized.nivel_qualificacao).toBeUndefined();
    });
  });
});
