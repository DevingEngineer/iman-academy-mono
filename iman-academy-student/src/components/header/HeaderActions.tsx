'use client'

import { Link, useRouter } from '@/src/i18n/navigation'
import { useAuth } from '@/src/providers/AuthProvider'
import { useState } from 'react'
import { cn } from '@/src/lib/cn'

type HeaderActionsProps = {
	className?: string
}

const actionLinkStyles =
	'flex h-[44px] items-center justify-center rounded-lg px-4 font-semibold leading-none transition-colors duration-300'

export const HeaderActions = ({ className }: HeaderActionsProps) => {
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
			<div className={cn('flex gap-[10px] animate-pulse', className)}>
				<div className='h-[44px] w-[80px] rounded-lg bg-white/10' />
				<div className='h-[44px] w-[110px] rounded-lg bg-white/20' />
			</div>
		)
	}

	if (isAuthenticated && user) {
		return (
			<div className={cn('flex items-center gap-[10px]', className)}>
				<span className='max-w-[160px] truncate text-sm text-white'>
					{user.userName || user.email}
				</span>
				<button
					className={cn(
						actionLinkStyles,
						'border-2 border-accent_brand text-white active:border-hover_focus disabled:cursor-not-allowed disabled:opacity-60'
					)}
					onClick={handleSignOut}
					disabled={isSigningOut}
				>
					{isSigningOut ? 'Выход...' : 'Выйти'}
				</button>
			</div>
		)
	}

	return (
		<div className={cn('flex gap-[10px]', className)}>
			<Link
				href='/login'
				className={cn(
					actionLinkStyles,
					'border-2 border-accent_brand text-white active:border-hover_focus'
				)}
			>
				Войти
			</Link>
			<Link
				href='/register'
				className={cn(
					actionLinkStyles,
					'bg-accent_brand text-primary_text active:bg-hover_focus'
				)}
			>
				Регистрация
			</Link>
		</div>
	)
}