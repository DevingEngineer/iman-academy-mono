'use client'

import { cn } from '@/src/lib/cn'
import { useState } from 'react'
import { SearchIcon } from '../icons/SearchIcon'
import { XIcon } from '../icons/XIcon'

type SearchInputProps = {
	value?: string
	className?: string
	placeholder?: string
	onChange?: (value: string) => void
}

export const SearchInput = ({
	onChange,
	className,
	value = '',
	placeholder = 'Search...',
}: SearchInputProps) => {
	const [focused, setFocused] = useState(false)

	return (
		<div
			className={cn(
				'relative w-[293px] flex h-9 items-center gap-2 rounded-lg border px-3 transition',
				!focused && 'border-color_border_light',
				focused && 'border-color_system_black',
				className
			)}
		>
			<SearchIcon className='shrink-0 w-5 h-5' />

			<input
				value={value}
				onFocus={() => setFocused(true)}
				onBlur={() => setFocused(false)}
				onChange={(e) => onChange?.(e.target.value)}
				placeholder={placeholder}
				className='flex-1 text-sm bg-transparent pr-6 h-full leading-[150%] outline-none placeholder:text-color_text_secondary'
			/>

			<button
				onClick={() => onChange?.('')}
				className={cn(
					'absolute top-1/2 -translate-y-1/2 right-3 flex h-6 w-6 items-center rounded transition-colors duration-200 justify-center hover:bg-[#EAEAEA]',
					!value ? 'invisible' : 'visible'
				)}
			>
				{value && <XIcon />}
			</button>
		</div>
	)
}
