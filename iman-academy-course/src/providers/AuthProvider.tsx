'use client'

import {
	fetchCurrentUser,
	login as loginApi,
	loginWithGoogleIdToken,
	logout as logoutApi,
	refreshAccessToken,
} from '@/src/lib/auth-api'
import { setAccessToken } from '@/src/lib/auth'
import type { CurrentUserResponse, LoginRequest } from '@/src/types/auth'
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from 'react'

type AuthContextValue = {
	user: CurrentUserResponse | null
	isAuthenticated: boolean
	isLoading: boolean
	login: (request: LoginRequest) => Promise<void>
	loginWithGoogle: (idToken: string) => Promise<void>
	logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

async function loadCurrentUser(): Promise<CurrentUserResponse | null> {
	const tokens = await refreshAccessToken()
	if (!tokens) return null

	setAccessToken(tokens.accessToken)
	return fetchCurrentUser()
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<CurrentUserResponse | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		let cancelled = false

		loadCurrentUser()
			.then(currentUser => {
				if (!cancelled) setUser(currentUser)
			})
			.catch(() => {
				if (!cancelled) {
					setAccessToken(null)
					setUser(null)
				}
			})
			.finally(() => {
				if (!cancelled) setIsLoading(false)
			})

		return () => {
			cancelled = true
		}
	}, [])

	const login = useCallback(async (request: LoginRequest) => {
		const tokens = await loginApi(request)
		setAccessToken(tokens.accessToken)
		const currentUser = await fetchCurrentUser()
		setUser(currentUser)
	}, [])

	const loginWithGoogle = useCallback(async (idToken: string) => {
		const tokens = await loginWithGoogleIdToken(idToken)
		setAccessToken(tokens.accessToken)
		const currentUser = await fetchCurrentUser()
		setUser(currentUser)
	}, [])

	const logout = useCallback(async () => {
		try {
			await logoutApi()
		} finally {
			setAccessToken(null)
			setUser(null)
		}
	}, [])

	const value = useMemo(
		() => ({
			user,
			isAuthenticated: user !== null,
			isLoading,
			login,
			loginWithGoogle,
			logout,
		}),
		[user, isLoading, login, loginWithGoogle, logout]
	)

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error('useAuth must be used within AuthProvider')
	}
	return context
}
