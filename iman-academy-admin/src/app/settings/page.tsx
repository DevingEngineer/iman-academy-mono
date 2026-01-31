'use client'

import { PageHeader } from '@/src/components/ui/PageHeader'
import { useActiveLink } from '@/src/hooks/useActiveLink'
import { cn } from '@/src/lib/cn'
import Link from 'next/link'

const SETTINGS_LINKS = [
	{
		label: 'Общие',
		href: '/settings/common',
	},
	{
		label: 'Маркетинг',
		href: '/settings/marketing',
	},
	{
		label: 'Уведомления',
		href: '/settings/notifications',
	},
	{
		label: 'Интеграции',
		href: '/settings/integrations',
	},
]

const SettingsPage = () => {
	const { getActiveLink } = useActiveLink()

	return (
		<>
			<PageHeader
				title='Параметры школы'
				description='Общие сведения, брендинг, оплата, доступ и безопасность, интеграции и импорты.'
			/>
			<nav className='bg-color_bg_white py-[25px] px-[39px]'>
				<ul className='max-w-[438px] border-b border-color_border_light flex'>
					{SETTINGS_LINKS.map((link) => {
						const isActive = getActiveLink(link.href)

						return (
							<li key={link.label}>
								<Link
									className={cn(
										'block text-sm leading-[138%] py-[5px] px-5  border-b-[3px] ',
										isActive &&
											'bg-color_bg_gray border-color_button_primary'
									)}
									href=''
								>
									Общие
								</Link>
							</li>
						)
					})}
				</ul>
			</nav>
		</>
	)
}

export default SettingsPage
