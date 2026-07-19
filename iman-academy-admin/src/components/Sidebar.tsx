'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { SIDEBAR_LINKS } from '../consts/sidebar'
import { useActiveLink } from '../hooks/useActiveLink'
import { cn } from '../lib/cn'

export const Sidebar = () => {
	const pathname = usePathname()
	const isCoursePage = /^\/courses\/[^/]+(?:\/|$)/.test(pathname)

	return <SidebarMenu key={isCoursePage ? 'course' : 'app'} initiallyCollapsed={isCoursePage} />
}

const SidebarMenu = ({ initiallyCollapsed }: { initiallyCollapsed: boolean }) => {
	const { getActiveLink } = useActiveLink()
	const [isCollapsed, setIsCollapsed] = useState(initiallyCollapsed)

	return (
		<aside
			className={cn(
				'sticky top-0 h-full min-h-[314px] overflow-hidden transition-[width] duration-200',
				isCollapsed ? 'w-16' : 'w-60'
			)}
		>
			<ul>
				{SIDEBAR_LINKS.map((link) => {
					const active = getActiveLink(link.href, link.match ?? 'exact')

					return (
						<li
							key={link.label}
							className={cn(
								'bg-color_bg_white h-[44px] flex items-center border-b border-color_border_light',
								isCollapsed ? 'gap-0' : 'gap-[10px]'
							)}
						>
							<div
								className={cn(
									'h-[44px] rounded-r-[4px]',
									isCollapsed ? 'w-1' : 'w-5',
									active && 'bg-color_brand_primary'
								)}
							/>
							<Link
								href={link.href}
								className={cn(
									'flex items-center h-full flex-1 rounded-[4px]',
									isCollapsed ? 'justify-center px-2' : 'gap-[13px] pl-[10px] pr-5',
									active &&
										'bg-color_brand_primary text-color_text_white font-medium'
								)}
								title={isCollapsed ? link.label : undefined}
							>
								{<link.icon />}
								<span className={isCollapsed ? 'sr-only' : undefined}>{link.label}</span>
							</Link>
						</li>
					)
				})}
			</ul>
			<button
				type='button'
				onClick={() => setIsCollapsed((collapsed) => !collapsed)}
				className='mt-3 flex h-10 w-full items-center justify-center border-y border-color_border_light bg-color_bg_white text-color_text_primary hover:bg-color_bg_gray'
				aria-label={isCollapsed ? 'Развернуть меню' : 'Свернуть меню'}
				title={isCollapsed ? 'Развернуть меню' : 'Свернуть меню'}
			>
				<svg
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth='2'
					className={cn('h-5 w-5 transition-transform', isCollapsed && 'rotate-180')}
					aria-hidden='true'
				>
					<path d='m15 18-6-6 6-6' />
				</svg>
			</button>
		</aside>
	)
}
