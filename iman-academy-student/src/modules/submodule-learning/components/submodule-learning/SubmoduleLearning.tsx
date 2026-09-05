'use client'

import { fetchSubModule } from '@/src/lib/auth-api'
import type { StepDto, SubModuleDto } from '@/src/types/auth'
import { useEffect, useState } from 'react'

type SubmoduleLearningProps = {
	subModuleId: string
}

const getStatusLabel = (status: number) => `Статус: ${status}`

const StepContent = ({ step }: { step: StepDto }) => {
	if (step.stepType === 'Video' && step.videoUrl) {
		return (
			<video controls className='w-full rounded-[12px]' src={step.videoUrl}>
				Ваш браузер не поддерживает воспроизведение видео.
			</video>
		)
	}

	if (step.stepType === 'Quiz') {
		return (
			<div className='rounded-[12px] bg-[#F9FAFB] p-6 text-secondary_text'>
				<p>Тест будет доступен в этом шаге.</p>
			</div>
		)
	}

	if (step.body) {
		return (
			<div
				className='prose max-w-none text-primary_text'
				dangerouslySetInnerHTML={{ __html: step.body }}
			/>
		)
	}

	return <p className='text-secondary_text'>Содержание шага пока не добавлено.</p>
}

export const SubmoduleLearning = ({ subModuleId }: SubmoduleLearningProps) => {
	const [subModule, setSubModule] = useState<SubModuleDto | null>(null)
	const [selectedStepId, setSelectedStepId] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		fetchSubModule(subModuleId)
			.then((data) => {
				const steps = [...data.steps].sort(
					(first, second) => Number(first.order) - Number(second.order)
				)
				setSubModule({ ...data, steps })
				setSelectedStepId(steps[0]?.id ?? null)
			})
			.catch(() => setError('Не удалось загрузить содержание подмодуля.'))
	}, [subModuleId])

	if (error) return <p className='py-10 text-secondary_text'>{error}</p>
	if (!subModule) return <p className='py-10 text-secondary_text'>Загрузка шага...</p>

	const selectedStep = subModule.steps.find((step) => step.id === selectedStepId) ?? subModule.steps[0]

	return (
		<section className='py-8'>
			<header className='mb-8 rounded-[16px] border border-[#E6E8EC] bg-white p-6'>
				<p className='text-sm text-secondary_text'>Подмодуль</p>
				<h1 className='h1 mt-2 text-primary_text'>{subModule.title}</h1>
				{subModule.description && (
					<p className='mt-3 max-w-[760px] body1 text-secondary_text'>
						{subModule.description}
					</p>
				)}
			</header>

			<div className='grid grid-cols-[280px_minmax(0,1fr)] gap-8 w850:grid-cols-1'>
				<aside className='rounded-[16px] border border-[#E6E8EC] bg-white p-4'>
					<h2 className='px-2 pb-3 text-[16px] font-semibold text-primary_text'>
						Шаги
					</h2>
					<nav className='space-y-2' aria-label='Шаги подмодуля'>
						{subModule.steps.map((step, index) => {
							const isSelected = step.id === selectedStep?.id

							return (
								<button
									key={step.id ?? index}
									type='button'
									onClick={() => setSelectedStepId(step.id)}
									className={`w-full rounded-[10px] p-3 text-left transition-colors ${
										isSelected
											? 'bg-accent_brand text-primary_text'
											: 'hover:bg-[#F9FAFB]'
									}`}
								>
									<span className='block text-sm font-medium'>
										{Number(step.order) + 1}. {step.title}
									</span>
									<span className='mt-1 block text-xs text-secondary_text'>
										{getStatusLabel(step.status)}
									</span>
								</button>
							)
						})}
					</nav>
				</aside>

				<article className='min-h-[420px] rounded-[16px] border border-[#E6E8EC] bg-white p-8 w750:p-5'>
					{selectedStep ? (
						<>
							<div className='mb-8 border-b border-[#E6E8EC] pb-5'>
								<p className='text-sm text-secondary_text'>
									{selectedStep.stepType} · {getStatusLabel(selectedStep.status)}
								</p>
								<h2 className='h2 mt-2 text-primary_text'>{selectedStep.title}</h2>
								{selectedStep.description && (
									<p className='mt-2 body1 text-secondary_text'>
										{selectedStep.description}
									</p>
								)}
							</div>
							<StepContent step={selectedStep} />
						</>
					) : (
						<p className='text-secondary_text'>В этом подмодуле пока нет шагов.</p>
					)}
				</article>
			</div>
		</section>
	)
}
