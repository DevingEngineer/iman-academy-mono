'use client'

import { AuthFormError } from '@/src/components/AuthFormError'
import { useRouter } from '@/src/i18n/navigation'
import { useAuth } from '@/src/providers/AuthProvider'
import { useEffect, useRef, useState } from 'react'

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
	const [error, setError] = useState<unknown | null>(null)

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
		setError(null)

		try {
			await loginWithGoogle(response.credential)
			router.push('/')
		} catch (err) {
			setError(err)
		}
	}

	return (
		<div className='flex w-full flex-col gap-2'>
			<div ref={buttonRef} />
			<AuthFormError error={error} fallback='Не удалось войти через Google' />
		</div>
	)
}
