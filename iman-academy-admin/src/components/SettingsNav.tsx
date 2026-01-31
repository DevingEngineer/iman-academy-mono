'use client'

import Link from 'next/link'
import { useActiveLink } from '../hooks/useActiveLink'
import { cn } from '../lib/cn'

const SETTINGS_LINKS = [
	{
		label: 'Общие',
		href: '/settings',
		match: 'exact',
	},
	{
		label: 'Маркетинг',
		href: '/settings/marketing',
		match: 'exact',
	},
	{
		label: 'Уведомления',
		href: '/settings/notifications',
		match: 'exact',
	},
	{
		label: 'Интеграции',
		href: '/settings/integrations',
		match: 'exact',
	},
]

export const SettingsNav = () => {
	const { getActiveLink } = useActiveLink()

	return (
		<nav className='bg-color_bg_white py-[25px] px-[39px]'>
			<ul className='max-w-[438px] border-b border-color_border_light flex'>
				{SETTINGS_LINKS.map((link) => {
					const isActive = getActiveLink(link.href, 'exact')

					return (
						<li key={link.label}>
							<Link
								className={cn(
									'block text-sm leading-[138%] py-[5px] px-5',
									isActive &&
										'bg-color_bg_gray border-color_button_primary border-b-[3px]'
								)}
								href={link.href}
							>
								{link.label}
							</Link>
						</li>
					)
				})}
			</ul>
		</nav>
	)
}
