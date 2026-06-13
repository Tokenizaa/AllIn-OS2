/**
 * Soft Delete Helper
 * 
 * Helper para implementar soft delete em repositories e services.
 * Fornece métodos para marcar registros como deletados e restaurá-los.
 */

export interface SoftDeleteEntity {
  id: string;
  deleted_at: Date | null;
}

export class SoftDeleteHelper {
  /**
   * Marca uma entidade como deletada
   * 
   * @param entity Entidade a ser marcada como deletada
   * @returns Entidade atualizada
   */
  static markAsDeleted<T extends SoftDeleteEntity>(entity: T): T {
    return {
      ...entity,
      deleted_at: new Date(),
    };
  }

  /**
   * Restaura uma entidade deletada
   * 
   * @param entity Entidade a ser restaurada
   * @returns Entidade atualizada
   */
  static restore<T extends SoftDeleteEntity>(entity: T): T {
    return {
      ...entity,
      deleted_at: null,
    };
  }

  /**
   * Verifica se uma entidade está deletada
   * 
   * @param entity Entidade a verificar
   * @returns true se está deletada
   */
  static isDeleted(entity: SoftDeleteEntity): boolean {
    return entity.deleted_at !== null;
  }

  /**
   * Filtra entidades não deletadas
   * 
   * @param entities Lista de entidades
   * @returns Entidades não deletadas
   */
  static filterNotDeleted<T extends SoftDeleteEntity>(entities: T[]): T[] {
    return entities.filter(entity => entity.deleted_at === null);
  }

  /**
   * Filtra entidades deletadas
   * 
   * @param entities Lista de entidades
   * @returns Entidades deletadas
   */
  static filterDeleted<T extends SoftDeleteEntity>(entities: T[]): T[] {
    return entities.filter(entity => entity.deleted_at !== null);
  }

  /**
   * Retorna a cláusula WHERE para filtrar registros não deletados
   * 
   * @returns String da cláusula WHERE
   */
  static getNotDeletedWhereClause(): string {
    return 'deleted_at IS NULL';
  }

  /**
   * Retorna a cláusula WHERE para filtrar registros deletados
   * 
   * @returns String da cláusula WHERE
   */
  static getDeletedWhereClause(): string {
    return 'deleted_at IS NOT NULL';
  }

  /**
   * Retorna o objeto para marcar como deletado em update
   * 
   * @returns Objeto com deleted_at
   */
  static getDeletedUpdateObject(): { deleted_at: string } {
    return {
      deleted_at: new Date().toISOString(),
    };
  }

  /**
   * Retorna o objeto para restaurar em update
   * 
   * @returns Objeto com deleted_at null
   */
  static getRestoreUpdateObject(): { deleted_at: null } {
    return {
      deleted_at: null,
    };
  }
}
