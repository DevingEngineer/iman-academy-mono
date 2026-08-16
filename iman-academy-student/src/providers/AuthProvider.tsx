'use client'

import {
	fetchCurrentUser,
	login as loginApi,
	loginWithGoogleIdToken,
	logout as logoutApi,
	refreshAccessToken,
	register as registerApi,
} from '@/src/lib/auth-api'
import { setAccessToken, getAccessToken } from '@/src/lib/auth'
import type {
	CurrentUserResponse,
	LoginRequest,
	RegisterRequest,
} from '@/src/types/auth'
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
	register: (request: RegisterRequest) => Promise<void>
	loginWithGoogle: (idToken: string) => Promise<void>
	logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

async function loadCurrentUser(): Promise<CurrentUserResponse | null> {
	  // 1. Get the token from localStorage
  const localToken = getAccessToken();
  
  // 2. If no token exists at all, the user is completely logged out
  if (!localToken) return null;

  try {
    // 3. Try to fetch the user with the existing token
    return await fetchCurrentUser();
  } catch (error) {
    // 4. If fetch fails (token expired), try to refresh it
    const tokens = await refreshAccessToken();
    if (!tokens) return null;

    setAccessToken(tokens.accessToken);
    return fetchCurrentUser();
  }
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

	const register = useCallback(async (request: RegisterRequest) => {
		await registerApi(request)
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
			register,
			loginWithGoogle,
			logout,
		}),
		[user, isLoading, login, register, loginWithGoogle, logout]
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
