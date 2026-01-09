import { CoursesFilter } from '../courses-filter/CoursesFilter'
import { CoursesList } from '../courses-list/CoursesList'

export const Courses = () => {
	return (
		<section className='pt-[70px]'>
			<div className='max-w-[555px]'>
				<h2 className='h1'>Все курсы</h2>
				<p className='body1 text-secondary_text mt-1'>
					Помогаем освоить профессию с нуля и получить навыки, чтобы стать
					востребованным специалистом.
				</p>
			</div>
			<CoursesFilter />
			<CoursesList />
		</section>
	)
}
