'use client'

import { Pagination } from '@/src/components/icons/Pagination'
import { usePagination } from '@/src/hooks/usePagination'
import { CoursesList } from '../../../../components/courses/CoursesList'
import { CoursesFilter } from '../courses-filter/CoursesFilter'

export const Courses = () => {
	const totalCourses = 124
	const pageSize = 12

	const { page, totalPages, goToPage } = usePagination(totalCourses, pageSize)

	return (
		<section className='container pt-[70px] pb-[65px]'>
			<div className='max-w-[555px]'>
				<h2 className='h1'>Все курсы</h2>
				<p className='body1 text-secondary_text mt-1'>
					Помогаем освоить профессию с нуля и получить навыки, чтобы стать
					востребованным специалистом.
				</p>
			</div>
			<CoursesFilter />
			<CoursesList />
			<div className='mt-8 flex justify-end items-center'>
				<Pagination
					page={page}
					totalPages={totalPages}
					onPageChange={goToPage}
				/>
			</div>
		</section>
	)
}
