'use client'

import { Link } from '@/src/i18n/navigation'
import { useAuth } from '@/src/providers/AuthProvider'
import { EditIcon } from '@/src/components/icons/EditIcon'
import { VerifiedIcon } from '@/src/components/icons/VerifiedIcon'
import { Button } from '@/src/components/UI/Button'
import Image from 'next/image'
import { useState } from 'react'

export const StudentProfileHeader = () => {
	const { user, isAuthenticated, isLoading, logout } = useAuth()
	const [isSigningOut, setIsSigningOut] = useState(false)
	const displayName = isAuthenticated && user ? user.userName || user.email : 'Гость'
	const profileStatus = isLoading
		? 'Проверка авторизации...'
		: isAuthenticated
			? 'Студент'
			: 'Вы не вошли'

	const handleSignOut = async () => {
		setIsSigningOut(true)
		try {
			await logout()
		} finally {
			setIsSigningOut(false)
		}
	}

	return (
		<header className='py-[32px] w-full w550:py-[16px]'>
			<div className='px-[85px] pt-[53px] pb-[18px] rounded-3xl flex gap-5 justify-between w-full bg-[linear-gradient(90deg,#091E3A_0%,#091E3A_15%,#2F80ED_55%,#2D9EE0_100%)] w550:rounded-xl w1250:px-[60px] w1050:px-[40px] w850:px-[25px] w1050:pt-[35px] w950:pt-[25px] w550:px-[16px] w650:pt-4 w750:flex-col'>
				<div className='min-w-[350px] flex items-center gap-[26px] w750:min-w-0 w650:gap-[10px]'>
					<div className='relative'>
						<div className='w-[96px] h-[96px] rounded-full overflow-hidden w650:w-[51px] w650:h-[51px]'>
							<Image
								width={96}
								height={96}
								alt='student-avatar'
								src='https://placehold.co/96x96.png'
							/>
						</div>
						<VerifiedIcon className='absolute bottom-[7px] right-0 z-20 w650:w-[13px] w650:h-[13px]' />
					</div>
					<div className='text-white w750:flex items-center justify-between w-full'>
						<div>
							<div className='flex items-center gap-2'>
								<h5 className='text-xl leading-[32px] font-bold w650:text-xs w650:font-normal'>
									{displayName}
								</h5>
								{isAuthenticated && (
									<EditIcon className='w650:w-[13px] w650:h-[13px]' />
								)}
							</div>
							<p className='body1 pt-1 pb-4 w650:py-0 w650:text-xs'>
								{profileStatus}
							</p>
						</div>
						{isLoading ? (
							<Button
								className='max-h-[41px] px-4 py-[9px] body1 !font-normal w650:text-xs w650:px-3 w650:py-[6px]'
								disabled
							>
								Проверка...
							</Button>
						) : isAuthenticated ? (
							<div className='flex items-center gap-2'>
								<Button className='max-h-[41px] py-[9px] px-4 body1 !font-normal w650:text-xs w650:px-3 w650:py-[6px]'>
									Доступ активен
								</Button>
								<Button
									variant='outlined'
									className='max-h-[41px] py-[9px] px-4 body1 !font-normal w650:text-xs w650:px-3 w650:py-[6px]'
									onClick={handleSignOut}
									disabled={isSigningOut}
								>
									{isSigningOut ? 'Выход...' : 'Выйти'}
								</Button>
							</div>
						) : (
							<Link
								href='/login'
								className='flex max-h-[41px] items-center rounded-lg border-2 border-white px-4 py-[9px] body1 !font-normal text-white w650:text-xs w650:px-3 w650:py-[6px]'
							>
								Войти
							</Link>
						)}
					</div>
				</div>
				<div className='text-white'>
					<h5 className='text-xl leading-[32px] font-bold'>
						Ассаляму Алейкум!
					</h5>
					<p className='body3 max-w-[331px]'>
						Здесь вы видите свои курсы, прогресс, сертификаты и настройки
						профиля
					</p>
					<div className='pt-[34px] w650:pt-5'>
						<div className='relative w-full bg-border_devider rounded-full h-1 before:absolute before:rounded-full before:h-1 before:bg-hover_focus before:top-0 before:w-[70%]'></div>
						<p className='body3'>
							Общий прогресс обучения
							<span className='text-hover_focus'>
								&nbsp;64% завершено
							</span>
						</p>
					</div>
				</div>
			</div>
		</header>
	)
}
