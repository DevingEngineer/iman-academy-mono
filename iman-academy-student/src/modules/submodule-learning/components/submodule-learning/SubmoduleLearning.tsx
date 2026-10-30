'use client'

import { Button } from '@/src/components/UI/Button'
import { Link } from '@/src/i18n/navigation'
import { fetchSubModule } from '@/src/lib/auth-api'
import { formatDurationMinutes, formatSecondsToTime } from '@/src/lib/course-utils'
import type { QuizStepDto, StepDto, SubModuleDto } from '@/src/types/auth'
import { useEffect, useState } from 'react'
import { QuizStepPlayer } from '../quiz-step-player/QuizStepPlayer'

type SubmoduleLearningProps = {
	courseId?: string
	subModuleId: string
}

const StepContent = ({ step }: { step: StepDto }) => {
	if (step.stepType === 'Video' && step.videoUrl) {
		return (
			<div className='space-y-6'>
				<div className='overflow-hidden rounded-2xl bg-black'>
					<video controls className='w-full aspect-video' src={step.videoUrl}>
						Ваш браузер не поддерживает воспроизведение видео.
					</video>
				</div>

				{step.durationSeconds ? (
					<p className='text-xs text-secondary_text'>
						Длительность: {formatSecondsToTime(step.durationSeconds)}
					</p>
				) : null}

				{step.transcript && (
					<div className='rounded-xl border border-gray-100 bg-[#FAFAFC] p-5'>
						<h4 className='text-sm font-semibold text-primary_text mb-2'>Конспект / Транскрипт</h4>
						<p className='text-sm text-secondary_text whitespace-pre-line leading-relaxed'>
							{step.transcript}
						</p>
					</div>
				)}
			</div>
		)
	}

	if (step.stepType === 'Quiz') {
		return <QuizStepPlayer step={step as QuizStepDto} />
	}

	if (step.body) {
		return (
			<div className='space-y-6'>
				<div
					className='prose max-w-none text-primary_text'
					dangerouslySetInnerHTML={{ __html: step.body }}
				/>

				{step.attachments && step.attachments.length > 0 && (
					<div className='mt-8 rounded-xl border border-[#E6E8EC] bg-[#FAFAFC] p-5'>
						<h4 className='text-sm font-semibold text-primary_text mb-3'>
							Прикреплённые материалы ({step.attachments.length})
						</h4>
						<ul className='space-y-2'>
							{step.attachments.map((file) => (
								<li
									key={file.id}
									className='flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-sm'
								>
									<span className='truncate font-medium text-primary_text'>{file.name}</span>
									<a
										href={file.url}
										target='_blank'
										rel='noopener noreferrer'
										className='shrink-0 rounded-md bg-[#2563EB] px-3 py-1 text-xs font-medium text-white hover:opacity-90'
									>
										Скачать
									</a>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		)
	}

	return <p className='text-secondary_text'>Содержание шага пока не добавлено.</p>
}

export const SubmoduleLearning = ({ courseId, subModuleId }: SubmoduleLearningProps) => {
	const [subModule, setSubModule] = useState<SubModuleDto | null>(null)
	const [selectedStepId, setSelectedStepId] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		setIsLoading(true)
		setError(null)
		fetchSubModule(subModuleId)
			.then((data) => {
				const steps = [...data.steps].sort(
					(first, second) => Number(first.order) - Number(second.order)
				)
				setSubModule({ ...data, steps })
				setSelectedStepId(steps[0]?.id ?? null)
			})
			.catch(() => setError('Не удалось загрузить содержание подмодуля.'))
			.finally(() => setIsLoading(false))
	}, [subModuleId])

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
				<div className='flex items-center justify-between gap-4'>
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
				<aside className='rounded-[16px] border border-[#E6E8EC] bg-white p-4 shadow-sm self-start'>
					<h2 className='px-2 pb-3 text-[16px] font-semibold text-primary_text border-b border-gray-100'>
						Шаги ({subModule.steps.length})
					</h2>
					<nav className='mt-3 space-y-1.5' aria-label='Шаги подмодуля'>
						{subModule.steps.map((step, index) => {
							const isSelected = step.id === selectedStep?.id
							const stepBadge =
								step.stepType === 'Quiz'
									? 'Тест'
									: step.stepType === 'Video'
										? 'Видео'
										: 'Текст'

							return (
								<button
									key={step.id ?? index}
									type='button'
									onClick={() => setSelectedStepId(step.id)}
									className={`w-full rounded-[10px] p-3 text-left transition-colors ${
										isSelected
											? 'bg-accent_brand text-primary_text font-semibold'
											: 'hover:bg-[#F9FAFB] text-primary_text'
									}`}
								>
									<span className='block text-sm leading-snug'>
										{index + 1}. {step.title}
									</span>
									<span className='mt-1 block text-xs text-secondary_text'>
										{stepBadge}
									</span>
								</button>
							)
						})}
					</nav>
				</aside>

				<article className='min-h-[460px] rounded-[16px] border border-[#E6E8EC] bg-white p-8 w750:p-5 shadow-sm flex flex-col justify-between'>
					{selectedStep ? (
						<div>
							<div className='mb-8 border-b border-[#E6E8EC] pb-5'>
								<div className='flex items-center gap-2 text-xs text-secondary_text mb-2'>
									<span className='rounded bg-gray-100 px-2 py-0.5 font-medium'>
										{selectedStep.stepType}
									</span>
									{selectedStep.estimatedDurationMinutes && (
										<span>~{selectedStep.estimatedDurationMinutes} мин.</span>
									)}
								</div>
								<h2 className='h2 text-primary_text'>{selectedStep.title}</h2>
								{selectedStep.description && (
									<p className='mt-2 body1 text-secondary_text'>
										{selectedStep.description}
									</p>
								)}
							</div>

							<StepContent step={selectedStep} />
						</div>
					) : (
						<p className='text-secondary_text'>В этом подмодуле пока нет шагов.</p>
					)}

					{/* Navigation Footer */}
					{subModule.steps.length > 0 && (
						<div className='mt-12 flex items-center justify-between border-t border-[#E6E8EC] pt-6'>
							<Button
								variant='outlined'
								onClick={() => setSelectedStepId(subModule.steps[activeIndex - 1]?.id ?? null)}
								disabled={!hasPrev}
								className='px-4'
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
