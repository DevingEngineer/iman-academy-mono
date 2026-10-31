import type { Course, Module } from '../types/course-types'
import {
	fetchCourses,
	createCourseApi,
	updateCourseApi,
	deleteCourseApi,
	fetchCourseSyllabusApi,
	syncCourseSyllabusApi,
} from './api'
import type { SyllabusTreeDto } from '../types'

const COURSES_UPDATED_EVENT = 'iman-course-admin:courses-updated'

export const notifyCoursesUpdated = () => {
	if (typeof window !== 'undefined') {
		window.dispatchEvent(new Event(COURSES_UPDATED_EVENT))
	}
}

const isPersistedEntityId = (value?: string | null): value is string =>
	!!value &&
	/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(
		value
	)

export const mapSyllabusTreeToCourseModules = (
	courseId: string,
	tree: SyllabusTreeDto
): Module[] =>
	(tree.modules ?? []).map((module, moduleIndex) => ({
		id: module.moduleId ?? `module-${courseId}-${moduleIndex}`,
		courseId,
		title: module.moduleName ?? `Module ${moduleIndex + 1}`,
		order: Number(module.order ?? 0),
		status: 'draft',
		subModules: (module.subModules ?? []).map((subModule, subModuleIndex) => ({
			id:
				subModule.subModuleId ??
				`submodule-${courseId}-${moduleIndex}-${subModuleIndex}`,
			moduleId: subModule.moduleId ?? `module-${courseId}-${moduleIndex}`,
			title: subModule.subModuleName,
			order: Number(subModule.order ?? 0),
			steps: [],
		})),
	}))

export const mapCourseToSyllabusTree = (course: Course): SyllabusTreeDto => ({
	courseId: course.id,
	courseName: course.title,
	modules: (course.modules ?? []).map((module) => ({
		moduleId: isPersistedEntityId(module.id) ? module.id : null,
		courseId: course.id,
		moduleName: module.title,
		order: Number(module.order ?? 0),
		subModules: (module.subModules ?? []).map((subModule) => ({
			subModuleId: isPersistedEntityId(subModule.id) ? subModule.id : null,
			moduleId: isPersistedEntityId(subModule.moduleId) ? subModule.moduleId : null,
			subModuleName: subModule.title,
			order: Number(subModule.order ?? 0),
		})),
	})),
})

export const getCourses = (): Course[] => {
	return []
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
	const data: CreateCourseInput = typeof input === 'string' ? { title: input } : input
	const title = data.title.trim()
	const slug = data.slug?.trim() ? slugify(data.slug) : slugify(title)

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

	const created = await createCourseApi(payload)
	notifyCoursesUpdated()
	return created
}

export const saveCourse = (titleOrInput: string | CreateCourseInput): Course => {
	const data: CreateCourseInput = typeof titleOrInput === 'string' ? { title: titleOrInput } : titleOrInput
	const title = data.title.trim()
	const slug = data.slug?.trim() ? slugify(data.slug) : slugify(title)
	const now = new Date().toISOString()

	const dummy: Course = {
		id: `course-${Date.now()}`,
		title,
		slug,
		description: data.description ?? '',
		instructorIds: [],
		tags: data.tags ?? [],
		level: data.level ?? 'beginner',
		language: data.language ?? 'ru',
		price: data.price ?? 0,
		currency: data.currency ?? 'KGS',
		status: data.status ?? 'draft',
		createdAt: now,
		updatedAt: now,
		modules: [],
	}

	createCourseAsync(data).catch((err) => console.error('Failed creating course on backend', err))
	return dummy
}

export const deleteCourse = async (id: string): Promise<void> => {
	await deleteCourseApi(id)
	notifyCoursesUpdated()
}

export const updateCourse = (course: Course) => {
	updateCourseApi(course.id, {
		title: course.title,
		slug: course.slug,
		description: course.description,
		thumbnailUrl: course.thumbnailUrl,
		level: course.level,
		language: course.language,
		price: course.price,
		currency: course.currency ?? 'KGS',
		status: course.status,
		tags: course.tags,
	})
		.then(() => {
			notifyCoursesUpdated()
			if (Array.isArray(course.modules) && course.modules.length > 0) {
				syncCourseSyllabusApi(course.id, mapCourseToSyllabusTree(course)).catch((err) =>
					console.error('Failed syncing syllabus', err)
				)
			}
		})
		.catch((err) => console.error('Failed to update course on backend', err))
}

export const subscribeToCourses = (onStoreChange: () => void) => {
	if (typeof window === 'undefined') return () => {}
	window.addEventListener(COURSES_UPDATED_EVENT, onStoreChange)

	return () => {
		window.removeEventListener(COURSES_UPDATED_EVENT, onStoreChange)
	}
}
