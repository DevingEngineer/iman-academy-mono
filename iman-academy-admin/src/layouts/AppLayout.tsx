'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { Header } from '../components/Header'
import { Sidebar } from '../components/Sidebar'
import { useAuthStore } from '../store/auth'
const MOCK_AUTH = false

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
	const router = useRouter()
	const accessToken = useAuthStore((s) => s.accessToken)

	useEffect(() => {
		if (!MOCK_AUTH && !accessToken) {
			router.replace('/login')
		}
	}, [accessToken, router])

	// AuthProvider (root layout) has already resolved the silent refresh by
	// the time this mounts, so a missing token here means no valid session
	// — unless mock mode is on, in which case we skip the check entirely.
	if (!MOCK_AUTH && !accessToken) return null

	return (
		<>
			<Header />
			<div className='flex gap-5 pt-[22px] pb-[94px]'>
				<Sidebar />
				<main className='flex-1 container'>{children}</main>
			</div>
		</>
	)
}