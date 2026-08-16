'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { logout } from '../auth'
import { useAuthStore } from '../store/auth'

export const UserProfile = () => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)
	const router = useRouter()
	const user = useAuthStore((s) => s.user)
	const email = useAuthStore((s) => s.email)
	const role = useAuthStore((s) => s.role)

	const handleLogout = async () => {
		try {
			await logout()
			setIsDropdownOpen(false)
			router.push('/login')
		} catch (error) {
			console.error('Logout failed:', error)
		}
	}

	// Display user name or email
	const displayName = user?.userName || email || 'User'

	return (
		<div className='relative'>
			<button
				onClick={() => setIsDropdownOpen(!isDropdownOpen)}
				className='flex gap-2 items-center cursor-pointer hover:opacity-75 transition-opacity'
				aria-label='User menu'
				aria-expanded={isDropdownOpen}
			>
				<div className='rounded-full overflow-hidden'>
					<Image
						src='https://placehold.co/40x40.png'
						alt='user-avatar'
						width={40}
						height={40}
					/>
				</div>
				<div>
					<p className='supporting'>Welcome!</p>
					<p className='supporting text-xs'>{displayName}</p>
				</div>
			</button>

			{isDropdownOpen && (
				<div className='absolute right-0 mt-2 w-56 bg-color_bg_white border border-[#ADADAD] rounded-lg shadow-lg z-50'>
					<div className='px-4 py-3 border-b border-[#ADADAD]'>
						{email && (
							<p className='text-xs text-[#ADADAD] truncate'>Email: <span className='text-color_text_primary font-medium'>{email}</span></p>
						)}
						{role && (
							<p className='text-xs text-[#ADADAD] mt-1'>Role: <span className='text-color_text_primary font-medium'>{role}</span></p>
						)}
					</div>
					<button
						onClick={handleLogout}
						className='w-full text-left px-4 py-3 text-sm text-color_text_primary hover:bg-color_bg_gray transition-colors'
					>
						Выход
					</button>
				</div>
			)}
		</div>
	)
}
