'use client'

import { Button } from '@/src/components/UI/Button'
import { Link } from '@/src/i18n/navigation'
import { fetchStep, fetchSubModule } from '@/src/lib/auth-api'
import { formatDurationMinutes, formatSecondsToTime } from '@/src/lib/course-utils'
import type { QuizStepDto, StepDto, SubModuleDto } from '@/src/types/auth'
import { useEffect, useState } from 'react'
import { QuizStepPlayer } from '../quiz-step-player/QuizStepPlayer'

type SubmoduleLearningProps = {
	courseId?: string
	subModuleId: string
}

type StepRequestState = {
	id: string
	step: StepDto | null
	error: string | null
}

type SubmoduleRequestState = {
	id: string
	subModule: SubModuleDto | null
	error: string | null
}

const normalizeStepType = (stepType: unknown) =>
	typeof stepType === 'string' ? stepType.toLowerCase() : ''

const getRuntimeStepType = (step: StepDto) => {
	const declaredType = normalizeStepType(step.stepType)
	if (declaredType) return declaredType

	if ('questions' in step && Array.isArray(step.questions)) return 'quiz'
	if ('videoUrl' in step && typeof step.videoUrl === 'string') return 'video'
	if ('body' in step && typeof step.body === 'string') return 'content'

	return ''
}

const getStepTypeLabel = (stepType: unknown) => {
	switch (normalizeStepType(stepType)) {
		case 'quiz':
			return 'Тест'
		case 'video':
			return 'Видео'
		case 'content':
			return 'Материал'
		default:
			return 'Шаг'
	}
}

const getStepTypeStyles = (stepType: unknown) => {
	switch (normalizeStepType(stepType)) {
		case 'quiz':
			return 'bg-violet-50 text-violet-700 ring-violet-100'
		case 'video':
			return 'bg-blue-50 text-blue-700 ring-blue-100'
		case 'content':
			return 'bg-emerald-50 text-emerald-700 ring-emerald-100'
		default:
			return 'bg-gray-100 text-gray-700 ring-gray-200'
	}
}

