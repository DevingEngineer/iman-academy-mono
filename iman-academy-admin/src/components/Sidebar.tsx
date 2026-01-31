'use client'

import Link from 'next/link'
import { SIDEBAR_LINKS } from '../consts/sidebar'
import { useActiveLink } from '../hooks/useActiveLink'
import { cn } from '../lib/cn'

export const Sidebar = () => {
	const { getActiveLink } = useActiveLink()

	return (
		<aside className='sticky top-0 min-h-[314px] h-full'>
			<ul>
				{SIDEBAR_LINKS.map((link) => {
					const active = getActiveLink(link.href, link.match ?? 'exact')

					return (
						<li
							key={link.label}
							className='bg-color_bg_white h-[44px] flex items-center gap-[10px] border-b border-color_border_light'
						>
							<div
								className={cn(
									'w-5 h-[44px] rounded-r-[4px]',
									active && 'bg-color_brand_primary'
								)}
							/>
							<Link
								href={link.href}
								className={cn(
									'flex items-center gap-[13px] w-full rounded-[4px] h-full pl-[10px] pr-5',
									active &&
										'bg-color_brand_primary text-color_text_white font-medium'
								)}
							>
								{<link.icon />}
								{link.label}
							</Link>
						</li>
					)
				})}
			</ul>
		</aside>
	)
}
