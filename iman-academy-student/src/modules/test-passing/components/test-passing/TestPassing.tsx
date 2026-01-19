'use client'

import { cn } from '@/src/lib/cn'
import Image from 'next/image'
import { useState } from 'react'

type Answer = {
	id: string
	text: string
}

type Question = {
	id: number
	question: string
	answers: Answer[]
	correctAnswerId: string
}

const QUESTIONS: Question[] = [
	{
		id: 1,
		question: 'Как называется первая сура Священного Корана?',
		answers: [
			{ id: 'a', text: 'Аль-Бакара' },
			{ id: 'b', text: 'Аль-Фатиха' },
			{ id: 'c', text: 'Ан-Нас' },
			{ id: 'd', text: 'Аль-Ихляс' },
		],
		correctAnswerId: 'b',
	},
	{
		id: 2,
		question: 'Сколько сур содержит Священный Коран?',
		answers: [
			{ id: 'a', text: '112' },
			{ id: 'b', text: '113' },
			{ id: 'c', text: '114' },
			{ id: 'd', text: '115' },
		],
		correctAnswerId: 'c',
	},
	{
		id: 3,
		question:
			'В каком городе было ниспослано первое откровение Пророку Мухаммаду ﷺ?',
		answers: [
			{ id: 'a', text: 'Медина' },
			{ id: 'b', text: 'Мекка' },
			{ id: 'c', text: 'Иерусалим' },
			{ id: 'd', text: 'Таиф' },
		],
		correctAnswerId: 'b',
	},
	{
		id: 4,
		question: 'Как называется пятая обязательная молитва (намаз)?',
		answers: [
			{ id: 'a', text: 'Фаджр' },
			{ id: 'b', text: 'Зухр' },
			{ id: 'c', text: 'Аср' },
			{ id: 'd', text: 'Иша' },
		],
		correctAnswerId: 'd',
	},
	{
		id: 5,
		question: 'Сколько обязательных ежедневных намазов в Исламе?',
		answers: [
			{ id: 'a', text: '3' },
			{ id: 'b', text: '4' },
			{ id: 'c', text: '5' },
			{ id: 'd', text: '6' },
		],
		correctAnswerId: 'c',
	},
	{
		id: 6,
		question: 'Как называется пост в месяц Рамадан?',
		answers: [
			{ id: 'a', text: 'Закят' },
			{ id: 'b', text: 'Саум' },
			{ id: 'c', text: 'Хадж' },
			{ id: 'd', text: 'Дуа' },
		],
		correctAnswerId: 'b',
	},
	{
		id: 7,
		question: 'Какой ангел передавал откровения Пророку ﷺ?',
		answers: [
			{ id: 'a', text: 'Микаиль' },
			{ id: 'b', text: 'Исрафиль' },
			{ id: 'c', text: 'Азраиль' },
			{ id: 'd', text: 'Джибриль' },
		],
		correctAnswerId: 'd',
	},
	{
		id: 8,
		question: 'Как называется обязательная милостыня в Исламе?',
		answers: [
			{ id: 'a', text: 'Садака' },
			{ id: 'b', text: 'Закят' },
			{ id: 'c', text: 'Фидья' },
			{ id: 'd', text: 'Удхия' },
		],
		correctAnswerId: 'b',
	},
	{
		id: 9,
		question: 'В каком месяце мусульмане соблюдают обязательный пост?',
		answers: [
			{ id: 'a', text: 'Мухаррам' },
			{ id: 'b', text: 'Шавваль' },
			{ id: 'c', text: 'Рамадан' },
			{ id: 'd', text: 'Зуль-хиджа' },
		],
		correctAnswerId: 'c',
	},
	{
		id: 10,
		question: 'Как называется паломничество в Мекку?',
		answers: [
			{ id: 'a', text: 'Умра' },
			{ id: 'b', text: 'Сафа' },
			{ id: 'c', text: 'Хадж' },
			{ id: 'd', text: 'Ихрам' },
		],
		correctAnswerId: 'c',
	},
	{
		id: 11,
		question: 'Сколько столпов Ислама существует?',
		answers: [
			{ id: 'a', text: '3' },
			{ id: 'b', text: '4' },
			{ id: 'c', text: '5' },
			{ id: 'd', text: '6' },
		],
		correctAnswerId: 'c',
	},
	{
		id: 12,
		question:
			'Как называется направление, в сторону которого совершается намаз?',
		answers: [
			{ id: 'a', text: 'Кааба' },
			{ id: 'b', text: 'Кибла' },
			{ id: 'c', text: 'Масджид' },
			{ id: 'd', text: 'Михраб' },
		],
		correctAnswerId: 'b',
	},
	{
		id: 13,
		question: 'Как называется дом поклонения у мусульман?',
		answers: [
			{ id: 'a', text: 'Храм' },
			{ id: 'b', text: 'Церковь' },
			{ id: 'c', text: 'Синагога' },
			{ id: 'd', text: 'Мечеть' },
		],
		correctAnswerId: 'd',
	},
	{
		id: 14,
		question: 'Как называется священный дом в Мекке?',
		answers: [
			{ id: 'a', text: 'Масджид ан-Набави' },
			{ id: 'b', text: 'Аль-Акса' },
			{ id: 'c', text: 'Кааба' },
			{ id: 'd', text: 'Мина' },
		],
		correctAnswerId: 'c',
	},
	{
		id: 15,
		question: 'Какая сура является самой короткой в Коране?',
		answers: [
			{ id: 'a', text: 'Аль-Каусар' },
			{ id: 'b', text: 'Аль-Фаляк' },
			{ id: 'c', text: 'Ан-Нас' },
			{ id: 'd', text: 'Аль-Ихляс' },
		],
		correctAnswerId: 'a',
	},
	{
		id: 16,
		question: 'Как называется вера в Единого Аллаха?',
		answers: [
			{ id: 'a', text: 'Шариат' },
			{ id: 'b', text: 'Иман' },
			{ id: 'c', text: 'Таухид' },
			{ id: 'd', text: 'Фикх' },
		],
		correctAnswerId: 'c',
	},
]

