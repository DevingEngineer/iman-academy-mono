'use client'

import Link from 'next/link'
import { useActiveLink } from '../hooks/useActiveLink'
import { cn } from '../lib/cn'

type CourseSidebarProps = {
	courseSlug: string
}

export const CourseSidebar = ({ courseSlug }: CourseSidebarProps) => {
	const { getActiveLink } = useActiveLink()
	

	const baseHref = `/courses/${courseSlug}`
	const links = [
		{ label: 'Описание', href: baseHref },
		{ label: 'Содержание', href: `${baseHref}/content` },
		{ label: 'Настройки', href: `${baseHref}/settings` },
	]

	return (
		<aside className='w-52 shrink-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm'>
			<p className='px-3 pb-3 text-xs font-semibold uppercase tracking-wide text-slate-500'>
				Курс
			</p>
			<nav aria-label='Навигация по курсу'>
				<ul className='space-y-1'>
					{links.map((link) => {
						const isActive = getActiveLink(link.href, 'exact')

						return (
							<li key={link.href}>
								<Link
									href={link.href}
									className={cn(
										'block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900',
										isActive && 'bg-color_brand_primary text-white hover:bg-color_brand_primary hover:text-white'
									)}
								>
									{link.label}
								</Link>
							</li>
						)
					})}
				</ul>
			</nav>
		</aside>
	)
}
