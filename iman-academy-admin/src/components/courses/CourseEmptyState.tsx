'use client'

import Link from 'next/link'
import { Button } from '@/src/components/ui/Button'
import { PlusIcon } from '@/src/components/icons/PlusIcon'
import { SearchIcon } from '@/src/components/icons/SearchIcon'

type CourseEmptyStateProps = {
	hasCourses: boolean
	onResetFilters: () => void
}

export const CourseEmptyState = ({
	hasCourses,
	onResetFilters,
}: CourseEmptyStateProps) => {
	return (
		<div className='p-12 text-center'>
			<div className='mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400'>
				<SearchIcon className='h-7 w-7' />
			</div>
			<h3 className='mt-4 text-base font-semibold text-slate-900'>
				{!hasCourses ? 'Курсов пока нет' : 'Ничего не найдено'}
			</h3>
			<p className='mt-1 text-sm text-slate-500'>
				{!hasCourses
					? 'Создайте первый курс, чтобы начать наполнение материалами и уроками.'
					: 'Попробуйте изменить поисковый запрос или сбросить активные фильтры.'}
			</p>
			<div className='mt-5 flex justify-center gap-3'>
				{!hasCourses ? (
					<Link href='/courses/create'>
						<Button className='flex items-center gap-2'>
							<PlusIcon className='h-5 w-5' />
							<span>Создать первый курс</span>
						</Button>
					</Link>
				) : (
					<Button variant='outlined' onClick={onResetFilters}>
						Сбросить фильтры
					</Button>
				)}
			</div>
		</div>
	)
}