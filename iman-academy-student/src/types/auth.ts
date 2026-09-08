export type LoginRequest = {
	email: string
	password: string
}

export type RegisterRequest = {
	email: string
	password: string
}

export type TokenResponse = {
	accessToken: string
	accessTokenExpires?: string | null
	refreshToken?: string
	refreshTokenExpires?: string | null
}

export type CurrentUserResponse = {
	id: string
	email: string
	userName: string
	emailConfirmed: boolean
}

export type CourseDto = {
	id: string
	title: string
	slug: string | null
	description: string | null
	thumbnailUrl: string | null
	level: number | null
	language: string | null
	price: number | string | null
	currency: string | null
	status: number
	tags: string[]
	createdAt: string
	updatedAt: string
	modulesCount: number | string
}

export type StudentEnrollmentDto = {
	enrollmentId: string
	status: number | string
	enrolledAt: string
	completedAt: string | null
	progressPercent: number | string | null
	course: CourseDto
}

export type SyllabusSubModuleDto = {
	subModuleId: string | null
	moduleId: string | null
	subModuleName: string
	order: number | string
}

export type SyllabusModuleDto = {
	moduleId: string | null
	courseId: string
	moduleName: string
	order: number | string
	subModules: SyllabusSubModuleDto[]
}

export type SyllabusTreeDto = {
	courseId: string
	courseName: string
	modules: SyllabusModuleDto[]
}

export type StepDto = {
	stepType: 'Content' | 'Video' | 'Quiz'
	id: string | null
	subModuleId: string | null
	title: string
	description: string | null
	order: number | string
	estimatedDurationMinutes: number | string | null
	isFreePreview: boolean
	status: number
	body?: string
	videoUrl?: string
	transcript?: string | null
	questions?: unknown[]
}

export type SubModuleDto = {
	id: string | null
	moduleId: string
	title: string
	description: string | null
	order: number | string
	estimatedDurationMinutes: number | string | null
	steps: StepDto[]
}

export type ProblemDetails = {
	type?: string | null
	title?: string | null
	status?: number | string | null
	detail?: string | null
	instance?: string | null
	errors?: Record<string, string[]>
}

export class AuthApiError extends Error {
	status: number
	details: ProblemDetails | null
	rawBody: string | null

	constructor(
		message: string,
		status: number,
		details: ProblemDetails | null = null,
		rawBody: string | null = null
	) {
		super(message)
		this.name = 'AuthApiError'
		this.status = status
		this.details = details
		this.rawBody = rawBody
	}
}

export function getErrorMessage(error: unknown, fallback: string): string {
	if (typeof error === 'string') {
		return error
	}

	if (error instanceof AuthApiError) {
		return error.message
	}

	if (error instanceof Error) {
		if (error.message === 'Failed to fetch') {
			return 'Не удалось подключиться к серверу. Проверьте, что API запущен и доступен.'
		}

		return error.message || fallback
	}

	return fallback
}
