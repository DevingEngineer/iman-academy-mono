'use client'

import { Link, useRouter } from '@/src/i18n/navigation'
import { useAuth } from '@/src/providers/AuthProvider'
import { useState } from 'react'
import { Button } from '../UI/Button'

export const HeaderActions = () => {
	const router = useRouter()
	const { user, isAuthenticated, isLoading, logout } = useAuth()
	const [isSigningOut, setIsSigningOut] = useState(false)

	const handleSignOut = async () => {
		setIsSigningOut(true)

		try {
			await logout()
			router.push('/')
		} finally {
			setIsSigningOut(false)
		}
	}

	if (isLoading) {
		return (
			<div className='flex gap-[10px] animate-pulse'>
			{/* Skeleton for Button 1 */}
			<div className='h-[44px] w-[80px] bg-white/10 rounded-[8px]' />
			{/* Skeleton for Button 2 */}
			<div className='h-[44px] w-[110px] bg-white/20 rounded-[8px]' />
			</div>
		)
	}

	if (isAuthenticated && user) {
		return (
			<div className='flex items-center gap-[10px]'>
				<span className='text-white text-sm truncate max-w-[160px]'>
					{user.userName || user.email}
				</span>
				<Button
					className='h-[44px] px-4 w750:text-[14px] text-white'
					variant='outlined'
					onClick={handleSignOut}
					disabled={isSigningOut}
				>
					{isSigningOut ? 'Выход...' : 'Выйти'}
				</Button>
			</div>
		)
	}

	return (
		<div className='flex gap-[10px]'>
			<Button className='h-[44px] px-4 w750:text-[14px]' variant='outlined'>
				<Link href='/login'>Войти</Link>
			</Button>
			<Button className='h-[44px] px-4 w750:text-[14px]' variant='contained'>
				<Link href='/register'>Регистрация</Link>
			</Button>
		</div>
	)
}
