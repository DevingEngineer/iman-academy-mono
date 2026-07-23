'use client'

import { cn } from '@/src/lib/cn'
import { useState } from 'react'
import { CalendarIcon } from '../icons/CalendarIcon'
import { CalendarGrid } from './CalendarGrid'

const TIMES = [
	'9:30 AM',
	'10:00 AM',
	'10:30 AM',
	'11:00 AM',
	'11:30 AM',
	'12:00 PM',
	'12:30 PM',
	'1:00 PM',
]

export default function DateTimePicker() {
	const [open, setOpen] = useState(false)
	const [selectedDate, setSelectedDate] = useState<Date | null>(null)
	const [selectedTime, setSelectedTime] = useState<string | null>(null)

	return (
		<div className='w-[420px]'>
			<label className='mb-[6px] block font-medium'>
				Выберите дату и время
			</label>

			<button
				onClick={() => setOpen(true)}
				className={cn(
					'flex h-[44px] w-full items-center justify-between border px-4 text-left',
					open
						? 'border-color_system_blue rounded-t-lg'
						: 'border-color_border_light rounded-lg'
				)}
			>
				<span className='text-gray-500'>
					{selectedDate && selectedTime
						? `${selectedDate.toLocaleDateString()} / ${selectedTime}`
						: 'ДД.ММ.ГГ / -- --'}
				</span>
				<CalendarIcon />
			</button>

			{open && (
				<div className='rounded-b-xl border border-color_system_blue bg-color_bg_white p-4 shadow-lg'>
					<div className='flex gap-4'>
						<CalendarGrid
							value={selectedDate}
							onChange={setSelectedDate}
						/>

						<div className='h-[260px] w-[140px] overflow-y-auto'>
							{TIMES.map((time) => (
								<button
									key={time}
									onClick={() => setSelectedTime(time)}
									className={`border mb-2 w-full rounded-lg px-3 py-2 text-sm text-left
                    ${
								selectedTime === time
									? 'border-color_system_blue bg-color_system_light'
									: 'bg-color_bg_gray border-transparent'
							}
                  `}
								>
									{time}
								</button>
							))}
						</div>
					</div>

					<div className='mt-4 flex justify-end gap-2 border-t pt-4'>
						<button
							onClick={() => setOpen(false)}
							className='rounded-lg border border-color_border_light px-4 py-2 text-sm'
						>
							Cancel
						</button>
						<button
							onClick={() => setOpen(false)}
							className='rounded-lg bg-color_system_blue px-4 py-2 text-sm text-color_text_white'
						>
							Done
						</button>
					</div>
				</div>
			)}
		</div>
	)
}
