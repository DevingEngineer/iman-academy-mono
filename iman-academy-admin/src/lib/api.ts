import { http, ensureCsrfCookie } from '../http'
import type { Course } from '../types/course-types'
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
  return 'draft'
}

export async function fetchCourses(): Promise<Course[]> {
  const { data } = await http.get<any[]>('/api/courses')
  return (data ?? []).map((dto) => ({
    id: String(dto.id),
    title: String(dto.title ?? ''),
    slug: String(dto.slug ?? dto.id ?? ''),
    description: dto.description ?? '',
    thumbnailUrl: dto.thumbnailUrl ?? undefined,
    instructorIds: [],
    tags: Array.isArray(dto.tags) ? dto.tags : [],
    level: mapBackendLevel(dto.level),
    language: dto.language ?? 'en',
    price: typeof dto.price === 'number' ? dto.price : Number(dto.price ?? 0) || 0,
    currency: dto.currency ?? 'USD',
    status: mapBackendStatus(dto.status),
    createdAt: dto.createdAt ?? new Date().toISOString(),
    updatedAt: dto.updatedAt ?? new Date().toISOString(),
    modules: [],
  }))
}

export async function createCourseApi(payload: Partial<Course>): Promise<Course> {
  await ensureCsrfCookie()
  const { data } = await http.post<Course>('/api/courses', {
    ...payload,
    level: mapLevelToBackend(payload.level),
    status: mapStatusToBackend(payload.status),
  })
  return data
}

export async function updateCourseApi(id: string, payload: Partial<Course>): Promise<Course> {
  await ensureCsrfCookie()
  const { data } = await http.put<Course>(`/api/courses/${id}`, {
    ...payload,
    level: mapLevelToBackend(payload.level),
    status: mapStatusToBackend(payload.status),
  })
  return data
}

export async function deleteCourseApi(id: string): Promise<void> {
  await ensureCsrfCookie()
  await http.delete(`/api/courses/${id}`)
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

export default {
  fetchCourses,
  createCourseApi,
  updateCourseApi,
  deleteCourseApi,
  fetchCourseSyllabusApi,
  syncCourseSyllabusApi,
}
