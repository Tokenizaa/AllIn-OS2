/**
 * EAD Module Index
 * 
 * Exporta todos os componentes do módulo EAD.
 */

export { CourseRepository, CourseEnrollmentRepository } from './repositories/course.repository';

export { CourseModuleRepository, LessonRepository, LessonProgressRepository } from './repositories/module.repository';

export { CourseService } from './services/course.service';

export { ModuleService } from './services/module.service';

export type {
  Course,
  CreateCourseDTO,
  UpdateCourseDTO,
  CourseResponseDTO,
  CourseEnrollment,
  CreateEnrollmentDTO,
  CourseStats,
} from './dto/course.dto';

export type {
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
} from './dto/module.dto';
