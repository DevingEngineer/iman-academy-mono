import { CoursesCard } from './CoursesCard'

export const CoursesList = () => {
	return (
		<div className='mt-16 grid grid-cols-3 gap-x-6 gap-y-12 w1150:grid-cols-2 w750:grid-cols-1'>
			<CoursesCard />
			<CoursesCard />
			<CoursesCard />
			<CoursesCard />
			<CoursesCard />
			<CoursesCard />
		</div>
	)
}
