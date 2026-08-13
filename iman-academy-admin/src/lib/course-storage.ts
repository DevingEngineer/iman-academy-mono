import type { Course } from '../types/course-types'
import { TEMPORARY_COURSES } from '../consts/courses'
import { fetchCourses, createCourseApi, updateCourseApi, deleteCourseApi } from './api'

const STORAGE_KEY = 'iman-course-admin:user-courses:v1'
const COURSES_UPDATED_EVENT = 'iman-course-admin:courses-updated'
let cachedStoredCourses = '[]'
let cachedCourses: Course[] = TEMPORARY_COURSES
let hasSyncedWithBackend = false

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

	// Kick off a background sync from backend once per session to keep local data fresh.
	if (typeof window !== 'undefined' && !hasSyncedWithBackend) {
		hasSyncedWithBackend = true
		fetchCourses()
			.then((remote) => {
				window.localStorage.setItem(STORAGE_KEY, JSON.stringify(remote))
				window.dispatchEvent(new Event(COURSES_UPDATED_EVENT))
			})
			.catch(() => {
				// ignore network errors — keep working offline
			})
	}
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

	const existingSlugs = new Set(courses.map((course) => course.slug))
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
	// Optimistic local creation: insert a temporary course and fire update, then call backend.
	const courses = getCourses()
	const slug = createCourseSlug(title, courses)
	const tempId = `temp-course-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
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

	// Fire-and-forget create on backend; when it returns, replace temp entry with canonical one.
	createCourseApi({
		title: course.title,
		slug: course.slug,
		description: course.description,
		// backend expects numeric level/status; send null and let server default if mapping unknown
		level: null,
		language: course.language,
		price: course.price,
		currency: course.currency,
		status: null,
		tags: course.tags,
	})
		.then((created) => {
			const current = getStoredCourses()
			const temp = current.find((c) => c.id === tempId)
			// Merge locally-added content (modules, tags, description) into backend-created course
			const merged = {
				...created,
				modules: temp?.modules ?? created.modules ?? [],
				description: temp?.description ?? created.description,
				tags: temp?.tags ?? created.tags ?? [],
				updatedAt: temp?.updatedAt ?? created.updatedAt,
			}

			const replaced = current.map((c) => (c.id === tempId ? merged : c))
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(replaced))
			window.dispatchEvent(new Event(COURSES_UPDATED_EVENT))

			// Persist merged data to backend (modules/content) immediately
			updateCourseApi(String(created.id), merged as Partial<Course>).catch((err) => {
				console.error('Failed to persist merged course to backend', err)
			})
		})
		.catch((err) => {
			console.error('Failed creating course on backend', err)
		})

	return course
}

export const updateCourse = (course: Course) => {
	// Optimistic local update; then push to backend.
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

	// If ID looks like a backend UUID, try to update backend. Temp IDs won't be sent.
	if (!course.id.startsWith('temp-')) {
		updateCourseApi(course.id, course as Partial<Course>)
			.catch((err) => console.error('Failed to update course on backend', err))
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
