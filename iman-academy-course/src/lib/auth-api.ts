import { getAccessToken } from '@/src/lib/auth'
import {
	AuthApiError,
	type CurrentUserResponse,
	type LoginRequest,
	type ProblemDetails,
	type RegisterRequest,
	type TokenResponse,
} from '@/src/types/auth'

const API_BASE = process.env.NEXT_PUBLIC_API_URL!

const CSRF_COOKIE_NAME = 'XSRF-TOKEN'
const CSRF_HEADER_NAME = 'X-XSRF-TOKEN'

let csrfInitialized = false

async function ensureCsrfCookie() {
	if (csrfInitialized) return

	await fetch(`${API_BASE}/api/auth/frontend/csrf-cookie-token`, {
		credentials: 'include',
	})

	csrfInitialized = true
}

function getCsrfToken(): string | null {
	if (typeof document === 'undefined') return null

	const cookies = document.cookie.split(';')

	for (const cookie of cookies) {
		const [name, ...rest] = cookie.trim().split('=')
		if (name === CSRF_COOKIE_NAME) {
			return decodeURIComponent(rest.join('='))
		}
	}

	return null
}

async function buildHeaders(includeAuth = false): Promise<Record<string, string>> {
	await ensureCsrfCookie()

	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
	}

	const csrfToken = getCsrfToken()
	if (csrfToken) {
		headers[CSRF_HEADER_NAME] = csrfToken
	}

	if (includeAuth) {
		const token = getAccessToken()
		if (token) {
			headers.Authorization = `Bearer ${token}`
		}
	}

	return headers
}

function formatProblemDetails(data: ProblemDetails): string[] {
	const messages: string[] = []

	if (data.errors) {
		for (const [field, fieldErrors] of Object.entries(data.errors)) {
			for (const fieldError of fieldErrors) {
				messages.push(`${field}: ${fieldError}`)
			}
		}
	}

	if (data.detail) {
		messages.push(data.detail)
	}

	if (data.title && !messages.includes(data.title)) {
		messages.push(data.title)
	}

	return messages
}

async function parseAuthError(response: Response): Promise<AuthApiError> {
	const status = response.status
	const text = await response.text()

	if (!text) {
		return new AuthApiError(`Request failed (${status})`, status)
	}

	try {
		const data = JSON.parse(text) as ProblemDetails & { message?: string }

		const messages = formatProblemDetails(data)

		if (data.message && !messages.includes(data.message)) {
			messages.push(data.message)
		}

		const message =
			messages.length > 0 ? messages.join('\n') : `Request failed (${status})`

		return new AuthApiError(message, status, data, text)
	} catch {
		return new AuthApiError(text, status, null, text)
	}
}

async function authRequest<T>(
	path: string,
	options: RequestInit = {},
	includeAuth = false
): Promise<T> {
	const headers = await buildHeaders(includeAuth)

	let response: Response

	try {
		response = await fetch(`${API_BASE}${path}`, {
			...options,
			credentials: 'include',
			headers: {
				...headers,
				...(options.headers as Record<string, string> | undefined),
			},
		})
	} catch {
		throw new AuthApiError(
			'Не удалось подключиться к серверу. Проверьте, что API запущен и доступен.',
			0
		)
	}

	if (!response.ok) {
		throw await parseAuthError(response)
	}

	if (response.status === 204) {
		return undefined as T
	}

	const text = await response.text()
	if (!text) {
		return undefined as T
	}

	return JSON.parse(text) as T
}

export async function register(request: RegisterRequest): Promise<void> {
	await authRequest<void>('/api/auth/frontend/register', {
		method: 'POST',
		body: JSON.stringify(request),
	})
}

export async function login(request: LoginRequest): Promise<TokenResponse> {
	return authRequest<TokenResponse>('/api/auth/frontend/login', {
		method: 'POST',
		body: JSON.stringify(request),
	})
}

export async function logout(): Promise<void> {
	await authRequest<void>('/api/auth/frontend/logout', {
		method: 'POST',
	})
}

export async function refreshAccessToken(): Promise<TokenResponse | null> {
	const headers = await buildHeaders()

	let response: Response

	try {
		response = await fetch(`${API_BASE}/api/auth/frontend/refresh-token`, {
			method: 'POST',
			credentials: 'include',
			headers,
		})
	} catch {
		throw new AuthApiError(
			'Не удалось подключиться к серверу. Проверьте, что API запущен и доступен.',
			0
		)
	}

	if (response.status === 401) {
		return null
	}

	if (!response.ok) {
		throw await parseAuthError(response)
	}

	return response.json() as Promise<TokenResponse>
}

export async function fetchCurrentUser(): Promise<CurrentUserResponse> {
	return authRequest<CurrentUserResponse>(
		'/api/auth/frontend/current-user',
		{ method: 'GET' },
		true
	)
}

export async function loginWithGoogleIdToken(
	idToken: string
): Promise<TokenResponse> {
	const headers = await buildHeaders()

	let response: Response

	try {
		response = await fetch(
			`${API_BASE}/api/auth/frontend/google-id-token`,
			{
				method: 'POST',
				credentials: 'include',
				headers,
				body: JSON.stringify({ idToken }),
			}
		)
	} catch {
		throw new AuthApiError(
			'Не удалось подключиться к серверу. Проверьте, что API запущен и доступен.',
			0
		)
	}

	if (!response.ok) {
		throw await parseAuthError(response)
	}

	return response.json() as Promise<TokenResponse>
}
