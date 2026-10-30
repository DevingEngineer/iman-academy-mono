import { http, ensureCsrfCookie } from '../http'
import type { Course, SubModule } from '../types/course-types'
import type { SyllabusTreeDto } from '../types'

export function mapLevelToBackend(level?: Course['level'] | null): number {
  switch (level) {
    case 'intermediate':
      return 1
    case 'advanced':
      return 2
    case 'beginner':
    default:
      return 0
  }
}

export function mapStatusToBackend(status?: Course['status'] | null): number {
  switch (status) {
    case 'published':
      return 1
    case 'archived':
      return 2
    case 'draft':
    default:
      return 0
  }
}

function mapBackendLevel(level: unknown): Course['level'] {
  // Backend uses numeric CourseLevel; map to frontend strings.
  if (typeof level === 'number') {
    switch (level) {
      case 1:
        return 'intermediate'
      case 2:
        return 'advanced'
      default:
        return 'beginner'
    }
  }
  return 'beginner'
}

function mapBackendStatus(status: unknown): Course['status'] {
  if (typeof status === 'number') {
    switch (status) {
      case 1:
        return 'published'
      case 2:
        return 'archived'
      default:
        return 'draft'
    }
  }
  if (status === 'published' || status === 'archived' || status === 'draft') {
    return status
  }
  return 'draft'
}

export function mapBackendCourse(dto: any): Course {
  return {
    id: String(dto.id),
    title: String(dto.title ?? ''),
    slug: String(dto.slug ?? dto.id ?? ''),
    description: dto.description ?? '',
    thumbnailUrl: dto.thumbnailUrl ?? undefined,
    instructorIds: Array.isArray(dto.instructorIds) ? dto.instructorIds : [],
    tags: Array.isArray(dto.tags) ? dto.tags : [],
    level: mapBackendLevel(dto.level),
    language: dto.language ?? 'ru',
    price: typeof dto.price === 'number' ? dto.price : Number(dto.price ?? 0) || 0,
    currency: dto.currency ?? 'KGS',
    status: mapBackendStatus(dto.status),
    createdAt: dto.createdAt ?? new Date().toISOString(),
    updatedAt: dto.updatedAt ?? new Date().toISOString(),
    modules: [],
  }
}

export async function fetchCourses(): Promise<Course[]> {
  const { data } = await http.get<any[]>('/api/courses')
  return (data ?? []).map(mapBackendCourse)
}

export async function fetchCourseById(id: string): Promise<Course> {
  const { data } = await http.get<any>(`/api/courses/${id}`)
  return mapBackendCourse(data)
}

export async function createCourseApi(payload: Partial<Course>): Promise<Course> {
  await ensureCsrfCookie()
  const { data } = await http.post<any>('/api/courses', {
    ...payload,
    level: mapLevelToBackend(payload.level),
    status: mapStatusToBackend(payload.status),
  })
  return mapBackendCourse(data)
}

export async function updateCourseApi(id: string, payload: Partial<Course>): Promise<Course> {
  await ensureCsrfCookie()
  const { data } = await http.put<any>(`/api/courses/${id}`, {
    ...payload,
    level: mapLevelToBackend(payload.level),
    status: mapStatusToBackend(payload.status),
  })
  return mapBackendCourse(data)
}

export async function deleteCourseApi(id: string): Promise<void> {
  await ensureCsrfCookie()
  await http.delete(`/api/courses/${id}`)
}

export async function enrollStudentsApi(courseId: string, studentIds: string[]): Promise<void> {
  await ensureCsrfCookie()
  await http.post('/api/admin/enrollments/enroll', { courseId, studentIds })
}

export async function approveEnrollmentApi(enrollmentId: string): Promise<void> {
  await ensureCsrfCookie()
  await http.post(`/api/admin/enrollments/${enrollmentId}/approve`)
}

export type AdminEnrollment = {
  id: string
  studentId: string
  studentName: string
  studentEmail: string
  courseId: string
  courseTitle: string
  status: string | number
  enrolledAt: string | null
}

function firstString(...values: unknown[]): string {
  return values.find((value): value is string => typeof value === 'string' && value.length > 0) ?? ''
}

function normalizeAdminEnrollment(value: unknown): AdminEnrollment | null {
  if (!value || typeof value !== 'object') return null

  const item = value as Record<string, unknown>
  const course = item.course && typeof item.course === 'object'
    ? item.course as Record<string, unknown>
    : {}
  const student = item.student && typeof item.student === 'object'
    ? item.student as Record<string, unknown>
    : {}
  const id = firstString(item.enrollmentId, item.id)

  if (!id) return null

  return {
    id,
    studentId: firstString(item.studentId, student.id, student.userId),
    studentName: firstString(item.studentName, student.fullName, student.userName, student.name),
    studentEmail: firstString(item.studentEmail, student.email),
    courseId: firstString(item.courseId, course.id),
    courseTitle: firstString(item.courseTitle, course.title),
    status: typeof item.status === 'number' || typeof item.status === 'string' ? item.status : 'Unknown',
    enrolledAt: typeof item.enrolledAt === 'string' ? item.enrolledAt : null,
  }
}

export async function fetchAdminEnrollmentsApi(): Promise<AdminEnrollment[]> {
  const { data } = await http.get<unknown>('/api/admin/enrollments')
  const items = Array.isArray(data)
    ? data
    : data && typeof data === 'object' && Array.isArray((data as { items?: unknown }).items)
      ? (data as { items: unknown[] }).items
      : []

  return items.map(normalizeAdminEnrollment).filter((item): item is AdminEnrollment => item !== null)
}

export async function fetchCourseSyllabusApi(courseId: string): Promise<SyllabusTreeDto> {
  const { data } = await http.get<SyllabusTreeDto>(`/api/courses/syllabus/${courseId}`)
  return data
}

export async function syncCourseSyllabusApi(
  courseId: string,
  payload: SyllabusTreeDto,
): Promise<SyllabusTreeDto> {
  await ensureCsrfCookie()
  const { data } = await http.put<SyllabusTreeDto>(`/api/courses/syllabus/${courseId}/sync`, payload)
  return data
}

export async function fetchSubModuleSyncApi(subModuleId: string): Promise<SubModule | null> {
  const { data } = await http.get<SubModule | null>(`/api/submodules-sync/${subModuleId}`)
  return data ?? null
}

export async function syncSubModuleApi(payload: SubModule): Promise<SubModule> {
  await ensureCsrfCookie()
  const { data } = await http.put<SubModule>('/api/submodules-sync/sync', payload)
  return data
}

export default {
  fetchCourses,
  fetchCourseById,
  createCourseApi,
  updateCourseApi,
  deleteCourseApi,
  enrollStudentsApi,
  approveEnrollmentApi,
  fetchAdminEnrollmentsApi,
  fetchCourseSyllabusApi,
  syncCourseSyllabusApi,
  fetchSubModuleSyncApi,
  syncSubModuleApi,
}
