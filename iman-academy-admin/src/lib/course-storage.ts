import type { Course } from '../types/course-types'
import { TEMPORARY_COURSES } from '../consts/courses'

const STORAGE_KEY = 'iman-course-admin:user-courses:v1'
const COURSES_UPDATED_EVENT = 'iman-course-admin:courses-updated'
let cachedStoredCourses = '[]'
let cachedCourses: Course[] = TEMPORARY_COURSES

const isCourse = (value: unknown): value is Course => {
	if (!value || typeof value !== 'object') return false

	const course = value as Partial<Course>
	return (
		typeof course.id === 'string' &&
		Array.isArray(course.modules) &&
		!!course.metadata &&
		typeof course.metadata.title === 'string' &&
		typeof course.metadata.slug === 'string'
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
	return cachedCourses
}

export const createCourseSlug = (title: string, courses: Course[]) => {
	const baseSlug =
		title
			.trim()
			.toLocaleLowerCase()
			.normalize('NFKD')
			.replace(/[^\p{Letter}\p{Number}]+/gu, '-')
			.replace(/^-+|-+$/g, '') || 'course'

	const existingSlugs = new Set(courses.map((course) => course.metadata.slug))
	let slug = baseSlug
	let suffix = 2

	while (existingSlugs.has(slug)) {
		slug = `${baseSlug}-${suffix}`
		suffix += 1
	}

	return slug
}

export const saveCourse = (title: string): Course => {
	const now = new Date().toISOString()
	const courses = getCourses()
	const slug = createCourseSlug(title, courses)
	const course: Course = {
		id: `course-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
		metadata: {
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
		},
		modules: [],
	}

	const storedCourses = [...getStoredCourses(), course]
	window.localStorage.setItem(STORAGE_KEY, JSON.stringify(storedCourses))
	window.dispatchEvent(new Event(COURSES_UPDATED_EVENT))

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
