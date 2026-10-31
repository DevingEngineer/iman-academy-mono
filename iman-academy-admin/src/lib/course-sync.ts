import { fetchCourses } from './api'
import { notifyCoursesUpdated } from './course-storage'

export async function syncCoursesFromBackend() {
  const courses = await fetchCourses()
  notifyCoursesUpdated()
  return courses
}

export default { syncCoursesFromBackend }
