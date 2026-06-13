/**
 * Module DTOs
 * 
 * DTOs para operações com módulos de conteúdo de cursos EAD.
 */

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  order: number;
  duration_minutes?: number;
  is_published: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateModuleDTO {
  course_id: string;
  title: string;
  description?: string;
  order?: number;
  duration_minutes?: number;
  is_published?: boolean;
}

export interface UpdateModuleDTO {
  title?: string;
  description?: string;
  order?: number;
  duration_minutes?: number;
  is_published?: boolean;
}

export interface ModuleResponseDTO {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  order: number;
  duration_minutes?: number;
  is_published: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Lesson {
  id: string;
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
  created_at: Date;
  updated_at: Date;
}

export interface CreateLessonDTO {
  module_id: string;
  title: string;
  description?: string;
  content?: string;
  video_url?: string;
  video_duration?: number;
  type?: 'video' | 'text' | 'quiz' | 'assignment';
  order?: number;
  is_published?: boolean;
  is_free?: boolean;
}

export interface UpdateLessonDTO {
  title?: string;
  description?: string;
  content?: string;
  video_url?: string;
  video_duration?: number;
  type?: 'video' | 'text' | 'quiz' | 'assignment';
  order?: number;
  is_published?: boolean;
  is_free?: boolean;
}

export interface LessonResponseDTO {
  id: string;
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
  created_at: Date;
  updated_at: Date;
}

export interface LessonProgress {
  id: string;
  lesson_id: string;
  student_id: string;
  completed: boolean;
  completed_at?: Date;
  time_spent_seconds: number;
  last_accessed_at?: Date;
}

export interface CreateLessonProgressDTO {
  lesson_id: string;
  student_id: string;
  time_spent_seconds?: number;
}

export interface UpdateLessonProgressDTO {
  completed?: boolean;
  time_spent_seconds?: number;
}
