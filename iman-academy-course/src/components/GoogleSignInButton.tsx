'use client'

import { useRouter } from '@/src/i18n/navigation'
import { useAuth } from '@/src/providers/AuthProvider'
import { useEffect, useRef } from 'react'

declare global {
	interface Window {
		google: {
			accounts: {
				id: {
					initialize: (config: {
						client_id: string | undefined
						callback: (response: { credential: string }) => void
					}) => void
					renderButton: (
						element: HTMLElement,
						options: { theme: string; size: string; width: number }
					) => void
				}
			}
		}
	}
}

export default function GoogleSignInButton() {
	const buttonRef = useRef<HTMLDivElement>(null)
	const router = useRouter()
	const { loginWithGoogle } = useAuth()

	useEffect(() => {
		const interval = setInterval(() => {
			if (window.google && buttonRef.current) {
				clearInterval(interval)

				window.google.accounts.id.initialize({
					client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
					callback: handleCredentialResponse,
				})

				window.google.accounts.id.renderButton(buttonRef.current, {
					theme: 'outline',
					size: 'large',
					width: 280,
				})
			}
		}, 100)

		return () => clearInterval(interval)
	}, [])

	async function handleCredentialResponse(response: { credential: string }) {
		try {
			await loginWithGoogle(response.credential)
			router.push('/')
		} catch (err) {
			console.error('Google sign-in failed', err)
		}
	}

	return <div ref={buttonRef} />
}
