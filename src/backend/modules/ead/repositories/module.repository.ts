/**
 * Module Repository
 * 
 * Repository para operações de database relacionadas a módulos de conteúdo de cursos EAD.
 */

import { BaseRepository, BaseEntity } from '../../../shared/infrastructure/repository/base.repository';

export interface CourseModule extends BaseEntity {
  course_id: string;
  title: string;
  description?: string;
  order: number;
  duration_minutes?: number;
  is_published: boolean;
}

export class CourseModuleRepository extends BaseRepository<CourseModule> {
  constructor() {
    super('course_modules', 'ead');
  }

  /**
   * Busca módulos por curso
   */
  async findByCourseId(courseId: string): Promise<CourseModule[]> {
    return this.findAll({
      filters: { course_id: courseId },
    });
  }

  /**
   * Busca módulos publicados por curso
   */
  async findPublishedByCourseId(courseId: string): Promise<CourseModule[]> {
    const modules = await this.findByCourseId(courseId);
    return modules.filter(m => m.is_published).sort((a, b) => a.order - b.order);
  }

  /**
   * Publica módulo
   */
  async publish(id: string): Promise<CourseModule> {
    return this.update(id, { is_published: true });
  }

  /**
   * Despublica módulo
   */
  async unpublish(id: string): Promise<CourseModule> {
    return this.update(id, { is_published: false });
  }
}

export interface Lesson extends BaseEntity {
  module_id: string;
  title: string;
  description?: string;
  content?: string;
  video_url?: string;
  video_duration?: number;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  order: number;
  is_published: boolean;
  is_free: boolean;
}

export class LessonRepository extends BaseRepository<Lesson> {
  constructor() {
    super('lessons', 'ead');
  }

  /**
   * Busca lições por módulo
   */
  async findByModuleId(moduleId: string): Promise<Lesson[]> {
    return this.findAll({
      filters: { module_id: moduleId },
    });
  }

  /**
   * Busca lições publicadas por módulo
   */
  async findPublishedByModuleId(moduleId: string): Promise<Lesson[]> {
    const lessons = await this.findByModuleId(moduleId);
    return lessons.filter(l => l.is_published).sort((a, b) => a.order - b.order);
  }

  /**
   * Busca lições gratuitas por módulo
   */
  async findFreeByModuleId(moduleId: string): Promise<Lesson[]> {
    const lessons = await this.findByModuleId(moduleId);
    return lessons.filter(l => l.is_free && l.is_published);
  }

  /**
   * Busca lições por tipo
   */
  async findByType(type: string): Promise<Lesson[]> {
    return this.findAll({
      filters: { type },
    });
  }

  /**
   * Publica lição
   */
  async publish(id: string): Promise<Lesson> {
    return this.update(id, { is_published: true });
  }

  /**
   * Despublica lição
   */
  async unpublish(id: string): Promise<Lesson> {
    return this.update(id, { is_published: false });
  }
}

export interface LessonProgress extends BaseEntity {
  lesson_id: string;
  student_id: string;
  completed: boolean;
  completed_at?: Date;
  time_spent_seconds: number;
  last_accessed_at?: Date;
}

export class LessonProgressRepository extends BaseRepository<LessonProgress> {
  constructor() {
    super('lesson_progress', 'ead');
  }

  /**
   * Busca progresso por lição
   */
  async findByLessonId(lessonId: string): Promise<LessonProgress[]> {
    return this.findAll({
      filters: { lesson_id: lessonId },
    });
  }

  /**
   * Busca progresso por aluno
   */
  async findByStudentId(studentId: string): Promise<LessonProgress[]> {
    return this.findAll({
      filters: { student_id: studentId },
    });
  }

  /**
   * Busca progresso por lição e aluno
   */
  async findByLessonAndStudent(lessonId: string, studentId: string): Promise<LessonProgress[]> {
    return this.findAll({
      filters: { lesson_id: lessonId, student_id: studentId },
    });
  }

  /**
   * Cria ou atualiza progresso
   */
  async upsert(lessonId: string, studentId: string, timeSpentSeconds: number): Promise<LessonProgress> {
    const existing = await this.findByLessonAndStudent(lessonId, studentId);
    
    if (existing.length > 0) {
      const current = existing[0];
      return this.update(current.id, {
        time_spent_seconds: current.time_spent_seconds + timeSpentSeconds,
        last_accessed_at: new Date(),
      });
    }
    
    return this.create({
      lesson_id: lessonId,
      student_id: studentId,
      completed: false,
      time_spent_seconds: timeSpentSeconds,
    });
  }

  /**
   * Marca lição como completada
   */
  async markAsCompleted(id: string): Promise<LessonProgress> {
    return this.update(id, {
      completed: true,
      completed_at: new Date(),
    });
  }
}
