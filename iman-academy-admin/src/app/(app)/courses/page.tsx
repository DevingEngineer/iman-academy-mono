'use client'

import Link from 'next/link'
import { PageHeader } from '@/src/components/ui/PageHeader'
import { useCourses } from '@/src/hooks/useCourses'

const CoursesPage = () => {
	const courses = useCourses()

	return (
		<>
			<PageHeader
				title='Управление курсами'
				description='Поиск, фильтры и массовые действия; создание, редактирование и публикация.'
			/>

			<div className='mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
				<div className='mb-4 flex items-center justify-between'>
					<h2 className='text-lg font-semibold text-slate-900'>Список курсов</h2>
					<span className='rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600'>
						{courses.length} курса
					</span>
				</div>

				<ul className='space-y-3'>
					{courses.map((course) => (
						<li key={course.id}>
							<Link
								href={`/courses/${course.slug}`}
								className='flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 transition-colors hover:border-color_brand_primary hover:bg-slate-50'
							>
								<div>
									<p className='font-medium text-slate-900'>{course.title}</p>
									<p className='text-sm text-slate-500'>
										{course.level} • {course.modules.length} модулей
									</p>
								</div>
								<span className='rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700'>
									{course.status}
								</span>
							</Link>
						</li>
					))}
				</ul>
			</div>
		</>
	)
}

export default CoursesPage
