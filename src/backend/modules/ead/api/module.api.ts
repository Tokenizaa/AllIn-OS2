/**
 * Module API
 * 
 * API endpoints para módulos de conteúdo de cursos EAD.
 */

import { ModuleService } from '../services/module.service';
import { Request, Response } from 'express';

export class ModuleAPI {
  private service: ModuleService;

  constructor() {
    this.service = new ModuleService();
  }

  // Módulos

  /**
   * POST /api/ead/modules
   * Cria novo módulo
   */
  async createModule(req: Request, res: Response): Promise<void> {
    try {
      const module = await this.service.createModule(req.body);
      res.json(module);
    } catch (error) {
      console.error('Error creating module:', error);
      res.status(500).json({ error: 'Failed to create module' });
    }
  }

  /**
   * GET /api/ead/modules/:id
   * Busca módulo por ID
   */
  async getModuleById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const idValue = Array.isArray(id) ? id[0] : id;
      const module = await this.service.findModuleById(idValue);
      if (!module) {
        res.status(404).json({ error: 'Module not found' });
        return;
      }
      res.json(module);
    } catch (error) {
      console.error('Error fetching module:', error);
      res.status(500).json({ error: 'Failed to fetch module' });
    }
  }

  /**
   * GET /api/ead/modules/course/:courseId
   * Busca módulos por curso
   */
  async getModulesByCourseId(req: Request, res: Response): Promise<void> {
    try {
      const { courseId } = req.params;
      const courseIdValue = Array.isArray(courseId) ? courseId[0] : courseId;
      const modules = await this.service.findModulesByCourseId(courseIdValue);
      res.json(modules);
    } catch (error) {
      console.error('Error fetching modules:', error);
      res.status(500).json({ error: 'Failed to fetch modules' });
    }
  }

  /**
   * PUT /api/ead/modules/:id
   * Atualiza módulo
   */
  async updateModule(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const idValue = Array.isArray(id) ? id[0] : id;
      const module = await this.service.updateModule(idValue, req.body);
      res.json(module);
    } catch (error) {
      console.error('Error updating module:', error);
      res.status(500).json({ error: 'Failed to update module' });
    }
  }

  /**
   * DELETE /api/ead/modules/:id
   * Deleta módulo
   */
  async deleteModule(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const idValue = Array.isArray(id) ? id[0] : id;
      await this.service.deleteModule(idValue);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting module:', error);
      res.status(500).json({ error: 'Failed to delete module' });
    }
  }

  /**
   * POST /api/ead/modules/:id/publish
   * Publica módulo
   */
  async publishModule(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const idValue = Array.isArray(id) ? id[0] : id;
      const module = await this.service.publishModule(idValue);
      res.json(module);
    } catch (error) {
      console.error('Error publishing module:', error);
      res.status(500).json({ error: 'Failed to publish module' });
    }
  }

  /**
   * POST /api/ead/modules/:id/unpublish
   * Despublica módulo
   */
  async unpublishModule(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const idValue = Array.isArray(id) ? id[0] : id;
      const module = await this.service.unpublishModule(idValue);
      res.json(module);
    } catch (error) {
      console.error('Error unpublishing module:', error);
      res.status(500).json({ error: 'Failed to unpublish module' });
    }
  }

  // Lições

  /**
   * POST /api/ead/lessons
   * Cria nova lição
   */
  async createLesson(req: Request, res: Response): Promise<void> {
    try {
      const lesson = await this.service.createLesson(req.body);
      res.json(lesson);
    } catch (error) {
      console.error('Error creating lesson:', error);
      res.status(500).json({ error: 'Failed to create lesson' });
    }
  }

  /**
   * GET /api/ead/lessons/:id
   * Busca lição por ID
   */
  async getLessonById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const idValue = Array.isArray(id) ? id[0] : id;
      const lesson = await this.service.findLessonById(idValue);
      if (!lesson) {
        res.status(404).json({ error: 'Lesson not found' });
        return;
      }
      res.json(lesson);
    } catch (error) {
      console.error('Error fetching lesson:', error);
      res.status(500).json({ error: 'Failed to fetch lesson' });
    }
  }

  /**
   * GET /api/ead/lessons/module/:moduleId
   * Busca lições por módulo
   */
  async getLessonsByModuleId(req: Request, res: Response): Promise<void> {
    try {
      const { moduleId } = req.params;
      const moduleIdValue = Array.isArray(moduleId) ? moduleId[0] : moduleId;
      const lessons = await this.service.findLessonsByModuleId(moduleIdValue);
      res.json(lessons);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      res.status(500).json({ error: 'Failed to fetch lessons' });
    }
  }

  /**
   * PUT /api/ead/lessons/:id
   * Atualiza lição
   */
  async updateLesson(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const idValue = Array.isArray(id) ? id[0] : id;
      const lesson = await this.service.updateLesson(idValue, req.body);
      res.json(lesson);
    } catch (error) {
      console.error('Error updating lesson:', error);
      res.status(500).json({ error: 'Failed to update lesson' });
    }
  }

  /**
   * DELETE /api/ead/lessons/:id
   * Deleta lição
   */
  async deleteLesson(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const idValue = Array.isArray(id) ? id[0] : id;
      await this.service.deleteLesson(idValue);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting lesson:', error);
      res.status(500).json({ error: 'Failed to delete lesson' });
    }
  }

  /**
   * POST /api/ead/lessons/:id/publish
   * Publica lição
   */
  async publishLesson(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const idValue = Array.isArray(id) ? id[0] : id;
      const lesson = await this.service.publishLesson(idValue);
      res.json(lesson);
    } catch (error) {
      console.error('Error publishing lesson:', error);
      res.status(500).json({ error: 'Failed to publish lesson' });
    }
  }

  /**
   * POST /api/ead/lessons/:id/unpublish
   * Despublica lição
   */
  async unpublishLesson(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const idValue = Array.isArray(id) ? id[0] : id;
      const lesson = await this.service.unpublishLesson(idValue);
      res.json(lesson);
    } catch (error) {
      console.error('Error unpublishing lesson:', error);
      res.status(500).json({ error: 'Failed to unpublish lesson' });
    }
  }

  // Progresso de Lições

  /**
   * POST /api/ead/lesson-progress
   * Cria ou atualiza progresso de lição
   */
  async upsertLessonProgress(req: Request, res: Response): Promise<void> {
    try {
      const progress = await this.service.upsertLessonProgress(req.body);
      res.json(progress);
    } catch (error) {
      console.error('Error upserting lesson progress:', error);
      res.status(500).json({ error: 'Failed to upsert lesson progress' });
    }
  }

  /**
   * PUT /api/ead/lesson-progress/:id
   * Atualiza progresso de lição
   */
  async updateLessonProgress(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const idValue = Array.isArray(id) ? id[0] : id;
      const progress = await this.service.updateLessonProgress(idValue, req.body);
      res.json(progress);
    } catch (error) {
      console.error('Error updating lesson progress:', error);
      res.status(500).json({ error: 'Failed to update lesson progress' });
    }
  }

  /**
   * POST /api/ead/lesson-progress/:id/complete
   * Marca lição como completada
   */
  async markLessonAsCompleted(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const idValue = Array.isArray(id) ? id[0] : id;
      const progress = await this.service.markLessonAsCompleted(idValue);
      res.json(progress);
    } catch (error) {
      console.error('Error marking lesson as completed:', error);
      res.status(500).json({ error: 'Failed to mark lesson as completed' });
    }
  }

  /**
   * GET /api/ead/lesson-progress/lesson/:lessonId
   * Busca progresso por lição
   */
  async getProgressByLessonId(req: Request, res: Response): Promise<void> {
    try {
      const { lessonId } = req.params;
      const lessonIdValue = Array.isArray(lessonId) ? lessonId[0] : lessonId;
      const progress = await this.service.findProgressByLessonId(lessonIdValue);
      res.json(progress);
    } catch (error) {
      console.error('Error fetching lesson progress:', error);
      res.status(500).json({ error: 'Failed to fetch lesson progress' });
    }
  }

  /**
   * GET /api/ead/lesson-progress/student/:studentId
   * Busca progresso por aluno
   */
  async getProgressByStudentId(req: Request, res: Response): Promise<void> {
    try {
      const { studentId } = req.params;
      const studentIdValue = Array.isArray(studentId) ? studentId[0] : studentId;
      const progress = await this.service.findProgressByStudentId(studentIdValue);
      res.json(progress);
    } catch (error) {
      console.error('Error fetching student progress:', error);
      res.status(500).json({ error: 'Failed to fetch student progress' });
    }
  }
}
