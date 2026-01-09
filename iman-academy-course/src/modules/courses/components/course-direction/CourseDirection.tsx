import { Button } from '@/src/components/Button'
import { ArrowDown } from '@/src/components/icons/ArrowDown'
import { Popover } from '@/src/components/Popover'
import { cn } from '@/src/lib/cn'
import { CoursesFilterValue } from '../../enums/courseFilterEnum'

type CourseDirectionProps = {
	handleFilterOpen: (value: CoursesFilterValue) => void
	filter: CoursesFilterValue | null
	title: string
	value: CoursesFilterValue
}

export const CourseDirection = ({
	handleFilterOpen,
	filter,
	title,
	value,
}: CourseDirectionProps) => {
	return (
		<div className='relative'>
			<Button
				onClick={() => handleFilterOpen(value)}
				className='px-[27px] bg-white rounded-[13px]'
			>
				{title}
				<span className={cn(filter === value && 'transform rotate-180')}>
					<ArrowDown />
				</span>
			</Button>
			{filter === value && <Popover />}
		</div>
	)
}
