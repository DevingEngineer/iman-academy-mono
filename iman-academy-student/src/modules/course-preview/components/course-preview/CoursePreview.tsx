'use client'

import { Button } from '@/src/components/UI/Button'
import { Link } from '@/src/i18n/navigation'
import {
	fetchCourse,
	fetchCourseSyllabus,
	fetchMyCourseEnrollment,
	requestEnrollment,
} from '@/src/lib/auth-api'
import type {
	CourseDto,
	StudentEnrollmentDto,
	SyllabusTreeDto,
} from '@/src/types/auth'
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

	useEffect(() => {
		Promise.all([fetchCourse(courseId), fetchCourseSyllabus(courseId)])
			.then(([courseData, syllabusData]) => {
				setCourse(courseData)
				setSyllabus(syllabusData)
			})
			.catch(() => setError('Не удалось загрузить информацию о курсе.'))

		fetchMyCourseEnrollment(courseId)
			.then(setEnrollment)
			.catch((enrollmentError: unknown) => {
				if (!isMissingEnrollment(enrollmentError)) {
					setRequestError('Не удалось загрузить статус заявки.')
				}
			})
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
		} catch {
			setRequestState('idle')
			setRequestError('Не удалось отправить заявку. Попробуйте ещё раз.')
		}
	}

	const enrollmentButton = getEnrollmentButton(enrollment, requestState)

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
						<div className='flex shrink-0 flex-col items-end gap-1'>
							{!enrollment && (
								<Button
									variant='contained'
									className='px-6'
									onClick={handleEnrollmentRequest}
									disabled={enrollmentButton.disabled}
								>
									{enrollmentButton.label}
								</Button>
							)}
							{enrollment && requestState !== 'sent' && (
								<div className='text-right'>
									<p className='text-sm font-medium text-primary_text'>
										{enrollmentButton.label}
									</p>
									<p className='mt-1 text-xs text-secondary_text'>
										Заявка от {formatEnrollmentDate(enrollment.enrolledAt)}
									</p>
								</div>
							)}
							{requestError && (
								<p className='max-w-[220px] text-right text-sm text-red-600'>
									{requestError}
								</p>
							)}
						</div>
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

function isMissingEnrollment(error: unknown): boolean {
	return typeof error === 'object' && error !== null && 'status' in error &&
		(error as { status?: number }).status === 404
}

function getEnrollmentButton(
	enrollment: StudentEnrollmentDto | null,
	requestState: 'idle' | 'loading' | 'sent'
): { label: string; disabled: boolean } {
	if (requestState === 'loading') return { label: 'Отправка...', disabled: true }
	if (requestState === 'sent') return { label: 'Заявка отправлена', disabled: true }

	if (!enrollment) return { label: 'Запросить доступ', disabled: false }

	const status = enrollment.status
	const normalizedStatus = typeof status === 'string' ? status.toLowerCase() : status
	if (normalizedStatus === 'approved' || normalizedStatus === 'enrolled' || normalizedStatus === 1) {
		return { label: 'Вы зачислены', disabled: true }
	}
	if (normalizedStatus === 'pending' || normalizedStatus === 'requested' || normalizedStatus === 0) {
		return { label: 'Заявка на рассмотрении', disabled: true }
	}
	if (normalizedStatus === 'rejected' || normalizedStatus === 'declined' || normalizedStatus === 2) {
		return { label: 'Заявка отклонена', disabled: true }
	}
	if (normalizedStatus === 'completed' || normalizedStatus === 3) {
		return { label: 'Курс завершён', disabled: true }
	}

	return { label: `Статус заявки: ${String(status)}`, disabled: true }
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
