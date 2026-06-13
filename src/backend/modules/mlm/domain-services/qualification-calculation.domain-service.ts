/**
 * Qualification Calculation Domain Service
 * 
 * Domain service contendo lógica pura de cálculo de qualificações MLM.
 * Separado de infraestrutura (database, APIs) para facilitar testes e reuso.
 * 
 * Responsabilidades:
 * - Cálculo de qualificação atual
 * - Validação de requisitos de qualificação
 * - Histórico de qualificações
 * - Progressão de qualificação
 */

export interface QualificationRequirements {
  minPersonalVolume: number;
  minTeamVolume: number;
  minActiveDownlines: number;
  minDownlinesAtLevel: string;
  minPoints: number;
}

export interface QualificationLevel {
  id: string;
  name: string;
  index: number;
  requirements: QualificationRequirements;
}

export interface QualificationCalculationResult {
  distributorId: string;
  currentQualification: string;
  newQualification: string;
  upgraded: boolean;
  missingRequirements?: QualificationRequirements;
}

export interface DistributorMetrics {
  distributorId: string;
  personalVolume: number;
  teamVolume: number;
  activeDownlines: number;
  downlinesAtLevel: Record<string, number>;
  points: number;
  qualification: string;
}

export class QualificationCalculationDomainService {
  private static instance: QualificationCalculationDomainService;

  private constructor() {}

  static getInstance(): QualificationCalculationDomainService {
    if (!QualificationCalculationDomainService.instance) {
      QualificationCalculationDomainService.instance = new QualificationCalculationDomainService();
    }
    return QualificationCalculationDomainService.instance;
  }

  /**
   * Níveis de qualificação com requisitos
   * Estes requisitos podem ser configurados via database no futuro
   */
  private qualificationLevels: Record<string, QualificationLevel> = {
    'none': {
      id: 'none',
      name: 'Sem Qualificação',
      index: 0,
      requirements: {
        minPersonalVolume: 0,
        minTeamVolume: 0,
        minActiveDownlines: 0,
        minDownlinesAtLevel: 'none',
        minPoints: 0,
      },
    },
    'bronze': {
      id: 'bronze',
      name: 'Bronze',
      index: 1,
      requirements: {
        minPersonalVolume: 500,
        minTeamVolume: 1000,
        minActiveDownlines: 2,
        minDownlinesAtLevel: 'none',
        minPoints: 100,
      },
    },
    'silver': {
      id: 'silver',
      name: 'Prata',
      index: 2,
      requirements: {
        minPersonalVolume: 1000,
        minTeamVolume: 5000,
        minActiveDownlines: 5,
        minDownlinesAtLevel: 'bronze',
        minPoints: 500,
      },
    },
    'gold': {
      id: 'gold',
      name: 'Ouro',
      index: 3,
      requirements: {
        minPersonalVolume: 2000,
        minTeamVolume: 15000,
        minActiveDownlines: 10,
        minDownlinesAtLevel: 'silver',
        minPoints: 1000,
      },
    },
    'platinum': {
      id: 'platinum',
      name: 'Platina',
      index: 4,
      requirements: {
        minPersonalVolume: 5000,
        minTeamVolume: 50000,
        minActiveDownlines: 20,
        minDownlinesAtLevel: 'gold',
        minPoints: 2500,
      },
    },
    'diamond': {
      id: 'diamond',
      name: 'Diamante',
      index: 5,
      requirements: {
        minPersonalVolume: 10000,
        minTeamVolume: 100000,
        minActiveDownlines: 30,
        minDownlinesAtLevel: 'platinum',
        minPoints: 5000,
      },
    },
  };

  /**
   * Calcula qualificação atual de um distribuidor
   * 
   * @param metrics Métricas do distribuidor
   * @returns Resultado do cálculo de qualificação
   */
  calculateQualification(metrics: DistributorMetrics): QualificationCalculationResult {
    const currentLevel = this.qualificationLevels[metrics.qualification] || this.qualificationLevels['none'];
    const levels = Object.values(this.qualificationLevels);
    
    // Verificar qualificação mais alta que o distribuidor pode atingir
    let newQualification = metrics.qualification;
    let missingRequirements: QualificationRequirements | undefined;

    for (const level of levels) {
      // Pular se já está neste nível ou superior
      if (level.index <= currentLevel.index) continue;

      // Verificar requisitos
      const requirementsMet = this.validateRequirements(
        level.requirements,
        metrics
      );

      if (requirementsMet) {
        newQualification = level.id;
      } else if (!missingRequirements && level.index === currentLevel.index + 1) {
        // Armazenar requisitos faltantes para o próximo nível
        missingRequirements = this.getMissingRequirements(level.requirements, metrics);
      }
    }

    const upgraded = newQualification !== metrics.qualification;

    return {
      distributorId: metrics.distributorId,
      currentQualification: metrics.qualification,
      newQualification,
      upgraded,
      missingRequirements,
    };
  }

