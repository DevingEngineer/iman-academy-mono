import type { Course, Module, SubModule } from '../types/course-types'
import { TEMPORARY_COURSES } from '../consts/courses'
import {
  fetchCourses,
  createCourseApi,
  updateCourseApi,
  deleteCourseApi,
  fetchCourseSyllabusApi,
  syncCourseSyllabusApi,
  mapLevelToBackend,
  mapStatusToBackend,
} from './api'
import type { SyllabusTreeDto } from '../types'

const STORAGE_KEY = 'iman-course-admin:user-courses:v1'
const COURSES_UPDATED_EVENT = 'iman-course-admin:courses-updated'
let cachedStoredCourses = '[]'
let cachedCourses: Course[] = TEMPORARY_COURSES
let hasSyncedWithBackend = false

const isPersistedEntityId = (value?: string | null): value is string =>
  !!value && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(value)

const mapSyllabusTreeToCourseModules = (courseId: string, tree: SyllabusTreeDto): Module[] =>
  (tree.modules ?? []).map((module, moduleIndex) => ({
    id: module.moduleId ?? `module-${courseId}-${moduleIndex}`,
    courseId,
    title: module.moduleName ?? `Module ${moduleIndex + 1}`,
    order: Number(module.order ?? 0),
    status: 'draft',
    subModules: (module.subModules ?? []).map((subModule, subModuleIndex) => ({
      id: subModule.subModuleId ?? `submodule-${courseId}-${moduleIndex}-${subModuleIndex}`,
      moduleId: subModule.moduleId ?? `module-${courseId}-${moduleIndex}`,
      title: subModule.subModuleName,
      order: Number(subModule.order ?? 0),
      steps: [],
    })),
  }))

const mapCourseToSyllabusTree = (course: Course): SyllabusTreeDto => ({
  courseId: course.id,
  courseName: course.title,
  modules: course.modules.map((module, moduleIndex) => ({
    moduleId: isPersistedEntityId(module.id) ? module.id : null,
    courseId: course.id,
    moduleName: module.title,
    order: Number(module.order ?? 0),
    subModules: module.subModules.map((subModule, subModuleIndex) => ({
      subModuleId: isPersistedEntityId(subModule.id) ? subModule.id : null,
      moduleId: isPersistedEntityId(subModule.moduleId) ? subModule.moduleId : null,
      subModuleName: subModule.title,
      order: Number(subModule.order ?? 0),
    })),
  })),
})

const hydrateCourseFromBackend = async (course: Course): Promise<Course> => {
  if (!course.id || course.id.startsWith('temp-')) return course

  try {
    const syllabus = await fetchCourseSyllabusApi(course.id)
    return {
      ...course,
      modules: mapSyllabusTreeToCourseModules(course.id, syllabus),
    }
  } catch {
    return course
  }
}

const isCourse = (value: unknown): value is Course => {
	if (!value || typeof value !== 'object') return false

	const course = value as Partial<Course>
	return (
		typeof course.id === 'string' &&
		Array.isArray(course.modules) &&
		!!course &&
		typeof course.title === 'string' &&
		typeof course.slug === 'string'
	)
}

const getStoredCourses = (): Course[] => {
	if (typeof window === 'undefined') return []

	try {
		const storedCourses = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]')
		return Array.isArray(storedCourses) ? storedCourses.filter(isCourse) : []
	} catch {
		return []
	}
}

export const getCourses = (): Course[] => {
	const storedCourses = getStoredCourses()
	const serializedCourses = JSON.stringify(storedCourses)

	if (serializedCourses === cachedStoredCourses) return cachedCourses

	cachedStoredCourses = serializedCourses
	const storedCoursesById = new Map(storedCourses.map((course) => [course.id, course]))
	const temporaryCourseIds = new Set(TEMPORARY_COURSES.map((course) => course.id))
	cachedCourses = [
		...TEMPORARY_COURSES.map((course) => storedCoursesById.get(course.id) ?? course),
		...storedCourses.filter((course) => !temporaryCourseIds.has(course.id)),
	]

	if (typeof window !== 'undefined' && !hasSyncedWithBackend) {
		hasSyncedWithBackend = true
		fetchCourses()
			.then(async (remote) => {
				const hydrated = await Promise.all(
					remote.map(async (course) => hydrateCourseFromBackend(course))
				)
				window.localStorage.setItem(STORAGE_KEY, JSON.stringify(hydrated))
				window.dispatchEvent(new Event(COURSES_UPDATED_EVENT))
			})
			.catch(() => {
				// ignore network errors — keep working offline
			})
	}
	return cachedCourses
}

