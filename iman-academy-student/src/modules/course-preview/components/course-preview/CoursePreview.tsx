'use client'

import { Button } from '@/src/components/UI/Button'
import { Link } from '@/src/i18n/navigation'
import {
	fetchCourse,
	fetchCourseSyllabus,
	fetchMyCourseEnrollment,
	requestEnrollment,
} from '@/src/lib/auth-api'
import {
	getCourseLevelLabel,
	getEnrollmentActionState,
	isEnrollmentActive,
} from '@/src/lib/course-utils'
import type {
	CourseDto,
	StudentEnrollmentDto,
	SyllabusTreeDto,
} from '@/src/types/auth'
import Image from 'next/image'
import { useEffect, useState } from 'react'

type CoursePreviewProps = {
	courseId: string
}

export const CoursePreview = ({ courseId }: CoursePreviewProps) => {
	const [course, setCourse] = useState<CourseDto | null>(null)
	const [syllabus, setSyllabus] = useState<SyllabusTreeDto | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [requestState, setRequestState] = useState<'idle' | 'loading' | 'sent'>('idle')
	const [requestError, setRequestError] = useState<string | null>(null)
	const [enrollment, setEnrollment] = useState<StudentEnrollmentDto | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	const loadData = async () => {
		setIsLoading(true)
		setError(null)
		try {
			const [courseData, syllabusData] = await Promise.all([
				fetchCourse(courseId),
				fetchCourseSyllabus(courseId),
			])
			setCourse(courseData)
			setSyllabus(syllabusData)
		} catch {
			setError('Не удалось загрузить информацию о курсе.')
		} finally {
			setIsLoading(false)
		}

		fetchMyCourseEnrollment(courseId)
			.then(setEnrollment)
			.catch((enrollmentError: unknown) => {
				if (!isMissingEnrollment(enrollmentError)) {
					setRequestError('Не удалось загрузить статус заявки.')
				}
			})
	}

	useEffect(() => {
		void loadData()
	}, [courseId])

	const handleEnrollmentRequest = async () => {
		setRequestState('loading')
		setRequestError(null)

		try {
			await requestEnrollment(courseId)
			setRequestState('sent')
			void fetchMyCourseEnrollment(courseId)
				.then((nextEnrollment) => {
					setEnrollment(nextEnrollment)
					setRequestState('idle')
				})
				.catch(() => {
					setRequestState('idle')
				})
		} catch {
			setRequestState('idle')
			setRequestError('Не удалось отправить заявку. Попробуйте ещё раз.')
		}
	}

	const actionState = getEnrollmentActionState(enrollment, requestState)
	const userCanStudy = isEnrollmentActive(enrollment)

	const firstSubModuleId = syllabus?.modules?.flatMap((m) => m.subModules)?.find(
		(sm) => sm.subModuleId
	)?.subModuleId

	const totalSubmodules =
		syllabus?.modules?.reduce((acc, m) => acc + (m.subModules?.length || 0), 0) ?? 0

	if (isLoading) {
		return (
			<section className='py-8'>
				<div className='animate-pulse space-y-6'>
					<div className='h-8 w-48 rounded bg-gray-200' />
					<div className='h-72 w-full rounded-2xl bg-gray-200' />
					<div className='h-48 w-full rounded-2xl bg-gray-200' />
				</div>
			</section>
		)
	}

	if (error || !course || !syllabus) {
		return (
			<section className='py-12 text-center'>
				<div className='mx-auto max-w-md rounded-2xl border border-[#E6E8EC] bg-white p-8 shadow-sm'>
					<p className='text-secondary_text'>{error ?? 'Курс не найден.'}</p>
					<div className='mt-6 flex justify-center gap-3'>
						<Button variant='contained' onClick={() => void loadData()}>
							Повторить
						</Button>
						<Link
							href='/courses'
							className='flex items-center rounded-lg border border-border_devider px-4 py-2 text-sm text-primary_text hover:bg-gray-50'
						>
							В каталог
						</Link>
					</div>
				</div>
			</section>
		)
	}

	return (
		<section className='py-8'>
			{/* Breadcrumb Navigation */}
			<div className='mb-6 flex items-center gap-2 text-sm text-secondary_text'>
				<Link href='/courses' className='hover:text-primary_text hover:underline'>
					← Каталог курсов
				</Link>
				<span>/</span>
				<span className='truncate text-primary_text font-medium'>{course.title}</span>
			</div>

			{/* Course Hero Banner */}
			<div className='overflow-hidden rounded-[16px] border border-[#E6E8EC] bg-white shadow-sm'>
				{course.thumbnailUrl ? (
					<div className='relative h-[280px] w-full bg-slate-100'>
						<Image
							src={course.thumbnailUrl}
							alt={course.title}
							fill
							sizes='(max-width: 1200px) 100vw, 1200px'
							className='object-cover'
						/>
					</div>
				) : (
					<div className='h-[160px] w-full bg-gradient-to-r from-[#091E3A] via-[#2F80ED] to-[#2D9EE0] p-8 flex items-end'>
						<span className='rounded-full bg-white/20 px-3 py-1 text-xs text-white backdrop-blur-sm'>
							{getCourseLevelLabel(course.level)}
						</span>
					</div>
				)}

				<div className='p-6'>
					<div className='flex items-start justify-between gap-6 w750:flex-col'>
						<div className='flex-1'>
							<div className='flex flex-wrap items-center gap-2 mb-2'>
								<span className='rounded-full bg-[#F0F5FF] px-3 py-1 text-xs font-medium text-[#2563EB]'>
									{getCourseLevelLabel(course.level)}
								</span>
								{course.language && (
									<span className='rounded-full bg-gray-100 px-3 py-1 text-xs text-secondary_text'>
										Язык: {course.language}
									</span>
								)}
								{course.tags &&
									course.tags.map((tag) => (
										<span
											key={tag}
											className='rounded-full bg-gray-50 px-2.5 py-0.5 text-xs text-secondary_text border border-gray-200'
										>
											#{tag}
										</span>
									))}
							</div>

							<h1 className='h1 text-primary_text'>{course.title}</h1>

							{course.description && (
								<p className='mt-3 body1 text-secondary_text max-w-3xl whitespace-pre-line'>
									{course.description}
								</p>
							)}
						</div>

						{/* Action Area */}
						<div className='flex shrink-0 flex-col items-end gap-2 w750:w-full w750:items-stretch'>
							{userCanStudy ? (
								firstSubModuleId ? (
									<Link href={`/courses/${courseId}/submodules/${firstSubModuleId}`} className='w-full'>
										<Button variant='contained' className='w-full px-6 py-3 font-semibold'>
											Продолжить обучение →
										</Button>
									</Link>
								) : (
									<Button variant='contained' disabled className='w-full px-6 py-3'>
										Уроки скоро появятся
									</Button>
								)
							) : (
								<Button
									variant='contained'
									className='w-full px-6 py-3'
									onClick={handleEnrollmentRequest}
									disabled={actionState.disabled}
								>
									{actionState.label}
								</Button>
							)}

							{enrollment && (
								<div className='text-right text-xs text-secondary_text w750:text-left'>
									<span>
										Зачисление: {formatEnrollmentDate(enrollment.enrolledAt)}
									</span>
									{enrollment.progressPercent !== null && (
										<span className='ml-2 font-medium text-[#2563EB]'>
											• Прогресс: {enrollment.progressPercent}%
										</span>
									)}
								</div>
							)}

							{requestError && (
								<p className='text-xs text-system_error'>{requestError}</p>
							)}
						</div>
					</div>

					{/* Metadata Badges */}
					<div className='mt-6 flex flex-wrap gap-3 border-t border-[#E6E8EC] pt-4 text-xs text-secondary_text'>
						<span className='rounded-full bg-[#F9FAFB] px-3.5 py-1.5 font-medium'>
							Модулей: {syllabus.modules.length}
						</span>
						<span className='rounded-full bg-[#F9FAFB] px-3.5 py-1.5 font-medium'>
							Всего тем: {totalSubmodules}
						</span>
						{course.price !== null && (
							<span className='rounded-full bg-[#F9FAFB] px-3.5 py-1.5 font-medium text-primary_text'>
								{Number(course.price) === 0
									? 'Бесплатно'
									: `${course.price} ${course.currency ?? 'USD'}`}
							</span>
						)}
					</div>
				</div>
			</div>

			{/* Course Syllabus / Content */}
			<div className='mt-8 rounded-[16px] border border-[#E6E8EC] bg-white p-6 shadow-sm'>
				<div className='flex items-center justify-between pb-4 border-b border-[#E6E8EC]'>
					<h2 className='h2 text-primary_text'>Содержание курса</h2>
					<span className='text-sm text-secondary_text'>
						{syllabus.modules.length} модулей · {totalSubmodules} тем
					</span>
				</div>

				{syllabus.modules.length === 0 ? (
					<p className='py-8 text-center text-secondary_text'>
						В этом курсе пока нет добавленных модулей.
					</p>
				) : (
					<div className='mt-6 space-y-6'>
						{syllabus.modules.map((module, moduleIndex) => (
							<div
								key={module.moduleId ?? moduleIndex}
								className='rounded-xl border border-gray-100 bg-[#FAFAFC] p-5'
							>
								<div className='flex items-center justify-between gap-4'>
									<div className='flex items-center gap-3'>
										<span className='flex h-7 w-7 items-center justify-center rounded-full bg-accent_brand text-xs font-bold text-primary_text'>
											{moduleIndex + 1}
										</span>
										<h3 className='text-[17px] font-semibold text-primary_text'>
											{module.moduleName}
										</h3>
									</div>
									<span className='text-xs text-secondary_text font-medium'>
										{module.subModules.length} тем
									</span>
								</div>

								{module.subModules.length > 0 && (
									<ul className='mt-4 divide-y divide-gray-100 rounded-lg bg-white border border-gray-100'>
										{module.subModules.map((subModule, subModuleIndex) => {
											const isAvailable = userCanStudy && Boolean(subModule.subModuleId)

											return (
												<li
													key={subModule.subModuleId ?? subModuleIndex}
													className='flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-gray-50'
												>
													<div className='flex items-center gap-3 flex-1 min-w-0 pr-4'>
														<span className='text-xs text-secondary_text font-mono'>
															{moduleIndex + 1}.{subModuleIndex + 1}
														</span>
														{isAvailable ? (
															<Link
																href={`/courses/${courseId}/submodules/${subModule.subModuleId}`}
																className='truncate font-medium text-primary_text underline-offset-4 hover:underline hover:text-[#2563EB]'
															>
																{subModule.subModuleName}
															</Link>
														) : (
															<span className='truncate text-primary_text font-medium'>
																{subModule.subModuleName}
															</span>
														)}
													</div>

													<div className='shrink-0'>
														{isAvailable ? (
															<Link
																href={`/courses/${courseId}/submodules/${subModule.subModuleId}`}
																className='rounded-md bg-accent_brand px-3 py-1 text-xs font-medium text-primary_text hover:opacity-90'
															>
																Перейти →
															</Link>
														) : userCanStudy ? (
															<span className='text-xs text-secondary_text'>
																Скоро
															</span>
														) : (
															<span className='text-xs text-secondary_text'>
																🔒 Доступ по заявке
															</span>
														)}
													</div>
												</li>
											)
										})}
									</ul>
								)}
							</div>
						))}
					</div>
				)}
			</div>
		</section>
	)
}

function isMissingEnrollment(error: unknown): boolean {
	return (
		typeof error === 'object' &&
		error !== null &&
		'status' in error &&
		(error as { status?: number }).status === 404
	)
}

function formatEnrollmentDate(value: string | null | undefined): string {
	if (!value) return 'дата не указана'

	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return value

	return new Intl.DateTimeFormat('ru-RU', {
		dateStyle: 'short',
		timeStyle: 'short',
	}).format(date)
}
