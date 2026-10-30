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

export type CreateCourseInput = {
	title: string
	slug?: string
	description?: string
	thumbnailUrl?: string
	instructorIds?: string[]
	tags?: string[]
	level?: Course['level']
	language?: string
	price?: number
	currency?: string
	status?: Course['status']
}

export const slugify = (text: string): string => {
	const ruMap: Record<string, string> = {
		а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh',
		з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o',
		п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'kh', ц: 'ts',
		ч: 'ch', ш: 'sh', щ: 'shch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
		ә: 'a', ғ: 'g', қ: 'q', ң: 'n', ө: 'o', ұ: 'u', ү: 'u', һ: 'h', і: 'i',
	}

	const transliterated = text
		.toLowerCase()
		.split('')
		.map((char) => ruMap[char] ?? char)
		.join('')

	return transliterated
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '') || `course-${Date.now().toString(36)}`
}

export const createCourseSlug = (title: string, courses: Course[]): string => {
	const base = slugify(title)
	const existingSlugs = new Set(courses.map((course) => course.slug.toLowerCase()))
	let slug = base
	let suffix = 2

	while (existingSlugs.has(slug.toLowerCase())) {
		slug = `${base}-${suffix}`
		suffix += 1
	}

	return slug
}

export const getCourseById = (idOrSlug: string): Course | undefined => {
	const clean = decodeURIComponent(idOrSlug)
	return getCourses().find((c) => c.id === clean || c.slug === clean)
}

export const createCourseAsync = async (input: string | CreateCourseInput): Promise<Course> => {
	const now = new Date().toISOString()
	const courses = getCourses()
	const data: CreateCourseInput = typeof input === 'string' ? { title: input } : input
	const title = data.title.trim()
	const rawSlug = data.slug?.trim() ? slugify(data.slug) : createCourseSlug(title, courses)
	const slug = rawSlug || createCourseSlug(title, courses)

	const payload: Partial<Course> = {
		title,
		slug,
		description: data.description?.trim() ?? '',
		thumbnailUrl: data.thumbnailUrl?.trim() || undefined,
		instructorIds: data.instructorIds ?? [],
		tags: data.tags ?? [],
		level: data.level ?? 'beginner',
		language: data.language ?? 'ru',
		price: typeof data.price === 'number' ? data.price : Number(data.price ?? 0) || 0,
		currency: data.currency ?? 'KGS',
		status: data.status ?? 'draft',
	}

	try {
		const created = await createCourseApi(payload)
		const currentStored = getStoredCourses()
		const updatedStored = [...currentStored.filter((c) => c.id !== created.id), created]
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStored))
		cachedStoredCourses = ''
		window.dispatchEvent(new Event(COURSES_UPDATED_EVENT))
		return created
	} catch (err) {
		console.warn('Backend course creation failed, using local storage fallback', err)
		const tempId = `temp-course-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
		const fallbackCourse: Course = {
			id: tempId,
			title: payload.title!,
			slug: payload.slug!,
			description: payload.description ?? '',
			thumbnailUrl: payload.thumbnailUrl,
			instructorIds: payload.instructorIds ?? [],
			tags: payload.tags ?? [],
			level: payload.level ?? 'beginner',
			language: payload.language ?? 'ru',
			price: payload.price ?? 0,
			currency: payload.currency ?? 'KGS',
			status: payload.status ?? 'draft',
			createdAt: now,
			updatedAt: now,
			modules: [],
		}

		const currentStored = getStoredCourses()
		const updatedStored = [...currentStored, fallbackCourse]
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStored))
		cachedStoredCourses = ''
		window.dispatchEvent(new Event(COURSES_UPDATED_EVENT))
		return fallbackCourse
	}
}

export const saveCourse = (titleOrInput: string | CreateCourseInput): Course => {
	const now = new Date().toISOString()
	const courses = getCourses()
	const data: CreateCourseInput = typeof titleOrInput === 'string' ? { title: titleOrInput } : titleOrInput
	const title = data.title.trim()
	const tempId = `temp-course-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
	const slug = data.slug?.trim() ? slugify(data.slug) : createCourseSlug(title, courses)
	const course: Course = {
		id: tempId,
		title,
		slug,
		description: data.description?.trim() ?? '',
		thumbnailUrl: data.thumbnailUrl?.trim() || undefined,
		instructorIds: data.instructorIds ?? [],
		tags: data.tags ?? [],
		level: data.level ?? 'beginner',
		language: data.language ?? 'ru',
		price: typeof data.price === 'number' ? data.price : Number(data.price ?? 0) || 0,
		currency: data.currency ?? 'KGS',
		status: data.status ?? 'draft',
		createdAt: now,
		updatedAt: now,
		modules: [],
	}

	const storedCourses = [...getStoredCourses(), course]
	window.localStorage.setItem(STORAGE_KEY, JSON.stringify(storedCourses))
	cachedStoredCourses = ''
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
		thumbnailUrl: course.thumbnailUrl,
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
			const temp = current.find((c) => c.id === tempId)
			const replaced = current.map((c) => (c.id === tempId ? backendCourse : c))
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(replaced))
			cachedStoredCourses = ''
			window.dispatchEvent(new Event(COURSES_UPDATED_EVENT))

			if (temp && Array.isArray(temp.modules) && temp.modules.length > 0) {
				const tree = mapCourseToSyllabusTree({ ...backendCourse, modules: temp.modules })
				syncCourseSyllabusApi(String(created.id), tree)
					.then(async () => {
						try {
							const syllabus = await fetchCourseSyllabusApi(String(created.id))
							const refreshed = {
								...backendCourse,
								modules: mapSyllabusTreeToCourseModules(String(created.id), syllabus),
							}
							const finalCourses = getStoredCourses().map((c) => (c.id === tempId ? refreshed : c))
							window.localStorage.setItem(STORAGE_KEY, JSON.stringify(finalCourses))
							cachedStoredCourses = ''
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

export const deleteCourse = async (id: string): Promise<void> => {
	const storedCourses = getStoredCourses().filter((c) => c.id !== id && c.slug !== id)
	window.localStorage.setItem(STORAGE_KEY, JSON.stringify(storedCourses))
	cachedStoredCourses = ''
	cachedCourses = cachedCourses.filter((c) => c.id !== id && c.slug !== id)
	window.dispatchEvent(new Event(COURSES_UPDATED_EVENT))

	const isTemporary = id.startsWith('temp-') ||
		id === 'course-react-basics' ||
		id === 'course-typescript-for-beginners' ||
		id === 'course-ui-ux-design'

	if (!isTemporary) {
		try {
			await deleteCourseApi(id)
		} catch (err) {
			console.error('Failed to delete course on backend', err)
			throw err
		}
	}
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
