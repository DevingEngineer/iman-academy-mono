import { Button } from '@/src/components/UI/Button'
import Image from 'next/image'

export const TestPassing = () => {
	return (
		<section className='py-[48px]'>
			<div className='mx-auto max-w-[1180px]'>
				<div className='mb-[24px]'>
					<h1 className='text-[24px] font-semibold text-[#1E1E1E]'>
						Экран прохождения теста
					</h1>
					<p className='mt-[4px] text-[14px] text-[#8A8A8A]'>
						Видео / аудио / текст+ материалы и заметки
					</p>
				</div>

				<div className='mb-[32px]'>
					<div className='mb-[8px] flex items-center justify-between'>
						<span className='text-[14px] text-[#8A8A8A]'>Процесс</span>
						<span className='text-[14px] text-[#8A8A8A]'>75%</span>
					</div>

					<div className='h-[8px] w-full rounded-full bg-[#E6E6E6]'>
						<div className='h-full w-[75%] rounded-full bg-[#3B5BE8]' />
					</div>
				</div>

				<div className='border border-border_devider max-w-[1080px] w-full mx-auto rounded-3xl'>
					<div className='mb-12 overflow-hidden rounded-3xl'>
						<Image
							width={1077}
							height={347}
							src='https://placehold.co/1077x347.png'
							alt='Test cover'
							className='h-[260px] w-full object-cover'
						/>
					</div>

					<h3 className='h3 mb-[24px] text-center'>
						Как называется первая сура Священного Корана?
					</h3>

					<div className='mx-auto mb-[32px] flex max-w-[520px] flex-col gap-[12px]'>
						{[
							'A) Аль-Бакара',
							'B) Аль-Фатиха',
							'C) Ан-Нас',
							'D) Аль-Ихляс',
						].map((answer) => (
							<button
								key={answer}
								className='h-[48px] rounded-[12px] bg-white text-[14px]'
							>
								{answer}
							</button>
						))}
					</div>

					<div className='mb-[40px] flex justify-center gap-[8px]'>
						{Array.from({ length: 16 }).map((_, i) => {
							const index = i + 1

							const base =
								'h-[36px] w-[36px] rounded-[8px] text-[14px] font-medium'
							if (index === 1)
								return (
									<div
										key={index}
										className={`${base} bg-system_error text-white flex items-center justify-center`}
									>
										1
									</div>
								)
							if (index === 2)
								return (
									<div
										key={index}
										className={`${base} bg-system_success text-white flex items-center justify-center`}
									>
										2
									</div>
								)

							return (
								<div
									key={index}
									className={`${base} bg-secondary_text text-white flex items-center justify-center`}
								>
									{index}
								</div>
							)
						})}
					</div>

					<div className='flex justify-end'>
						<Button variant='contained' className='max-h-[44px] px-5'>
							Завершить тест
						</Button>
					</div>
				</div>
			</div>
		</section>
	)
}
