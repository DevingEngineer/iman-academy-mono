import { fetchCourses } from './api'

const STORAGE_KEY = 'iman-course-admin:user-courses:v1'
const COURSES_UPDATED_EVENT = 'iman-course-admin:courses-updated'

export async function syncCoursesFromBackend() {
  if (typeof window === 'undefined') return []
  try {
    const courses = await fetchCourses()
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(courses))
    window.dispatchEvent(new Event(COURSES_UPDATED_EVENT))
    return courses
  } catch (err) {
    throw err
  }
}

export default { syncCoursesFromBackend }
