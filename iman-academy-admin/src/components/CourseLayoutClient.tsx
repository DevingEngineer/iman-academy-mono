'use client'

import Link from 'next/link'
import { CourseSidebar } from './CourseSidebar'
import { useCourse } from '../hooks/useCourses'
import type { ContentStatus } from '../types/course-types'

type CourseLayoutClientProps = {
	children: React.ReactNode
	courseSlug: string
}

const statusStyles: Record<ContentStatus, { label: string; badge: string }> = {
	published: { label: 'Опубликован', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
	draft: { label: 'Черновик', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
	archived: { label: 'В архиве', badge: 'bg-slate-100 text-slate-600 border-slate-200' },
}

export const CourseLayoutClient = ({ children, courseSlug }: CourseLayoutClientProps) => {
	const { course, loading } = useCourse(courseSlug)

	if (loading && !course) {
		return (
			<div className='rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm'>
				Загрузка курса...
			</div>
		)
	}

	if (!course) {
		return (
			<div className='rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm'>
				<p className='text-base font-semibold text-slate-900'>Курс не найден</p>
				<p className='mt-1 text-sm text-slate-500'>
					Возможно, курс был удален или вы перешли по неверной ссылке.
				</p>
				<div className='mt-4'>
					<Link
						href='/courses'
						className='inline-flex items-center rounded-lg bg-color_brand_primary px-4 py-2 text-sm font-medium text-white'
					>
						Вернуться к списку курсов
					</Link>
				</div>
			</div>
		)
	}

	const statusInfo = statusStyles[course.status] ?? statusStyles.draft

	return (
		<section>
			<div className='mb-6'>
				<nav className='flex items-center gap-2 text-sm text-slate-500'>
					<Link href='/courses' className='hover:text-slate-900 transition-colors'>
						← Все курсы
					</Link>
					<span>/</span>
					<span className='font-medium text-slate-700 truncate max-w-md'>{course.title}</span>
				</nav>
				<div className='mt-2 flex flex-wrap items-center gap-3'>
					<h1 className='text-2xl font-bold text-slate-900'>{course.title}</h1>
					<span
						className={`rounded-full border px-3 py-0.5 text-xs font-medium ${statusInfo.badge}`}
					>
						{statusInfo.label}
					</span>
				</div>
			</div>
			<div className='flex items-start gap-6'>
				<CourseSidebar courseSlug={course.id} />
				<div className='min-w-0 flex-1'>{children}</div>
			</div>
		</section>
	)
}
