'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type {
	ContentStatus,
	Course,
	QuizQuestion,
	QuizStep,
	Step,
	StepType,
	SubModule,
} from '../types/course-types'
import { fetchSubModuleSyncApi, syncSubModuleApi  } from '../lib/api'
import { Button } from './ui/Button'
import { EditorSyllabusNavigator } from './EditorSyllabusNavigator'
import dynamic from 'next/dynamic'

const createId = (_prefix?: string): string => {
	if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
		return crypto.randomUUID()
	}
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0
		const v = c === 'x' ? r : (r & 0x3) | 0x8
		return v.toString(16)
	})
}

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T

const normalizeSteps = (steps: Step[]) =>
	steps.map((step, index) => ({
		...step,
		order: index + 1,
	}))

const createQuestion = (): QuizQuestion => ({
	id: createId('question'),
	prompt: '',
	type: 'single-choice',
	options: [
		{ id: createId('option'), text: '' },
		{ id: createId('option'), text: '' },
	],
	correctOptionIds: [],
	points: 1,
})

const createStep = (stepType: StepType, subModuleId: string, order: number): Step => {
	const base = {
		id: createId('step'),
		subModuleId,
		title: 'Новый урок',
		description: '',
		order,
		estimatedDurationMinutes: undefined,
		isFreePreview: false,
		status: 'draft' as ContentStatus,
	}

	if (stepType === 'Content') return { stepType, ...base, body: '' }
	if (stepType === 'Video') return { stepType, ...base, videoUrl: '', durationSeconds: 0 }
	return {
		stepType,
		...base,
		questions: [createQuestion()],
		passingScorePercent: 70,
		allowRetake: true,
		timeLimitSeconds: undefined,
	}
}

const CustomContentCkEditor = dynamic(() => import('@/src/components/CustomContentCkEditor'), {
	ssr: false,
	loading: () => <div className='h-[300px] w-full animate-pulse rounded-lg bg-slate-100' />,
})

type FormProps = {
	course: Course
	subModule: SubModule
	courseSlug: string
	moduleId: string
	stepNumber: string
	onDirtyChange: (isDirty: boolean) => void
	onSaved: (saved: SubModule) => void
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
	<label className='flex flex-col gap-1 text-sm font-medium text-slate-700'>
		{label}
		{children}
	</label>
)

const inputClass = 'h-10 rounded-lg border border-slate-300 px-3 text-sm font-normal focus:border-color_brand_primary'
const textareaClass = 'min-h-24 rounded-lg border border-slate-300 p-3 text-sm font-normal focus:border-color_brand_primary'

