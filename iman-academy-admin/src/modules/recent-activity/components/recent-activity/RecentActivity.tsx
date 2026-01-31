'use client'

import Link from 'next/link'

type Activity = {
	id: string
	student: string
	course: string
	progress: number
	lastLogin: string
}

const ACTIVITIES: Activity[] = [
	{
		id: '1',
		student: 'Аскар Акаев',
		course: 'Основы акъыда',
		progress: 88,
		lastLogin: 'Сегодня, 11:20',
	},
	{
		id: '2',
		student: 'Курманбек Бакиев',
		course: 'Фикх: очищение и намаз',
		progress: 88,
		lastLogin: 'Вчера, 21:03',
	},
	{
		id: '3',
		student: 'Алмаз Шаршенович',
		course: 'Чтение Корана с таджвидом',
		progress: 88,
		lastLogin: '01.12.2025, 10:25',
	},
	{
		id: '4',
		student: 'Сооронбай Жээнбеков',
		course: 'Арабский язык',
		progress: 88,
		lastLogin: '01.12.2025, 20:45',
	},
]

export const RecentActivity = () => {
	return (
		<section className='mt-5 shadow-[0_1px_3px_1px_rgba(0,0,0,0.15),_0_1px_2px_0_rgba(0,0,0,0.30)] rounded-xl border border-color_border_light bg-color_bg_white p-5'>
			<div className='border-b border-color_border_light flex items-center justify-between py-[10px]'>
				<div>
					<h2 className='headline-table'>Последняя активность</h2>
					<p className='mt-1 text-color_text_secondary body'>
						Новые студенты и завершённые уроки
					</p>
				</div>

				<Link
					href='/students'
					className='text-sm font-medium text-color_system_blue hover:underline'
				>
					Перейти в список студентов
				</Link>
			</div>

			<div className='mt-6 overflow-x-auto'>
				<table className='w-full border-collapse text-sm'>
					<thead>
						<tr className='border-b border-color_border_light text-left bg-color_bg_gray'>
							<th className='w-10 py-[11px]'>
								<input type='checkbox' className='h-4 w-4' />
							</th>
							<th className='py-[11px] font-medium'>Студент</th>
							<th className='py-[11px] font-medium'>Курс</th>
							<th className='py-[11px] font-medium'>Прогресс</th>
							<th className='py-[11px] font-medium'>Последний вход</th>
							<th className='py-[11px] font-medium'>Действия</th>
						</tr>
					</thead>

					<tbody>
						{ACTIVITIES.map((item) => (
							<tr
								key={item.id}
								className='border-b border-color_border_light last:border-b-0'
							>
								<td className='py-4'>
									<input type='checkbox' className='h-4 w-4' />
								</td>

								<td className='py-4'>
									<span className='supporting'>{item.student}</span>
								</td>

								<td className='py-4'>
									<span className='supporting'>{item.course}</span>
								</td>

								<td className='py-4'>
									<div className='flex items-center gap-3'>
										<div className='h-2 w-32 rounded-full bg-color_bg_gray'>
											<div
												className='h-2 rounded-full bg-color_system_green'
												style={{ width: `${item.progress}%` }}
											/>
										</div>
										<span className='supporting'>
											{item.progress}%
										</span>
									</div>
								</td>

								<td className='py-4'>
									<span className='supporting'>{item.lastLogin}</span>
								</td>

								<td className='py-4'>
									<button className='rounded-full bg-color_system_blue px-5 py-2 text-xs font-medium text-color_text_white hover:bg-color_button_hover'>
										Карточка студента
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</section>
	)
}