export const createCourseSlug = (title: string, courses: Course[]) => {
	const tempId = `course-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
	const existingSlugs = new Set(courses.map((course) => course.slug))
	let slug = tempId
	let suffix = 2

	while (existingSlugs.has(slug)) {
		slug = `${tempId}-${suffix}`
		suffix += 1
	}

	return slug
}

export const saveCourse = (title: string): Course => {
	const now = new Date().toISOString()
	const courses = getCourses()
	const tempId = `temp-course-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
	const slug = createCourseSlug(title, courses)
	const course: Course = {
		id: tempId,
		title,
		slug,
		description: '',
		instructorIds: [],
		tags: [],
		level: 'beginner',
		language: 'ru',
		price: 0,
		currency: 'KZT',
		status: 'draft',
		createdAt: now,
		updatedAt: now,
		modules: [],
	}

	const storedCourses = [...getStoredCourses(), course]
	window.localStorage.setItem(STORAGE_KEY, JSON.stringify(storedCourses))
	window.dispatchEvent(new Event(COURSES_UPDATED_EVENT))

	createCourseApi({
		title: course.title,
		slug: course.slug,
		description: course.description,
		level: course.level,
		language: course.language,
		price: course.price,
		currency: course.currency,
		status: course.status,
		tags: course.tags,
	})
		.then(async (created) => {
			const backendCourse: Course = {
				...created,
				modules: [],
				description: created.description ?? '',
				tags: created.tags ?? [],
				level: created.level ?? 'beginner',
				status: created.status ?? 'draft',
			}

			const current = getStoredCourses()
			// Replace temp with backend course but keep a reference to local temp data
			const temp = current.find((c) => c.id === tempId)
			const replaced = current.map((c) => (c.id === tempId ? backendCourse : c))
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(replaced))
			window.dispatchEvent(new Event(COURSES_UPDATED_EVENT))

			// If the user had added modules/submodules/steps locally before creation completed,
			// push that syllabus to the backend immediately so edits aren't lost.
			if (temp && Array.isArray(temp.modules) && temp.modules.length > 0) {
				const tree = mapCourseToSyllabusTree({ ...backendCourse, modules: temp.modules })
				syncCourseSyllabusApi(String(created.id), tree)
					.then(async () => {
						// Fetch refreshed syllabus from backend and store it
						try {
							const syllabus = await fetchCourseSyllabusApi(String(created.id))
							const refreshed = {
								...backendCourse,
								modules: mapSyllabusTreeToCourseModules(String(created.id), syllabus),
							}
							const finalCourses = getStoredCourses().map((c) => (c.id === tempId ? refreshed : c))
							window.localStorage.setItem(STORAGE_KEY, JSON.stringify(finalCourses))
							window.dispatchEvent(new Event(COURSES_UPDATED_EVENT))
						} catch {
							// ignore
						}
					})
					.catch((err) => console.error('Failed to sync syllabus after create', err))
			}
		})
		.catch((err) => {
			console.error('Failed creating course on backend', err)
		})

	return course
}

export const updateCourse = (course: Course) => {
	const storedCourses = getStoredCourses()
	const existingCourseIndex = storedCourses.findIndex((item) => item.id === course.id)
	const updatedCourses = [...storedCourses]

	if (existingCourseIndex === -1) {
		updatedCourses.push(course)
	} else {
		updatedCourses[existingCourseIndex] = course
	}

	window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCourses))
	window.dispatchEvent(new Event(COURSES_UPDATED_EVENT))

	if (!course.id.startsWith('temp-')) {
		updateCourseApi(course.id, {
			...course,
			level: course.level,
			status: course.status,
			tags: course.tags,
		}).catch((err) => console.error('Failed to update course on backend', err))

		syncCourseSyllabusApi(course.id, mapCourseToSyllabusTree(course))
			.catch((err) => console.error('Failed to sync syllabus to backend', err))
	}
}

export const subscribeToCourses = (onStoreChange: () => void) => {
	const handleStorageChange = (event: StorageEvent) => {
		if (event.key === STORAGE_KEY) onStoreChange()
	}

	window.addEventListener('storage', handleStorageChange)
	window.addEventListener(COURSES_UPDATED_EVENT, onStoreChange)

	return () => {
		window.removeEventListener('storage', handleStorageChange)
		window.removeEventListener(COURSES_UPDATED_EVENT, onStoreChange)
	}
}
