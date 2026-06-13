/**
 * Course Repository
 * 
 * Repository para operações de database relacionadas a cursos EAD.
 */

import { BaseRepository, BaseEntity } from '../../../shared/infrastructure/repository/base.repository';

export interface Course extends BaseEntity {
  title: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  instructor_id: string;
  instructor_name: string;
  category?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration_hours?: number;
  language?: string;
  price?: number;
  is_free: boolean;
  status: 'draft' | 'published' | 'archived';
  published_at?: Date;
  enrollment_count: number;
  rating?: number;
  rating_count: number;
  requirements?: string[];
  learning_objectives?: string[];
}

export class CourseRepository extends BaseRepository<Course> {
  constructor() {
    super('courses', 'ead');
  }

  /**
   * Busca cursos publicados
   */
  async findPublished(): Promise<Course[]> {
    return this.findAll({
      filters: { status: 'published' },
    });
  }

  /**
   * Busca cursos por status
   */
  async findByStatus(status: string): Promise<Course[]> {
    return this.findAll({
      filters: { status },
    });
  }

  /**
   * Busca por slug
   */
  async findBySlug(slug: string): Promise<Course[]> {
    return this.findAll({
      filters: { slug },
    });
  }

  /**
   * Busca por instrutor
   */
  async findByInstructor(instructorId: string): Promise<Course[]> {
    return this.findAll({
      filters: { instructor_id: instructorId },
    });
  }

  /**
   * Busca por categoria
   */
  async findByCategory(category: string): Promise<Course[]> {
    return this.findAll({
      filters: { category },
    });
  }

  /**
   * Busca por nível
   */
  async findByLevel(level: string): Promise<Course[]> {
    return this.findAll({
      filters: { level },
    });
  }

  /**
   * Busca cursos gratuitos
   */
  async findFree(): Promise<Course[]> {
    return this.findAll({
      filters: { is_free: true },
    });
  }

  /**
   * Publica curso
   */
  async publish(id: string): Promise<Course> {
    return this.update(id, {
      status: 'published',
      published_at: new Date(),
    });
  }

  /**
   * Arquiva curso
   */
  async archive(id: string): Promise<Course> {
    return this.update(id, { status: 'archived' });
  }

  /**
   * Desarquiva curso
   */
  async unarchive(id: string): Promise<Course> {
    return this.update(id, { status: 'draft' });
  }

  /**
   * Incrementa contador de matrículas
   */
  async incrementEnrollmentCount(id: string): Promise<Course> {
    const course = await this.findById(id);
    if (!course) {
      throw new Error('Course not found');
    }
    return this.update(id, {
      enrollment_count: course.enrollment_count + 1,
    });
  }

  /**
   * Atualiza rating
   */
  async updateRating(id: string, newRating: number): Promise<Course> {
    const course = await this.findById(id);
    if (!course) {
      throw new Error('Course not found');
    }
    
    const ratingCount = course.rating_count || 0;
    const currentRating = course.rating || 0;
    const totalRating = currentRating * ratingCount;
    const newRatingCount = ratingCount + 1;
    const averageRating = (totalRating + newRating) / newRatingCount;

    return this.update(id, {
      rating: averageRating,
      rating_count: newRatingCount,
    });
  }

  /**
   * Busca estatísticas
   */
  async getStats(): Promise<{
    total_courses: number;
    published_courses: number;
    draft_courses: number;
    total_enrollments: number;
    average_rating: number;
  }> {
    const [allCourses, publishedCourses, draftCourses] = await Promise.all([
      this.findAll(),
      this.findPublished(),
      this.findByStatus('draft'),
    ]);

    const totalEnrollments = allCourses.reduce((sum, course) => sum + course.enrollment_count, 0);
    
    const ratedCourses = allCourses.filter(c => c.rating !== undefined && c.rating > 0);
    const averageRating = ratedCourses.length > 0
      ? ratedCourses.reduce((sum, course) => sum + (course.rating || 0), 0) / ratedCourses.length
      : 0;

    return {
      total_courses: allCourses.length,
      published_courses: publishedCourses.length,
      draft_courses: draftCourses.length,
      total_enrollments: totalEnrollments,
      average_rating,
    };
  }
}

export interface CourseEnrollment extends BaseEntity {
  course_id: string;
  student_id: string;
  student_name: string;
  enrolled_at: Date;
  completed_at?: Date;
  progress_percentage: number;
  last_accessed_at?: Date;
  certificate_issued: boolean;
  certificate_issued_at?: Date;
}

export class CourseEnrollmentRepository extends BaseRepository<CourseEnrollment> {
  constructor() {
    super('course_enrollments', 'ead');
  }

  /**
   * Busca matrículas por curso
   */
  async findByCourseId(courseId: string): Promise<CourseEnrollment[]> {
    return this.findAll({
      filters: { course_id: courseId },
    });
  }

  /**
   * Busca matrículas por aluno
   */
  async findByStudentId(studentId: string): Promise<CourseEnrollment[]> {
    return this.findAll({
      filters: { student_id: studentId },
    });
  }

  /**
   * Busca matrícula por curso e aluno
   */
  async findByCourseAndStudent(courseId: string, studentId: string): Promise<CourseEnrollment[]> {
    return this.findAll({
      filters: { course_id: courseId, student_id: studentId },
    });
  }

  /**
   * Atualiza progresso
   */
  async updateProgress(id: string, progressPercentage: number): Promise<CourseEnrollment> {
    const enrollment = await this.findById(id);
    if (!enrollment) {
      throw new Error('Enrollment not found');
    }

    const updateData: any = {
      progress_percentage: progressPercentage,
      last_accessed_at: new Date(),
    };

    // Se o progresso for 100%, marca como completado
    if (progressPercentage >= 100 && !enrollment.completed_at) {
      updateData.completed_at = new Date();
    }

    return this.update(id, updateData);
  }

  /**
   * Emite certificado
   */
  async issueCertificate(id: string): Promise<CourseEnrollment> {
    const enrollment = await this.findById(id);
    if (!enrollment) {
      throw new Error('Enrollment not found');
    }

    if (enrollment.progress_percentage < 100) {
      throw new Error('Course not completed yet');
    }

    return this.update(id, {
      certificate_issued: true,
      certificate_issued_at: new Date(),
    });
  }
}
