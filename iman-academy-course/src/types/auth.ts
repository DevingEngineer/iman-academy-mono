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
