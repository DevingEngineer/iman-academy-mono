'use client'

import { Button } from '@/src/components/UI/Button'
import { Link } from '@/src/i18n/navigation'
import { fetchCourse, fetchCourseSyllabus } from '@/src/lib/auth-api'
import type { CourseDto, SyllabusTreeDto } from '@/src/types/auth'
import { useEffect, useState } from 'react'

type CoursePreviewProps = {
	courseId: string
}

export const CoursePreview = ({ courseId }: CoursePreviewProps) => {
	const [course, setCourse] = useState<CourseDto | null>(null)
	const [syllabus, setSyllabus] = useState<SyllabusTreeDto | null>(null)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		Promise.all([fetchCourse(courseId), fetchCourseSyllabus(courseId)])
			.then(([courseData, syllabusData]) => {
				setCourse(courseData)
				setSyllabus(syllabusData)
			})
			.catch(() => setError('Не удалось загрузить информацию о курсе.'))
	}, [courseId])

	if (error) {
		return <p className='py-10 text-secondary_text'>{error}</p>
	}

	if (!course || !syllabus) {
		return <p className='py-10 text-secondary_text'>Загрузка курса...</p>
	}

	return (
		<section className='py-8'>
			<div className='overflow-hidden rounded-[16px] border border-[#E6E8EC] bg-white'>
				{course.thumbnailUrl && (
					<img
						src={course.thumbnailUrl}
						alt={course.title}
						className='h-[280px] w-full object-cover'
					/>
				)}
				<div className='p-6'>
					<div className='flex items-start justify-between gap-6 w750:flex-col'>
						<div>
							<h1 className='h1 text-primary_text'>{course.title}</h1>
							{course.language && (
								<p className='mt-2 text-sm text-secondary_text'>
									Язык курса: {course.language}
								</p>
							)}
						</div>
						<Link href='/payment'>
							<Button variant='contained' className='shrink-0 px-6'>
								Купить курс
							</Button>
						</Link>
					</div>

					{course.description && (
						<p className='mt-6 max-w-[800px] whitespace-pre-line body1 text-secondary_text'>
							{course.description}
						</p>
					)}

					<div className='mt-6 flex flex-wrap gap-3 text-sm text-secondary_text'>
						<span className='rounded-full bg-[#F9FAFB] px-4 py-2'>
							{course.modulesCount} модулей
						</span>
						{course.level !== null && (
							<span className='rounded-full bg-[#F9FAFB] px-4 py-2'>
								Уровень {course.level}
							</span>
						)}
						{course.price !== null && (
							<span className='rounded-full bg-[#F9FAFB] px-4 py-2'>
								{course.price} {course.currency ?? ''}
							</span>
						)}
					</div>
				</div>
			</div>

			<div className='mt-8 rounded-[16px] border border-[#E6E8EC] bg-white p-6'>
				<h2 className='h2 text-primary_text'>Содержание курса</h2>
				<div className='mt-6 space-y-5'>
					{syllabus.modules.map((module, moduleIndex) => (
						<div key={module.moduleId ?? moduleIndex} className='border-b border-[#E6E8EC] pb-5 last:border-0 last:pb-0'>
							<div className='flex items-center justify-between gap-4'>
								<h3 className='text-[18px] font-semibold text-primary_text'>
									{Number(module.order) + 1}. {module.moduleName}
								</h3>
								<span className='text-sm text-secondary_text'>
									{module.subModules.length} тем
								</span>
							</div>
							{module.subModules.length > 0 && (
								<ul className='mt-3 space-y-2 pl-5 text-sm text-secondary_text'>
									{module.subModules.map((subModule, subModuleIndex) => (
										<li key={subModule.subModuleId ?? subModuleIndex}>
											{subModule.subModuleId ? (
												<Link
													href={`/courses/${courseId}/submodules/${subModule.subModuleId}`}
													className='text-primary_text underline-offset-4 hover:underline'
												>
													{Number(subModule.order) + 1}. {subModule.subModuleName}
												</Link>
											) : (
												`${Number(subModule.order) + 1}. ${subModule.subModuleName}`
											)}
										</li>
									))}
								</ul>
							)}
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