  /**
   * Valida se requisitos de qualificação são atendidos
   * 
   * @param requirements Requisitos da qualificação
   * @param metrics Métricas do distribuidor
   * @returns true se todos os requisitos são atendidos
   */
  private validateRequirements(
    requirements: QualificationRequirements,
    metrics: DistributorMetrics
  ): boolean {
    if (metrics.personalVolume < requirements.minPersonalVolume) {
      return false;
    }

    if (metrics.teamVolume < requirements.minTeamVolume) {
      return false;
    }

    if (metrics.activeDownlines < requirements.minActiveDownlines) {
      return false;
    }

    if (metrics.points < requirements.minPoints) {
      return false;
    }

    const requiredLevelIndex = this.qualificationLevels[requirements.minDownlinesAtLevel]?.index || 0;
    const currentLevelIndex = this.qualificationLevels[metrics.qualification]?.index || 0;

    if (currentLevelIndex < requiredLevelIndex) {
      return false;
    }

    return true;
  }

  /**
   * Obtém requisitos faltantes para uma qualificação
   * 
   * @param requirements Requisitos da qualificação
   * @param metrics Métricas do distribuidor
   * @returns Requisitos faltantes
   */
  private getMissingRequirements(
    requirements: QualificationRequirements,
    metrics: DistributorMetrics
  ): QualificationRequirements {
    const missing: QualificationRequirements = {
      minPersonalVolume: Math.max(0, requirements.minPersonalVolume - metrics.personalVolume),
      minTeamVolume: Math.max(0, requirements.minTeamVolume - metrics.teamVolume),
      minActiveDownlines: Math.max(0, requirements.minActiveDownlines - metrics.activeDownlines),
      minDownlinesAtLevel: requirements.minDownlinesAtLevel,
      minPoints: Math.max(0, requirements.minPoints - metrics.points),
    };

    return missing;
  }

  /**
   * Obtém qualificação mais alta que pode ser atingida
   * 
   * @param metrics Métricas do distribuidor
   * @returns ID da qualificação mais alta atingível
   */
  getHighestAchievableQualification(metrics: DistributorMetrics): string {
    const levels = Object.values(this.qualificationLevels);
    let highestAchievable = 'none';

    for (const level of levels) {
      if (this.validateRequirements(level.requirements, metrics)) {
        highestAchievable = level.id;
      }
    }

    return highestAchievable;
  }

  /**
   * Verifica se um distribuidor pode fazer upgrade para uma qualificação específica
   * 
   * @param distributorId ID do distribuidor
   * @param targetQualification Qualificação alvo
   * @param metrics Métricas do distribuidor
   * @returns true se pode fazer upgrade
   */
  canUpgradeTo(
    distributorId: string,
    targetQualification: string,
    metrics: DistributorMetrics
  ): boolean {
    const targetLevel = this.qualificationLevels[targetQualification];
    if (!targetLevel) return false;

    const currentLevel = this.qualificationLevels[metrics.qualification] || this.qualificationLevels['none'];

    // Não pode fazer downgrade
    if (targetLevel.index <= currentLevel.index) return false;

    // Verificar requisitos
    return this.validateRequirements(targetLevel.requirements, metrics);
  }

