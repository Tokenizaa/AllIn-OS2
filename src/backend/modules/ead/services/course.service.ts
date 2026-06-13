/**
 * Course Service
 * 
 * Service para gerenciar cursos EAD.
 */

import { CourseRepository, CourseEnrollmentRepository } from '../repositories/course.repository';
import {
  Course,
  CreateCourseDTO,
  UpdateCourseDTO,
  CourseResponseDTO,
  CourseEnrollment,
  CreateEnrollmentDTO,
  CourseStats,
} from '../dto/course.dto';

export class CourseService {
  private courseRepository: CourseRepository;
  private enrollmentRepository: CourseEnrollmentRepository;

  constructor() {
    this.courseRepository = new CourseRepository();
    this.enrollmentRepository = new CourseEnrollmentRepository();
  }

  /**
   * Cria novo curso
   */
  async createCourse(dto: CreateCourseDTO): Promise<Course> {
    // Verifica se o slug já existe
    const existingBySlug = await this.courseRepository.findBySlug(dto.slug);
    if (existingBySlug.length > 0) {
      throw new Error('Slug already in use');
    }

    return this.courseRepository.create({
      ...dto,
      level: dto.level ?? 'beginner',
      is_free: dto.is_free ?? false,
      status: dto.status ?? 'draft',
      enrollment_count: 0,
      rating_count: 0,
    });
  }

  /**
   * Busca curso por ID
   */
  async findCourseById(id: string): Promise<Course | null> {
    return this.courseRepository.findById(id);
  }

  /**
   * Busca curso por slug
   */
  async findCourseBySlug(slug: string): Promise<Course | null> {
    const courses = await this.courseRepository.findBySlug(slug);
    return courses[0] || null;
  }

  /**
   * Busca todos os cursos
   */
  async findAllCourses(status?: string): Promise<Course[]> {
    if (status) {
      return this.courseRepository.findByStatus(status);
    }
    return this.courseRepository.findAll();
  }

  /**
   * Atualiza curso
   */
  async updateCourse(id: string, dto: UpdateCourseDTO): Promise<Course> {
    const existing = await this.courseRepository.findById(id);
    if (!existing) {
      throw new Error('Course not found');
    }

    // Verifica se o novo slug já existe (se estiver sendo alterado)
    if (dto.slug && dto.slug !== existing.slug) {
      const existingBySlug = await this.courseRepository.findBySlug(dto.slug);
      if (existingBySlug.length > 0) {
        throw new Error('Slug already in use');
      }
    }

    return this.courseRepository.update(id, dto);
  }

  /**
   * Deleta curso
   */
  async deleteCourse(id: string): Promise<void> {
    const existing = await this.courseRepository.findById(id);
    if (!existing) {
      throw new Error('Course not found');
    }

    await this.courseRepository.delete(id);
  }

  /**
   * Publica curso
   */
  async publishCourse(id: string): Promise<Course> {
    return this.courseRepository.publish(id);
  }

  /**
   * Arquiva curso
   */
  async archiveCourse(id: string): Promise<Course> {
    return this.courseRepository.archive(id);
  }

  /**
   * Desarquiva curso
   */
  async unarchiveCourse(id: string): Promise<Course> {
    return this.courseRepository.unarchive(id);
  }

  /**
   * Matricula aluno em curso
   */
  async enrollStudent(dto: CreateEnrollmentDTO): Promise<CourseEnrollment> {
    // Verifica se o aluno já está matriculado
    const existing = await this.enrollmentRepository.findByCourseAndStudent(
      dto.course_id,
      dto.student_id
    );
    if (existing.length > 0) {
      throw new Error('Student already enrolled in this course');
    }

    // Cria matrícula
    const enrollment = await this.enrollmentRepository.create({
      ...dto,
      enrolled_at: new Date(),
      progress_percentage: 0,
      certificate_issued: false,
    });

    // Incrementa contador de matrículas do curso
    await this.courseRepository.incrementEnrollmentCount(dto.course_id);

    return enrollment;
  }

  /**
   * Busca matrículas por curso
   */
  async findEnrollmentsByCourseId(courseId: string): Promise<CourseEnrollment[]> {
    return this.enrollmentRepository.findByCourseId(courseId);
  }

  /**
   * Busca matrículas por aluno
   */
  async findEnrollmentsByStudentId(studentId: string): Promise<CourseEnrollment[]> {
    return this.enrollmentRepository.findByStudentId(studentId);
  }

  /**
   * Atualiza progresso de matrícula
   */
  async updateEnrollmentProgress(id: string, progressPercentage: number): Promise<CourseEnrollment> {
    return this.enrollmentRepository.updateProgress(id, progressPercentage);
  }

  /**
   * Emite certificado
   */
  async issueCertificate(id: string): Promise<CourseEnrollment> {
    return this.enrollmentRepository.issueCertificate(id);
  }

  /**
   * Busca estatísticas
   */
  async getStats(): Promise<CourseStats> {
    const stats = await this.courseRepository.getStats();
    return {
      ...stats,
      active_students: stats.total_enrollments, // Simplificação
    };
  }

  /**
   * Converte para DTO de resposta
   */
  toCourseResponseDTO(course: Course): CourseResponseDTO {
    return {
      id: course.id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      thumbnail: course.thumbnail,
      instructor_id: course.instructor_id,
      instructor_name: course.instructor_name,
      category: course.category,
      level: course.level,
      duration_hours: course.duration_hours,
      language: course.language,
      price: course.price,
      is_free: course.is_free,
      status: course.status,
      published_at: course.published_at,
      enrollment_count: course.enrollment_count,
      rating: course.rating,
      rating_count: course.rating_count,
      requirements: course.requirements,
      learning_objectives: course.learning_objectives,
      created_at: course.created_at,
      updated_at: course.updated_at,
    };
  }
}
