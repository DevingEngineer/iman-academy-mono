export type LoginRequest = {
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
}
