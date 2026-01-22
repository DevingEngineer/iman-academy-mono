'use client'

import { cn } from '@/src/lib/cn'
import { useState } from 'react'

const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export const CalendarGrid = ({
	value,
	onChange,
}: {
	value: Date | null
	onChange: (date: Date) => void
}) => {
	const [current, setCurrent] = useState(new Date())

	const year = current.getFullYear()
	const month = current.getMonth()

	const firstDay = new Date(year, month, 1).getDay()
	const daysInMonth = new Date(year, month + 1, 0).getDate()

	const days = Array.from({ length: firstDay + daysInMonth })

	return (
		<div className='w-[260px]'>
			<div className='mb-3 flex items-center justify-between'>
				<button onClick={() => setCurrent(new Date(year, month - 1))}>
					←
				</button>
				<div className='font-medium'>
					{current.toLocaleString('en-US', { month: 'long' })} {year}
				</div>
				<button onClick={() => setCurrent(new Date(year, month + 1))}>
					→
				</button>
			</div>

			<div className='mb-2 grid grid-cols-7 text-center text-xs text-color_text_secondary'>
				{WEEK_DAYS.map((d) => (
					<div key={d}>{d}</div>
				))}
			</div>

			<div className='grid grid-cols-7 gap-1 text-center text-sm'>
				{days.map((_, i) => {
					const day = i - firstDay + 1
					if (day < 1) return <div key={i} />

					const date = new Date(year, month, day)
					const isSelected = value?.toDateString() === date.toDateString()

					return (
						<button
							key={i}
							onClick={() => onChange(date)}
							className={cn(
								'h-9 rounded-lg duration-200',
								isSelected
									? 'bg-color_system_blue text-color_text_white'
									: 'hover:bg-color_bg_gray'
							)}
						>
							{day}
						</button>
					)
				})}
			</div>
		</div>
	)
}
