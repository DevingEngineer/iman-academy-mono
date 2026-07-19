'use client'

import { CourseSidebar } from './CourseSidebar'
import { useCourses } from '../hooks/useCourses'

type CourseLayoutClientProps = {
	children: React.ReactNode
	courseSlug: string
}

export const CourseLayoutClient = ({ children, courseSlug }: CourseLayoutClientProps) => {
	const courses = useCourses()
	const course = courses.find((item) => item.metadata.slug === courseSlug)

	if (!course) {
		return <p className='text-sm text-slate-500'>Загрузка курса...</p>
	}

	return (
		<section>
			<div className='mb-6'>
				<p className='text-sm text-slate-500'>Курсы / {course.metadata.title}</p>
				<div className='mt-2 flex items-center gap-3'>
					<h1 className='text-2xl font-semibold text-slate-900'>{course.metadata.title}</h1>
					<span className='rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700'>
						{course.metadata.status}
					</span>
				</div>
			</div>
			<div className='flex items-start gap-6'>
				<CourseSidebar courseSlug={course.metadata.slug} />
				<div className='min-w-0 flex-1'>{children}</div>
			</div>
		</section>
	)
}
