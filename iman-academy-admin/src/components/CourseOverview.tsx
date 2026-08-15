'use client'

import { useCourses } from '../hooks/useCourses'

export const CourseOverview = ({ courseSlug }: { courseSlug: string }) => {
	const courses = useCourses()
	const cleanSlug = decodeURIComponent(courseSlug)
	const course = courses.find((item) => item.id === cleanSlug || item.slug === cleanSlug)

	if (!course) return null

	return (
		<div className='space-y-6'>
			<div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
				<h2 className='text-lg font-semibold text-slate-900'>Описание курса</h2>
				<p className='mt-2 text-sm text-slate-500'>{course.description || 'Описание ещё не добавлено.'}</p>
				<dl className='mt-6 grid gap-4 sm:grid-cols-3'>
					<div className='rounded-xl bg-slate-50 p-4'><dt className='text-sm text-slate-500'>Уровень</dt><dd className='mt-1 font-medium text-slate-900'>{course.level}</dd></div>
					<div className='rounded-xl bg-slate-50 p-4'><dt className='text-sm text-slate-500'>Модули</dt><dd className='mt-1 font-medium text-slate-900'>{course.modules.length}</dd></div>
					<div className='rounded-xl bg-slate-50 p-4'><dt className='text-sm text-slate-500'>Статус</dt><dd className='mt-1 font-medium text-slate-900'>{course.status}</dd></div>
				</dl>
			</div>
			<div className='rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500'>
				Здесь появятся статистика курса и последние действия.
			</div>
		</div>
	)
}
