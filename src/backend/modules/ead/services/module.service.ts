/**
 * Module Service
 * 
 * Service para gerenciar módulos de conteúdo de cursos EAD.
 */

import { CourseModuleRepository, LessonRepository, LessonProgressRepository } from '../repositories/module.repository';
import {
  CourseModule,
  CreateModuleDTO,
  UpdateModuleDTO,
  ModuleResponseDTO,
  Lesson,
  CreateLessonDTO,
  UpdateLessonDTO,
  LessonResponseDTO,
  LessonProgress,
  CreateLessonProgressDTO,
  UpdateLessonProgressDTO,
} from '../dto/module.dto';

export class ModuleService {
  private moduleRepository: CourseModuleRepository;
  private lessonRepository: LessonRepository;
  private progressRepository: LessonProgressRepository;

  constructor() {
    this.moduleRepository = new CourseModuleRepository();
    this.lessonRepository = new LessonRepository();
    this.progressRepository = new LessonProgressRepository();
  }

  // Módulos

  /**
   * Cria novo módulo
   */
  async createModule(dto: CreateModuleDTO): Promise<CourseModule> {
    return this.moduleRepository.create({
      ...dto,
      order: dto.order ?? 0,
      is_published: dto.is_published ?? false,
    });
  }

  /**
   * Busca módulo por ID
   */
  async findModuleById(id: string): Promise<CourseModule | null> {
    return this.moduleRepository.findById(id);
  }

  /**
   * Busca módulos por curso
   */
  async findModulesByCourseId(courseId: string): Promise<CourseModule[]> {
    return this.moduleRepository.findByCourseId(courseId);
  }

  /**
   * Busca módulos publicados por curso
   */
  async findPublishedModulesByCourseId(courseId: string): Promise<CourseModule[]> {
    return this.moduleRepository.findPublishedByCourseId(courseId);
  }

  /**
   * Atualiza módulo
   */
  async updateModule(id: string, dto: UpdateModuleDTO): Promise<CourseModule> {
    const existing = await this.moduleRepository.findById(id);
    if (!existing) {
      throw new Error('Module not found');
    }

    return this.moduleRepository.update(id, dto);
  }

  /**
   * Deleta módulo
   */
  async deleteModule(id: string): Promise<void> {
    const existing = await this.moduleRepository.findById(id);
    if (!existing) {
      throw new Error('Module not found');
    }

    await this.moduleRepository.delete(id);
  }

  /**
   * Publica módulo
   */
  async publishModule(id: string): Promise<CourseModule> {
    return this.moduleRepository.publish(id);
  }

  /**
   * Despublica módulo
   */
  async unpublishModule(id: string): Promise<CourseModule> {
    return this.moduleRepository.unpublish(id);
  }

  // Lições

  /**
   * Cria nova lição
   */
  async createLesson(dto: CreateLessonDTO): Promise<Lesson> {
    return this.lessonRepository.create({
      ...dto,
      type: dto.type ?? 'video',
      order: dto.order ?? 0,
      is_published: dto.is_published ?? false,
      is_free: dto.is_free ?? false,
    });
  }

  /**
   * Busca lição por ID
   */
  async findLessonById(id: string): Promise<Lesson | null> {
    return this.lessonRepository.findById(id);
  }

  /**
   * Busca lições por módulo
   */
  async findLessonsByModuleId(moduleId: string): Promise<Lesson[]> {
    return this.lessonRepository.findByModuleId(moduleId);
  }

  /**
   * Busca lições publicadas por módulo
   */
  async findPublishedLessonsByModuleId(moduleId: string): Promise<Lesson[]> {
    return this.lessonRepository.findPublishedByModuleId(moduleId);
  }

  /**
   * Busca lições gratuitas por módulo
   */
  async findFreeLessonsByModuleId(moduleId: string): Promise<Lesson[]> {
    return this.lessonRepository.findFreeByModuleId(moduleId);
  }

  /**
   * Atualiza lição
   */
  async updateLesson(id: string, dto: UpdateLessonDTO): Promise<Lesson> {
    const existing = await this.lessonRepository.findById(id);
    if (!existing) {
      throw new Error('Lesson not found');
    }

    return this.lessonRepository.update(id, dto);
  }

  /**
   * Deleta lição
   */
  async deleteLesson(id: string): Promise<void> {
    const existing = await this.lessonRepository.findById(id);
    if (!existing) {
      throw new Error('Lesson not found');
    }

    await this.lessonRepository.delete(id);
  }

  /**
   * Publica lição
   */
  async publishLesson(id: string): Promise<Lesson> {
    return this.lessonRepository.publish(id);
  }

  /**
   * Despublica lição
   */
  async unpublishLesson(id: string): Promise<Lesson> {
    return this.lessonRepository.unpublish(id);
  }

  // Progresso de Lições

  /**
   * Cria ou atualiza progresso de lição
   */
  async upsertLessonProgress(dto: CreateLessonProgressDTO): Promise<LessonProgress> {
    return this.progressRepository.upsert(
      dto.lesson_id,
      dto.student_id,
      dto.time_spent_seconds ?? 0
    );
  }

  /**
   * Atualiza progresso de lição
   */
  async updateLessonProgress(id: string, dto: UpdateLessonProgressDTO): Promise<LessonProgress> {
    const existing = await this.progressRepository.findById(id);
    if (!existing) {
      throw new Error('Lesson progress not found');
    }

    const updateData: any = {
      last_accessed_at: new Date(),
    };

    if (dto.completed !== undefined) {
      updateData.completed = dto.completed;
      if (dto.completed && !existing.completed) {
        updateData.completed_at = new Date();
      }
    }

    if (dto.time_spent_seconds !== undefined) {
      updateData.time_spent_seconds = dto.time_spent_seconds;
    }

    return this.progressRepository.update(id, updateData);
  }

  /**
   * Marca lição como completada
   */
  async markLessonAsCompleted(id: string): Promise<LessonProgress> {
    return this.progressRepository.markAsCompleted(id);
  }

  /**
   * Busca progresso por lição
   */
  async findProgressByLessonId(lessonId: string): Promise<LessonProgress[]> {
    return this.progressRepository.findByLessonId(lessonId);
  }

  /**
   * Busca progresso por aluno
   */
  async findProgressByStudentId(studentId: string): Promise<LessonProgress[]> {
    return this.progressRepository.findByStudentId(studentId);
  }

  /**
   * Converte módulo para DTO de resposta
   */
  toModuleResponseDTO(module: CourseModule): ModuleResponseDTO {
    return {
      id: module.id,
      course_id: module.course_id,
      title: module.title,
      description: module.description,
      order: module.order,
      duration_minutes: module.duration_minutes,
      is_published: module.is_published,
      created_at: module.created_at,
      updated_at: module.updated_at,
    };
  }

  /**
   * Converte lição para DTO de resposta
   */
  toLessonResponseDTO(lesson: Lesson): LessonResponseDTO {
    return {
      id: lesson.id,
      module_id: lesson.module_id,
      title: lesson.title,
      description: lesson.description,
      content: lesson.content,
      video_url: lesson.video_url,
      video_duration: lesson.video_duration,
      type: lesson.type,
      order: lesson.order,
      is_published: lesson.is_published,
      is_free: lesson.is_free,
      created_at: lesson.created_at,
      updated_at: lesson.updated_at,
    };
  }
}
