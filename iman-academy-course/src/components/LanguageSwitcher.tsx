'use client'

import { CaretBottomIcon } from '@/public/icons/header/CaretBottomIcon'
import { useLocale } from 'next-intl'
import { useState } from 'react'
import ReactCountryFlag from 'react-country-flag'
import { usePathname, useRouter } from '../i18n/navigation'
import { routing } from '../i18n/routing'
import { cn } from '../lib/cn'

export const LOCALES = {
	ru: {
		label: 'RU',
		countryCode: 'RU',
	},
	ky: {
		label: 'KG',
		countryCode: 'KG',
	},
} as const

export type Locale = keyof typeof LOCALES

export const LanguageSwitcher = () => {
	const locale = useLocale() as Locale
	const pathname = usePathname()
	const router = useRouter()
	const [open, setOpen] = useState(false)

	const current = LOCALES[locale]

	const changeLocale = (nextLocale: Locale) => {
		router.replace(pathname, { locale: nextLocale })
		setOpen(false)
	}

	return (
		<div className='relative my-auto'>
			<button
				onClick={() => setOpen((v) => !v)}
				className='flex items-center gap-2 rounded-lg font-bold text-sm bg-primary text-white w750:bg-transparent w750:px-0 hover:bg-primary_hover w750:hover:bg-transparent duration-300'
			>
				<ReactCountryFlag
					svg
					countryCode={current.countryCode}
					style={{ width: '1.25em', height: '1.25em' }}
				/>
				<CaretBottomIcon />
			</button>

			{open && (
				<div className='absolute w-40 rounded-lg mt-2 left-0 border shadow-lg bg-black/5 backdrop-blur-md'>
					{routing.locales.map((l) => {
						const item = LOCALES[l as Locale]

						return (
							<button
								key={l}
								onClick={() => changeLocale(l as Locale)}
								className={cn(
									'flex w-full items-center text-white gap-2 px-4 py-2 text-sm transition duration-300 hover:text-white font-bold first-of-type:rounded-t-lg last-of-type:rounded-b-lg',
									locale === l && 'bg-primary font-semibold',
									locale !== l && 'hover:bg-primary_hover'
								)}
							>
								<ReactCountryFlag
									svg
									countryCode={item?.countryCode}
									style={{ width: '1.25em', height: '1.25em' }}
								/>
								{item?.label}
							</button>
						)
					})}
				</div>
			)}
		</div>
	)
}
