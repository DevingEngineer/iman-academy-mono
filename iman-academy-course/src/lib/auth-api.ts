import { getAccessToken } from '@/src/lib/auth'
import type {
	CurrentUserResponse,
	LoginRequest,
	ProblemDetails,
	TokenResponse,
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

async function parseErrorMessage(response: Response): Promise<string> {
	try {
		const data = (await response.json()) as ProblemDetails
		return data.detail || data.title || 'Request failed'
	} catch {
		return 'Request failed'
	}
}

async function authRequest<T>(
	path: string,
	options: RequestInit = {},
	includeAuth = false
): Promise<T> {
	const headers = await buildHeaders(includeAuth)

	const response = await fetch(`${API_BASE}${path}`, {
		...options,
		credentials: 'include',
		headers: {
			...headers,
			...(options.headers as Record<string, string> | undefined),
		},
	})

	if (!response.ok) {
		throw new Error(await parseErrorMessage(response))
	}

	if (response.status === 204) {
		return undefined as T
	}

	return response.json() as Promise<T>
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

	const response = await fetch(`${API_BASE}/api/auth/frontend/refresh-token`, {
		method: 'POST',
		credentials: 'include',
		headers,
	})

	if (response.status === 401) {
		return null
	}

	if (!response.ok) {
		throw new Error(await parseErrorMessage(response))
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

	const response = await fetch(
		`${API_BASE}/api/auth/frontend/google-id-token`,
		{
			method: 'POST',
			credentials: 'include',
			headers,
			body: JSON.stringify({ idToken }),
		}
	)

	if (!response.ok) {
		throw new Error(await parseErrorMessage(response))
	}

	return response.json() as Promise<TokenResponse>
}
