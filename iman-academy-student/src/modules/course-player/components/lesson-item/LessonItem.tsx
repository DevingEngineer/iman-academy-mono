import clsx from 'clsx'

type LessonItemProps = {
	index: number
	title: string
	done: boolean
}

export const LessonItem = ({ index, title, done }: LessonItemProps) => {
	return (
		<li
			className={clsx(
				'flex items-center justify-between rounded-xl border bg-white px-4 py-3',
				done ? 'border-green-200' : 'border-gray-200'
			)}
		>
			<div className='flex items-center gap-3'>
				<span className='rounded-full bg-yellow-400 px-3 py-1 text-sm font-medium'>
					Урок {index}
				</span>
				<p className='text-sm font-medium text-primary_text'>{title}</p>
			</div>

			<span
				className={clsx(
					'h-6 w-6 rounded-full',
					done ? 'bg-green-500' : 'bg-gray-400'
				)}
			/>
		</li>
	)
}
