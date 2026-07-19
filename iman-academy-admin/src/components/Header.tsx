'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import AppLogo from '../../public/logo/iman_course_logo.png'

import { NotificationIcon } from './icons/NotificationIcon'
import { PlusIcon } from './icons/PlusIcon'

import { useState } from 'react'
import { UserProfile } from './UserProfile'
import { Button } from './ui/Button'
import { SearchInput } from './ui/SearchInput'

export const Header = () => {
	const [value, setValue] = useState('')
	const router = useRouter()

	return (
		<header className='px-10 py-[31px] border-b border-[#ADADAD] bg-color_bg_white flex items-center justify-between'>
			<Image src={AppLogo} alt='logo' width={148} height={36} />
			<div className='flex items-center gap-5'>
				<SearchInput
					onChange={setValue}
					value={value}
					placeholder='Поиск курсов, уроков, студентов....'
				/>
				<Button className='h-[36px]' onClick={() => router.push('/courses/create')}>
					<PlusIcon />
					Создать курс
				</Button>
				<div className='relative'>
					<NotificationIcon />
					<div className='rounded-full flex items-center justify-center absolute top-[-3px] border border-color_bg_gray right-0 w-[11px] h-[11px] bg-color_text_primary text-[8px] text-color_system_green'>
						6
					</div>
				</div>
				<UserProfile />
			</div>
		</header>
	)
}
