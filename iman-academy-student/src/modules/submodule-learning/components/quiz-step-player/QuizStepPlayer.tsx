'use client'

import { Button } from '@/src/components/UI/Button'
import { cn } from '@/src/lib/cn'
import type { QuizQuestionDto, QuizStepDto } from '@/src/types/auth'
import { useState } from 'react'

export const QuizStepPlayer = ({ step }: { step: QuizStepDto }) => {
	const questions: QuizQuestionDto[] = step.questions ?? []
	const passingScore = step.passingScorePercent ?? 70
	const allowRetake = step.allowRetake ?? true

	const [currentIndex, setCurrentIndex] = useState(0)
	const [answers, setAnswers] = useState<Record<string, string[]>>({})
	const [isSubmitted, setIsSubmitted] = useState(false)

	if (questions.length === 0) {
		return (
			<div className='rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center'>
				<p className='text-secondary_text'>Вопросы для этого теста пока не добавлены.</p>
			</div>
		)
	}

	const currentQ = questions[currentIndex]
	const qKey = currentQ.id ?? String(currentIndex)
	const isMulti = currentQ.type === 'MultiChoice' || String(currentQ.type) === '1'

	const toggleOption = (key: string) => {
		if (isSubmitted) return
		setAnswers((prev) => {
			const list = prev[qKey] ?? []
			if (isMulti) {
				return { ...prev, [qKey]: list.includes(key) ? list.filter((i) => i !== key) : [...list, key] }
			}
			return { ...prev, [qKey]: [key] }
		})
	}

	let earned = 0
	let total = 0
	let correctCount = 0

	questions.forEach((q, idx) => {
		const key = q.id ?? String(idx)
		const userSel = answers[key] ?? []
		const pts = q.points > 0 ? q.points : 1
		total += pts
		const correctKeys = q.options.filter((o) => o.isCorrect).map((o) => o.id ?? o.text)
		let ok = false
		if (correctKeys.length > 0) {
			ok = userSel.length === correctKeys.length && userSel.every((k) => correctKeys.includes(k))
		} else if (q.correctAnswer) {
			ok = userSel[0]?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()
		}
		if (ok) {
			earned += pts
			correctCount += 1
		}
	})

	const scorePercent = total > 0 ? Math.round((earned / total) * 100) : 0
	const isPassed = scorePercent >= passingScore

	if (isSubmitted) {
		return (
			<div className='rounded-2xl border border-[#E6E8EC] bg-white p-8 text-center shadow-sm'>
				<div className={cn('mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold', isPassed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
					{isPassed ? '✓' : '✕'}
				</div>
				<h3 className='h3 text-primary_text'>{isPassed ? 'Тест успешно пройден!' : 'Тест не пройден'}</h3>
				<p className='mt-2 text-sm text-secondary_text'>
					{isPassed ? 'Отличный результат!' : `Проходной балл: ${passingScore}%. Ваш результат: ${scorePercent}%.`}
				</p>
				<div className='my-6 grid grid-cols-2 gap-4 max-w-xs mx-auto'>
					<div className='rounded-xl bg-gray-50 p-3 border border-gray-100'>
						<span className='block text-xs text-secondary_text'>Правильно</span>
						<span className='text-base font-bold text-primary_text'>{correctCount} из {questions.length}</span>
					</div>
					<div className='rounded-xl bg-gray-50 p-3 border border-gray-100'>
						<span className='block text-xs text-secondary_text'>Результат</span>
						<span className={cn('text-base font-bold', isPassed ? 'text-green-600' : 'text-red-600')}>{scorePercent}%</span>
					</div>
				</div>
				{allowRetake && (
					<Button variant='contained' onClick={() => { setAnswers({}); setIsSubmitted(false); setCurrentIndex(0); }} className='px-6'>
						Пройти заново
					</Button>
				)}
			</div>
		)
	}

	const answered = Object.keys(answers).filter((k) => (answers[k] ?? []).length > 0).length
	const progress = Math.round((answered / questions.length) * 100)

	return (
		<div className='space-y-6'>
			<div>
				<div className='mb-2 flex items-center justify-between text-xs text-secondary_text'>
					<span>Вопрос {currentIndex + 1} из {questions.length}</span>
					<span>Заполнено: {progress}%</span>
				</div>
				<div className='h-2 w-full rounded-full bg-gray-100'>
					<div className='h-full rounded-full bg-[#2563EB] transition-all' style={{ width: `${progress}%` }} />
				</div>
			</div>
			<div className='flex flex-wrap gap-2'>
				{questions.map((q, idx) => {
					const k = q.id ?? String(idx)
					const hasAns = (answers[k] ?? []).length > 0
					return (
						<button
							key={k}
							type='button'
							onClick={() => setCurrentIndex(idx)}
							className={cn('h-8 w-8 rounded-lg text-xs font-semibold', idx === currentIndex ? 'bg-[#2563EB] text-white' : hasAns ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700')}
						>
							{idx + 1}
						</button>
					)
				})}
			</div>
			<div className='rounded-2xl border border-gray-100 bg-[#FAFAFC] p-6'>
				<p className='text-xs text-secondary_text mb-2'>{isMulti ? 'Выберите один или несколько ответов' : 'Выберите один правильный ответ'}</p>
				<h3 className='text-lg font-semibold text-primary_text mb-6'>{currentQ.prompt}</h3>
				<div className='space-y-3'>
					{currentQ.options.map((opt, optIdx) => {
						const optKey = opt.id ?? opt.text
						const isSel = (answers[qKey] ?? []).includes(optKey)
						return (
							<button
								key={opt.id ?? optIdx}
								type='button'
								onClick={() => toggleOption(optKey)}
								className={cn('flex w-full items-center justify-between rounded-xl border p-4 text-left text-sm transition-all', isSel ? 'border-[#2563EB] bg-blue-50 text-blue-900 font-medium' : 'border-gray-200 bg-white hover:border-gray-300')}
							>
								<span>{opt.text}</span>
								<span className={cn('flex h-5 w-5 items-center justify-center border text-xs', isMulti ? 'rounded' : 'rounded-full', isSel ? 'border-[#2563EB] bg-[#2563EB] text-white' : 'border-gray-300')}>
									{isSel && '✓'}
								</span>
							</button>
						)
					})}
				</div>
			</div>
			<div className='flex items-center justify-between pt-2'>
				<Button variant='outlined' onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))} disabled={currentIndex === 0} className='px-4'>
					← Назад
				</Button>
				{currentIndex < questions.length - 1 ? (
					<Button variant='contained' onClick={() => setCurrentIndex((p) => p + 1)} className='px-5'>Следующий →</Button>
				) : (
					<Button variant='contained' onClick={() => setIsSubmitted(true)} className='px-6'>Завершить тест</Button>
				)}
			</div>
		</div>
	)
}
