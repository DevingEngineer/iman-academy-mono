'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from './ui/Button'
import { useCourses } from '../hooks/useCourses'
import { fetchCourseSyllabusApi } from '../lib/api'
import type { Module } from '../types/course-types'

const mapBackendSyllabusToModules = (courseId: string, remoteModules: { moduleId?: string | null; moduleName?: string; order?: number | string; subModules?: Array<{ subModuleId?: string | null; subModuleName?: string; order?: number | string; moduleId?: string | null }> }[] = []): Module[] =>
	remoteModules.map((module, moduleIndex) => ({
		id: module.moduleId ?? `module-${courseId}-${moduleIndex}`,
		courseId,
		title: module.moduleName ?? `Module ${moduleIndex + 1}`,
		order: Number(module.order ?? moduleIndex + 1),
		status: 'draft',
		subModules: (module.subModules ?? []).map((subModule, subModuleIndex) => ({
			id: subModule.subModuleId ?? `submodule-${courseId}-${moduleIndex}-${subModuleIndex}`,
			moduleId: subModule.moduleId ?? `module-${courseId}-${moduleIndex}`,
			title: subModule.subModuleName ?? `Submodule ${subModuleIndex + 1}`,
			order: Number(subModule.order ?? subModuleIndex + 1),
			steps: [],
		})),
	}))

export const CourseSyllabus = ({ courseSlug }: { courseSlug: string }) => {
	const router = useRouter()
	const courses = useCourses()
	const cleanSlug = decodeURIComponent(courseSlug)
	const [backendModules, setBackendModules] = useState<Module[]>([])
	const [isLoading, setIsLoading] = useState(false)

	const course = courses.find((item) => item.id === cleanSlug || item.slug === cleanSlug)

	useEffect(() => {
		if (!course?.id || course.id.startsWith('temp-')) {
			return
		}

		let isMounted = true
		setIsLoading(true)

		fetchCourseSyllabusApi(course.id)
			.then((tree) => {
				if (!isMounted) return
				setBackendModules(mapBackendSyllabusToModules(course.id, tree.modules ?? []))
			})
			.catch(() => {
				if (isMounted) setBackendModules([...course.modules])
			})
			.finally(() => {
				if (isMounted) setIsLoading(false)
			})

		return () => {
			isMounted = false
		}
	}, [course?.id, course?.modules])

	if (!course) return null

	const modules = backendModules.length > 0 ? backendModules : [...course.modules].sort((a, b) => a.order - b.order)

	return (
		<div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
			<div className='flex items-center justify-between gap-4'>
				<div>
					<h2 className='text-lg font-semibold text-slate-900'>Содержание курса</h2>
					<p className='mt-2 text-sm text-slate-500'>Модули и подразделы курса.</p>
				</div>
				<Button onClick={() => router.push(`/courses/${courseSlug}/content/edit`)}>
					Редактировать содержание
				</Button>
			</div>

			{isLoading && modules.length === 0 ? (
				<p className='mt-6 rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-500'>
					Загружаем содержание курса...
				</p>
			) : modules.length === 0 ? (
				<p className='mt-6 rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-500'>
					В содержании пока нет модулей.
				</p>
			) : (
				<ol className='mt-6 space-y-4'>
					{modules.map((module) => {
						const subModules = [...module.subModules].sort(
							(a, b) => a.order - b.order
						)

						return (
							<li key={module.id} className='rounded-xl border border-slate-200 p-4'>
								<p className='font-semibold text-slate-900'>
									{module.order}. {module.title}
								</p>
								{subModules.length > 0 && (
									<ol className='mt-3 space-y-2 pl-5 text-sm text-slate-600'>
										{subModules.map((subModule) => (
											<li key={subModule.id} className='flex items-center justify-between gap-3'>
												<span>{subModule.order}. {subModule.title}</span>
												<Button
													size='sm'
													variant='outlined'
													onClick={() =>
														router.push(
															`/courses/edit-lesson/${subModule.id}/step/1`
														)
													}
												>
													Редактировать
												</Button>
											</li>
										))}
									</ol>
								)}
							</li>
						)
					})}
				</ol>
			)}
		</div>
	)
}
