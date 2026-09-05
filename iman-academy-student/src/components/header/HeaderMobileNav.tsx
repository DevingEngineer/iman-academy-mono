'use client'

import { Link } from '@/src/i18n/navigation'
import { useState } from 'react'
import { BurgerMenuIcon } from '../icons/BurgerMenuIcon'
import { HeaderActions } from './HeaderActions'
import { HEADER_NAV_LINKS } from './HeaderNav'

export const HeaderMobileNav = () => {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<div className='relative hidden w750:block'>
			<button
				className='flex text-white'
				type='button'
				aria-expanded={isOpen}
				aria-controls='mobile-header-menu'
				aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
				onClick={() => setIsOpen(current => !current)}
			>
				<BurgerMenuIcon />
			</button>
			{isOpen && (
				<div
					id='mobile-header-menu'
					className='absolute right-0 top-[calc(100%+10px)] z-10 flex min-w-[260px] flex-col gap-5 rounded-xl bg-[#091E3A] p-5 shadow-lg'
				>
					<nav aria-label='Мобильная навигация'>
						<ul className='flex flex-col gap-4 text-white'>
							{HEADER_NAV_LINKS.map(link => (
								<li key={link.label}>
									<Link
										href={link.path}
										className='block'
										onClick={() => setIsOpen(false)}
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</nav>
					<HeaderActions className='flex-wrap' />
				</div>
			)}
		</div>
	)
}