const StepContent = ({ step }: { step: StepDto }) => {
	const stepType = getRuntimeStepType(step)

	if (stepType === 'video' && 'videoUrl' in step) {
		if (!step.videoUrl) {
			return (
				<div className='rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center'>
					<p className='font-medium text-primary_text'>Видео пока недоступно</p>
					<p className='mt-2 text-sm text-secondary_text'>
						Ссылка на видео для этого шага ещё не добавлена.
					</p>
				</div>
			)
		}

		return (
			<div className='space-y-5'>
				<div className='overflow-hidden rounded-2xl bg-black shadow-sm ring-1 ring-black/5'>
					<video
						controls
						className='aspect-video w-full'
						src={step.videoUrl}
					>
						Ваш браузер не поддерживает воспроизведение видео.
					</video>
				</div>

				<div className='flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-sm text-blue-900'>
					{step.durationSeconds ? (
						<span>
							<span className='font-semibold'>Длительность:</span>{' '}
							{formatSecondsToTime(step.durationSeconds)}
						</span>
					) : null}
					{step.captionsUrl ? (
						<a
							href={step.captionsUrl}
							target='_blank'
							rel='noopener noreferrer'
							className='font-semibold underline underline-offset-2 hover:no-underline'
						>
							Открыть субтитры
						</a>
					) : null}
				</div>

				{step.transcript && (
					<details className='group rounded-2xl border border-gray-200 bg-white' open>
						<summary className='cursor-pointer list-none px-5 py-4 text-sm font-semibold text-primary_text'>
							<span className='flex items-center justify-between'>
								Конспект и транскрипт
								<span className='text-secondary_text transition-transform group-open:rotate-180'>⌄</span>
							</span>
						</summary>
						<p className='border-t border-gray-100 px-5 py-4 text-sm leading-relaxed text-secondary_text whitespace-pre-line'>
							{step.transcript}
						</p>
					</details>
				)}
			</div>
		)
	}

	if (stepType === 'quiz') {
		return <QuizStepPlayer step={step as QuizStepDto} />
	}

	if ('body' in step && step.body) {
		return (
			<div className='space-y-8'>
				<div className='rounded-2xl border border-gray-100 bg-white px-5 py-1 shadow-sm sm:px-7'>
					<div
						className='prose prose-slate max-w-none py-5 text-primary_text sm:py-7'
						dangerouslySetInnerHTML={{ __html: step.body }}
					/>
				</div>

				{'attachments' in step && step.attachments && step.attachments.length > 0 && (
					<div className='rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5'>
						<div className='mb-4'>
							<h4 className='text-sm font-semibold text-primary_text'>
								Дополнительные материалы
							</h4>
							<p className='mt-1 text-xs text-secondary_text'>
								Файлы, которые помогут закрепить материал.
							</p>
						</div>
						<ul className='grid gap-3 sm:grid-cols-2'>
							{step.attachments.map((file) => (
								<li
									key={file.id}
									className='flex min-w-0 items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-3 text-sm'
								>
									<div className='min-w-0'>
										<span className='block truncate font-medium text-primary_text'>{file.name}</span>
										<span className='mt-1 block text-xs text-secondary_text'>{file.mimeType}</span>
									</div>
									<a
										href={file.url}
										target='_blank'
										rel='noopener noreferrer'
										className='shrink-0 rounded-lg bg-[#2563EB] px-3 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90'
									>
										Открыть
									</a>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		)
	}

	return (
		<div className='rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center'>
			<p className='font-medium text-primary_text'>Содержание пока не добавлено</p>
			<p className='mt-2 text-sm text-secondary_text'>
				Попробуйте вернуться к этому шагу позже.
			</p>
		</div>
	)
}

export const SubmoduleLearning = ({ courseId, subModuleId }: SubmoduleLearningProps) => {
	const [submoduleRequest, setSubmoduleRequest] =
		useState<SubmoduleRequestState | null>(null)
	const [selectedStepId, setSelectedStepId] = useState<string | null>(null)
	const [stepRequest, setStepRequest] = useState<StepRequestState | null>(null)

	useEffect(() => {
		fetchSubModule(subModuleId)
			.then((data) => {
				const steps = [...data.steps].sort(
					(first, second) => Number(first.order) - Number(second.order)
				)
				setSubmoduleRequest({
					id: subModuleId,
					subModule: { ...data, steps },
					error: null,
				})
				setSelectedStepId(steps[0]?.id ?? null)
			})
			.catch(() =>
				setSubmoduleRequest({
					id: subModuleId,
					subModule: null,
					error: 'Не удалось загрузить содержание подмодуля.',
				})
			)
	}, [subModuleId])

	useEffect(() => {
		if (!selectedStepId) return

		let cancelled = false

		fetchStep(selectedStepId)
			.then((data) => {
				if (!cancelled) setStepRequest({ id: selectedStepId, step: data, error: null })
			})
			.catch(() => {
				if (!cancelled) {
					setStepRequest({
						id: selectedStepId,
						step: null,
						error: 'Не удалось загрузить содержание шага.',
					})
				}
			})

		return () => {
			cancelled = true
		}
	}, [selectedStepId])

	const isLoading = submoduleRequest?.id !== subModuleId
	const subModule =
		submoduleRequest?.id === subModuleId ? submoduleRequest.subModule : null
	const error =
		submoduleRequest?.id === subModuleId ? submoduleRequest.error : null

	if (isLoading) {
		return (
			<section className='py-8'>
				<div className='animate-pulse space-y-4'>
					<div className='h-24 w-full rounded-2xl bg-gray-200' />
					<div className='grid grid-cols-[280px_1fr] gap-6'>
						<div className='h-80 rounded-2xl bg-gray-200' />
						<div className='h-80 rounded-2xl bg-gray-200' />
					</div>
				</div>
			</section>
		)
	}

	if (error || !subModule) {
		return (
			<section className='py-12 text-center'>
				<div className='mx-auto max-w-md rounded-2xl border border-[#E6E8EC] bg-white p-8'>
					<p className='text-secondary_text'>{error ?? 'Подмодуль не найден.'}</p>
					{courseId && (
						<Link
							href={`/courses/${courseId}`}
							className='mt-4 inline-block text-sm text-[#2563EB] hover:underline'
						>
							← Вернуться к курсу
						</Link>
					)}
				</div>
			</section>
		)
	}

	const currentStepIndex = subModule.steps.findIndex((s) => s.id === selectedStepId)
	const selectedStep = subModule.steps[currentStepIndex >= 0 ? currentStepIndex : 0]
	const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 0
	const isStepLoading =
		!!selectedStep && stepRequest?.id !== selectedStep.id
	const stepError =
		stepRequest?.id === selectedStep?.id ? stepRequest.error : null
	const selectedStepWithDetails =
		stepRequest?.id === selectedStepId ? stepRequest.step : null

	const hasPrev = activeIndex > 0
	const hasNext = activeIndex < subModule.steps.length - 1

	return (
		<section className='py-8'>
			{courseId && (
				<div className='mb-6 flex items-center gap-2 text-sm text-secondary_text'>
					<Link href={`/courses/${courseId}`} className='hover:text-primary_text hover:underline'>
						← К содержанию курса
					</Link>
					<span>/</span>
					<span className='truncate text-primary_text font-medium'>{subModule.title}</span>
				</div>
			)}

			<header className='mb-8 rounded-[16px] border border-[#E6E8EC] bg-white p-6 shadow-sm'>
				<div className='flex items-start justify-between gap-4'>
					<div>
						<span className='rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#2563EB]'>
							Подмодуль
						</span>
						<h1 className='h1 mt-2 text-primary_text'>{subModule.title}</h1>
					</div>
					{subModule.estimatedDurationMinutes && (
						<span className='text-xs text-secondary_text'>
							~{formatDurationMinutes(subModule.estimatedDurationMinutes)}
						</span>
					)}
				</div>

				{subModule.description && (
					<p className='mt-3 max-w-[760px] body1 text-secondary_text'>
						{subModule.description}
					</p>
				)}
			</header>

			<div className='grid grid-cols-[280px_minmax(0,1fr)] gap-8 w850:grid-cols-1'>
				<aside className='self-start rounded-[16px] border border-[#E6E8EC] bg-white p-4 shadow-sm'>
					<div className='flex items-center justify-between border-b border-gray-100 px-2 pb-3'>
						<h2 className='text-[16px] font-semibold text-primary_text'>
							Шаги
						</h2>
						<span className='rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-secondary_text'>
							{activeIndex + 1}/{subModule.steps.length}
						</span>
					</div>
					<nav className='mt-3 space-y-1.5' aria-label='Шаги подмодуля'>
						{subModule.steps.map((step, index) => {
							const isSelected = step.id === selectedStep?.id
							const stepBadge = getStepTypeLabel(getRuntimeStepType(step))

							return (
								<button
									key={step.id ?? index}
									type='button'
									onClick={() => setSelectedStepId(step.id)}
									className={`w-full rounded-xl border p-3 text-left transition-all ${
										isSelected
											? 'border-blue-200 bg-blue-50 text-primary_text shadow-sm'
											: 'border-transparent text-primary_text hover:border-gray-200 hover:bg-[#F9FAFB]'
									}`}
								>
									<span className='flex items-start gap-3'>
										<span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-bold text-secondary_text ring-1 ring-gray-200'>
											{index + 1}
										</span>
										<span className='min-w-0'>
											<span className='block text-sm font-semibold leading-snug'>{step.title}</span>
											<span className='mt-2 flex items-center gap-2 text-xs text-secondary_text'>
												<span className={`rounded-full px-2 py-0.5 font-medium ring-1 ${getStepTypeStyles(getRuntimeStepType(step))}`}>
													{stepBadge}
												</span>
												{step.estimatedDurationMinutes ? `~${step.estimatedDurationMinutes} мин.` : null}
											</span>
										</span>
									</span>
								</button>
							)
						})}
					</nav>
				</aside>

				<article className='flex min-h-[460px] flex-col justify-between rounded-[16px] border border-[#E6E8EC] bg-white p-8 shadow-sm w750:p-5'>
					{selectedStep ? (
						<div>
							<div className='mb-8 border-b border-[#E6E8EC] pb-6'>
								<div className='mb-3 flex flex-wrap items-center gap-2 text-xs text-secondary_text'>
									<span className={`rounded-full px-2.5 py-1 font-semibold ring-1 ${getStepTypeStyles(selectedStepWithDetails?.stepType ?? selectedStep.stepType)}`}>
										{getStepTypeLabel(
											selectedStepWithDetails
												? getRuntimeStepType(selectedStepWithDetails)
												: getRuntimeStepType(selectedStep)
										)}
									</span>
									{selectedStep.estimatedDurationMinutes && (
										<span className='rounded-full bg-gray-100 px-2.5 py-1'>
											~{selectedStep.estimatedDurationMinutes} мин.
										</span>
									)}
								</div>
								<div className='flex items-start justify-between gap-4'>
									<h2 className='h2 text-primary_text'>{selectedStep.title}</h2>
									<span className='hidden shrink-0 text-xs font-medium text-secondary_text sm:block'>
										Шаг {activeIndex + 1} из {subModule.steps.length}
									</span>
								</div>
								{selectedStep.description && (
									<p className='mt-2 body1 text-secondary_text'>
										{selectedStep.description}
									</p>
								)}
							</div>

							{isStepLoading ? (
								<div className='space-y-4' aria-live='polite'>
									<div className='h-5 w-32 animate-pulse rounded bg-gray-200' />
									<div className='h-32 w-full animate-pulse rounded-2xl bg-gray-100' />
								</div>
							) : stepError ? (
								<p className='text-secondary_text'>{stepError}</p>
							) : selectedStepWithDetails ? (
								<StepContent step={selectedStepWithDetails} />
							) : null}
						</div>
					) : (
						<p className='text-secondary_text'>В этом подмодуле пока нет шагов.</p>
					)}

					{subModule.steps.length > 0 && (
						<div className='mt-12 flex items-center justify-between gap-3 border-t border-[#E6E8EC] pt-6'>
							<Button
								variant='outlined'
								onClick={() => setSelectedStepId(subModule.steps[activeIndex - 1]?.id ?? null)}
								disabled={!hasPrev}
								className='px-4 !text-primary_text'
							>
								← Предыдущий шаг
							</Button>

							<span className='text-xs text-secondary_text'>
								{activeIndex + 1} из {subModule.steps.length}
							</span>

							{hasNext ? (
								<Button
									variant='contained'
									onClick={() => setSelectedStepId(subModule.steps[activeIndex + 1]?.id ?? null)}
									className='px-5'
								>
									Следующий шаг →
								</Button>
							) : courseId ? (
								<Link href={`/courses/${courseId}`}>
									<Button variant='contained' className='bg-green-600 hover:bg-green-700 px-5'>
										Завершить тему ✓
									</Button>
								</Link>
							) : null}
						</div>
					)}
				</article>
			</div>
		</section>
	)
}
