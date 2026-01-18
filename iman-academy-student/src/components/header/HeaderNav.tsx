'use client'

import { useActiveLink } from '@/src/hooks/useActiveLink'
import { Link } from '@/src/i18n/navigation'
import { cn } from '@/src/lib/cn'

const HEADER_NAV_LINKS = [
	{
		path: '/',
		label: 'Главная',
	},
	{
		path: '/lessons',
		label: 'Уроки',
	},
	{
		path: '/testing',
		label: 'Тестирования',
	},
	{
		path: '/certificates',
		label: 'Сертификаты',
	},
	{
		path: '/payments',
		label: 'Оплата и доступ ',
	},
]

export const HeaderNav = () => {
	const { getActiveLink } = useActiveLink()

	return (
		<ul className='w750:hidden max-w-[633px] w-full flex items-center justify-between text-white'>
			{HEADER_NAV_LINKS.map((l) => {
				const isActive = getActiveLink(l.path)

				return (
					<li
						key={l.label}
						className={cn(
							'relative button-label before:absolute before:h-[1px] before:bottom-0 before:bg-current hover:before:w-full before:duration-200',
							isActive ? 'before:w-full' : 'before:w-0'
						)}
					>
						<Link href={l.path}>{l.label}</Link>
					</li>
				)
			})}
		</ul>
	)
}