  /**
   * Obtém progresso para próxima qualificação
   * 
   * @param metrics Métricas do distribuidor
   * @returns Progresso em porcentagem
   */
  getProgressToNextQualification(metrics: DistributorMetrics): number {
    const currentLevel = this.qualificationLevels[metrics.qualification] || this.qualificationLevels['none'];
    const nextLevelIndex = currentLevel.index + 1;
    const levels = Object.values(this.qualificationLevels);
    const nextLevel = levels.find(l => l.index === nextLevelIndex);

    if (!nextLevel) return 100; // Já está no nível mais alto

    const requirements = nextLevel.requirements;
    const totalRequirements = 5; // Número total de requisitos

    let metRequirements = 0;

    if (metrics.personalVolume >= requirements.minPersonalVolume) metRequirements++;
    if (metrics.teamVolume >= requirements.minTeamVolume) metRequirements++;
    if (metrics.activeDownlines >= requirements.minActiveDownlines) metRequirements++;
    if (metrics.points >= requirements.minPoints) metRequirements++;

    const requiredLevelIndex = this.qualificationLevels[requirements.minDownlinesAtLevel]?.index || 0;
    const currentLevelIndex = this.qualificationLevels[metrics.qualification]?.index || 0;
    if (currentLevelIndex >= requiredLevelIndex) metRequirements++;

    return (metRequirements / totalRequirements) * 100;
  }

  /**
   * Obtém nível de qualificação por ID
   * 
   * @param levelId ID do nível
   * @returns Nível de qualificação
   */
  getQualificationLevel(levelId: string): QualificationLevel | undefined {
    return this.qualificationLevels[levelId];
  }

  /**
   * Obtém todos os níveis de qualificação
   * 
   * @returns Todos os níveis de qualificação
   */
  getAllQualificationLevels(): QualificationLevel[] {
    return Object.values(this.qualificationLevels);
  }

  /**
   * Obtém níveis de qualificação ordenados
   * 
   * @returns Níveis de qualificação ordenados por índice
   */
  getQualificationLevelsOrdered(): QualificationLevel[] {
    return Object.values(this.qualificationLevels).sort((a, b) => a.index - b.index);
  }

  /**
   * Atualiza requisitos de um nível de qualificação
   * 
   * @param levelId ID do nível
   * @param requirements Novos requisitos
   */
  updateQualificationRequirements(
    levelId: string,
    requirements: Partial<QualificationRequirements>
  ): void {
    const level = this.qualificationLevels[levelId];
    if (level) {
      level.requirements = { ...level.requirements, ...requirements };
    }
  }

  /**
   * Calcula tempo estimado para próxima qualificação
   * 
   * @param metrics Métricas atuais
   * @param monthlyGrowth Crescimento mensal estimado
   * @returns Número de meses estimados
   */
  estimateTimeToNextQualification(
    metrics: DistributorMetrics,
    monthlyGrowth: {
      personalVolume: number;
      teamVolume: number;
      activeDownlines: number;
      points: number;
    }
  ): number {
    const currentLevel = this.qualificationLevels[metrics.qualification] || this.qualificationLevels['none'];
    const nextLevelIndex = currentLevel.index + 1;
    const levels = Object.values(this.qualificationLevels);
    const nextLevel = levels.find(l => l.index === nextLevelIndex);

    if (!nextLevel) return 0; // Já está no nível mais alto

    const requirements = nextLevel.requirements;
    const monthsNeeded: number[] = [];

    // Volume pessoal
    if (monthlyGrowth.personalVolume > 0) {
      const volumeMonths = Math.ceil(
        (requirements.minPersonalVolume - metrics.personalVolume) / monthlyGrowth.personalVolume
      );
      monthsNeeded.push(volumeMonths);
    }

    // Volume da equipe
    if (monthlyGrowth.teamVolume > 0) {
      const teamMonths = Math.ceil(
        (requirements.minTeamVolume - metrics.teamVolume) / monthlyGrowth.teamVolume
      );
      monthsNeeded.push(teamMonths);
    }

    // Downlines ativos
    if (monthlyGrowth.activeDownlines > 0) {
      const downlinesMonths = Math.ceil(
        (requirements.minActiveDownlines - metrics.activeDownlines) / monthlyGrowth.activeDownlines
      );
      monthsNeeded.push(downlinesMonths);
    }

    // Pontos
    if (monthlyGrowth.points > 0) {
      const pointsMonths = Math.ceil(
        (requirements.minPoints - metrics.points) / monthlyGrowth.points
      );
      monthsNeeded.push(pointsMonths);
    }

    // Retornar o maior número de meses (o requisito que demora mais)
    return Math.max(...monthsNeeded, 0);
  }
}
