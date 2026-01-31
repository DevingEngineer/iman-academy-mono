import { EventItem } from './EventItem'
import { PeriodButton } from './PeriodButton'

export const SalesChart = () => {
	return (
		<div className='flex justify-between mt-5 gap-6 xl:grid-cols-[2fr_1fr]'>
			<div className='flex-1 rounded-2xl bg-color_bg_white p-6 border border-color_border_light shadow-[0_1px_3px_1px_rgba(0,0,0,0.15),_0_1px_2px_0_rgba(0,0,0,0.30)]'>
				<div className='mb-6 flex items-center justify-between'>
					<h3 className='headline-table'>Динамика продаж</h3>

					<div className='flex gap-2'>
						<PeriodButton label='7 дней' />
						<PeriodButton label='30 дней' active />
						<PeriodButton label='90 дней' />
					</div>
				</div>

				<div className='relative h-[260px]'>
					<div className='absolute left-0 top-0 flex h-full flex-col justify-between text-sm text-gray-500'>
						<span>100K</span>
						<span>80K</span>
						<span>60K</span>
						<span>40K</span>
						<span>20K</span>
					</div>

					<div className='ml-12 h-full'>
						<div className='relative h-full w-full'>
							<div className='absolute inset-0 flex flex-col justify-between'>
								{[...Array(5)].map((_, i) => (
									<div
										key={i}
										className='border-t border-dashed border-gray-300'
									/>
								))}
							</div>

							<div className='relative z-10 h-full w-full'>
								<svg
									viewBox='0 0 600 260'
									className='h-full w-full'
									preserveAspectRatio='none'
								>
									<path
										d='M0 170 L50 170 L100 120 L150 170 L200 140 L250 150 L300 70 L350 160 L400 130 L450 90 L500 110 L550 150 L600 130 L600 260 L0 260 Z'
										fill='rgba(99,102,241,0.12)'
									/>
									<path
										d='M0 170 L50 170 L100 120 L150 170 L200 140 L250 150 L300 70 L350 160 L400 130 L450 90 L500 110 L550 150 L600 130'
										fill='none'
										stroke='#1E40AF'
										strokeWidth='2.5'
									/>
								</svg>
							</div>
						</div>
					</div>
				</div>
			</div>

			<aside className='border border-color_border_light max-w-[363px] rounded-2xl bg-color_bg_white p-6 shadow-[0_1px_3px_1px_rgba(0,0,0,0.15),_0_1px_2px_0_rgba(0,0,0,0.30)]'>
				<h3 className='text-xl leading-[145%] font-medium mb-[18px]'>
					Последние события
				</h3>

				<ul>
					<EventItem
						title='Покупка — Али Ш. приобрёл “Основы акыды”'
						time='2 мин назад'
					/>
					<EventItem
						title='Публикация — Опубликован курс “Фикх для начинающих”'
						time='1 час назад'
					/>
					<EventItem
						title='Регистрация — Новый студент Жандарбек. Ж'
						time='3 часа назад'
					/>
					<EventItem
						title='Регистрация — Новый студент Жандарбек. Ж'
						time='3 часа назад'
					/>
				</ul>
			</aside>
		</div>
	)
}