const SubmoduleEditorForm = ({ course, subModule, courseSlug, moduleId, stepNumber, onDirtyChange, onSaved }: FormProps) => {
	const router = useRouter()
	const [draft, setDraft] = useState<SubModule>(() => clone(subModule))
	const [newStepType, setNewStepType] = useState<StepType>('Content')
	const [saving, setSaving] = useState(false)
	const [saveError, setSaveError] = useState<string | null>(null)

	const [activeStepIndex, setActiveStepIndex] = useState<number>(() => {
		const num = Number(stepNumber)
		return Number.isInteger(num) && num > 0 ? num - 1 : 0
	})

	const selectedStepIndex = draft.steps.length === 0
		? -1
		: Math.min(activeStepIndex, draft.steps.length - 1)
	const selectedStep = selectedStepIndex === -1 ? undefined : draft.steps[selectedStepIndex]
	const stepHref = (number: number) => `/courses/edit-lesson/${subModule.id}/step/${number}`

	useEffect(() => {
		onDirtyChange(JSON.stringify(draft) !== JSON.stringify(subModule))
	}, [draft, onDirtyChange, subModule])

	useEffect(() => () => onDirtyChange(false), [onDirtyChange])

	const navigateToStep = (index: number) => {
		setActiveStepIndex(index)
		window.history.replaceState(null, '', stepHref(index + 1))
	}

	const setMetadata = (key: 'title' | 'description' | 'estimatedDurationMinutes', value: string) => {
		setDraft((current) => ({
			...current,
			[key]: key === 'estimatedDurationMinutes' ? (value === '' ? undefined : Number(value)) : value,
		}))
	}

	const updateStep = (stepId: string, updater: (step: Step) => Step) => {
		setDraft((current) => ({
			...current,
			steps: current.steps.map((step) => (step.id === stepId ? updater(step) : step)),
		}))
	}

	const moveStep = (index: number, direction: -1 | 1) => {
		const destination = index + direction
		if (destination < 0 || destination >= draft.steps.length) return
		setDraft((current) => {
			const steps = [...current.steps]
			;[steps[index], steps[destination]] = [steps[destination], steps[index]]
			return { ...current, steps: normalizeSteps(steps) }
		})
		navigateToStep(destination)
	}

	const addStep = () => {
		const nextStepNumber = draft.steps.length + 1
		const step = createStep(newStepType, draft.id, nextStepNumber)

		setDraft((current) => ({
			...current,
			steps: [...current.steps, step],
		}))

		navigateToStep(nextStepNumber - 1)
	}

	const deleteSelectedStep = () => {
		if (!selectedStep || !window.confirm('Удалить урок?')) return
		const steps = normalizeSteps(draft.steps.filter((step) => step.id !== selectedStep.id))
		setDraft((current) => ({ ...current, steps }))
		const nextIndex = steps.length === 0 ? 0 : Math.min(selectedStepIndex, steps.length - 1)
		navigateToStep(nextIndex)
	}

	const updateQuestion = (stepId: string, questionId: string, updater: (question: QuizQuestion) => QuizQuestion) => {
		updateStep(stepId, (step) => {
			if (step.stepType !== 'Quiz') return step
			return {
				...step,
				questions: step.questions.map((question) => question.id === questionId ? updater(question) : question),
			}
		})
	}

	const changeQuestionType = (stepId: string, question: QuizQuestion, type: QuizQuestion['type']) => {
		const options = type === 'short-answer'
			? undefined
			: type === 'true-false'
				? [{ id: createId('option'), text: 'Верно' }, { id: createId('option'), text: 'Неверно' }]
				: question.options?.length ? question.options : [{ id: createId('option'), text: '' }, { id: createId('option'), text: '' }]
		updateQuestion(stepId, question.id, (current) => ({
			...current,
			type,
			options,
			correctOptionIds: type === 'short-answer' ? undefined : [],
			correctAnswer: type === 'short-answer' ? '' : undefined,
		}))
	}

const save = async () => {
		const invalidVideo = draft.steps.some((step) => step.stepType === 'Video' && step.durationSeconds <= 0)
		if (invalidVideo) {
			window.alert('Для видеоуроков укажите длительность в секундах.')
			return
		}

		const payload = { ...draft, steps: normalizeSteps(draft.steps) }

		setSaving(true)
		setSaveError(null)
		try {
			const saved = await syncSubModuleApi(payload)
			setDraft(saved)
			onDirtyChange(false)
			onSaved(saved)
		} catch (err) {
			console.error('Error saving submodule:', err)
			setSaveError(err instanceof Error ? err.message : 'Не удалось сохранить изменения')
		} finally {
			setSaving(false)
		}
	}

	return (
		<section className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
			<div className='flex flex-wrap items-start justify-between gap-4'>
				<div>
					<h2 className='text-lg font-semibold text-slate-900'>Редактирование подраздела</h2>
					<p className='mt-1 text-sm text-slate-500'>Изменения сохраняются только после нажатия «Сохранить».</p>
					{saveError && <p className='mt-1 text-sm text-red-500'>Ошибка: {saveError}</p>}
				</div>
				<div className='flex gap-3'>
					<Button variant='outlined' disabled={saving} onClick={() => {
						onDirtyChange(false)
						router.push(`/courses/${courseSlug}/content`)
					}}>Отмена</Button>
					<Button onClick={save} disabled={saving}>{saving ? 'Сохранение…' : 'Сохранить'}</Button>
				</div>
			</div>

			<div className='mt-6 grid gap-4 md:grid-cols-2'>
				<Field label='Название подраздела'><input className={inputClass} value={draft.title} onChange={(event) => setMetadata('title', event.target.value)} /></Field>
				<Field label='Оценочная длительность (мин.)'><input className={inputClass} type='number' min='0' value={draft.estimatedDurationMinutes ?? ''} onChange={(event) => setMetadata('estimatedDurationMinutes', event.target.value)} /></Field>
				<div className='md:col-span-2'><Field label='Описание (необязательно)'><textarea className={textareaClass} value={draft.description ?? ''} onChange={(event) => setMetadata('description', event.target.value)} /></Field></div>
			</div>

			<div className='mt-8 flex flex-wrap items-end gap-3 border-t border-slate-200 pt-6'>
				<Field label='Тип нового урока'>
					<select className={inputClass} value={newStepType} onChange={(event) => setNewStepType(event.target.value as StepType)}>
						<option value='Content'>Контент</option><option value='Video'>Видео</option><option value='Quiz'>Тест</option>
					</select>
				</Field>
				<Button onClick={addStep}>Добавить урок</Button>
			</div>

			{draft.steps.length > 0 && (
				<div className='mt-5 flex flex-wrap gap-2' aria-label='Шаги урока'>
					{draft.steps.map((step, index) => (
						<button
							key={step.id}
							type='button'
							onClick={() => navigateToStep(index)}
							className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${selectedStepIndex === index ? 'bg-color_brand_primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
						>
							Шаг {index + 1}
						</button>
					))}
				</div>
			)}

			<div className='mt-5 space-y-5'>
				{selectedStep && (
					(() => {
						const step = selectedStep
						const index = selectedStepIndex
						return (
					<article key={step.id} className='rounded-xl border border-slate-200 p-4'>
						<div className='flex flex-wrap items-center gap-2'>
							<span className='text-sm font-semibold text-slate-500'>{index + 1}.</span>
							<span className='rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600'>{step.stepType}</span>
							<div className='ml-auto flex gap-2'>
								<Button size='sm' onClick={() => moveStep(index, -1)} disabled={index === 0}>↑</Button>
								<Button size='sm' onClick={() => moveStep(index, 1)} disabled={index === draft.steps.length - 1}>↓</Button>
								<Button size='sm' variant='outlined' onClick={deleteSelectedStep}>Удалить</Button>
							</div>
						</div>

						<div className='mt-4 grid gap-4 md:grid-cols-2'>
							<Field label='Название'><input className={inputClass} value={step.title} onChange={(event) => updateStep(step.id, (current) => ({ ...current, title: event.target.value } ))} /></Field>
							<Field label='Статус'><select className={inputClass} value={step.status} onChange={(event) => updateStep(step.id, (current) => ({ ...current, status: event.target.value as ContentStatus  }))}><option value='draft'>Черновик</option><option value='published'>Опубликован</option><option value='archived'>Архив</option></select></Field>
							<Field label='Оценочная длительность (мин.)'><input className={inputClass} type='number' min='0' value={step.estimatedDurationMinutes ?? ''} onChange={(event) => updateStep(step.id, (current) => ({ ...current, estimatedDurationMinutes: event.target.value === '' ? undefined : Number(event.target.value) }))} /></Field>
							<label className='flex items-center gap-2 self-end pb-2 text-sm text-slate-700'><input type='checkbox' checked={step.isFreePreview ?? false} onChange={(event) => updateStep(step.id, (current) => ({ ...current, isFreePreview: event.target.checked } ))} />Бесплатный предпросмотр</label>
							<div className='md:col-span-2'><Field label='Описание (необязательно)'><textarea className={textareaClass} value={step.description ?? ''} onChange={(event) => updateStep(step.id, (current) => ({ ...current, description: event.target.value } ))} /></Field></div>
						</div>

						{step.stepType === 'Content' && (
							<div className='mt-4'>
								<label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
									Текст урока
								</label>
								<CustomContentCkEditor
									value={step.body}
									onChange={(data) =>
										updateStep(step.id, (current) =>
											current.stepType === 'Content' ? { ...current, body: data } : current
										)
									}
								/>
							</div>
						)}
						{step.stepType === 'Video' && <div className='mt-4 grid gap-4 md:grid-cols-2'><Field label='URL видео'><input className={inputClass} type='url' value={step.videoUrl} onChange={(event) => updateStep(step.id, (current) => current.stepType === 'Video' ? { ...current, videoUrl: event.target.value } : current)} /></Field><Field label='Длительность (сек., обязательно)'><input className={inputClass} type='number' min='1' required value={step.durationSeconds || ''} onChange={(event) => updateStep(step.id, (current) => current.stepType === 'Video' ? { ...current, durationSeconds: Number(event.target.value) } : current)} /></Field></div>}
						{step.stepType === 'Quiz' && <QuizEditor step={step} updateStep={updateStep} updateQuestion={updateQuestion} changeQuestionType={changeQuestionType} />}
					</article>
						)
					})()
				)}
				{draft.steps.length === 0 && <p className='rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-500'>В этом подразделе пока нет уроков.</p>}
			</div>
		</section>
	)
}

type QuizEditorProps = { step: QuizStep; updateStep: (stepId: string, updater: (step: Step) => Step) => void; updateQuestion: (stepId: string, questionId: string, updater: (question: QuizQuestion) => QuizQuestion) => void; changeQuestionType: (stepId: string, question: QuizQuestion, type: QuizQuestion['type']) => void }

const QuizEditor = ({ step, updateStep, updateQuestion, changeQuestionType }: QuizEditorProps) => (
	<div className='mt-5 border-t border-slate-200 pt-4'>
		<div className='grid gap-4 md:grid-cols-3'>
			<Field label='Проходной балл (%)'><input className={inputClass} type='number' min='0' max='100' value={step.passingScorePercent} onChange={(event) => updateStep(step.id, (current) => current.stepType === 'Quiz' ? { ...current, passingScorePercent: Number(event.target.value) } : current)} /></Field>
			<Field label='Лимит времени (сек., необязательно)'><input className={inputClass} type='number' min='1' value={step.timeLimitSeconds ?? ''} onChange={(event) => updateStep(step.id, (current) => current.stepType === 'Quiz' ? { ...current, timeLimitSeconds: event.target.value === '' ? undefined : Number(event.target.value) } : current)} /></Field>
			<label className='flex items-center gap-2 self-end pb-2 text-sm text-slate-700'><input type='checkbox' checked={step.allowRetake} onChange={(event) => updateStep(step.id, (current) => current.stepType === 'Quiz' ? { ...current, allowRetake: event.target.checked } : current)} />Разрешить повторную попытку</label>
		</div>
		<div className='mt-5 space-y-4'>
			{step.questions.map((question, index) => <QuestionEditor key={question.id} question={question} number={index + 1} stepId={step.id} updateQuestion={updateQuestion} changeQuestionType={changeQuestionType} remove={() => updateStep(step.id, (current) => current.stepType === 'Quiz' ? { ...current, questions: current.questions.filter((item) => item.id !== question.id) } : current)} />)}
			<Button size='sm' variant='outlined' onClick={() => updateStep(step.id, (current) => current.stepType === 'Quiz' ? { ...current, questions: [...current.questions, createQuestion()] } : current)}>Добавить вопрос</Button>
		</div>
	</div>
)

type QuestionEditorProps = { question: QuizQuestion; number: number; stepId: string; updateQuestion: QuizEditorProps['updateQuestion']; changeQuestionType: QuizEditorProps['changeQuestionType']; remove: () => void }

const QuestionEditor = ({ question, number, stepId, updateQuestion, changeQuestionType, remove }: QuestionEditorProps) => {
	const optionQuestion = question.type !== 'short-answer'
	const isMultiple = question.type === 'multi-choice'
	const updateCorrect = (optionId: string, checked: boolean) => updateQuestion(stepId, question.id, (current) => ({ ...current, correctOptionIds: isMultiple ? (checked ? [...(current.correctOptionIds ?? []), optionId] : (current.correctOptionIds ?? []).filter((id) => id !== optionId)) : (checked ? [optionId] : []) }))
	return <div className='rounded-lg bg-slate-50 p-4'>
		<div className='flex flex-wrap gap-3'><span className='pt-2 text-sm font-semibold text-slate-600'>Вопрос {number}</span><input className={`${inputClass} min-w-48 flex-1`} placeholder='Текст вопроса' value={question.prompt} onChange={(event) => updateQuestion(stepId, question.id, (current) => ({ ...current, prompt: event.target.value }))} /><select className={inputClass} value={question.type} onChange={(event) => changeQuestionType(stepId, question, event.target.value as QuizQuestion['type'])}><option value='single-choice'>Один вариант</option><option value='multi-choice'>Несколько вариантов</option><option value='true-false'>Верно / неверно</option><option value='short-answer'>Короткий ответ</option></select><input className={`${inputClass} w-24`} type='number' min='0' value={question.points} aria-label='Баллы' onChange={(event) => updateQuestion(stepId, question.id, (current) => ({ ...current, points: Number(event.target.value) }))} /><Button size='sm' variant='outlined' onClick={remove}>Удалить</Button></div>
		{optionQuestion ? <div className='mt-3 space-y-2'>{(question.options ?? []).map((option) => <div key={option.id} className='flex items-center gap-2'><input type={isMultiple ? 'checkbox' : 'radio'} name={isMultiple ? undefined : question.id} checked={(question.correctOptionIds ?? []).includes(option.id)} onChange={(event) => updateCorrect(option.id, event.target.checked)} /><input className={`${inputClass} flex-1`} value={option.text} disabled={question.type === 'true-false'} onChange={(event) => updateQuestion(stepId, question.id, (current) => ({ ...current, options: current.options?.map((item) => item.id === option.id ? { ...item, text: event.target.value } : item) }))} />{question.type !== 'true-false' && <Button size='sm' variant='outlined' onClick={() => updateQuestion(stepId, question.id, (current) => ({ ...current, options: current.options?.filter((item) => item.id !== option.id), correctOptionIds: current.correctOptionIds?.filter((id) => id !== option.id) }))}>×</Button>}</div>)}{question.type !== 'true-false' && <Button size='sm' variant='outlined' onClick={() => updateQuestion(stepId, question.id, (current) => ({ ...current, options: [...(current.options ?? []), { id: createId('option'), text: '' }] }))}>Добавить вариант</Button>}</div> : <div className='mt-3'><Field label='Правильный ответ'><input className={inputClass} value={question.correctAnswer ?? ''} onChange={(event) => updateQuestion(stepId, question.id, (current) => ({ ...current, correctAnswer: event.target.value }))} /></Field></div>}
	</div>
}

export const SubmoduleEditor = ({ lessonId, stepNumber }: { lessonId: string; stepNumber: string }) => {
	const [subModule, setSubModule] = useState<SubModule | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

	useEffect(() => {
		let mounted = true
		setLoading(true)
		setError(null)

		fetchSubModuleSyncApi(lessonId)
			.then((data) => {
				if (!mounted) return
				if (!data) {
					setError('No submodule data found')
					setLoading(false)
					return
				}
				setSubModule(data)
				setLoading(false)
			})
			.catch((err) => {
				if (mounted) {
					console.error('Error loading submodule:', err)
					setError(err?.message || 'Failed to fetch submodule')
					setLoading(false)
				}
			})

		return () => {
			mounted = false
		}
	}, [lessonId])

	if (loading) return <p className='rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500'>Загрузка подраздела...</p>

	if (error) return <p className='rounded-xl border border-slate-200 bg-white p-6 text-sm text-red-500'>Ошибка: {error}</p>

	if (!subModule) return <p className='rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500'>Подраздел не найден.</p>

	// PLACEHOLDER: EditorSyllabusNavigator + updateCourse() below still expect a
	// full Course tree (other modules, other sub-modules, slug, title). Fetching
	// only this SubModule means we don't have that data. This shell has just
	// enough shape for the components to render without crashing, but the
	// navigator will only ever show this one module/sub-module, "Отмена" routes
	// by moduleId instead of a real slug, and updateCourse() will overwrite the
	// course's `modules` array with only this one module -- silently discarding
	// any other modules/sub-modules already saved locally for this course.
	// This needs either: (a) a real endpoint returning the course shell
	// (id/slug/title + module/sub-module list, without full step bodies), or
	// (b) passing courseSlug/full course down as route/query params instead of
	// fetching it here. Let me know which and I'll wire it in properly.
	const course: Course = {
		id: subModule.moduleId,
		title: '',
		slug: subModule.moduleId,
		updatedAt: new Date().toISOString(),
		modules: [
			{
				id: subModule.moduleId,
				courseId: subModule.moduleId,
				title: '',
				order: 1,
				subModules: [subModule],
			},
		],
	} as unknown as Course

	return (
		<section>
			<div className='mb-6'>
				<p className='text-sm text-slate-500'>Курсы / {course.title} / Содержание</p>
				<h1 className='mt-2 text-2xl font-semibold text-slate-900'>{course.title}</h1>
			</div>
			<div className='flex items-start gap-6'>
				<EditorSyllabusNavigator
					course={course}
					activeSubmoduleId={subModule.id}
					hasUnsavedChanges={hasUnsavedChanges}
					onDiscardDraft={() => setHasUnsavedChanges(false)}
				/>
				<div className='min-w-0 flex-1'>
					<SubmoduleEditorForm
						key={`${subModule.id}-${stepNumber}`}
						course={course}
						subModule={subModule}
						courseSlug={course.slug}
						moduleId={subModule.moduleId}
						stepNumber={stepNumber}
						onDirtyChange={setHasUnsavedChanges}
						onSaved={setSubModule}
					/>
				</div>
			</div>
		</section>
	)
}