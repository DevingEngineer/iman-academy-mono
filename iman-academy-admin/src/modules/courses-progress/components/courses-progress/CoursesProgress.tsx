'use client'

import { cn } from '@/src/lib/cn'
import Link from 'next/link'

type CourseStatus = 'open' | 'finished' | 'draft'

type Course = {
	id: string
	title: string
	students: number
	progress: number
	status: CourseStatus
}

const STATUS_CONFIG: Record<
	CourseStatus,
	{ label: string; className: string }
> = {
	open: {
		label: 'Набор открыт',
		className: 'bg-color_system_green text-color_text_primary',
	},
	finished: {
		label: 'Курс завершен',
		className: 'bg-color_brand_primary text-color_text_white',
	},
	draft: {
		label: 'Черновик',
		className: 'bg-color_system_black text-color_text_white',
	},
}

const COURSES: Course[] = [
	{
		id: '1',
		title: 'Основы акыда',
		status: 'open',
		students: 120,
		progress: 88,
	},
	{
		id: '2',
		title: 'Фикх: очищение и намаз',
		status: 'open',
		students: 86,
		progress: 88,
	},
	{
		id: '3',
		title: 'Чтение Корана с таджвидом',
		status: 'finished',
		students: 54,
		progress: 88,
	},
	{
		id: '4',
		title: 'Арабский для чтения',
		status: 'draft',
		students: 32,
		progress: 88,
	},
]

export const CoursesProgress = () => {
	return (
		<section className='mt-5 shadow-[0_1px_3px_1px_rgba(0,0,0,0.15),_0_1px_2px_0_rgba(0,0,0,0.30)] rounded-xl border border-color_border_light bg-color_bg_white p-5'>
			<div className='border-b border-color_border_light flex items-center justify-between py-[10px]'>
				<div>
					<h2 className='headline-table'>Курсы и прогресс</h2>
					<p className='mt-1 text-color_text_secondary body'>
						Быстрый обзор по статусам и завершению курсов.
					</p>
				</div>

				<Link
					href='/courses'
					className='text-sm font-medium text-color_system_blue hover:underline'
				>
					Открыть все курсы
				</Link>
			</div>

			<div className='mt-6 overflow-x-auto'>
				<table className='w-full border-collapse text-sm'>
					<thead>
						<tr className='border-b border-color_border_light bg-color_bg_gray text-left'>
							<th className='w-10 py-[11px]'>
								<input type='checkbox' className='h-4 w-4' />
							</th>
							<th className='py-[11px] font-medium'>Курс</th>
							<th className='py-[11px] font-medium'>Статус</th>
							<th className='py-[11px] font-medium'>Студенты</th>
							<th className='py-[11px] font-medium'>Завершение</th>
							<th className='py-[11px] font-medium'>Действия</th>
						</tr>
					</thead>

					<tbody>
						{COURSES.map((course) => {
							const status = STATUS_CONFIG[course.status]

							return (
								<tr
									key={course.id}
									className='border-b border-color_border_light last:border-b-0'
								>
									<td className='py-4'>
										<input type='checkbox' className='h-4 w-4' />
									</td>

									<td className='py-4'>
										<span className='supporting'>{course.title}</span>
									</td>

									<td className='py-4'>
										<span
											className={cn(
												'inline-flex leading-[150%] rounded-full px-3 py-[1.5px] text-sm',
												status.className
											)}
										>
											{status.label}
										</span>
									</td>

									<td className='py-4'>
										<span className='supporting'>
											{course.students}
										</span>
									</td>

									<td className='py-4'>
										<div className='flex items-center gap-3'>
											<div className='h-2 w-32 rounded-full bg-color_bg_gray'>
												<div
													className='h-2 rounded-full bg-color_system_green'
													style={{ width: `${course.progress}%` }}
												/>
											</div>
											<span className='supporting'>
												{course.progress}%
											</span>
										</div>
									</td>

									<td className='py-4'>
										<button className='rounded-full bg-color_system_blue px-[10px] py-1 caption text-color_text_white hover:bg-color_button_hover'>
											Открыть курс
										</button>
									</td>
								</tr>
							)
						})}
					</tbody>
				</table>
			</div>
		</section>
	)
}
