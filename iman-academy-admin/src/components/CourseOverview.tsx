'use client'

import { useEffect, useState } from 'react'
import { useCourse } from '../hooks/useCourses'
import { fetchAdminEnrollmentsApi, fetchCourseSyllabusApi } from '../lib/api'
import { CourseOverviewHero } from './courses/CourseOverviewHero'
import { CourseCurriculumSummary } from './courses/CourseCurriculumSummary'
import type { Module } from '../types/course-types'

export const CourseOverview = ({ courseSlug }: { courseSlug: string }) => {
	const { course, loading } = useCourse(courseSlug)
	const [enrolledCount, setEnrolledCount] = useState<number | null>(null)
	const [modules, setModules] = useState<Module[]>([])
	const [isLoadingSyllabus, setIsLoadingSyllabus] = useState(false)

	useEffect(() => {
		if (!course?.id) return

		// Fetch enrolled students count
		fetchAdminEnrollmentsApi()
			.then((list) => {
				const matching = list.filter((e) => e.courseId === course.id)
				setEnrolledCount(matching.length)
			})
			.catch(() => setEnrolledCount(0))

		// Fetch syllabus if modules are not loaded
		if (course.modules && course.modules.length > 0) {
			setModules(course.modules)
		} else if (!course.id.startsWith('temp-')) {
			setIsLoadingSyllabus(true)
			fetchCourseSyllabusApi(course.id)
				.then((tree) => {
					const mapped: Module[] = (tree.modules ?? []).map((m, idx) => ({
						id: m.moduleId ?? `mod-${idx}`,
						courseId: course.id,
						title: m.moduleName || `Модуль ${idx + 1}`,
						order: Number(m.order ?? idx + 1),
						status: 'draft',
						subModules: (m.subModules ?? []).map((s, sIdx) => ({
							id: s.subModuleId ?? `sub-${idx}-${sIdx}`,
							moduleId: m.moduleId ?? `mod-${idx}`,
							title: s.subModuleName,
							order: Number(s.order ?? sIdx + 1),
							steps: [],
						})),
					}))
					setModules(mapped)
				})
				.catch(() => setModules([]))
				.finally(() => setIsLoadingSyllabus(false))
		}
	}, [course?.id, course?.modules])

	if (loading && !course) {
		return (
			<div className='rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm'>
				Загрузка информации о курсе...
			</div>
		)
	}

	if (!course) return null

	const formattedPrice =
		course.price && course.price > 0
			? `${course.price.toLocaleString()} ${course.currency}`
			: 'Бесплатно'

	const formattedCreatedDate = course.createdAt
		? new Date(course.createdAt).toLocaleDateString('ru-RU', {
				day: 'numeric',
				month: 'short',
				year: 'numeric',
		  })
		: 'Не указано'

	const formattedUpdatedDate = course.updatedAt
		? new Date(course.updatedAt).toLocaleDateString('ru-RU', {
				day: 'numeric',
				month: 'short',
				year: 'numeric',
		  })
		: 'Не указано'

	return (
		<div className='space-y-6'>
			{/* Top Hero Card */}
			<CourseOverviewHero course={course} />

			{/* Metrics Dashboard */}
			<div className='grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4'>
				<div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
					<p className='text-xs font-medium text-slate-500'>Студенты на курсе</p>
					<p className='mt-1 text-2xl font-bold text-slate-900'>
						{enrolledCount !== null ? enrolledCount : '...'}
					</p>
					<p className='mt-1 text-[11px] text-slate-400'>Активные зачисления</p>
				</div>

				<div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
					<p className='text-xs font-medium text-slate-500'>Модулей в программе</p>
					<p className='mt-1 text-2xl font-bold text-slate-900'>
						{modules.length > 0 ? modules.length : course.modulesCount ?? 0}
					</p>
					<p className='mt-1 text-[11px] text-slate-400'>Тематических разделов</p>
				</div>

				<div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
					<p className='text-xs font-medium text-slate-500'>Стоимость доступа</p>
					<p className='mt-1 text-xl font-bold text-slate-900 truncate'>{formattedPrice}</p>
					<p className='mt-1 text-[11px] text-slate-400'>
						{course.price && course.price > 0 ? 'Платное обучение' : 'Свободный доступ'}
					</p>
				</div>

				<div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
					<p className='text-xs font-medium text-slate-500'>Последнее обновление</p>
					<p className='mt-1 text-lg font-bold text-slate-900 truncate'>{formattedUpdatedDate}</p>
					<p className='mt-1 text-[11px] text-slate-400'>Создан: {formattedCreatedDate}</p>
				</div>
			</div>

			{/* Curriculum Preview */}
			<CourseCurriculumSummary
				courseId={course.id}
				modules={modules}
				isLoading={isLoadingSyllabus}
			/>
		</div>
	)
}

export default CourseOverview
