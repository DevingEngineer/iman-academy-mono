import { cn } from '@/src/lib/cn'
import { CompletedIcon } from '../../icons/CompletedIcon'

type LessonItemProps = {
	index: number
	title: string
	done: boolean
}

export const LessonItem = ({ index, title, done }: LessonItemProps) => {
	return (
		<li className='flex items-center justify-between gap-2 rounded-xl border border-border_devider bg-white px-6 py-[22px]'>
			<div className='flex items-center gap-3'>
				<span className='rounded-full bg-accent_brand text-nowrap px-3 py-1 text-sm font-medium'>
					Урок {index}
				</span>
				<p className='font-medium text-primary_text'>{title}</p>
			</div>

			<span
				className={cn(done ? 'text-system_success' : 'text-secondary_text')}
			>
				<CompletedIcon />
			</span>
		</li>
	)
}
