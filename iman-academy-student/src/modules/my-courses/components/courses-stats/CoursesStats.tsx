import { CourseIcon } from '../../icons/CourseIcon'
import { PointIcon } from '../../icons/PointIcon'
import { CoursesStatCard } from '../courses-stat-card/CoursesStatCard'

export const CoursesStats = () => {
	return (
		<div className='py-8 grid grid-cols-2 gap-6 w750:py-6 w450:py-4'>
			<CoursesStatCard title='Мои курсы' icon={CourseIcon} value={3} />
			<CoursesStatCard title='Баллы' icon={PointIcon} value={1200} />
		</div>
	)
}