export const TestPassing = () => {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
	const [answers, setAnswers] = useState<Record<number, string>>({})
	const [isFinished, setIsFinished] = useState(false)

	const currentQuestion = QUESTIONS[currentQuestionIndex]

	const answeredCount = Object.keys(answers).length
	const progress = Math.round((answeredCount / QUESTIONS.length) * 100)

	const handleAnswerSelect = (answerId: string) => {
		setAnswers((prev) => ({
			...prev,
			[currentQuestion.id]: answerId,
		}))
	}

	const correctAnswersCount = QUESTIONS.filter(
		(q) => answers[q.id] === q.correctAnswerId
	).length

	if (isFinished) {
		return (
			<section className='bg-[#FFFCF6] pb-8'>
				<div className='mx-auto max-w-[600px] rounded-[20px] bg-white p-[40px] text-center shadow'>
					<h2 className='mb-[16px] text-[24px] font-semibold'>
						Тест завершён
					</h2>
					<p className='text-[16px]'>
						Правильных ответов: {correctAnswersCount} из&nbsp;
						{QUESTIONS.length}
					</p>
				</div>
			</section>
		)
	}

	return (
		<section className='py-8'>
			<div className='mb-[32px]'>
				<div className='mb-[8px] flex justify-between text-[14px] text-[#8A8A8A]'>
					<span>Процесс</span>
					<span>{progress}%</span>
				</div>
				<div className='h-[8px] rounded-full bg-[#E6E6E6]'>
					<div
						className='h-full rounded-full bg-[#3B5BE8]'
						style={{ width: `${progress}%` }}
					/>
				</div>
			</div>
			<div className='mx-auto max-w-[1080px]'>
				<div className='border border-border_devider rounded-3xl'>
					<div className='w-full mb-12 overflow-hidden rounded-3xl'>
						<Image
							width={1077}
							height={347}
							src='https://placehold.co/1077x347.png'
							alt='Test cover'
							className='w-full object-cover'
						/>
					</div>
					<div className='rounded-[20px]'>
						<h2 className='mb-[24px] text-center text-[22px] font-semibold'>
							{currentQuestion.question}
						</h2>

						<div className='mx-auto mb-[32px] flex max-w-[520px] flex-col gap-[12px]'>
							{currentQuestion.answers.map((answer) => {
								const isSelected =
									answers[currentQuestion.id] === answer.id
								return (
									<button
										key={answer.id}
										onClick={() => handleAnswerSelect(answer.id)}
										className={cn(
											'h-[48px] rounded-[12px] border text-[14px] transition',
											isSelected
												? 'border-[#3B5BE8] bg-[#F5F7FF]'
												: 'border-[#E6E6E6]'
										)}
									>
										{answer.text}
									</button>
								)
							})}
						</div>

						<div className='mb-[40px] flex justify-center gap-[8px]'>
							{QUESTIONS.map((q, i) => {
								const isCurrent = i === currentQuestionIndex
								const isAnswered = answers[q.id]
								let bg = 'bg-secondary_text'
								if (isCurrent) bg = 'bg-system_error'
								else if (isAnswered) bg = 'bg-system_success'
								return (
									<button
										key={q.id}
										onClick={() => setCurrentQuestionIndex(i)}
										className={`h-[36px] w-[36px] rounded-[8px] text-[14px] font-medium text-white ${bg}`}
									>
										{q.id}
									</button>
								)
							})}
						</div>
					</div>
				</div>
				<div className='flex justify-end mt-10'>
					<button
						onClick={() => setIsFinished(true)}
						className='h-[44px] rounded-[10px] bg-accent_brand px-[24px] text-[14px] font-medium'
					>
						Завершить тест
					</button>
				</div>
			</div>
		</section>
	)
}
