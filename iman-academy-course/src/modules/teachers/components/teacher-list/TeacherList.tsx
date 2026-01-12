import { EmblaViewportRefType } from 'embla-carousel-react'
import { TeacherCard } from '../teacher-card/TeacherCard'

type TeacherListProps = {
	emblaRef: EmblaViewportRefType
}

export const TeacherList = ({ emblaRef }: TeacherListProps) => {
	return (
		<div className='w-full overflow-hidden' ref={emblaRef}>
			<div className='flex gap-6 w-full mt-8'>
				<TeacherCard />
				<TeacherCard />
				<TeacherCard />
				<TeacherCard />
				<TeacherCard />
				<TeacherCard />
				<TeacherCard />
			</div>
		</div>
	)
}
