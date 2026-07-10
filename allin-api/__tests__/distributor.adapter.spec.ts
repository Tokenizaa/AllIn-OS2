/**
 * Distributor Adapter Unit Tests
 */

import { DistributorAdapter, DistributorEntity } from '../adapters/distributor.adapter';
import { DistributorDTO } from '../dto/distributor.dto';

describe('DistributorAdapter', () => {
  describe('toEntity', () => {
    it('should convert DTO to entity', () => {
      const dto: DistributorDTO = {
        id: 1,
        codigo: 'D001',
        nome: 'John Doe',
        usuario: 'johndoe',
        email: 'john@example.com',
        telefone: '11999999999',
        cpf: '12345678901',
        status: 'Ativo',
        data_ativacao: '2024-01-01T00:00:00Z',
        id_patrocinador: 2,
        codigo_patrocinador: 'D002',
        id_plano: 1,
        nome_plano: 'Gold Plan',
        nivel_qualificacao: 'Diamond',
        data_cadastro: '2024-01-01T00:00:00Z',
        data_atualizacao: '2024-01-15T00:00:00Z',
      };

      const entity = DistributorAdapter.toEntity(dto);

      expect(entity).toEqual({
        id: 1,
        code: 'D001',
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        phone: '11999999999',
        cpf: '12345678901',
        status: 'ACTIVE',
        activationDate: new Date('2024-01-01T00:00:00Z'),
        sponsorId: 2,
        sponsorCode: 'D002',
        planId: 1,
        planName: 'Gold Plan',
        qualificationLevel: 'Diamond',
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-15T00:00:00Z'),
      });
    });

    it('should handle optional fields', () => {
      const dto: DistributorDTO = {
        id: 1,
        codigo: 'D001',
        nome: 'John Doe',
        usuario: 'johndoe',
        email: 'john@example.com',
        telefone: undefined,
        cpf: '12345678901',
        status: 'Inativo',
        data_ativacao: undefined,
        id_patrocinador: undefined,
        codigo_patrocinador: undefined,
        id_plano: undefined,
        nome_plano: undefined,
        nivel_qualificacao: undefined,
        data_cadastro: '2024-01-01T00:00:00Z',
        data_atualizacao: '2024-01-15T00:00:00Z',
      };

      const entity = DistributorAdapter.toEntity(dto);

      expect(entity.activationDate).toBeUndefined();
      expect(entity.sponsorId).toBeUndefined();
      expect(entity.sponsorCode).toBeUndefined();
      expect(entity.planId).toBeUndefined();
      expect(entity.planName).toBeUndefined();
      expect(entity.qualificationLevel).toBeUndefined();
    });

    it('should map status correctly', () => {
      const activeDto: DistributorDTO = {
        id: 1,
        codigo: 'D001',
        nome: 'John Doe',
        usuario: 'johndoe',
        email: 'john@example.com',
        telefone: undefined,
        cpf: '12345678901',
        status: 'Ativo',
        data_ativacao: undefined,
        id_patrocinador: undefined,
        codigo_patrocinador: undefined,
        id_plano: undefined,
        nome_plano: undefined,
        nivel_qualificacao: undefined,
        data_cadastro: '2024-01-01T00:00:00Z',
        data_atualizacao: '2024-01-15T00:00:00Z',
      };

      const activeEntity = DistributorAdapter.toEntity(activeDto);
      expect(activeEntity.status).toBe('ACTIVE');

      const inactiveDto = { ...activeDto, status: 'Inativo' };
      const inactiveEntity = DistributorAdapter.toEntity(inactiveDto);
      expect(inactiveEntity.status).toBe('INACTIVE');
    });
  });

  describe('toDTO', () => {
    it('should convert entity to DTO', () => {
      const entity: DistributorEntity = {
        id: 1,
        code: 'D001',
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        phone: '11999999999',
        cpf: '12345678901',
        status: 'ACTIVE',
        activationDate: new Date('2024-01-01T00:00:00Z'),
        sponsorId: 2,
        sponsorCode: 'D002',
        planId: 1,
        planName: 'Gold Plan',
        qualificationLevel: 'Diamond',
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-15T00:00:00Z'),
      };

      const dto = DistributorAdapter.toDTO(entity);

      expect(dto).toEqual({
        id: 1,
        codigo: 'D001',
        nome: 'John Doe',
        usuario: 'johndoe',
        email: 'john@example.com',
        telefone: '11999999999',
        cpf: '12345678901',
        status: 'Ativo',
        data_ativacao: '2024-01-01T00:00:00.000Z',
        id_patrocinador: 2,
        codigo_patrocinador: 'D002',
        id_plano: 1,
        nome_plano: 'Gold Plan',
        nivel_qualificacao: 'Diamond',
        data_cadastro: '2024-01-01T00:00:00.000Z',
        data_atualizacao: '2024-01-15T00:00:00.000Z',
      });
    });
  });

  describe('round-trip conversion', () => {
    it('should maintain data integrity through DTO -> Entity -> DTO conversion', () => {
      const originalDto: DistributorDTO = {
        id: 1,
        codigo: 'D001',
        nome: 'John Doe',
        usuario: 'johndoe',
        email: 'john@example.com',
        telefone: '11999999999',
        cpf: '12345678901',
        status: 'Ativo',
        data_ativacao: '2024-01-01T00:00:00Z',
        id_patrocinador: 2,
        codigo_patrocinador: 'D002',
        id_plano: 1,
        nome_plano: 'Gold Plan',
        nivel_qualificacao: 'Diamond',
        data_cadastro: '2024-01-01T00:00:00Z',
        data_atualizacao: '2024-01-15T00:00:00Z',
      };

      const entity = DistributorAdapter.toEntity(originalDto);
      const convertedDto = DistributorAdapter.toDTO(entity);

      expect(convertedDto.id).toBe(originalDto.id);
      expect(convertedDto.codigo).toBe(originalDto.codigo);
      expect(convertedDto.nome).toBe(originalDto.nome);
      expect(convertedDto.usuario).toBe(originalDto.usuario);
      expect(convertedDto.email).toBe(originalDto.email);
      expect(convertedDto.cpf).toBe(originalDto.cpf);
    });
  });
});
