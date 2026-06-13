/**
 * Course API
 * 
 * API endpoints para cursos EAD.
 */

import { CourseService } from '../services/course.service';
import { Request, Response } from 'express';

export class CourseAPI {
  private service: CourseService;

  constructor() {
    this.service = new CourseService();
  }

  /**
   * POST /api/ead/courses
   * Cria novo curso
   */
  async createCourse(req: Request, res: Response): Promise<void> {
    try {
      const course = await this.service.createCourse(req.body);
      res.json(course);
    } catch (error) {
      console.error('Error creating course:', error);
      res.status(500).json({ error: 'Failed to create course' });
    }
  }

  /**
   * GET /api/ead/courses/:id
   * Busca curso por ID
   */
  async getCourseById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const idValue = Array.isArray(id) ? id[0] : id;
      const course = await this.service.findCourseById(idValue);
      if (!course) {
        res.status(404).json({ error: 'Course not found' });
        return;
      }
      res.json(course);
    } catch (error) {
      console.error('Error fetching course:', error);
      res.status(500).json({ error: 'Failed to fetch course' });
    }
  }

  /**
   * GET /api/ead/courses/slug/:slug
   * Busca curso por slug
   */
  async getCourseBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const slugValue = Array.isArray(slug) ? slug[0] : slug;
      const course = await this.service.findCourseBySlug(slugValue);
      if (!course) {
        res.status(404).json({ error: 'Course not found' });
        return;
      }
      res.json(course);
    } catch (error) {
      console.error('Error fetching course by slug:', error);
      res.status(500).json({ error: 'Failed to fetch course by slug' });
    }
  }

  /**
   * GET /api/ead/courses
   * Busca todos os cursos
   */
  async getAllCourses(req: Request, res: Response): Promise<void> {
    try {
      const status = req.query.status as string;
      const courses = await this.service.findAllCourses(status);
      res.json(courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ error: 'Failed to fetch courses' });
    }
  }

  /**
   * PUT /api/ead/courses/:id
   * Atualiza curso
   */
  async updateCourse(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const idValue = Array.isArray(id) ? id[0] : id;
      const course = await this.service.updateCourse(idValue, req.body);
      res.json(course);
    } catch (error) {
      console.error('Error updating course:', error);
      res.status(500).json({ error: 'Failed to update course' });
    }
  }

  /**
   * DELETE /api/ead/courses/:id
   * Deleta curso
   */
  async deleteCourse(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const idValue = Array.isArray(id) ? id[0] : id;
      await this.service.deleteCourse(idValue);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting course:', error);
      res.status(500).json({ error: 'Failed to delete course' });
    }
  }

  /**
   * POST /api/ead/courses/:id/publish
   * Publica curso
   */
  async publishCourse(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const idValue = Array.isArray(id) ? id[0] : id;
      const course = await this.service.publishCourse(idValue);
      res.json(course);
    } catch (error) {
      console.error('Error publishing course:', error);
      res.status(500).json({ error: 'Failed to publish course' });
    }
  }

  /**
   * POST /api/ead/courses/:id/archive
   * Arquiva curso
   */
  async archiveCourse(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const idValue = Array.isArray(id) ? id[0] : id;
      const course = await this.service.archiveCourse(idValue);
      res.json(course);
    } catch (error) {
      console.error('Error archiving course:', error);
      res.status(500).json({ error: 'Failed to archive course' });
    }
  }

  /**
   * POST /api/ead/courses/:id/unarchive
   * Desarquiva curso
   */
  async unarchiveCourse(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const idValue = Array.isArray(id) ? id[0] : id;
      const course = await this.service.unarchiveCourse(idValue);
      res.json(course);
    } catch (error) {
      console.error('Error unarchiving course:', error);
      res.status(500).json({ error: 'Failed to unarchive course' });
    }
  }

  /**
   * POST /api/ead/enrollments
   * Matricula aluno em curso
   */
  async enrollStudent(req: Request, res: Response): Promise<void> {
    try {
      const enrollment = await this.service.enrollStudent(req.body);
      res.json(enrollment);
    } catch (error) {
      console.error('Error enrolling student:', error);
      res.status(500).json({ error: 'Failed to enroll student' });
    }
  }

  /**
   * GET /api/ead/enrollments/course/:courseId
   * Busca matrículas por curso
   */
  async getEnrollmentsByCourseId(req: Request, res: Response): Promise<void> {
    try {
      const { courseId } = req.params;
      const courseIdValue = Array.isArray(courseId) ? courseId[0] : courseId;
      const enrollments = await this.service.findEnrollmentsByCourseId(courseIdValue);
      res.json(enrollments);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      res.status(500).json({ error: 'Failed to fetch enrollments' });
    }
  }

  /**
   * GET /api/ead/enrollments/student/:studentId
   * Busca matrículas por aluno
   */
  async getEnrollmentsByStudentId(req: Request, res: Response): Promise<void> {
    try {
      const { studentId } = req.params;
      const studentIdValue = Array.isArray(studentId) ? studentId[0] : studentId;
      const enrollments = await this.service.findEnrollmentsByStudentId(studentIdValue);
      res.json(enrollments);
    } catch (error) {
      console.error('Error fetching student enrollments:', error);
      res.status(500).json({ error: 'Failed to fetch student enrollments' });
    }
  }

  /**
   * PUT /api/ead/enrollments/:id/progress
   * Atualiza progresso de matrícula
   */
  async updateEnrollmentProgress(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { progressPercentage } = req.body;
      const idValue = Array.isArray(id) ? id[0] : id;
      const enrollment = await this.service.updateEnrollmentProgress(idValue, progressPercentage);
      res.json(enrollment);
    } catch (error) {
      console.error('Error updating enrollment progress:', error);
      res.status(500).json({ error: 'Failed to update enrollment progress' });
    }
  }

  /**
   * POST /api/ead/enrollments/:id/certificate
   * Emite certificado
   */
  async issueCertificate(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const idValue = Array.isArray(id) ? id[0] : id;
      const enrollment = await this.service.issueCertificate(idValue);
      res.json(enrollment);
    } catch (error) {
      console.error('Error issuing certificate:', error);
      res.status(500).json({ error: 'Failed to issue certificate' });
    }
  }

  /**
   * GET /api/ead/stats
   * Busca estatísticas
   */
  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.service.getStats();
      res.json(stats);
    } catch (error) {
      console.error('Error fetching course stats:', error);
      res.status(500).json({ error: 'Failed to fetch course stats' });
    }
  }
}
