/**
 * Course DTOs
 * 
 * DTOs para operações com cursos EAD.
 */

export interface Course {
  id: string;
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
  created_at: Date;
  updated_at: Date;
}

export interface CreateCourseDTO {
  title: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  instructor_id: string;
  instructor_name: string;
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  duration_hours?: number;
  language?: string;
  price?: number;
  is_free?: boolean;
  status?: 'draft' | 'published' | 'archived';
  requirements?: string[];
  learning_objectives?: string[];
}

export interface UpdateCourseDTO {
  title?: string;
  slug?: string;
  description?: string;
  thumbnail?: string;
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  duration_hours?: number;
  language?: string;
  price?: number;
  is_free?: boolean;
  status?: 'draft' | 'published' | 'archived';
  requirements?: string[];
  learning_objectives?: string[];
}

export interface CourseResponseDTO {
  id: string;
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
  created_at: Date;
  updated_at: Date;
}

export interface CourseEnrollment {
  id: string;
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

export interface CreateEnrollmentDTO {
  course_id: string;
  student_id: string;
  student_name: string;
}

export interface CourseStats {
  total_courses: number;
  published_courses: number;
  draft_courses: number;
  total_enrollments: number;
  active_students: number;
  average_rating: number;
}
